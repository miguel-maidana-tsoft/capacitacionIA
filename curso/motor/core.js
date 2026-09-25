/* =========================================================
   TSOFT · Curso "Desarrollo potenciado por IA con Codex"
   Motor de animación compartido por todos los módulos.
   Cada módulo define sus escenas y llama a F.run(escenas, meta).
   Todo se dibuja con renderAt(t): determinístico y exportable a MP4.
   ========================================================= */
(() => {
'use strict';

const W = 1920, H = 1080, FPS = 30;
const QS = new URLSearchParams(location.search);
const EXPORT = QS.has('export');
if (EXPORT) document.body.classList.add('export');

const canvas = document.getElementById('film');
const main = canvas.getContext('2d');
const mkBuf = (w = W, h = H) => { const b = document.createElement('canvas'); b.width = w; b.height = h; return b; };
const bufA = mkBuf(), bufB = mkBuf();
let c = main, GA = 1;

/* ---------------- Paleta y utilidades ---------------- */
const P = {
  bg: '#07090D', panel: '#121720', panel2: '#181E29', panel3: '#232B3A',
  line: 'rgba(255,255,255,.08)', line2: 'rgba(255,255,255,.16)',
  text: '#F5F6F8', muted: '#9AA1AD', dim: '#5E6570',
  red: '#E30613', red2: '#FF4A55', green: '#16A37A', green2: '#2FD7A4',
  amber: '#F5A524', blue: '#5B8DEF', purple: '#9B7BEA', skin: '#F0C39E', hair: '#1c1f24'
};
const FONT = 'Inter, "Segoe UI", system-ui, sans-serif';
const MONO = '"JetBrains Mono", Consolas, monospace';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const E = {
  lin: t => t,
  out: t => 1 - Math.pow(1 - t, 3),
  inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  in: t => t * t * t,
  back: t => { const k = 1.70158, k3 = k + 1; return 1 + k3 * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2); }
};
const seg = (t, a, b, e = E.out) => e(clamp((t - a) / (b - a)));
const rnd = i => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const typed = (s, p) => s.slice(0, Math.floor(s.length * clamp(p)));
const blink = (t, seed = 0) => (((t + seed * 1.37) % (3.6 + (seed % 3) * .7)) < .13 ? .1 : 1);

function ga(a = 1) { c.globalAlpha = clamp(GA * a); }
function alpha(a, fn) { if (a <= .001) return; const p = GA; GA = p * a; fn(); GA = p; }
function font(s, w = 700, mono = false) { c.font = `${w} ${s}px ${mono ? MONO : FONT}`; c.textRendering = mono ? 'optimizeSpeed' : 'optimizeLegibility'; }
function T(str, x, y, o = {}) {
  const { s = 40, w = 700, col = P.text, al = 'left', bl = 'alphabetic', a = 1, mono = false, ls = 0 } = o;
  font(s, w, mono); c.textAlign = al; c.textBaseline = bl; c.letterSpacing = ls + 'px';
  ga(a); c.fillStyle = col; c.fillText(str, x, y);
  const wd = c.measureText(str).width; c.letterSpacing = '0px'; return wd;
}
function measure(str, s, w = 700, mono = false) { font(s, w, mono); return c.measureText(str).width; }
function wrapLines(str, maxW, s, w = 700, mono = false) {
  font(s, w, mono);
  const out = []; let cur = '';
  for (const wd of str.split(' ')) {
    const test = cur ? cur + ' ' + wd : wd;
    if (c.measureText(test).width > maxW && cur) { out.push(cur); cur = wd; } else cur = test;
  }
  if (cur) out.push(cur);
  return out;
}
function TW(str, x, y, maxW, lh, o = {}) {
  const lines = wrapLines(str, maxW, o.s || 40, o.w || 700, o.mono);
  lines.forEach((l, i) => T(l, x, y + i * lh, o));
  return lines.length;
}
function box(x, y, w, h, o = {}) {
  const { r = 18, fill = P.panel, stroke = P.line2, lw = 2, a = 1, shadow = 0, glow = null, dash = null } = o;
  c.save(); ga(a);
  if (shadow) { c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowBlur = shadow; c.shadowOffsetY = shadow * .35; }
  if (glow) { c.shadowColor = glow; c.shadowBlur = 44; c.shadowOffsetY = 0; }
  c.beginPath(); c.roundRect(x, y, w, h, r);
  if (fill) { c.fillStyle = fill; c.fill(); }
  c.shadowColor = 'transparent';
  if (stroke) { if (dash) c.setLineDash(dash); c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
  c.restore();
}
function ln(x1, y1, x2, y2, col, lw = 2, a = 1, dash = null) {
  c.save(); ga(a); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round';
  if (dash) c.setLineDash(dash);
  c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
}
function dot(x, y, r, col, a = 1) { ga(a); c.fillStyle = col; c.beginPath(); c.arc(x, y, Math.max(0, r), 0, Math.PI * 2); c.fill(); }
function glowAt(x, y, r, rgb, a = 1) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${.5 * a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ga(1); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
}

/* ---------------- Íconos (trazo, caja de 24) ---------------- */
const ICON = {
  file: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 13h6M9 17h6',
  check: 'M5 12l5 5L19 7', x: 'M6 6l12 12M18 6L6 18',
  db: 'M5 6a7 3 0 1 0 14 0a7 3 0 1 0-14 0M5 6v12c0 1.7 3 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3 3 7 3s7-1.3 7-3',
  globe: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  ticket: 'M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM14 7v10',
  send: 'M21 3L10 14M21 3l-7 18-4-7-7-4z', pen: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  lock: 'M5 13a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2zM8 11V7a4 4 0 0 1 8 0v4',
  search: 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0-14 0M20 20l-4-4',
  code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16',
  book: 'M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1',
  wrench: 'M14.5 6.5a4 4 0 0 0 5 5L11 20a2.1 2.1 0 0 1-3-3l8.5-8.5a4 4 0 0 0-2-2z',
  terminal: 'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM7 9l3 3-3 3M12 15h5',
  box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  route: 'M8 19h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7M4 19a2 2 0 1 0 4 0a2 2 0 1 0-4 0M16 5a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0',
  folder: 'M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z',
  user: 'M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 21c1-4 4-6 8-6s7 2 8 6'
};
const ICON_P = {};
function icon(n, x, y, s, col, a = 1, lw = 2) {
  const p = ICON_P[n] || (ICON_P[n] = new Path2D(ICON[n]));
  c.save(); ga(a); c.translate(x - s / 2, y - s / 2); c.scale(s / 24, s / 24);
  c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(p); c.restore();
}

/* ---------------- Personajes ---------------- */
// Juli, de medio cuerpo. (x, y) = centro inferior del torso.
function juli(x, y, s, o = {}) {
  const { t = 0, mood = 'calm', look = 0, screen = false, seed = 0, a = 1 } = o;
  alpha(a, () => {
    c.save(); c.translate(x, y); c.scale(s, s);
    // torso
    ga(1); c.fillStyle = '#2B2E34';
    c.beginPath(); c.moveTo(-120, 0); c.bezierCurveTo(-120, -92, -84, -136, 0, -140);
    c.bezierCurveTo(84, -136, 120, -92, 120, 0); c.closePath(); c.fill();
    ln(-32, -137, 0, -98, P.red, 7); ln(0, -98, 32, -137, P.red, 7);
    ga(1); c.fillStyle = '#E2AF88'; c.beginPath(); c.roundRect(-18, -172, 36, 42, 8); c.fill();
    const hy = -222, bob = Math.sin(t * 1.6 + seed) * 2;
    c.translate(look * 5, bob);
    // pelo de atrás + rodete
    dot(0, hy - 70, 27, P.hair);
    dot(0, hy + 4, 66, P.hair);
    // cara
    dot(0, hy + 6, 60, P.skin);
    if (screen) glowAt(8, hy + 10, 90, '120,160,255', .35);
    // flequillo
    ga(1); c.fillStyle = P.hair; c.beginPath();
    c.arc(0, hy, 64, Math.PI, 0); c.lineTo(64, hy + 12);
    c.quadraticCurveTo(58, hy - 30, 18, hy - 36); c.quadraticCurveTo(-32, hy - 30, -52, hy - 2);
    c.lineTo(-64, hy + 24); c.closePath(); c.fill();
    // mejillas
    dot(-36, hy + 26, 10, '#FF8A8A', .25); dot(36, hy + 26, 10, '#FF8A8A', .25);
    // ojos
    const b = mood === 'wow' ? 1.15 : blink(t, seed + 1);
    ga(1); c.fillStyle = P.hair;
    for (const sx of [-21, 21]) {
      c.beginPath(); c.ellipse(sx + look * 3, hy + 8, 6.5, 8.5 * b, 0, 0, Math.PI * 2); c.fill();
    }
    if (b > .5) { dot(-19 + look * 3, hy + 5, 2, '#fff', .9); dot(23 + look * 3, hy + 5, 2, '#fff', .9); }
    // cejas
    c.save(); ga(1); c.strokeStyle = P.hair; c.lineWidth = 4; c.lineCap = 'round';
    const by = mood === 'wow' ? hy - 20 : hy - 12;
    if (mood === 'stress') {
      c.beginPath(); c.moveTo(-31, by - 2); c.lineTo(-13, by + 4); c.moveTo(31, by - 2); c.lineTo(13, by + 4); c.stroke();
    } else {
      c.beginPath(); c.moveTo(-31, by + 2); c.quadraticCurveTo(-22, by - 4, -12, by + 1);
      c.moveTo(31, by + 2); c.quadraticCurveTo(22, by - 4, 12, by + 1); c.stroke();
    }
    // boca
    c.lineWidth = 4;
    if (mood === 'happy') {
      c.fillStyle = '#9C2A33'; c.beginPath(); c.moveTo(-16, hy + 30); c.quadraticCurveTo(0, hy + 50, 16, hy + 30); c.closePath(); c.fill();
    } else if (mood === 'stress') {
      c.beginPath(); c.moveTo(-14, hy + 36); c.quadraticCurveTo(-7, hy + 30, 0, hy + 36); c.quadraticCurveTo(7, hy + 42, 14, hy + 36); c.stroke();
    } else if (mood === 'wow') {
      c.fillStyle = '#9C2A33'; c.beginPath(); c.ellipse(0, hy + 37, 8, 10, 0, 0, Math.PI * 2); c.fill();
    } else {
      c.beginPath(); c.moveTo(-12, hy + 33); c.quadraticCurveTo(0, hy + 41, 12, hy + 33); c.stroke();
    }
    c.restore();
    if (mood === 'stress') {
      const k = (t * .9 + seed) % 1;
      ga(1 - k); c.fillStyle = '#7cc4ff'; c.beginPath();
      const sy = hy - 36 + k * 30; c.moveTo(70, sy); c.quadraticCurveTo(78, sy + 12, 70, sy + 16); c.quadraticCurveTo(62, sy + 12, 70, sy); c.fill();
    }
    c.restore();
  });
}
// Juli de cuerpo entero, caminando. (x, y) = pies.
function juliWalk(x, y, s, t, walking = true) {
  c.save(); c.translate(x, y); c.scale(s, s);
  const sw = walking ? Math.sin(t * 9) : 0, bob = walking ? -Math.abs(Math.sin(t * 9)) * 4 : 0;
  c.translate(0, bob);
  c.save(); ga(1); c.strokeStyle = P.hair; c.lineWidth = 11; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-6, -58); c.lineTo(-6 + sw * 16, 0); c.moveTo(6, -58); c.lineTo(6 - sw * 16, 0); c.stroke();
  c.strokeStyle = '#2B2E34'; c.lineWidth = 10;
  c.beginPath(); c.moveTo(-22, -108); c.lineTo(-28 - sw * 14, -66); c.moveTo(22, -108); c.lineTo(28 + sw * 14, -66); c.stroke();
  c.restore();
  ga(1); c.fillStyle = '#2B2E34'; c.beginPath(); c.roundRect(-25, -122, 50, 70, 16); c.fill();
  ln(-12, -121, 0, -106, P.red, 4); ln(0, -106, 12, -121, P.red, 4);
  dot(0, -168, 12, P.hair);
  dot(0, -146, 25, P.hair); dot(0, -144, 22, P.skin);
  ga(1); c.fillStyle = P.hair; c.beginPath(); c.arc(0, -148, 25, Math.PI, 0); c.lineTo(25, -142);
  c.quadraticCurveTo(10, -160, -20, -150); c.lineTo(-25, -138); c.closePath(); c.fill();
  dot(-8, -142, 2.6, P.hair); dot(8, -142, 2.6, P.hair);
  c.save(); ga(1); c.strokeStyle = P.hair; c.lineWidth = 2.5; c.beginPath(); c.arc(0, -135, 6, .2, Math.PI - .2); c.stroke(); c.restore();
  c.restore();
}
const BC = {
  red: ['#FF8A91', '#E30613', '#5C0207', '227,6,19'], blue: ['#A9C4FF', '#3B6FE0', '#0D2466', '59,111,224'],
  purple: ['#D6C4FF', '#8A63E8', '#2E1766', '138,99,232'], green: ['#8FF0CF', '#16A37A', '#04382A', '22,163,122'],
  amber: ['#FFE0A1', '#F5A524', '#6B3E00', '245,165,36'], grey: ['#AEB4BF', '#4B5260', '#15181E', '140,148,160']
};
// Bit, el agente.
function bit(x, y, r, o = {}) {
  const { t = 0, col = 'red', eyes = 1, mood = 'calm', seed = 0, glow = 1, a = 1, ring = true } = o;
  alpha(a, () => {
    const [hi, mid, lo, rgb] = BC[col];
    const fy = y + Math.sin(t * 2.1 + seed) * r * .06;
    glowAt(x, fy, r * 2.4, rgb, glow);
    const ry = r * (.3 + .06 * Math.sin(t * 1.6 + seed)), rot = -.32;
    if (ring) { c.save(); ga(.3); c.strokeStyle = '#fff'; c.lineWidth = Math.max(1.5, r * .035); c.beginPath(); c.ellipse(x, fy, r * 1.4, ry, rot, Math.PI, Math.PI * 2); c.stroke(); c.restore(); }
    const g = c.createRadialGradient(x - r * .35, fy - r * .4, r * .08, x, fy, r);
    g.addColorStop(0, hi); g.addColorStop(.55, mid); g.addColorStop(1, lo);
    ga(1); c.fillStyle = g; c.beginPath(); c.arc(x, fy, r, 0, Math.PI * 2); c.fill();
    if (ring) { c.save(); ga(.55); c.strokeStyle = '#fff'; c.lineWidth = Math.max(1.5, r * .035); c.beginPath(); c.ellipse(x, fy, r * 1.4, ry, rot, 0, Math.PI); c.stroke(); c.restore(); }
    const bb = eyes * blink(t, seed + 3), ew = r * .2, eh = Math.max(r * .05, r * .38 * bb);
    ga(1); c.fillStyle = '#fff';
    for (const s of [-1, 1]) { c.beginPath(); c.roundRect(x + s * r * .24 - ew / 2, fy - r * .08 - eh / 2, ew, eh, ew / 2); c.fill(); }
    if (mood === 'happy') {
      c.save(); ga(.95); c.strokeStyle = '#fff'; c.lineWidth = r * .07; c.lineCap = 'round';
      c.beginPath(); c.arc(x, fy + r * .16, r * .2, .2 * Math.PI, .8 * Math.PI); c.stroke(); c.restore();
    }
    if (mood === 'alert') T('?', x + r * .9, fy - r * .8, { s: r * .9, w: 900, col: P.amber, al: 'center' });
  });
}
function laptop(x, y, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  box(-130, -150, 260, 146, { r: 12, fill: '#2A303B', stroke: 'rgba(255,255,255,.12)' });
  glowAt(0, -78, 26, '227,6,19', .8); dot(0, -78, 9, P.red2);
  ga(1); c.fillStyle = '#1B2029'; c.beginPath(); c.roundRect(-150, -8, 300, 10, 4); c.fill();
  c.restore();
}
function desk(x1, x2, y) {
  ga(1); c.fillStyle = '#131821'; c.fillRect(x1, y, x2 - x1, 18);
  c.fillStyle = 'rgba(255,255,255,.09)'; c.fillRect(x1, y, x2 - x1, 2);
  const g = c.createLinearGradient(0, y + 18, 0, y + 120); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g; c.fillRect(x1, y + 18, x2 - x1, 102);
}
function mug(x, y, t, steam = true, a = 1) {
  alpha(a, () => {
    c.save(); ga(1); c.strokeStyle = '#DADDE3'; c.lineWidth = 6; c.beginPath(); c.arc(x + 22, y - 28, 12, -Math.PI / 2, Math.PI / 2); c.stroke(); c.restore();
    box(x - 22, y - 52, 44, 52, { r: 8, fill: '#E8E9EC', stroke: null });
    ga(1); c.fillStyle = P.red; c.fillRect(x - 22, y - 36, 44, 9);
    if (steam) for (let i = 0; i < 3; i++) {
      const k = (t * .6 + i / 3) % 1;
      c.save(); ga((1 - k) * .5); c.strokeStyle = '#fff'; c.lineWidth = 3; c.lineCap = 'round';
      c.beginPath(); const sx = x - 10 + i * 10, sy = y - 60 - k * 40;
      c.moveTo(sx, sy); c.quadraticCurveTo(sx + Math.sin(t * 3 + i) * 8, sy - 12, sx, sy - 24); c.stroke(); c.restore();
    }
  });
}
function clock(x, y, r, ang) {
  dot(x, y, r, P.panel2); c.save(); ga(1); c.strokeStyle = P.line2; c.lineWidth = 3; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke(); c.restore();
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; ln(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8, x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9, P.dim, 3); }
  ln(x, y, x + Math.cos(ang / 12 - Math.PI / 2) * r * .5, y + Math.sin(ang / 12 - Math.PI / 2) * r * .5, P.text, 6);
  ln(x, y, x + Math.cos(ang - Math.PI / 2) * r * .75, y + Math.sin(ang - Math.PI / 2) * r * .75, P.red2, 4);
  dot(x, y, 6, P.text);
}
function stamp(txt, x, y, k, col = P.red2, sub = '') {
  if (k <= 0) return;
  const sc = lerp(2.4, 1, E.back(clamp(k)));
  c.save(); c.translate(x, y); c.rotate(-.13); c.scale(sc, sc);
  const w = measure(txt, 56, 900) + 70;
  box(-w / 2, -58, w, sub ? 116 : 96, { r: 14, fill: 'rgba(7,9,13,.88)', stroke: col, lw: 6, a: clamp(k * 3) });
  T(txt, 0, sub ? 4 : 18, { s: 56, w: 900, col, al: 'center', a: clamp(k * 3), ls: 3 });
  if (sub) T(sub, 0, 42, { s: 22, w: 600, col, al: 'center', a: clamp(k * 3) });
  c.restore();
}
function network(t, build, cx, cy, rx, ry, n, seedBase = 0, a = 1) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const k = i + seedBase * 100;
    pts.push({
      x: cx + (rnd(k * 3 + 1) - .5) * 2 * rx + Math.sin(t * .35 + i) * 16,
      y: cy + (rnd(k * 5 + 2) - .5) * 2 * ry + Math.cos(t * .28 + i * 1.3) * 12,
      lit: rnd(k * 11 + 3) < build, r: 1.5 + rnd(k * 13) * 2
    });
  }
  const L = 175;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const p = pts[i], q = pts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d > L) continue;
    const lit = p.lit && q.lit, al = (1 - d / L) * a;
    ln(p.x, p.y, q.x, q.y, lit ? P.red : '#fff', lit ? 1.4 : 1, lit ? al * .6 : al * .1);
  }
  pts.forEach(p => dot(p.x, p.y, p.lit ? p.r * 1.4 : p.r, p.lit ? P.red2 : 'rgba(255,255,255,.4)', a));
}


Object.assign(ICON, {
  dice: 'M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3zM9 9h.01M15 15h.01M15 9h.01M9 15h.01',
  gear: 'M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  coin: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M15 9c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5M12 6v1.5M12 16.5V18',
  clock: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M12 7v5l3 2',
  alert: 'M12 3l10 18H2zM12 10v5M12 18v.5',
  target: 'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0M7 12a5 5 0 1 0 10 0a5 5 0 1 0-10 0M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
  play: 'M7 4l13 8-13 8z', layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  chat: 'M4 5h16v11H9l-5 4z', flag: 'M5 21V4M5 4h11l-2 4 2 4H5'
});

/* =========================================================
   COMPONENTES REUTILIZABLES
   ========================================================= */
// Ventana de terminal con líneas que se tipean: lines = [[tInicio, texto, color], ...]
function terminal(x, y, w, h, title, lines, t, o = {}) {
  const { s = 24, lh = 46, speed = .45, a = 1 } = o;
  alpha(a, () => {
    box(x, y, w, h, { fill: '#0B0E13', shadow: 40 });
    dot(x + 35, y + 40, 7, P.red); dot(x + 58, y + 40, 7, '#3a4150'); dot(x + 81, y + 40, 7, '#3a4150');
    T(title, x + 110, y + 48, { s: 20, w: 500, mono: true, col: P.dim });
    lines.forEach(([ts, l, col], i) => T(typed(l, (t - ts) / speed), x + 40, y + 110 + i * lh, { s, w: 500, mono: true, col: col || P.text }));
  });
}
// Etiqueta redondeada
function chip(txt, x, y, o = {}) {
  const { s = 22, col = P.text, fill = P.panel2, stroke = P.line2, a = 1, al = 'left', mono = false, pad = 22, h = s * 2 } = o;
  const w = measure(txt, s, 700, mono) + pad * 2, x0 = al === 'center' ? x - w / 2 : x;
  box(x0, y, w, h, { r: h / 2, fill, stroke, a });
  T(txt, x0 + pad, y + h / 2 + s * .36, { s, w: 700, col, a, mono });
  return w;
}
// Tarjeta con ícono + título + texto
function card(x, y, w, h, ic, title, text, o = {}) {
  const { a = 1, col = P.red2, fill = P.panel2, stroke = P.line2 } = o;
  alpha(a, () => {
    box(x, y, w, h, { fill, stroke });
    dot(x + 52, y + 52, 30, 'rgba(227,6,19,.14)');
    icon(ic, x + 52, y + 52, 32, col, 1, 2.2);
    T(title, x + 100, y + 62, { s: 28, w: 800 });
    if (text) TW(text, x + 30, y + 122, w - 60, 34, { s: 23, w: 400, col: P.muted });
  });
}

/* =========================================================
   ESCENAS GENÉRICAS DEL CURSO
   ========================================================= */
const G = {};
// Portada del módulo
G.portada = (m) => ({
  label: 'Portada', dur: 9, section: '',
  voz: [[1.2, `Módulo ${m.n}. ${m.titulo}.`], [3.4, m.bajada]],
  draw(t) {
    network(t, seg(t, .5, 7, E.lin), 1450, 520, 520, 420, 52, m.n + 2, .5);
    const k = [seg(t, .3, 1.1), seg(t, .7, 1.5), seg(t, 1.1, 1.9), seg(t, 1.7, 2.5), seg(t, 2.2, 3)];
    T('CURSO · DESARROLLO POTENCIADO POR IA CON CODEX', 160 + (1 - k[0]) * 40, 330, { s: 24, w: 700, ls: 6, col: P.muted, a: k[0] });
    T(`MÓDULO ${m.n}`, 160, 430 + (1 - k[1]) * 30, { s: 44, w: 900, ls: 10, col: P.red2, a: k[1] });
    const lines = wrapLines(m.titulo, 1100, 110, 900);
    lines.forEach((l, i) => T(l, 155, 555 + i * 116 + (1 - k[2]) * 30, { s: 110, w: 900, a: k[2], ls: -4 }));
    const yy = 555 + (lines.length - 1) * 116;
    TW(m.bajada, 162, yy + 90, 1000, 46, { s: 34, w: 400, col: P.muted, a: k[3] });
    chip(m.duracion, 162, yy + 170, { s: 22, col: P.text, a: k[4] });
    juli(1330, 1000, .95, { t, mood: 'happy', look: .6, a: seg(t, 2.4, 3.2) });
    bit(1640, 700, 90, { t, mood: 'happy', a: seg(t, 2.8, 3.6) });
  }
});
// "En este módulo vas a…"
G.objetivos = (items, extra) => ({
  label: 'Objetivos', dur: 15, section: 'Objetivos',
  cap: [[.6, 6, 'En este módulo vas a entender cuatro ideas que usás todos los días, aunque no las veas.'], [6.5, 14.4, extra || 'Al final hay un challenge para que compruebes lo que aprendiste.']],
  draw(t) {
    T('En este módulo vas a…', 160, 230, { s: 64, w: 900, a: seg(t, .2, .9) });
    items.forEach(([ic, tit, txt], i) => {
      const col = i % 2, row = Math.floor(i / 2), x = 160 + col * 820, y = 300 + row * 250;
      const a = seg(t, 1 + i * .6, 1.7 + i * .6);
      c.save(); c.translate(0, (1 - a) * 30);
      card(x, y, 780, 220, ic, tit, txt, { a });
      c.restore();
    });
    chip('Al final: challenge + quiz interactivo', 160, 830, { s: 24, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)', a: seg(t, 4, 4.6) });
  }
});
// Separador de sección
G.seccion = (num, titulo, bajada) => ({
  label: num + ' · ' + titulo, dur: 5, section: num,
  voz: [[.4, `${titulo}.`]],
  draw(t) {
    const a = seg(t, .1, .7);
    T(num, 160, 520, { s: 220, w: 900, col: 'rgba(227,6,19,.2)', a, ls: -8 });
    T(titulo, 170 + (1 - a) * 40, 600, { s: 88, w: 900, a, ls: -3 });
    T(bajada, 176, 680, { s: 32, w: 400, col: P.muted, a: seg(t, .5, 1.2) });
  }
});
// "Lo que te llevás"
G.resumen = (items) => ({
  label: 'Resumen', dur: 20, section: 'Resumen',
  cap: [[.5, 6, 'Repasemos. Estas son las ideas que te llevás de este módulo.'], [6.5, 19.4, 'Si alguna no te cierra, volvé a esa sección antes del challenge.']],
  draw(t) {
    T('Lo que te llevás', 160, 210, { s: 64, w: 900, a: seg(t, .2, .9) });
    items.forEach((it, i) => {
      const a = seg(t, 1 + i * .9, 1.6 + i * .9), y = 290 + i * 118;
      box(160, y, 1600, 96, { r: 20, fill: P.panel2, stroke: P.line2, a });
      dot(222, y + 48, 28, P.green, a); icon('check', 222, y + 48, 30, '#fff', a, 3);
      T(it, 280, y + 60, { s: 32, w: 600, a });
    });
  }
});
// Challenge: intro
G.challengeIntro = (n) => ({
  label: 'Challenge', dur: 7, section: 'Challenge',
  voz: [[.6, `Llegó el challenge: ${n} preguntas. Pensá tu respuesta antes de que aparezca.`]],
  draw(t) {
    const k = seg(t, .2, .9, E.back);
    c.save(); c.translate(960, 440); c.scale(k, k);
    glowAt(0, 0, 360, '227,6,19', .8);
    T('CHALLENGE', 0, 40, { s: 150, w: 900, al: 'center', ls: 6 });
    c.restore();
    T(`${n} preguntas · pensá tu respuesta antes de que aparezca`, 960, 600, { s: 36, w: 600, al: 'center', col: P.muted, a: seg(t, 1, 1.6) });
    chip('Si necesitás más tiempo, pausá el video', 960, 660, { s: 24, al: 'center', col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)', a: seg(t, 1.6, 2.2) });
  }
});
// Challenge: una pregunta
G.pregunta = (q, i, n) => ({
  label: `Pregunta ${i + 1}`, dur: 16, section: 'Challenge',
  voz: [[.4, `Pregunta ${i + 1}. ${q.q}`], [9.4, `Respuesta correcta: la ${'ABC'[q.ok]}. ${q.opts[q.ok]}.`]],
  draw(t) {
    const rv = t > 9.2, ra = seg(t, 9.2, 9.7);
    T(`PREGUNTA ${i + 1} DE ${n}`, 160, 170, { s: 24, w: 800, ls: 6, col: P.red2, a: seg(t, 0, .5) });
    const ql = wrapLines(q.q, 1300, 52, 800);
    ql.forEach((l, k) => T(l, 160, 260 + k * 66, { s: 52, w: 800, a: seg(t, .2, .8) }));
    const oy = 260 + ql.length * 66 + 50;
    q.opts.forEach((o, k) => {
      const y = oy + k * 118, a = seg(t, .9 + k * .35, 1.4 + k * .35), ok = k === q.ok;
      const fill = rv ? (ok ? 'rgba(22,163,122,.22)' : 'rgba(255,255,255,.02)') : P.panel2;
      const stroke = rv ? (ok ? P.green : P.line) : P.line2;
      box(160, y, 1300, 96, { r: 20, fill, stroke, lw: rv && ok ? 4 : 2, a: a * (rv && !ok ? .45 : 1) });
      dot(222, y + 48, 26, rv && ok ? P.green : P.panel3, a * (rv && !ok ? .45 : 1));
      T('ABC'[k], 222, y + 58, { s: 28, w: 900, al: 'center', a: a * (rv && !ok ? .45 : 1) });
      const ol = wrapLines(o, 1120, 30, 600);
      ol.forEach((l, j) => T(l, 280, y + 58 - (ol.length - 1) * 18 + j * 36, { s: 30, w: 600, a: a * (rv && !ok ? .45 : 1) }));
      if (rv && ok) icon('check', 1410, y + 48, 40, P.green2, ra, 3);
    });
    // cuenta regresiva
    const cd = clamp((t - 2) / 7), left = Math.ceil((7 - (t - 2)) * RITMO); // segundos reales
    if (t > 1.8 && !rv) {
      c.save(); ga(1); c.lineWidth = 12; c.strokeStyle = P.line2; c.beginPath(); c.arc(1660, 520, 110, 0, Math.PI * 2); c.stroke();
      c.strokeStyle = P.amber; c.lineCap = 'round'; c.beginPath(); c.arc(1660, 520, 110, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - cd)); c.stroke(); c.restore();
      T(String(Math.max(1, left)), 1660, 555, { s: 96, w: 900, al: 'center' });
      T('pensá tu respuesta', 1660, 690, { s: 24, w: 600, al: 'center', col: P.muted });
    }
    if (rv) {
      c.save(); c.translate(1660, 520); const k = E.back(ra); c.scale(k, k);
      dot(0, 0, 110, P.green); icon('check', 0, 0, 120, '#fff', 1, 3); c.restore();
      const ey = oy + q.opts.length * 118 + 30;
      box(160, ey, 1600, 110, { r: 20, fill: 'rgba(22,163,122,.1)', stroke: 'rgba(22,163,122,.45)', a: seg(t, 9.6, 10.2) });
      TW('Por qué: ' + q.exp, 200, ey + 46, 1520, 38, { s: 28, w: 500, col: '#D7F5EA', a: seg(t, 9.6, 10.2) });
    }
  }
});
// Cierre del módulo
G.cierre = (m) => ({
  label: 'Cierre', dur: 13, section: '',
  cap: [[.6, 6.4, `¡Módulo ${m.n} completo! Ahora hacé el quiz interactivo para afianzar lo que viste.`], [6.9, 12.5, `En el próximo módulo: ${m.siguiente}.`]],
  draw(t) {
    network(t, 1, 960, 500, 900, 420, 56, m.n + 5, .45 * seg(t, 0, 1));
    const k = seg(t, .2, .9, E.back);
    c.save(); c.translate(960, 330); c.scale(k, k);
    dot(0, 0, 80, P.green); icon('check', 0, 0, 90, '#fff', 1, 3); c.restore();
    T(`Módulo ${m.n} completo`, 960, 500, { s: 80, w: 900, al: 'center', a: seg(t, .6, 1.3) });
    chip('Siguiente paso: quiz interactivo del módulo', 960, 560, { s: 26, al: 'center', col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)', a: seg(t, 1.3, 1.9) });
    T('PRÓXIMO', 960, 720, { s: 22, w: 800, ls: 8, col: P.dim, al: 'center', a: seg(t, 2.2, 2.8) });
    T(m.siguiente, 960, 790, { s: 48, w: 800, al: 'center', col: P.red2, a: seg(t, 2.4, 3) });
    const wx = lerp(-100, 2020, seg(t, 3, 12.5, E.lin));
    juliWalk(wx, 900, 1, t, true);
    const end = seg(t, 11.8, 13, E.lin);
    if (end > 0) { ga(end); c.fillStyle = '#000'; c.fillRect(0, 0, W, H); }
  }
});

/* =========================================================
   MOTOR
   ========================================================= */
const O = .8;
// RITMO: cuánto más lento se reproduce el guion (1.35 = ritmo de lectura cómodo; ?ritmo=1 = original)
let S = [], META = {}, DUR_IN = 0, DUR = 0, CLEAN = false, RITMO = 1.35;

function background(t) {
  c = main; GA = 1; ga(1);
  c.fillStyle = P.bg; c.fillRect(0, 0, W, H);
  const gx = 1500 + Math.sin(t * .07) * 200, gy = 150 + Math.cos(t * .05) * 80;
  let g = c.createRadialGradient(gx, gy, 0, gx, gy, 900); g.addColorStop(0, 'rgba(227,6,19,.10)'); g.addColorStop(1, 'rgba(227,6,19,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  g = c.createRadialGradient(200, 1000, 0, 200, 1000, 800); g.addColorStop(0, 'rgba(91,141,239,.06)'); g.addColorStop(1, 'rgba(91,141,239,0)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(255,255,255,.028)'; c.lineWidth = 1; c.beginPath();
  const off = (t * 6) % 80;
  for (let x = -80 + off; x < W; x += 80) { c.moveTo(x, 0); c.lineTo(x, H); }
  for (let y = -80 + off; y < H; y += 80) { c.moveTo(0, y); c.lineTo(W, y); }
  c.stroke();
  for (let i = 0; i < 50; i++) {
    const x = rnd(i) * W + Math.sin(t * .2 + i) * 20, y = ((rnd(i + 99) * H - t * (8 + rnd(i + 7) * 14)) % H + H) % H;
    dot(x, y, 1 + rnd(i + 3) * 1.4, '#fff', .12 + rnd(i + 5) * .15);
  }
  g = c.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, H * 1.05); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.55)');
  ga(1); c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function drawScene(s, t, ctx) {
  c = ctx; GA = 1;
  const lt = t - s.start;
  c.save();
  const z = 1 + .025 * (lt / s.dur);
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-W / 2, -H / 2);
  s.draw(lt, s.dur, c);
  c.restore();
  c.globalAlpha = 1; c.filter = 'none';
}
function caption(txt, a) {
  c = main; GA = 1;
  const lines = wrapLines(txt, 1380, 38, 500);
  let mw = 0; lines.forEach(l => { mw = Math.max(mw, measure(l, 38, 500)); });
  const bh = lines.length * 52 + 34, bw = mw + 80, y0 = 1040 - bh + (1 - a) * 14;
  box(W / 2 - bw / 2, y0, bw, bh, { r: 18, fill: 'rgba(5,7,10,.8)', stroke: 'rgba(255,255,255,.06)', a });
  lines.forEach((l, i) => T(l, W / 2, y0 + 56 + i * 52, { s: 38, w: 500, al: 'center', a }));
}
function renderAt(t) { renderCore(t / RITMO); }
function renderCore(t) {
  t = clamp(t, 0, DUR_IN - 1e-4);
  background(t);
  const act = S.filter(s => t >= s.start && t < s.start + s.dur);
  let weights = [1];
  if (act.length === 1) drawScene(act[0], t, main);
  else if (act.length >= 2) {
    const k = E.inOut(clamp((t - act[1].start) / O));
    weights = [1 - k, k];
    [bufA, bufB].forEach((b, i) => { const x = b.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.clearRect(0, 0, W, H); drawScene(act[i], t, x); });
    main.globalAlpha = weights[0]; main.drawImage(bufA, 0, 0);
    main.globalAlpha = weights[1]; main.drawImage(bufB, 0, 0);
    main.globalAlpha = 1;
  }
  if (!CLEAN) act.forEach((s, i) => {
    const lt = t - s.start;
    (s.cap || []).forEach(([a0, a1, txt]) => {
      if (lt < a0 || lt > a1) return;
      const a = Math.min(seg(lt, a0, a0 + .35), 1 - seg(lt, a1 - .35, a1)) * (weights[i] ?? 1);
      if (a > 0) caption(txt, a);
    });
  });
  // marca y sección
  c = main; GA = 1;
  if (CLEAN) { c.globalAlpha = 1; return; }
  const tw = T('TSOFT', 60, 70, { s: 24, w: 900, ls: 3, a: .6 });
  T(`·  MÓDULO ${META.n}`, 60 + tw + 14, 70, { s: 20, w: 700, ls: 4, col: P.muted, a: .6 });
  act.forEach((s, i) => { if (s.section) T(s.section.toUpperCase(), W - 60, 70, { s: 20, w: 700, ls: 4, col: P.muted, al: 'right', a: .7 * (weights[i] ?? 1) }); });
  const fin = seg(t, 0, .6, E.lin);
  if (fin < 1) { ga(1 - fin); c.fillStyle = '#000'; c.fillRect(0, 0, W, H); }
  c.globalAlpha = 1;
}
// Personajes con fondo transparente (para el pptx)
function sprite(kind, w, h, o = {}) {
  const b = mkBuf(w, h), prev = c; c = b.getContext('2d'); GA = 1;
  if (kind === 'juli') juli(w / 2, h, h / 340, { t: 1, mood: o.mood || 'happy', look: o.look || 0, seed: 9 });
  if (kind === 'bit') bit(w / 2, h / 2, h / 5, { t: 1, mood: o.mood || 'happy', col: o.col || 'red', seed: 9 });
  if (kind === 'walk') juliWalk(w / 2, h - 4, h / 190, .3, true);
  c = prev;
  return b.toDataURL('image/png');
}

const ready = (async () => {
  try {
    await Promise.all(['400 30px Inter', '500 30px Inter', '600 30px Inter', '700 30px Inter', '800 30px Inter', '900 30px Inter', '500 30px "JetBrains Mono"', '700 30px "JetBrains Mono"'].map(f => document.fonts.load(f)));
    await document.fonts.ready;
  } catch (e) { /* sin red: fuentes del sistema */ }
})();

function run(scenes, meta) {
  S = scenes; META = meta;
  let acc = 0;
  S.forEach(s => { s.start = acc; acc += s.dur - O; });
  RITMO = +(QS.get('ritmo') || meta.ritmo || 1.35);
  DUR_IN = S[S.length - 1].start + S[S.length - 1].dur;
  DUR = DUR_IN * RITMO;
  // la duración que muestra la portada se calcula sola
  if (!meta.duracion) meta.duracion = `≈ ${Math.round(DUR / 60)} min · challenge al final`;
  const assets = meta.assets || {};
  window.FILM = {
    duration: DUR, fps: FPS, renderAt, ready, scenes: S.map(s => ({ label: s.label, start: s.start * RITMO })), ritmo: RITMO,
    assetNames: () => Object.keys(assets),
    // Narración: subtítulos + textos solo de voz (voz), en tiempo global
    cues: () => S.flatMap(s => [...(s.cap || []).map(([a, b, x]) => ({ t: (s.start + a) * RITMO, end: (s.start + b) * RITMO, text: x })),
                                 ...(s.voz || []).map(([a, x]) => ({ t: (s.start + a) * RITMO, end: null, text: x }))]).sort((p, q) => p.t - q.t),
    asset: name => {
      const a = assets[name];
      if (a.sprite) return sprite(a.sprite, a.w, a.h, a);
      const t = a.scene ? S.find(s => s.label === a.scene).start + a.at : a.t;
      CLEAN = true; renderCore(t); CLEAN = false; return canvas.toDataURL('image/png');
    }
  };
  document.title = `Módulo ${meta.n} · ${meta.titulo} · TSOFT`;
  if (EXPORT) { ready.then(() => renderAt(0)); return; }

  const playBtn = document.getElementById('play'), timeEl = document.getElementById('time'), bar = document.getElementById('bar'),
        fill = bar.querySelector('.fill'), chap = document.getElementById('chapter'), start = document.getElementById('start');
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  S.forEach(s => {
    if (!s.section || s.label.startsWith('Pregunta')) return;
    const m = document.createElement('div'); m.className = 'mark'; m.style.left = (s.start * RITMO / DUR * 100) + '%';
    m.innerHTML = `<span>${s.label}</span>`; bar.appendChild(m);
  });
  let poster = true; const POSTER = 5.5 * (typeof RITMO !== "undefined" ? RITMO : (typeof SLOW !== "undefined" ? SLOW : 1));
  let t = +(QS.get('t') || 0), playing = false, last = 0;
  const setPlaying = v => { playing = v; playBtn.textContent = v ? '❚❚' : '▶'; start.style.display = 'none'; last = performance.now(); };
  function ui() {
    fill.style.width = (t / DUR * 100) + '%';
    timeEl.textContent = `${fmt(t)} / ${fmt(DUR)}`;
    const cur = S.filter(s => t >= s.start * RITMO).pop(); chap.textContent = cur ? cur.label : '';
  }
  function loop(now) {
    requestAnimationFrame(loop);
    if (playing) { t += (now - last) / 1000; last = now; if (t >= DUR) { t = DUR - .001; playing = false; playBtn.textContent = '↺'; } }
    renderAt(poster ? Math.min(POSTER, DUR - .01) : t); ui();
  }
  ready.then(() => requestAnimationFrame(loop));
  start.addEventListener('click', () => { poster = false; setPlaying(true); });
  playBtn.addEventListener('click', () => { poster = false; if (t >= DUR - .01) t = 0; setPlaying(!playing); });
  const seek = e => { const r = bar.getBoundingClientRect(); t = clamp((e.clientX - r.left) / r.width) * DUR; };
  let drag = false;
  bar.addEventListener('pointerdown', e => { poster = false; drag = true; bar.setPointerCapture(e.pointerId); seek(e); start.style.display = 'none'; });
  bar.addEventListener('pointermove', e => drag && seek(e));
  bar.addEventListener('pointerup', () => { drag = false; });
  document.getElementById('full').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  addEventListener('keydown', e => {
    if (e.code === 'Space') { e.preventDefault(); poster = false; if (t >= DUR - .01) t = 0; setPlaying(!playing); }
    if (e.key === 'ArrowRight') t = Math.min(DUR - .01, t + 5);
    if (e.key === 'ArrowLeft') t = Math.max(0, t - 5);
    if (e.key === 'f' || e.key === 'F') document.getElementById('full').click();
  });
}

window.F = {
  W, H, P, E, ICON, clamp, lerp, seg, rnd, typed, blink,
  ga, alpha, font, T, measure, wrapLines, TW, box, ln, dot, glowAt, icon,
  juli, juliWalk, bit, BC, laptop, desk, mug, clock, stamp, network,
  terminal, chip, card, G, run
};
})();
