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
  function iconHTML(id) {
    const p = projects[id];
    if (p) return `<div class="ic thumb"><img src="${p.icon}" alt="" loading="lazy"></div>`;
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
      links: [["Download APK", "https://github.com/lyanreyes/sidequest/releases/latest/download/SideQuest.apk"], ["Source code", "https://github.com/lyanreyes/sidequest"]],
      extra: [["Watch promo video", "video"]]
    },
    scandex: {
      name: "ScanDex", full: "ScanDex: Trading Card Scanner", tag: "Machine learning · Web app · 2026", icon: "img/scandex.png",
      shot: '<div class="shot"><img src="img/scandex.png" alt="ScanDex scanner"></div>',
      desc: "Point your phone camera at a Pokémon trading card and ScanDex identifies it among 20,617 cards, shows its market price, and saves it to a digital binder.",
      bullets: ["<b>How:</b> six image fingerprints ranked by a learned logistic-regression model, plus an OCR check of the card number", "<b>Results:</b> 71% top-1, 80% top-5, and 97% precision on matches it auto-accepts. Written up as an IMRaD paper"],
      stack: ["Python", "JavaScript", "Computer vision", "Logistic regression", "Tesseract.js", "PWA"],
      demo: { url: "demos/scandex/index.html", label: "Open the live app", w: 1000, h: 700, camera: true },
      links: []
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
      links: []
    }
  };

  const apps = {
    about: { title: "About Me", w: 720, h: 600, render: renderAbout },
    projects: { title: "Projects", w: 820, h: 560, render: renderExplorer },
    resume: { title: "Lyan_Reyes_Resume.pdf", w: 760, h: 760, flush: true, render: renderResume },
    terminal: { title: "Terminal", w: 680, h: 440, flush: true, render: renderTerminal },
    contact: { title: "Contact", w: 460, h: 420, render: renderContact },
    video: { title: "SideQuest Promo.mp4", w: 820, h: 520, flush: true, render: () => '<video src="demos/sidequest-promo.mp4" controls playsinline style="flex:1;width:100%;min-height:0;background:#000"></video>' },
    catch: { title: "Voltbit Catch", w: 520, h: 720, flush: true, render: () => '<div class="game"><canvas></canvas><div class="game-hud"><span class="pill" data-hud="count">Caught: 0</span><span class="pill" data-hud="orbs">Orbs: 10</span></div><div class="game-msg"></div></div>', mount: mountCatch },
    simple: { title: "Simple view", action: () => { location.href = "classic.html"; } }
  };
  Object.keys(projects).forEach(id => { apps[id] = { title: projects[id].full, w: 760, h: 640, render: () => renderProject(id) }; });

  const desktopOrder = ["about", "projects", "sidequest", "scandex", "drift", "optics", "catch", "terminal", "resume", "video", "contact", "simple"];
  const labels = { about: "About Me", projects: "Projects", resume: "Resume.pdf", terminal: "Terminal", contact: "Contact", video: "Promo Video", catch: "Voltbit Catch", simple: "Simple View" };
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
        <button data-open="catch">${iconHTML("catch")}Voltbit Catch</button>
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
    <div class="sm-grid">${["about", "projects", "resume", "sidequest", "scandex", "drift", "optics", "catch", "terminal"].map(id => `<button data-sm="${id}">${iconHTML(id)}${label(id)}</button>`).join("")}</div>
    <div class="sm-foot"><a href="classic.html">Simple view</a><a href="https://github.com/lyanreyes" target="_blank" rel="noopener">GitHub ↗</a><a href="mailto:reyeslyanf@gmail.com">Email</a></div>`;
  const toggleStart = on => { on = on == null ? !sm.classList.contains("open") : on; sm.classList.toggle("open", on); sb.classList.toggle("on", on); sb.setAttribute("aria-expanded", on); };
  sb.onclick = e => { e.stopPropagation(); toggleStart(); };
  sm.addEventListener("click", e => { const b = e.target.closest("[data-sm]"); if (b) { toggleStart(false); openApp(b.dataset.sm); } });
  document.addEventListener("pointerdown", e => { if (!sm.contains(e.target) && e.target !== sb && !sb.contains(e.target)) toggleStart(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") toggleStart(false); if (e.key === "Meta") toggleStart(); });
  $("#simplebtn").onclick = () => location.href = "classic.html";

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
      help: () => `<span class="k">Commands</span>\n  about      who I am\n  projects   list my projects\n  open &lt;name&gt; open a project (sidequest, scandex, drift, optics)\n  skills     what I work with\n  resume     open my resume\n  contact    how to reach me\n  play       start Voltbit Catch\n  neofetch   system info\n  clear      clear the screen`,
      about: () => "Lyan Reyes. 3rd-year BS Computer Science student at FAITH Colleges,\nBatangas, PH. I build and ship real apps: mobile, web, and ML.",
      whoami: () => "lyan",
      projects: () => Object.keys(projects).map(k => `  <span class="k">${k.padEnd(10)}</span> ${projects[k].tag}`).join("\n") + "\n\nType <span class=\"k\">open sidequest</span> to view one.",
      skills: () => "Python · JavaScript · TypeScript · SQL · React Native/Expo · Flask\nThree.js · Supabase · PostGIS · Git · Figma · English & Tagalog",
      resume: () => { openApp("resume"); return '<span class="ok">Opening resume…</span>'; },
      contact: () => 'email   <a href="mailto:reyeslyanf@gmail.com">reyeslyanf@gmail.com</a>\ngithub  <a href="https://github.com/lyanreyes" target="_blank" rel="noopener">github.com/lyanreyes</a>',
      play: () => { openApp("catch"); return '<span class="ok">Launching Voltbit Catch…</span>'; },
      neofetch: () => `<span class="p">   ▄▄▄▄▄    </span> <span class="k">lyan</span>@<span class="k">lyanos</span>\n<span class="p">  █ L   █   </span> OS: LyanOS 1.0 (web)\n<span class="p">  █ ▄▄▄ █   </span> Host: FAITH Colleges, BSCS 3A\n<span class="p">   ▀▀▀▀▀    </span> Shell: lyansh\n             Uptime: since 2024\n             Langs: English, Tagalog\n             Theme: Blueprint Blue`,
      date: () => new Date().toString(),
      echo: a => esc(a.join(" ")),
      sudo: () => '<span class="err">Nice try. 😄</span>',
      ls: () => "about.txt  projects/  resume.pdf  voltbit-catch.exe"
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

  /* ---------- Voltbit Catch (original mini-game) ---------- */
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

  /* ---------- wallpaper: blueprint constellation ---------- */
  (function wallpaper() {
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
