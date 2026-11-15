(() => {
  "use strict";

  // The deployed Fundzy Worker exposes POST /chat. Keep the Gemini key on Cloudflare.
  const API_URL = "https://fundzy-ai-api.imailsrijan.workers.dev/chat";
  if (document.getElementById("fz-chat")) return;

  const launch = document.createElement("button");
  launch.id = "fz-launch";
  launch.type = "button";
  launch.innerHTML = '<span class="fz-launch-icon" aria-hidden="true">✦</span><span class="fz-launch-label">Ask Fundzy AI</span>';
  launch.setAttribute("aria-label", "Open Fundzy AI Assistant");
  launch.setAttribute("aria-expanded", "false");
  launch.setAttribute("aria-controls", "fz-chat");

  const panel = document.createElement("section");
  panel.id = "fz-chat";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", "Fundzy scholarship assistant");
  panel.innerHTML = `
    <header id="fz-head">
      <div class="fz-brand">
        <span class="fz-brand-mark" aria-hidden="true">✳</span>
        <span class="fz-brand-copy"><strong>Fundzy AI</strong><small>Your scholarship sidekick</small></span>
        <span class="fz-online"><i></i> Online</span>
      </div>
      <button id="fz-close" class="fz-icon-button" type="button" aria-label="Close chat">×</button>
    </header>
    <div id="fz-welcome">
      <span class="fz-welcome-spark" aria-hidden="true">✦</span>
      <strong>Hey there! What can I help you find?</strong>
      <p>Ask about scholarships, eligibility, documents or application steps. Chat in English, Hindi, Hinglish or any of India's 22 scheduled languages.</p>
    </div>
    <div id="fz-log" aria-live="polite" aria-relevant="additions text"></div>
    <div id="fz-suggestions">
      <span class="fz-suggest-label">QUICK QUESTIONS</span>
      <button type="button">Which scholarships are open now?</button>
      <button type="button">What documents should I prepare?</button>
    </div>
    <form id="fz-form">
      <label class="fz-sr-only" for="fz-input">Your scholarship question</label>
      <input id="fz-input" maxlength="4000" autocomplete="off" enterkeyhint="send" placeholder="Ask in any Indian language… / किसी भी भाषा में पूछें…" />
      <button id="fz-send" type="submit" aria-label="Send message"><span>Send</span><b aria-hidden="true">↑</b></button>
    </form>
    <div id="fz-hint">Independent student guide · Verify details on official portals. Never share Aadhaar, bank details, OTPs or passwords.</div>
  `;

  document.body.append(launch, panel);
  const log = panel.querySelector("#fz-log");
  const input = panel.querySelector("#fz-input");
  const form = panel.querySelector("#fz-form");
  const send = panel.querySelector("#fz-send");
  const close = panel.querySelector("#fz-close");
  const welcome = panel.querySelector("#fz-welcome");
  const suggestions = panel.querySelector("#fz-suggestions");
  const history = [];
  let busy = false;
  let previousFocus = null;

  function scrollLog() {
    requestAnimationFrame(() => { log.scrollTop = log.scrollHeight; });
  }

  function addMessage(text, who = "bot", extraClass = "") {
    const row = document.createElement("div");
    row.className = `fz-message-row ${who}`;
    const bubble = document.createElement("div");
    bubble.className = `fz-message ${who} ${extraClass}`.trim();
    bubble.textContent = text;
    row.append(bubble);
    log.append(row);
    scrollLog();
    return bubble;
  }

  function setOpen(open) {
    panel.hidden = !open;
    launch.setAttribute("aria-expanded", String(open));
    launch.classList.toggle("is-open", open);
    if (open) {
      previousFocus = document.activeElement;
      document.body.classList.add("fz-chat-open");
      window.setTimeout(() => input.focus({ preventScroll: true }), 60);
    } else {
      document.body.classList.remove("fz-chat-open");
      if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
      else launch.focus();
    }
  }

  function getCatalogue() {
    const list = Array.isArray(window.FUNDMENT_PROGRAMS) ? window.FUNDMENT_PROGRAMS : [];
    return list.slice(0, 100).map(p => ({
      name: p.name || "",
      department: p.department || "",
      providerType: p.providerType || "",
      levels: Array.isArray(p.levels) ? p.levels : [],
      courses: Array.isArray(p.courses) ? p.courses : [],
      states: Array.isArray(p.states) ? p.states : [],
      description: p.description || "",
      eligibility: Array.isArray(p.eligibility) ? p.eligibility : [],
      docs: Array.isArray(p.docs) ? p.docs : [],
      deadline: p.deadline || "",
      window: p.window || "",
      url: p.url || "",
      source: p.source || "",
      sourceDate: p.sourceDate || "",
      note: p.note || ""
    }));
  }

  function setBusy(value) {
    busy = value;
    send.disabled = value;
    input.disabled = value;
    send.querySelector("span").textContent = value ? "Wait" : "Send";
    send.querySelector("b").textContent = value ? "…" : "↑";
    form.classList.toggle("is-busy", value);
  }

  function localFallback(question) {
    const programs = Array.isArray(window.FUNDMENT_PROGRAMS) ? window.FUNDMENT_PROGRAMS : [];
    const words = question.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w => w.length > 2);
    const matches = programs.map(p => {
      const haystack = `${p.name || ""} ${p.department || ""} ${p.description || ""} ${(p.courses || []).join(" ")}`.toLowerCase();
      return { p, score: words.filter(word => haystack.includes(word)).length };
    }).filter(x => x.score).sort((a,b) => b.score-a.score).slice(0,3);
    if (!matches.length) return "The AI assistant is temporarily unavailable. Please try again shortly, or browse Fundzy's scholarship catalogue and official links.";
    return "Here are a few catalogue matches to explore:\n\n" + matches.map(({p}) =>
      `${p.name}\nProvider: ${p.department || "Not specified"}\nStatus: ${p.window === "open" ? "Listed open in the source snapshot — please recheck the official portal" : "Check the latest official notice"}\n${p.description || ""}\nOfficial source: ${p.url || "Not provided"}`
    ).join("\n\n");
  }

  async function ask(question) {
    if (!question || busy) return;
    welcome.hidden = true;
    suggestions.hidden = true;
    addMessage(question, "user");
    const pending = addMessage("Thinking…", "bot", "is-pending");
    const previous = history.slice(-8);
    history.push({ role: "user", content: question });
    setBusy(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: previous,
          programs: getCatalogue()
        }),
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `Chat service returned HTTP ${response.status}.`);
      const answer = String(data.reply || data.answer || "").trim();
      if (!answer) throw new Error("The AI service returned an empty answer.");
      pending.classList.remove("is-pending");
      pending.textContent = answer;
      history.push({ role: "assistant", content: answer });
    } catch (error) {
      let message = error && error.name === "AbortError"
        ? "The AI assistant took too long to respond."
        : (error && error.message) || "The AI assistant could not connect just now.";
      pending.classList.remove("is-pending");
      pending.textContent = `Connection issue: ${message}\n\n${localFallback(question)}`;
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
      if (!panel.hidden) input.focus({ preventScroll: true });
      scrollLog();
    }
  }

  launch.addEventListener("click", () => setOpen(panel.hidden));
  close.addEventListener("click", () => setOpen(false));
  panel.querySelectorAll("#fz-suggestions button").forEach(button => {
    button.addEventListener("click", () => ask(button.textContent.trim()));
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question || busy) return;
    input.value = "";
    ask(question);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) setOpen(false);
  });
  // Keep the composer visible when the on-screen keyboard changes the visual viewport.
  if (window.visualViewport) {
    const updateViewport = () => {
      if (!panel.hidden && window.innerWidth <= 640) {
        panel.style.setProperty("--fz-visual-height", `${window.visualViewport.height}px`);
      } else {
        panel.style.removeProperty("--fz-visual-height");
      }
    };
    window.visualViewport.addEventListener("resize", updateViewport);
    window.visualViewport.addEventListener("scroll", updateViewport);
  }
})();
