/* =========================================================
   MÓDULO 0 · Cómo piensa la IA
   Ejemplo conductor del curso: "pagos-api", el proyecto de Juli.
   ========================================================= */
(() => {
const { P, E, clamp, lerp, seg, typed, ga, alpha, T, measure, wrapLines, TW, box, ln, dot, glowAt, icon,
        juli, bit, stamp, terminal, chip, card, G } = F;

const META = {
  n: 0,
  titulo: 'Cómo piensa la IA',
  bajada: 'Por qué la IA acierta un día y al otro no, y qué hacer al respecto.',
  siguiente: 'Módulo 1 · Del chat al agente'
};

const S = [];
S.push(G.portada(META));
S.push(G.objetivos([
  ['brain', 'Un LLM predice', 'Por qué la IA no consulta ni recuerda: predice.'],
  ['layers', 'Tokens y ventana de contexto', 'Qué "sabe" el agente en cada momento y qué pasa cuando se llena.'],
  ['dice', 'Probabilístico vs. determinístico', 'Qué le pedís al modelo y qué tiene que garantizar el código.'],
  ['shield', 'Alucinaciones', 'Por qué inventa y cómo se controla de verdad.']
]));

/* ---------- El problema ---------- */
S.push({
  label: 'El problema', dur: 18, section: 'El problema',
  cap: [[.8, 5.6, 'Juli trabaja en pagos-api, la API de pagos de su equipo. Le hace a la IA la misma pregunta dos días seguidos.'],
        [6.1, 11.2, 'Y recibe dos respuestas distintas. Una hasta usa una función que no existe en el proyecto.'],
        [11.7, 17.3, 'Para trabajar bien con IA, primero hay que entender cómo piensa. De eso se trata este módulo.']],
  draw(t, d, c) {
    [['LUNES', 140, 'if (monto <= 0) throw new Error("monto inválido")', false],
     ['MARTES', 1000, 'validateAmount(monto) // helper del proyecto', true]].forEach(([day, x, code, bad], i) => {
      alpha(seg(t, .3 + i * .4, 1 + i * .4), () => {
        box(x, 160, 780, 520, { fill: P.panel, shadow: 40, stroke: bad && t > 7 ? P.amber : P.line2 });
        T(day, x + 40, 215, { s: 22, w: 800, ls: 6, col: P.muted });
        const ub = 'Validá el monto del reembolso', uw = measure(ub, 26, 500) + 50, ua = seg(t, 1 + i * .6, 1.4 + i * .6);
        box(x + 740 - uw, 250, uw, 60, { r: 22, fill: '#2A3242', stroke: null, a: ua });
        T(ub, x + 740 - uw + 25, 289, { s: 26, w: 500, a: ua });
        const ca = seg(t, 2.2 + i * .8, 2.6 + i * .8);
        box(x + 40, 350, 700, 140, { r: 14, fill: '#0B0E13', stroke: P.line2, a: ca });
        T('respuesta de la IA', x + 70, 390, { s: 18, w: 500, mono: true, col: P.dim, a: ca });
        T(typed(code, (t - 2.6 - i * .8) / 1.2), x + 70, 448, { s: 22, w: 500, mono: true, col: '#D7DBE3', a: ca });
        if (bad) chip('validateAmount() no existe en el repo', x + 40, 540, { s: 22, col: P.amber, stroke: 'rgba(245,165,36,.6)', fill: 'rgba(245,165,36,.12)', a: seg(t, 7, 7.5) });
        else chip('✓ funciona', x + 40, 540, { s: 22, col: P.green2, stroke: 'rgba(22,163,122,.6)', fill: 'rgba(22,163,122,.12)', a: seg(t, 6, 6.5) });
      });
    });
    juli(1790, 900, .55, { t, mood: t > 7 ? 'wow' : 'calm', look: -.6 });
    T('¿Por qué pasa esto?', 960, 810, { s: 60, w: 900, al: 'center', a: seg(t, 11.5, 12.2) });
  }
});

/* ---------- 0.1 Un LLM predice ---------- */
S.push(G.seccion('0.1', 'Un LLM predice', 'No consulta ni recuerda: completa lo más probable.'));
const PRE = 'Para validar el monto, usá';
const STEPS = [[['el', 62], ['un', 21], ['zod', 11], ['Joi', 6]], [['schema', 48], ['validador', 27], ['método', 15], ['helper', 10]], [['del', 55], ['de', 30], ['que', 10], ['y', 5]]];
S.push({
  label: 'Un LLM predice', dur: 36, section: '0.1 · Un LLM predice',
  cap: [[.5, 5.5, 'Un LLM —un modelo de lenguaje— genera texto pieza por pieza.'],
        [6, 11.5, 'En cada paso elige, entre muchos candidatos, lo que es más probable que siga.'],
        [12, 17.5, 'No "busca" la respuesta: arma la respuesta que suena más probable.'],
        [18, 21.8, 'Y así, token por token, completa la frase.'],
        [22.3, 28, 'No consulta una base de datos ni recuerda tu proyecto: trabaja con lo que aprendió y con lo que le das en el momento.'],
        [28.5, 35.5, 'De ahí salen tres consecuencias: puede variar, siempre suena seguro, y solo sabe lo que ve.']],
  draw(t, d, c) {
    const p1 = 1 - seg(t, 21.5, 22.5);
    alpha(p1, () => {
      let x = 200 + T(PRE, 200, 290, { s: 56, w: 700, col: P.muted, a: seg(t, .3, 1) });
      STEPS.forEach((st, k) => {
        const tk = st[0][0], at = 6 + k * 5 + .5;
        if (t < at) return;
        const w = measure(' ' + tk, 56, 800);
        box(x + 10, 238, w - 4, 70, { r: 10, fill: 'rgba(227,6,19,.22)', stroke: null, a: seg(t, at, at + .3) });
        T(' ' + tk, x, 290, { s: 56, w: 800, a: seg(t, at, at + .3) });
        x += w;
      });
      if (t > 18) T(typed(' proyecto.', (t - 18) / 1.2), x, 290, { s: 56, w: 800, col: '#fff' });
      if (t < 18.5 && t > 2.5) box(x + 14, 240, 6, 66, { r: 2, fill: P.red, stroke: null, a: Math.floor(t * 2.5) % 2 ? 1 : .2 });
      const k = clamp(Math.floor((t - 3) / 5), 0, 2), lt = t - 3 - k * 5;
      alpha(seg(t, 2.5, 3.2) * (1 - seg(t, 18, 18.8)), () => {
        box(200, 380, 1040, 330, { fill: P.panel, shadow: 30 });
        T(`PASO ${k + 1} DE 3 · CANDIDATOS PARA EL PRÓXIMO TOKEN`, 240, 430, { s: 20, w: 700, ls: 4, col: P.dim, mono: true });
        STEPS[k].forEach(([n, pct], i) => {
          const y = 490 + i * 56, pick = i === 0 && lt > 3;
          T(n, 240, y + 10, { s: 28, w: 500, mono: true, col: pick ? '#fff' : P.muted });
          box(520, y - 8, 560, 16, { r: 8, fill: 'rgba(255,255,255,.06)', stroke: null });
          box(520, y - 8, 560 * pct / 70 * seg(lt, 0, 1.5), 16, { r: 8, fill: pick ? P.red : '#3a4252', stroke: null });
          T(pct + '%', 1200, y + 10, { s: 24, w: 600, mono: true, al: 'right', col: P.muted });
        });
      });
      bit(1560, 520, 110, { t, col: 'grey', mood: 'calm' });
      T('el modelo', 1560, 720, { s: 26, w: 700, al: 'center', col: P.muted });
      for (let i = 0; i < 3; i++) dot(1500 + i * 60, 350 - Math.abs(Math.sin(t * 4 + i)) * 16, 9, P.muted, .8);
    });
    const p2 = seg(t, 22.3, 23);
    alpha(p2, () => {
      dot(420, 420, 120, P.panel2); icon('db', 420, 420, 120, P.dim, 1, 1.6);
      ln(330, 330, 510, 510, P.red2, 10); ln(510, 330, 330, 510, P.red2, 10);
      T('No consulta una base de datos', 420, 600, { s: 30, w: 700, al: 'center' });
      [['book', 'Lo que aprendió', 'en su entrenamiento', 320], ['chat', 'Lo que le das ahora', 'tu pedido y el contexto', 480]].forEach(([ic, a1, a2, y], i) => {
        const a = seg(t, 23.5 + i * .8, 24.2 + i * .8);
        card(820, y - 60, 560, 130, ic, a1, a2, { a });
        ln(1380, y, 1500, 440, P.red, 4, a, [6, 8]);
      });
      bit(1600, 440, 95, { t, mood: 'calm' });
      [['dice', 'Puede variar'], ['alert', 'Siempre suena seguro'], ['eye', 'Solo sabe lo que ve']].forEach(([ic, n], i) => {
        const a = seg(t, 28.8 + i * .7, 29.4 + i * .7), x = 200 + i * 540;
        box(x, 700, 500, 100, { r: 20, fill: P.panel2, stroke: 'rgba(227,6,19,.45)', a });
        icon(ic, x + 55, 750, 40, P.red2, a, 2.2);
        T(n, x + 100, 762, { s: 32, w: 800, a });
      });
    });
  }
});

/* ---------- 0.2 Tokens ---------- */
S.push(G.seccion('0.2', 'Tokens', 'La unidad en que la IA lee, cobra y se limita.'));
const TOK = ['Re', 'embol', 'sá', ' el', ' pago', ' 48', '12', ' de', ' Jul', 'i'];
const TCOL = ['#8A1C24', '#2C5282', '#1F6F5A', '#5B4A8A', '#6B3E00'];
S.push({
  label: 'Tokens', dur: 30, section: '0.2 · Tokens',
  cap: [[.5, 5, 'El modelo no lee letras ni palabras: lee tokens.'],
        [5.5, 11, 'Un token es un fragmento de texto: a veces una palabra entera, a veces un pedazo.'],
        [11.5, 17.5, 'Todo lo que el agente procesa se mide en tokens: tu pedido, los archivos, los errores, el historial.'],
        [18, 24, 'Por eso el costo y la velocidad dependen de los tokens: más contexto, más caro y más lento.'],
        [24.5, 29.5, 'Y hay un límite de cuántos tokens puede considerar a la vez: la ventana de contexto.']],
  draw(t, d, c) {
    const sp = seg(t, 2, 4.5, E.inOut);
    let x = 200;
    TOK.forEach((tk, i) => {
      const w = measure(tk, 72, 800), a = seg(t, 2 + i * .22, 2.4 + i * .22);
      box(x - 4 + sp * 6, 232, w + 8, 96, { r: 12, fill: TCOL[i % TCOL.length], stroke: null, a: a * .9 });
      T(tk, x + sp * 6, 305, { s: 72, w: 800, a: seg(t, .2, .8) });
      x += w + sp * 22;
    });
    T('10 tokens', 200, 410, { s: 44, w: 900, col: P.red2, a: seg(t, 5.2, 5.8) });
    T('(división ilustrativa: cada modelo tokeniza distinto)', 440, 408, { s: 22, w: 500, col: P.dim, a: seg(t, 5.6, 6.2) });
    chip('costo ↑', 1300, 370, { s: 24, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)', a: seg(t, 18.5, 19) });
    chip('velocidad ↓', 1480, 370, { s: 24, col: '#9DB9F5', stroke: 'rgba(91,141,239,.5)', fill: 'rgba(91,141,239,.1)', a: seg(t, 19, 19.5) });
    alpha(seg(t, 11.5, 12.2), () => {
      box(160, 480, 1600, 400, { fill: P.panel });
      T('¿CUÁNTOS TOKENS OCUPA…?', 200, 530, { s: 20, w: 700, ls: 4, col: P.dim });
      const lim = 1620;
      [['tu pedido', .03, P.green], ['un archivo', .16, P.green], ['una carpeta', .55, P.amber], ['todo el repo', 1.35, P.red]].forEach(([n, v, col], i) => {
        const y = 580 + i * 72, k = seg(t, 12.5 + i * .9, 13.8 + i * .9, E.inOut);
        T(n, 200, y + 30, { s: 28, w: 600 });
        c.save(); c.beginPath(); c.rect(460, y, 1280, 50); c.clip();
        box(460, y + 6, Math.max(8, 1160 * v * k), 38, { r: 8, fill: col, stroke: null });
        c.restore();
        if (i === 3 && k > .9) T('no entra', 1740, y - 2, { s: 24, w: 800, col: P.red2, al: 'right' });
      });
      ln(lim, 570, lim, 870, '#fff', 3, seg(t, 16, 16.6), [8, 8]);
      T('límite de la ventana', lim - 12, 866, { s: 20, w: 700, col: '#fff', al: 'right', a: seg(t, 16, 16.6) });
    });
  }
});

/* ---------- 0.3 Ventana de contexto ---------- */
S.push(G.seccion('0.3', 'La ventana de contexto', 'Todo lo que el agente "sabe" en un momento.'));
const BLK = [['Instrucciones del sistema', 60, '#3A4150'], ['AGENTS.md', 70, '#8A1C24'], ['Archivos que leyó', 140, '#2C5282'], ['Resultados de comandos', 110, '#1F6F5A'], ['Historial', 150, '#5B4A8A'], ['Más historial', 120, '#6B4E9B']];
S.push({
  label: 'Ventana de contexto', dur: 36, section: '0.3 · Ventana de contexto',
  cap: [[.5, 5.5, 'La ventana de contexto es todo lo que el modelo puede tener en cuenta a la vez.'],
        [6, 11.5, 'Ahí entran las instrucciones, el AGENTS.md, los archivos que leyó, los resultados de comandos y la conversación.'],
        [12, 17.5, 'Cuando se llena, el agente resume y compacta… y en el camino se pierden detalles.'],
        [18, 24, 'Por ejemplo: la convención de usar logger.error que Juli explicó al principio de la sesión.'],
        [24.5, 30, 'Una hora después, el agente vuelve a usar console.log. No es que "no quiera": ya no lo ve.'],
        [30.5, 35.5, 'Lo importante tiene que estar escrito donde siempre se carga, no dicho una sola vez.']],
  draw(t, d, c) {
    const cx = 380, rim = 300, bot = 860, k = seg(t, 12, 14.5, E.inOut);
    T('VENTANA DE CONTEXTO', cx, 262, { s: 22, w: 700, ls: 4, col: P.muted, al: 'center' });
    let total = 0; BLK.forEach(([, h], i) => { if (t > .8 + i * .9) total += i === 4 ? lerp(h, 90, k) : i === 5 ? lerp(h, 0, k) : h; });
    const over = total > bot - rim;
    c.save(); ga(1); c.strokeStyle = over ? P.red : P.line2; c.lineWidth = 4; if (over) { c.shadowColor = P.red; c.shadowBlur = 30; }
    c.beginPath(); c.moveTo(200, rim); c.lineTo(200, bot - 30); c.arcTo(200, bot, 230, bot, 30); c.lineTo(530, bot); c.arcTo(560, bot, 560, bot - 30, 30); c.lineTo(560, rim); c.stroke(); c.restore();
    ln(180, rim, 580, rim, over ? P.red2 : P.muted, 2, 1, [10, 8]);
    let b = bot - 4;
    BLK.forEach(([n, h0, col], i) => {
      const ti = .8 + i * .9, e = seg(t, ti, ti + .6, E.back);
      const h = i === 4 ? lerp(h0, 90, k) : i === 5 ? lerp(h0, 0, k) : h0;
      if (e <= 0 || h < 2) { b -= h; return; }
      const y = lerp(-150, b - h / 2, e);
      box(cx - 170, y - h / 2 + 3, 340, h - 6, { r: 10, fill: col, stroke: 'rgba(255,255,255,.18)' });
      if (h > 30) T(i === 4 && k > .5 ? 'Historial (resumido)' : n, cx, y + 9, { s: 22, w: 700, al: 'center' });
      b -= h;
    });
    if (t > 12.8 && t < 16) {
      const f = t - 12.8;
      c.save(); c.translate(cx + 40 + f * 170, 420 + 260 * f * f); c.rotate(f * 1.3);
      chip('usar logger.error', 0, -22, { s: 20, al: 'center', col: P.amber, stroke: P.amber, fill: 'rgba(245,165,36,.2)', a: 1 - seg(t, 15, 16), mono: true });
      c.restore();
    }
    alpha(seg(t, 18, 18.8), () => {
      box(760, 180, 1020, 620, { fill: P.panel, shadow: 40 });
      T('UNA HORA DESPUÉS…', 800, 235, { s: 22, w: 800, ls: 6, col: P.muted });
      bit(1700, 250, 40, { t, mood: 'calm' });
      const ub = 'Agregá un log cuando falle el reembolso', uw = measure(ub, 26, 500) + 50;
      box(1740 - uw, 290, uw, 60, { r: 22, fill: '#2A3242', stroke: null, a: seg(t, 19, 19.4) });
      T(ub, 1740 - uw + 25, 329, { s: 26, w: 500, a: seg(t, 19, 19.4) });
      const ca = seg(t, 20, 20.4);
      box(800, 390, 940, 170, { r: 14, fill: '#0B0E13', stroke: t > 24.5 ? P.red : P.line2, lw: t > 24.5 ? 3 : 2, a: ca });
      ['} catch (err) {', '  console.log(err)', '}'].forEach((l, i) => T(typed(l, (t - 20.4 - i * .5) / .5), 840, 440 + i * 44, { s: 26, w: 500, mono: true, col: i === 1 && t > 24.5 ? P.red2 : '#D7DBE3' }));
      chip('La convención era logger.error… pero ya no está en la ventana', 800, 600, { s: 22, col: P.red2, stroke: 'rgba(227,6,19,.6)', fill: 'rgba(227,6,19,.12)', a: seg(t, 25, 25.6) });
      chip('→ En el Módulo 2: escribirlo en el AGENTS.md', 800, 690, { s: 22, col: P.green2, stroke: 'rgba(22,163,122,.6)', fill: 'rgba(22,163,122,.12)', a: seg(t, 30.8, 31.4) });
    });
  }
});

/* ---------- 0.4 Probabilístico vs. determinístico ---------- */
S.push(G.seccion('0.4', 'Probabilístico vs. determinístico', 'Una instrucción sugiere. Un test garantiza.'));
const RUNS = [['ok', 'ok', 'ok', 'ok'], ['ok', 'skip', 'ok', 'ok'], ['ok', 'ok', 'ok', 'ok'], ['ok', 'ok', 'err', 'ok'], ['skip', 'ok', 'ok', 'ok']];
const ITEMS = [['Entender una spec', 0], ['Correr los tests', 1], ['Diseñar una solución', 0], ['Validar el formato (linter)', 1], ['Escribir código', 0], ['Bloquear comandos riesgosos', 1], ['Explicar un error', 0], ['Verificar que compile', 1]];
S.push({
  label: 'Probabilístico vs. determinístico', dur: 36, section: '0.4 · Prob. vs. determinístico',
  cap: [[.5, 5.5, 'El modelo es probabilístico: razona y se adapta, pero puede variar, saltearse un paso o equivocarse.'],
        [6, 11, 'El código es determinístico: hace siempre exactamente lo mismo.'],
        [11.5, 14.5, 'No compiten: se complementan.'],
        [15, 22, 'Al modelo, lo que requiere interpretar. Al código, lo que no puede fallar nunca.'],
        [22.5, 29, 'Regla de oro: si algo tiene que pasar siempre, no se lo pidas al modelo. Hacelo determinístico.'],
        [29.5, 35.5, 'Una instrucción en un prompt es una sugerencia. Un test o un hook es una garantía. Lo vas a aplicar en el Módulo 4.']],
  draw(t, d, c) {
    alpha(1 - seg(t, 14, 15), () => {
      [['El modelo', 'probabilístico', 'dice', P.amber, 160], ['El código', 'determinístico', 'gear', P.green2, 1020]].forEach(([n, sub, ic, col, x], side) => {
        alpha(seg(t, .3 + side * .5, 1 + side * .5), () => {
          box(x, 170, 740, 560, { fill: P.panel, shadow: 30 });
          icon(ic, x + 70, 240, 56, col, 1, 2);
          T(n, x + 120, 252, { s: 40, w: 800 }); T(sub, x + 120, 292, { s: 24, w: 600, col });
          RUNS.forEach((r, i) => {
            const a = seg(t, 2 + i * .6, 2.3 + i * .6);
            T('#' + (i + 1), x + 60, 380 + i * 62, { s: 22, w: 600, mono: true, col: P.dim, a });
            (side ? ['ok', 'ok', 'ok', 'ok'] : r).forEach((st, j) => {
              const fc = st === 'ok' ? 'rgba(22,163,122,.22)' : st === 'skip' ? 'rgba(245,165,36,.2)' : 'rgba(227,6,19,.22)';
              const tc = st === 'ok' ? P.green2 : st === 'skip' ? P.amber : P.red2;
              box(x + 120 + j * 110, 350 + i * 62, 90, 44, { r: 10, fill: fc, stroke: st === 'skip' ? P.amber : null, dash: [6, 5], a });
              T(st === 'ok' ? '✓' : st === 'skip' ? '—' : '✗', x + 165 + j * 110, 381 + i * 62, { s: 24, w: 800, al: 'center', col: tc, a });
            });
          });
          T(side ? '5 de 5 idénticas' : '3 de 5 ejecuciones completas', x + 60, 690, { s: 30, w: 800, col, a: seg(t, 5.4, 6) });
        });
      });
    });
    alpha(seg(t, 14.6, 15.4), () => {
      T('Para el modelo', 560, 250, { s: 36, w: 800, al: 'center', col: P.amber });
      T('Para el código', 1360, 250, { s: 36, w: 800, al: 'center', col: P.green2 });
      const slot = [0, 0];
      ITEMS.forEach(([n, side], i) => {
        const ta = 15.5 + i * .8, k = seg(t, ta + .4, ta + 1, E.inOut), a = seg(t, ta, ta + .3);
        const s = slot[side]++, tx = side ? 1360 : 560, ty = 300 + s * 84;
        const x = lerp(960, tx, k), y = lerp(560, ty, k);
        const w = measure(n, 26, 700) + 50;
        box(x - w / 2, y, w, 60, { r: 30, fill: side ? 'rgba(22,163,122,.16)' : 'rgba(245,165,36,.14)', stroke: side ? P.green : P.amber, a });
        T(n, x, y + 39, { s: 26, w: 700, al: 'center', a });
      });
      alpha(seg(t, 22.5, 23.2), () => {
        box(260, 680, 1400, 150, { r: 24, fill: 'rgba(227,6,19,.12)', stroke: P.red, lw: 3, glow: 'rgba(227,6,19,.4)' });
        T('REGLA DE ORO', 310, 735, { s: 24, w: 900, ls: 6, col: P.red2 });
        T('Si algo tiene que pasar siempre, no se lo pidas al modelo: hacelo determinístico.', 310, 790, { s: 34, w: 700 });
      });
    });
  }
});

/* ---------- 0.5 Alucinaciones ---------- */
S.push(G.seccion('0.5', 'Alucinaciones', 'Por qué inventa y cómo se controla.'));
const HCODE = ['// Reembolsar todos los pagos del cliente', "import { payments } from '@acme/sdk'", '', 'const r = await payments.refundAll({', '  customerId, force: true', '})'];
S.push({
  label: 'Alucinaciones', dur: 34, section: '0.5 · Alucinaciones',
  cap: [[.5, 5.5, 'Cuando el modelo no tiene el dato, no se queda callado: completa con lo que suena plausible.'],
        [6, 11, 'Un método de otra versión de la librería, un endpoint que no existe, una configuración inventada.'],
        [11.5, 15, 'Y lo dice con el mismo tono seguro de siempre.'],
        [15.5, 21, 'Escribir "no inventes" en el prompt no funciona. Confiar en el tono, tampoco.'],
        [21.5, 27.5, 'Lo que funciona: darle la fuente real, que compile y corra tests, y pedirle de dónde sale cada dato.'],
        [28, 33.5, 'Y revisión humana en los puntos críticos. Las alucinaciones no se evitan pidiendo: se controlan.']],
  draw(t, d, c) {
    box(140, 170, 780, 380, { fill: '#0B0E13', shadow: 40 });
    T('respuesta del modelo', 180, 220, { s: 20, w: 500, mono: true, col: P.dim });
    let left = Math.floor(HCODE.join('').length * clamp((t - 1) / 4));
    HCODE.forEach((l, i) => { const s = l.slice(0, Math.max(0, left)); left -= l.length; T(s, 180, 285 + i * 42, { s: 23, w: 500, mono: true, col: i === 0 ? P.dim : '#D7DBE3' }); });
    stamp('NO EXISTE', 690, 470, seg(t, 6, 6.5, E.lin), P.red2, 'en esta versión de la librería');
    [['No tiene el dato', P.muted], ['Completa con lo plausible', P.amber], ['Lo dice con tono seguro', P.red2]].forEach(([n, col], i) => {
      const a = seg(t, 8 + i * 1.2, 8.6 + i * 1.2), y = 190 + i * 120;
      box(1060, y, 700, 88, { r: 20, fill: P.panel2, stroke: col, a });
      T(n, 1410, y + 56, { s: 30, w: 800, al: 'center', col, a });
      if (i) ln(1410, y - 30, 1410, y - 4, P.line2, 3, a);
    });
    alpha(seg(t, 15.5, 16.2), () => {
      T('✗  QUÉ NO FUNCIONA', 160, 640, { s: 24, w: 800, ls: 4, col: P.red2 });
      ['Escribir "no inventes" en el prompt', 'Confiar en el tono seguro'].forEach((n, i) => {
        const y = 690 + i * 58, w = T(n, 160, y, { s: 28, w: 500, col: P.dim, a: seg(t, 16 + i * .5, 16.5 + i * .5) });
        ln(160, y - 10, 160 + w * seg(t, 17 + i * .5, 17.6 + i * .5), y - 10, P.red2, 3);
      });
      T('✓  QUÉ SÍ FUNCIONA', 1000, 640, { s: 24, w: 800, ls: 4, col: P.green2, a: seg(t, 21.3, 21.8) });
      [['book', 'Darle la fuente real: docs, código, MCP'], ['terminal', 'Que compile y corra tests'], ['search', 'Pedirle de dónde sale cada dato'], ['user', 'Revisión humana en los puntos críticos']].forEach(([ic, n], i) => {
        const a = seg(t, 21.8 + i * .9, 22.3 + i * .9), y = 690 + i * 56;
        icon(ic, 1015, y - 10, 30, P.green2, a, 2.2);
        T(n, 1050, y, { s: 28, w: 600, a });
      });
    });
  }
});

/* ---------- Ejemplo con Codex ---------- */
S.push(G.seccion('0.6', 'Veámoslo en Codex', 'Misma pregunta, distinto contexto.'));
S.push({
  label: 'Ejemplo con Codex', dur: 42, section: '0.6 · Ejemplo con Codex',
  cap: [[.5, 5.5, 'Veámoslo con un caso de pagos-api: la función calcularRecargo.'],
        [6, 11.3, 'En un chat sin contexto, la IA nunca vio el código: responde con un supuesto que suena perfecto.'],
        [11.8, 17.8, 'Codex, en cambio, trabaja dentro del repo: busca, lee el archivo y responde citando la fuente.'],
        [18.3, 20.8, 'Misma pregunta. Distinto contexto. Distinto resultado.'],
        [21.3, 27, 'Ahora te toca a vos: tres pruebas cortas en tu propio proyecto.'],
        [27.5, 41.5, 'Vas a ver con tus propios ojos las tres consecuencias: varía, suena seguro y solo sabe lo que ve.']],
  draw(t, d, c) {
    alpha(1 - seg(t, 20.8, 21.6), () => {
      alpha(seg(t, .5, 1.2), () => {
        box(120, 170, 810, 550, { fill: P.panel, shadow: 40 });
        T('CHAT SIN CONTEXTO', 160, 225, { s: 22, w: 800, ls: 6, col: P.muted });
        const ub = '¿Qué hace calcularRecargo?', uw = measure(ub, 26, 500) + 50;
        box(890 - uw, 260, uw, 60, { r: 22, fill: '#2A3242', stroke: null, a: seg(t, 1.5, 1.9) });
        T(ub, 890 - uw + 25, 299, { s: 26, w: 500, a: seg(t, 1.5, 1.9) });
        TW(typed('Calcula el recargo aplicando un 10% sobre el monto total del pago.', (t - 3) / 2.5), 160, 400, 720, 44, { s: 30, w: 500 });
        chip('supuesto: nunca vio el código', 160, 520, { s: 22, col: P.amber, stroke: 'rgba(245,165,36,.6)', fill: 'rgba(245,165,36,.12)', a: seg(t, 6.5, 7) });
      });
      terminal(990, 170, 810, 550, 'codex · pagos-api  (simulación)', [
        [12, '› ¿Qué hace calcularRecargo? Citá archivo y línea.', P.text],
        [13.4, '• Buscando "calcularRecargo" en el repo…', P.dim],
        [14.3, '• Leyendo src/pagos/recargo.ts', P.dim],
        [15.4, 'Aplica 3% si el medio es tarjeta', '#9DB9F5'],
        [16.2, 'y 0% si es transferencia.', '#9DB9F5'],
        [17, 'Fuente: src/pagos/recargo.ts:14-22', P.green2]
      ], t, { s: 22, lh: 50, a: seg(t, 11.5, 12) });
      chip('✓ verificable', 1030, 640, { s: 22, col: P.green2, stroke: 'rgba(22,163,122,.6)', fill: 'rgba(22,163,122,.12)', a: seg(t, 17.6, 18.1) });
    });
    alpha(seg(t, 21.3, 22), () => {
      T('Probalo vos', 160, 230, { s: 64, w: 900 });
      chip('10 minutos · en tu proyecto', 560, 188, { s: 22, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)' });
      [['Que varíe', 'Pedile al chat lo mismo 3 veces y compará las respuestas.'],
       ['Que invente', 'Preguntale por una función que no existe en tu repo. ¿Qué te contesta?'],
       ['Que vea', 'Abrí Codex en tu repo, hacé la misma pregunta y pedile que cite archivo y línea.']].forEach(([n, txt], i) => {
        const a = seg(t, 22.5 + i * .8, 23.2 + i * .8), x = 160 + i * 540;
        box(x, 290, 500, 420, { fill: P.panel2, stroke: P.line2, a });
        dot(x + 60, 360, 34, P.red, a); T(String(i + 1), x + 60, 374, { s: 36, w: 900, al: 'center', a });
        T(n, x + 40, 460, { s: 36, w: 800, a });
        TW(txt, x + 40, 520, 420, 40, { s: 27, w: 400, col: P.muted, a });
      });
      chip('En el Módulo 1 vemos por qué Codex puede leer tu repo: el agente y su harness', 160, 760, { s: 22, col: P.green2, stroke: 'rgba(22,163,122,.6)', fill: 'rgba(22,163,122,.12)', a: seg(t, 25, 25.6) });
    });
  }
});

/* ---------- Resumen, challenge y cierre ---------- */
S.push(G.resumen([
  'Un LLM predice lo más probable: no consulta ni recuerda.',
  'Todo se mide en tokens: más contexto, más caro y más lento.',
  'Solo sabe lo que entra en su ventana de contexto.',
  'Lo que tiene que pasar siempre, hacelo determinístico.',
  'Las alucinaciones se controlan con fuentes reales y verificación.'
]));
const QV = PREGUNTAS.preguntas.filter(q => q.video);
S.push(G.challengeIntro(QV.length));
QV.forEach((q, i) => S.push(G.pregunta(q, i, QV.length)));
S.push(G.cierre(META));

META.assets = {
  juli: { sprite: 'juli', w: 600, h: 620 }, bit: { sprite: 'bit', w: 600, h: 600 }, walk: { sprite: 'walk', w: 300, h: 420 },
  portada: { scene: 'Portada', at: 6 }, problema: { scene: 'El problema', at: 13 },
  predice: { scene: 'Un LLM predice', at: 16 }, fuentes: { scene: 'Un LLM predice', at: 33 },
  tokens: { scene: 'Tokens', at: 20 }, ventana: { scene: 'Ventana de contexto', at: 27 },
  probdet: { scene: 'Probabilístico vs. determinístico', at: 9 }, reglaoro: { scene: 'Probabilístico vs. determinístico', at: 30 },
  alucina: { scene: 'Alucinaciones', at: 30 }, codex: { scene: 'Ejemplo con Codex', at: 19 }, probalo: { scene: 'Ejemplo con Codex', at: 30 }
};
F.run(S, META);
})();
