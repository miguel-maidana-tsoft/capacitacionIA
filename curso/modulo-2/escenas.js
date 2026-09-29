/* =========================================================
   MÓDULO 2 · Darle contexto
   Ejemplo conductor: "pagos-api", el proyecto de Juli.
   Datos de Codex verificados en ../CODEX-VERIFICADO.md (29/09/2026).
   ========================================================= */
(() => {
const { P, E, clamp, lerp, seg, typed, ga, alpha, T, measure, wrapLines, TW, box, ln, dot, glowAt, icon,
        juli, bit, terminal, chip, card, G } = F;

const META = {
  n: 2,
  titulo: 'Darle contexto',
  bajada: 'Por qué el agente no sabe cómo trabaja tu equipo, y cómo se lo enseñás una sola vez.',
  siguiente: 'Módulo 3 · Especificar antes de construir'
};

const S = [];
S.push(G.portada(META));
S.push(G.objetivos([
  ['layers', 'Context engineering', 'Qué información tiene el agente, cuándo y cuánta.'],
  ['file', 'AGENTS.md', 'La memoria del proyecto: qué va, qué no y dónde lo lee Codex.'],
  ['folder', 'Progressive disclosure', 'Cómo tener mucho conocimiento sin llenar la ventana.'],
  ['terminal', 'Tu AGENTS.md en Codex', 'Crearlo con /init, mejorarlo y probar que funciona.']
], 'Al final hay un challenge y el Paso 1 de tu recorrido: el AGENTS.md de tu proyecto.',
   'En este módulo aprendés a darle al agente la información que necesita para trabajar como tu equipo.'));

/* ---------- El problema ---------- */
S.push({
  label: 'El problema', dur: 18, section: 'El problema',
  cap: [[.6, 5.8, 'Juli ya trabaja con Codex en pagos-api. Pero hay algo que se repite todos los días.'],
        [6.3, 12, 'Codex vuelve a usar console.log, cuando el equipo siempre usa logger.error. Y Juli lo corrige… otra vez.'],
        [12.5, 17.5, 'No es un problema del modelo. Es que el agente no tiene esa información.']],
  draw(t, d, c) {
    juli(300, 930, .8, { t, mood: t > 7 ? 'stress' : 'calm', look: .6 });
    ['LUNES', 'MARTES', 'MIÉRCOLES'].forEach((dia, i) => {
      const a = seg(t, .6 + i * 1.4, 1.2 + i * 1.4), x = 640 + i * 400;
      alpha(a, () => {
        box(x, 170, 370, 500, { fill: P.panel, shadow: 30 });
        T(dia, x + 30, 220, { s: 20, w: 800, ls: 5, col: P.muted });
        box(x + 30, 250, 310, 130, { r: 12, fill: '#0B0E13', stroke: t > 6.5 ? P.red : P.line2 });
        ['} catch (err) {', '  console.log(err)', '}'].forEach((l, k) => T(l, x + 50, 290 + k * 34, { s: 20, w: 500, mono: true, col: k === 1 ? P.red2 : '#D7DBE3' }));
        const cb = seg(t, 7 + i * .8, 7.5 + i * .8);
        box(x + 30, 410, 310, 110, { r: 20, fill: '#2A3242', stroke: null, a: cb });
        TW(i ? 'Otra vez: logger.error, no console.log' : 'Usá logger.error, no console.log', x + 50, 450, 270, 30, { s: 22, w: 600, a: cb, col: i ? P.amber : P.text });
        T(i ? '🔁' : '', x + 320, 640, { s: 30, w: 700, al: 'right', a: cb });
      });
    });
    T('¿Tenía la información para hacerlo bien?', 1180, 790, { s: 46, w: 900, al: 'center', a: seg(t, 12.5, 13.2) });
  }
});

/* ---------- 2.1 Context engineering ---------- */
S.push(G.seccion('2.1', 'Context engineering', 'Qué sabe el agente mientras trabaja.'));
const q = x => .08 + .92 * Math.exp(-Math.pow(x - 52, 2) / (2 * 19 * 19));
S.push({
  label: 'Context engineering', dur: 40, section: '2.1 · Context engineering',
  cap: [[.5, 6, 'El prompt engineering se ocupa de cómo pedir. El context engineering, de qué sabe el agente mientras trabaja.'],
        [6.5, 11.5, 'Con agentes, lo segundo pesa mucho más: la mayoría de los malos resultados son falta de contexto.'],
        [12, 18, 'Tres preguntas. Qué: convenciones, arquitectura, la spec, ejemplos reales del proyecto.'],
        [18.5, 24, 'Cuándo: lo general, siempre cargado. Lo específico, solo cuando la tarea lo necesita.'],
        [24.5, 31, 'Cuánto: con poco, el resultado es genérico. Con demasiado, el agente se pierde, tarda y cuesta más.'],
        [31.5, 39.5, 'Ante un mal resultado, la primera pregunta es siempre la misma: ¿el agente tenía la información para hacerlo bien?']],
  draw(t, d, c) {
    alpha(1 - seg(t, 11.5, 12.3), () => {
      alpha(seg(t, .5, 1.2), () => {
        T('PROMPT ENGINEERING', 200, 330, { s: 22, w: 800, ls: 5, col: P.dim });
        T('cómo pedís', 200, 410, { s: 60, w: 700, col: P.muted });
      });
      alpha(seg(t, 2.5, 3.3), () => {
        T('CONTEXT ENGINEERING', 200, 540, { s: 22, w: 800, ls: 5, col: P.red2 });
        T('qué sabe mientras trabaja', 200, 650, { s: 100, w: 900, ls: -3 });
      });
      const k = seg(t, 7, 9, E.inOut);
      box(1560, 560 - 300 * k, 70, 300 * k, { r: 10, fill: P.red, stroke: null, a: seg(t, 6.8, 7.2) });
      box(1680, 560 - 80 * k, 70, 80 * k, { r: 10, fill: '#3a4252', stroke: null, a: seg(t, 6.8, 7.2) });
      T('contexto', 1595, 600, { s: 20, w: 700, al: 'center', a: seg(t, 7, 7.5) });
      T('prompt', 1715, 600, { s: 20, w: 700, al: 'center', col: P.muted, a: seg(t, 7, 7.5) });
    });
    alpha(seg(t, 12, 12.8), () => {
      [['Qué', 'Convenciones, arquitectura, la spec, ejemplos reales.', 12.5], ['Cuándo', 'Lo general, siempre. Lo específico, solo si la tarea lo pide.', 18.8], ['Cuánto', 'Ni poco ni demasiado: el punto justo.', 24.8]].forEach(([n, tx, ts], i) => {
        const a = seg(t, ts, ts + .7), on = t >= ts, y = 190 + i * 190;
        box(140, y, 700, 160, { r: 22, fill: on ? P.panel2 : P.panel, stroke: on ? 'rgba(227,6,19,.55)' : P.line, a: .35 + .65 * a });
        T(n, 180, y + 70, { s: 44, w: 900, col: P.red2, a: .35 + .65 * a });
        TW(tx, 180, y + 116, 620, 32, { s: 24, w: 500, col: P.muted, a: .35 + .65 * a });
      });
      // curva del "cuánto"
      alpha(seg(t, 24.8, 25.6), () => {
        const X0 = 960, Y0 = 720, Wc = 800, Hc = 380;
        box(X0 - 30, Y0 - Hc - 60, Wc + 60, Hc + 130, { fill: P.panel, stroke: P.line2 });
        c.save(); ga(1); c.strokeStyle = P.green2; c.lineWidth = 5; c.beginPath();
        for (let x = 0; x <= 100; x += 2) { const px = X0 + x / 100 * Wc, py = Y0 - q(x) * Hc; x ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke(); c.restore();
        ln(X0, Y0, X0 + Wc, Y0, P.line2, 2);
        T('poco', X0, Y0 + 44, { s: 22, w: 600, col: P.muted }); T('demasiado', X0 + Wc, Y0 + 44, { s: 22, w: 600, col: P.muted, al: 'right' });
        T('calidad del resultado', X0, Y0 - Hc - 20, { s: 22, w: 700, col: P.muted });
        const sx = 10 + 85 * (.5 - .5 * Math.cos((t - 25.5) * .9)), px = X0 + sx / 100 * Wc, py = Y0 - q(sx) * Hc;
        glowAt(px, py, 40, '255,255,255', .6); dot(px, py, 12, '#fff');
        const lab = sx < 30 ? ['genérico', P.muted] : sx > 74 ? ['se pierde · caro', P.red2] : ['justo', P.green2];
        T(lab[0], px, py - 30, { s: 24, w: 800, al: 'center', col: lab[1] });
      });
    });
  }
});

/* ---------- 2.2 AGENTS.md ---------- */
S.push(G.seccion('2.2', 'AGENTS.md', 'La memoria del proyecto.'));
const AGM = ['# pagos-api', '## Stack', '- Node 22 + TypeScript + Postgres', '## Estructura', '- src/<módulo>/ controller, schema y __tests__', '## Comandos', '- Tests: npm test · Lint: npm run lint', '## Convenciones', '- Errores: try/catch + logger.error', '- Validación: schema con zod', '## Nunca', '- Tocar /legacy sin aprobación', '- Credenciales o datos reales en el código'];
S.push({
  label: 'AGENTS.md', dur: 50, section: '2.2 · AGENTS.md',
  cap: [[.5, 6, 'AGENTS.md es un archivo en tu repo que Codex lee siempre, antes de cualquier tarea.'],
        [6.5, 12.5, 'Ahí va lo que aplica siempre: el stack, la estructura, los comandos de build y test, las convenciones y lo que nunca se hace.'],
        [13, 19.5, 'La clave es ser específico. "Usamos buenas prácticas" no le dice nada. "Errores: logger.error, nunca console.log" sí.'],
        [20, 26.5, 'Y la regla más útil: si corregís lo mismo dos veces, esa corrección va al AGENTS.md.'],
        [27, 34, 'Codex arma el contexto sumando archivos: tu AGENTS.md global, el de la raíz del repo y el de la carpeta donde trabajás.'],
        [34.5, 41.5, 'El más cercano va último y manda. Y ojo: entre todos no pueden pasar de 32 KiB. Corto y general.'],
        [42, 49.5, 'Nunca pongas información sensible: ni tokens, ni contraseñas, ni datos de producción.']],
  draw(t, d, c) {
    // archivo
    const fa = seg(t, .5, 1.2) * (1 - seg(t, 26.5, 27.3));
    alpha(fa, () => {
      box(140, 150, 760, 740, { fill: P.panel, shadow: 40 });
      T('pagos-api/AGENTS.md', 180, 200, { s: 22, w: 600, mono: true, col: P.dim });
      ln(140, 226, 900, 226, P.line);
      AGM.forEach((l, i) => {
        const h = l.startsWith('##'), a = seg(t, 2 + i * .45, 2.4 + i * .45), hl = t > 20.5 && i === 8;
        if (hl) box(170, 238 + i * 48, 700, 42, { r: 8, fill: 'rgba(22,163,122,.2)', stroke: P.green, a: seg(t, 20.5, 21) });
        T(l, 190, 268 + i * 48, { s: h ? 24 : 22, w: h ? 800 : 500, mono: true, col: h ? P.red2 : l.startsWith('#') ? '#fff' : '#D7DBE3', a });
      });
    });
    // genérico vs específico
    alpha(seg(t, 13, 13.8) * (1 - seg(t, 26.5, 27.3)), () => {
      box(1000, 180, 780, 170, { r: 20, fill: P.panel2, stroke: 'rgba(227,6,19,.4)' });
      T('✗  GENÉRICO · NO AYUDA', 1040, 230, { s: 20, w: 800, ls: 3, col: P.red2 });
      const w = T('"Usamos buenas prácticas y código limpio."', 1040, 300, { s: 28, w: 600, col: P.dim });
      ln(1040, 290, 1040 + w * seg(t, 15, 16), 290, P.red2, 3);
      box(1000, 390, 780, 170, { r: 20, fill: P.panel2, stroke: 'rgba(22,163,122,.55)', a: seg(t, 16, 16.6) });
      T('✓  ESPECÍFICO · SÍ AYUDA', 1040, 440, { s: 20, w: 800, ls: 3, col: P.green2, a: seg(t, 16, 16.6) });
      T('"Errores: try/catch + logger.error,', 1040, 494, { s: 26, w: 600, mono: true, a: seg(t, 16.3, 16.9) });
      T(' nunca console.log."', 1040, 530, { s: 26, w: 600, mono: true, a: seg(t, 16.3, 16.9) });
      // regla de las dos veces
      alpha(seg(t, 20, 20.7), () => {
        box(1000, 610, 780, 230, { r: 22, fill: 'rgba(227,6,19,.12)', stroke: P.red, lw: 3, glow: 'rgba(227,6,19,.35)' });
        T('LA REGLA', 1040, 665, { s: 20, w: 900, ls: 6, col: P.red2 });
        TW('Si lo corregís dos veces, va al AGENTS.md.', 1040, 730, 700, 50, { s: 40, w: 900 });
      });
    });
    // jerarquía
    alpha(seg(t, 27, 27.8), () => {
      const L = [['~/.codex/AGENTS.md', 'global · tus preferencias', P.muted, 27.5], ['pagos-api/AGENTS.md', 'raíz del repo · el proyecto', P.red2, 29], ['src/refunds/AGENTS.md', 'subcarpeta · reglas de esa parte', P.amber, 30.5]];
      L.forEach(([f, n, col, ts], i) => {
        const a = seg(t, ts, ts + .6), x = 180 + i * 120, y = 200 + i * 150;
        box(x, y, 820, 110, { r: 18, fill: P.panel2, stroke: col, a });
        icon('file', x + 50, y + 55, 34, col, a, 2);
        T(f, x + 90, y + 50, { s: 26, w: 700, mono: true, a });
        T(n, x + 90, y + 86, { s: 22, w: 500, col: P.muted, a });
        if (i) ln(x - 60, y - 40, x - 60, y + 55, P.line2, 3, a);
      });
      T('Se suman, en orden →', 1180, 330, { s: 30, w: 800, a: seg(t, 32, 32.6) });
      T('el más cercano va último y manda', 1180, 380, { s: 28, w: 600, col: P.amber, a: seg(t, 34.5, 35.2) });
      // barra de 32 KiB
      const ba = seg(t, 38, 38.7);
      T('Límite combinado', 1320, 560, { s: 26, w: 700, a: ba });
      box(1320, 590, 440, 30, { r: 15, fill: 'rgba(255,255,255,.07)', stroke: null, a: ba });
      box(1320, 590, 440 * .38 * seg(t, 38.5, 40, E.inOut), 30, { r: 15, fill: P.green, stroke: null, a: ba });
      T('32 KiB', 1740, 660, { s: 26, w: 800, al: 'right', col: P.green2, a: ba });
      alpha(seg(t, 42, 42.7), () => {
        box(180, 700, 1560, 120, { r: 22, fill: 'rgba(245,165,36,.1)', stroke: P.amber });
        icon('lock', 240, 760, 40, P.amber, 1, 2.2);
        T('Nunca: tokens, contraseñas ni datos de producción en el AGENTS.md.', 290, 772, { s: 34, w: 700 });
      });
    });
  }
});

/* ---------- 2.3 Progressive disclosure ---------- */
S.push(G.seccion('2.3', 'Progressive disclosure', 'Cargar solo lo necesario.'));
const SK = ['escribir-migracion', 'preparar-release', 'generar-tests', 'revisar-seguridad', 'documentar-api', 'manejo-errores', 'crear-endpoint', 'feature-flags', 'logging', 'deploy-staging'];
S.push({
  label: 'Progressive disclosure', dur: 42, section: '2.3 · Progressive disclosure',
  cap: [[.5, 6, 'Si todo el conocimiento del equipo va al AGENTS.md, la ventana se llena y el agente se pierde.'],
        [6.5, 12.5, 'La solución es cargar por niveles. Nivel 1: el AGENTS.md, corto y general, siempre cargado.'],
        [13, 19, 'Nivel 2: de cada guía, el agente ve solo el nombre y una descripción de una línea.'],
        [19.5, 26, 'Nivel 3: cuando la tarea lo necesita, abre la guía completa, con sus pasos y referencias.'],
        [26.5, 33.5, 'Así funcionan las skills de Codex: arranca con el nombre y la descripción, y carga la skill completa recién cuando decide usarla.'],
        [34, 41.5, 'Resultado: podés tener decenas de guías sin llenar la ventana. Las skills las vas a armar en el Módulo 5.']],
  draw(t, d, c) {
    const lv = [['1', 'Siempre cargado', 'AGENTS.md: corto y general', 6.8], ['2', 'Siempre visible, en una línea', 'Nombre y descripción de cada guía', 13.2], ['3', 'Bajo demanda', 'La guía completa, solo cuando hace falta', 19.8]];
    lv.forEach(([n, tit, sub, ts], i) => {
      const a = seg(t, ts, ts + .7), y = 170 + i * 150;
      box(140, y, 820, 120, { r: 20, fill: P.panel2, stroke: t >= ts ? 'rgba(227,6,19,.5)' : P.line, a: .3 + .7 * a });
      dot(200, y + 60, 30, P.red, .3 + .7 * a); T(n, 200, y + 72, { s: 32, w: 900, al: 'center', a: .3 + .7 * a });
      T(tit, 260, y + 54, { s: 30, w: 800, a: .3 + .7 * a });
      T(sub, 260, y + 94, { s: 22, w: 500, col: P.muted, a: .3 + .7 * a });
    });
    // chips de guías
    alpha(seg(t, 13.5, 14.2) * (1 - seg(t, 33.4, 34.1)), () => {
      T('TAREA: endpoint de reembolsos', 1040, 200, { s: 22, w: 800, ls: 3, col: P.amber, a: seg(t, 19.5, 20) });
      const scan = t < 20 ? -1 : Math.min(6, Math.floor((t - 20) / .35)), sel = t > 22.6;
      SK.forEach((n, i) => {
        const col = i % 2, row = Math.floor(i / 2), x = 1040 + col * 380, y = 230 + row * 62;
        if (i === 6 && sel) return;
        const on = i === scan && !sel;
        box(x, y, 360, 48, { r: 10, fill: on ? 'rgba(245,165,36,.18)' : P.panel2, stroke: on ? P.amber : P.line, a: sel ? .4 : 1 });
        T(n, x + 18, y + 32, { s: 20, w: 500, mono: true, col: on ? '#fff' : P.muted, a: sel ? .4 : 1 });
      });
      const ex = seg(t, 22.6, 23.6, E.inOut);
      if (ex > 0) {
        const y = lerp(230 + 3 * 62, 580, ex), h = lerp(48, 260, ex);
        box(1040, y, 740, h, { r: 14, fill: '#0B0E13', stroke: P.green, glow: 'rgba(22,163,122,.35)' });
        T('# crear-endpoint', 1064, y + 38, { s: 22, w: 700, mono: true, col: P.green2 });
        ['1. Controller en src/<módulo>/', '2. Validar el input con el schema', '3. Test de integración obligatorio', '4. Documentar en docs/api.md'].forEach((l, i) => T(l, 1064, y + 86 + i * 42, { s: 22, w: 500, mono: true, col: '#D7DBE3', a: seg(t, 23.6 + i * .3, 23.9 + i * .3) }));
      }
    });
    // comparación de ventana
    alpha(seg(t, 34, 34.8), () => {
      [['Cargar todo', 1.4, P.red, 'no entra'], ['Progressive disclosure', .23, P.green, 'entra de sobra']].forEach(([n, v, col, tx], i) => {
        const y = 690 + i * 90, w = 700 * Math.min(v, 1.3) * seg(t, 34.5 + i * .5, 36 + i * .5, E.inOut);
        T(n, 140, y + 26, { s: 26, w: 700 });
        box(480, y, 700, 36, { r: 18, fill: 'rgba(255,255,255,.06)', stroke: null });
        box(480, y, w, 36, { r: 18, fill: col, stroke: null });
        T(tx, 480 + Math.max(w, 700) + 24, y + 28, { s: 24, w: 800, col: i ? P.green2 : P.red2 });
      });
      ln(1180, 670, 1180, 800, '#fff', 3, 1, [8, 8]);
      T('capacidad de la ventana', 1180, 660, { s: 18, w: 700, al: 'center', col: P.muted });
    });
  }
});

/* ---------- 2.4 En Codex ---------- */
S.push(G.seccion('2.4', 'Tu AGENTS.md en Codex', 'Crearlo, mejorarlo y probarlo.'));
S.push({
  label: 'AGENTS.md en Codex', dur: 48, section: '2.4 · En Codex',
  cap: [[.5, 6, 'En Codex, el comando /init crea un AGENTS.md para tu repo. Si ya existe uno, no lo pisa: te avisa y no hace nada.'],
        [6.5, 13, 'Es un buen borrador, pero no es el final. Revisalo y hacelo específico: tus comandos, tus convenciones, tus prohibiciones.'],
        [13.5, 20, 'Juli suma la convención que más corregía: errores con logger.error. Y no se lo tiene que volver a decir.'],
        [20.5, 28, 'La prueba: una sesión nueva, el mismo pedido de siempre… y Codex ya usa logger.error, sin que nadie lo corrija.'],
        [28.5, 35, 'Dos comandos más para cuidar el contexto: /status muestra la configuración y cuántos tokens vas usando…'],
        [35.5, 42, '…y /compact resume la conversación cuando la sesión es larga. Codex también compacta solo cuando la ventana se llena.'],
        [42.5, 47.5, 'Por eso lo importante va escrito en el AGENTS.md: dicho una vez en el chat, se puede perder.']],
  draw(t, d, c) {
    alpha(1 - seg(t, 20, 20.8), () => {
      terminal(140, 140, 900, 700, 'codex · pagos-api  (simulación)', [
        [1, '› /init', P.text],
        [2.5, '• Analizando la estructura del repo…', P.dim],
        [4, '• Creado AGENTS.md (stack, estructura, comandos)', P.green2],
        [7, '$ code AGENTS.md    # revisar y ajustar', P.text],
        [14, '+ ## Convenciones', P.green2],
        [15, '+ - Errores: try/catch + logger.error,', P.green2],
        [15.8, '+   nunca console.log', P.green2],
        [17, '+ ## Nunca', P.green2],
        [17.8, '+ - Tocar /legacy sin aprobación', P.green2]
      ], t, { s: 23, lh: 50 });
      alpha(seg(t, 6.8, 7.4), () => {
        [['Comandos reales', 'npm test · npm run lint'], ['Convenciones concretas', 'lo que corregís seguido'], ['Lo que nunca', 'carpetas, datos, deploy']].forEach(([n, tx], i) => {
          const a = seg(t, 7.5 + i * 1.2, 8.1 + i * 1.2), y = 170 + i * 150;
          box(1110, y, 680, 120, { r: 20, fill: P.panel2, stroke: 'rgba(22,163,122,.5)', a });
          icon('check', 1160, y + 60, 34, P.green2, a, 3);
          T(n, 1200, y + 52, { s: 30, w: 800, a });
          T(tx, 1200, y + 92, { s: 22, w: 500, col: P.muted, a });
        });
        chip('Tip: /init no pisa un AGENTS.md que ya existe', 1110, 650, { s: 22, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)', a: seg(t, 11, 11.6) });
      });
    });
    alpha(seg(t, 20.5, 21.3) * (1 - seg(t, 28, 28.8)), () => {
      T('Sesión nueva, mismo pedido', 160, 220, { s: 52, w: 900 });
      terminal(160, 280, 1600, 500, 'codex · pagos-api  (simulación)', [
        [22, '› Agregá un log cuando falle el reembolso', P.text],
        [23.5, '• Leyendo AGENTS.md y src/refunds/controller.ts', P.dim],
        [25, '} catch (err) {', '#D7DBE3'],
        [25.6, '  logger.error("refund failed", { refundId, err })', P.green2],
        [26.2, '}', '#D7DBE3']
      ], t, { s: 26, lh: 56 });
      chip('✓ sin correcciones', 1540, 660, { s: 24, col: P.green2, stroke: P.green, fill: 'rgba(22,163,122,.15)', a: seg(t, 26.5, 27) });
      juli(1700, 960, .5, { t, mood: 'happy', look: -.5, a: seg(t, 26.5, 27) });
    });
    alpha(seg(t, 28.5, 29.3), () => {
      [['/status', 'Configuración de la sesión y uso de tokens', 'layers', 28.8], ['/compact', 'Resume la conversación para no llegar al límite', 'box', 35.8]].forEach(([cmd, tx, ic, ts], i) => {
        const a = seg(t, ts, ts + .7), x = 160 + i * 820;
        box(x, 230, 780, 300, { r: 24, fill: P.panel2, stroke: P.line2, a });
        icon(ic, x + 70, 310, 50, P.red2, a, 2);
        T(cmd, x + 120, 324, { s: 48, w: 900, mono: true, a });
        TW(tx, x + 60, 420, 660, 40, { s: 30, w: 500, col: P.muted, a });
      });
      alpha(seg(t, 42.5, 43.2), () => {
        box(160, 600, 1600, 140, { r: 24, fill: 'rgba(227,6,19,.12)', stroke: P.red, lw: 3 });
        T('Lo importante, escrito en el AGENTS.md: dicho una vez en el chat, se puede perder.', 960, 684, { s: 34, w: 800, al: 'center' });
      });
    });
  }
});

/* ---------- Probalo vos: Paso 1 ---------- */
S.push({
  label: 'Probalo vos', dur: 34, section: '2.5 · Paso 1',
  cap: [[.5, 6, 'Tu turno. Este es el Paso 1 del recorrido: el AGENTS.md de tu proyecto.'],
        [6.5, 14, 'Crealo con /init, o pedile a Codex que analice el repo y lo complete. Después revisalo vos: que sea corto y específico.'],
        [14.5, 22, 'Sumá las dos o tres correcciones que más repetís. Y probalo: sesión nueva, un pedido de siempre, y mirá si lo aplica.'],
        [22.5, 33.5, 'Si trabajás en el repo de un cliente, el AGENTS.md del kit no se sube: se excluye de forma local con .git/info/exclude.']],
  draw(t, d, c) {
    T('Paso 1 · Tu AGENTS.md', 160, 230, { s: 64, w: 900 });
    chip('30 minutos · en tu repo', 900, 188, { s: 22, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)' });
    [['Crealo', 'Con /init o pidiéndole a Codex que analice el repo. Es el borrador.'],
     ['Hacelo tuyo', 'Corto y específico: comandos, convenciones, lo que nunca. Sumá las correcciones que más repetís.'],
     ['Probalo', 'Sesión nueva, un pedido de siempre. ¿Lo aplica sin que lo corrijas?']].forEach(([n, txt], i) => {
      const a = seg(t, 1 + i * .8, 1.7 + i * .8), x = 160 + i * 540;
      box(x, 290, 500, 400, { fill: P.panel2, stroke: P.line2, a });
      dot(x + 60, 360, 34, P.red, a); T(String(i + 1), x + 60, 374, { s: 36, w: 900, al: 'center', a });
      T(n, x + 40, 460, { s: 36, w: 800, a });
      TW(txt, x + 40, 520, 420, 40, { s: 27, w: 400, col: P.muted, a });
    });
    alpha(seg(t, 22.5, 23.2), () => {
      box(160, 730, 1600, 110, { r: 20, fill: P.panel, stroke: 'rgba(245,165,36,.5)' });
      T('Repo de un cliente:', 200, 796, { s: 28, w: 800, col: P.amber });
      T('echo "AGENTS.md" >> .git/info/exclude', 490, 796, { s: 28, w: 600, mono: true });
    });
  }
});

/* ---------- Resumen, challenge y cierre ---------- */
S.push(G.resumen([
  'Ante un mal resultado: ¿el agente tenía la información para hacerlo bien?',
  'AGENTS.md: lo que aplica siempre, corto y específico. Sin datos sensibles.',
  'Si lo corregís dos veces, va al AGENTS.md.',
  'Codex suma el global, el del repo y el de la carpeta; el más cercano manda.',
  'Progressive disclosure: el detalle se carga solo cuando la tarea lo necesita.'
]));
const QV = PREGUNTAS.preguntas.filter(q => q.video);
S.push(G.challengeIntro(QV.length));
QV.forEach((q, i) => S.push(G.pregunta(q, i, QV.length)));
S.push(G.cierre(META));

META.assets = {
  juli: { sprite: 'juli', w: 600, h: 620 }, bit: { sprite: 'bit', w: 600, h: 600 }, walk: { sprite: 'walk', w: 300, h: 420 },
  problema: { scene: 'El problema', at: 14 }, contexto: { scene: 'Context engineering', at: 9.5 }, qcc: { scene: 'Context engineering', at: 30 },
  agentsmd: { scene: 'AGENTS.md', at: 23 }, jerarquia: { scene: 'AGENTS.md', at: 41 },
  disclosure: { scene: 'Progressive disclosure', at: 25.5 }, ventana: { scene: 'Progressive disclosure', at: 39 },
  init: { scene: 'AGENTS.md en Codex', at: 18.5 }, prueba: { scene: 'AGENTS.md en Codex', at: 27.5 },
  comandos: { scene: 'AGENTS.md en Codex', at: 45 }, paso1: { scene: 'Probalo vos', at: 28 }
};
F.run(S, META);
})();
