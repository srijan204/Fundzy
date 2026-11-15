# Fundzy AI assistant setup

1. In Cloudflare Workers, open the existing `fundzy-ai-api` Worker and replace its code with `backend/worker.js`.
2. Add `GEMINI_API_KEY` as a Worker Secret. Never place it in website JavaScript.
3. Optional Worker variable `ALLOWED_ORIGINS`: comma-separated allowed website origins. Defaults include `https://fundzy.co.in`, `https://www.fundzy.co.in`, and `https://srijan204.github.io`.
4. Optional variable `GEMINI_MODEL`: defaults to `gemini-2.5-flash`.
5. Deploy the Worker. Health endpoint: `https://fundzy-ai-api.imailsrijan.workers.dev/health`.
6. Deploy the website files. The chatbot frontend calls the Worker root endpoint.

The health endpoint confirms that the Worker is online and the secret is configured. It does not prove that an actual AI request succeeds. Test a chat message on the published website.

## Catalogue

This release contains 51 scholarship programme entries. The 51st entry is the National Overseas Scholarship for ST Students, linked to the Ministry of Tribal Affairs' official portal. Its 2026–27 application deadline was 15 July 2026, so it is not marked open on 15 November 2026. All entries should be checked against their latest official notices.

Course tags are search/discovery tags only, not proof of eligibility. Verify the exact eligible courses, award values, deadlines, fresh/renewal rules and document requirements on the official provider website.


## Updated multilingual scholarship assistant

The latest chatbot sends the website scholarship catalogue (`window.FUNDMENT_PROGRAMS`, currently 51 entries) and recent conversation history to the Worker. The Worker endpoint accepts `POST /chat` (and `POST /` for compatibility).

To activate these improvements on the live site:

1. In Cloudflare Workers, open `fundzy-ai-api` and choose **Edit code**.
2. Replace the Worker code with the complete contents of `backend/worker.js` from this package.
3. Keep the existing `GEMINI_API_KEY` secret. Do not put the key in website files.
4. If using a `GEMINI_MODEL` variable, set it to a model available to your Gemini API project (the packaged Worker defaults to `gemini-2.5-flash`).
5. Deploy the Worker.
6. Publish the website files, including `chatbot/chatbot.js` and `chatbot/chatbot.css`, to GitHub Pages.

The assistant is instructed to identify Srijan Gupta as Fundzy's founder/developer, answer scholarship questions using the 51 supplied catalogue entries, and respond in the user's language, including Hinglish and the 22 languages listed in India's Eighth Schedule. Language generation depends on the selected Gemini model's capabilities. Scholarship dates and eligibility must still be verified on official portals.
