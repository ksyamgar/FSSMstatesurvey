# FSSM Survey — Google Apps Script backend

Paste the code block below into the Apps Script editor **attached to your
Google Sheet** (Extensions → Apps Script). It receives each submission from
`FSSM_Survey_Form.html`, writes the answers into a "Responses" sheet
(creating headers automatically the first time), and — if any files were
attached — saves them to a Drive folder and stores the file link in the
matching cell.

See `FSSM_HTML_Form_Guide.md` for the step-by-step deployment walkthrough.

```javascript
/**
 * FSSM & URL Consolidated Survey — backend for the custom HTML form.
 * Bind this script to the Google Sheet you want to use as the database
 * (Extensions > Apps Script from inside that Sheet), then deploy it as a
 * Web App. See FSSM_HTML_Form_Guide.md for full steps.
 */

const SHEET_NAME = "Responses";          // tab name the answers are written to
const UPLOAD_FOLDER_NAME = "FSSM_Survey_Uploads"; // Drive folder auto-created for file attachments

function doGet() {
  return ContentService
    .createTextOutput("FSSM Survey backend is running.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const body = JSON.parse(e.postData.contents);
    const answers = body.answers || {};
    const files = body.files || {};

    // Save any attached files to Drive, replace the answer value with the link
    Object.keys(files).forEach(function (fieldId) {
      const fileList = files[fieldId];
      if (!fileList || !fileList.length) return;
      const links = fileList.map(function (f) { return saveFileToDrive(f); });
      answers[fieldId] = links.join(", ");
    });

    answers["Timestamp"] = body.timestamp || new Date().toISOString();
    writeRow(answers);

    return jsonOutput({ status: "ok" });
  } catch (err) {
    return jsonOutput({ status: "error", message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function writeRow(answers) {
  const sheet = getOrCreateSheet();
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  let headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].filter(String);

  // Make sure every key in this submission has a header column, in order.
  // "Timestamp" always leads; new question ids get appended at the end so
  // existing columns/data never shift.
  const desiredOrder = ["Timestamp"].concat(Object.keys(answers).filter((k) => k !== "Timestamp"));
  let changed = false;
  desiredOrder.forEach(function (key) {
    if (headers.indexOf(key) === -1) {
      headers.push(key);
      changed = true;
    }
  });
  if (headers.length === 0) { headers = desiredOrder; changed = true; }
  if (changed) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#0e7490").setFontColor("#ffffff");
    sheet.setFrozenRows(1);
  }

  const row = headers.map(function (h) { return answers[h] !== undefined ? answers[h] : ""; });
  sheet.appendRow(row);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function saveFileToDrive(fileObj) {
  const folder = getOrCreateUploadFolder();
  const bytes = Utilities.base64Decode(fileObj.data);
  const blob = Utilities.newBlob(bytes, fileObj.mimeType, fileObj.name);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function getOrCreateUploadFolder() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty("UPLOAD_FOLDER_ID");
  if (savedId) {
    try { return DriveApp.getFolderById(savedId); } catch (e) { /* fall through and recreate */ }
  }
  const existing = DriveApp.getFoldersByName(UPLOAD_FOLDER_NAME);
  const folder = existing.hasNext() ? existing.next() : DriveApp.createFolder(UPLOAD_FOLDER_NAME);
  props.setProperty("UPLOAD_FOLDER_ID", folder.getId());
  return folder;
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## What this script does automatically

- Creates a **Responses** tab in your Sheet the first time it runs, with a
  bold teal header row.
- Every question id from the form becomes its own column. If you add a new
  question to `FSSM_Survey_Script.js` later, its column appears automatically
  on the next submission — no manual edits to the Sheet needed.
- Existing columns and data never shift, even as new question columns get
  appended over time.
- File attachments (photos, DPRs, shapefiles, license/MoU copies) are saved
  into a Drive folder called **FSSM_Survey_Uploads** (created automatically
  on first use) and the response cell gets a clickable link instead of the
  raw file.
- A script lock prevents two simultaneous submissions from corrupting the
  header row.
