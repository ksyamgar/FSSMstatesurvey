# FSSM Survey — HTML form + Google Sheet backend: quick setup

The package includes **two versions of the same form** — use whichever is
easier for you:

| File | What it is |
|---|---|
| `FSSM_Survey_Form_AllInOne.html` | **Easiest option** — one file with styling and logic built in. Just open it in a browser. |
| `FSSM_Survey_Form.html` + `FSSM_Survey_Style.css` + `FSSM_Survey_Script.js` | **Same form, split into 3 files** — use this set if you'd rather edit questions in a dedicated `.js` file, or if you're hosting on a platform that expects separate assets. Keep all three together and don't rename them — the HTML loads the other two by filename. |
| `FSSM_Survey_Backend.gs.md` | Google Apps Script code — paste into your Sheet (needed either way) |

Everything below refers to `FSSM_Survey_Form_AllInOne.html` for simplicity —
if you're using the 3-file version instead, edit `FSSM_Survey_Script.js`
directly wherever it says to edit "inside the `<script>` section."

## Steps (about 10 minutes total)

**1. Create the Sheet.**
Open Google Sheets → Blank spreadsheet. Name it something like "FSSM Survey
Responses." You don't need to create any tabs or headers — the script does
that for you on first submission.

**2. Attach the backend script.**
In that Sheet: **Extensions → Apps Script**. Delete the placeholder
`function myFunction(){}` code, then copy the JavaScript code block from
`FSSM_Survey_Backend.gs.md` and paste it in. Save (Ctrl/Cmd+S).

**3. Deploy it as a Web App.**
Click **Deploy → New deployment**. Next to "Select type," click the gear
icon and choose **Web app**. Set:
- Execute as: **Me**
- Who has access: **Anyone**

Click **Deploy**, then **Authorize access** and click through the consent
screens (it will warn the app isn't verified — that's expected since it's
your own script; choose **Advanced → Go to [project name] (unsafe)** →
**Allow**). Copy the **Web app URL** it gives you — it looks like
`https://script.google.com/macros/s/XXXXXXXX/exec`.

**4. Connect the form to the script.**
Open `FSSM_Survey_Form_AllInOne.html` in any plain-text editor (Notepad,
TextEdit in plain-text mode, VS Code, etc. — not Word). Use Find (Ctrl/Cmd+F)
for:

```js
SCRIPT_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
```

Replace the placeholder text between the quotes with the URL you copied.
Save the file.

**5. Test it.**
Double-click `FSSM_Survey_Form_AllInOne.html` to open it in your browser.
Fill in a couple of fields and hit Submit. Check your Sheet — a "Responses"
tab should appear with your answer.

That's it — the form is live. Share this one `.html` file with your
surveyors (or host it — see below).

## Hosting for field surveyors

Opening the `.html` file directly from a phone/laptop works fine for
testing and even for light real-world use — since it's a single file, you
can email it, share it via WhatsApp/Drive, or drop it on a USB stick. For a
bookmarkable link instead, upload the same single file to a free static
host — GitHub Pages, Netlify Drop, or Google Sites' "embed HTML" all work,
since there's only one file to upload now.

## Editing the form later

Everything about the questions — every field, its type, its unit, its
dropdown options, whether it's required — lives inside the `<script>`
section near the bottom of `FSSM_Survey_Form_AllInOne.html` (or, if you're
using the 3-file version, in `FSSM_Survey_Script.js` directly — that one's
easier to search since it's nothing but code). You never need to touch the
visual layout/CSS to add, remove or change a question.

If you edit the 3-file version, remember to make the matching edit in
`FSSM_Survey_Form_AllInOne.html` too (and vice versa) if you want to keep
both copies in sync — they don't update each other automatically.

- **Add more States / Districts / ULBs:** find `const LOCATIONS = {` and
  add entries in the same nested shape (`State → District → [ULB names]`).
  A "Type manually" option is always available too, so nothing is ever
  blocked by a missing entry.
- **Make a question mandatory:** every question object has
  `required: false`. Find the question by its `id` (each one is commented
  with its original question number, e.g. `s1_ulb_name` = "1. Name of the
  ULB") and change it to `required: true`. It'll get a red asterisk and
  block submission until answered. Currently only the 3 header fields
  (Surveyor name, Date, State/District/ULB) are required, matching your
  original spec.
- **Add a brand-new question:** copy an existing line that matches the
  type you want (`TXT`, `NUM`, `SEL`, `CHK`, `TA`, `DATE`, `TEL`, `FILE`)
  inside the right section's `fields:` array, give it a unique `id`, and
  it'll appear on the form automatically — and get its own column in the
  Sheet the next time someone submits.
- **After editing `FSSM_Survey_Backend.gs.md`'s code in the Apps Script
  editor:** go to **Deploy → Manage deployments → Edit (pencil icon) → New
  version → Deploy**. The Web App URL stays the same, so you don't need to
  update `SCRIPT_URL` again.

## Notes on units & validation (why this avoids "wrong unit" answers)

- Every numeric question shows its expected unit right inside the input
  (₹, KLD, MLD, km, %, hours, persons, etc.) so the surveyor can't mistake
  what's being asked.
- Percentage fields cap at 0–100, year fields cap at a sane range, and phone
  fields only accept 10 digits — bad values are rejected before submission
  rather than caught later in the Sheet.
- Every field has a small **(i)** tooltip with a plain-language hint on
  format/unit, tap or click it to see it.
- Dropdowns and checkboxes are used everywhere the original blueprint gave
  a fixed set of choices, so free-text typos in things like "Yes/No" or
  "Once per day" can't happen.

## A note on file uploads

Photos, DPRs, shapefiles, license and MoU copies are uploaded directly from
the form (no separate Google sign-in needed, unlike Google Forms). They're
sent to the Apps Script backend and saved into a Drive folder called
**FSSM_Survey_Uploads**, with a link placed in the response row. Very large
photos (phone cameras often produce 5–10 MB files) will take longer to
submit on a weak mobile connection — the form warns the surveyor in-app when
a file is large, but doesn't block them from submitting.
