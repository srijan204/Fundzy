(() => {
  "use strict";

  // This test page talks to the deployed Cloudflare Worker.
  // The Gemini API key must remain in Cloudflare Secrets, never in this file.
  const API_URL = "https://fundzy-ai-api.imailsrijan.workers.dev/chat";

  const launch = document.createElement("button");
  launch.id = "fz-launch";
  launch.type = "button";
  launch.textContent = "✦ Ask Fundzy AI";
  launch.setAttribute("aria-label", "Open Fundzy AI scholarship assistant");

  const panel = document.createElement("section");
  panel.id = "fz-chat";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Fundzy AI test chat");
  panel.innerHTML = `
    <div id="fz-head">
      <div>
        <strong>✦ Fundzy AI Assistant</strong>
        <div style="font-size:11px;opacity:.78;margin-top:3px">Live Gemini test · scholarship help</div>
      </div>
      <button id="fz-close" type="button" aria-label="Close chat">×</button>
    </div>
    <div id="fz-log" aria-live="polite" aria-relevant="additions"></div>
    <div id="fz-suggestions">
      <span>TRY ASKING</span>
      
      <button type="button">Which scholarships are listed open?</button>
      <button type="button">What documents should I prepare?</button>
      <button type="button">Explain this in Hinglish</button>
    </div>
    <form id="fz-form">
      <input id="fz-input" maxlength="900" autocomplete="off" placeholder="Ask in English, Hindi or Hinglish…" aria-label="Your scholarship question">
      <button id="fz-send" type="submit">Send</button>
    </form>
    <div id="fz-hint">Test version. Never share Aadhaar, bank details, OTPs, passwords or sensitive documents. Verify deadlines on official portals.</div>
  `;

  document.body.append(launch, panel);

  const log = panel.querySelector("#fz-log");
  const input = panel.querySelector("#fz-input");
  const form = panel.querySelector("#fz-form");
  const send = panel.querySelector("#fz-send");
  const history = [];

  function addMessage(text, who = "bot") {
    const el = document.createElement("div");
    el.className = `msg ${who}`;
    el.textContent = text;
    log.append(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function addSources(container, sources) {
    if (!Array.isArray(sources) || !sources.length) return;
    const wrap = document.createElement("div");
    wrap.className = "fz-sources";
    wrap.style.cssText = "margin:0 8px 8px;font-size:12px;display:flex;flex-wrap:wrap;gap:8px;";
    const label = document.createElement("span");
    label.textContent = "Sources:";
    label.style.fontWeight = "700";
    wrap.append(label);
    for (const item of sources.slice(0, 5)) {
      try {
        const url = new URL(String(item.url || ""));
        if (!['https:', 'http:'].includes(url.protocol)) continue;
        const a = document.createElement("a");
        a.href = url.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = String(item.name || "Official source").slice(0, 90);
        a.style.cssText = "color:#6048c5;text-decoration:underline;text-underline-offset:2px;";
        wrap.append(a);
      } catch (_) {
        // Skip invalid source URLs.
      }
    }
    if (wrap.querySelector("a")) {
      container.after(wrap);
      log.scrollTop = log.scrollHeight;
    }
  }

  function getCatalogue() {
    const programs = Array.isArray(window.FUNDMENT_PROGRAMS)
      ? window.FUNDMENT_PROGRAMS
      : [];

    return programs.slice(0, 35).map((p) => ({
      name: p.name || "",
      department: p.department || "",
      category: p.kind || p.category || "",
      levels: Array.isArray(p.levels) ? p.levels : [],
      states: Array.isArray(p.states) ? p.states : [],
      description: p.description || "",
      eligibility: Array.isArray(p.eligibility) ? p.eligibility : [],
      documents: Array.isArray(p.docs) ? p.docs : (Array.isArray(p.documents) ? p.documents : []),
      deadline: p.deadline || "",
      listingStatus: p.window || p.listingStatus || "",
      officialUrl: p.url || p.officialUrl || "",
      source: p.source || "",
      sourceUrl: p.sourceUrl || "",
      sourceDate: p.sourceDate || "",
      note: p.note || ""
    }));
  }

  function setBusy(busy) {
    send.disabled = busy;
    input.disabled = busy;
    send.textContent = busy ? "…" : "Send";
  }

  addMessage("Hi! 👋 I'm Fundzy AI. Ask me about scholarships, eligibility pointers, documents or application steps. I can reply in English, Hindi or Hinglish. I'll use Fundzy's scholarship catalogue and flag details that need official verification.");

  launch.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    if (!panel.hidden) input.focus();
  });
  panel.querySelector("#fz-close").addEventListener("click", () => {
    panel.hidden = true;
    launch.focus();
  });

  panel.querySelectorAll("#fz-suggestions button").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.textContent.trim();
      form.requestSubmit();
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || send.disabled) return;

    input.value = "";
    addMessage(question, "user");
    const pending = addMessage("Thinking…", "bot");
    const previousHistory = history.slice(-8);
    history.push({ role: "user", content: question });
    setBusy(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: previousHistory,
          programs: getCatalogue()
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const detail = data.error || `Chat service returned HTTP ${response.status}.`;
        throw new Error(detail);
      }

      // The currently deployed Worker returns { answer, sources }.
      // Also accept { reply } to make this test page compatible with the kit Worker.
      const answer = String(data.answer || data.reply || "").trim();
      if (!answer) throw new Error("The AI service returned an empty answer.");

      pending.textContent = answer;
      history.push({ role: "model", content: answer });
      addSources(pending, data.sources);
    } catch (error) {
      pending.textContent = `I couldn't reach the AI service. ${error.message || "Please try again."} Check that the Worker is deployed, GEMINI_API_KEY is configured, and this page is opened from fundzy.co.in or srijan204.github.io.`;
    } finally {
      setBusy(false);
      input.focus();
      log.scrollTop = log.scrollHeight;
    }
  });
})();
