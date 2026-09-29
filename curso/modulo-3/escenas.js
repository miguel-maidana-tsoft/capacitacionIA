/* =========================================================
   MÓDULO 3 · Especificar antes de construir
   Ejemplo conductor: "pagos-api" · feature: reembolsos parciales.
   Datos de Codex verificados en ../CODEX-VERIFICADO.md (29/09/2026).
   ========================================================= */
(() => {
const { P, E, clamp, lerp, seg, typed, ga, alpha, T, measure, wrapLines, TW, box, ln, dot, glowAt, icon,
        juli, bit, stamp, terminal, chip, card, G } = F;

const META = {
  n: 3,
  titulo: 'Especificar antes de construir',
  bajada: 'Por qué la spec es el contrato entre vos y el agente, y cómo aprobar el plan antes de tocar código.',
  siguiente: 'Módulo 4 · Que se verifique solo'
};

const S = [];
S.push(G.portada(META));
S.push(G.objetivos([
  ['file', 'Spec-Driven Development', 'La spec como contrato: todo se mide contra ella.'],
  ['check', 'La spec en seis piezas', 'Qué tiene que tener para que el agente no invente.'],
  ['user', 'Aprobar el plan', 'Preguntas cerradas y el checkpoint más valioso.'],
  ['route', 'El modo Plan de Codex', 'Planificar y preguntar antes de tocar el repo.']
], 'Al final hay un challenge y el Paso 2 de tu recorrido: la spec de tu próxima feature.',
   'En este módulo aprendés a decirle al agente qué construir antes de que escriba una línea.'));

/* ---------- El problema ---------- */
S.push({
  label: 'El problema', dur: 20, section: 'El problema',
  cap: [[.6, 5.5, 'Juli le pide a Codex una feature nueva para pagos-api: reembolsos parciales.'],
        [6, 12, 'Codex la construye rápido. Pero decidió solo tres cosas que nadie le dijo.'],
        [12.5, 19.5, 'Un agente ejecuta lo que le decís, no lo que quisiste decir. Y los huecos los completa con supuestos.']],
  draw(t, d, c) {
    juli(260, 930, .7, { t, mood: t > 12 ? 'stress' : 'calm', look: .6 });
    const ub = 'Agregá reembolsos parciales', uw = measure(ub, 30, 600) + 60;
    box(160, 190, uw, 70, { r: 26, fill: '#2A3242', stroke: null, a: seg(t, .6, 1) });
    T(ub, 190, 236, { s: 30, w: 600, a: seg(t, .6, 1) });
    bit(1640, 260, 70, { t, mood: t > 5 && t < 12 ? 'happy' : 'calm' });
    [['¿Se puede reembolsar más que el pago?', 'asumió: sí', 6.5], ['¿Varios reembolsos sobre un mismo pago?', 'asumió: no', 8], ['¿Quién puede hacerlos?', 'asumió: cualquiera', 9.5]].forEach(([qq, sup, ts], i) => {
      const a = seg(t, ts, ts + .6), y = 330 + i * 150;
      box(700, y, 1100, 120, { r: 22, fill: P.panel2, stroke: P.amber, a });
      T(qq, 740, y + 54, { s: 30, w: 700, a });
      chip(sup, 740, y + 70, { s: 20, col: P.amber, stroke: null, fill: 'rgba(245,165,36,.15)', a });
    });
    stamp('SUPUESTOS', 1250, 820, seg(t, 11, 11.6, E.lin), P.amber);
  }
});

/* ---------- 3.1 SDD ---------- */
S.push(G.seccion('3.1', 'Spec-Driven Development', 'La spec es el contrato.'));
S.push({
  label: 'SDD', dur: 38, section: '3.1 · SDD',
  cap: [[.5, 6, 'En Spec-Driven Development, antes de generar código se escribe y se valida una especificación.'],
        [6.5, 12.5, 'Spec, plan, código y verificación. Y todo lo que sigue se mide contra la spec.'],
        [13, 19.5, 'Las ambigüedades aparecen antes de codear, el plan se puede revisar y QA sabe exactamente qué validar.'],
        [20, 27.5, 'Y es mucho más barato: corregir una spec cuesta minutos. Corregir el código que salió de una spec ambigua, horas.'],
        [28, 37.5, 'Especificar no es burocracia: es la forma de que el agente construya lo que realmente necesitás.']],
  draw(t, d, c) {
    const xs = [320, 760, 1200, 1640], names = ['Spec', 'Plan', 'Código', 'Verificación'], ics = ['file', 'route', 'code', 'shield'];
    xs.forEach((x, i) => {
      const k = seg(t, 6.5 + i * .5, 7 + i * .5, E.back);
      if (i) ln(xs[i - 1] + 110, 330, lerp(xs[i - 1] + 110, x - 110, seg(t, 6.5 + i * .5, 7 + i * .5)), 330, P.red, 5);
      c.save(); c.translate(x, 330); c.scale(k, k);
      box(-110, -95, 220, 190, { r: 26, fill: i ? P.panel2 : 'rgba(227,6,19,.2)', stroke: i ? P.line2 : P.red, lw: 3, glow: i ? null : 'rgba(227,6,19,.4)' });
      icon(ics[i], 0, -22, 56, i ? P.muted : P.red2, 1, 2);
      T(names[i], 0, 58, { s: i === 3 ? 26 : 32, w: 800, al: 'center' });
      c.restore();
    });
    const ba = seg(t, 10, 10.8);
    c.save(); ga(ba); c.strokeStyle = P.green2; c.lineWidth = 4; c.setLineDash([10, 10]);
    c.beginPath(); c.moveTo(1640, 430); c.bezierCurveTo(1640, 560, 320, 560, 320, 430); c.stroke(); c.restore();
    T('se verifica contra la spec', 980, 592, { s: 28, w: 700, col: P.green2, al: 'center', a: ba });
    alpha(1 - seg(t, 19.6, 20.3), () => {
      [['search', 'Las ambigüedades aparecen antes de codear'], ['check', 'El plan se puede revisar y aprobar'], ['target', 'QA sabe exactamente qué validar']].forEach(([ic, n], i) => {
        const a = seg(t, 13.2 + i * 1.2, 13.8 + i * 1.2), x = 160 + i * 540;
        box(x, 640, 500, 130, { r: 20, fill: P.panel2, stroke: P.line2, a });
        icon(ic, x + 55, 705, 36, P.red2, a, 2.2);
        TW(n, x + 100, 695, 380, 34, { s: 26, w: 700, a });
      });
    });
    alpha(seg(t, 20, 20.8), () => {
      T('Corregir en la spec', 160, 680, { s: 30, w: 700 });
      box(560, 652, 60 * seg(t, 20.8, 21.5), 40, { r: 8, fill: P.green, stroke: null });
      T('minutos', 640, 684, { s: 30, w: 800, col: P.green2, a: seg(t, 21.3, 21.7) });
      T('Corregir en el código', 160, 780, { s: 30, w: 700 });
      box(560, 752, 1100 * seg(t, 22, 24.5, E.inOut), 40, { r: 8, fill: P.red, stroke: null });
      T('horas', 1680, 784, { s: 30, w: 800, col: P.red2, a: seg(t, 24.2, 24.6) });
    });
  }
});

/* ---------- 3.2 La spec en seis piezas ---------- */
S.push(G.seccion('3.2', 'La spec en seis piezas', 'Qué tiene que tener para que el agente no invente.'));
const SPEC = [
  ['Qué se construye', 'Reembolsar una parte del monto de un pago aprobado.'],
  ['Actores', 'Operador de soporte · pagos-api · proveedor de pagos.'],
  ['Flujo principal', 'Elegir pago → monto → confirmar → notificar al cliente.'],
  ['Casos borde', 'Monto ≤ 0, mayor al saldo, pago ya reembolsado.'],
  ['Fuera de scope', 'Reembolsos en otra moneda. Queda para después.'],
  ['Criterios de aceptación', 'La suma de reembolsos nunca supera el pago · 400 con detalle si se excede.']
];
S.push({
  label: 'Seis piezas', dur: 48, section: '3.2 · Seis piezas',
  cap: [[.5, 5.5, 'Una buena spec tiene seis piezas. Veámoslas con la feature de Juli.'],
        [6, 12, 'Qué se construye, en pocas oraciones y sin jerga. Y los actores: quién lo usa y qué sistemas intervienen.'],
        [12.5, 19, 'El flujo principal, paso a paso y sin huecos. Y los casos borde: datos inválidos, vacíos, límites.'],
        [19.5, 26, 'Lo que queda fuera de scope, dicho explícitamente. Y los criterios de aceptación: cómo sabemos que está bien.'],
        [26.5, 33, 'El test para saber si está lista: si alguien nuevo en el equipo no podría implementarla sin preguntar, el agente tampoco.'],
        [33.5, 40.5, 'El puente con análisis funcional: si la historia de usuario ya trae estas seis piezas, el agente arranca con la mitad del trabajo hecho.'],
        [41, 47.5, 'Fijate que la spec dice qué y por qué. El cómo —archivos, funciones, nombres— va en el plan.']],
  draw(t, d, c) {
    box(140, 150, 1080, 760, { fill: P.panel, shadow: 40 });
    T('docs/reembolsos-parciales.md', 180, 200, { s: 22, w: 600, mono: true, col: P.dim });
    ln(140, 226, 1220, 226, P.line);
    const times = [6.3, 9, 12.8, 16, 19.8, 22.8];
    SPEC.forEach(([n, d2], i) => {
      const y = 250 + i * 108, a = seg(t, times[i], times[i] + .6), on = t >= times[i] + .6;
      box(180, y + 8, 40, 40, { r: 10, fill: on ? P.green : null, stroke: on ? P.green : P.line2, a: .3 + .7 * a });
      if (on) icon('check', 200, y + 28, 26, '#fff', 1, 3);
      T(n, 244, y + 38, { s: 30, w: 800, a: .3 + .7 * a });
      TW(d2, 244, y + 76, 940, 30, { s: 23, w: 500, col: P.muted, a });
    });
    alpha(seg(t, 26.5, 27.2), () => {
      box(1280, 180, 500, 300, { r: 24, fill: P.panel2, stroke: P.line2 });
      juli(1530, 440, .45, { t, mood: 'calm', look: 0 });
      T('¿La podría implementar', 1530, 250, { s: 28, w: 800, al: 'center' });
      T('alguien nuevo sin preguntar?', 1530, 290, { s: 28, w: 800, al: 'center' });
    });
    alpha(seg(t, 33.5, 34.2), () => {
      box(1280, 520, 500, 250, { r: 24, fill: P.panel2, stroke: 'rgba(245,165,36,.5)' });
      const pc = Math.round(50 * seg(t, 34, 36, E.inOut));
      c.save(); ga(1); c.lineWidth = 14; c.strokeStyle = 'rgba(255,255,255,.08)'; c.beginPath(); c.arc(1400, 645, 70, 0, Math.PI * 2); c.stroke();
      c.strokeStyle = P.amber; c.lineCap = 'round'; c.beginPath(); c.arc(1400, 645, 70, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pc / 100); c.stroke(); c.restore();
      T(pc + '%', 1400, 660, { s: 36, w: 900, al: 'center' });
      TW('Historia de usuario con las seis piezas', 1500, 610, 260, 32, { s: 24, w: 700, col: P.amber });
    });
    alpha(seg(t, 41, 41.7), () => {
      chip('Spec: qué y por qué  ·  Plan: cómo', 1280, 810, { s: 26, col: P.text, fill: 'rgba(227,6,19,.15)', stroke: P.red });
    });
  }
});

/* ---------- 3.3 Preguntas cerradas y aprobar el plan ---------- */
S.push(G.seccion('3.3', 'Aprobar el plan', 'Preguntas cerradas y el checkpoint más valioso.'));
S.push({
  label: 'Aprobar el plan', dur: 44, section: '3.3 · Aprobar el plan',
  cap: [[.5, 6, 'Aunque la spec sea buena, siempre queda alguna duda. La regla: ambigüedades, preguntas cerradas. Nunca supuestos.'],
        [6.5, 13, 'Una pregunta cerrada se responde en segundos: sí o no, a o b. Y la respuesta vuelve a la spec.'],
        [13.5, 20, 'Con la spec clara, el agente propone un plan: qué archivos toca, en qué orden y cómo lo va a verificar.'],
        [20.5, 27.5, 'Y acá está el checkpoint más valioso: aprobar el plan antes de que se escriba una sola línea de código.'],
        [28, 35, 'Muy pocos checkpoints: el agente construye rápido sobre un error. Demasiados: se termina aprobando sin leer.'],
        [35.5, 43.5, 'Tres alcanzan: spec validada, plan aprobado y diff revisado.']],
  draw(t, d, c) {
    alpha(1 - seg(t, 13, 13.8), () => {
      bit(300, 420, 80, { t, mood: 'calm' });
      ln(380, 420, 520, 420, P.line2, 2, 1, [6, 6]);
      box(520, 250, 1240, 360, { fill: P.panel2, shadow: 30 });
      T('PREGUNTA CERRADA', 570, 310, { s: 22, w: 800, ls: 5, col: P.red2 });
      T('¿Se permiten varios reembolsos parciales sobre un mismo pago?', 570, 380, { s: 34, w: 800 });
      const yes = t > 8.5;
      [['Sí, hasta cubrir el total', 570], ['No, uno solo por pago', 1130]].forEach(([n, x], i) => {
        const on = yes && i === 0;
        box(x, 440, 520, 90, { r: 18, fill: on ? P.green : P.panel3, stroke: on ? P.green : P.line2 });
        T(n, x + 260, 496, { s: 28, w: 700, al: 'center' });
      });
      chip('→ se agrega a la spec', 570, 560, { s: 22, col: P.green2, stroke: P.green, fill: 'rgba(22,163,122,.14)', a: seg(t, 10, 10.5) });
      juli(300, 930, .5, { t, mood: yes ? 'happy' : 'calm', look: .6, a: seg(t, 6.5, 7) });
    });
    alpha(seg(t, 13.5, 14.2) * (1 - seg(t, 27.5, 28.3)), () => {
      box(160, 170, 1000, 640, { fill: P.panel, shadow: 40 });
      T('PLAN PROPUESTO', 200, 225, { s: 22, w: 800, ls: 5, col: P.muted });
      ['1. Schema: validar monto > 0 y ≤ saldo del pago', '2. Guardar cada reembolso parcial y el saldo restante', '3. Endpoint POST /payments/:id/refunds', '4. Tests: casos borde de la spec', '5. Verificar: npm test && npm run lint'].forEach((l, i) => T(typed(l, (t - 14.5 - i * .9) / .7), 200, 300 + i * 70, { s: 26, w: 500, mono: true, col: '#D7DBE3' }));
      const ap = seg(t, 21, 21.5, E.lin);
      stamp('PLAN APROBADO', 800, 720, ap, P.green2);
      juli(1450, 900, .8, { t, mood: t > 21 ? 'happy' : 'calm', look: -.6 });
      T('Recién ahí se escribe código', 1450, 300, { s: 32, w: 800, al: 'center', col: P.amber, a: seg(t, 23, 23.6) });
    });
    alpha(seg(t, 28, 28.8), () => {
      const steps = ['Spec', 'Plan', 'Código', 'Tests', 'Merge'], xs = [200, 560, 920, 1280, 1640];
      ln(200, 330, 1640, 330, P.line2, 4);
      steps.forEach((s, i) => { box(xs[i] - 90, 290, 180, 80, { r: 18, fill: P.panel2, stroke: P.line2 }); T(s, xs[i], 342, { s: 28, w: 800, al: 'center' }); });
      [['Spec validada', 380, false], ['Plan aprobado', 740, true], ['Diff revisado', 1460, false]].forEach(([n, x, gold], i) => {
        const a = seg(t, 35.8 + i * .6, 36.3 + i * .6), col = gold ? P.amber : P.green2;
        box(x - 110, 430, 220, 70, { r: 35, fill: gold ? 'rgba(245,165,36,.18)' : 'rgba(22,163,122,.14)', stroke: col, lw: gold ? 4 : 2, a, glow: gold ? 'rgba(245,165,36,.5)' : null });
        T(n, x, 474, { s: 24, w: 800, al: 'center', col, a });
        ln(x, 380, x, 430, col, 3, a);
      });
      [['Muy pocos', 'Construye rápido sobre un error que nadie vio.', P.red2, 28.4], ['Demasiados', 'Fatiga de aprobación: se aprueba sin leer.', P.amber, 31]].forEach(([n, tx, col, ts], i) => {
        const a = seg(t, ts, ts + .6) * (1 - seg(t, 35.3, 35.8) * .6), x = 200 + i * 780;
        box(x, 600, 740, 150, { r: 22, fill: P.panel2, stroke: col, a });
        T(n, x + 40, 660, { s: 32, w: 800, col, a });
        T(tx, x + 40, 710, { s: 24, w: 500, col: P.muted, a });
      });
    });
  }
});

/* ---------- 3.4 El modo Plan de Codex ---------- */
S.push(G.seccion('3.4', 'El modo Plan de Codex', 'Planificar antes de tocar el repo.'));
S.push({
  label: 'Modo Plan', dur: 50, section: '3.4 · Modo Plan',
  cap: [[.5, 6.5, 'Codex tiene un modo pensado para esto: el modo Plan. Se activa con /plan, y podés escribir el pedido en la misma línea.'],
        [7, 13.5, 'En modo Plan, Codex no edita nada: lee el repo, junta contexto y te hace preguntas antes de proponer.'],
        [14, 21, 'Juli le pasa la spec y le pide que pregunte todo lo que no esté claro. Codex responde con una pregunta cerrada.'],
        [21.5, 29, 'Con la respuesta, propone el plan. Y te pregunta: ¿lo implemento? Podés aceptar, o quedarte en modo Plan y ajustarlo.'],
        [29.5, 36.5, 'Cuando termina, /review revisa los cambios. Pasale la spec: así revisa contra lo que se pidió, no solo contra el código.'],
        [37, 44, 'La guía oficial de Codex lo recomienda: pedile que te entreviste para convertir una idea vaga en una spec antes de codear.'],
        [44.5, 49.5, 'En el TSOFT AI Dev Kit, esto lo hacen el Explorador y el Planificador. Lo vas a ver en el Módulo 6.']],
  draw(t, d, c) {
    alpha(1 - seg(t, 29, 29.8), () => {
      terminal(140, 140, 1640, 700, 'codex · pagos-api  (simulación)', [
        [1, '› /plan Implementá docs/reembolsos-parciales.md. Antes, preguntame lo que no esté claro.', P.text],
        [3.5, '  modo Plan: solo lectura, sin editar archivos', P.amber],
        [8, '• Leyendo docs/reembolsos-parciales.md, src/refunds/ y AGENTS.md', P.dim],
        [14.5, '? ¿El saldo se calcula sobre el pago original o sobre lo ya reembolsado?', '#9DB9F5'],
        [16.5, '  1) sobre lo ya reembolsado (saldo restante)   2) siempre sobre el original', '#9DB9F5'],
        [19, '› 1', P.text],
        [22, '• Plan: schema (monto > 0 y ≤ saldo) · guardar reembolsos · endpoint · tests · npm test', '#D7DBE3'],
        [25, '  Implement this plan?  › Yes, implement this plan   · No, stay in Plan mode', P.green2]
      ], t, { s: 23, lh: 56 });
    });
    alpha(seg(t, 29.5, 30.3), () => {
      box(160, 190, 780, 330, { r: 24, fill: P.panel2, stroke: P.line2 });
      icon('eye', 230, 270, 48, P.red2, 1, 2);
      T('/review', 280, 285, { s: 48, w: 900, mono: true });
      TW('Revisa tus cambios. Sumale la spec: "Revisá contra docs/reembolsos-parciales.md".', 210, 370, 680, 40, { s: 28, w: 500, col: P.muted });
      box(980, 190, 780, 330, { r: 24, fill: P.panel2, stroke: 'rgba(245,165,36,.5)', a: seg(t, 37, 37.7) });
      icon('chat', 1050, 270, 48, P.amber, seg(t, 37, 37.7), 2);
      T('Que te entreviste', 1100, 285, { s: 40, w: 900, a: seg(t, 37, 37.7) });
      TW('"Tengo esta idea. Haceme preguntas hasta que tengamos una spec con las seis piezas."', 1030, 370, 680, 40, { s: 28, w: 500, col: P.muted, a: seg(t, 37.3, 38) });
      alpha(seg(t, 44.5, 45.2), () => {
        const kx = [300, 700, 1100, 1500], kn = ['Explorador', 'Planificador', 'Plan aprobado', 'Desarrollador'], kc = ['blue', 'purple', null, 'red'];
        kx.forEach((x, i) => {
          if (kc[i]) { bit(x, 700, 44, { t, col: kc[i], seed: i }); T(kn[i], x, 790, { s: 24, w: 800, al: 'center' }); }
          else { box(x - 110, 670, 220, 60, { r: 30, fill: 'rgba(245,165,36,.18)', stroke: P.amber, lw: 3 }); T(kn[i], x, 710, { s: 22, w: 800, al: 'center', col: P.amber }); }
          if (i) ln(kx[i - 1] + 70, 700, x - (kc[i] ? 60 : 120), 700, P.line2, 3);
        });
        T('TSOFT AI Dev Kit · Módulo 6', 960, 620, { s: 22, w: 800, ls: 4, col: P.red2, al: 'center' });
      });
    });
  }
});

/* ---------- Paso 2 ---------- */
S.push({
  label: 'Probalo vos', dur: 34, section: '3.5 · Paso 2',
  cap: [[.5, 6, 'Tu turno. Este es el Paso 2 del recorrido: la spec de tu próxima feature.'],
        [6.5, 14, 'Escribila con las seis piezas en docs/, o pedile a Codex que te entreviste para armarla.'],
        [14.5, 22, 'Pasala por el modo Plan y pedile que te pregunte lo que no esté claro. Respondé y sumá las respuestas a la spec.'],
        [22.5, 33.5, 'Aprobá el plan recién cuando lo entiendas completo. Y al final, revisá el resultado contra la spec.']],
  draw(t, d, c) {
    T('Paso 2 · La spec de tu próxima feature', 160, 230, { s: 60, w: 900 });
    chip('45 minutos · en tu repo', 1380, 188, { s: 22, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)' });
    [['Escribila', 'Seis piezas en docs/<feature>.md, o que Codex te entreviste para armarla.'],
     ['Pasala por /plan', 'Pedile que te pregunte lo que no esté claro. Respondé y actualizá la spec.'],
     ['Aprobá y revisá', 'Aprobá el plan cuando lo entiendas. Al final, /review contra la spec.']].forEach(([n, txt], i) => {
      const a = seg(t, 1 + i * .8, 1.7 + i * .8), x = 160 + i * 540;
      box(x, 290, 500, 420, { fill: P.panel2, stroke: P.line2, a });
      dot(x + 60, 360, 34, P.red, a); T(String(i + 1), x + 60, 374, { s: 36, w: 900, al: 'center', a });
      T(n, x + 40, 460, { s: 36, w: 800, a });
      TW(txt, x + 40, 520, 420, 40, { s: 27, w: 400, col: P.muted, a });
    });
    chip('Módulo 4: que el agente se verifique solo contra esos criterios de aceptación', 160, 760, { s: 22, col: P.green2, stroke: 'rgba(22,163,122,.6)', fill: 'rgba(22,163,122,.12)', a: seg(t, 24, 24.6) });
  }
});

/* ---------- Resumen, challenge y cierre ---------- */
S.push(G.resumen([
  'Un agente ejecuta lo que le decís, no lo que quisiste decir.',
  'La spec es el contrato: todo se verifica contra ella.',
  'Seis piezas: qué, actores, flujo, casos borde, fuera de scope, criterios.',
  'Ambigüedades → preguntas cerradas. Nunca supuestos.',
  'El checkpoint más valioso: aprobar el plan antes de escribir código.'
]));
const QV = PREGUNTAS.preguntas.filter(q => q.video);
S.push(G.challengeIntro(QV.length));
QV.forEach((q, i) => S.push(G.pregunta(q, i, QV.length)));
S.push(G.cierre(META));

META.assets = {
  juli: { sprite: 'juli', w: 600, h: 620 }, bit: { sprite: 'bit', w: 600, h: 600 }, walk: { sprite: 'walk', w: 300, h: 420 },
  problema: { scene: 'El problema', at: 16 }, sdd: { scene: 'SDD', at: 18 }, costo: { scene: 'SDD', at: 30 },
  spec: { scene: 'Seis piezas', at: 30 }, pregunta: { scene: 'Aprobar el plan', at: 11 }, plan: { scene: 'Aprobar el plan', at: 25 },
  checkpoints: { scene: 'Aprobar el plan', at: 41 }, modoplan: { scene: 'Modo Plan', at: 27 }, review: { scene: 'Modo Plan', at: 42 },
  kit: { scene: 'Modo Plan', at: 48 }, paso2: { scene: 'Probalo vos', at: 28 }
};
F.run(S, META);
})();
