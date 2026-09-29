/* =========================================================
   MÓDULO 4 · Que se verifique solo
   Ejemplo conductor: "pagos-api" · reembolsos parciales (del Módulo 3).
   Datos de Codex verificados en ../CODEX-VERIFICADO.md (29/09/2026).
   ========================================================= */
(() => {
const { P, E, clamp, lerp, seg, typed, ga, alpha, T, measure, wrapLines, TW, box, ln, dot, glowAt, icon,
        juli, bit, stamp, terminal, chip, card, rnd, G } = F;

const META = {
  n: 4,
  titulo: 'Que se verifique solo',
  bajada: 'Cómo pasar de "confío en el modelo" a "está garantizado": verificación, hooks y revisión.',
  siguiente: 'Módulo 5 · Capturar y conectar'
};

const S = [];
S.push(G.portada(META));
S.push(G.objetivos([
  ['refresh', 'Feedback loop', 'Que el agente se verifique y se corrija solo.'],
  ['bolt', 'Hooks', 'Garantías que no dependen de que el modelo se acuerde.'],
  ['lock', 'Reglas de comandos', 'Qué puede ejecutar, qué necesita aprobación y qué nunca.'],
  ['shield', 'Revisión en tres filtros', 'El agente no se aprueba a sí mismo.']
], 'Al final hay un challenge y el Paso 3 de tu recorrido: que el agente corra tests y build en tu repo.',
   'En este módulo aprendés a que el agente sepa si lo hizo bien, antes de que te llegue a vos.'));

/* ---------- El problema ---------- */
S.push({
  label: 'El problema', dur: 18, section: 'El problema',
  cap: [[.6, 5.8, 'Codex terminó los reembolsos parciales y dijo: listo. Juli lo mergeó.'],
        [6.3, 12, 'Al día siguiente, QA encontró el error: un reembolso negativo pasaba sin validar. Nadie había corrido los tests.'],
        [12.5, 17.5, 'Un agente que no puede verificar su trabajo te entrega el error a vos.']],
  draw(t, d, c) {
    bit(360, 330, 80, { t, mood: t < 6 ? 'happy' : 'calm' });
    const cb = seg(t, .8, 1.3);
    box(470, 280, 380, 90, { r: 30, fill: '#2A3242', stroke: null, a: cb });
    T('✓ Listo, todo funciona', 500, 336, { s: 30, w: 700, a: cb });
    stamp('MERGE', 700, 480, seg(t, 3.5, 4, E.lin) * (1 - seg(t, 6, 6.5)), P.green2);
    alpha(seg(t, 6.5, 7.2), () => {
      box(960, 200, 820, 520, { fill: P.panel, shadow: 40, stroke: P.red });
      T('REPORTE DE QA · AL DÍA SIGUIENTE', 1000, 255, { s: 20, w: 800, ls: 4, col: P.red2 });
      T('POST /payments/4812/refunds', 1000, 330, { s: 26, w: 600, mono: true });
      T('{ "amount": -500 }', 1000, 380, { s: 26, w: 600, mono: true, col: P.amber });
      T('→ 200 OK  (esperado: 400)', 1000, 440, { s: 28, w: 700, mono: true, col: P.red2 });
      T('Tests del caso borde: nunca se corrieron', 1000, 540, { s: 28, w: 700, a: seg(t, 9, 9.6) });
      juli(1640, 900, .55, { t, mood: 'stress', look: -.5 });
    });
  }
});

/* ---------- 4.1 Feedback loop ---------- */
S.push(G.seccion('4.1', 'Feedback loop', 'Que se verifique y se corrija solo.'));
const FB = [['Escribe código', 'pen'], ['Corre tests, lint y build', 'terminal'], ['Lee el error', 'eye'], ['Corrige', 'wrench']];
S.push({
  label: 'Feedback loop', dur: 44, section: '4.1 · Feedback loop',
  cap: [[.5, 6, 'La solución es darle al agente una forma de saber si lo hizo bien.'],
        [6.5, 13, 'Escribe el código, corre los tests, el lint y el build, lee el error y corrige. Todo dentro de la misma tarea.'],
        [13.5, 21, 'Mirá: un test falla, Codex lee el mensaje, entiende qué falta y lo arregla. Sin que Juli intervenga.'],
        [21.5, 28, 'Hasta que todo pasa en verde. Recién ahí dice "listo", y con evidencia.'],
        [28.5, 36, '¿Qué necesita para verificarse? Los comandos de test, lint y build en el AGENTS.md, tests existentes y tipado estricto.'],
        [36.5, 43.5, 'La guía oficial de Codex lo recomienda: pedile que cree tests cuando falten, que corra los chequeos y confirme el resultado.']],
  draw(t, d, c) {
    const cx = 440, cy = 490, R = 255;
    const k = t < 6.5 ? -1 : Math.floor((t - 6.5) / 1.8) % 4;
    FB.forEach(([n, ic], i) => {
      const a = (-90 + 90 * i) * Math.PI / 180, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, on = i === k && t < 28;
      box(x - 140, y - 45, 280, 90, { r: 45, fill: on ? 'rgba(227,6,19,.22)' : P.panel2, stroke: on ? P.red : P.line2, lw: on ? 3 : 2, a: seg(t, 6.5 + i * .4, 7 + i * .4) });
      icon(ic, x - 102, y, 30, on ? P.red2 : P.muted, seg(t, 6.5 + i * .4, 7 + i * .4), 2);
      TW(n, x - 74, y - 4, 200, 28, { s: 22, w: 700, a: seg(t, 6.5 + i * .4, 7 + i * .4) });
    });
    bit(cx, cy, 60, { t, mood: t > 21.5 ? 'happy' : 'calm', col: t > 14 && t < 20 ? 'amber' : t > 21.5 ? 'green' : 'red' });
    alpha(1 - seg(t, 28, 28.8), () => {
      terminal(860, 150, 940, 700, 'codex · pagos-api  (simulación)', [
        [8, '• Editando src/refunds/schema.ts', '#9DB9F5'],
        [9.5, '$ npm test', P.text],
        [11, '  ✗ rechaza monto negativo', '#FF6B73'],
        [11.6, '    Expected 400, received 200', '#FF6B73'],
        [14, '• El schema no valida amount > 0', '#9DB9F5'],
        [16, '• Editando src/refunds/schema.ts (+1)', '#9DB9F5'],
        [18, '$ npm test', P.text],
        [19.5, '  ✓ 14 tests pasaron', P.green2],
        [21, '$ npm run lint && npm run build', P.text],
        [22.5, '  ✓ lint OK · build OK', P.green2],
        [24, 'Listo. Evidencia: 14 tests, lint y build en verde.', P.text]
      ], t, { s: 23, lh: 54 });
    });
    alpha(seg(t, 28.5, 29.3), () => {
      [['file', 'Comandos en el AGENTS.md', 'npm test · npm run lint · npm run build'], ['check', 'Tests existentes', 'aunque sean pocos, para empezar'], ['code', 'Tipado estricto y linter', 'el error aparece solo'], ['chat', 'Pedíselo explícito', '"Corré los chequeos y mostrame el resultado"']].forEach(([ic, n, tx], i) => {
        const a = seg(t, 29 + i * 1.3, 29.6 + i * 1.3), y = 170 + i * 165;
        box(860, y, 940, 140, { r: 22, fill: P.panel2, stroke: 'rgba(22,163,122,.5)', a });
        icon(ic, 920, y + 70, 40, P.green2, a, 2);
        T(n, 980, y + 60, { s: 32, w: 800, a });
        T(tx, 980, y + 104, { s: 24, w: 500, col: P.muted, mono: i === 0, a });
      });
    });
  }
});

/* ---------- 4.2 Sugerencia vs. garantía ---------- */
S.push(G.seccion('4.2', 'Hooks', 'Garantías que no dependen del modelo.'));
S.push({
  label: 'Sugerencia vs. garantía', dur: 30, section: '4.2 · Hooks',
  cap: [[.5, 6.5, 'En el Módulo 0 viste la regla de oro: lo que tiene que pasar siempre no se le pide al modelo.'],
        [7, 13.5, 'Si en el AGENTS.md escribís "siempre formateá el código", el agente lo va a hacer… casi siempre.'],
        [14, 20.5, 'Un hook, en cambio, ejecuta una acción automáticamente cuando ocurre un evento. No depende de que el modelo se acuerde.'],
        [21, 29.5, 'Lo que puede fallar alguna vez va en el AGENTS.md. Lo que no puede fallar nunca, en un hook.']],
  draw(t, d, c) {
    [['En el AGENTS.md', '"Siempre formateá el código"', P.amber, 7.2, [1, 1, 0, 1, 1, 1, 0, 1]], ['Como hook', 'Después de cada edición → formatear', P.green2, 14.2, [1, 1, 1, 1, 1, 1, 1, 1]]].forEach(([n, tx, col, ts, v], i) => {
      const a = seg(t, ts, ts + .7), y = 220 + i * 300;
      box(160, y, 1600, 250, { r: 26, fill: P.panel2, stroke: col, a });
      T(n, 210, y + 70, { s: 36, w: 900, col, a });
      T(tx, 210, y + 120, { s: 26, w: 500, mono: true, col: P.muted, a });
      v.forEach((ok, j) => {
        const fa = seg(t, ts + 1 + j * .45, ts + 1.3 + j * .45), x = 210 + j * 120;
        box(x, y + 150, 90, 70, { r: 10, fill: ok ? 'rgba(22,163,122,.22)' : 'rgba(245,165,36,.22)', stroke: ok ? P.green : P.amber, a: fa });
        T(ok ? '✓' : '!', x + 45, y + 197, { s: 30, w: 900, al: 'center', col: ok ? P.green2 : P.amber, a: fa });
      });
      T(i ? 'siempre, sin excepción' : 'puede olvidarse', 1720, y + 197, { s: 30, w: 800, al: 'right', col, a: seg(t, ts + 4.5, ts + 5) });
    });
  }
});

/* ---------- 4.3 Hooks en Codex ---------- */
const EVT = [['PreToolUse', 'Antes de ejecutar un comando', 'git push a main → bloqueado', true], ['PostToolUse', 'Después de editar un archivo', 'correr el formateador', false], ['Stop', 'Cuando el agente termina', 'correr lint y tests y reportar', false]];
S.push({
  label: 'Hooks en Codex', dur: 48, section: '4.3 · Hooks en Codex',
  cap: [[.5, 6.5, 'Codex tiene hooks. Se activan en el config.toml y se definen en un hooks.json, global o dentro del repo, en .codex/.'],
        [7, 14, 'Cada hook se engancha a un evento: antes de usar una herramienta, después de usarla, al terminar la tarea, al iniciar la sesión…'],
        [14.5, 22, 'Y ejecuta un comando tuyo. Por ejemplo, un script que revisa cada comando antes de que Codex lo ejecute.'],
        [22.5, 30, 'Si el script detecta algo prohibido —como un push directo a main—, el hook lo bloquea. El agente no puede saltearlo.'],
        [30.5, 38, 'Otros usos: formatear después de cada edición, o correr lint y tests cuando el agente termina.'],
        [38.5, 47.5, 'Un detalle de seguridad: Codex te pide revisar y aprobar cada hook antes de que corra, y de nuevo si cambia.']],
  draw(t, d, c) {
    alpha(seg(t, .5, 1.2), () => {
      box(140, 150, 800, 560, { fill: '#0B0E13', shadow: 40 });
      T('pagos-api/.codex/hooks.json', 180, 200, { s: 22, w: 600, mono: true, col: P.dim });
      ['{ "hooks": {', '  "PreToolUse": [{', '    "matcher": "Bash",', '    "hooks": [{', '      "type": "command",', '      "command": "node .codex/politica.js",', '      "statusMessage": "Revisando comando"', '    }]', '  }]', '} }'].forEach((l, i) => {
        const hl = (i === 1 && t > 7 && t < 14) || (i === 5 && t > 14.5 && t < 22);
        T(typed(l, (t - 1.5 - i * .35) / .4), 180, 260 + i * 44, { s: 23, w: 500, mono: true, col: hl ? P.amber : '#D7DBE3' });
      });
      T('config.toml →  [features]  hooks = true', 180, 690, { s: 20, w: 600, mono: true, col: P.muted, a: seg(t, 4, 4.6) });
    });
    EVT.forEach(([ev, n, tx, block], i) => {
      const a = seg(t, 7.3 + i * 1.3, 7.9 + i * 1.3), y = 170 + i * 180;
      box(1000, y, 780, 150, { r: 22, fill: P.panel2, stroke: block && t > 23 ? P.red : P.line2, lw: block && t > 23 ? 3 : 2, a });
      T(ev, 1040, y + 50, { s: 22, w: 800, mono: true, col: P.red2, a });
      T(n, 1040, y + 92, { s: 28, w: 700, a });
      const ta = i === 0 ? seg(t, 22.5, 23.1) : seg(t, 30.5 + (i - 1) * 1.5, 31.1 + (i - 1) * 1.5);
      chip((block ? '⛔ ' : '✓ ') + tx, 1040, y + 104, { s: 20, col: block ? P.red2 : P.green2, stroke: null, fill: block ? 'rgba(227,6,19,.16)' : 'rgba(22,163,122,.14)', a: ta });
    });
    // comando bloqueado
    if (t > 22.5 && t < 30.5) {
      const k = seg(t, 22.5, 24, E.in), x = lerp(1100, 1400, k);
      box(x, 760, 320, 64, { r: 14, fill: P.panel3, stroke: t > 24 ? P.red : P.line2 });
      T('git push origin main', x + 160, 802, { s: 22, w: 700, mono: true, al: 'center', col: t > 24 ? P.red2 : P.text });
      if (t > 24) { box(1740, 730, 24, 120, { r: 8, fill: P.red, stroke: null, glow: 'rgba(227,6,19,.8)' }); T('BLOQUEADO', 1560, 890, { s: 24, w: 900, ls: 3, col: P.red2, al: 'center' }); }
    }
    alpha(seg(t, 38.5, 39.2), () => {
      box(140, 760, 800, 110, { r: 20, fill: 'rgba(245,165,36,.1)', stroke: P.amber });
      icon('eye', 200, 815, 36, P.amber, 1, 2);
      TW('Codex te pide revisar y aprobar cada hook antes de que corra.', 250, 806, 660, 32, { s: 26, w: 700 });
    });
  }
});

/* ---------- 4.4 Reglas de comandos ---------- */
S.push(G.seccion('4.4', 'Reglas de comandos', 'Qué puede ejecutar, qué pregunta y qué nunca.'));
S.push({
  label: 'Reglas', dur: 36, section: '4.4 · Reglas',
  cap: [[.5, 6.5, 'Para los comandos hay otra herramienta más simple: las reglas. Archivos .rules en una carpeta rules/ de tu config.'],
        [7, 14, 'Cada regla indica un prefijo de comando y una decisión: permitirlo, pedir aprobación, o prohibirlo.'],
        [14.5, 21, 'Si varias reglas coinciden, gana la más restrictiva. Y con codex execpolicy check probás cómo se aplica.'],
        [21.5, 27.5, 'Ojo: la documentación las marca como experimentales, así que pueden cambiar.'],
        [28, 35.5, 'Hooks y reglas convierten tus prohibiciones en garantías: ya no dependen de lo que el agente recuerde.']],
  draw(t, d, c) {
    alpha(seg(t, .5, 1.2), () => {
      box(140, 150, 960, 600, { fill: '#0B0E13', shadow: 40 });
      T('pagos-api/.codex/rules/default.rules', 180, 200, { s: 22, w: 600, mono: true, col: P.dim });
      const R = [['prefix_rule(pattern = ["npm", "test"],', '  decision = "allow")', P.green2, 7.2], ['prefix_rule(pattern = ["npm", "install"],', '  decision = "prompt")', P.amber, 9], ['prefix_rule(pattern = ["git", "push"],', '  decision = "forbidden",', P.red2, 10.8]];
      R.forEach(([a1, a2, col, ts], i) => {
        const a = seg(t, ts, ts + .6), y = 270 + i * 150;
        T(a1, 180, y, { s: 23, w: 500, mono: true, col: '#D7DBE3', a });
        T(a2, 180, y + 40, { s: 23, w: 500, mono: true, col, a });
        if (i === 2) T('  justification = "Push solo por PR")', 180, y + 80, { s: 23, w: 500, mono: true, col: '#D7DBE3', a });
      });
    });
    [['allow', 'npm test', 'se ejecuta', P.green2], ['prompt', 'npm install', 'te pregunta', P.amber], ['forbidden', 'git push', 'nunca', P.red2]].forEach(([dec, cmd, tx, col], i) => {
      const a = seg(t, 7.5 + i * 1.8, 8.1 + i * 1.8), y = 180 + i * 170;
      box(1160, y, 620, 140, { r: 22, fill: P.panel2, stroke: col, a });
      T(dec, 1200, y + 56, { s: 30, w: 900, mono: true, col, a });
      T(cmd, 1200, y + 104, { s: 24, w: 600, mono: true, col: P.muted, a });
      T(tx, 1740, y + 84, { s: 28, w: 800, al: 'right', a });
    });
    chip('más restrictiva gana: forbidden > prompt > allow', 1160, 700, { s: 20, col: P.text, a: seg(t, 14.5, 15.1) });
    chip('experimental: puede cambiar', 140, 790, { s: 22, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)', a: seg(t, 21.5, 22.1) });
    T('$ codex execpolicy check --rules .codex/rules/default.rules -- git push', 140, 880, { s: 22, w: 500, mono: true, col: P.muted, a: seg(t, 17, 17.6) });
  }
});

/* ---------- 4.5 Tres filtros ---------- */
S.push(G.seccion('4.5', 'Revisión en tres filtros', 'El agente no se aprueba a sí mismo.'));
const FIL = [[430, .55, 'Auto-verificación · tests, lint y build'], [560, .6, 'Revisor separado · /review o @codex review'], [690, .8, 'Revisión humana del diff']];
S.push({
  label: 'Tres filtros', dur: 38, section: '4.5 · Tres filtros',
  cap: [[.5, 6.5, 'Aun con todo esto, algo se puede escapar. Por eso el trabajo pasa por tres filtros antes del merge.'],
        [7, 13.5, 'Primero, la auto-verificación del agente: tests, lint y build dentro de su loop.'],
        [14, 21.5, 'Segundo, un revisor separado, con contexto limpio: /review en Codex, o @codex review en el pull request de GitHub.'],
        [22, 29, 'Y tercero, la revisión humana del diff, antes del merge. Siempre. Es el último filtro, y el que tiene la responsabilidad.'],
        [29.5, 37.5, 'Quien escribió el código no es el mejor revisor. Tampoco cuando es un agente.']],
  draw(t, d, c) {
    box(140, 300, 1100, 580, { fill: P.panel });
    c.save(); c.beginPath(); c.roundRect(140, 300, 1100, 580, 18); c.clip();
    ga(1); c.fillStyle = 'rgba(227,6,19,.1)'; c.fillRect(140, 820, 1100, 60);
    T('MERGE', 170, 858, { s: 20, w: 800, ls: 3, col: P.red2 });
    FIL.forEach(([y, , n], i) => { const a = seg(t, 7 + i * 7, 7.6 + i * 7); ln(170, y, 1210, y, P.green2, 2, .3 + .7 * a, [8, 8]); T(n, 172, y - 12, { s: 20, w: 700, col: P.green2, a: .3 + .7 * a }); });
    let caught = 0, esc = 0;
    for (let j = 0; j < 90; j++) {
      const ts = 7 + j * .3, tt = t - ts;
      if (tt < 0) break;
      const x = 200 + rnd(j + 7) * 1000, v = 150 + rnd(j + 50) * 80, y = 310 + v * tt;
      let gone = false;
      for (let k = 0; k < 3; k++) {
        const act = t > 7 + k * 7, tk = (FIL[k][0] - 310) / v;
        if (tt >= tk) {
          if (act && rnd(j * 7 + k * 13 + 1) < FIL[k][1]) {
            caught++; gone = true; const bt = tt - tk;
            if (bt < .5) { c.save(); ga(1 - bt / .5); c.strokeStyle = P.green2; c.lineWidth = 3; c.beginPath(); c.arc(x, FIL[k][0], 6 + bt * 50, 0, 7); c.stroke(); c.restore(); }
            break;
          }
        } else break;
      }
      if (gone) continue;
      if (y > 840) { esc++; continue; }
      glowAt(x, y, 18, '227,6,19', .7); dot(x, y, 6, P.red2);
    }
    c.restore();
    T('bugs que llegan al merge', 1480, 400, { s: 26, w: 700, al: 'center', col: P.muted });
    T(String(esc), 1480, 520, { s: 110, w: 900, al: 'center', col: P.red2 });
    T(`${caught} atrapados`, 1480, 600, { s: 30, w: 800, al: 'center', col: P.green2 });
    [['terminal', '/review', 'en la sesión de Codex'], ['merge', '@codex review', 'en el PR de GitHub']].forEach(([ic, cmd, tx], i) => {
      const a = seg(t, 14.5 + i * .8, 15.1 + i * .8), y = 680 + i * 110;
      box(1300, y, 480, 90, { r: 18, fill: P.panel2, stroke: P.line2, a });
      T(cmd, 1330, y + 42, { s: 26, w: 800, mono: true, a });
      T(tx, 1330, y + 74, { s: 20, w: 500, col: P.muted, a });
    });
    T('Quien escribió el código no es el mejor revisor.', 960, 230, { s: 40, w: 900, al: 'center', a: seg(t, 29.5, 30.2) });
  }
});

/* ---------- Paso 3 ---------- */
S.push({
  label: 'Probalo vos', dur: 34, section: '4.6 · Paso 3',
  cap: [[.5, 6, 'Tu turno. Este es el Paso 3 del recorrido: que el agente pueda correr tests y build en tu repo.'],
        [6.5, 14, 'Sumá los comandos de test, lint y build a tu AGENTS.md. Si no hay tests, pedile a Codex que cree algunos básicos.'],
        [14.5, 22, 'En la próxima tarea, pedile que corra los chequeos y te muestre el resultado antes de decir "listo".'],
        [22.5, 33.5, 'Y elegí una regla que nunca se tenga que romper en tu proyecto: convertila en un hook o en una regla de comandos.']],
  draw(t, d, c) {
    T('Paso 3 · Que se verifique solo', 160, 230, { s: 60, w: 900 });
    chip('45 minutos · en tu repo', 1180, 188, { s: 22, col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)' });
    [['Comandos al AGENTS.md', 'Test, lint y build. Si no hay tests, que Codex cree algunos básicos.'],
     ['Pedile evidencia', '"Corré los chequeos y mostrame el resultado" antes de decir listo.'],
     ['Una garantía', 'La regla que nunca se rompe, como hook o como regla de comandos.']].forEach(([n, txt], i) => {
      const a = seg(t, 1 + i * .8, 1.7 + i * .8), x = 160 + i * 540;
      box(x, 290, 500, 420, { fill: P.panel2, stroke: P.line2, a });
      dot(x + 60, 360, 34, P.red, a); T(String(i + 1), x + 60, 374, { s: 36, w: 900, al: 'center', a });
      TW(n, x + 40, 460, 430, 40, { s: 34, w: 800, a });
      TW(txt, x + 40, 560, 420, 40, { s: 27, w: 400, col: P.muted, a });
    });
    chip('Módulo 5: capturar el conocimiento del equipo en skills y conectar el agente con tus sistemas', 160, 760, { s: 22, col: P.green2, stroke: 'rgba(22,163,122,.6)', fill: 'rgba(22,163,122,.12)', a: seg(t, 24, 24.6) });
  }
});

/* ---------- Resumen, challenge y cierre ---------- */
S.push(G.resumen([
  'Lo más valioso: una forma de saber si lo hizo bien.',
  'Feedback loop: escribe, verifica, lee el error y corrige.',
  'Lo que nunca puede fallar, en un hook o una regla, no en un prompt.',
  'Hooks y reglas de Codex: bloquean, piden aprobación o ejecutan solos.',
  'Tres filtros: auto-verificación, revisor separado y revisión humana.'
]));
const QV = PREGUNTAS.preguntas.filter(q => q.video);
S.push(G.challengeIntro(QV.length));
QV.forEach((q, i) => S.push(G.pregunta(q, i, QV.length)));
S.push(G.cierre(META));

META.assets = {
  juli: { sprite: 'juli', w: 600, h: 620 }, bit: { sprite: 'bit', w: 600, h: 600 }, walk: { sprite: 'walk', w: 300, h: 420 },
  problema: { scene: 'El problema', at: 14 }, loop: { scene: 'Feedback loop', at: 26 }, necesita: { scene: 'Feedback loop', at: 40 },
  garantia: { scene: 'Sugerencia vs. garantía', at: 26 }, hooks: { scene: 'Hooks en Codex', at: 27 }, hooks2: { scene: 'Hooks en Codex', at: 44 },
  reglas: { scene: 'Reglas', at: 30 }, filtros: { scene: 'Tres filtros', at: 34 }, paso3: { scene: 'Probalo vos', at: 28 }
};
F.run(S, META);
})();
