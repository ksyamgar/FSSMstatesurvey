/**
 * FSSM & URL Consolidated Survey — Google Form auto-builder
 * ---------------------------------------------------------
 * Builds the ENTIRE ~160-item, 4-section Google Form in one run instead of
 * clicking it together by hand.
 *
 * HOW TO USE
 * 1. Go to https://script.google.com  ->  "New project"
 * 2. Delete the placeholder "function myFunction(){}" code
 * 3. Paste this whole file in its place
 * 4. Click the ▷ Run button (function selector should say "buildForm")
 * 5. First run: Google will ask you to authorize the script (it needs
 *    permission to create a Form in your Drive) — click through "Advanced"
 *    if it warns about an unverified app; this is your own script.
 * 6. Open the execution log (View > Logs, or Ctrl+Enter) — it prints the
 *    EDIT URL (to keep working on the form) and the LIVE URL (to share
 *    with surveyors).
 *
 * NOTES
 * - Only the 3 header questions are marked Required, matching the blueprint.
 *   Add more "Required" toggles by hand afterwards if you want stricter
 *   validation in the field.
 * - File-upload questions require the respondent to be signed in with a
 *   Google account. If your account can't create file-upload items for
 *   some reason, this script automatically falls back to a text question
 *   ("paste link/URL") for that item instead of failing.
 * - Re-running buildForm() creates a NEW form each time — it does not edit
 *   an existing one.
 */

function buildForm() {
  var form = FormApp.create(
    'Faecal Sludge & Septage Management (FSSM) and Urban-Rural Linkage (URL) Consolidated Survey'
  );
  form.setDescription(
    'A single, section-wise field survey format combining the Desludging Vehicle Operator, ' +
    'ULB Official, FSTP/STP Technical Assessment, and Gram Panchayat questionnaires.'
  );
  form.setIsQuiz(false);

  // ---- Form Header & Surveyor Metadata ----
  form.addTextItem().setTitle('Name of the Surveyor').setRequired(true);
  form.addDateItem().setTitle('Date of Survey').setRequired(true);
  form.addTextItem().setTitle('ULB / District / State').setRequired(true);

  SECTIONS.forEach(function (section) {
    var pb = form.addPageBreakItem().setTitle(section.title);
    if (section.help) pb.setHelpText(section.help);
    section.items.forEach(function (it) {
      addItem(form, it);
    });
  });

  Logger.log('EDIT URL: ' + form.getEditUrl());
  Logger.log('LIVE URL: ' + form.getPublishedUrl());
}

function addItem(form, it) {
  var item;
  switch (it.type) {
    case 'sub':
      form.addSectionHeaderItem().setTitle(it.title);
      return;
    case 'text':
      item = form.addTextItem().setTitle(it.title);
      break;
    case 'paragraph':
      item = form.addParagraphTextItem().setTitle(it.title);
      break;
    case 'date':
      item = form.addDateItem().setTitle(it.title);
      break;
    case 'mc':
      item = form.addMultipleChoiceItem().setTitle(it.title).setChoiceValues(it.choices);
      if (it.other) item.showOtherOption(true);
      break;
    case 'checkbox':
      item = form.addCheckboxItem().setTitle(it.title).setChoiceValues(it.choices);
      if (it.other) item.showOtherOption(true);
      break;
    case 'file':
      try {
        item = form.addFileUploadItem().setTitle(it.title);
      } catch (e) {
        item = form.addParagraphTextItem().setTitle(it.title + ' (paste link/URL if file upload is unavailable)');
      }
      break;
  }
  if (item && it.required) item.setRequired(true);
  if (item && it.help) item.setHelpText(it.help);
}

var SECTIONS = [
  {
    title: 'Section 1: ULB Official Interview',
    help: 'Target Respondent: ULB Commissioner / CO / CC / Sanitary Inspector',
    items: [
      { type: 'text', title: 'Name and position of ULB official interviewed' },
      { type: 'text', title: 'Contact number' },

      { type: 'sub', title: '1.1 General & Administrative Information' },
      { type: 'text', title: '1. Name of the ULB' },
      { type: 'text', title: '2. Year ULB was established' },
      { type: 'text', title: '3. Area size under ULB jurisdiction' },
      { type: 'text', title: '4. Total number of wards in the ULB' },
      { type: 'file', title: 'Upload ward map (Shapefile / KML / PDF)' },
      { type: 'text', title: '5a. Population 1991 (Total / Male / Female)' },
      { type: 'text', title: '5b. Population 2001 (Total / Male / Female)' },
      { type: 'text', title: '5c. Population 2011 (Total / Male / Female)' },
      { type: 'text', title: '5d. Population — Current Year (Total / Male / Female)' },
      { type: 'text', title: '6. Total number of residential holdings' },
      { type: 'text', title: '7. Total number of non-residential holdings' },
      { type: 'text', title: '8. Slum details (Notified / Unnotified / Total)' },
      { type: 'text', title: '9. Name of Municipal/City Commissioner (CO Name)' },
      { type: 'text', title: "10. City Coordinator's name & contact" },
      { type: 'text', title: "11. Sanitary Inspector's name & contact" },

      { type: 'sub', title: '1.2 Water Supply' },
      { type: 'text', title: '12. Total holdings with piped water supply' },
      { type: 'checkbox', title: '13. Source of water provided', choices: ['River', 'Canal', 'Borewell'], other: true },
      { type: 'text', title: '14. Volume of water supplied per day' },
      { type: 'mc', title: '15. Frequency of water supply', choices: ['Once per day', 'Twice per day', 'Every alternate day', 'Once in three days'], other: true },
      { type: 'text', title: '16. Duration of water supply (in hours)' },
      { type: 'mc', title: '17. How water supply is charged', choices: ['Based on pipe diameter', 'Lump sum amount', 'Based on usage'], other: true },
      { type: 'text', title: '18. Amount charged for water supply' },

      { type: 'sub', title: '1.3 Sanitation Infrastructure & Services' },
      { type: 'text', title: '19. Department looking after sanitation activities' },
      { type: 'text', title: '20. Number of individual toilets in the city' },
      { type: 'text', title: '21. Number of Public Toilets (PT) / Community Toilets (CT)' },
      { type: 'mc', title: '22. Faecal sludge collection system present', choices: ['Yes', 'No'] },
      { type: 'text', title: '22a. If yes, specify capacity' },
      { type: 'checkbox', title: '23. Current sewerage network coverage', choices: ['Closed drain', 'Open drain'] },
      { type: 'paragraph', title: '24. Inventory of projects (a. Treatment, b. Conveyance, c. FS Conveying, d. FS Treatment)' },

      { type: 'sub', title: '1.4 Desludging Vehicles & Operations (ULB Overview)' },
      { type: 'paragraph', title: '25. Number and capacity of suction vehicles (Govt / Private, registered & non-registered)' },
      { type: 'paragraph', title: '26. Sanctioned suction vehicles recently (Number & capacity)' },
      { type: 'text', title: '27a. In charge for O&M of Suction vehicle' },
      { type: 'text', title: '27b. In charge for O&M of FSTP' },
      { type: 'text', title: '28a. In charge for record-keeping/complaints — Suction vehicle' },
      { type: 'text', title: '28b. In charge for record-keeping/complaints — FSTP' },
      { type: 'paragraph', title: '29. Citizen contact method / Helpline number / Inquiry handler' },
      { type: 'paragraph', title: '30a. Ground HR deployed for Suction vehicle' },
      { type: 'paragraph', title: '30b. Ground HR deployed for FSTP' },
      { type: 'mc', title: '31. Scheduled Desludging plan status', choices: ['Yes', 'No', 'In preparation'] },
      { type: 'paragraph', title: '32. Possible challenges for scheduled desludging' },
      { type: 'paragraph', title: '33. Specific challenges regarding FSSM' },

      { type: 'sub', title: '1.5 Private Desludging Operators & 1.6 Workforce' },
      { type: 'text', title: '34. Private vehicle count' },
      { type: 'text', title: '35. Trips (private vehicles)' },
      { type: 'text', title: '36. Charges (private vehicles)' },
      { type: 'text', title: '37. Monthly expenses (private vehicles)' },
      { type: 'text', title: '38. Revenue (private vehicles)' },
      { type: 'text', title: '39. Service area radius (private vehicles)' },
      { type: 'paragraph', title: '40. Staff details — Technical / Non-Technical count & experience' },
      { type: 'text', title: '41. Sanitation Worker count for LWM/FSSM (Male/Female)' },
      { type: 'text', title: '42. Sanitation Worker count for SWM (Male/Female)' },
      { type: 'mc', title: '43. Capacity building / training organized', choices: ['Yes', 'No'] },
      { type: 'mc', title: '44. Self Help Group (SHG) involvement', choices: ['Yes', 'No'] },

      { type: 'sub', title: '1.7 Urban-Rural Linkage (URL) & 1.8 Manual Scavenging' },
      { type: 'paragraph', title: '45. Sludge disposal from nearby villages into FSTP' },
      { type: 'mc', title: '46. MoU exists with Gram Panchayats for URL', choices: ['Yes', 'No'] },
      { type: 'text', title: '47. FS loads disposed under MoU (trips/week or month)' },
      { type: 'file', title: '48. Attach MoU copies' },
      { type: 'paragraph', title: '49. Strategy for URL if no MoU exists' },
      { type: 'mc', title: '50. Awareness of manual scavenging practice', choices: ['Yes', 'No'] },
      { type: 'text', title: '51. Number of people engaged in manual scavenging' }
    ]
  },
  {
    title: 'Section 2: FSTP / STP Technical Assessment',
    help: 'Target Respondent: STP/FSTP Operator / Site Inspection',
    items: [
      { type: 'text', title: 'City / Town / GP Name' },
      { type: 'text', title: 'Location of FSTP/STP' },

      { type: 'sub', title: '2.1 Infrastructure Overview' },
      { type: 'checkbox', title: 'Existing UWM infrastructure', choices: ['Sewerage system', 'Interception & Diversion (I&D)', 'Sewage Pumping Station', 'STP', 'FSTP'] },

      { type: 'sub', title: '2.2 Sewerage System' },
      { type: 'text', title: 'Length of sewerage network' },
      { type: 'text', title: 'Coverage (%)' },
      { type: 'paragraph', title: 'Unserved areas' },
      { type: 'text', title: 'Design period' },
      { type: 'date', title: 'Commissioning date' },
      { type: 'text', title: 'Number of connections' },
      { type: 'text', title: 'Cost' },
      { type: 'file', title: 'Upload DPR (sewerage system)' },
      { type: 'paragraph', title: 'Operational issues (sewerage system)' },

      { type: 'sub', title: '2.3 Interception & Diversion (I&D)' },
      { type: 'paragraph', title: 'Drain network alignment' },
      { type: 'text', title: 'Screen/grit details' },
      { type: 'paragraph', title: 'Dry/wet flow diversion' },
      { type: 'mc', title: 'Type', choices: ['Channel-based', 'Pipe-based'] },
      { type: 'text', title: 'Dimensions' },
      { type: 'text', title: 'Dry weather flow' },
      { type: 'paragraph', title: 'Operational issues (I&D)' },

      { type: 'sub', title: '2.4 Sewage Treatment Plant (STP)' },
      { type: 'text', title: 'Implemented / design capacity' },
      { type: 'text', title: 'Current load' },
      { type: 'paragraph', title: 'Input characteristics' },
      { type: 'text', title: 'Technology used' },
      { type: 'text', title: 'Footprint / area' },
      { type: 'text', title: 'Disposal site' },
      { type: 'mc', title: 'Treated water reuse', choices: ['Yes', 'No'] },
      { type: 'mc', title: 'CPCB standards compliance', choices: ['Yes', 'No'] },
      { type: 'file', title: 'Upload DPR (STP)' },

      { type: 'sub', title: '2.5 Faecal Sludge Treatment Plant (FSTP)' },
      { type: 'text', title: 'Google location & distance from town' },
      { type: 'text', title: 'KLD capacity' },
      { type: 'paragraph', title: 'Area breakdown' },
      { type: 'text', title: 'Daily trips received' },
      { type: 'paragraph', title: 'Sequential treatment technology' },
      { type: 'paragraph', title: 'Outputs (treated water / biosolids)' },
      { type: 'paragraph', title: 'Quality testing results' },
      { type: 'paragraph', title: 'Dried sludge quantum & disposal' },
      { type: 'file', title: 'Upload DPR (FSTP)' },

      { type: 'sub', title: '2.6–2.7 Observations & O&M / Financial' },
      { type: 'text', title: 'Approach road condition' },
      { type: 'paragraph', title: 'Structural condition' },
      { type: 'paragraph', title: 'WASH/PPE facilities availability' },
      { type: 'file', title: 'Upload landscaping photos' },
      { type: 'paragraph', title: 'Resident feedback' },
      { type: 'paragraph', title: 'Vehicle & FSTP monthly O&M cost breakdown' },
      { type: 'text', title: 'Cost recovery method' },
      { type: 'checkbox', title: 'Funding sources', choices: ['SBM 2.0', 'Augmentation'], other: true },

      { type: 'sub', title: '2.8 Documentation Checklist' },
      { type: 'file', title: 'Upload FSTP site photos' },
      { type: 'file', title: 'Upload O&M Logbook photos' }
    ]
  },
  {
    title: 'Section 3: Desludging Vehicle Operator Interview',
    help: 'Target Respondent: Desludging Vehicle Driver / Owner',
    items: [
      { type: 'sub', title: '3.1 Operator Profile' },
      { type: 'mc', title: '1. Ownership', choices: ['ULB', 'Private', 'Others'] },
      { type: 'mc', title: '2. Licensed by ULB', choices: ['Yes', 'No'] },
      { type: 'file', title: 'Upload license copy (if licensed)' },
      { type: 'text', title: '3. Operator name' },
      { type: 'text', title: '4. Company name' },
      { type: 'text', title: '5. Address' },
      { type: 'text', title: '6. Phone number' },
      { type: 'mc', title: '7. Experience duration', choices: ['<1 yr', '1–3 yrs', '3–5 yrs', '5–7 yrs', '7–10 yrs', '>10 yrs'] },
      { type: 'mc', title: '8. Vehicle base location', choices: ['Same town', 'Another town'] },
      { type: 'mc', title: '9. If another town, distance', choices: ['1–5 km', '5–10 km', '10–20 km', '>20 km'] },

      { type: 'sub', title: '3.2–3.3 Operations & Trip Details' },
      { type: 'mc', title: '10. Truck type', choices: ['Tractor-mounted', 'Truck-mounted'] },
      { type: 'text', title: '11. Tank capacity (Litres)' },
      { type: 'checkbox', title: '12. Systems desludged', choices: ['Septic tank', 'Pits', 'Apartment STP'], other: true },
      { type: 'text', title: '13. Non-peak season trips (per day/week/month)' },
      { type: 'text', title: '14. Peak season months' },
      { type: 'text', title: '15. Peak season trips (per day/week/month)' },
      { type: 'mc', title: '16. Average desludging time', choices: ['0–10 min', '10–20 min', '20–30 min', '30–45 min', '>45 min'] },
      { type: 'mc', title: '17. Maximum travel distance to disposal site', choices: ['0–5 km', '5–10 km', '10–20 km', '20–30 km', '>30 km'] },

      { type: 'sub', title: '3.4 Practices, PPE & Safety' },
      { type: 'checkbox', title: '18. Disposal locations used', choices: ['Open land', 'Farmlands', 'FSTP', 'STP', 'Drains'], other: true },
      { type: 'paragraph', title: '19. Hardened sludge handling method' },
      { type: 'mc', title: '20. Disinfectant usage', choices: ['Yes', 'No'] },
      { type: 'paragraph', title: '21. Inaccessible areas encountered' },
      { type: 'mc', title: '22. PPE usage', choices: ['Yes', 'No'] },
      { type: 'checkbox', title: '23. PPE types used', choices: ['Gloves', 'Mask', 'Gumboots', 'Coverall'], other: true },
      { type: 'paragraph', title: '24. Reasons for non-use of PPE' },
      { type: 'checkbox', title: '25. Training received', choices: ['PPE', 'Hygiene', 'ERSU'], other: true },

      { type: 'sub', title: '3.5 Health, Barriers & Financials' },
      { type: 'checkbox', title: '26. Health issues in last 1 year', choices: ['Diarrhea', 'Skin rashes', 'Musculoskeletal issues'], other: true },
      { type: 'text', title: '27. Doctor expenses per visit' },
      { type: 'mc', title: '28. Health insurance', choices: ['Yes', 'No'] },
      { type: 'paragraph', title: '29. Barriers faced — authority related' },
      { type: 'paragraph', title: '30. Barriers faced — social' },
      { type: 'paragraph', title: '31. Barriers faced — business' },
      { type: 'text', title: '32. Charge per load' },
      { type: 'paragraph', title: '33. Factors affecting pricing' },
      { type: 'text', title: '34. Capital (capex) cost' },
      { type: 'text', title: '35a. Monthly opex — labour' },
      { type: 'text', title: '35b. Monthly opex — fuel' },
      { type: 'text', title: '35c. Monthly opex — maintenance' },
      { type: 'text', title: '35d. Monthly opex — tipping fee' },
      { type: 'paragraph', title: '36. Faecal sludge market demand / payments received from farmers' }
    ]
  },
  {
    title: 'Section 4: Gram Panchayat / Community Interview',
    help: 'Target Respondent: Sarpanch / GP Villagers',
    items: [
      { type: 'text', title: 'Gram Panchayat Name' },
      { type: 'text', title: 'Respondent Name & Position' },

      { type: 'sub', title: '4.1 URL & Sanitation Demand' },
      { type: 'paragraph', title: '1. IEC and capacity-building activities for URL' },
      { type: 'paragraph', title: '2. Demand for desludging services in GP' },
      { type: 'paragraph', title: '3. Willingness to pay for desludging service' },

      { type: 'sub', title: '4.2 Existing Sanitation Systems' },
      { type: 'paragraph', title: '4. IHHL percentage & existing situation' },
      { type: 'checkbox', title: '5. Black water management (OSS types)', choices: ['Single pits', 'Twin pits', 'Septic tanks'], other: true },
      { type: 'checkbox', title: '6. Grey water management', choices: ['Onsite units', 'Drains'], other: true },
      { type: 'paragraph', title: '7. GP sanitation challenges as perceived by Sarpanch' },
      { type: 'paragraph', title: '8. GP sanitation challenges as perceived by residents' }
    ]
  }
];
