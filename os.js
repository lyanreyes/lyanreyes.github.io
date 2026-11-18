/* LyanOS: an interactive desktop-style portfolio for Lyan Reyes. Original code. */
(function () {
  "use strict";

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const isMobile = () => matchMedia("(max-width:760px)").matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem("lyanos." + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("lyanos." + k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- icons (original SVG tiles) ---------- */
  const G = {
    user: '<circle cx="24" cy="18" r="7"/><path d="M11 38c1.5-7 7-10 13-10s11.5 3 13 10"/>',
    folder: '<path d="M8 15a3 3 0 0 1 3-3h8l4 4h14a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3Z"/>',
    pdf: '<path d="M14 8h14l8 8v24H14Z"/><path d="M28 8v8h8"/><path d="M19 27h10M19 32h7"/>',
    term: '<rect x="8" y="11" width="32" height="26" rx="3"/><path d="m14 20 5 4-5 4M22 29h10"/>',
    mail: '<rect x="8" y="13" width="32" height="22" rx="3"/><path d="m9 15 15 11 15-11"/>',
    play: '<rect x="8" y="12" width="32" height="24" rx="4"/><path d="m21 19 9 5-9 5Z" fill="#fff"/>',
    globe: '<circle cx="24" cy="24" r="14"/><path d="M10 24h28M24 10c4 4 6 9 6 14s-2 10-6 14c-4-4-6-9-6-14s2-10 6-14Z"/>',
    bolt: '<path d="M26 7 13 27h10l-2 14 14-21H25Z" fill="#fff"/>',
    layout: '<rect x="9" y="10" width="30" height="28" rx="3"/><path d="M9 17h30M16 24h16M16 30h10"/>'
  };
  const tiles = {
    about: ["#3a7bff", "#22c3ff", G.user], projects: ["#f5b73b", "#ff8a3d", G.folder], resume: ["#ff5d73", "#ff8f6b", G.pdf],
    terminal: ["#0f1b36", "#24365f", G.term], contact: ["#18c29c", "#21a3ff", G.mail], video: ["#8a5cff", "#ff5fb6", G.play],
    browser: ["#2563eb", "#38d6ff", G.globe], catch: ["#1e3fae", "#38d6ff", G.bolt], simple: ["#334a7d", "#5a74ad", G.layout]
  };
  /* original app logos */
  const logos = {
    sidequest: '<rect width="48" height="48" rx="11" fill="#0A090D"/><rect x="9" y="9" width="30" height="30" rx="9" fill="#9CFF27"/><path d="M29.5 17.5c-1.2-1.6-3.2-2.5-5.5-2.5-3.3 0-5.6 1.8-5.6 4.4 0 5.6 11.4 3.4 11.4 9 0 2.7-2.5 4.6-5.9 4.6-2.6 0-4.8-1-6-2.8" fill="none" stroke="#0A090D" stroke-width="3.4" stroke-linecap="round"/><circle cx="36" cy="12" r="4" fill="#A985F7"/>',
    scandex: '<defs><linearGradient id="lg-sd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff4b2b"/><stop offset="1" stop-color="#c81d11"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#lg-sd)"/><g fill="none" stroke="#ffd23f" stroke-width="3.2" stroke-linecap="round"><path d="M10 17v-5a2 2 0 0 1 2-2h5M31 10h5a2 2 0 0 1 2 2v5M38 31v5a2 2 0 0 1-2 2h-5M17 38h-5a2 2 0 0 1-2-2v-5"/></g><rect x="17" y="14" width="14" height="20" rx="2.5" fill="#fff"/><rect x="19.5" y="16.5" width="9" height="8" rx="1.2" fill="#38d6ff"/><path d="M19.5 28h9M19.5 31h6" stroke="#c81d11" stroke-width="1.6" stroke-linecap="round"/><path d="M8 24h32" stroke="#7ef0b0" stroke-width="1.6" opacity=".9"/>',
    drift: '<rect width="48" height="48" rx="11" fill="#111318"/><g fill="#ff2a2a"><path d="M9 31 17 15h5l-8 16Z"/><path d="M18 31 26 15h5l-8 16Z" opacity=".85"/><path d="M27 31 35 15h5l-8 16Z" opacity=".65"/></g><path d="M8 35h32" stroke="#fff" stroke-width="2" stroke-dasharray="4 3" opacity=".7"/>',
    optics: '<rect width="48" height="48" rx="11" fill="#fff"/><path d="M5 27 20 24" stroke="#111" stroke-width="2"/><path d="M20 12 31 34H9Z" fill="#e9ecff" stroke="#111" stroke-width="1.8" stroke-linejoin="round"/><g stroke-width="2.2" stroke-linecap="round"><path d="M24 25 43 20" stroke="#ff3b3b"/><path d="M24.5 26 43 24" stroke="#ffb02e"/><path d="M25 27 43 28" stroke="#2ecc71"/><path d="M25 28 43 32" stroke="#3b82f6"/><path d="M25 29 42 36" stroke="#8b5cf6"/></g>',
    catch: '<defs><linearGradient id="lg-cm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1640"/><stop offset="1" stop-color="#1e3fae"/></linearGradient><radialGradient id="rg-cm" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#e9fbff"/><stop offset=".45" stop-color="#5fb8ff"/><stop offset="1" stop-color="#1a3fa8"/></radialGradient></defs><rect width="48" height="48" rx="11" fill="url(#lg-cm)"/><circle cx="24" cy="24" r="11" fill="url(#rg-cm)"/><ellipse cx="24" cy="24" rx="16" ry="5" fill="none" stroke="#c8f0ff" stroke-width="1.8" transform="rotate(-25 24 24)"/><path d="M25.5 17 20 25h4l-1.5 6 5.5-8h-4Z" fill="#fff"/>',
    astro: '<defs><linearGradient id="lg-as" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0e2a6b"/><stop offset="1" stop-color="#38d6ff"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#lg-as)"/><path d="M24 11c8 0 13 5 13 13s-5 14-13 14-13-5-13-13 5-14 13-14Z" fill="#9b8b78"/><path d="M20 12l2-6 3 6M26 12l3-5 2 6" fill="#bff0ff"/><ellipse cx="19.5" cy="23" rx="3" ry="3.6" fill="#38d6ff"/><ellipse cx="28.5" cy="23" rx="3" ry="3.6" fill="#38d6ff"/><path d="M20.5 30q3.5 2.6 7 0" stroke="#3a312a" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
  };
  function iconHTML(id) {
    const p = projects[id];
    if (logos[id]) return `<div class="ic"><svg viewBox="0 0 48 48">${logos[id]}</svg></div>`;
    const t = tiles[id] || tiles.browser;
    return `<div class="ic"><svg viewBox="0 0 48 48"><defs><linearGradient id="g-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${t[0]}"/><stop offset="1" stop-color="${t[1]}"/></linearGradient></defs><rect width="48" height="48" rx="11" fill="url(#g-${id})"/><g fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${t[2]}</g></svg></div>`;
  }

  /* ---------- content ---------- */
  const projects = {
    sidequest: {
      name: "SideQuest", full: "SideQuest: Find Gigs, Earn Fast", tag: "Mobile app · Team of 4 · 2026", icon: "img/screen-discover.png",
      shot: '<div class="shot phones"><img src="img/screen-discover.png" alt="Discover gigs screen"><img src="img/screen-gig.png" alt="Gig details screen"><img src="img/screen-client.png" alt="Client home screen"></div>',
      desc: "A location-based gig app for Batangas. Clients post small tasks, and nearby workers send offers, chat, get tracked live on a map, and get paid through GCash, with SideQuest holding the payment until the job is done.",
      bullets: ["<b>Built:</b> the Android app, a Flask website, a clickable prototype, and a Figma design system with 17 screens", "<b>Highlights:</b> PostGIS nearby search (1/5/10 km), realtime chat and tracking, over-the-air updates"],
      stack: ["React Native", "Expo", "TypeScript", "Supabase", "PostgreSQL + PostGIS", "Leaflet / OSM", "Flask", "Figma"],
      demo: { url: "demos/sidequest/index.html", label: "Try the prototype", w: 440, h: 820 },
      links: [["Download APK", "https://github.com/lyanreyes/sidequest/releases/latest/download/SideQuest.apk"], ["Source code", "https://github.com/lyanreyes/sidequest"], ["Design files", "https://github.com/lyanreyes/sidequest-design"]],
      extra: [["Watch promo video", "video"]]
    },
    scandex: {
      name: "ScanDex", full: "ScanDex: Trading Card Scanner", tag: "Machine learning · Web app · 2026", icon: "img/scandex.png",
      shot: '<div class="shot"><img src="img/scandex.png" alt="ScanDex scanner"></div>',
      desc: "Point your phone camera at a Pokémon trading card and ScanDex identifies it among 20,617 cards, shows its market price, and saves it to a digital binder.",
      bullets: ["<b>How:</b> six image fingerprints ranked by a learned logistic-regression model, plus an OCR check of the card number", "<b>Results:</b> 71% top-1, 80% top-5, and 97% precision on matches it auto-accepts. Written up as an IMRaD paper"],
      stack: ["Python", "JavaScript", "Computer vision", "Logistic regression", "Tesseract.js", "PWA"],
      demo: { url: "demos/scandex/index.html", label: "Open the live app", w: 1000, h: 700, camera: true },
      links: [["Source code", "https://github.com/lyanreyes/scandex"]]
    },
    drift: {
      name: "Drift District", full: "Drift District", tag: "3D game · Multiplayer · 2026", icon: "img/drift.png",
      shot: '<div class="shot"><img src="img/drift.png" alt="Drift District lobby"></div>',
      desc: "A free 3D racing game you play in the browser with friends. One person makes a lobby, sends the invite link, and everyone races, with no server and no install.",
      bullets: ["<b>Highlights:</b> peer-to-peer lobbies, several car classes and tracks, recorded engine sounds"],
      stack: ["Three.js", "PeerJS (WebRTC)", "JavaScript", "GitHub Pages"],
      demo: { url: "https://lyanreyes.github.io/drift-district/", label: "Play now", w: 1100, h: 700 },
      links: [["Source code", "https://github.com/lyanreyes/drift-district"]]
    },
    optics: {
      name: "Optics Lab", full: "Optics Lab", tag: "Education · Interactive web · 2026", icon: "img/optics.png",
      shot: '<div class="shot"><img src="img/optics.png" alt="Optics Lab"></div>',
      desc: "An interactive physics site for learning light and optics: reflection, mirrors, refraction and Snell's law, total internal reflection, and lenses. It has live simulations, quizzes, and a shared leaderboard.",
      bullets: [],
      stack: ["JavaScript", "HTML Canvas", "Firebase Realtime DB"],
      demo: { url: "demos/optics-lab/index.html", label: "Open Optics Lab", w: 1050, h: 700 },
      links: [["Source code", "https://github.com/lyanreyes/optics-lab"]]
    }
  };

  const apps = {
    about: { title: "About Me", w: 720, h: 600, render: renderAbout },
    projects: { title: "Projects", w: 820, h: 560, render: renderExplorer },
    resume: { title: "Lyan_Reyes_Resume.pdf", w: 760, h: 760, flush: true, render: renderResume },
    terminal: { title: "Terminal", w: 680, h: 440, flush: true, render: renderTerminal },
    contact: { title: "Contact", w: 460, h: 420, render: renderContact },
    video: { title: "SideQuest Promo.mp4", w: 820, h: 520, flush: true, render: () => '<video src="demos/sidequest-promo.mp4" controls playsinline style="flex:1;width:100%;min-height:0;background:#000"></video>' },
    catch: { title: "CatchaMon", w: 520, h: 720, flush: true, render: () => '<div class="game"><canvas></canvas><div class="game-hud"><span class="pill" data-hud="count">Caught: 0</span><span class="pill" data-hud="orbs">Orbs: 10</span></div><div class="game-msg"></div></div>', mount: mountCatch },
    simple: { title: "Simple view", action: () => { location.href = "classic.html"; } }
  };
  Object.keys(projects).forEach(id => { apps[id] = { title: projects[id].full, w: 760, h: 640, render: () => renderProject(id) }; });

  const desktopOrder = ["about", "projects", "sidequest", "scandex", "drift", "optics", "catch", "terminal", "resume", "video", "contact", "simple"];
  const labels = { about: "About Me", projects: "Projects", resume: "Resume.pdf", terminal: "Terminal", contact: "Contact", video: "Promo Video", catch: "CatchaMon", simple: "Simple View" };
  const label = id => labels[id] || projects[id].name;

  /* ---------- renderers ---------- */
  function renderAbout() {
    return `<div class="pad">
      <div class="about-top"><img src="img/lyan.png" alt="Lyan Reyes"><div><div class="eyebrow">whoami</div><h2 class="h">Hi, I'm Lyan Reyes.</h2><p class="muted">3rd-year BS Computer Science student · Sto. Tomas, Batangas, PH</p></div></div>
      <p style="margin-top:16px">I like turning class projects into things people can actually use: an app you can install, a site you can open on your phone, or a game you can play with friends tonight. I've built a location-based gig app for Android, a machine-learning card scanner, and a multiplayer browser racing game.</p>
      <p style="margin-top:10px" class="muted">I work in Agile-Scrum teams, write IMRaD research papers about what I build, and use AI coding tools every day, which has taught me to check AI output carefully for accuracy and reasoning. I'm bilingual in English and Tagalog.</p>
      <div class="cols" style="margin-top:6px">
        <div><h3 class="h">Education</h3><ul class="tl">
          <li><b>BS Computer Science</b><span>FAITH Colleges, Tanauan City · 2024 to present</span></li>
          <li><b>Senior High School</b><span>Fidelis Senior High School · 2022 to 2024</span></li>
          <li><b>Junior High School</b><span>Liceo De San Pablo · 2018 to 2022</span></li></ul></div>
        <div><h3 class="h">Skills</h3><div class="chips">
          ${["Python", "JavaScript", "TypeScript", "HTML/CSS", "SQL", "React Native", "Expo", "Flask", "Three.js", "Supabase", "PostGIS", "Git & GitHub", "Figma", "Claude Code"].map(s => `<span>${s}</span>`).join("")}
          </div><h3 class="h">Languages &amp; writing</h3><div class="chips">${["English", "Tagalog", "Editing", "Fact-checking", "Prompt writing", "Rating AI responses"].map(s => `<span>${s}</span>`).join("")}</div></div>
      </div>
      <div class="btns"><button class="btn primary" data-open="projects">See my projects</button><button class="btn" data-open="resume">Resume</button><button class="btn" data-open="contact">Contact</button></div>
    </div>`;
  }

  function renderExplorer() {
    const items = Object.keys(projects).map(id => { const p = projects[id];
      return `<button class="ex-item" data-open="${id}"><div class="th"><img src="${p.icon}" alt="" loading="lazy"></div><b>${p.name}</b><small>${p.tag}</small></button>`; }).join("");
    return `<div class="explorer">
      <aside class="ex-side">
        <button class="on" data-open="projects">${iconHTML("projects")}Projects</button>
        <button data-open="about">${iconHTML("about")}About Me</button>
        <button data-open="resume">${iconHTML("resume")}Resume.pdf</button>
        <button data-open="catch">${iconHTML("catch")}CatchaMon</button>
        <button data-open="terminal">${iconHTML("terminal")}Terminal</button>
      </aside>
      <div class="ex-main"><div class="ex-bar"><span class="path">C:\\Users\\Lyan\\Projects</span></div>
        <div class="ex-grid">${items}</div>
        <div class="ex-status">${Object.keys(projects).length} items · open one to see details and live demos</div></div>
    </div>`;
  }

  function renderProject(id) {
    const p = projects[id];
    const links = p.links.map(([t, u]) => `<a class="btn" href="${u}" target="_blank" rel="noopener">${t}</a>`).join("");
    const extra = (p.extra || []).map(([t, a]) => `<button class="btn" data-open="${a}">${t}</button>`).join("");
    return `<div class="pad">${p.shot}
      <div class="eyebrow" style="margin-top:18px">${p.tag}</div><h2 class="h">${p.full}</h2>
      <p class="muted">${p.desc}</p>${p.bullets.length ? `<ul class="b">${p.bullets.map(b => `<li>${b}</li>`).join("")}</ul>` : ""}
      <div class="chips" style="margin-top:14px">${p.stack.map(s => `<span>${s}</span>`).join("")}</div>
      <div class="btns"><button class="btn primary" data-demo="${id}">▶ ${p.demo.label}</button>${extra}${links}
        <a class="btn" href="${p.demo.url}" target="_blank" rel="noopener">Open in new tab ↗</a></div></div>`;
  }

  function renderResume() {
    const dl = '<div class="br-bar"><span class="url">Lyan_Reyes_Resume.pdf</span><a href="Lyan_Reyes_Resume.pdf" download title="Download" aria-label="Download"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14"/></svg></a><a href="Lyan_Reyes_Resume.pdf" target="_blank" rel="noopener" title="Open in new tab" aria-label="Open in new tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg></a></div>';
    if (isMobile()) return dl + '<div class="pdf-fallback"><p class="muted">PDFs open best in your phone\'s viewer.</p><div class="btns" style="justify-content:center"><a class="btn primary" href="Lyan_Reyes_Resume.pdf" target="_blank" rel="noopener">Open resume</a><a class="btn" href="Lyan_Reyes_Resume.pdf" download>Download</a></div></div>';
    return dl + '<iframe class="pdf" src="Lyan_Reyes_Resume.pdf#view=FitH" title="Resume"></iframe>';
  }

  function renderContact() {
    return `<div class="pad"><div class="eyebrow">contact</div><h2 class="h">Let's work together.</h2>
      <p class="muted">Open to internships, freelance projects, and AI-training work.</p>
      <div class="btns" style="flex-direction:column;align-items:stretch">
        <a class="btn primary" href="mailto:reyeslyanf@gmail.com">✉ reyeslyanf@gmail.com</a>
        <a class="btn" href="https://github.com/lyanreyes" target="_blank" rel="noopener">GitHub · github.com/lyanreyes</a>
        <button class="btn" data-open="resume">View resume</button></div></div>`;
  }

  function browserHTML(url, title) {
    return `<div class="br-bar">
      <button data-act="reload" title="Reload" aria-label="Reload"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/></svg></button>
      <span class="url">${esc(new URL(url, location.href).href)}</span>
      <a href="${esc(url)}" target="_blank" rel="noopener" title="Open in new tab" aria-label="Open in new tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg></a></div>
      <iframe class="frame" src="${esc(url)}" title="${esc(title)}" allow="camera; fullscreen; autoplay" allowfullscreen></iframe>`;
  }

  /* ---------- window manager ---------- */
  const winLayer = $("#windows"), tasksEl = $("#tasks");
  const wins = new Map(); let z = 10, cascade = 0;

  function openApp(id, opt = {}) {
    const app = apps[id];
    if (app && app.action) { app.action(); return; }
    const key = opt.key || id;
    if (wins.has(key)) { const w = wins.get(key); w.el.classList.remove("min"); focus(key); return; }
    const title = opt.title || app.title;
    const W = Math.min(opt.w || app.w, innerWidth - 40), H = Math.min(opt.h || app.h, innerHeight - 52 - 40);
    const x = Math.max(10, Math.min(130 + cascade * 30, innerWidth - W - 10)), y = Math.max(10, Math.min(24 + cascade * 30, innerHeight - 52 - H - 10));
    cascade = (cascade + 1) % 8;
    const w = el("section", "win"); w.setAttribute("role", "dialog"); w.setAttribute("aria-label", title);
    Object.assign(w.style, { left: x + "px", top: y + "px", width: W + "px", height: H + "px" });
    w.innerHTML = `<header class="titlebar">${iconHTML(opt.icon || id)}<span class="t">${esc(title)}</span>
      <button class="wbtn mn" aria-label="Minimize"><svg viewBox="0 0 12 12"><path d="M1 6h10" stroke="currentColor" stroke-width="1.4"/></svg></button>
      <button class="wbtn mx" aria-label="Maximize"><svg viewBox="0 0 12 12"><rect x="1.5" y="1.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1.3"/></svg></button>
      <button class="wbtn x" aria-label="Close"><svg viewBox="0 0 12 12"><path d="m2 2 8 8M10 2l-8 8" stroke="currentColor" stroke-width="1.4"/></svg></button></header>
      <div class="win-body${(opt.flush || (app && app.flush)) ? " flush" : ""}">${opt.html || app.render()}</div><div class="grip"></div>`;
    winLayer.appendChild(w);
    const task = el("button", "task", `${iconHTML(opt.icon || id)}<span>${esc(opt.taskLabel || label(id) || title)}</span>`);
    task.title = title; tasksEl.appendChild(task);
    const rec = { el: w, task, cleanup: null };
    wins.set(key, rec);
    task.onclick = () => { if (w.classList.contains("min")) { w.classList.remove("min"); focus(key); } else if (w.classList.contains("focused")) { w.classList.add("min"); w.classList.remove("focused"); task.classList.remove("active"); } else focus(key); };
    $(".x", w).onclick = () => close(key);
    $(".mn", w).onclick = () => { w.classList.add("min"); w.classList.remove("focused"); task.classList.remove("active"); };
    $(".mx", w).onclick = () => w.classList.toggle("max");
    $(".titlebar", w).ondblclick = e => { if (!e.target.closest(".wbtn") && !isMobile()) w.classList.toggle("max"); };
    w.addEventListener("pointerdown", () => focus(key), true);
    drag(w, $(".titlebar", w)); resize(w, $(".grip", w));
    if (app && app.mount) rec.cleanup = app.mount($(".win-body", w), w);
    if (opt.mount) rec.cleanup = opt.mount($(".win-body", w), w);
    focus(key);
  }
  function close(key) {
    const r = wins.get(key); if (!r) return;
    if (r.cleanup) try { r.cleanup(); } catch (e) {}
    r.el.remove(); r.task.remove(); wins.delete(key);
  }
  function focus(key) {
    wins.forEach((r, k) => { const on = k === key; r.el.classList.toggle("focused", on); r.task.classList.toggle("active", on && !r.el.classList.contains("min")); });
    const r = wins.get(key); if (r) r.el.style.zIndex = ++z;
  }
  function drag(w, handle) {
    handle.addEventListener("pointerdown", e => {
      if (e.target.closest(".wbtn") || isMobile() || w.classList.contains("max") || e.button !== 0) return;
      const sx = e.clientX, sy = e.clientY, ox = w.offsetLeft, oy = w.offsetTop;
      handle.setPointerCapture(e.pointerId); document.body.classList.add("dragging");
      const frames = winLayer.querySelectorAll("iframe"); frames.forEach(f => f.style.pointerEvents = "none");
      const mv = ev => {
        const nx = Math.min(Math.max(ox + ev.clientX - sx, 60 - w.offsetWidth), innerWidth - 60);
        const ny = Math.min(Math.max(oy + ev.clientY - sy, 0), innerHeight - 52 - 38);
        w.style.left = nx + "px"; w.style.top = ny + "px";
      };
      const up = () => { handle.removeEventListener("pointermove", mv); handle.removeEventListener("pointerup", up); handle.removeEventListener("pointercancel", up); frames.forEach(f => f.style.pointerEvents = ""); };
      handle.addEventListener("pointermove", mv); handle.addEventListener("pointerup", up); handle.addEventListener("pointercancel", up);
    });
  }
  function resize(w, grip) {
    grip.addEventListener("pointerdown", e => {
      if (isMobile()) return; e.preventDefault(); e.stopPropagation();
      const sx = e.clientX, sy = e.clientY, ow = w.offsetWidth, oh = w.offsetHeight;
      grip.setPointerCapture(e.pointerId);
      const frames = winLayer.querySelectorAll("iframe"); frames.forEach(f => f.style.pointerEvents = "none");
      const mv = ev => { w.style.width = Math.max(300, ow + ev.clientX - sx) + "px"; w.style.height = Math.max(200, oh + ev.clientY - sy) + "px"; };
      const up = () => { grip.removeEventListener("pointermove", mv); grip.removeEventListener("pointerup", up); frames.forEach(f => f.style.pointerEvents = ""); };
      grip.addEventListener("pointermove", mv); grip.addEventListener("pointerup", up);
    });
  }
  function openDemo(id) {
    const p = projects[id], d = p.demo;
    openApp(id, { key: "demo-" + id, title: p.name + " · live demo", taskLabel: p.name + " demo", flush: true, w: d.w, h: d.h, html: browserHTML(d.url, p.name), icon: "browser" });
  }

  /* delegated clicks inside windows */
  winLayer.addEventListener("click", e => {
    const o = e.target.closest("[data-open]"); if (o) { openApp(o.dataset.open); return; }
    const d = e.target.closest("[data-demo]"); if (d) { openDemo(d.dataset.demo); return; }
    const r = e.target.closest('[data-act="reload"]'); if (r) { const f = r.closest(".win").querySelector("iframe"); if (f) f.src = f.src; }
  });

  /* ---------- Rocky: the floating astronaut you can chat with ---------- */
  apps.astro = { title: "Rocky · Mission Chat", w: 440, h: 600, flush: true, render: () =>
    '<div class="chat"><div class="chat-head"><i></i><span style="flex:1">ROCKY-01 ONLINE · ask about Lyan, his projects, or space</span><button class="voice" aria-label="Toggle Rocky voice"></button></div><div class="chat-log" aria-live="polite"></div>' +
    '<div class="chat-chips">' + ["Who is Lyan?", "Show projects", "What are his skills?", "How do I contact him?", "Tell me a space fact", "Play a game"].map(q => `<button>${q}</button>`).join("") + '</div>' +
    '<form class="chat-in"><input placeholder="Type a message…" aria-label="Message Rocky" autocomplete="off"><button type="submit">Send</button></form></div>',
    mount: mountRocky };
  labels.astro = "Ask Rocky";
  if (window.speechSynthesis) { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); }
  function mountRocky(body) {
    const log = $(".chat-log", body), form = $("form", body), inp = $("input", body);
    const add = (html, who) => { const m = el("div", "msg " + who, html); log.appendChild(m); log.scrollTop = log.scrollHeight; return m; };
    const facts = [
      "A day on Venus is longer than its year. It spins that slowly! 🪐",
      "Neutron stars are so dense that a teaspoon of one would weigh about a billion tonnes.",
      "Footprints left on the Moon can last millions of years, because there's no wind to blow them away.",
      "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.",
      "Jupiter's Great Red Spot is a storm wider than Earth that has lasted hundreds of years."
    ];
    const jokes = ["Why did the astronaut break up with the app? It needed more space. 🚀", "How do you organize a space party? You planet. 🪐", "I tried to write a joke about the Moon, but it didn't have enough atmosphere."];
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const rules = [
      [/^(hi|hello|hey|yo|kumusta|musta|hoy)\b/, () => "Hey there, space traveler! 👋 I'm Rocky, Lyan's mission assistant. Ask me about Lyan, his projects, skills, or how to reach him."],
      [/who.*(lyan|he|you made|owner|this)|about lyan|tell me about/, () => { openApp("about"); return "Lyan Reyes is a 3rd-year BS Computer Science student at FAITH Colleges in Batangas, Philippines. He builds and ships real apps: a gig app for Android, a machine-learning card scanner, and a multiplayer racing game. I opened his About window for you!"; }],
      [/sidequest|gig/, () => { openApp("sidequest"); return "SideQuest is a location-based gig app made by Lyan's team of 4. Clients post tasks, and nearby workers send offers, chat, and get paid via GCash. It's built with React Native, Expo and Supabase. I opened it for you, and you can even download the APK there!"; }],
      [/scandex|scan|card/, () => { openApp("scandex"); return "ScanDex identifies trading cards from a phone photo among 20,000+ cards using image fingerprints and a learned ranker: 71% top-1 and 97% precision on auto-accepted matches. Opening it now 🔍"; }],
      [/drift|race|racing|car/, () => { openApp("drift"); return "Drift District is a free 3D multiplayer racing game in the browser. Make a lobby, send the link, and race your friends. No server needed! 🏎️"; }],
      [/optic|physics|light|lens|mirror/, () => { openApp("optics"); return "Optics Lab teaches light and optics with interactive simulations and quizzes. Opening it for you 🔦"; }],
      [/project|work|portfolio|built|made|apps?\b/, () => { openApp("projects"); return "Here's Lyan's project folder! His highlights are SideQuest (mobile app), ScanDex (ML scanner), Drift District (3D game) and Optics Lab (physics site). Ask me about any of them."; }],
      [/skill|stack|language|tech|know|code|program/, () => "Lyan works with Python, JavaScript, TypeScript, SQL, React Native + Expo, Flask, Three.js, Supabase/PostGIS, Git, and Figma. He's also bilingual in English and Tagalog, and good at writing, editing and fact-checking."],
      [/contact|email|hire|reach|message|intern|job|work with/, () => 'You can email Lyan at <a href="mailto:reyeslyanf@gmail.com">reyeslyanf@gmail.com</a> or check <a href="https://github.com/lyanreyes" target="_blank" rel="noopener">github.com/lyanreyes</a>. He\'s open to internships, freelance projects, and AI-training work. 📬'],
      [/resume|cv/, () => { openApp("resume"); return "Here's Lyan's resume. You can download it from the window toolbar. 📄"; }],
      [/school|study|college|education|faith|student/, () => "Lyan is taking BS Computer Science at FAITH Colleges in Tanauan City, Batangas (2024 to present). Before that, he finished senior high at Fidelis Senior High School."],
      [/where|location|from|batangas|philippines/, () => "Lyan is from Sto. Tomas, Batangas, Philippines 🇵🇭. Me? I chipped off an asteroid somewhere past that blue planet."],
      [/game|play|catch|bored/, () => { openApp("catch"); return "Try CatchaMon! Flick the orb (or tap the creature) to catch a Voltbit. Rare ones are hiding out there ✨"; }],
      [/fact|space|planet|star|universe|galaxy/, () => pick(facts)],
      [/joke|funny|laugh/, () => pick(jokes)],
      [/terminal|command|hack/, () => { openApp("terminal"); return "Opening the terminal. Type <b>help</b> to see the commands 💻"; }],
      [/thank|salamat|ty\b|nice|cool|awesome|great/, () => "Anytime! 🚀 Anything else you'd like to know about Lyan?"],
      [/who are you|your name|what are you/, () => "I'm Rocky, a little space boulder with crystal eyes, floating in a bubble helmet around Lyan's portfolio. I answer from a script Lyan wrote, so I know a lot about him but not everything!"],
      [/bye|goodbye|see you/, () => "Safe travels, space traveler! 👋"]
    ];
    function reply(q) {
      const s = q.toLowerCase().trim();
      for (const [re, fn] of rules) if (re.test(s)) return fn();
      return "Hmm, my antenna didn't catch that 📡. Try asking about Lyan, his projects (SideQuest, ScanDex, Drift District, Optics Lab), his skills, his resume, or how to contact him.";
    }
    /* robot voice: robot-style text + spoken reply (Web Speech API) */
    let voiceOn = store.get("rockyVoice", true);
    const vbtn = $(".voice", body);
    const setV = () => { vbtn.textContent = voiceOn ? "🔊" : "🔇"; vbtn.title = voiceOn ? "Mute Rocky" : "Unmute Rocky"; };
    setV();
    vbtn.onclick = () => { voiceOn = !voiceOn; store.set("rockyVoice", voiceOn); setV(); if (!voiceOn && window.speechSynthesis) speechSynthesis.cancel(); };
    const pre = ["BEEP BOOP.", "*WHIRR CLICK*", "PROCESSING… DONE.", "BZZT.", "QUERY RECEIVED."], post = ["BEEP.", "END OF TRANSMISSION.", "BOOP.", "*CLICK*"];
    const robo = html => `<span class="robo">${pick(pre)}</span> ${html} <span class="robo">${pick(post)}</span>`;
    function speak(html) {
      if (!voiceOn || !window.speechSynthesis) return;
      const d = el("div"); d.innerHTML = html; d.querySelectorAll(".robo").forEach(n => n.remove());
      const text = d.textContent.replace(/[\u{1F300}-\u{1FAFF}☀-➿️]/gu, "").replace(/\*/g, "").replace(/\bLyan\b/g, "Lee-yan");
      speechSynthesis.cancel();
      /* human-sounding voice, pitched a little low and steady so it still feels like a friendly robot */
      const u = new SpeechSynthesisUtterance(text); u.pitch = 1.25; u.rate = 0.9; u.volume = 1;
      const vs = speechSynthesis.getVoices(), en = vs.filter(x => /^en/i.test(x.lang));
      const pref = [/natural/i, /google us english/i, /guy|andrew|brian|christopher|eric/i, /aria|jenny|samantha|google uk english/i, /david|daniel|alex/i];
      let v = null; for (const re of pref) { v = en.find(x => re.test(x.name)); if (v) break; }
      v = v || en[0];
      if (v) u.voice = v;
      speechSynthesis.speak(u);
    }
    function send(q) {
      if (!q.trim()) return; add(esc(q), "me");
      const t = add('ROCKY IS COMPUTING<span class="dots">...</span>', "bot typing");
      setTimeout(() => { t.remove(); const r = robo(reply(q)); add(r, "bot"); speak(r); }, 500 + Math.random() * 450);
    }
    add(robo("GREETINGS, HUMAN. I am <b>Rocky</b> 🪨, space rock unit and Lyan's mission buddy. Ask me anything about Lyan and his work, or tap a suggestion below."), "bot");
    form.addEventListener("submit", e => { e.preventDefault(); const v = inp.value; inp.value = ""; send(v); });
    $(".chat-chips", body).addEventListener("click", e => { const b = e.target.closest("button"); if (b) send(b.textContent); });
    if (!isMobile()) setTimeout(() => inp.focus(), 60);
  }
  /* Rocky controller: crawls on his ship, tethered, draggable, does tricks when tapped */
  (function rockyController() {
    const root = $("#astro"), svg = $(".astro-svg", root), rk = $("#rk"), tether = $("#tether");
    let x = 0, y = 0, vx = 0, vy = 0, target = 0, held = false, moved = false, start = null, off = { x: 0, y: 0 };
    let nextAt = performance.now() + 1500, busyUntil = 0;
    const MIN = -70, MAX = 48, LEN = 340;           /* hull range and tether length (svg units) */
    const toSvg = e => { const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
    const setCls = (c, on) => root.classList.toggle(c, on);
    function trick() {
      const t = ["hopping", "waving", "spinning", "dance"][Math.floor(Math.random() * 4)], now = performance.now();
      ["hopping", "waving", "spinning", "looking"].forEach(c => setCls(c, false)); void root.offsetWidth;
      if (t === "dance") { setCls("walking", true); setCls("hopping", true); setTimeout(() => { setCls("walking", false); setCls("hopping", false); }, 900); busyUntil = now + 1000; }
      else { setCls(t, true); const d = t === "waving" ? 2500 : 750; setTimeout(() => setCls(t, false), d); busyUntil = now + d; }
      nextAt = busyUntil + 900;
    }
    rk.addEventListener("pointerdown", e => {
      e.stopPropagation(); e.preventDefault();
      const p = toSvg(e); start = { cx: e.clientX, cy: e.clientY }; off = { x: p.x - x, y: p.y - y }; moved = false;
      rk.setPointerCapture(e.pointerId);
    });
    rk.addEventListener("pointermove", e => {
      if (!start) return;
      if (!moved && Math.hypot(e.clientX - start.cx, e.clientY - start.cy) > 6) { moved = true; held = true; setCls("held", true); setCls("walking", false); }
      if (!held) return;
      const p = toSvg(e); let nx = p.x - off.x, ny = p.y - off.y;
      const d = Math.hypot(nx - 8, ny + 12); if (d > LEN) { nx = 8 + (nx - 8) * LEN / d; ny = -12 + (ny + 12) * LEN / d; }
      vx = nx - x; vy = ny - y; x = nx; y = ny;
    });
    const release = () => { if (!start) return; if (!moved) trick(); start = null; held = false; setCls("held", false); target = Math.max(MIN, Math.min(MAX, x)); };
    rk.addEventListener("pointerup", release); rk.addEventListener("pointercancel", release);
    rk.addEventListener("click", e => e.stopPropagation());
    root.addEventListener("click", e => { if (!e.target.closest("#rk")) openApp("astro"); });
    root.addEventListener("keydown", e => { if (e.key === "t") trick(); });

    function frame(now) {
      if (!held) {
        const onHull = Math.abs(y) < .4 && Math.abs(vy) < .4 && x >= MIN - .5 && x <= MAX + .5;
        if (!onHull) { /* spring back along the tether */
          const tx = Math.max(MIN, Math.min(MAX, x));
          vx = (vx + (tx - x) * .06) * .86; vy = (vy + (0 - y) * .06) * .86; x += vx; y += vy;
          if (Math.abs(y) < .4 && Math.abs(vy) < .4) { y = 0; vy = 0; }
        } else if (now > busyUntil) {
          y = 0;
          if (Math.abs(target - x) > .6) { const dir = Math.sign(target - x); x += dir * .55; setCls("walking", true); setCls("face-left", dir < 0); }
          else { setCls("walking", false); if (now > nextAt) {
            const r = Math.random();
            if (r < .55) target = MIN + Math.random() * (MAX - MIN);
            else if (r < .7) { setCls("looking", true); setTimeout(() => setCls("looking", false), 1600); }
            else if (r < .8) trick();
            nextAt = now + 1500 + Math.random() * 2500;
          } }
        }
      }
      rk.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      const ax = 101, ay = 110, bx = 110 + x, by = 50 + y, d = Math.hypot(bx - ax, by - ay);
      const sag = Math.max(0, 40 - d * .12);
      tether.setAttribute("d", `M${ax} ${ay} Q${(ax + bx) / 2} ${(ay + by) / 2 + sag} ${bx} ${by}`);
      tether.setAttribute("opacity", d > 18 ? "0.9" : "0");
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();

  /* ---------- desktop ---------- */
  const desk = $("#desktop");
  desktopOrder.forEach(id => {
    const b = el("button", "icon", `${iconHTML(id)}<span>${label(id)}</span>`);
    b.dataset.id = id; b.title = isMobile() ? label(id) : "Double-click to open";
    b.addEventListener("click", () => {
      if (isMobile() || matchMedia("(pointer:coarse)").matches) { openApp(id); return; }
      desk.querySelectorAll(".icon.sel").forEach(i => i.classList.remove("sel")); b.classList.add("sel");
    });
    b.addEventListener("dblclick", () => openApp(id));
    b.addEventListener("keydown", e => { if (e.key === "Enter") openApp(id); });
    desk.appendChild(b);
  });
  desk.addEventListener("click", e => { if (e.target === desk) desk.querySelectorAll(".icon.sel").forEach(i => i.classList.remove("sel")); });

  /* ---------- start menu ---------- */
  const sm = $("#startmenu"), sb = $("#startbtn");
  sm.innerHTML = `<div class="sm-head"><img src="img/lyan.png" alt=""><div><b>Lyan Reyes</b><small>BS Computer Science · FAITH Colleges</small></div></div>
    <div class="sm-grid">${["about", "projects", "resume", "sidequest", "scandex", "drift", "optics", "catch", "terminal", "astro", "contact", "video"].map(id => `<button data-sm="${id}">${iconHTML(id)}${label(id)}</button>`).join("")}</div>
    <div class="sm-foot"><a href="classic.html">Simple view</a><a href="https://github.com/lyanreyes" target="_blank" rel="noopener">GitHub ↗</a><a href="mailto:reyeslyanf@gmail.com">Email</a></div>`;
  const toggleStart = on => { on = on == null ? !sm.classList.contains("open") : on; sm.classList.toggle("open", on); sb.classList.toggle("on", on); sb.setAttribute("aria-expanded", on); };
  sb.onclick = e => { e.stopPropagation(); toggleStart(); };
  sm.addEventListener("click", e => { const b = e.target.closest("[data-sm]"); if (b) { toggleStart(false); openApp(b.dataset.sm); } });
  document.addEventListener("pointerdown", e => { if (!sm.contains(e.target) && e.target !== sb && !sb.contains(e.target)) toggleStart(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") toggleStart(false); if (e.key === "Meta") toggleStart(); });

  /* ---------- clock ---------- */
  function tick() {
    const d = new Date();
    $("#clock").innerHTML = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + "<br>" + d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    $("#wclock").textContent = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) + " · " + d.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  }
  tick(); setInterval(tick, 15000);

  /* ---------- terminal ---------- */
  function renderTerminal() { return '<div class="term" tabindex="-1"><div class="out"></div><label class="term-in"><span class="p">lyan@lyanos:~$</span><input autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal input"></label></div>'; }
  apps.terminal.mount = body => {
    const t = $(".term", body), out = $(".out", t), inp = $("input", t), hist = []; let hi = 0;
    const print = h => { out.insertAdjacentHTML("beforeend", `<pre>${h}</pre>`); t.scrollTop = t.scrollHeight; };
    const cmds = {
      help: () => `<span class="k">Commands</span>\n  about      who I am\n  projects   list my projects\n  open &lt;name&gt; open a project (sidequest, scandex, drift, optics)\n  skills     what I work with\n  resume     open my resume\n  contact    how to reach me\n  play       start CatchaMon\n  neofetch   system info\n  clear      clear the screen`,
      about: () => "Lyan Reyes. 3rd-year BS Computer Science student at FAITH Colleges,\nBatangas, PH. I build and ship real apps: mobile, web, and ML.",
      whoami: () => "lyan",
      projects: () => Object.keys(projects).map(k => `  <span class="k">${k.padEnd(10)}</span> ${projects[k].tag}`).join("\n") + "\n\nType <span class=\"k\">open sidequest</span> to view one.",
      skills: () => "Python · JavaScript · TypeScript · SQL · React Native/Expo · Flask\nThree.js · Supabase · PostGIS · Git · Figma · English & Tagalog",
      resume: () => { openApp("resume"); return '<span class="ok">Opening resume…</span>'; },
      contact: () => 'email   <a href="mailto:reyeslyanf@gmail.com">reyeslyanf@gmail.com</a>\ngithub  <a href="https://github.com/lyanreyes" target="_blank" rel="noopener">github.com/lyanreyes</a>',
      play: () => { openApp("catch"); return '<span class="ok">Launching CatchaMon…</span>'; },
      neofetch: () => `<span class="p">   ▄▄▄▄▄    </span> <span class="k">lyan</span>@<span class="k">lyanos</span>\n<span class="p">  █ L   █   </span> OS: LyanOS 1.0 (web)\n<span class="p">  █ ▄▄▄ █   </span> Host: FAITH Colleges, BSCS 3A\n<span class="p">   ▀▀▀▀▀    </span> Shell: lyansh\n             Uptime: since 2024\n             Langs: English, Tagalog\n             Theme: Blueprint Blue`,
      date: () => new Date().toString(),
      echo: a => esc(a.join(" ")),
      sudo: () => '<span class="err">Nice try. 😄</span>',
      ls: () => "about.txt  projects/  resume.pdf  catchamon.exe"
    };
    const run = line => {
      print(`<span class="p">lyan@lyanos:~$</span> ${esc(line)}`);
      const [c, ...a] = line.trim().split(/\s+/); if (!c) return;
      if (c === "clear") { out.innerHTML = ""; return; }
      if (c === "open") { const k = (a[0] || "").toLowerCase(); if (projects[k]) { openApp(k); print(`<span class="ok">Opening ${projects[k].name}…</span>`); } else print('<span class="err">Usage: open sidequest | scandex | drift | optics</span>'); return; }
      const f = cmds[c.toLowerCase()]; print(f ? f(a) : `<span class="err">command not found: ${esc(c)}</span>. Type <span class="k">help</span>.`);
    };
    print('Welcome to <span class="k">LyanOS</span>. Type <span class="k">help</span> to see what you can do.');
    inp.addEventListener("keydown", e => {
      if (e.key === "Enter") { const v = inp.value; if (v.trim()) { hist.push(v); hi = hist.length; } inp.value = ""; run(v); }
      else if (e.key === "ArrowUp") { if (hi > 0) inp.value = hist[--hi]; e.preventDefault(); }
      else if (e.key === "ArrowDown") { if (hi < hist.length) inp.value = hist[++hi] || ""; e.preventDefault(); }
    });
    t.addEventListener("click", () => { if (!getSelection().toString()) inp.focus(); });
    if (!isMobile()) setTimeout(() => inp.focus(), 50);
  };

  /* ---------- CatchaMon (original mini-game) ---------- */
  function mountCatch(body) {
    const wrap = $(".game", body), cv = $("canvas", wrap), ctx = cv.getContext("2d"), msg = $(".game-msg", wrap);
    const hudC = $('[data-hud="count"]', wrap), hudO = $('[data-hud="orbs"]', wrap);
    let W = 0, H = 0, dpr = 1, raf = 0, t0 = performance.now(), alive = true;
    let caught = store.get("caught", 0), orbs = 10;
    const VARIANTS = [{ n: "Voltbit", body: "#7fb4ff", belly: "#e6f1ff", tip: "#38d6ff", p: .78 }, { n: "Ember Voltbit", body: "#ff9a6b", belly: "#fff0e6", tip: "#ffd23f", p: .17 }, { n: "Golden Voltbit", body: "#ffd84d", belly: "#fff8dc", tip: "#ff9f1a", p: .05 }];
    let mon, orb, stars = [], sparks = [];
    function pick() { let r = Math.random(); for (const v of VARIANTS) { if ((r -= v.p) <= 0) return v; } return VARIANTS[0]; }
    function spawn() { const v = pick(); mon = { v, x: W * (.3 + Math.random() * .4), y: H * .42, tx: W * .5, ty: H * .42, hop: 0, state: "idle", timer: 0, scale: 1, flee: .08 + (v.p < .1 ? .1 : 0) }; say(v.p < .1 ? `A rare ${v.n} appeared! ✨` : `A wild ${v.n} appeared!`); }
    function resetOrb() { orb = { x: W / 2, y: H - 70, vx: 0, vy: 0, z: 0, state: "ready", wob: 0, r: 26 }; }
    function say(s, ms = 1600) { msg.textContent = s; msg.style.opacity = 1; clearTimeout(say.t); say.t = setTimeout(() => msg.style.opacity = 0, ms); }
    function hud() { hudC.textContent = "Caught: " + caught; hudO.textContent = "Orbs: " + orbs; }
    function size() { const r = wrap.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); stars = Array.from({ length: 110 }, () => ({ x: Math.random() * W, y: Math.random() * H * .6, s: Math.random() * 1.8 + .3 })); }
    const ro = new ResizeObserver(() => { size(); if (orb && orb.state === "ready") resetOrb(); }); ro.observe(wrap);
    size(); resetOrb(); spawn(); hud();

    /* input: flick the orb */
    let drag = null;
    wrap.addEventListener("pointerdown", e => {
      if (orb.state !== "ready" || orbs <= 0) { if (orbs <= 0) { orbs = 10; hud(); say("Orbs refilled!"); } return; }
      const r = wrap.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (Math.hypot(x - orb.x, y - orb.y) < 60) { drag = { pts: [{ x, y, t: performance.now() }] }; wrap.setPointerCapture(e.pointerId); }
      else throwAt(x, y); /* tap-to-throw */
    });
    wrap.addEventListener("pointermove", e => { if (!drag) return; const r = wrap.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; drag.pts.push({ x, y, t: performance.now() }); if (drag.pts.length > 6) drag.pts.shift(); orb.x = x; orb.y = y; });
    wrap.addEventListener("pointerup", () => {
      if (!drag) return; const p = drag.pts, a = p[0], b = p[p.length - 1], dt = Math.max(16, b.t - a.t); drag = null;
      const vx = (b.x - a.x) / dt * 16, vy = (b.y - a.y) / dt * 16;
      if (vy < -4) launch(vx, vy); else resetOrb();
    });
    function throwAt(x, y) { const dx = x - orb.x, dy = y - orb.y, d = Math.hypot(dx, dy) || 1, sp = 17; launch(dx / d * sp + (Math.random() - .5) * 1.2, dy / d * sp); }
    function launch(vx, vy) { orb.vx = Math.max(-18, Math.min(18, vx)); orb.vy = Math.max(-26, Math.min(-8, vy)); orb.state = "fly"; orbs--; hud(); }

    function burst(x, y, col, n = 26) { for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, s = 1 + Math.random() * 4; sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1, life: 1, col }); } }

    function step(now) {
      if (!alive) return;
      const dt = Math.min(2, (now - t0) / 16.67); t0 = now;
      /* creature AI */
      if (mon.state === "idle") {
        mon.timer -= dt; mon.hop += .12 * dt;
        mon.x += (mon.tx - mon.x) * .04 * dt; mon.y += (mon.ty - mon.y) * .04 * dt;
        if (mon.timer <= 0) { mon.tx = W * (.18 + Math.random() * .64); mon.ty = H * (.3 + Math.random() * .22); mon.timer = 60 + Math.random() * 90; }
      }
      /* orb physics */
      if (orb.state === "fly") {
        orb.x += orb.vx * dt; orb.y += orb.vy * dt; orb.vy += .32 * dt; orb.z += dt;
        orb.r = Math.max(11, 26 - orb.z * .55);
        const ms = monSize();
        if (mon.state === "idle" && Math.hypot(orb.x - mon.x, orb.y - (mon.y - ms * .2)) < ms * .75) { orb.state = "shake"; orb.wob = 0; orb.x = mon.x; orb.y = mon.y + ms * .35; mon.state = "in"; burst(mon.x, mon.y, mon.v.tip, 18); }
        if (orb.y > H + 40 || orb.x < -40 || orb.x > W + 40 || orb.z > 90) { say("Missed!", 900); resetOrb(); if (Math.random() < mon.flee * 1.5) flee(); }
      } else if (orb.state === "shake") {
        orb.wob += dt;
        if (orb.wob > 150) {
          const chance = mon.v.p < .1 ? .45 : .62;
          if (Math.random() < chance) { caught++; store.set("caught", caught); hud(); burst(orb.x, orb.y, "#ffd84d", 60); say(`Gotcha! ${mon.v.n} was caught! 🎉`, 2000); orb.state = "done"; setTimeout(() => { if (alive) { resetOrb(); spawn(); } }, 1600); }
          else { mon.state = "idle"; mon.timer = 0; burst(mon.x, mon.y, mon.v.tip, 30); say("Oh no! It broke free!", 1200); resetOrb(); if (Math.random() < mon.flee) flee(); }
        }
      }
      sparks = sparks.filter(s => (s.x += s.vx * dt, s.y += s.vy * dt, s.vy += .12 * dt, s.life -= .02 * dt, s.life > 0));
      draw(now); raf = requestAnimationFrame(step);
    }
    function flee() { say(`The ${mon.v.n} ran away…`, 1400); mon.state = "gone"; setTimeout(() => { if (alive) spawn(); }, 1500); }
    const monSize = () => Math.min(W, H) * .2;

    function draw(now) {
      drawSpace(now);
      /* creature */
      if (mon.state === "idle") drawMon(mon.x, mon.y + Math.sin(mon.hop) * -8 * Math.abs(Math.sin(mon.hop)), monSize(), mon.v, now);
      /* orb */
      if (orb.state !== "done") {
        let ox = orb.x, oy = orb.y;
        if (orb.state === "shake") { const k = Math.floor(orb.wob / 50); const phase = (orb.wob % 50) / 50; ox += Math.sin(phase * Math.PI * 2) * (phase < .5 ? 6 : 0) * (k < 3 ? 1 : 0); }
        drawOrb(ox, oy, orb.state === "shake" ? 16 : orb.r, orb.state === "shake" ? Math.sin(orb.wob / 8) * .3 : orb.z * .3);
        if (orb.state === "ready") { ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.font = "500 12px JetBrains Mono, monospace"; ctx.textAlign = "center"; ctx.fillText(orbs > 0 ? "flick the orb up, or tap the Voltbit" : "tap to refill orbs", W / 2, H - 22); }
      }
      sparks.forEach(s => { ctx.globalAlpha = s.life; ctx.fillStyle = s.col; ctx.beginPath(); ctx.arc(s.x, s.y, 2.5, 0, 7); ctx.fill(); }); ctx.globalAlpha = 1;
    }
    /* deep-space backdrop: nebula, distant orange star, ringed planet, asteroid surface */
    let shoot = null, rocks = null;
    function drawSpace(now) {
      const hz = H * .62;
      let g = ctx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, "#02030b"); g.addColorStop(1, "#0a0d2a");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      /* nebula clouds */
      [[.25, .22, .55, "rgba(80,60,200,.22)"], [.75, .35, .5, "rgba(20,120,200,.18)"], [.55, .12, .35, "rgba(200,70,140,.12)"]].forEach(([nx, ny, nr, c]) => {
        const rg = ctx.createRadialGradient(W * nx, H * ny, 0, W * nx, H * ny, Math.max(W, H) * nr); rg.addColorStop(0, c); rg.addColorStop(1, "transparent");
        ctx.fillStyle = rg; ctx.fillRect(0, 0, W, hz);
      });
      /* stars */
      stars.forEach(s => { ctx.globalAlpha = .35 + .55 * Math.abs(Math.sin(now / 900 + s.x * 3)); ctx.fillStyle = s.s > 1.5 ? "#ffe9c9" : "#cfe2ff"; ctx.fillRect(s.x, s.y, s.s, s.s); }); ctx.globalAlpha = 1;
      /* distant orange star with soft halo and slow pulse */
      const sx = W * .78, sy = H * .16, sr = Math.min(W, H) * .045, pulse = 1 + .05 * Math.sin(now / 700);
      let hg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 7 * pulse); hg.addColorStop(0, "rgba(255,170,80,.55)"); hg.addColorStop(.25, "rgba(255,110,40,.18)"); hg.addColorStop(1, "transparent");
      ctx.fillStyle = hg; ctx.fillRect(0, 0, W, hz);
      ctx.strokeStyle = "rgba(255,200,140,.18)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(sx - sr * 9, sy); ctx.lineTo(sx + sr * 9, sy); ctx.moveTo(sx, sy - sr * 6); ctx.lineTo(sx, sy + sr * 6); ctx.stroke();
      hg = ctx.createRadialGradient(sx - sr * .3, sy - sr * .3, 0, sx, sy, sr); hg.addColorStop(0, "#fff6e0"); hg.addColorStop(.5, "#ffb347"); hg.addColorStop(1, "#ff6a1a");
      ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 7); ctx.fill();
      /* ringed planet */
      const px = W * .2, py = H * .33, pr = Math.min(W, H) * .08;
      ctx.save(); ctx.translate(px, py); ctx.rotate(-.35);
      ctx.strokeStyle = "rgba(170,200,255,.35)"; ctx.lineWidth = pr * .12; ctx.beginPath(); ctx.ellipse(0, 0, pr * 1.9, pr * .45, 0, Math.PI, 0); ctx.stroke();
      let pg = ctx.createRadialGradient(pr * .45, -pr * .35, pr * .1, 0, 0, pr); pg.addColorStop(0, "#9fc4ff"); pg.addColorStop(.6, "#3a5aa8"); pg.addColorStop(1, "#141e44");
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(0, 0, pr, 0, 7); ctx.fill();
      ctx.strokeStyle = "rgba(170,200,255,.5)"; ctx.beginPath(); ctx.ellipse(0, 0, pr * 1.9, pr * .45, 0, 0, Math.PI); ctx.stroke();
      ctx.restore();
      /* occasional shooting star */
      if (!shoot && Math.random() < .004) shoot = { x: Math.random() * W, y: Math.random() * hz * .4, life: 1 };
      if (shoot) { ctx.strokeStyle = `rgba(255,255,255,${shoot.life})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(shoot.x, shoot.y); ctx.lineTo(shoot.x - 50, shoot.y - 18); ctx.stroke(); shoot.x += 9; shoot.y += 3.2; shoot.life -= .03; if (shoot.life <= 0) shoot = null; }
      /* asteroid surface */
      g = ctx.createLinearGradient(0, hz, 0, H); g.addColorStop(0, "#3a3550"); g.addColorStop(.25, "#26223a"); g.addColorStop(1, "#110f1e");
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, hz + 10);
      for (let i = 0; i <= 12; i++) ctx.lineTo(W * i / 12, hz + Math.sin(i * 1.7) * 7 + Math.cos(i * .9) * 5);
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(255,170,90,.35)"; ctx.lineWidth = 1.5; ctx.beginPath();
      for (let i = 0; i <= 12; i++) { const yy = hz + Math.sin(i * 1.7) * 7 + Math.cos(i * .9) * 5; i ? ctx.lineTo(W * i / 12, yy) : ctx.moveTo(0, yy); } ctx.stroke();
      if (!rocks || rocks.W !== W) { rocks = Array.from({ length: 14 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() })); rocks.W = W; }
      rocks.forEach(k => { const yy = hz + 20 + k.y * (H - hz - 30), sc = .4 + (yy - hz) / (H - hz), rx = (6 + k.r * 16) * sc;
        ctx.fillStyle = "rgba(10,8,20,.55)"; ctx.beginPath(); ctx.ellipse(k.x * W, yy, rx, rx * .35, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = "rgba(255,170,90,.12)"; ctx.beginPath(); ctx.ellipse(k.x * W, yy - 1, rx, rx * .35, 0, Math.PI, 0); ctx.stroke(); });
    }
    function drawOrb(x, y, r, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(0, r * 1.05, r * .8, r * .22, 0, 0, 7); ctx.fill();
      /* glowing energy orb with an orbit ring and a bolt core (original design) */
      ctx.shadowColor = "#38d6ff"; ctx.shadowBlur = r * .9;
      let g = ctx.createRadialGradient(-r * .35, -r * .4, r * .05, 0, 0, r); g.addColorStop(0, "#e9fbff"); g.addColorStop(.45, "#5fb8ff"); g.addColorStop(1, "#1a3fa8");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(200,240,255,.9)"; ctx.lineWidth = Math.max(1.5, r * .09);
      ctx.beginPath(); ctx.ellipse(0, 0, r * 1.25, r * .38, -.4, 0, 7); ctx.stroke();
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.moveTo(r * .12, -r * .55); ctx.lineTo(-r * .28, r * .08); ctx.lineTo(-r * .02, r * .08); ctx.lineTo(-r * .14, r * .55); ctx.lineTo(r * .28, -r * .06); ctx.lineTo(r * .02, -r * .06); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    function drawMon(x, y, s, v, now) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.ellipse(0, s * .55, s * .5, s * .12, 0, 0, 7); ctx.fill();
      /* bolt tail */
      ctx.fillStyle = v.tip; ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(s * .35, s * .15); ctx.lineTo(s * .75, -s * .1); ctx.lineTo(s * .6, -s * .14); ctx.lineTo(s * .9, -s * .5); ctx.lineTo(s * .5, -s * .2); ctx.lineTo(s * .65, -s * .16); ctx.lineTo(s * .3, s * .05); ctx.closePath(); ctx.fill(); ctx.stroke();
      /* round ears (antenna-like) */
      [-1, 1].forEach(d => { ctx.fillStyle = v.body; ctx.beginPath(); ctx.ellipse(d * s * .28, -s * .5, s * .1, s * .2, d * .35, 0, 7); ctx.fill(); ctx.fillStyle = v.tip; ctx.beginPath(); ctx.arc(d * s * .36, -s * .68, s * .08, 0, 7); ctx.fill(); });
      /* body */
      let g = ctx.createRadialGradient(-s * .15, -s * .2, s * .1, 0, 0, s * .6); g.addColorStop(0, "#ffffff"); g.addColorStop(.25, v.body); g.addColorStop(1, shade(v.body));
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, s * .5, s * .52, 0, 0, 7); ctx.fill();
      ctx.fillStyle = v.belly; ctx.beginPath(); ctx.ellipse(0, s * .18, s * .3, s * .26, 0, 0, 7); ctx.fill();
      /* face */
      const blink = (Math.floor(now / 2600) % 3 === 0 && now % 2600 < 140);
      ctx.fillStyle = "#0b1b3a";
      [-1, 1].forEach(d => { if (blink) ctx.fillRect(d * s * .17 - s * .06, -s * .12, s * .12, s * .025); else { ctx.beginPath(); ctx.ellipse(d * s * .17, -s * .11, s * .055, s * .075, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(d * s * .17 + s * .02, -s * .14, s * .02, 0, 7); ctx.fill(); ctx.fillStyle = "#0b1b3a"; } });
      /* glowing chest gem */
      ctx.fillStyle = v.tip; ctx.beginPath(); ctx.moveTo(0, s * .1); ctx.lineTo(s * .06, s * .18); ctx.lineTo(0, s * .26); ctx.lineTo(-s * .06, s * .18); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#0b1b3a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -s * .01, s * .05, .2, Math.PI - .2); ctx.stroke();
      /* little feet */
      ctx.fillStyle = shade(v.body); [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(d * s * .2, s * .48, s * .11, s * .06, 0, 0, 7); ctx.fill(); });
      ctx.restore();
    }
    function shade(hex) { const n = parseInt(hex.slice(1), 16); const f = c => Math.max(0, Math.round(c * .62)); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }

    raf = requestAnimationFrame(step);
    return () => { alive = false; cancelAnimationFrame(raf); ro.disconnect(); };
  }

  /* ---------- wallpaper: animated gas-giant planet (WebGL shader, original) ---------- */
  function planetWallpaper() {
    const c = $("#wall"); const gl = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return false;
    const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
    const FS = `precision highp float;
uniform vec2 R;uniform float T;uniform vec2 M;
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float nz(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
 return mix(mix(h1(i),h1(i+vec2(1.,0.)),u.x),mix(h1(i+vec2(0.,1.)),h1(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*nz(p);p=m*p;a*=.5;}return v;}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*R)/R.y; uv+=M*.015;
 float asp=R.x/R.y;
 /* stars */
 vec2 sp=gl_FragCoord.xy/R.y*90.; vec2 cell=floor(sp); float rnd=h1(cell);
 float star=step(.993,rnd)*(.5+.5*sin(T*1.7+rnd*60.))*smoothstep(.5,.0,length(fract(sp)-.5));
 vec3 col=vec3(.004,.008,.016)+vec3(.85,.95,1.)*star;
 col+=vec3(.02,.04,.09)*fbm(uv*2.+T*.01);
 /* planet: huge sphere rising from the lower right */
 vec2 c=vec2(asp>1.?.45:.15,-1.25); float pr=asp>1.?1.55:1.3;
 vec2 q=(uv-c)/pr; float d=length(q);
 vec3 L=normalize(vec3(-.55,.75,.45));
 if(d<1.){
  float z=sqrt(1.-d*d); vec3 n=vec3(q,z);
  vec2 s=q/(z+.35)*2.2; s.x+=T*.012;
  vec2 w=vec2(fbm(s*1.4+vec2(0.,T*.02)),fbm(s*1.4+vec2(5.2,1.3)-T*.018));
  vec2 w2=vec2(fbm(s*2.+3.8*w+vec2(1.7,9.2)+T*.03),fbm(s*2.+3.8*w+vec2(8.3,2.8)-T*.02));
  float f=fbm(s*2.6+4.2*w2);
  vec3 deep=vec3(.01,.03,.12),mid=vec3(.08,.32,.85),bright=vec3(.5,.9,1.),hot=vec3(.55,.35,1.),ember=vec3(.12,.06,.4);
  vec3 a=mix(deep,mid,smoothstep(.25,.65,f));
  a=mix(a,bright,smoothstep(.62,.9,f)*.75);
  float o=smoothstep(.42,.72,w2.x)*smoothstep(.3,.7,fbm(s*.7+vec2(3.,7.)+T*.01));
  a=mix(a,mix(ember,hot,f),o*.85);
  a+=vec3(.6,.95,1.)*pow(smoothstep(.55,.95,f),6.)*.35;
  float lit=clamp(dot(n,L),0.,1.);
  a*=.08+1.15*lit;
  a*=smoothstep(0.,.18,z);
  col=a;
 }
 /* atmosphere glow on the rim */
 float rim=exp(-abs(d-1.)*pr*16.);
 float side=clamp(dot(normalize(vec3(q,.2)),L)*.8+.35,0.,1.);
 col+=vec3(.35,.7,1.)*rim*.6*side;
 col+=vec3(.15,.3,.7)*exp(-max(d-1.,0.)*pr*4.)*.12*side*step(1.,d);
 col=pow(col,vec3(.95));
 gl_FragColor=vec4(col,1.);
}`;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
    let prog;
    try { prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog); if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw 0; } catch (e) { return false; }
    gl.useProgram(prog);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "R"), uT = gl.getUniformLocation(prog, "T"), uM = gl.getUniformLocation(prog, "M");
    const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
    let mx = 0, my = 0, tmx = 0, tmy = 0, last = 0;
    addEventListener("pointermove", e => { tmx = e.clientX / innerWidth - .5; tmy = .5 - e.clientY / innerHeight; });
    function size() { const sc = (isMobile() ? .5 : .6) * Math.min(devicePixelRatio || 1, 2); c.width = Math.round(innerWidth * sc); c.height = Math.round(innerHeight * sc); gl.viewport(0, 0, c.width, c.height); }
    function draw(t) {
      mx += (tmx - mx) * .05; my += (tmy - my) * .05;
      gl.uniform2f(uR, c.width, c.height); gl.uniform1f(uT, 40 + t / 1000); gl.uniform2f(uM, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function loop(t) { if (document.hidden) return; if (t - last > 33) { last = t; draw(t); } requestAnimationFrame(loop); }
    size(); c.style.imageRendering = "auto";
    if (still) draw(0); else requestAnimationFrame(loop);
    addEventListener("resize", () => { size(); draw(performance.now()); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !still) requestAnimationFrame(loop); });
    return true;
  }
  if (!planetWallpaper()) (function wallpaper() {
    const c = $("#wall"), x = c.getContext("2d"); let w, h, pts, dpr;
    const still = matchMedia("(prefers-reduced-motion:reduce)").matches;
    function init() { dpr = Math.min(devicePixelRatio || 1, 2); w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); const n = Math.round(Math.min(110, w * h / 14000)); pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .6 })); }
    let mx = -999, my = -999; addEventListener("pointermove", e => { mx = e.clientX; my = e.clientY; });
    function frame() {
      x.clearRect(0, 0, w, h);
      x.strokeStyle = "rgba(77,139,255,.06)"; x.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 48) { x.beginPath(); x.moveTo(gx + .5, 0); x.lineTo(gx + .5, h); x.stroke(); }
      for (let gy = 0; gy < h; gy += 48) { x.beginPath(); x.moveTo(0, gy + .5); x.lineTo(w, gy + .5); x.stroke(); }
      for (const p of pts) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) { const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y); if (d < 130) { x.strokeStyle = `rgba(110,170,255,${(1 - d / 130) * .28})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke(); } }
        const dm = Math.hypot(a.x - mx, a.y - my); if (dm < 180) { x.strokeStyle = `rgba(56,214,255,${(1 - dm / 180) * .5})`; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(mx, my); x.stroke(); }
        x.fillStyle = "rgba(170,205,255,.85)"; x.beginPath(); x.arc(a.x, a.y, a.r, 0, 7); x.fill();
      }
      if (!still && !document.hidden) requestAnimationFrame(frame);
    }
    init(); frame();
    addEventListener("resize", () => { init(); if (still) frame(); });
    document.addEventListener("visibilitychange", () => { if (!document.hidden && !still) requestAnimationFrame(frame); });
  })();

  /* ---------- boot ---------- */
  addEventListener("load", () => setTimeout(() => {
    $("#boot").classList.add("done");
    if (!isMobile()) openApp("about");
  }, 700));
  setTimeout(() => $("#boot").classList.add("done"), 4000);
})();
