/* =========================================================
   TSOFT · Ecosistema agéntico — lógica de escenas
   Vanilla JS, sin dependencias: funciona abriendo index.html
   ========================================================= */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const easeOut = t => 1 - Math.pow(1 - t, 3);

/* ---------------- Iconos (24x24, trazo) ---------------- */
const ICONS = {
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
  hand:'<path d="M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-3 7-6.5 7S5 17 4 14l-1-3a1.5 1.5 0 0 1 2.6-1.4L8 13"/>',
  file:'<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  terminal:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M12 15h5"/>',
  check:'<path d="M5 12l5 5L19 7"/>',
  x:'<path d="M6 6l12 12M18 6L6 18"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  shieldcheck:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  plug:'<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4"/>',
  db:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3 3 7 3s7-1.3 7-3"/>',
  globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  pen:'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
  ticket:'<path d="M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4z"/><path d="M14 7v10"/>',
  send:'<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  layers:'<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  dice:'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><circle cx="15" cy="15" r="1.2" fill="currentColor"/><circle cx="15" cy="9" r="1.2" fill="currentColor"/><circle cx="9" cy="15" r="1.2" fill="currentColor"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  box:'<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/>',
  zap:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  merge:'<circle cx="6" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 7v10M6 7c0 5 6 5 10 5"/>',
  coin:'<circle cx="12" cy="12" r="9"/><path d="M15 9c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v1.5M12 16.5V18"/>',
  alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
  shuffle:'<path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3"/>',
  megaphone:'<path d="M3 10v4h4l6 5V5L7 10z"/><path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  route:'<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7"/>',
  wrench:'<path d="M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.5-8.5a4 4 0 0 0-2-2z"/>',
  book:'<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
  ban:'<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
  play:'<path d="M7 4l13 8-13 8z"/>',
  code:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  folder:'<path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>',
  swap:'<path d="M4 8h14l-4-4M20 16H6l4 4"/>',
  frame:'<rect x="3" y="3" width="18" height="18" rx="3" stroke-dasharray="3 3"/><circle cx="12" cy="12" r="4"/><path d="M12 3v5M12 16v5M3 12h5M16 12h5"/>'
};
const SVG_ATTR = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
const icon = n => `<svg class="ic" ${SVG_ATTR} aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------------- Personajes ---------------- */
function bot(v = '') {
  return `<svg viewBox="0 0 100 100" class="bot ${v}" aria-hidden="true">
    <circle cx="50" cy="50" r="48" fill="url(#gGlow)"/>
    <circle cx="50" cy="50" r="30" fill="url(#gOrb)"/>
    <ellipse cx="50" cy="50" rx="41" ry="13" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1.2" class="bot-ring"/>
    <rect class="eye" x="39" y="43" width="6" height="12" rx="3" fill="#fff"/>
    <rect class="eye" x="55" y="43" width="6" height="12" rx="3" fill="#fff"/>
  </svg>`;
}
function dev(m = 'calm') {
  const ink = '#1c1f24';
  const mouth = m === 'stress'
    ? `<path d="M52 56q4-3 8 0t8 0" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`
    : m === 'happy'
      ? `<path d="M51 53q9 8 18 0" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/>`
      : `<path d="M53 54q7 4 14 0" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round"/>`;
  const brows = m === 'stress' ? `<path d="M46 38l8 2M74 38l-8 2" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>` : '';
  const sweat = m === 'stress' ? '<path class="sweat" d="M84 30q5 7 0 10q-5-3 0-10z" fill="#7cc4ff"/>' : '';
  return `<svg viewBox="0 0 120 130" class="dev ${m}" aria-hidden="true">
    <path d="M20 130c0-32 17-50 40-50s40 18 40 50z" fill="#2B2E34"/>
    <path d="M44 82l16 16 16-16" fill="none" stroke="#E30613" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="53" y="64" width="14" height="16" rx="3" fill="#E2AF88"/>
    <circle cx="60" cy="44" r="24" fill="#F0C39E"/>
    <path d="M35 44c-3-17 9-28 25-28s28 10 25 28c-3-9-12-14-24-14s-21 5-26 14z" fill="${ink}"/>
    <circle cx="51" cy="46" r="2.6" fill="${ink}"/><circle cx="69" cy="46" r="2.6" fill="${ink}"/>
    ${brows}${mouth}${sweat}
  </svg>`;
}

function hydrate(root = document) {
  $$('[data-icon]', root).forEach(el => { el.innerHTML = icon(el.dataset.icon); });
  $$('[data-icon-left]', root).forEach(el => {
    if (el.dataset.h) return;
    el.insertAdjacentHTML('afterbegin', icon(el.dataset.iconLeft));
    el.dataset.h = '1';
  });
  $$('[data-char]', root).forEach(el => {
    const [k, v] = el.dataset.char.split(':');
    el.innerHTML = k === 'dev' ? dev(v) : bot(v || '');
  });
}
hydrate();

/* ---------------- Utilidades de visibilidad ---------------- */
function onEnter(el, fn, threshold = .35) {
  const o = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { o.disconnect(); fn(); }
  }), { threshold });
  o.observe(el);
}
function trackVis(el) {
  el._vis = false;
  new IntersectionObserver(es => es.forEach(e => { el._vis = e.isIntersecting; }), { threshold: 0 }).observe(el);
  return el;
}
const waitVisible = el => new Promise(res => {
  if (el._vis) return res();
  const t = setInterval(() => { if (el._vis) { clearInterval(t); res(); } }, 250);
});

/* ---------------- Reveal + stagger + contadores ---------------- */
$$('[data-stagger]').forEach(c => [...c.children].forEach((ch, i) => {
  if (!ch.hasAttribute('data-reveal')) ch.setAttribute('data-reveal', '');
  ch.style.setProperty('--d', (i * .12) + 's');
}));
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .18 });
$$('[data-reveal]').forEach(el => io.observe(el));

$$('[data-count]').forEach(el => onEnter(el, async () => {
  if (el.closest('.hero')) await sleep(1000);
  const to = +el.dataset.count, t0 = performance.now(), d = 1500;
  const step = t => {
    const k = clamp((t - t0) / d);
    el.textContent = Math.round(to * easeOut(k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}));

/* ---------------- Navegación narrativa ---------------- */
const stages = $$('[data-stage]');
const nav = $('#storynav');
const nowStage = $('#nowStage');
stages.forEach(s => {
  const a = document.createElement('a');
  a.href = '#' + s.id;
  a.innerHTML = `<span>${s.dataset.stage}</span><i></i>`;
  nav.appendChild(a);
});
const navLinks = $$('a', nav);
let idleT;
function updateNav() {
  const mid = innerHeight * .45;
  let idx = 0;
  stages.forEach((s, i) => { if (s.getBoundingClientRect().top <= mid) idx = i; });
  navLinks.forEach((a, i) => { a.classList.toggle('on', i === idx); a.classList.toggle('done', i < idx); });
  if (nowStage.textContent !== stages[idx].dataset.stage) nowStage.textContent = stages[idx].dataset.stage;
  nav.classList.remove('idle');
  clearTimeout(idleT);
  idleT = setTimeout(() => nav.classList.add('idle'), 1600);
}

/* ---------------- Motor de scroll (scrub + parallax) ---------------- */
const SCRUB = {};
const scrubs = $$('[data-scrub]');
const parallax = $$('[data-parallax]');
const bar = $('#progress span');
let ticking = false;
function frame() {
  ticking = false;
  const vh = innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  scrubs.forEach(s => {
    const r = s.getBoundingClientRect();
    const total = r.height - vh;
    const p = total > 40 ? clamp(-r.top / total) : (r.top < vh * .5 ? 1 : 0);
    if (s._p !== p) {
      s._p = p;
      s.style.setProperty('--p', p.toFixed(4));
      SCRUB[s.id] && SCRUB[s.id](p);
    }
  });
  parallax.forEach(el => {
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    const c = r.top + r.height / 2 - vh / 2;
    el.style.transform = `translateY(${c * +el.dataset.parallax}px)`;
  });
  updateNav();
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });

/* =========================================================
   ESCENAS
   ========================================================= */

/* ---------- Red de nodos (apertura y cierre) ---------- */
function network(canvas, { orbEl = null, density = 70, complete = false } = {}) {
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, nodes = [], mx = 0, my = 0;
  const packets = [];
  const t0 = performance.now();
  trackVis(canvas);
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(density * clamp(W * H / (1400 * 800), .45, 1.4));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.6 + .8, k: Math.random()
    }));
  }
  resize();
  addEventListener('resize', resize);
  canvas.parentElement.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - .5;
    my = (e.clientY - r.top) / r.height - .5;
  });
  const orbPos = () => {
    const a = orbEl.getBoundingClientRect(), b = canvas.getBoundingClientRect();
    return { x: a.left - b.left + a.width / 2, y: a.top - b.top + a.height / 2 };
  };
  let lastSpawn = 0;
  function draw(now) {
    requestAnimationFrame(draw);
    if (!canvas._vis) return;
    const build = complete ? 1 : clamp((now - t0 - 800) / 6000);
    ctx.clearRect(0, 0, W, H);
    const px = mx * 18, py = my * 18;
    const P = n => [n.x + px * n.r, n.y + py * n.r];
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    }
    const L = 130;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 > L * L) continue;
        const al = 1 - Math.sqrt(d2) / L;
        const lit = a.k < build && b.k < build;
        ctx.strokeStyle = lit ? `rgba(227,6,19,${al * .55})` : `rgba(255,255,255,${al * .1})`;
        ctx.lineWidth = lit ? 1.1 : .8;
        const [ax, ay] = P(a), [bx, by] = P(b);
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      }
    }
    let o = null;
    if (orbEl) {
      o = orbPos();
      for (const n of nodes) {
        const d = Math.hypot(n.x - o.x, n.y - o.y);
        if (d < 280 && n.k < build) {
          const [nx, ny] = P(n);
          ctx.strokeStyle = `rgba(255,74,85,${(1 - d / 280) * .45})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(nx, ny); ctx.stroke();
        }
      }
      // datos viajando hacia el agente
      if (now - lastSpawn > 180 && build > .2) {
        lastSpawn = now;
        const cand = nodes.filter(n => n.k < build && Math.hypot(n.x - o.x, n.y - o.y) < 280);
        if (cand.length) packets.push({ n: cand[Math.random() * cand.length | 0], t: 0 });
      }
      for (let i = packets.length - 1; i >= 0; i--) {
        const pk = packets[i];
        pk.t += .02;
        if (pk.t >= 1) { packets.splice(i, 1); continue; }
        const [nx, ny] = P(pk.n);
        const x = nx + (o.x - nx) * pk.t, y = ny + (o.y - ny) * pk.t;
        ctx.fillStyle = `rgba(255,255,255,${.9 * (1 - pk.t)})`;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 6.283); ctx.fill();
      }
    }
    for (const n of nodes) {
      const lit = n.k < build;
      const [nx, ny] = P(n);
      ctx.fillStyle = lit ? '#FF4A55' : 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.arc(nx, ny, n.r * (lit ? 1.4 : 1), 0, 6.283); ctx.fill();
    }
  }
  requestAnimationFrame(draw);
}
network($('#net'), { orbEl: $('#heroOrb') });
network($('#net2'), { density: 55, complete: true });

/* ---------- Hoy vs destino (comparador) ---------- */
(() => {
  const c = $('#compare'), h = $('#cmpHandle');
  let drag = false, intro = null;
  const set = x => c.style.setProperty('--x', clamp(x, 3, 97) + '%');
  const fromEvent = e => { const r = c.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
  const stopIntro = () => { if (intro) cancelAnimationFrame(intro); intro = null; };
  set(94);
  c.addEventListener('pointerdown', e => { drag = true; stopIntro(); c.setPointerCapture(e.pointerId); fromEvent(e); });
  c.addEventListener('pointermove', e => drag && fromEvent(e));
  c.addEventListener('pointerup', () => { drag = false; });
  h.addEventListener('keydown', e => {
    const cur = parseFloat(c.style.getPropertyValue('--x'));
    if (e.key === 'ArrowLeft') set(cur - 5);
    if (e.key === 'ArrowRight') set(cur + 5);
  });
  onEnter(c, async () => {
    await sleep(700);
    const t0 = performance.now(), d = 2200;
    const step = t => {
      const k = clamp((t - t0) / d);
      set(94 - 44 * easeOut(k));
      if (k < 1) intro = requestAnimationFrame(step);
    };
    intro = requestAnimationFrame(step);
  }, .5);

  // el loop manual del "hoy"
  const loop = trackVis($('#chatloop'));
  const steps = $$('.cl-step', loop);
  const att = $('#attempt');
  let i = 0, n = 1;
  setInterval(() => {
    if (!loop._vis) return;
    steps.forEach(s => s.classList.remove('on'));
    steps[i].classList.add('on');
    if (i === 3) att.textContent = '#' + (++n);
    i = (i + 1) % 4;
  }, 850);
})();

/* ---------- Ciclo de vida ---------- */
SCRUB.ciclo = p => {
  const q = clamp(p / .85);
  $$('#ciclo .phase').forEach((el, i) => {
    const at = (((i + .5) / 6) * 100 - 4) / 92;
    el.classList.toggle('on', q >= at - .02);
  });
  $('#cicloPunch').classList.toggle('on', p > .88);
};

/* ---------- Un LLM predice ---------- */
(() => {
  const CANDS = [
    { t: 'el schema del proyecto', p: 46, ok: true,  n: 'Plausible y correcto… esta vez.' },
    { t: 'zod',                    p: 27, ok: true,  n: 'Suena bien. ¿Está en tu repo? El modelo no lo sabe.' },
    { t: 'Joi',                    p: 17, ok: true,  n: 'Válido en otro proyecto. En el tuyo, quizás no.' },
    { t: 'validateInput()',        p: 10, ok: false, n: 'Suena perfecto. No existe en tu código.' }
  ];
  const barsEl = $('#prBars'), out = $('#prOut'), note = $('#prNote'), btn = $('#regen');
  barsEl.innerHTML = CANDS.map(c => `<div class="pbar ${c.ok ? '' : 'bad'}"><span>${c.t}</span><div class="pb"><i></i></div><em>${c.p}%</em></div>`).join('');
  const bars = $$('.pbar', barsEl);
  let prev = -1, busy = false;
  function pick() {
    const pool = CANDS.map((c, i) => i).filter(i => i !== prev);
    let r = Math.random() * pool.reduce((s, i) => s + CANDS[i].p, 0);
    for (const i of pool) { r -= CANDS[i].p; if (r <= 0) return i; }
    return pool[0];
  }
  async function run(first) {
    if (busy) return;
    busy = true; btn.disabled = true;
    out.textContent = ''; out.classList.remove('bad'); note.innerHTML = '&nbsp;';
    bars.forEach(b => { b.classList.remove('pick'); $('i', b).style.width = '0'; });
    await sleep(300);
    bars.forEach((b, i) => { $('i', b).style.width = (CANDS[i].p * 2) + '%'; });
    await sleep(900);
    const k = first ? 0 : pick();
    prev = k;
    bars[k].classList.add('pick');
    await sleep(350);
    const c = CANDS[k];
    if (!c.ok) out.classList.add('bad');
    for (const ch of c.t) { out.textContent += ch; await sleep(38); }
    note.textContent = c.n;
    busy = false; btn.disabled = false;
  }
  btn.addEventListener('click', () => run(false));
  onEnter($('#predice .predict'), () => run(true), .5);
})();

/* ---------- Ventana de contexto ---------- */
(() => {
  const LAYERS = [
    { n: 'Instrucciones del sistema', s: 8,  c: '#3A4150' },
    { n: 'AGENTS.md del proyecto',    s: 9,  c: '#8A1C24' },
    { n: 'Skills cargadas',           s: 10, c: '#B5121C' },
    { n: 'Archivos que leyó',         s: 20, c: '#2C5282' },
    { n: 'Resultados de comandos',    s: 16, c: '#1F6F5A' },
    { n: 'Historial de la conversación', s: 52, c: '#5B4A8A' }
  ];
  const box = $('#vLayers'), vessel = $('#vessel'), state = $('#ctxState'), comp = $('#vCompact');
  box.innerHTML = LAYERS.map(l => `<div class="vl" style="background:${l.c}"><span>${l.n}</span></div>`).join('');
  const els = $$('.vl', box);
  const meter = (id, v, label, color) => {
    const m = $(id); $('i', m).style.width = clamp(v, 0, 100) + '%';
    $('i', m).style.background = color; $('b', m).textContent = label;
  };
  SCRUB.ventana = p => {
    let bottom = 0, total = 0;
    const compacted = p > .9;
    els.forEach((el, i) => {
      let size;
      if (i < 5) size = LAYERS[i].s * clamp((p - (.04 + i * .09)) / .07);
      else {
        size = 4 + 48 * clamp((p - .5) / .33);
        if (p < .5) size = 4 * clamp((p - .46) / .04);
        if (compacted) size = 52 - 40 * clamp((p - .9) / .06);
      }
      el.style.bottom = bottom + '%';
      el.style.height = size + '%';
      el.style.opacity = size > .3 ? 1 : 0;
      $('span', el).style.opacity = size > 5 ? 1 : 0;
      if (i === 5) $('span', el).textContent = compacted && p > .95 ? 'Historial (resumido)' : LAYERS[5].n;
      bottom += size; total += size;
    });
    const over = total > 100 && !compacted;
    vessel.classList.toggle('over', over);
    comp.classList.toggle('on', compacted);
    const occ = Math.round(total);
    let q = total <= 70 ? 95 : Math.max(18, 95 - (total - 70) * 1.9);
    if (compacted) q = Math.min(q, 68);
    const qc = q > 80 ? 'var(--green)' : q > 50 ? 'var(--amber)' : 'var(--red)';
    meter('#mOcc', occ, occ + '%', total > 100 ? 'var(--red)' : total > 80 ? 'var(--amber)' : 'var(--blue)');
    meter('#mCost', occ, total < 35 ? 'bajo' : total < 75 ? 'medio' : 'alto', 'var(--amber)');
    meter('#mSpeed', 100 - total * .6, total < 35 ? 'rápida' : total < 75 ? 'media' : 'lenta', 'var(--blue)');
    meter('#mQual', q, Math.round(q) + '%', qc);
    let msg = 'Scrolleá para llenar la ventana', cls = '';
    if (total > 1) msg = 'Hay espacio: el agente tiene lo que necesita.';
    if (total > 60) { msg = 'Se está llenando: más caro y más lento.'; cls = 'warn'; }
    if (total > 88) { msg = 'Casi lleno: la calidad empieza a bajar.'; cls = 'warn'; }
    if (over) { msg = 'Desborde: no entra todo.'; cls = 'bad'; }
    if (compacted) { msg = 'Compactó: resumió el historial y "olvidó" detalles.'; cls = 'warn'; }
    state.textContent = msg; state.className = 'ctx-state ' + cls;
  };
})();

/* ---------- Probabilístico vs determinístico ---------- */
(() => {
  const btn = $('#runBoth'), rm = $('#runsModel'), rc = $('#runsCode');
  const LBL = { ok: '✓', skip: '—', err: '✗' };
  const row = (i, arr) => `<div class="run">#${i + 1} ${arr.map(s => `<span class="st ${s}">${LBL[s]}</span>`).join('')}</div>`;
  async function run() {
    btn.disabled = true;
    rm.innerHTML = rc.innerHTML = '';
    $('#scoreModel').innerHTML = $('#scoreCode').innerHTML = '&nbsp;';
    let runs, perfect;
    do {
      runs = Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => {
        const r = Math.random(); return r < .78 ? 'ok' : r < .92 ? 'skip' : 'err';
      }));
      perfect = runs.filter(r => r.every(s => s === 'ok')).length;
    } while (perfect < 1 || perfect > 3);
    for (let i = 0; i < 5; i++) {
      rm.insertAdjacentHTML('beforeend', row(i, runs[i]));
      rc.insertAdjacentHTML('beforeend', row(i, ['ok', 'ok', 'ok', 'ok']));
      await sleep(320);
    }
    $('#scoreModel').textContent = `${perfect} de 5 ejecuciones completas`;
    $('#scoreCode').textContent = '5 de 5 idénticas';
    btn.disabled = false;
  }
  btn.addEventListener('click', run);
  onEnter($('#determinismo .duel'), run, .45);
})();

/* ---------- Loop agéntico ---------- */
(() => {
  const svg = trackVis($('#loopSvg'));
  const R = 150, C = 942.48;
  const nodes = $$('.ln-node', svg).map(g => {
    const a = +g.dataset.a;
    g.setAttribute('transform', `translate(${200 + R * Math.cos(a * Math.PI / 180)} ${200 + R * Math.sin(a * Math.PI / 180)})`);
    return { g, a };
  });
  const dot = $('#loopDot'), trail = $('#loopTrail'), center = $('#loopCenter'), cnt = $('#loopCount'), cap = $('#loopCaption');
  const MODES = {
    agent: { labels: ['Razonar', 'Actuar', 'Observar'], speed: 130, center: bot(),
             cap: 'Lee archivos, ejecuta, mira el resultado y sigue hasta terminar… o trabarse. <b>El loop lo hace él.</b>' },
    chat:  { labels: ['Copiás', 'Probás', 'Volvés'], speed: 34, center: dev('stress'),
             cap: 'Copiás, probás, volvés con el error y pedís de nuevo. <b>El loop sos vos.</b>' }
  };
  let mode = 'agent', ang = -90, cycles = 0, last = performance.now();
  function setMode(m) {
    mode = m;
    $$('#loopSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
    MODES[m].labels.forEach((t, i) => { $('#ln' + i).textContent = t; });
    center.innerHTML = MODES[m].center;
    cap.innerHTML = MODES[m].cap;
    cycles = 0; cnt.textContent = '0';
  }
  $$('#loopSeg button').forEach(b => b.addEventListener('click', () => setMode(b.dataset.mode)));
  setMode('agent');
  trail.setAttribute('stroke-dasharray', `130 ${C - 130}`);
  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!svg._vis) return;
    const prevA = ang;
    ang += MODES[mode].speed * dt;
    if (Math.floor((prevA + 90) / 360) !== Math.floor((ang + 90) / 360)) cnt.textContent = ++cycles;
    const rad = ang * Math.PI / 180;
    dot.setAttribute('cx', 200 + R * Math.cos(rad));
    dot.setAttribute('cy', 200 + R * Math.sin(rad));
    const pos = (((ang % 360) + 360) % 360) * Math.PI / 180 * R;
    trail.setAttribute('stroke-dashoffset', -(pos - 130));
    const a = ((ang % 360) + 360) % 360;
    nodes.forEach(n => {
      const na = ((n.a % 360) + 360) % 360;
      let d = Math.abs(a - na); d = Math.min(d, 360 - d);
      n.g.classList.toggle('on', d < 22);
    });
  }
  requestAnimationFrame(tick);
})();

/* ---------- Cuánto contexto ---------- */
(() => {
  const range = $('#doseRange'), dotEl = $('#doseDot'), out = $('#doseOut'), val = $('#doseVal');
  const q = x => .08 + .92 * Math.exp(-Math.pow(x - 52, 2) / (2 * 19 * 19));
  let d = '';
  for (let x = 0; x <= 100; x += 2) d += (x ? 'L' : 'M') + (x * 4) + ' ' + (150 - q(x) * 130).toFixed(1) + ' ';
  $('#doseCurve').setAttribute('d', d);
  const STATES = {
    low:  { t: 'Resultado genérico', i: 'x', v: 'Poco',
            c: 'function refund(req, res) {\n  // TODO: validar\n  res.send(200)\n}' },
    ok:   { t: 'Resultado preciso', i: 'check', v: 'Justo',
            c: "// usa schema, logger y convenciones del repo\nrouter.post('/refunds',\n  validate(refundSchema), refunds.create)" },
    high: { t: 'Se pierde, tarda y cuesta más', i: 'alert', v: 'Demasiado',
            c: 'leyendo 214 archivos…\nreleyendo el historial completo…\n⏳ costo ↑   velocidad ↓' }
  };
  function upd() {
    const x = +range.value;
    dotEl.setAttribute('cx', x * 4);
    dotEl.setAttribute('cy', 150 - q(x) * 130);
    const k = x < 30 ? 'low' : x <= 74 ? 'ok' : 'high';
    const s = STATES[k];
    out.className = 'dose-out ' + k;
    out.innerHTML = `<div class="t">${icon(s.i)}${s.t}</div><pre style="white-space:pre-wrap;font:inherit">${s.c}</pre>`;
    val.textContent = s.v;
  }
  range.addEventListener('input', upd);
  upd();
})();

/* ---------- Progressive disclosure ---------- */
(() => {
  const SK = [
    ['escribir-migracion', 'Cambios de esquema en la base'], ['preparar-release', 'Versionado y changelog'],
    ['generar-tests', 'Tests unitarios y de integración'], ['revisar-seguridad', 'Chequeos antes del merge'],
    ['documentar-api', 'Mantener docs/api.md'], ['manejo-errores', 'try/catch + logger'],
    ['crear-endpoint', 'Convenciones para crear endpoints REST. Usar al agregar o modificar uno.'],
    ['feature-flags', 'Activar funciones de a poco'], ['logging', 'Formato y niveles de log'],
    ['i18n', 'Textos traducibles'], ['deploy-staging', 'Publicar en staging'], ['convenciones-front', 'Componentes y estilos']
  ];
  const TARGET = 6;
  const chipsEl = $('#pdChips'), openEl = $('#pdOpen'), fill = $('#pdFill'), label = $('#pdLabel');
  chipsEl.innerHTML = SK.map(([n, d]) => `<span class="chip" title="${d}">${n}</span>`).join('');
  const chips = $$('.chip', chipsEl);
  let mode = 'pd', token = 0;
  const setBar = (pct, txt) => {
    fill.style.width = pct + '%';
    fill.classList.toggle('over', pct > 100);
    label.textContent = `Ventana de contexto: ${pct}% · ${txt}`;
  };
  const openSkill = i => {
    const [n, d] = SK[i];
    chips.forEach((c, j) => c.classList.toggle('sel', j === i));
    openEl.classList.add('on');
    openEl.innerHTML = i === TARGET
      ? `<span class="ttl"># ${n}</span><br>1. Controller en src/controllers/<br>2. Validar el input con el schema<br>3. Test de integración obligatorio<br>4. Documentar en docs/api.md`
      : `<span class="ttl"># ${n}</span><br>${d}.<br><span class="muted">…pasos, scripts y referencias de la skill</span>`;
    setBar(23, 'entra de sobra');
  };
  async function demo() {
    const my = ++token;
    mode = 'pd';
    $$('#pdSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === 'pd'));
    chips.forEach(c => c.classList.remove('sel', 'scan'));
    openEl.classList.remove('on');
    openEl.innerHTML = '<span class="muted">El agente lee solo las descripciones…</span>';
    setBar(14, 'AGENTS.md + descripciones');
    await sleep(700);
    for (let i = 0; i <= TARGET; i++) {
      if (my !== token) return;
      chips.forEach(c => c.classList.remove('scan'));
      chips[i].classList.add('scan');
      await sleep(260);
    }
    if (my !== token) return;
    chips[TARGET].classList.remove('scan');
    openSkill(TARGET);
  }
  function loadAll() {
    token++;
    mode = 'all';
    $$('#pdSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === 'all'));
    chips.forEach(c => { c.classList.remove('scan'); c.classList.add('sel'); });
    openEl.classList.add('on');
    openEl.innerHTML = '<span class="ttl" style="color:var(--red2)"># 12 skills completas cargadas</span><br>crear-endpoint · escribir-migracion · preparar-release · generar-tests · revisar-seguridad · documentar-api · …<br><span style="color:var(--red2)">no queda lugar para el código de la tarea</span>';
    setBar(140, 'no entra: desborde');
  }
  chips.forEach((c, i) => c.addEventListener('click', () => { token++; if (mode === 'all') demo(); else openSkill(i); }));
  $$('#pdSeg button').forEach(b => b.addEventListener('click', () => b.dataset.mode === 'all' ? loadAll() : demo()));
  $('#pdReplay').addEventListener('click', demo);
  setBar(0, 'vacía');
  onEnter($('#disclosure .pd'), demo, .4);
})();

/* ---------- Spec en 6 piezas ---------- */
SCRUB.spec = p => {
  const items = $$('#specItems li');
  let n = 0;
  items.forEach((li, i) => {
    const on = p > (i + .5) / 7.4;
    li.classList.toggle('on', on);
    if (on) n++;
  });
  const pct = Math.round(n / 6 * 50);
  $('#specRing').style.strokeDashoffset = 314.16 * (1 - pct / 100);
  $('#specPct').textContent = pct + '%';
  $('#specTest').classList.toggle('on', p > .9);
};

/* ---------- Juego: ¿dónde va esta regla? ---------- */
(() => {
  const RULES = [
    { t: 'Stack y estructura del proyecto', a: 'agents' },
    { t: 'Crear un endpoint', a: 'skill' },
    { t: 'Formatear al editar', a: 'hook' },
    { t: 'Comandos de build y test', a: 'agents' },
    { t: 'Escribir una migración', a: 'skill' },
    { t: 'Bloquear comandos riesgosos', a: 'hook' },
    { t: 'Prohibiciones generales', a: 'agents' },
    { t: 'Preparar un release', a: 'skill' },
    { t: 'Correr lint al terminar', a: 'hook' }
  ];
  const WHY = {
    agents: 'Aplica siempre, a todo → AGENTS.md.',
    skill: 'Aplica a un tipo de tarea → skill.',
    hook: 'No puede fallar nunca → hook.'
  };
  const card = $('#gameCard'), fb = $('#gameFb'), prog = $('#gameProgress'), bins = $$('.bin');
  let idx, firstTry, missed, busy;
  function reset() {
    idx = 0; firstTry = 0; missed = false; busy = false;
    bins.forEach(b => { $('.bin-count', b).textContent = '0'; });
    prog.innerHTML = RULES.map(() => '<i></i>').join('');
    fb.innerHTML = '&nbsp;'; fb.className = 'game-fb';
    card.classList.remove('done');
    show();
  }
  function show() {
    card.style.transition = 'none';
    card.className = 'game-card';
    card.style.transform = 'translateY(-30px)'; card.style.opacity = '0';
    card.innerHTML = `<small>Regla ${idx + 1} de ${RULES.length}</small>${RULES[idx].t}`;
    $$('i', prog).forEach((el, i) => el.classList.toggle('cur', i === idx));
    void card.offsetWidth;
    card.style.transition = ''; card.style.transform = ''; card.style.opacity = '';
  }
  bins.forEach(b => b.addEventListener('click', async () => {
    if (busy || idx >= RULES.length) return;
    const r = RULES[idx];
    if (b.dataset.bin === r.a) {
      busy = true;
      if (!missed) firstTry++;
      $$('i', prog)[idx].classList.add('ok');
      card.classList.add('go-' + r.a);
      b.classList.add('flash');
      const cnt = $('.bin-count', b); cnt.textContent = +cnt.textContent + 1;
      fb.textContent = '✓ ' + WHY[r.a]; fb.className = 'game-fb ok';
      await sleep(650);
      b.classList.remove('flash');
      idx++; missed = false; busy = false;
      if (idx < RULES.length) show();
      else {
        card.className = 'game-card done';
        card.style.opacity = ''; card.style.transform = '';
        card.innerHTML = `<small>Resultado</small>${firstTry} de ${RULES.length} al primer intento`;
        fb.innerHTML = '<button class="btn ghost small" id="gameAgain">Jugar de nuevo</button>';
        fb.className = 'game-fb';
        $('#gameAgain').addEventListener('click', reset);
      }
    } else {
      missed = true;
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      fb.textContent = 'Casi. Pensá: ¿aplica siempre, a un tipo de tarea, o no puede fallar nunca?';
      fb.className = 'game-fb ko';
    }
  }));
  reset();
})();

/* ---------- MCP ---------- */
(() => {
  const svg = $('#mcpSvg');
  const cx = 260, cy = 220, R = 172;
  const SYS = [
    { n: 'Jira / Confluence', i: 'ticket', a: -90, tip: 'leer un ticket o una página de documentación' },
    { n: 'Postman', i: 'send', a: -18, tip: 'correr una colección de requests' },
    { n: 'Navegador', i: 'globe', a: 54, tip: 'abrir una página y verificar el frontend' },
    { n: 'Base de datos', i: 'db', a: 126, tip: 'consultar datos reales, con acceso mínimo' },
    { n: 'Figma', i: 'pen', a: 198, tip: 'leer un diseño para implementarlo' }
  ];
  let html = `<circle cx="${cx}" cy="${cy}" r="66" class="mcp-hub" stroke-dasharray="4 5"/>
    <text x="${cx}" y="${cy + 88}" text-anchor="middle" class="mcp-hub-t">MCP</text>`;
  SYS.forEach((s, k) => {
    const rad = s.a * Math.PI / 180;
    const x = cx + R * Math.cos(rad), y = cy + R * Math.sin(rad) * .92;
    const x1 = cx + 66 * Math.cos(rad), y1 = cy + 66 * Math.sin(rad);
    const path = `M${x.toFixed(1)} ${y.toFixed(1)} L${x1.toFixed(1)} ${y1.toFixed(1)}`;
    const back = `M${x1.toFixed(1)} ${y1.toFixed(1)} L${x.toFixed(1)} ${y.toFixed(1)}`;
    html += `<line x1="${x1}" y1="${y1}" x2="${x}" y2="${y}" class="mcp-link" data-k="${k}"/>
      <circle r="3.5" class="pkt-dot"><animateMotion dur="2.2s" begin="${k * .4}s" repeatCount="indefinite" path="${path}"/></circle>
      <circle r="3" fill="#FF4A55"><animateMotion dur="2.2s" begin="${k * .4 + 1.1}s" repeatCount="indefinite" path="${back}"/></circle>
      <g class="mcp-sys" data-k="${k}" transform="translate(${x - 82} ${y - 22})">
        <rect width="164" height="44" rx="12"/>
        <svg x="12" y="12" width="20" height="20" class="ico" ${SVG_ATTR}>${ICONS[s.i]}</svg>
        <text x="40" y="27">${s.n}</text>
      </g>`;
  });
  html += `<g transform="translate(${cx - 42} ${cy - 42})"><svg width="84" height="84" viewBox="0 0 100 100">${bot().replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg></g>
    <text x="${cx}" y="${cy + 58}" text-anchor="middle" fill="#fff" font-size="12" font-weight="700" font-family="Inter,sans-serif">Agente</text>`;
  svg.innerHTML = html;
  const tip = $('#mcpTip');
  let hover = false, auto = 0;
  const light = k => {
    $$('.mcp-link', svg).forEach(l => l.classList.toggle('on', +l.dataset.k === k));
    $$('.mcp-sys', svg).forEach(g => g.classList.toggle('on', +g.dataset.k === k));
    tip.innerHTML = k < 0 ? 'Pasá el mouse por un sistema' : `<b>${SYS[k].n}</b> → el agente puede ${SYS[k].tip}`;
  };
  $$('.mcp-sys', svg).forEach(g => {
    g.addEventListener('mouseenter', () => { hover = true; light(+g.dataset.k); });
    g.addEventListener('mouseleave', () => { hover = false; });
    g.addEventListener('click', () => light(+g.dataset.k));
  });
  trackVis(svg);
  setInterval(() => { if (!hover && svg._vis) light(auto++ % SYS.length); }, 2400);
})();

/* ---------- Prompt injection ---------- */
(() => {
  const inj = $('#inj'), btn = $('#xray'), says = $('#injSays');
  btn.addEventListener('click', () => {
    const on = inj.classList.toggle('xray');
    says.innerHTML = on ? '“Ignorá las instrucciones anteriores…”<br><b>¿Es una orden o es un dato?</b>' : 'Leyendo el ticket… todo parece normal.';
    btn.lastChild.textContent = on ? 'Desactivar rayos X' : 'Activar rayos X';
    const b = $('.bot', inj); b.classList.toggle('bad', on);
  });
  says.textContent = 'Leyendo el ticket… todo parece normal.';
})();

/* ---------- Human in the loop ---------- */
(() => {
  const range = $('#cpRange'), line = $('#cpLine'), verdict = $('#cpVerdict'), val = $('#cpVal');
  const X = n => 10 + (n - 1) / 9 * 400;
  const risk = n => 150 - 135 * Math.exp(-(n - 1) / 1.7);
  const fat = n => 150 - 135 * Math.pow((n - 1) / 9, 2.1);
  // risk(n) y fat(n) devuelven directamente la coordenada Y del gráfico
  let dr = '', df = '';
  for (let n = 1; n <= 10.001; n += .1) {
    dr += (dr ? 'L' : 'M') + X(n).toFixed(1) + ' ' + risk(n).toFixed(1) + ' ';
    df += (df ? 'L' : 'M') + X(n).toFixed(1) + ' ' + fat(n).toFixed(1) + ' ';
  }
  $('#cpRisk').setAttribute('d', dr);
  $('#cpFat').setAttribute('d', df);
  function upd() {
    const n = +range.value;
    line.setAttribute('x1', X(n)); line.setAttribute('x2', X(n));
    val.textContent = n;
    let c, h, p;
    if (n <= 1) { c = 'bad'; h = 'Muy pocos checkpoints'; p = 'El agente construye rápido sobre un error que nadie vio a tiempo.'; }
    else if (n <= 4) { c = 'ok'; h = 'Punto justo'; p = 'Spec validada · <b>Plan aprobado</b> · Diff revisado. Decidís en los puntos que importan.'; }
    else if (n <= 6) { c = 'warn'; h = 'Empiezan a sobrar'; p = 'Cada aprobación extra pesa más de lo que protege.'; }
    else { c = 'bad'; h = 'Demasiados checkpoints'; p = 'Fatiga de aprobación: se termina aprobando sin leer, que es peor que no aprobar.'; }
    verdict.className = 'cp-verdict ' + c;
    verdict.innerHTML = `<h4>${h}</h4><p>${p}</p>`;
  }
  range.addEventListener('input', upd);
  upd();
})();

/* ---------- Feedback loop (terminal) ---------- */
(() => {
  const body = $('#termBody'), cyc = $$('#fbCycle span');
  const card = trackVis($('#feedback .term'));
  const SCRIPT = [
    [0, '<span class="ag">agente ›</span> editando src/refunds/controller.ts', 900],
    [1, '<span class="p">$</span> npm run test && npm run lint', 700],
    [1, '<span class="dm">  ✓ refunds › crea el reembolso</span>', 260],
    [1, '<span class="ko">  ✗ refunds › rechaza monto negativo</span>', 300],
    [1, '<span class="ko">    Expected 400, received 200</span>', 1000],
    [2, '<span class="ag">agente ›</span> falta validar monto &gt; 0 en el schema', 1100],
    [3, '<span class="ag">agente ›</span> corrigiendo refundSchema…', 900],
    [1, '<span class="p">$</span> npm run test && npm run lint', 700],
    [1, '<span class="ok">  ✓ 12 tests pasaron · lint sin errores</span>', 600],
    [1, '<span class="p">$</span> npm run build', 600],
    [1, '<span class="ok">  ✓ build OK — listo para revisión</span>', 2800, true]
  ];
  (async function loop() {
    for (;;) {
      await waitVisible(card);
      body.innerHTML = '';
      for (const [s, h, w, done] of SCRIPT) {
        await waitVisible(card);
        cyc.forEach((el, i) => { el.classList.toggle('on', i === s); el.classList.toggle('okc', !!done && i === s); });
        body.insertAdjacentHTML('beforeend', `<div class="l">${h}</div>`);
        await sleep(w);
      }
    }
  })();
})();

/* ---------- Hooks: prompt vs hook ---------- */
(() => {
  const fp = $('#filesPrompt'), fh = $('#filesHook'), rows = trackVis($('#vsRows'));
  const N = 6;
  fp.innerHTML = fh.innerHTML = Array.from({ length: N }, () => '<span class="fl"></span>').join('');
  async function play() {
    const miss = new Set();
    while (miss.size < 2) miss.add(Math.random() * N | 0);
    const a = $$('.fl', fp), b = $$('.fl', fh);
    [...a, ...b].forEach(f => { f.className = 'fl'; f.textContent = ''; });
    for (let i = 0; i < N; i++) {
      await sleep(260);
      a[i].className = 'fl ' + (miss.has(i) ? 'miss' : 'ok'); a[i].textContent = miss.has(i) ? '!' : '✓';
      b[i].className = 'fl ok'; b[i].textContent = '✓';
    }
  }
  onEnter(rows, async () => { for (;;) { await waitVisible(rows); await play(); await sleep(3200); } }, .5);
})();

/* ---------- Revisión: embudo de filtros ---------- */
(() => {
  const cv = $('#funnelCv'), ctx = cv.getContext('2d');
  trackVis(cv);
  const F = [{ y: .24, p: .55, n: '01 · Auto-verificación' }, { y: .46, p: .6, n: '02 · Agente revisor' }, { y: .68, p: .75, n: '03 · Revisión humana' }];
  let W, H, bugs = [], bursts = [], caught = 0, prod = 0, last = 0;
  const cEl = $('#fCaught'), pEl = $('#fProd');
  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize(); addEventListener('resize', resize);
  function draw(now) {
    requestAnimationFrame(draw);
    if (!cv._vis) return;
    ctx.clearRect(0, 0, W, H);
    F.forEach(f => {
      const y = f.y * H;
      ctx.strokeStyle = 'rgba(22,163,122,.55)'; ctx.setLineDash([6, 6]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(16, y); ctx.lineTo(W - 16, y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(47,215,164,.9)'; ctx.font = '600 12px Inter, sans-serif';
      ctx.fillText(f.n, 18, y - 8);
    });
    ctx.fillStyle = 'rgba(227,6,19,.08)'; ctx.fillRect(0, H * .82, W, H * .18);
    ctx.fillStyle = 'rgba(255,74,85,.8)'; ctx.font = '600 11px Inter, sans-serif';
    ctx.fillText('MERGE', 18, H * .82 + 16);
    if (now - last > 260) {
      last = now;
      bugs.push({ x: 30 + Math.random() * (W - 60), y: -10, v: 1.1 + Math.random() * 1.1, f: 0, w: Math.random() * 6.28 });
    }
    for (let i = bugs.length - 1; i >= 0; i--) {
      const b = bugs[i];
      b.y += b.v; b.w += .15;
      const x = b.x + Math.sin(b.w) * 3;
      if (b.f < F.length && b.y >= F[b.f].y * H) {
        if (Math.random() < F[b.f].p) {
          bursts.push({ x, y: b.y, t: 0 });
          bugs.splice(i, 1); caught++; cEl.textContent = caught; continue;
        }
        b.f++;
      }
      if (b.y > H * .9) { bugs.splice(i, 1); prod++; pEl.textContent = prod; continue; }
      ctx.fillStyle = '#FF4A55'; ctx.shadowColor = '#E30613'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(x, b.y, 4.5, 0, 6.283); ctx.fill(); ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,74,85,.7)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x - 7, b.y - 2); ctx.lineTo(x + 7, b.y - 2); ctx.moveTo(x - 7, b.y + 2); ctx.lineTo(x + 7, b.y + 2); ctx.stroke();
    }
    for (let i = bursts.length - 1; i >= 0; i--) {
      const s = bursts[i]; s.t += .05;
      if (s.t >= 1) { bursts.splice(i, 1); continue; }
      ctx.strokeStyle = `rgba(47,215,164,${1 - s.t})`; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(s.x, s.y, 4 + s.t * 14, 0, 6.283); ctx.stroke();
    }
  }
  requestAnimationFrame(draw);
})();

/* ---------- Evals ---------- */
(() => {
  const t = $('#evTable'), msg = $('#evMsg');
  const MSG = {
    score: 'Mismo puntaje: 2/3 y 2/3… <b>¿da igual?</b>',
    detail: 'La V2 arregló <b>autenticación</b> y rompió <b>input inválido</b>. Sin el eval caso por caso, nadie lo hubiera notado.'
  };
  $$('#evalSeg button').forEach(b => b.addEventListener('click', () => {
    $$('#evalSeg button').forEach(x => x.classList.toggle('on', x === b));
    t.dataset.mode = b.dataset.mode;
    msg.innerHTML = MSG[b.dataset.mode];
  }));
  msg.innerHTML = MSG.score;
})();

/* ---------- El kit, pieza por pieza ---------- */
(() => {
  const HINTS = [
    'Scrolleá para armar el kit pieza por pieza',
    'La base: AGENTS.md, el contexto que todos leen',
    'El Orquestador: un skill que coordina y guarda el estado',
    'Explorador: de material disperso a scope, con preguntas cerradas',
    'Planificador: el plan en design.md, en solo lectura',
    'Desarrollador: ejecuta solo el plan aprobado',
    'QA: genera y corre tests, verifica en el navegador',
    'Documentador: un modelo chico para la documentación técnica',
    'Y el checkpoint más valioso: el plan aprobado, antes de tocar código',
    'Cada pieza aplica los conceptos del recorrido'
  ];
  const parts = $$('#kitArch [data-k]'), hint = $('#kitHint');
  SCRUB.kit = p => {
    const step = Math.floor(p * 10.5) - 1;
    parts.forEach(el => el.classList.toggle('on', +el.dataset.k <= step));
    hint.textContent = HINTS[clamp(step + 1, 0, HINTS.length - 1)];
  };
})();

/* ---------- Ejercicio ---------- */
$$('.flip').forEach(f => f.addEventListener('click', () => f.classList.toggle('open')));

/* ---------- Camino de 5 pasos ---------- */
const pathState = {};
function layoutPath() {
  const wrap = $('#path'), fg = $('#pathFg');
  if (!wrap || getComputedStyle($('.path-svg')).display === 'none') return;
  const W = wrap.clientWidth, sx = W / 1000, top = 120;
  const L = fg.getTotalLength();
  const AX = [20, 260, 500, 740, 980];
  // largo del path en cada hito (buscando el x más cercano)
  const lens = AX.map(ax => {
    let best = 0, bd = 1e9;
    for (let l = 0; l <= L; l += 4) {
      const d = Math.abs(fg.getPointAtLength(l).x - ax);
      if (d < bd) { bd = d; best = l; }
    }
    return best;
  });
  $$('#milestones .ms').forEach((ms, i) => {
    const pt = fg.getPointAtLength(lens[i]);
    const up = pt.y < 100, cw = ms.offsetWidth, ch = ms.offsetHeight, gap = 30;
    const px = pt.x * sx;
    const left = clamp(px - cw / 2, 0, W - cw);
    ms.style.left = left + 'px';
    ms.style.top = (up ? top + pt.y - gap - ch : top + pt.y + gap) + 'px';
    ms.style.setProperty('--ax', (px - left) + 'px');
    ms.style.setProperty('--gap', gap + 'px');
    ms.classList.toggle('up', up); ms.classList.toggle('down', !up);
  });
  Object.assign(pathState, { L, lens, sx, top, fg });
  fg.style.strokeDasharray = L;
  SCRUB.pasos($('#pasos')._p || 0);
}
SCRUB.pasos = p => {
  if (!pathState.L) return;
  const { L, lens, sx, top, fg } = pathState;
  const l = clamp(p / .88) * L;
  fg.style.strokeDashoffset = L - l;
  const pt = fg.getPointAtLength(l);
  $('#walker').style.left = (pt.x * sx) + 'px';
  $('#walker').style.top = (top + pt.y) + 'px';
  $$('#milestones .ms').forEach((ms, i) => ms.classList.toggle('on', l >= lens[i] - 2));
};

/* ---------- Simulador: contexto × spec × verificación ---------- */
(() => {
  const inputs = $$('.formula input'), fillEl = $('#fxFill'), val = $('#fxVal'), msg = $('#fxMsg');
  function upd() {
    const v = inputs.map(i => +i.value);
    inputs.forEach((i, k) => { i.nextElementSibling.textContent = v[k]; });
    const r = Math.round(v[0] * v[1] * v[2] / 10000);
    fillEl.style.width = r + '%';
    fillEl.style.background = r < 30 ? 'var(--red)' : r < 60 ? 'var(--amber)' : 'var(--green)';
    val.textContent = r + '%';
    const lo = Math.min(...v);
    msg.textContent = lo < 25 ? 'Una pieza floja arrastra todo el resultado.'
      : lo >= 85 ? 'Contexto, spec y verificación sólidos: el kit rinde.'
      : 'Subí la pieza más baja: es la que más limita.';
  }
  inputs.forEach(i => i.addEventListener('input', upd));
  upd();
})();

/* ---------- Glosario ---------- */
(() => {
  const G = [
    ['LLM', 'Modelo que genera texto prediciendo lo más probable'],
    ['Token', 'Unidad de texto que procesa el modelo'],
    ['Ventana de contexto', 'Máximo de tokens a la vez'],
    ['Alucinación', 'Respuesta plausible pero falsa'],
    ['Tool use', 'El modelo pide ejecutar una herramienta'],
    ['Loop agéntico', 'Ciclo razonar → actuar → observar'],
    ['Harness', 'Sistema que rodea al modelo: Codex, Claude Code'],
    ['Context engineering', 'Diseñar qué sabe el agente'],
    ['AGENTS.md', 'Memoria persistente del proyecto'],
    ['Progressive disclosure', 'Cargar el detalle solo si hace falta'],
    ['SDD', 'Spec-Driven Development: la spec como contrato'],
    ['Skill', 'Conocimiento empaquetado para un tipo de tarea'],
    ['MCP', 'Estándar para conectar agentes con sistemas'],
    ['Prompt injection', 'Instrucciones ocultas en lo que lee'],
    ['Subagente', 'Agente especializado con contexto propio'],
    ['Sandbox', 'Límites de lo que un agente puede hacer'],
    ['Human in the loop', 'Puntos donde decide una persona'],
    ['Feedback loop', 'El agente verifica y corrige su trabajo'],
    ['Hook', 'Acción automática ante un evento del agente'],
    ['Eval', 'Casos para medir si un agente funciona'],
    ['Headless', 'Agente corriendo sin humano, por ejemplo en CI'],
    ['Plugin', 'Paquete instalable de skills, hooks y MCPs']
  ];
  const g = $('#glossary'), list = $('#gList'), search = $('#gSearch');
  const render = q => {
    const f = q.trim().toLowerCase();
    list.innerHTML = G.filter(([t, d]) => !f || (t + ' ' + d).toLowerCase().includes(f))
      .map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('') || '<p class="muted">Sin resultados.</p>';
  };
  const open = () => { g.classList.add('open'); g.setAttribute('aria-hidden', 'false'); setTimeout(() => search.focus(), 300); };
  const close = () => { g.classList.remove('open'); g.setAttribute('aria-hidden', 'true'); };
  render('');
  search.addEventListener('input', () => render(search.value));
  $('#openGlossary').addEventListener('click', open);
  $('#openGlossary2').addEventListener('click', open);
  $('#closeGlossary').addEventListener('click', close);
  g.addEventListener('click', e => { if (e.target === g) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ---------------- Arranque ---------------- */
addEventListener('resize', () => { layoutPath(); frame(); });
addEventListener('load', () => { layoutPath(); frame(); });
layoutPath();
frame();
})();
