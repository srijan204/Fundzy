# Fundzy

**Scholarship information, minus the overwhelm.**

Fundzy is an independent student information project for students in Uttar Pradesh and across India. It helps students discover scholarship programmes, understand eligibility pointers, prepare documents and find the official application portal.

## Features
- Search scholarship guides and filter by study level, state/coverage, category and listed application status.
- Read eligibility pointers, document-preparation checklists, source dates and official links.
- Redirect to the official provider to complete the real application.
- Track personal preparation and application status in the current browser.
- Export/import tracker data as JSON.
- Responsive layout for phones and desktops.
- Mobile navigation menu with accessible open/close controls.
- Light/dark theme toggle that remembers the choice in the current browser.

## Tech stack
- HTML5 (`index.html`)
- CSS3 (`styles.css`)
- Vanilla JavaScript (`app.js`)
- Scholarship data records (`data.js`)
- Browser `localStorage` for the local tracker
- JSON for tracker backup/export

## Run locally
1. Extract the project.
2. Open `index.html` in a modern browser.
3. If needed, run `python -m http.server 8000` in this directory and visit `http://localhost:8000`.

## Data accuracy
The catalogue is a manually maintained snapshot, not a live API and not a complete list of all scholarships. It was reviewed against official listings on 18 October 2026. NSP listings include several AY 2026–27 programmes with a student application deadline of 31 October 2026; Reliance Foundation 2026–27 UG/PG opportunities were announced, but a deadline was not confirmed in the reviewed announcement. These dates may change. Verify eligibility, deadlines, documents and live availability on the official portal before applying.

## Privacy
The prototype has no user accounts or document uploads. Tracker data is stored in the current browser and is not synced across devices. Do not enter Aadhaar numbers, bank details, passwords, OTPs or other sensitive information.

## Disclaimer
Fundzy is an independent information project and is not affiliated with or endorsed by a government department or scholarship authority. Actual applications, identity checks, document uploads and award decisions remain with the official provider.

## Copyright
Copyright © 2026 Fundzy. All rights reserved. No open-source license is granted.

## Official resources
- National Scholarship Portal: https://scholarships.gov.in/All-Scholarships
- Uttar Pradesh Scholarship Portal: https://scholarship.up.gov.in/
- PIB notice on NMMSS deadline extension for 2026–27: https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2317657&lang=1&reg=3
- Reliance Foundation Scholarships 2026–27 announcement: https://www.reliancefoundation.org/media/media-release/Reliance_Foundation_Scholarships_2026-27


## India-wide coverage and state portals
The main catalogue includes national programmes and selected state-specific guides. The state filter shows national programmes for the selected state, plus matching state/region-specific guides already in the catalogue. The state portal section provides verified starting links for NSP, Delhi, Maharashtra, Bihar, Odisha and Uttar Pradesh. It is not yet a complete catalogue of every state scheme; students should verify local schemes with the relevant official state department.

## Adding the four team photos
1. Create a folder named `images` next to `index.html`.
2. Save your four images as `member-1.jpg`, `member-2.jpg`, `member-3.jpg` and `member-4.jpg`.
3. In `index.html`, find the `Meet our little team` section.
4. Replace each `.team-photo-placeholder` block with an image, for example:
   `<img class="team-photo" src="images/member-1.jpg" alt="Member One">`
5. Update each member's name, course/branch and project role in the same section.


## Multi-page website update
- `index.html` — home page and original scholarship directory/tracker experience.
- `explore.html` — dedicated scholarship directory with search and study-level/status filters.
- `how-it-works.html` — student guide to discovery, eligibility, document preparation and official applications.
- `team.html` — team profiles and the supplied team photographs.
- `about.html` — project purpose, scope, accuracy notes and disclaimer.
- `site.js` — shared navigation and theme controls for the additional pages.
- `explore.js` — directory renderer for the dedicated Explore page.

## Course coverage in Fundzy AI
The assistant is designed for students across school, management (BBA/MBA/BBM), computer and IT (BCA/MCA), commerce, arts and humanities, science, engineering, diploma/polytechnic, medical, nursing, pharmacy, law, education, journalism, vocational programmes and research/PhD. Students can type any course; the chatbot must not assume eligibility unless the scheme rules confirm it.

## Chatbot suggestions and language
The chatbot opens with clickable suggested questions. It has no language selector and is instructed to respond in the language used by the student, including Hindi and Hinglish. Genuine Gemini replies require deploying `backend/worker.js` and configuring the Worker secrets described in `AI-SETUP.md`. Without that configuration, only the local catalogue fallback works.

## Catalogue accuracy reminder
The included NSP entries are dated listing snapshots, not a live government feed or a guarantee that every student can apply. Some listings may be renewal-only or have conditions not represented in the summary. Check the latest official scheme specification and portal before applying.


## Multi-page website update
- `index.html` — home page and original scholarship directory/tracker experience.
- `explore.html` — dedicated scholarship directory with search and study-level/status filters.
- `how-it-works.html` — student guide to discovery, eligibility, document preparation and official applications.
- `team.html` — team profiles and the supplied team photographs.
- `about.html` — project purpose, scope, accuracy notes and disclaimer.
- `site.js` — shared navigation and theme controls for the additional pages.
- `explore.js` — directory renderer for the dedicated Explore page.

## Course coverage in Fundzy AI
The assistant is designed for students across school, management (BBA/MBA/BBM), computer and IT (BCA/MCA), commerce, arts and humanities, science, engineering, diploma/polytechnic, medical, nursing, pharmacy, law, education, journalism, vocational programmes and research/PhD. Students can type any course; the chatbot must not assume eligibility unless the scheme rules confirm it.

## Chatbot suggestions and language
The chatbot opens with clickable suggested questions. It has no language selector and is instructed to respond in the language used by the student, including Hindi and Hinglish. Genuine Gemini replies require deploying `backend/worker.js` and configuring the Worker secrets described in `AI-SETUP.md`. Without that configuration, only the local catalogue fallback works.

## Catalogue accuracy reminder
The included NSP entries are dated listing snapshots, not a live government feed or a guarantee that every student can apply. Some listings may be renewal-only or have conditions not represented in the summary. Check the latest official scheme specification and portal before applying.


## Contact
For Fundzy questions and feedback: [info.fundzy@gmail.com](mailto:info.fundzy@gmail.com).

## Scholarship catalogue note
The catalogue contains 50 programme entries. Entries marked to check the official notice are discovery guides, not confirmation that applications are currently open. Always verify current eligibility, award details and deadlines with the linked official provider.


## Current catalogue release

This ZIP contains **51 scholarship programme entries**. It includes course filters for BBA / MBA / BBM, BCA / MCA, B.Com / M.Com, BA / MA, B.Sc / M.Sc, B.Tech / M.Tech, Diploma / Polytechnic, MBBS / BDS, Nursing / Pharmacy, LLB / LLM, B.Ed / M.Ed, PhD / Research, Journalism, Vocational courses and School education.

The catalogue is a discovery guide, not a live synchronized feed. Verify current eligibility, award amount, documents and application deadlines on the official provider website. Course tags are for filtering and do not establish eligibility.

## Contact

[info.fundzy@gmail.com](mailto:info.fundzy@gmail.com)
