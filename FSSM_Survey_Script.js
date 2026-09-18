/* ============================================================================
   FSSM & URL Consolidated Survey — client-side app
   ----------------------------------------------------------------------------
   Everything about the form — every question, its type, its unit, its
   dropdown options, whether it's required — lives in the SECTIONS schema
   below. The renderer at the bottom builds the actual HTML from this schema,
   so to change the form you edit DATA here, not HTML in index.html.

   QUICK EDITS YOU'LL WANT LATER
   ------------------------------------------------------------------------
   1) PASTE YOUR APPS SCRIPT WEB APP URL
      Search for CONFIG.SCRIPT_URL below and paste the URL you get after
      deploying FSSM_Survey_Backend.gs (see the setup guide).

   2) ADD MORE STATES / DISTRICTS / ULBs
      Search for "LOCATIONS" below. It's a plain nested object:
        State -> District -> [ULB1, ULB2, ...]
      Add as many as you like, in the same shape. A "Type manually" fallback
      is always shown too, so nothing is ever blocked by a missing entry.

   3) MARK A QUESTION AS MANDATORY
      Every question object below has `required: false`. Find the question
      by its `id` (each one is commented with its original question number)
      and change it to `required: true`. Required questions get a red
      asterisk and block submission until answered.
   ========================================================================== */

const CONFIG = {
  // PASTE your Google Apps Script Web App URL here after deploying it
  // (Deploy > New deployment > Web app > copy the "Web app URL").
  SCRIPT_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE",
  MAX_FILE_MB: 8, // soft warning threshold per file
};

/* ---------------------------------------------------------------------------
   1) DISTRICT DATABASE (with State & LGD Codes)
   Loaded into State & District dropdowns. ULB / GP is filled manually.
   --------------------------------------------------------------------------- */
const DISTRICT_DATABASE = {
  "Madhya Pradesh": [
    {
      "name": "Agar-Malwa",
      "lgd": "667"
    },
    {
      "name": "Alirajpur",
      "lgd": "639"
    },
    {
      "name": "Anuppur",
      "lgd": "390"
    },
    {
      "name": "Ashoknagar",
      "lgd": "391"
    },
    {
      "name": "Balaghat",
      "lgd": "392"
    },
    {
      "name": "Barwani",
      "lgd": "393"
    },
    {
      "name": "Betul",
      "lgd": "394"
    },
    {
      "name": "Bhind",
      "lgd": "395"
    },
    {
      "name": "Bhopal",
      "lgd": "396"
    },
    {
      "name": "Burhanpur",
      "lgd": "397"
    },
    {
      "name": "Chhatarpur",
      "lgd": "398"
    },
    {
      "name": "Chhindwara",
      "lgd": "399"
    },
    {
      "name": "Damoh",
      "lgd": "400"
    },
    {
      "name": "Datia",
      "lgd": "401"
    },
    {
      "name": "Dewas",
      "lgd": "402"
    },
    {
      "name": "Dhar",
      "lgd": "403"
    },
    {
      "name": "Dindori",
      "lgd": "404"
    },
    {
      "name": "Guna",
      "lgd": "406"
    },
    {
      "name": "Gwalior",
      "lgd": "407"
    },
    {
      "name": "Harda",
      "lgd": "408"
    },
    {
      "name": "Indore",
      "lgd": "410"
    },
    {
      "name": "Jabalpur",
      "lgd": "411"
    },
    {
      "name": "Jhabua",
      "lgd": "412"
    },
    {
      "name": "Katni",
      "lgd": "413"
    },
    {
      "name": "Khandwa (East Nimar)",
      "lgd": "405"
    },
    {
      "name": "Khargone (West Nimar)",
      "lgd": "414"
    },
    {
      "name": "MAUGANJ",
      "lgd": "766"
    },
    {
      "name": "Maihar",
      "lgd": "784"
    },
    {
      "name": "Mandla",
      "lgd": "415"
    },
    {
      "name": "Mandsaur",
      "lgd": "416"
    },
    {
      "name": "Morena",
      "lgd": "417"
    },
    {
      "name": "Narmadapuram",
      "lgd": "409"
    },
    {
      "name": "Narsimhapur",
      "lgd": "418"
    },
    {
      "name": "Neemuch",
      "lgd": "419"
    },
    {
      "name": "Niwari",
      "lgd": "722"
    },
    {
      "name": "Pandhurna",
      "lgd": "785"
    },
    {
      "name": "Panna",
      "lgd": "420"
    },
    {
      "name": "Raisen",
      "lgd": "421"
    },
    {
      "name": "Rajgarh",
      "lgd": "422"
    },
    {
      "name": "Ratlam",
      "lgd": "423"
    },
    {
      "name": "Rewa",
      "lgd": "424"
    },
    {
      "name": "Sagar",
      "lgd": "425"
    },
    {
      "name": "Satna",
      "lgd": "426"
    },
    {
      "name": "Sehore",
      "lgd": "427"
    },
    {
      "name": "Seoni",
      "lgd": "428"
    },
    {
      "name": "Shahdol",
      "lgd": "429"
    },
    {
      "name": "Shajapur",
      "lgd": "430"
    },
    {
      "name": "Sheopur",
      "lgd": "431"
    },
    {
      "name": "Shivpuri",
      "lgd": "432"
    },
    {
      "name": "Sidhi",
      "lgd": "433"
    },
    {
      "name": "Singrauli",
      "lgd": "638"
    },
    {
      "name": "Tikamgarh",
      "lgd": "434"
    },
    {
      "name": "Ujjain",
      "lgd": "435"
    },
    {
      "name": "Umaria",
      "lgd": "436"
    },
    {
      "name": "Vidisha",
      "lgd": "437"
    }
  ],
  "Chhattisgarh": [
    {
      "name": "Balod",
      "lgd": "646"
    },
    {
      "name": "Balodabazar-Bhatapara",
      "lgd": "644"
    },
    {
      "name": "Balrampur-Ramanujganj",
      "lgd": "649"
    },
    {
      "name": "Bastar",
      "lgd": "374"
    },
    {
      "name": "Bemetara",
      "lgd": "650"
    },
    {
      "name": "Bijapur",
      "lgd": "636"
    },
    {
      "name": "Bilaspur",
      "lgd": "375"
    },
    {
      "name": "Dakshin Bastar Dantewada",
      "lgd": "376"
    },
    {
      "name": "Dhamtari",
      "lgd": "377"
    },
    {
      "name": "Durg",
      "lgd": "378"
    },
    {
      "name": "Gariyaband",
      "lgd": "645"
    },
    {
      "name": "Gaurela-Pendra-Marwahi",
      "lgd": "734"
    },
    {
      "name": "Janjgir-Champa",
      "lgd": "379"
    },
    {
      "name": "Jashpur",
      "lgd": "380"
    },
    {
      "name": "Kabeerdham",
      "lgd": "382"
    },
    {
      "name": "Khairagarh-Chhuikhadan-Gandai",
      "lgd": "759"
    },
    {
      "name": "Kondagaon",
      "lgd": "643"
    },
    {
      "name": "Korba",
      "lgd": "383"
    },
    {
      "name": "Korea",
      "lgd": "384"
    },
    {
      "name": "Mahasamund",
      "lgd": "385"
    },
    {
      "name": "Manendragarh-Chirmiri-Bharatpur(M C B)",
      "lgd": "760"
    },
    {
      "name": "Mohla-Manpur-Ambagarh Chouki",
      "lgd": "761"
    },
    {
      "name": "Mungeli",
      "lgd": "647"
    },
    {
      "name": "Narayanpur",
      "lgd": "637"
    },
    {
      "name": "Raigarh",
      "lgd": "386"
    },
    {
      "name": "Raipur",
      "lgd": "387"
    },
    {
      "name": "Rajnandgaon",
      "lgd": "388"
    },
    {
      "name": "Sakti",
      "lgd": "762"
    },
    {
      "name": "Sarangarh-Bilaigarh",
      "lgd": "763"
    },
    {
      "name": "Sukma",
      "lgd": "642"
    },
    {
      "name": "Surajpur",
      "lgd": "648"
    },
    {
      "name": "Surguja",
      "lgd": "389"
    },
    {
      "name": "Uttar Bastar Kanker",
      "lgd": "381"
    }
  ],
  "Assam": [
    {
      "name": "Bajali",
      "lgd": "739"
    },
    {
      "name": "Baksa",
      "lgd": "616"
    },
    {
      "name": "Barpeta",
      "lgd": "280"
    },
    {
      "name": "Biswanath",
      "lgd": "705"
    },
    {
      "name": "Bongaigaon",
      "lgd": "281"
    },
    {
      "name": "Cachar",
      "lgd": "282"
    },
    {
      "name": "Charaideo",
      "lgd": "708"
    },
    {
      "name": "Chirang",
      "lgd": "612"
    },
    {
      "name": "Darrang",
      "lgd": "283"
    },
    {
      "name": "Dhemaji",
      "lgd": "284"
    },
    {
      "name": "Dhubri",
      "lgd": "285"
    },
    {
      "name": "Dibrugarh",
      "lgd": "286"
    },
    {
      "name": "Dima Hasao",
      "lgd": "299"
    },
    {
      "name": "Goalpara",
      "lgd": "287"
    },
    {
      "name": "Golaghat",
      "lgd": "288"
    },
    {
      "name": "Hailakandi",
      "lgd": "289"
    },
    {
      "name": "Hojai",
      "lgd": "709"
    },
    {
      "name": "Jorhat",
      "lgd": "290"
    },
    {
      "name": "Kamrup",
      "lgd": "291"
    },
    {
      "name": "Kamrup Metro",
      "lgd": "618"
    },
    {
      "name": "Karbi Anglong",
      "lgd": "292"
    },
    {
      "name": "Kokrajhar",
      "lgd": "294"
    },
    {
      "name": "Lakhimpur",
      "lgd": "295"
    },
    {
      "name": "Majuli",
      "lgd": "706"
    },
    {
      "name": "Marigaon",
      "lgd": "296"
    },
    {
      "name": "Nagaon",
      "lgd": "297"
    },
    {
      "name": "Nalbari",
      "lgd": "298"
    },
    {
      "name": "Sivasagar",
      "lgd": "300"
    },
    {
      "name": "Sonitpur",
      "lgd": "301"
    },
    {
      "name": "South Salmara Mancachar",
      "lgd": "707"
    },
    {
      "name": "Sribhumi",
      "lgd": "293"
    },
    {
      "name": "Tamulpur",
      "lgd": "756"
    },
    {
      "name": "Tinsukia",
      "lgd": "302"
    },
    {
      "name": "Udalguri",
      "lgd": "617"
    },
    {
      "name": "West Karbi Anglong",
      "lgd": "710"
    }
  ],
  "Jharkhand": [
    {
      "name": "Bokaro",
      "lgd": "322"
    },
    {
      "name": "Chatra",
      "lgd": "323"
    },
    {
      "name": "Deoghar",
      "lgd": "324"
    },
    {
      "name": "Dhanbad",
      "lgd": "325"
    },
    {
      "name": "Dumka",
      "lgd": "326"
    },
    {
      "name": "East Singhbum",
      "lgd": "327"
    },
    {
      "name": "Garhwa",
      "lgd": "328"
    },
    {
      "name": "Giridih",
      "lgd": "329"
    },
    {
      "name": "Godda",
      "lgd": "330"
    },
    {
      "name": "Gumla",
      "lgd": "331"
    },
    {
      "name": "Hazaribagh",
      "lgd": "332"
    },
    {
      "name": "Jamtara",
      "lgd": "333"
    },
    {
      "name": "Khunti",
      "lgd": "606"
    },
    {
      "name": "Koderma",
      "lgd": "334"
    },
    {
      "name": "Latehar",
      "lgd": "335"
    },
    {
      "name": "Lohardaga",
      "lgd": "336"
    },
    {
      "name": "Pakur",
      "lgd": "337"
    },
    {
      "name": "Palamu",
      "lgd": "338"
    },
    {
      "name": "Ramgarh",
      "lgd": "607"
    },
    {
      "name": "Ranchi",
      "lgd": "339"
    },
    {
      "name": "Sahebganj",
      "lgd": "340"
    },
    {
      "name": "Saraikela Kharsawan",
      "lgd": "341"
    },
    {
      "name": "Simdega",
      "lgd": "342"
    },
    {
      "name": "West Singhbhum",
      "lgd": "343"
    }
  ]
};
const LOCATION_OTHER = "__other__"; // sentinel value for "type manually"

/* ---------------------------------------------------------------------------
   2) FIELD BUILDER HELPERS — keep the schema below short and readable
   --------------------------------------------------------------------------- */
function F(id, label, type, extra) {
  return Object.assign({ id, label, type, required: false }, extra || {});
}
const TXT  = (id, label, extra) => F(id, label, "text", extra);
const TA   = (id, label, extra) => F(id, label, "textarea", extra);
const NUM  = (id, label, unit, extra) => F(id, label, "number", Object.assign({ unit, min: 0 }, extra || {}));
const TEL  = (id, label, extra) => F(id, label, "tel", Object.assign({
  tooltip: "Enter a 10-digit mobile number, digits only (no +91 or spaces)."
}, extra || {}));
const DATE = (id, label, extra) => F(id, label, "date", extra);
const SEL  = (id, label, options, extra) => F(id, label, "select", Object.assign({ options }, extra || {}));
const CHK  = (id, label, options, extra) => F(id, label, "checkbox", Object.assign({ options }, extra || {}));
const FILE = (id, label, extra) => F(id, label, "file", Object.assign({ accept: "image/*,.pdf,.kml,.zip" }, extra || {}));
const SUB  = (label) => ({ type: "subheading", label });
const YESNO = ["Yes", "No"];

function populationFields() {
  const years = ["1991", "2001", "2011", "Current Year"];
  const cols = ["Total", "Male", "Female"];
  const out = [];
  years.forEach((y) => {
    cols.forEach((c) => {
      const id = "s1_pop_" + y.replace(/\s+/g, "").toLowerCase() + "_" + c.toLowerCase();
      out.push(NUM(id, `${y} — ${c}`, "persons", { group: "population" }));
    });
  });
  return out;
}

/* ---------------------------------------------------------------------------
   3) THE FULL SURVEY SCHEMA
   --------------------------------------------------------------------------- */
const SECTIONS = [
  {
    id: "header",
    title: "Survey Details",
    shortTitle: "Survey Details",
    subTitle: "Location & Date",
    icon: "fa-clipboard-list",
    color: "#0e7490",
    description: "Every response is recorded against these three fields.",
    fields: [
      TXT("surveyor_name", "Name of the Surveyor", { required: true, icon: "fa-user" }),
      DATE("survey_date", "Date of Survey", { required: true, icon: "fa-calendar-day" }),
      SEL("state", "State", Object.keys(DISTRICT_DATABASE).sort(), {
        required: true, icon: "fa-map", tooltip: "Pick a state, or choose \"Other (type manually)\" if yours is not listed."
      }),
      SEL("district", "District (with LGD Code)", [], {
        required: true, icon: "fa-map-location-dot", tooltip: "Choose a state first — this list updates automatically with LGD codes."
      }),
      TXT("ulb", "ULB / Gram Panchayat", {
        required: true, icon: "fa-city", placeholder: "Enter ULB or Gram Panchayat name", tooltip: "Enter the name of the Urban Local Body (ULB) or Gram Panchayat (GP)."
      })
    ]
  },
  {
    id: "s1",
    title: "Section 1: ULB Official Interview",
    shortTitle: "ULB Official",
    subTitle: "Admin & Policy",
    icon: "fa-building-columns",
    color: "#0284c7",
    description: "Target Respondent: ULB Commissioner / CO / CC / Sanitary Inspector",
    fields: [
      SUB("Respondent Details"),
      TXT("s1_resp_name", "Name and position of ULB official interviewed"),
      TEL("s1_resp_contact", "Contact number"),

      SUB("1.1 General & Administrative Information"),
      TXT("s1_ulb_name", "1. Name of the ULB"),
      NUM("s1_year_established", "2. Year ULB was established", "year", { min: 1800, max: new Date().getFullYear(), step: 1 }),
      NUM("s1_area_size", "3. Area size under ULB jurisdiction", "sq. km", { step: "0.01" }),
      NUM("s1_total_wards", "4. Total number of wards in the ULB", "wards", { step: 1 }),
      FILE("s1_ward_map", "Upload ward map (Shapefile / KML / PDF)"),
      SUB("5. Population (fill whichever census years you have data for)"),
      ...populationFields(),
      NUM("s1_residential_holdings", "6. Total number of residential holdings", "holdings", { step: 1 }),
      NUM("s1_nonresidential_holdings", "7. Total number of non-residential holdings", "holdings", { step: 1 }),
      NUM("s1_slum_notified", "8a. Slum details — Notified", "slums", { step: 1, group: "slum" }),
      NUM("s1_slum_unnotified", "8b. Slum details — Unnotified", "slums", { step: 1, group: "slum" }),
      NUM("s1_slum_total", "8c. Slum details — Total", "slums", { step: 1, group: "slum" }),
      TXT("s1_co_name", "9. Name of Municipal/City Commissioner (CO Name)"),
      TXT("s1_city_coord_name", "10a. City Coordinator's name", { group: "coord" }),
      TEL("s1_city_coord_contact", "10b. City Coordinator's contact", { group: "coord" }),
      TXT("s1_sanitary_inspector_name", "11a. Sanitary Inspector's name", { group: "si" }),
      TEL("s1_sanitary_inspector_contact", "11b. Sanitary Inspector's contact", { group: "si" }),

      SUB("1.2 Water Supply"),
      NUM("s1_piped_holdings", "12. Total holdings with piped water supply", "holdings", { step: 1 }),
      CHK("s1_water_source", "13. Source of water provided", ["River", "Canal", "Borewell", "Others"]),
      NUM("s1_water_volume", "14. Volume of water supplied per day", "KLD (kilolitres/day)", { step: "0.1" }),
      SEL("s1_water_frequency", "15. Frequency of water supply", ["Once per day", "Twice per day", "Every alternate day", "Once in three days", "Others"]),
      NUM("s1_water_duration", "16. Duration of water supply", "hours", { step: "0.5", max: 24 }),
      SEL("s1_water_charge_basis", "17. How water supply is charged", ["Based on pipe diameter", "Lump sum amount", "Based on usage", "Others"]),
      NUM("s1_water_charge_amount", "18. Amount charged for water supply", "₹ per month", { step: 1 }),

      SUB("1.3 Sanitation Infrastructure & Services"),
      TXT("s1_sanitation_dept", "19. Department looking after sanitation activities"),
      NUM("s1_individual_toilets", "20. Number of individual toilets in the city", "toilets", { step: 1 }),
      NUM("s1_pt_ct_count", "21. Number of Public Toilets (PT) / Community Toilets (CT)", "units", { step: 1 }),
      SEL("s1_fs_collection_system", "22. Faecal sludge collection system present", YESNO, { tooltip: "If Yes, also fill the capacity field below." }),
      NUM("s1_fs_collection_capacity", "22a. If yes, specify capacity", "KLD", { step: "0.1" }),
      CHK("s1_sewerage_coverage_type", "23a. Current sewerage network — drain type", ["Closed drain", "Open drain"]),
      NUM("s1_sewerage_coverage_pct", "23b. Current sewerage network coverage", "%", { max: 100, step: "0.1" }),
      TA("s1_project_inventory", "24. Inventory of projects — a) Treatment, b) Conveyance, c) FS Conveying, d) FS Treatment", {
        placeholder: "e.g. a) STP 10 MLD (under construction) b) 25 km trunk sewer c) 2 suction vehicles d) FSTP 15 KLD (operational)"
      }),

      SUB("1.4 Desludging Vehicles & Operations (ULB Overview)"),
      TA("s1_suction_vehicles", "25. Number and capacity of suction vehicles (Govt / Private, registered & non-registered)"),
      TA("s1_sanctioned_vehicles", "26. Sanctioned suction vehicles recently (number & capacity)"),
      TXT("s1_om_incharge_vehicle", "27a. In charge for O&M — Suction vehicle", { group: "om" }),
      TXT("s1_om_incharge_fstp", "27b. In charge for O&M — FSTP", { group: "om" }),
      TXT("s1_record_incharge_vehicle", "28a. In charge for record-keeping/complaints — Suction vehicle", { group: "record" }),
      TXT("s1_record_incharge_fstp", "28b. In charge for record-keeping/complaints — FSTP", { group: "record" }),
      TA("s1_citizen_contact", "29. Citizen contact method / Helpline number / Inquiry handler"),
      TA("s1_hr_vehicle", "30a. Ground HR deployed — Suction vehicle", { group: "hr" }),
      TA("s1_hr_fstp", "30b. Ground HR deployed — FSTP", { group: "hr" }),
      SEL("s1_scheduled_desludging", "31. Scheduled Desludging plan status", ["Yes", "No", "In preparation"]),
      TA("s1_desludging_challenges", "32. Possible challenges for scheduled desludging"),
      TA("s1_fssm_challenges", "33. Specific challenges regarding FSSM"),

      SUB("1.5 Private Desludging Operators & 1.6 Workforce"),
      NUM("s1_private_vehicle_count", "34. Private vehicle count", "vehicles", { step: 1 }),
      NUM("s1_private_trips", "35. Trips by private vehicles", "trips/day", { step: 1 }),
      NUM("s1_private_charges", "36. Charges by private vehicles", "₹ per trip", { step: 1 }),
      NUM("s1_private_monthly_expense", "37. Monthly expenses (private vehicles)", "₹ per month", { step: 1 }),
      NUM("s1_private_revenue", "38. Revenue (private vehicles)", "₹ per month", { step: 1 }),
      NUM("s1_service_area_radius", "39. Service area radius", "km", { step: "0.1" }),
      TA("s1_staff_details", "40. Staff details — Technical / Non-Technical count & experience"),
      TXT("s1_sw_lwm_fssm", "41. Sanitation Worker count for LWM/FSSM (Male/Female)", { placeholder: "e.g. Male: 6, Female: 2" }),
      TXT("s1_sw_swm", "42. Sanitation Worker count for SWM (Male/Female)", { placeholder: "e.g. Male: 10, Female: 4" }),
      SEL("s1_capacity_building", "43. Capacity building / training organized", YESNO),
      SEL("s1_shg_involvement", "44. Self Help Group (SHG) involvement", YESNO),

      SUB("1.7 Urban-Rural Linkage (URL) & 1.8 Manual Scavenging"),
      TA("s1_sludge_from_villages", "45. Sludge disposal from nearby villages into FSTP"),
      SEL("s1_mou_gp", "46. MoU exists with Gram Panchayats for URL", YESNO),
      TXT("s1_mou_fs_loads", "47. FS loads disposed under MoU", { placeholder: "e.g. 4 trips/week" }),
      FILE("s1_mou_upload", "48. Attach MoU copies"),
      TA("s1_url_strategy_no_mou", "49. Strategy for URL if no MoU exists"),
      SEL("s1_manual_scavenging_awareness", "50. Awareness of manual scavenging practice", YESNO),
      NUM("s1_manual_scavenging_count", "51. Number of people engaged in manual scavenging", "persons", { step: 1 })
    ]
  },
  {
    id: "s2",
    title: "Section 2: FSTP / STP Technical Assessment",
    shortTitle: "FSTP / STP",
    subTitle: "Plant Technical",
    icon: "fa-water",
    color: "#0d9488",
    description: "Target Respondent: STP/FSTP Operator / Site Inspection",
    fields: [
      TXT("s2_city_name", "City / Town / GP Name"),
      TXT("s2_fstp_location", "Location of FSTP/STP", { placeholder: "Google Maps link or lat, long", icon: "fa-location-dot" }),

      SUB("2.1 Infrastructure Overview"),
      CHK("s2_infrastructure", "Existing UWM infrastructure", ["Sewerage system", "Interception & Diversion (I&D)", "Sewage Pumping Station", "STP", "FSTP"]),

      SUB("2.2 Sewerage System"),
      NUM("s2_sewer_length", "Length of sewerage network", "km", { step: "0.01" }),
      NUM("s2_sewer_coverage_pct", "Coverage", "%", { max: 100, step: "0.1" }),
      TA("s2_sewer_unserved_areas", "Unserved areas"),
      NUM("s2_sewer_design_period", "Design period", "years", { step: 1 }),
      DATE("s2_sewer_commission_date", "Commissioning date"),
      NUM("s2_sewer_connections", "Number of connections", "connections", { step: 1 }),
      NUM("s2_sewer_cost", "Cost", "₹ Lakhs", { step: "0.01" }),
      FILE("s2_sewer_dpr", "Upload DPR (sewerage system)"),
      TA("s2_sewer_issues", "Operational issues (sewerage system)"),

      SUB("2.3 Interception & Diversion (I&D)"),
      TA("s2_id_drain_alignment", "Drain network alignment"),
      TXT("s2_id_screen_grit", "Screen/grit details"),
      TA("s2_id_dry_wet_diversion", "Dry/wet flow diversion"),
      SEL("s2_id_type", "Type", ["Channel-based", "Pipe-based"]),
      TXT("s2_id_dimensions", "Dimensions", { placeholder: "e.g. 2m x 1.5m", unit: "m" }),
      NUM("s2_id_dry_weather_flow", "Dry weather flow", "KLD", { step: "0.1" }),
      TA("s2_id_issues", "Operational issues (I&D)"),

      SUB("2.4 Sewage Treatment Plant (STP)"),
      NUM("s2_stp_implemented_capacity", "Implemented capacity", "MLD", { step: "0.01", group: "stpcap" }),
      NUM("s2_stp_design_capacity", "Design capacity", "MLD", { step: "0.01", group: "stpcap" }),
      NUM("s2_stp_current_load", "Current load", "MLD", { step: "0.01" }),
      TA("s2_stp_input_characteristics", "Input characteristics", { placeholder: "BOD, COD, TSS, pH etc." }),
      TXT("s2_stp_technology", "Technology used"),
      NUM("s2_stp_footprint", "Footprint / area", "sq. m", { step: "0.1" }),
      TXT("s2_stp_disposal_site", "Disposal site"),
      SEL("s2_stp_water_reuse", "Treated water reuse", YESNO),
      SEL("s2_stp_cpcb_compliance", "CPCB standards compliance", YESNO),
      FILE("s2_stp_dpr", "Upload DPR (STP)"),

      SUB("2.5 Faecal Sludge Treatment Plant (FSTP)"),
      TXT("s2_fstp_geolocation", "Google location & distance from town", { placeholder: "lat, long / Maps link" }),
      NUM("s2_fstp_distance", "Distance from town", "km", { step: "0.1" }),
      NUM("s2_fstp_capacity", "KLD capacity", "KLD", { step: "0.1" }),
      TA("s2_fstp_area_breakdown", "Area breakdown"),
      NUM("s2_fstp_daily_trips", "Daily trips received", "trips/day", { step: 1 }),
      TA("s2_fstp_technology", "Sequential treatment technology"),
      TA("s2_fstp_outputs", "Outputs (treated water / biosolids)"),
      TA("s2_fstp_quality_results", "Quality testing results"),
      NUM("s2_fstp_dried_sludge_qty", "Dried sludge quantum", "kg/day", { step: "0.1", group: "sludgeqty" }),
      TXT("s2_fstp_sludge_disposal", "Dried sludge disposal method", { group: "sludgeqty" }),
      FILE("s2_fstp_dpr", "Upload DPR (FSTP)"),

      SUB("2.6–2.7 Observations & O&M / Financial"),
      SEL("s2_approach_road", "Approach road condition", ["Good", "Fair", "Poor"]),
      SEL("s2_structural_condition", "Structural condition", ["Good", "Fair", "Poor"]),
      TA("s2_wash_ppe_facilities", "WASH/PPE facilities availability"),
      FILE("s2_landscaping_photos", "Upload landscaping photos", { multiple: true }),
      TA("s2_resident_feedback", "Resident feedback"),
      NUM("s2_vehicle_om_cost", "Vehicle monthly O&M cost", "₹ per month", { step: 1, group: "omcost" }),
      NUM("s2_fstp_om_cost", "FSTP monthly O&M cost", "₹ per month", { step: 1, group: "omcost" }),
      TXT("s2_cost_recovery_method", "Cost recovery method"),
      CHK("s2_funding_sources", "Funding sources", ["SBM 2.0", "Augmentation", "State Funds", "ULB Own Funds", "Others"]),

      SUB("2.8 Documentation Checklist"),
      FILE("s2_site_photos", "Upload FSTP site photos", { multiple: true }),
      FILE("s2_logbook_photos", "Upload O&M Logbook photos", { multiple: true })
    ]
  },
  {
    id: "s3",
    title: "Section 3: Desludging Vehicle Operator Interview",
    shortTitle: "Vehicle Operator",
    subTitle: "Trucks & Trips",
    icon: "fa-truck",
    color: "#7c3aed",
    description: "Target Respondent: Desludging Vehicle Driver / Owner",
    fields: [
      SUB("3.1 Operator Profile"),
      SEL("s3_ownership", "1. Ownership", ["ULB", "Private", "Others"]),
      SEL("s3_licensed", "2. Licensed by ULB", YESNO),
      FILE("s3_license_upload", "Upload License copy (if licensed)"),
      TXT("s3_operator_name", "3. Operator name"),
      TXT("s3_company_name", "4. Company name"),
      TA("s3_address", "5. Address"),
      TEL("s3_phone", "6. Phone number"),
      SEL("s3_experience", "7. Experience duration", ["<1 yr", "1–3 yrs", "3–5 yrs", "5–7 yrs", "7–10 yrs", ">10 yrs"]),
      SEL("s3_vehicle_base", "8. Vehicle base location", ["Same town", "Another town"]),
      SEL("s3_vehicle_base_distance", "8a. If another town, distance", ["1–5 km", "5–10 km", "10–20 km", ">20 km"]),

      SUB("3.2–3.3 Operations & Trip Details"),
      SEL("s3_truck_type", "9. Truck type", ["Tractor-mounted", "Truck-mounted"]),
      NUM("s3_tank_capacity", "10. Tank capacity", "Litres (L)", { step: 1 }),
      CHK("s3_systems_desludged", "11. Systems desludged", ["Septic tank", "Pits", "Apartment STP", "Others"]),
      NUM("s3_nonpeak_trips", "12. Non-peak season trips", "trips/day", { step: 1 }),
      TXT("s3_peak_months", "13. Peak season months", { placeholder: "e.g. June–September" }),
      NUM("s3_peak_trips_day", "14a. Peak season trips", "trips/day", { step: 1, group: "peaktrips" }),
      NUM("s3_peak_trips_week", "14b. Peak season trips", "trips/week", { step: 1, group: "peaktrips" }),
      NUM("s3_peak_trips_month", "14c. Peak season trips", "trips/month", { step: 1, group: "peaktrips" }),
      SEL("s3_avg_desludging_time", "15. Average desludging time", ["0–10 min", "10–20 min", "20–30 min", "30–45 min", ">45 min"]),
      SEL("s3_max_travel_distance", "16. Maximum travel distance to disposal site", ["0–5 km", "5–10 km", "10–20 km", "20–30 km", ">30 km"]),

      SUB("3.4 Practices, PPE & Safety"),
      CHK("s3_disposal_locations", "17. Disposal locations used", ["Open land", "Farmlands", "FSTP", "STP", "Drains", "Water bodies", "Others"]),
      TA("s3_hardened_sludge_handling", "18. Hardened sludge handling method"),
      SEL("s3_disinfectant_usage", "19. Disinfectant usage", YESNO),
      TA("s3_inaccessible_areas", "20. Inaccessible areas encountered"),
      SEL("s3_ppe_usage", "21. PPE usage", YESNO),
      CHK("s3_ppe_types", "22. PPE types used", ["Gloves", "Mask", "Gumboots", "Coverall", "Helmet", "Goggles"]),
      TA("s3_ppe_nonuse_reason", "23. Reasons for non-use of PPE"),
      CHK("s3_training_received", "24. Training received", ["PPE", "Hygiene", "ERSU", "None"]),

      SUB("3.5 Health, Barriers & Financials"),
      CHK("s3_health_issues", "25. Health issues in last 1 year", ["Diarrhea", "Skin rashes", "Musculoskeletal issues", "Respiratory issues", "Eye irritation", "None"]),
      NUM("s3_doctor_expense", "26. Doctor expenses per visit", "₹ per visit", { step: 1 }),
      SEL("s3_health_insurance", "27. Health insurance", YESNO),
      TA("s3_authority_barriers", "28. Barriers faced — authority related"),
      TA("s3_social_barriers", "29. Barriers faced — social"),
      TA("s3_business_barriers", "30. Barriers faced — business"),
      NUM("s3_charge_per_load", "31. Charge per load", "₹ per load", { step: 1 }),
      TA("s3_pricing_factors", "32. Factors affecting pricing"),
      NUM("s3_capex_cost", "33. Capital (capex) cost", "₹", { step: 1 }),
      NUM("s3_opex_labour", "34a. Monthly opex — labour", "₹ per month", { step: 1, group: "opex" }),
      NUM("s3_opex_fuel", "34b. Monthly opex — fuel", "₹ per month", { step: 1, group: "opex" }),
      NUM("s3_opex_maintenance", "34c. Monthly opex — maintenance", "₹ per month", { step: 1, group: "opex" }),
      NUM("s3_opex_tipping_fee", "34d. Monthly opex — tipping fee", "₹ per trip", { step: 1, group: "opex" }),
      TA("s3_fs_market_demand", "35. Faecal sludge market demand / payments received from farmers")
    ]
  },
  {
    id: "s4",
    title: "Section 4: Gram Panchayat / Community Interview",
    shortTitle: "Gram Panchayat",
    subTitle: "Rural Linkage",
    icon: "fa-people-roof",
    color: "#16a34a",
    description: "Target Respondent: Sarpanch / GP Villagers",
    fields: [
      TXT("s4_gp_name", "Gram Panchayat Name"),
      TXT("s4_resp_name_position", "Respondent Name & Position"),

      SUB("4.1 URL & Sanitation Demand"),
      TA("s4_iec_activities", "1. IEC and capacity-building activities for URL"),
      TA("s4_desludging_demand", "2. Demand for desludging services in GP"),
      TA("s4_willingness_to_pay", "3. Willingness to pay for desludging service", { placeholder: "Note the amount (₹) if one was quoted, and any conditions" }),

      SUB("4.2 Existing Sanitation Systems"),
      NUM("s4_ihhl_pct", "4a. IHHL percentage", "%", { max: 100, step: "0.1", group: "ihhl" }),
      TA("s4_ihhl_situation", "4b. IHHL existing situation", { group: "ihhl" }),
      CHK("s4_blackwater_mgmt", "5. Black water management (OSS types)", ["Single pits", "Twin pits", "Septic tanks", "Any other"]),
      CHK("s4_greywater_mgmt", "6. Grey water management", ["Onsite units", "Drains", "Any other"]),
      TA("s4_challenges_sarpanch", "7. GP sanitation challenges as perceived by Sarpanch"),
      TA("s4_challenges_residents", "8. GP sanitation challenges as perceived by residents")
    ]
  }
];

/* ============================================================================
   4) RENDERER + APP LOGIC — you shouldn't need to touch anything below
   ========================================================================== */
const state = { sectionIndex: 0, files: {} };

function autoTooltip(field) {
  if (field.tooltip) return field.tooltip;
  if (field.type === "number" && field.unit) return `Numbers only, in ${field.unit}.`;
  if (field.type === "date") return "Use the date picker to avoid format mistakes.";
  if (field.type === "select") return "Choose one option from the list.";
  if (field.type === "checkbox") return "Tick all that apply.";
  if (field.type === "file") return `Attach a file (JPG, PNG or PDF). Keep each file under ${CONFIG.MAX_FILE_MB} MB where possible.`;
  return "";
}

function fieldWrapper(field, innerHTML) {
  const req = field.required ? '<span class="req" title="Required">*</span>' : "";
  const icon = field.icon ? `<i class="fa-solid ${field.icon} field-icon"></i>` : "";
  const tip = autoTooltip(field);
  const tipHTML = tip
    ? `<button type="button" class="tip-btn" data-tip="${escapeAttr(tip)}" aria-label="Field help">
         <i class="fa-solid fa-circle-info"></i>
       </button>`
    : "";
  return `
    <div class="field ${field.group ? "field--grouped" : ""}" data-field-id="${field.id}">
      <label for="${field.id}">${icon}<span>${field.label}</span>${req}${tipHTML}</label>
      ${innerHTML}
      <p class="field-error" id="err-${field.id}"></p>
    </div>`;
}

function escapeAttr(s) { return String(s).replace(/"/g, "&quot;"); }
function escapeHTML(s) { return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

function renderField(field) {
  const req = field.required ? "required" : "";
  switch (field.type) {
    case "text":
      return fieldWrapper(field, `<input type="text" id="${field.id}" name="${field.id}" placeholder="${escapeAttr(field.placeholder || "Type your answer")}" ${req}>`);
    case "textarea":
      return fieldWrapper(field, `<textarea id="${field.id}" name="${field.id}" rows="3" placeholder="${escapeAttr(field.placeholder || "Type your answer")}" ${req}></textarea>`);
    case "tel":
      return fieldWrapper(field, `<input type="tel" id="${field.id}" name="${field.id}" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10-digit mobile number" ${req}>`);
    case "date":
      return fieldWrapper(field, `<input type="date" id="${field.id}" name="${field.id}" ${req}>`);
    case "number": {
      const min = field.min !== undefined ? `min="${field.min}"` : "";
      const max = field.max !== undefined ? `max="${field.max}"` : "";
      const step = field.step !== undefined ? `step="${field.step}"` : `step="any"`;
      const unit = field.unit ? `<span class="unit-badge">${escapeHTML(field.unit)}</span>` : "";
      return fieldWrapper(field, `
        <div class="input-with-unit">
          <input type="number" id="${field.id}" name="${field.id}" placeholder="0" ${min} ${max} ${step} ${req}>
          ${unit}
        </div>`);
    }
    case "select": {
      const opts = (field.options || []).map((o) => `<option value="${escapeAttr(o)}">${escapeHTML(o)}</option>`).join("");
      return fieldWrapper(field, `
        <select id="${field.id}" name="${field.id}" ${req}>
          <option value="">— Select —</option>
          ${opts}
        </select>`);
    }
    case "checkbox": {
      const hasOthers = (field.options || []).some((o) => /other/i.test(o));
      const boxes = (field.options || []).map((o, i) => `
        <label class="chk-pill">
          <input type="checkbox" name="${field.id}" value="${escapeAttr(o)}" data-group="${field.id}">
          <span>${escapeHTML(o)}</span>
        </label>`).join("");
      const otherInput = hasOthers
        ? `<input type="text" class="chk-other-text" id="${field.id}__other_text" placeholder="Please specify ‘Other’" style="display:none">`
        : "";
      return fieldWrapper(field, `<div class="chk-group" id="${field.id}">${boxes}</div>${otherInput}`);
    }
    case "file": {
      const multi = field.multiple ? "multiple" : "";
      return fieldWrapper(field, `
        <div class="file-drop" data-for="${field.id}">
          <input type="file" id="${field.id}" name="${field.id}" accept="${field.accept || "*"}" ${multi} ${req}>
          <div class="file-drop-hint"><i class="fa-solid fa-cloud-arrow-up"></i> Click to attach ${field.multiple ? "file(s)" : "a file"}</div>
          <div class="file-drop-list" id="${field.id}__list"></div>
        </div>`);
    }
    default:
      return "";
  }
}

function renderSectionFields(fields) {
  let html = "";
  let i = 0;
  while (i < fields.length) {
    const f = fields[i];
    if (f.type === "subheading") {
      html += `<h3 class="subheading">${escapeHTML(f.label)}</h3>`;
      i++;
      continue;
    }
    if (f.group) {
      const groupKey = f.group;
      const groupFields = [];
      while (i < fields.length && fields[i].group === groupKey) {
        groupFields.push(fields[i]);
        i++;
      }
      html += `<div class="field-grid">${groupFields.map(renderField).join("")}</div>`;
      continue;
    }
    html += renderField(f);
    i++;
  }
  return html;
}

function renderNav() {
  const nav = document.getElementById("sectionNav");
  if (!nav) return;
  nav.innerHTML = SECTIONS.map((s, i) => {
    const isActive = i === state.sectionIndex;
    const isCompleted = i < state.sectionIndex;
    return `
    <button type="button" 
            class="step-card ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}" 
            data-index="${i}" 
            style="--accent:${s.color}" 
            title="${s.title}"
            aria-current="${isActive ? "step" : "false"}">
      <div class="step-card-header">
        <span class="step-badge">
          <span class="step-num">${i + 1}</span>
          <i class="fa-solid fa-check step-done-icon"></i>
        </span>
        <span class="step-icon"><i class="fa-solid ${s.icon}"></i></span>
      </div>
      <div class="step-card-body">
        <span class="step-title">${s.shortTitle || s.title.replace(/^Section \d+: /, "")}</span>
        <span class="step-sub">${s.subTitle || ""}</span>
      </div>
      <div class="step-active-indicator"></div>
    </button>`;
  }).join("");

  nav.querySelectorAll(".step-card").forEach((btn) => {
    btn.addEventListener("click", () => goToSection(Number(btn.dataset.index)));
  });
}

function renderSections() {
  const main = document.getElementById("formSections");
  main.innerHTML = SECTIONS.map((s, i) => `
    <section class="survey-section ${i === state.sectionIndex ? "active" : ""}" data-index="${i}" style="--accent:${s.color}">
      <div class="section-head">
        <div class="section-icon"><i class="fa-solid ${s.icon}"></i></div>
        <div>
          <h2>${s.title}</h2>
          <p class="section-desc">${s.description}</p>
        </div>
      </div>
      <div class="section-fields">${renderSectionFields(s.fields)}</div>
    </section>`).join("");
  wireFileInputs();
  wireCheckboxOthers();
}

function goToSection(index, shouldScroll = true) {
  if (index < 0 || index >= SECTIONS.length) return;
  state.sectionIndex = index;
  document.querySelectorAll(".survey-section").forEach((sec) => {
    sec.classList.toggle("active", Number(sec.dataset.index) === index);
  });
  document.querySelectorAll(".step-card").forEach((btn) => {
    const bIndex = Number(btn.dataset.index);
    btn.classList.toggle("active", bIndex === index);
    btn.classList.toggle("completed", bIndex < index);
    btn.setAttribute("aria-current", bIndex === index ? "step" : "false");
  });
  document.getElementById("prevBtn").disabled = index === 0;
  document.getElementById("nextBtn").style.display = index === SECTIONS.length - 1 ? "none" : "inline-flex";
  document.getElementById("submitBtn").style.display = index === SECTIONS.length - 1 ? "inline-flex" : "none";
  updateProgress();
  if (shouldScroll) {
    const topTarget = document.getElementById("stepperContainer") || document.getElementById("formTop");
    if (topTarget) {
      window.scrollTo({ top: topTarget.offsetTop - 12, behavior: "smooth" });
    }
  }
}

function updateProgress() {
  const current = state.sectionIndex;
  const total = SECTIONS.length;
  const pct = Math.round(((current + 1) / total) * 100);

  const bar = document.getElementById("progressBar");
  if (bar) bar.style.width = pct + "%";

  const label = document.getElementById("progressLabel");
  if (label) label.textContent = `Section ${current + 1} of ${total}`;

  const pctBadge = document.getElementById("stepPctBadge");
  if (pctBadge) pctBadge.innerHTML = `<i class="fa-solid fa-chart-line"></i> ${pct}% Complete`;

  const curName = document.getElementById("stepCurrentName");
  if (curName && SECTIONS[current]) {
    curName.textContent = SECTIONS[current].title;
  }

  const stepBadge = document.getElementById("stepBadge");
  if (stepBadge) {
    stepBadge.innerHTML = `<i class="fa-solid fa-layer-group"></i> SECTION ${current + 1} OF ${total}`;
  }
}

/* ---- Location cascading dropdowns ---- */
function wireLocationDropdowns() {
  const stateSel = document.getElementById("state");
  const districtSel = document.getElementById("district");
  if (!stateSel || !districtSel) return;

  function fillDistrictOptions(districts) {
    districtSel.innerHTML = `<option value="">— Select District —</option>` +
      districts.map((d) => `<option value="${escapeAttr(d.name + (d.lgd ? ` [LGD: ${d.lgd}]` : ''))}">${escapeHTML(d.name)}${d.lgd ? ` [LGD: ${escapeHTML(d.lgd)}]` : ''}</option>`).join("") +
      `<option value="${LOCATION_OTHER}">Other (type manually)</option>`;
  }

  stateSel.addEventListener("change", () => {
    if (stateSel.value === LOCATION_OTHER) {
      swapForText(stateSel, "state");
      fillDistrictOptions([]);
      return;
    }
    const districts = DISTRICT_DATABASE[stateSel.value] || [];
    fillDistrictOptions(districts);
  });

  districtSel.addEventListener("change", () => {
    if (districtSel.value === LOCATION_OTHER) {
      swapForText(districtSel, "district");
    }
  });
}
function maybeSwapForText() { /* placeholder for future symmetry, no-op */ }
function swapForText(selectEl, key) {
  const input = document.createElement("input");
  input.type = "text";
  input.id = selectEl.id;
  input.name = selectEl.name || selectEl.id;
  input.placeholder = `Type ${key} name`;
  input.required = selectEl.required;
  input.className = "swapped-text";
  selectEl.replaceWith(input);
}

/* ---- Tooltips ---- */
function wireTooltips() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".tip-btn");
    document.querySelectorAll(".tip-bubble").forEach((b) => b.remove());
    if (!btn) return;
    const bubble = document.createElement("div");
    bubble.className = "tip-bubble";
    bubble.textContent = btn.dataset.tip;
    btn.appendChild(bubble);
    e.stopPropagation();
  });
}

/* ---- Checkbox "Others" free text reveal ---- */
function wireCheckboxOthers() {
  document.querySelectorAll(".chk-group").forEach((group) => {
    group.addEventListener("change", () => {
      const otherBox = [...group.querySelectorAll('input[type="checkbox"]')].find((c) => /other/i.test(c.value) && c.checked);
      const otherInput = document.getElementById(group.id + "__other_text");
      if (otherInput) otherInput.style.display = otherBox ? "block" : "none";
    });
  });
}

/* ---- File inputs: preview name + base64 capture ---- */
function wireFileInputs() {
  document.querySelectorAll('.file-drop input[type="file"]').forEach((input) => {
    input.addEventListener("change", async () => {
      const listEl = document.getElementById(input.id + "__list");
      const files = [...input.files];
      listEl.innerHTML = files.map((f) => `<div class="file-chip"><i class="fa-solid fa-paperclip"></i> ${escapeHTML(f.name)} (${(f.size / 1024 / 1024).toFixed(2)} MB)</div>`).join("");
      const oversize = files.find((f) => f.size / 1024 / 1024 > CONFIG.MAX_FILE_MB);
      if (oversize) listEl.innerHTML += `<div class="file-warn"><i class="fa-solid fa-triangle-exclamation"></i> "${escapeHTML(oversize.name)}" is larger than ${CONFIG.MAX_FILE_MB} MB — upload may be slow.</div>`;
      state.files[input.id] = await Promise.all(files.map(fileToBase64));
    });
  });
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, mimeType: file.type || "application/octet-stream", data: reader.result.split(",")[1] });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ---- Validation ---- */
function validateAll() {
  let firstInvalidSection = -1;
  let firstInvalidEl = null;
  SECTIONS.forEach((section, sIdx) => {
    section.fields.forEach((field) => {
      if (field.type === "subheading" || !field.required) return;
      const el = document.getElementById(field.id);
      const errEl = document.getElementById("err-" + field.id);
      let valid = true;
      if (field.type === "checkbox") {
        valid = document.querySelectorAll(`input[data-group="${field.id}"]:checked`).length > 0;
      } else if (el) {
        valid = el.value.trim() !== "" && (el.checkValidity ? el.checkValidity() : true);
      }
      if (errEl) errEl.textContent = valid ? "" : "This field is required.";
      if (!valid && firstInvalidSection === -1) {
        firstInvalidSection = sIdx;
        firstInvalidEl = el;
      }
    });
  });
  if (firstInvalidSection !== -1) {
    goToSection(firstInvalidSection);
    if (firstInvalidEl) setTimeout(() => firstInvalidEl.focus(), 300);
    return false;
  }
  return true;
}

/* ---- Collect + submit ---- */
function collectAnswers() {
  const answers = {};
  const filesPayload = {};
  SECTIONS.forEach((section) => {
    section.fields.forEach((field) => {
      if (field.type === "subheading") return;
      if (field.type === "checkbox") {
        const checked = [...document.querySelectorAll(`input[data-group="${field.id}"]:checked`)].map((c) => c.value);
        const otherInput = document.getElementById(field.id + "__other_text");
        if (otherInput && otherInput.value.trim() && checked.some((v) => /other/i.test(v))) {
          answers[field.id] = checked.filter((v) => !/other/i.test(v)).concat(`Other: ${otherInput.value.trim()}`).join(", ");
        } else {
          answers[field.id] = checked.join(", ");
        }
      } else if (field.type === "file") {
        filesPayload[field.id] = state.files[field.id] || [];
        answers[field.id] = (state.files[field.id] || []).map((f) => f.name).join(", ");
      } else {
        const el = document.getElementById(field.id);
        answers[field.id] = el ? el.value : "";
      }
    });
  });
  return { answers, files: filesPayload };
}

async function submitForm() {
  if (!validateAll()) return;
  if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL.indexOf("PASTE_YOUR") === 0) {
    alert("The Google Apps Script URL hasn't been set up yet. See the setup guide — paste your Web App URL into CONFIG.SCRIPT_URL in FSSM_Survey_Script.js.");
    return;
  }
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting…`;

  const { answers, files } = collectAnswers();
  const payload = { timestamp: new Date().toISOString(), answers, files };

  try {
    const res = await fetch(CONFIG.SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids CORS preflight against Apps Script
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({ status: "ok" }));
    if (data.status === "error") throw new Error(data.message || "Unknown error");
    showSuccess();
  } catch (err) {
    showError(err.message || "Could not reach the server. Check your internet connection and try again.");
    submitBtn.disabled = false;
    submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Survey`;
  }
}

function showSuccess() {
  document.getElementById("appWrap").style.display = "none";
  document.getElementById("successScreen").style.display = "flex";
}
function showError(msg) {
  const box = document.getElementById("errorToast");
  box.querySelector("span").textContent = msg;
  box.style.display = "flex";
  setTimeout(() => (box.style.display = "none"), 6000);
}

function resetForm() {
  state.sectionIndex = 0;
  state.files = {};
  document.getElementById("successScreen").style.display = "none";
  document.getElementById("appWrap").style.display = "block";
  renderSections();
  goToSection(0);
  document.querySelectorAll("input, textarea, select").forEach((el) => {
    if (el.tagName === "SELECT") el.selectedIndex = 0; else el.value = "";
  });
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = false;
  submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Submit Survey`;
}

/* ---- Init ---- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("survey_date_default") && (document.getElementById("survey_date_default").value = new Date().toISOString().slice(0, 10));
  renderNav();
  renderSections();
  wireLocationDropdowns();
  wireTooltips();
  goToSection(0, false);

  document.getElementById("prevBtn").addEventListener("click", () => goToSection(state.sectionIndex - 1));
  document.getElementById("nextBtn").addEventListener("click", () => goToSection(state.sectionIndex + 1));
  document.getElementById("submitBtn").addEventListener("click", submitForm);
  document.getElementById("newResponseBtn").addEventListener("click", resetForm);

  const dateInput = document.getElementById("survey_date");
  if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
});
