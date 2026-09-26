/* =========================================================
   MÓDULO 1 · Del chat al agente
   Ejemplo conductor: "pagos-api", el proyecto de Juli.
   Datos de Codex verificados en ../CODEX-VERIFICADO.md (sin nombrar modelos).
   ========================================================= */
(() => {
const { P, E, clamp, lerp, seg, typed, ga, alpha, T, measure, wrapLines, TW, box, ln, dot, glowAt, icon,
        juli, bit, terminal, chip, card, G } = F;

const META = {
  n: 1,
  titulo: 'Del chat al agente',
  bajada: 'Qué cambia cuando la IA deja de hablar y empieza a hacer.',
  siguiente: 'Módulo 2 · Darle contexto'
};

const S = [];
S.push(G.portada(META));
S.push(G.objetivos([
  ['route', 'El loop agéntico', 'Razonar, actuar, observar: quién hace el trabajo ahora.'],
  ['wrench', 'Tool use', 'Cómo el modelo pasa de hablar a hacer.'],
  ['layers', 'El harness', 'Qué agrega Codex alrededor del modelo: herramientas, contexto y permisos.'],
  ['brain', 'Qué modelo para qué tarea', 'Dónde poner el modelo más capaz y dónde no hace falta.']
], 'Al final hay un challenge, y un ejercicio para hacer tu primera tarea con Codex en tu repo.',
   'En este módulo pasamos de la IA que conversa a la IA que trabaja dentro de tu proyecto.'));

/* ---------- El problema: en un chat, vos sos el loop ---------- */
const CL = ['Pedís', 'Copiás', 'Probás', 'Error'];
S.push({
  label: 'El problema', dur: 16, section: 'El problema',
  cap: [[.6, 5.5, 'En el Módulo 0 viste cómo piensa la IA. Ahora la pregunta es qué puede hacer por vos.'],
        [6, 11, 'En un chat, vos sos el loop: pedís, copiás, probás, volvés con el error… y otra vez.'],
        [11.5, 15.5, 'Un agente cambia eso: el loop lo hace él.']],
  draw(t, d, c) {
    juli(420, 960, .75, { t, mood: t > 5 ? 'stress' : 'calm', look: .5 });
    const k = Math.floor(t / .9) % 4, n = 1 + Math.floor(t / 3.6);
    CL.forEach((s, i) => {
      const a = (i / 4) * Math.PI * 2 - Math.PI / 2, x = 420 + Math.cos(a) * 250, y = 430 + Math.sin(a) * 170, on = i === k;
      box(x - 100, y - 32, 200, 64, { r: 32, fill: on ? (i === 3 ? 'rgba(227,6,19,.3)' : 'rgba(255,255,255,.12)') : P.panel2, stroke: on ? (i === 3 ? P.red : '#fff') : P.line2, a: seg(t, .2 + i * .2, .6 + i * .2) });
      T(s, x, y + 10, { s: 28, w: 800, al: 'center', a: seg(t, .2 + i * .2, .6 + i * .2) });
    });
    T(`intento #${n}`, 420, 200, { s: 26, w: 600, mono: true, al: 'center', col: n > 2 ? P.amber : P.muted });
    T('En un chat,', 1000, 420, { s: 72, w: 900, a: seg(t, 6.5, 7.2), ls: -2 });
    T('el loop sos vos.', 1000, 510, { s: 72, w: 900, col: P.red2, a: seg(t, 7, 7.7), ls: -2 });
    T('¿Y si el loop lo hiciera la IA?', 1004, 610, { s: 38, w: 600, col: P.muted, a: seg(t, 11.5, 12.2) });
    bit(1680, 760, 60, { t, a: seg(t, 12, 12.8), mood: 'happy' });
  }
});

/* ---------- 1.1 El loop agéntico ---------- */
S.push(G.seccion('1.1', 'El loop agéntico', 'Razonar, actuar, observar… y repetir.'));
const PH = { Razonar: ['#B79BFF', 'rgba(155,123,234,.2)'], Actuar: [P.red2, 'rgba(227,6,19,.2)'], Observar: ['#8FD3FF', 'rgba(91,141,239,.2)'], Listo: [P.green2, 'rgba(22,163,122,.22)'] };
const STEPS = [
  [3, 'Razonar', 'Tengo que ver cómo está hoy el endpoint.'],
  [5.5, 'Actuar', 'Leer src/refunds/controller.ts'],
  [8, 'Observar', 'No valida el monto: acepta negativos.'],
  [11, 'Razonar', 'Agrego la validación en el schema.'],
  [13.5, 'Actuar', 'Editar src/refunds/schema.ts'],
  [16, 'Observar', 'Cambio aplicado (+3 líneas).'],
  [19, 'Razonar', '¿Funciona? Corro los tests.'],
  [21.5, 'Actuar', 'npm test'],
  [24, 'Observar', '1 test falla: falta el mensaje de error.'],
  [27, 'Razonar', 'Ajusto el mensaje de error.'],
  [29.5, 'Actuar', 'Editar schema.ts y volver a correr npm test'],
  [32, 'Observar', '13 tests pasan ✓'],
  [35, 'Listo', 'Resumen para Juli + diff para revisar']
];
S.push({
  label: 'El loop agéntico', dur: 44, section: '1.1 · El loop agéntico',
  cap: [[.5, 5, 'Un agente trabaja en un loop: razona qué hacer, actúa con una herramienta y observa el resultado.'],
        [5.5, 11, 'Mirá a Bit con una tarea real de pagos-api: validar que el monto del reembolso sea mayor a cero.'],
        [11.5, 18, 'Lee el código, detecta el problema, edita el archivo…'],
        [18.5, 26, '…corre los tests, ve que uno falla y vuelve a intentar. Nadie copió ni pegó nada.'],
        [26.5, 34, 'El loop sigue hasta que la tarea está terminada… o hasta que se traba y necesita ayuda.'],
        [34.5, 43.5, 'Tu rol cambia: ya no ejecutás cada paso. Definís el objetivo, los límites y cómo se verifica que está bien.']],
  draw(t, d, c) {
    const cx = 500, cy = 470, R = 230;
    let k = -1; STEPS.forEach(([ts], i) => { if (t >= ts) k = i; });
    const done = k === STEPS.length - 1;
    c.save(); ga(.5); c.strokeStyle = P.line2; c.lineWidth = 3; c.setLineDash([6, 12]); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke(); c.restore();
    const steps = k < 0 ? 0 : Math.min(k, 11) - 1 + seg(t, STEPS[Math.min(k, 11)][0], STEPS[Math.min(k, 11)][0] + .7, E.inOut);
    const ang = (-90 + 120 * Math.max(0, steps)) * Math.PI / 180;
    if (!done && k >= 0) {
      c.save(); ga(1); c.strokeStyle = P.red; c.lineWidth = 6; c.lineCap = 'round'; c.shadowColor = P.red; c.shadowBlur = 16;
      c.beginPath(); c.arc(cx, cy, R, ang - .9, ang); c.stroke(); c.restore();
      dot(cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, 11, '#fff');
    }
    ['Razonar', 'Actuar', 'Observar'].forEach((n, i) => {
      // etiquetas opacas por encima del recorrido del punto
      const a = (-90 + 120 * i) * Math.PI / 180, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
      const on = k >= 0 && !done && STEPS[k][1] === n;
      box(x - 100, y - 36, 200, 72, { r: 36, fill: P.panel2, stroke: null });
      box(x - 100, y - 36, 200, 72, { r: 36, fill: on ? PH[n][1] : P.panel2, stroke: on ? PH[n][0] : P.line2, lw: on ? 3 : 2 });
      T(n, x, y + 10, { s: 28, w: 800, al: 'center', col: on ? '#fff' : P.muted });
    });
    bit(cx, cy, 80, { t, mood: done ? 'happy' : 'calm', col: done ? 'green' : 'red' });
    // bitácora
    alpha(seg(t, 1.5, 2.2), () => {
      box(960, 160, 840, 640, { fill: P.panel, shadow: 40 });
      T('TAREA', 1000, 210, { s: 18, w: 800, ls: 4, col: P.dim });
      T('Validar que el monto del reembolso sea > 0', 1000, 250, { s: 28, w: 800 });
      ln(960, 280, 1800, 280, P.line);
      const first = Math.max(0, k - 7);
      for (let i = first; i <= k; i++) {
        const [ts, ph, tx] = STEPS[i], y = 300 + (i - first) * 60, a = seg(t, ts, ts + .4);
        const cw = measure(ph, 18, 800) + 30;
        box(1000, y, cw, 38, { r: 19, fill: PH[ph][1], stroke: null, a });
        T(ph, 1015, y + 26, { s: 18, w: 800, col: PH[ph][0], a });
        T(tx, 1000 + cw + 16, y + 27, { s: 22, w: 500, mono: ph === 'Actuar', col: i === k ? '#fff' : P.muted, a });
      }
    });
    [['target', 'Objetivo'], ['lock', 'Límites'], ['check', 'Cómo se verifica']].forEach(([ic, n], i) => {
      const a = seg(t, 35.5 + i * .5, 36 + i * .5), w = measure(n, 24, 700) + 90, x = 160 + [0, 260, 500][i];
      box(x, 790, w, 56, { r: 28, fill: 'rgba(227,6,19,.12)', stroke: 'rgba(227,6,19,.55)', a });
      icon(ic, x + 34, 818, 26, P.red2, a, 2.4);
      T(n, x + 60, 826, { s: 24, w: 700, a });
    });
  }
});

/* ---------- 1.2 Tool use ---------- */
S.push(G.seccion('1.2', 'Tool use', 'Cómo el modelo pasa de hablar a hacer.'));
const FLOWS = [
  { t0: 2, pide: 'Quiero leer src/refunds/controller.ts', fila: 0, res: 'El código del endpoint (42 líneas)' },
  { t0: 10.5, pide: 'Quiero correr: npm test', fila: 1, res: '12 tests pasaron' },
  { t0: 19.5, pide: 'Quiero instalar una dependencia', fila: 1, res: 'Dependencia instalada', permiso: true }
];
S.push({
  label: 'Tool use', dur: 34, section: '1.2 · Tool use',
  cap: [[.5, 6, 'Un modelo, por sí solo, solo genera texto. No puede leer tus archivos ni correr nada.'],
        [6.5, 12, 'Con tool use, el modelo pide usar una herramienta: "quiero leer este archivo".'],
        [12.5, 19, 'El harness —en este caso Codex— la ejecuta en tu máquina y le devuelve el resultado al modelo.'],
        [19.5, 27, 'Y si la acción necesita permiso —como salir a internet para instalar algo—, el harness te pregunta antes.'],
        [27.5, 33.5, 'El modelo solo pide. El harness ejecuta, controla y devuelve. Así pasa de hablar a hacer.']],
  draw(t, d, c) {
    const MX = 330, HX = 960, QX = 1590, Y = 470;
    // columnas
    bit(MX, Y, 80, { t, col: 'grey', mood: 'calm' });
    T('Modelo', MX, Y + 150, { s: 30, w: 800, al: 'center' });
    T('piensa y pide', MX, Y + 188, { s: 22, w: 500, al: 'center', col: P.muted });
    box(HX - 170, Y - 140, 340, 280, { r: 28, fill: P.panel2, stroke: P.red, dash: [10, 8], lw: 3 });
    icon('wrench', HX - 50, Y - 60, 44, P.red2, 1, 2); icon('lock', HX + 50, Y - 60, 44, P.red2, 1, 2);
    T('Codex', HX, Y + 30, { s: 40, w: 900, al: 'center' });
    T('harness', HX, Y + 70, { s: 22, w: 600, al: 'center', col: P.red2, ls: 3 });
    T('ejecuta y controla', HX, Y + 188, { s: 22, w: 500, al: 'center', col: P.muted });
    box(QX - 170, Y - 140, 340, 280, { r: 28, fill: P.panel, stroke: P.line2 });
    T('Tu máquina', QX, Y - 96, { s: 24, w: 800, al: 'center', col: P.muted });
    let fila = -1;
    FLOWS.forEach(f => { const lt = t - f.t0; if (lt >= (f.permiso ? 3.9 : 2.4) && lt < 4.6) fila = f.fila; });
    [['file', 'archivos del repo'], ['terminal', 'terminal']].forEach(([ic, n], i) => {
      const y = Y - 40 + i * 90, on = fila === i;
      box(QX - 140, y - 30, 280, 64, { r: 14, fill: on ? 'rgba(227,6,19,.2)' : P.panel2, stroke: on ? P.red : P.line });
      icon(ic, QX - 104, y + 2, 28, on ? P.red2 : P.muted, 1, 2);
      T(n, QX - 76, y + 11, { s: 22, w: 600, col: on ? '#fff' : P.muted });
    });
    // mensajes
    FLOWS.forEach(f => {
      const lt = t - f.t0; if (lt < 0 || lt > 8) return;
      const g = f.permiso ? 1.5 : 0, fadeOut = 1 - seg(lt, 7.3, 8);
      // pedido: del modelo al harness
      const k1 = seg(lt, 1.1, 2.3, E.inOut), rx = lerp(MX, HX, k1);
      if (lt < 2.6 + g) {
        const w = measure(f.pide, 22, 600) + 40;
        box(rx - w / 2, 250, w, 50, { r: 25, fill: '#2A3242', stroke: P.line2, a: seg(lt, 0, .4) * fadeOut });
        T(f.pide, rx, 283, { s: 22, w: 600, al: 'center', a: seg(lt, 0, .4) * fadeOut });
      }
      // harness → máquina
      if (lt > 2.3 + g && lt < 4.6 + g) ln(HX + 170, Y, QX - 170, Y, P.red2, 4, 1, [10, 8]);
      // resultado: de la máquina al modelo
      if (lt > 3.4 + g) {
        const k2 = seg(lt, 3.4 + g, 5 + g, E.inOut), x = lerp(QX, MX, k2), w = measure(f.res, 22, 600) + 40;
        box(x - w / 2, 660, w, 50, { r: 25, fill: 'rgba(22,163,122,.2)', stroke: P.green, a: seg(lt, 3.4 + g, 3.8 + g) * fadeOut });
        T(f.res, x, 693, { s: 22, w: 600, al: 'center', col: '#D7F5EA', a: seg(lt, 3.4 + g, 3.8 + g) * fadeOut });
      }
      if (f.permiso) {
        const pa = seg(lt, 2.3, 2.7) * fadeOut;
        juli(HX + 320, 880, .45, { t, mood: lt > 3.4 ? 'happy' : 'calm', look: -.6, a: pa });
        box(HX - 150, Y + 90, 300, 50, { r: 25, fill: 'rgba(245,165,36,.18)', stroke: P.amber, a: pa * (1 - seg(lt, 3.4, 3.8)) });
        T('Necesita red: ¿aprobás?', HX, Y + 123, { s: 20, w: 700, col: P.amber, al: 'center', a: pa * (1 - seg(lt, 3.4, 3.8)) });
        box(HX - 110, Y + 90, 220, 50, { r: 25, fill: 'rgba(22,163,122,.2)', stroke: P.green, a: seg(lt, 3.4, 3.8) * fadeOut });
        T('Aprobado ✓', HX, Y + 123, { s: 20, w: 700, col: P.green2, al: 'center', a: seg(lt, 3.4, 3.8) * fadeOut });
      }
    });
    T('El modelo solo pide. El harness ejecuta, controla y devuelve.', 960, 830, { s: 34, w: 800, al: 'center', a: seg(t, 28, 28.8) });
  }
});

/* ---------- 1.3 El harness ---------- */
S.push(G.seccion('1.3', 'El harness', 'Lo que rodea al modelo y lo convierte en agente.'));
const MODS = [['wrench', 'Herramientas', 'Leer, editar, buscar y ejecutar comandos.'], ['layers', 'Contexto', 'Qué entra, qué se resume y qué se descarta.'],
              ['lock', 'Permisos y sandbox', 'Qué puede hacer sin preguntarte.'], ['box', 'Extensiones', 'AGENTS.md, skills, MCP, hooks, subagentes.']];
const SBX = [['read-only', 'Solo lectura', 'Lee y analiza, no modifica nada.', P.green2, ''],
             ['workspace-write', 'Escritura en el proyecto', 'Edita dentro del repo. Si necesita salir de ahí (red, otras carpetas), te pregunta.', P.amber, 'AUTO · por defecto en un repo git'],
             ['danger-full-access', 'Acceso total', 'Sin restricciones. Solo en entornos aislados y descartables.', P.red2, '']];
S.push({
  label: 'El harness', dur: 38, section: '1.3 · El harness',
  cap: [[.5, 6, 'Modelo más harness es igual a agente. Codex y Claude Code son harnesses.'],
        [6.5, 13, 'El harness pone las herramientas, decide qué contexto le llega al modelo y controla los permisos.'],
        [13.5, 19.5, 'Y suma extensiones: AGENTS.md, skills, MCP, hooks, subagentes. Las vas a ver en los próximos módulos.'],
        [20, 27, 'En Codex, los permisos van en tres niveles de sandbox: solo lectura, escritura en el proyecto y acceso total.'],
        [27.5, 33, 'Dentro de un repo git arranca en modo Auto: edita en tu proyecto y te pregunta antes de salir de ahí.'],
        [33.5, 37.5, 'Mismo modelo, distinto harness, distintos resultados. Configurarlo bien es la mitad del trabajo.']],
  draw(t, d, c) {
    const p1 = 1 - seg(t, 19.2, 20);
    alpha(p1, () => {
      [['Modelo', 'brain', 'razona', 560], ['Harness', 'wrench', 'Codex · Claude Code', 960]].forEach(([n, ic, sub, x], i) => {
        const e = seg(t, .5 + i * .6, 1.2 + i * .6, E.back); if (e <= 0) return;
        c.save(); c.translate(x, 290); c.scale(e, e);
        box(-110, -110, 220, 220, { r: 28, fill: P.panel2, stroke: i ? P.red : P.line2, dash: i ? [10, 8] : null, lw: 3 });
        icon(ic, 0, -28, 64, i ? P.red2 : P.muted, 1, 2);
        T(n, 0, 48, { s: 32, w: 800, al: 'center' });
        T(sub, 0, 82, { s: 18, w: 500, col: P.muted, al: 'center' });
        c.restore();
      });
      T('+', 760, 312, { s: 72, w: 300, col: P.dim, al: 'center', a: seg(t, 1, 1.4) });
      T('=', 1160, 312, { s: 72, w: 300, col: P.dim, al: 'center', a: seg(t, 1.6, 2) });
      const be = seg(t, 2, 2.7, E.back);
      if (be > 0) { bit(1360, 290, 80 * be, { t, mood: 'happy' }); T('Agente', 1360, 430, { s: 32, w: 800, al: 'center', a: be }); }
      MODS.forEach(([ic, n, tx], i) => {
        const a = seg(t, 7 + i * 1.2, 7.7 + i * 1.2), x = 160 + i * 405;
        c.save(); c.translate(0, (1 - a) * 30);
        card(x, 520, 380, 230, ic, n, tx, { a, stroke: i === 3 ? 'rgba(245,165,36,.5)' : P.line2 });
        c.restore();
      });
    });
    alpha(seg(t, 20, 20.8), () => {
      T('Permisos en Codex', 160, 220, { s: 56, w: 900 });
      chip('/permissions para cambiarlos', 700, 178, { s: 22, mono: true, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)', a: seg(t, 22, 22.6) });
      SBX.forEach(([id, n, tx, col, badge], i) => {
        const a = seg(t, 20.5 + i * 1.6, 21.2 + i * 1.6), y = 290 + i * 180, hl = i === 1 && t > 27.5;
        box(160, y, 1600, 150, { r: 22, fill: hl ? 'rgba(245,165,36,.1)' : P.panel2, stroke: hl ? P.amber : P.line2, lw: hl ? 3 : 2, a });
        dot(215, y + 75, 16, col, a);
        T(n, 260, y + 62, { s: 34, w: 800, a });
        T(id, 260, y + 104, { s: 22, w: 500, mono: true, col, a });
        TW(tx, 900, y + 62, 820, 34, { s: 24, w: 400, col: P.muted, a });
        if (badge) chip(badge, 1310, y - 22, { s: 18, col: '#111', fill: P.amber, stroke: null, a: seg(t, 27.5, 28.1) });
      });
    });
  }
});

/* ---------- 1.4 Qué modelo para qué tarea ---------- */
S.push(G.seccion('1.4', 'Qué modelo para qué tarea', 'El más capaz, donde el error es más caro.'));
const MROWS = [['Entender una spec ambigua', 'Razonamiento profundo', 1, 3], ['Diseñar el plan y la arquitectura', 'Evaluar alternativas', 1, 3],
               ['Implementar un plan ya aprobado', 'Precisión, seguir instrucciones', 1, 2], ['Resumir, formatear, documentar', 'Velocidad y bajo costo', .34, 1]];
S.push({
  label: 'Qué modelo', dur: 34, section: '1.4 · Qué modelo',
  cap: [[.5, 6, 'No todas las tareas necesitan el mismo modelo ni el mismo esfuerzo de razonamiento.'],
        [6.5, 13, 'Entender una spec ambigua o diseñar un plan exige razonar mucho: modelo grande, esfuerzo alto.'],
        [13.5, 19, 'Resumir o documentar pide velocidad y bajo costo: un modelo más chico y esfuerzo bajo alcanzan.'],
        [19.5, 26, '¿Por qué importa? Un error al principio se arrastra y crece en todo lo que sigue.'],
        [26.5, 33.5, 'En Codex, con /model elegís el modelo y el esfuerzo de razonamiento para cada sesión.']],
  draw(t, d, c) {
    ['TAREA', 'QUÉ EXIGE', 'MODELO', 'ESFUERZO'].forEach((h, i) => T(h, [160, 820, 1250, 1600][i], 250, { s: 18, w: 800, ls: 4, col: P.dim, a: seg(t, .3, .8) }));
    MROWS.forEach(([tar, ex, v, e], i) => {
      const y = 280 + i * 104, a = seg(t, 1 + i * .8, 1.5 + i * .8);
      box(140, y, 1640, 88, { r: 18, fill: P.panel2, stroke: P.line, a });
      T(tar, 170, y + 54, { s: 28, w: 700, a });
      T(ex, 820, y + 54, { s: 24, w: 500, col: P.muted, a });
      box(1250, y + 26, 300, 36, { r: 10, fill: 'rgba(255,255,255,.06)', stroke: null, a });
      box(1250, y + 26, 300 * v * seg(t, 1.5 + i * .8, 2.6 + i * .8, E.inOut), 36, { r: 10, fill: P.red, stroke: null, a });
      T(v === 1 ? 'Grande' : 'Chico', 1266, y + 52, { s: 20, w: 800, a });
      for (let j = 0; j < 3; j++) box(1600 + j * 34, y + 30, 24, 24, { r: 6, fill: j < e ? P.amber : 'rgba(255,255,255,.08)', stroke: null, a });
    });
    alpha(seg(t, 19.5, 20.2), () => {
      const xs = [200, 560, 920, 1280, 1640], lab = ['Spec', 'Plan', 'Código', 'Tests', 'Producción'];
      ln(200, 780, 1640, 780, P.line2, 3);
      lab.forEach((l, i) => T(l, xs[i], 830, { s: 22, w: 700, al: 'center', col: P.muted }));
      const k = seg(t, 20.5, 26, E.in), x = lerp(200, 1640, k);
      glowAt(x, 780, 40 + k * 80, '227,6,19', 1); dot(x, 780, 8 + k * 26, P.red2);
    });
    chip('/model  →  modelo + esfuerzo de razonamiento', 160, 180, { s: 22, mono: true, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)', a: seg(t, 26.5, 27.1) });
  }
});

/* ---------- 1.5 Tu primera tarea en Codex ---------- */
S.push(G.seccion('1.5', 'Tu primera tarea en Codex', 'La de Juli, de punta a punta.'));
S.push({
  label: 'Ejemplo en Codex', dur: 46, section: '1.5 · Ejemplo en Codex',
  cap: [[.5, 6, 'Así se ve la primera tarea de Juli con Codex, dentro del repo de pagos-api.'],
        [6.5, 12, 'Juli le da un objetivo concreto y un criterio para saber si está bien: que pasen los tests.'],
        [12.5, 19, 'Codex lee los archivos, arma un plan, edita y corre los tests por su cuenta.'],
        [19.5, 26, 'Con los permisos en Auto, trabaja dentro del proyecto sin pedir permiso para cada paso.'],
        [26.5, 33, 'Y antes de aceptar nada, Juli revisa los cambios con /diff.'],
        [33.5, 45.5, 'Tres hábitos que hacen la diferencia: un objetivo claro, un criterio de verificación y revisar siempre el diff.']],
  draw(t, d, c) {
    alpha(1 - seg(t, 33, 34) * .95, () => {
      terminal(160, 140, 1600, 700, 'codex · pagos-api  (simulación)', [
        [1, '$ cd pagos-api && codex', P.text],
        [2.5, '  permisos: Auto (edita en el proyecto, pregunta si necesita salir)', P.dim],
        [4.5, '› Validá que el monto del reembolso sea mayor a 0.', P.text],
        [6.2, '  Criterio: que pasen los tests (npm test).', P.text],
        [9, '• Leyendo src/refunds/controller.ts y src/refunds/schema.ts', P.dim],
        [11.5, '• Plan: exigir amount > 0 en el schema y sumar un test del caso negativo', '#9DB9F5'],
        [14, '• Editando src/refunds/schema.ts  (+3 −1)', '#9DB9F5'],
        [16, '• Editando src/refunds/__tests__/refunds.test.ts  (+12)', '#9DB9F5'],
        [18.5, '• Ejecutando npm test', P.dim],
        [20.5, '  ✓ 13 tests pasaron', P.green2],
        [23, 'Listo: el endpoint rechaza montos ≤ 0 con error 400.', P.text],
        [27, '› /diff', P.text],
        [28.5, '+ amount: z.number().positive({ message: "El monto debe ser mayor a 0" })', P.green2]
      ], t, { s: 24, lh: 44 });
    });
    [['target', 'Objetivo claro', 'Qué tiene que pasar, en una frase.'], ['check', 'Criterio de verificación', '"Que pasen los tests."'], ['eye', 'Revisar el diff', 'Nada entra sin que lo mires.']].forEach(([ic, n, tx], i) => {
      const a = seg(t, 34 + i * .8, 34.6 + i * .8), x = 160 + i * 540;
      c.save(); c.translate(0, (1 - a) * 30);
      box(x, 330, 500, 260, { fill: P.bg, stroke: null, a });
      card(x, 330, 500, 260, ic, n, tx, { a, stroke: 'rgba(22,163,122,.5)', col: P.green2 });
      c.restore();
    });
  }
});

/* ---------- Probalo vos ---------- */
S.push({
  label: 'Probalo vos', dur: 32, section: '1.6 · Probalo vos',
  cap: [[.5, 6, 'Tu turno: tu primera tarea con Codex, en tu propio proyecto.'],
        [6.5, 14, 'Primero explorá: pedile que te explique la estructura del repo, sin editar nada.'],
        [14.5, 22, 'Después, una tarea chica y acotada, con un criterio claro de verificación.'],
        [22.5, 31.5, 'Y siempre revisá el diff antes de aceptar. Arrancá con el repo limpio para poder volver atrás.']],
  draw(t, d, c) {
    T('Probalo vos', 160, 230, { s: 64, w: 900 });
    chip('20 minutos · en tu repo', 560, 188, { s: 22, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)' });
    [['Explorá', 'Abrí Codex en tu repo y pedile que te explique la estructura. Todavía sin editar nada.'],
     ['Una tarea chica', 'Algo acotado —un test que falta, un bug menor— y decile cómo verificar: "corré los tests".'],
     ['Revisá el diff', 'Mirá los cambios con /diff antes de aceptar. Si algo no te cierra, pedile que lo ajuste.']].forEach(([n, txt], i) => {
      const a = seg(t, 1 + i * .8, 1.7 + i * .8), x = 160 + i * 540;
      box(x, 290, 500, 420, { fill: P.panel2, stroke: P.line2, a });
      dot(x + 60, 360, 34, P.red, a); T(String(i + 1), x + 60, 374, { s: 36, w: 900, al: 'center', a });
      T(n, x + 40, 460, { s: 36, w: 800, a });
      TW(txt, x + 40, 520, 420, 40, { s: 27, w: 400, col: P.muted, a });
    });
    chip('Tip: arrancá con el repo limpio (git status) para poder volver atrás', 160, 750, { s: 22, col: P.text, a: seg(t, 22.5, 23.1) });
    chip('Módulo 2: por qué Codex a veces no sabe cómo trabaja tu equipo → AGENTS.md', 160, 820, { s: 22, col: P.green2, stroke: 'rgba(22,163,122,.6)', fill: 'rgba(22,163,122,.12)', a: seg(t, 24, 24.6) });
  }
});

/* ---------- Resumen, challenge y cierre ---------- */
S.push(G.resumen([
  'En un agente, el loop razonar → actuar → observar lo hace él, no vos.',
  'Con tool use, el modelo pide acciones y el harness las ejecuta.',
  'Modelo + harness = agente: herramientas, contexto, permisos y extensiones.',
  'El modelo más capaz, donde el error es más caro.',
  'Tu rol: objetivo claro, límites y cómo se verifica. Y siempre revisar el diff.'
]));
const QV = PREGUNTAS.preguntas.filter(q => q.video);
S.push(G.challengeIntro(QV.length));
QV.forEach((q, i) => S.push(G.pregunta(q, i, QV.length)));
S.push(G.cierre(META));

META.assets = {
  juli: { sprite: 'juli', w: 600, h: 620 }, bit: { sprite: 'bit', w: 600, h: 600 }, walk: { sprite: 'walk', w: 300, h: 420 },
  problema: { scene: 'El problema', at: 13 }, loop: { scene: 'El loop agéntico', at: 33 },
  tooluse: { scene: 'Tool use', at: 23.8 }, harness: { scene: 'El harness', at: 14 }, permisos: { scene: 'El harness', at: 31 },
  modelos: { scene: 'Qué modelo', at: 24 }, codex: { scene: 'Ejemplo en Codex', at: 31 }, habitos: { scene: 'Ejemplo en Codex', at: 40 },
  probalo: { scene: 'Probalo vos', at: 26 }
};
F.run(S, META);
})();
