// Genera el pptx de un módulo con el estilo del video (fondo oscuro, Juli y Bit).
//   node armar-pptx.cjs 0      -> ../modulo-0/modulo-0.pptx
// Contenido de cada módulo: ../modulo-N/contenido-pptx.cjs  ·  Preguntas: ../modulo-N/preguntas.js
// Imágenes: ../modulo-N/img/*.png (se generan con: node ../exportar.mjs --modulo N --assets)
const path = require('path');
const fs = require('fs');
const pptxgen = require('pptxgenjs');

const N = process.argv[2];
if (N === undefined) { console.error('Uso: node armar-pptx.cjs <modulo>'); process.exit(1); }
const DIR = path.join(__dirname, '..', `modulo-${N}`);
const C = require(path.join(DIR, 'contenido-pptx.cjs'));
const { PREGUNTAS } = require(path.join(DIR, 'preguntas.js'));
const img = n => path.join(DIR, 'img', n + '.png');

// Paleta del video
const K = { bg: '07090D', panel: '151A23', panel2: '1C2230', line: '2E3542', text: 'F5F6F8', muted: '9AA1AD', dim: '6B7280',
  red: 'E30613', red2: 'FF4A55', green: '16A37A', green2: '2FD7A4', amber: 'F5A524', blue: '5B8DEF' };
const HF = 'Calibri', BF = 'Calibri', MF = 'Consolas';

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 in
pres.author = 'TSOFT · AI Adoption Program 2026';
pres.title = `Módulo ${N} · ${C.titulo}`;

// ---------- piezas ----------
const W = 10, H = 5.625;
function base(section) {
  const s = pres.addSlide();
  s.background = { color: K.bg };
  s.addText([{ text: 'TSOFT', options: { bold: true, color: K.text } }, { text: `   ·   MÓDULO ${N}`, options: { color: K.muted } }],
    { x: .5, y: .22, w: 4, h: .3, fontFace: HF, fontSize: 10, charSpacing: 3, margin: 0, isTextBox: true });
  if (section) s.addText(section.toUpperCase(), { x: 5.5, y: .22, w: 4, h: .3, fontFace: HF, fontSize: 10, color: K.muted, charSpacing: 3, align: 'right', margin: 0, isTextBox: true });
  return s;
}
const title = (s, t, o = {}) => s.addText(t, { x: .5, y: o.y ?? .6, w: o.w ?? 9, h: o.h ?? .75, fontFace: HF, fontSize: o.size ?? 32, bold: true, color: K.text, margin: 0, valign: 'top', isTextBox: true, fit: 'shrink' });
const text = (s, t, x, y, w, h, o = {}) => s.addText(t, { x, y, w, h, fontFace: BF, fontSize: o.size ?? 15, color: o.color ?? K.muted, bold: !!o.bold, margin: 0, valign: o.valign ?? 'top', align: o.align ?? 'left', isTextBox: true, paraSpaceAfter: o.psa ?? 0, fit: 'shrink' });
const panel = (s, x, y, w, h, o = {}) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: o.r ?? .12, fill: { color: o.fill ?? K.panel }, line: { color: o.line ?? K.line, width: o.lw ?? 1 } });
const circle = (s, x, y, d, color) => s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 } });
const pic = (s, n, x, y, w) => s.addImage({ path: img(n), x, y, w, h: w * 9 / 16, rounding: false });
function bullets(s, items, x, y, w, h, size = 16) {
  s.addText(items.map((t, i) => ({ text: t, options: { bullet: { indent: 16 }, breakLine: i < items.length - 1 } })),
    { x, y, w, h, fontFace: BF, fontSize: size, color: K.text, paraSpaceAfter: 10, margin: 0, valign: 'top', isTextBox: true, fit: 'shrink' });
}
function key(s, t, y = 4.75) {
  panel(s, .5, y, 9, .5, { fill: '2A0C10', line: K.red });
  s.addText([{ text: 'CLAVE   ', options: { bold: true, color: K.red2 } }, { text: t, options: { color: K.text } }],
    { x: .7, y, w: 8.6, h: .5, fontFace: BF, fontSize: 13, valign: 'middle', margin: 0, isTextBox: true, fit: 'shrink' });
}

// ---------- tipos de slide ----------
const T = {
  portada(d) {
    const s = base('');
    s.addText('CURSO · DESARROLLO POTENCIADO POR IA CON CODEX', { x: .6, y: 1.3, w: 8, h: .3, fontFace: HF, fontSize: 11, color: K.muted, charSpacing: 2, margin: 0, isTextBox: true });
    s.addText(`MÓDULO ${N}`, { x: .6, y: 1.75, w: 5, h: .5, fontFace: HF, fontSize: 22, bold: true, color: K.red2, charSpacing: 6, margin: 0, isTextBox: true });
    s.addText(C.titulo, { x: .6, y: 2.25, w: 5.6, h: 1.3, fontFace: HF, fontSize: 48, bold: true, color: K.text, margin: 0, valign: 'top', isTextBox: true, fit: 'shrink' });
    text(s, C.bajada, .6, 3.6, 5.2, .7, { size: 16 });
    panel(s, .6, 4.45, 2.6, .38, { r: .19, fill: K.panel2 });
    text(s, d.chip, .6, 4.45, 2.6, .38, { size: 12, color: K.text, bold: true, align: 'center', valign: 'middle' });
    s.addImage({ path: img('juli'), x: 6.1, y: 2.35, w: 3.0, h: 3.1 });
    s.addImage({ path: img('bit'), x: 7.6, y: .9, w: 2.1, h: 2.1 });
    return s;
  },
  objetivos(d) {
    const s = base('Objetivos');
    title(s, 'En este módulo vas a…');
    d.items.forEach(([t, desc], i) => {
      const x = .5 + (i % 2) * 4.6, y = 1.55 + Math.floor(i / 2) * 1.45;
      panel(s, x, y, 4.4, 1.25);
      circle(s, x + .25, y + .3, .5, K.red);
      text(s, String(i + 1), x + .25, y + .3, .5, .5, { size: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      text(s, t, x + .95, y + .25, 3.3, .4, { size: 17, bold: true, color: K.text });
      text(s, desc, x + .95, y + .65, 3.3, .5, { size: 12 });
    });
    panel(s, .5, 4.6, 3.4, .4, { r: .2, fill: '2A2008', line: K.amber });
    text(s, 'Al final: challenge + quiz interactivo', .5, 4.6, 3.4, .4, { size: 12, bold: true, color: K.amber, align: 'center', valign: 'middle' });
    return s;
  },
  imagen(d) { // título + bullets a la izquierda, captura del video a la derecha
    const s = base(d.section);
    title(s, d.titulo, { w: 9 });
    bullets(s, d.bullets, .5, 1.55, 3.9, 2.9, d.size || 15);
    panel(s, 4.6, 1.45, 4.9, 2.9, { fill: K.bg, line: K.line });
    s.addImage({ path: img(d.img), x: 4.65, y: 1.5, w: 4.8, h: 2.7 });
    if (d.clave) key(s, d.clave);
    return s;
  },
  columnas(d) { // dos columnas comparativas
    const s = base(d.section);
    title(s, d.titulo);
    d.cols.forEach(([h, col, items], i) => {
      const x = .5 + i * 4.6;
      panel(s, x, 1.5, 4.4, 2.95, { line: col });
      text(s, h, x + .3, 1.65, 3.8, .45, { size: 18, bold: true, color: col });
      bullets(s, items, x + .3, 2.2, 3.9, 2.1, 15);
    });
    if (d.clave) key(s, d.clave);
    return s;
  },
  pasos(d) {
    const s = base(d.section);
    title(s, d.titulo);
    if (d.chip) { panel(s, 6.9, .68, 2.6, .36, { r: .18, fill: '2A2008', line: K.amber }); text(s, d.chip, 6.9, .68, 2.6, .36, { size: 11, bold: true, color: K.amber, align: 'center', valign: 'middle' }); }
    d.pasos.forEach(([t, desc], i) => {
      const x = .5 + i * 3.07;
      panel(s, x, 1.5, 2.87, 2.9);
      circle(s, x + .25, 1.75, .5, K.red);
      text(s, String(i + 1), x + .25, 1.75, .5, .5, { size: 18, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      text(s, t, x + .25, 2.45, 2.4, .45, { size: 18, bold: true, color: K.text });
      text(s, desc, x + .25, 2.95, 2.4, 1.3, { size: 13 });
    });
    if (d.clave) key(s, d.clave);
    return s;
  },
  resumen(d) {
    const s = base('Resumen');
    title(s, 'Lo que te llevás');
    d.items.forEach((t, i) => {
      const y = 1.5 + i * .64;
      panel(s, .5, y, 9, .52, { fill: K.panel2 });
      circle(s, .68, y + .1, .32, K.green);
      text(s, '✓', .68, y + .1, .32, .32, { size: 13, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
      text(s, t, 1.2, y, 8.1, .52, { size: 15, bold: true, color: K.text, valign: 'middle' });
    });
    return s;
  },
  challenge() {
    const qs = PREGUNTAS.preguntas;
    for (let p = 0; p < qs.length; p += 2) {
      const s = base('Challenge');
      title(s, `Challenge · preguntas ${p + 1}–${Math.min(p + 2, qs.length)} de ${qs.length}`, { size: 24 });
      qs.slice(p, p + 2).forEach((q, j) => {
        const y = 1.3 + j * 2.0;
        text(s, `${p + j + 1}. ${q.q}`, .5, y, 9, .55, { size: 16, bold: true, color: K.text });
        q.opts.forEach((o, k) => {
          panel(s, .7, y + .68 + k * .42, 8.6, .36, { fill: K.panel2 });
          text(s, `${'ABC'[k]}   ${o}`, .9, y + .68 + k * .42, 8.3, .36, { size: 12.5, color: K.text, valign: 'middle' });
        });
      });
      s.addNotes('Dejá unos segundos para que cada persona piense su respuesta antes de pasar a las respuestas.');
    }
    for (let p = 0; p < qs.length; p += 4) {
      const s = base('Challenge');
      title(s, `Respuestas${qs.length > 4 ? ` (${p + 1}–${Math.min(p + 4, qs.length)})` : ''}`, { size: 24 });
      qs.slice(p, p + 4).forEach((q, j) => {
        const y = 1.3 + j * .98;
        panel(s, .5, y, 9, .86, { fill: K.panel2 });
        circle(s, .65, y + .2, .46, K.green);
        text(s, 'ABC'[q.ok], .65, y + .2, .46, .46, { size: 16, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
        text(s, `${p + j + 1}. ${q.opts[q.ok]}`, 1.3, y + .08, 8, .34, { size: 13, bold: true, color: K.text });
        text(s, q.exp, 1.3, y + .42, 8, .4, { size: 11 });
      });
    }
  },
  cierre(d) {
    const s = base('');
    circle(s, 4.55, 1.0, .9, K.green);
    text(s, '✓', 4.55, 1.0, .9, .9, { size: 34, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle' });
    text(s, `Módulo ${N} completo`, 1, 2.05, 8, .7, { size: 36, bold: true, color: K.text, align: 'center' });
    text(s, 'Siguiente paso: quiz interactivo del módulo (quiz.html)', 1, 2.8, 8, .4, { size: 15, color: K.amber, align: 'center' });
    text(s, 'PRÓXIMO', 1, 3.55, 8, .3, { size: 11, color: K.dim, align: 'center', bold: true });
    text(s, d.siguiente, 1, 3.85, 8, .5, { size: 24, bold: true, color: K.red2, align: 'center' });
    s.addImage({ path: img('walk'), x: 8.4, y: 3.4, w: 1.0, h: 1.4 });
    return s;
  }
};

C.slides.forEach(d => {
  const s = T[d.tipo](d);
  if (s && d.notas) s.addNotes(d.notas);
});
const out = path.join(DIR, `modulo-${N}.pptx`);
pres.writeFile({ fileName: out }).then(() => console.log('Listo:', out));
