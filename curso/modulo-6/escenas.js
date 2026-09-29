/* =========================================================
   MÓDULO 6 · Delegar y operar (último módulo del curso)
   Ejemplo conductor: "pagos-api" · reembolsos parciales.
   Datos de Codex verificados en ../CODEX-VERIFICADO.md (29/09/2026).
   El kit que se presenta es ../../../kit-Codex (TSOFT AI Dev Kit).
   ========================================================= */
(() => {
const { W, H, P, E, clamp, lerp, seg, typed, ga, alpha, T, measure, wrapLines, TW, box, ln, dot, glowAt, icon,
        juli, juliWalk, bit, stamp, network, terminal, chip, card, rnd, G } = F;

const META = {
  n: 6,
  titulo: 'Delegar y operar',
  bajada: 'Subagentes, CI, costos y el TSOFT AI Dev Kit: delegar sin perder el control.',
  siguiente: 'Tu próxima feature, con el TSOFT AI Dev Kit'
};

const AMB = { col: P.amber, stroke: 'rgba(245,165,36,.5)', fill: 'rgba(245,165,36,.1)' };
const GRN = { col: P.green2, stroke: 'rgba(22,163,122,.6)', fill: 'rgba(22,163,122,.12)' };
const RED = { col: P.red2, stroke: P.red, fill: 'rgba(227,6,19,.12)' };

// Los cinco subagentes del kit y su sandbox (kit-Codex/.codex/agents/*.toml)
const ROLES = [['search', 'explorador', 'read-only', 'blue'], ['route', 'planificador', 'read-only', 'purple'],
               ['code', 'desarrollador', 'workspace-write', 'red'], ['book', 'documentador', 'workspace-write', 'amber'],
               ['check', 'qa', 'workspace-write', 'green']];
const RX = i => 140 + i * 335; // 5 cajas de 280 con 55 de separación

const S = [];
S.push(G.portada(META));
S.push(G.objetivos([
  ['layers', 'Subagentes', 'Delegar partes del trabajo, cada una con su contexto.'],
  ['shield', 'Delegar con control', 'Mínimo privilegio y un humano entre paso y paso.'],
  ['gear', 'Operar', 'CI, trazabilidad, costos, evals y plugins.'],
  ['box', 'El TSOFT AI Dev Kit', 'Todo el curso, junto, listo para usar.']
], 'Al final hay un ejercicio de "¿qué está mal?", un challenge y el Paso 5: el kit completo en una feature real.',
   'Último módulo: cómo pasar de un agente que te ayuda a un equipo de agentes que trabaja con vos.'));

/* ---------- El problema ---------- */
const PILA = ['Explorá el repo', 'Planificá los reembolsos', 'Implementá el plan', 'Documentá la feature', 'Escribí y corré los tests'];
S.push({
  label: 'El problema', dur: 24, section: 'El problema',
  cap: [[.6, 6.2, 'Juli le pide a una sola sesión de Codex toda la feature: explorar, planificar, implementar, documentar y testear.'],
        [6.7, 12.5, 'El contexto se llena de todo: archivos leídos, planes, errores, tests. Y la sesión empieza a perder el foco.'],
        [13, 18.5, 'Se olvida de una decisión del plan. Mezcla la documentación con el código. Y Juli ya no sabe bien qué aprobó.'],
        [19, 23.5, 'Un solo agente haciendo todo no escala. Hay que delegar, sin perder el control.']],
  draw(t, d, c) {
    box(140, 150, 900, 620, { fill: P.panel, stroke: P.line2, a: seg(t, .4, 1) });
    T('UNA SOLA SESIÓN', 180, 205, { s: 20, w: 800, ls: 4, col: P.red2, a: seg(t, .4, 1) });
    PILA.forEach((p, i) => {
      const a = seg(t, 1 + i * .7, 1.5 + i * .7), y = 240 + i * 96;
      box(180, y, 820, 76, { r: 16, fill: P.panel2, stroke: P.line2, a });
      T((i + 1) + '. ' + p, 210, y + 48, { s: 26, w: 700, a });
    });
    // basura de contexto que se acumula
    for (let j = 0; j < 40; j++) {
      const ts = 7 + j * .25; if (t < ts) break;
      const x = 190 + rnd(j + 3) * 780, y = 250 + rnd(j + 40) * 480;
      T(['src/refunds/…', 'Expected 400', 'plan v2', 'npm test', 'schema.ts', 'README', '✗ 3 tests'][j % 7], x, y, { s: 18, w: 500, mono: true, col: 'rgba(255,107,115,.55)', a: seg(t, ts, ts + .4) * .35 });
    }
    // medidor de contexto
    const k = clamp(seg(t, 6.7, 16, E.lin) * .96 + .12 * seg(t, 1, 6));
    T('Contexto de la sesión', 1120, 205, { s: 24, w: 700, col: P.muted });
    box(1120, 230, 640, 56, { r: 28, fill: P.panel2, stroke: P.line2 });
    box(1124, 234, Math.max(56, 632 * k), 48, { r: 24, fill: k > .8 ? P.red : k > .55 ? P.amber : P.green, stroke: null });
    T(Math.round(k * 100) + '%', 1760, 330, { s: 40, w: 900, al: 'right', col: k > .8 ? P.red2 : P.text });
    alpha(seg(t, 13, 13.6), () => {
      [['"¿El reembolso valida el saldo?" → ya estaba decidido', 13.3], ['Docs mezcladas con el código', 14.8], ['¿Qué aprobó Juli, y cuándo?', 16.2]].forEach(([tx, ts], i) =>
        chip('✗ ' + tx, 1120, 390 + i * 80, { s: 20, ...RED, a: seg(t, ts, ts + .5) }));
    });
    juli(1640, 900, .5, { t, mood: t > 12 ? 'stress' : 'calm', look: -.6 });
    chip('Delegar, sin perder el control', 960, 810, { s: 28, al: 'center', ...GRN, a: seg(t, 19.2, 19.8) });
  }
});

/* ---------- 6.1 Subagentes ---------- */
S.push(G.seccion('6.1', 'Subagentes', 'Delegar una parte, con su propio contexto.'));
const TOML = ['name = "explorador"', 'description = "Lee el repo y arma el scope. Solo lectura."', 'sandbox_mode = "read-only"',
              'model_reasoning_effort = "medium"', 'developer_instructions = """', 'Explorá sin modificar nada. Citá archivos.', 'Las dudas van como preguntas cerradas.', '"""'];
S.push({
  label: 'Subagentes', dur: 46, section: '6.1 · Subagentes',
  cap: [[.5, 6.5, 'Un subagente es un agente al que la sesión principal le delega una parte del trabajo.'],
        [7, 13.5, 'Trabaja en su propio hilo, con sus instrucciones y sus permisos, y devuelve el resultado. La sesión principal no se llena de detalles.'],
        [14, 21, 'En Codex se definen en .codex/agents, un archivo TOML por agente: nombre, descripción e instrucciones.'],
        [21.5, 28.5, 'Y cualquier ajuste propio: el modelo, el esfuerzo de razonamiento o el sandbox. Si no lo definís, hereda el de la sesión.'],
        [29, 37, 'Se piden en lenguaje natural, o desde el AGENTS.md o una skill. Pueden correr en paralelo, y con /agents los seguís.'],
        [37.5, 45.5, 'Una limitación importante: un subagente corre de punta a punta y no puede frenar a preguntarte. Deja las preguntas escritas, y la sesión principal te las hace.']],
  draw(t, d, c) {
    alpha(1 - seg(t, 13.5, 14.2), () => {
      bit(420, 470, 80, { t, mood: 'happy' });
      T('sesión principal', 420, 640, { s: 26, w: 800, al: 'center', a: seg(t, .5, 1.1) });
      [['explorador', 'blue', 250], ['planificador', 'purple', 470], ['qa', 'green', 690]].forEach(([n, col, y], i) => {
        const a = seg(t, 1.5 + i * .6, 2.1 + i * .6);
        ln(520, 470, 1230, y, P.line2, 2, a, [8, 8]);
        if (t > 7) for (let j = 0; j < 2; j++) {
          const k = ((t - 7) * .45 + j / 2 + i * .2) % 1;
          dot(lerp(520, 1230, k), lerp(470, y, k), 6, P.red2, .9);
          dot(lerp(1230, 520, k), lerp(y, 470, k), 6, P.green2, .9);
        }
        bit(1300, y, 44, { t, col, seed: i + 2, a });
        T(n, 1370, y + 10, { s: 28, w: 800, a });
        T('su propio hilo', 1370, y + 44, { s: 20, w: 500, col: P.muted, a: seg(t, 7.5, 8.1) });
      });
      chip('→ tarea', 700, 780, { s: 22, ...RED, a: seg(t, 7.2, 7.8) });
      chip('← resultado', 880, 780, { s: 22, ...GRN, a: seg(t, 7.8, 8.4) });
    });
    alpha(seg(t, 14, 14.7), () => {
      box(140, 150, 900, 520, { fill: '#0B0E13', shadow: 40 });
      T('pagos-api/.codex/agents/explorador.toml', 180, 200, { s: 20, w: 600, mono: true, col: P.dim });
      TOML.forEach((l, i) => {
        const hl = ([0, 1, 4].includes(i) && t > 14.5 && t < 21) || ([2, 3].includes(i) && t > 21.5 && t < 28.5);
        T(typed(l, (t - 14.5 - i * .4) / .5), 180, 260 + i * 50, { s: 21, w: 500, mono: true, col: hl ? P.amber : '#D7DBE3' });
      });
    });
    [['Obligatorio', 'name · description · developer_instructions', 15], ['Opcional', 'model · esfuerzo · sandbox_mode (si no, hereda)', 22],
     ['Cómo se piden', 'En lenguaje natural, o desde AGENTS.md o una skill', 29.3]].forEach(([n, tx, ts], i) => {
      const a = seg(t, ts, ts + .6), y = 160 + i * 170;
      box(1100, y, 680, 140, { r: 22, fill: P.panel2, stroke: P.line2, a });
      T(n, 1140, y + 55, { s: 28, w: 800, col: i === 1 ? P.amber : P.red2, a });
      TW(tx, 1140, y + 98, 610, 28, { s: 21, w: 500, col: P.muted, a });
    });
    chip('en paralelo · /agents para seguirlos', 1100, 655, { s: 20, ...GRN, a: seg(t, 32, 32.6) });
    alpha(seg(t, 37.5, 38.2), () => {
      box(140, 715, 1640, 100, { r: 20, fill: 'rgba(245,165,36,.1)', stroke: P.amber });
      icon('chat', 200, 765, 36, P.amber, 1, 2);
      T('No puede preguntarte en vivo → deja preguntas cerradas y la sesión principal te las hace', 250, 775, { s: 26, w: 700 });
    });
  }
});

/* ---------- 6.2 Delegar con control ---------- */
S.push(G.seccion('6.2', 'Delegar con control', 'Mínimo privilegio y un humano en el loop.'));
S.push({
  label: 'Delegar con control', dur: 40, section: '6.2 · Delegar con control',
  cap: [[.5, 6.5, 'Delegar no es soltar. Cada subagente recibe solo el acceso que necesita.'],
        [7, 13.5, 'El que explora y el que planifica, solo lectura. El que implementa, escritura en el workspace. Acceso total, ninguno.'],
        [14, 21, 'Y entre paso y paso, un humano. Human in the loop: el flujo se detiene y espera tu aprobación antes de seguir.'],
        [21.5, 29, 'La regla que nunca se rompe: nadie toca código sin un plan aprobado.'],
        [29.5, 39, 'El sandbox y las aprobaciones se ajustan por agente. Y lo irreversible, siempre, pasa por vos.']],
  draw(t, d, c) {
    ROLES.forEach(([ic, n, sb, col], i) => {
      const a = seg(t, .8 + i * .4, 1.4 + i * .4), x = RX(i), ro = sb === 'read-only', dev = i === 2 && t > 21.5 && t < 29;
      box(x, 250, 280, 270, { r: 24, fill: P.panel2, stroke: dev ? P.red : P.line2, lw: dev ? 3 : 2, a });
      bit(x + 140, 330, 34, { t, col, seed: i, a, ring: false });
      T(n, x + 140, 420, { s: 26, w: 800, al: 'center', a });
      chip(sb, x + 140, 450, { s: 17, al: 'center', mono: true, ...(ro ? GRN : AMB), a: a * seg(t, 7.2 + (ro ? 0 : 2), 7.8 + (ro ? 0 : 2)) });
      if (i < 4) {
        const g = seg(t, 14.5 + i * .6, 15 + i * .6), gx = x + 307, gate = i === 1 && t > 21.5;
        dot(gx, 385, 25, gate ? P.red : P.amber, g);
        T('✋', gx, 395, { s: 24, w: 700, al: 'center', a: g });
      }
    });
    T('Acceso total, ninguno:', 140, 630, { s: 26, w: 700, col: P.muted, a: seg(t, 11, 11.6) });
    alpha(seg(t, 11.3, 11.9), () => {
      const w = chip('danger-full-access', 440, 598, { s: 22, mono: true, ...RED });
      ln(440, 620, 440 + w, 620, P.red2, 4);
    });
    chip('✋ aprobás antes de seguir', 960, 560, { s: 22, al: 'center', ...AMB, a: seg(t, 15, 15.6) * (1 - seg(t, 21.3, 21.6)) });
    alpha(seg(t, 21.5, 22.2), () => {
      box(140, 680, 1640, 110, { r: 22, fill: 'rgba(227,6,19,.12)', stroke: P.red, lw: 3 });
      icon('lock', 200, 735, 38, P.red2, 1, 2.2);
      T('Nadie toca código sin un plan aprobado.', 250, 748, { s: 36, w: 900 });
    });
    chip('Sandbox y aprobaciones, por agente · lo irreversible pasa por vos', 140, 820, { s: 22, ...GRN, a: seg(t, 29.8, 30.4) });
  }
});

/* ---------- 6.3 Operar: CI y trazabilidad ---------- */
S.push(G.seccion('6.3', 'Operar', 'CI, trazabilidad, costos y evals.'));
const YAML = ['- name: Revisar con Codex', '  uses: openai/codex-action@v1', '  with:', '    openai-api-key: ${{ secrets.OPENAI_API_KEY }}', '    prompt: "Revisá este PR buscando bugs"'];
const JSONL = ['{"type":"thread.started", …}', '{"type":"turn.started"}', '{"type":"item.completed", …}', '{"type":"turn.completed","usage":{…}}'];
const RASTRO = ['orquestador-estado.md', 'explorador-output.md', 'design.md', 'feature-doc.md', 'qa.md'];
S.push({
  label: 'CI y trazabilidad', dur: 40, section: '6.3 · Operar',
  cap: [[.5, 6.5, 'Codex no vive solo en el chat. Con codex exec corre sin interacción: ideal para scripts y para CI.'],
        [7, 14, 'Por ejemplo, le pasás la salida de los tests y le pedís que los arregle. Por defecto corre en solo lectura; para escribir, se lo habilitás.'],
        [14.5, 21.5, 'En GitHub hay una Action oficial. La clave va como secret, y el resultado vuelve como un comentario que un humano revisa.'],
        [22, 30, 'Trazabilidad: Codex guarda las sesiones de forma local, y con codex resume retomás una. Con --json, cada paso queda registrado, con el uso de tokens.'],
        [30.5, 39, 'Y en el kit, cada feature deja su rastro en archivos: el estado del flujo, el plan, qué se aprobó.']],
  draw(t, d, c) {
    terminal(140, 150, 900, 300, 'terminal · pagos-api  (simulación)', [
      [1, '$ codex exec "resumí los cambios de hoy"', P.text],
      [7.5, '$ npm test 2>&1 | codex exec "arreglá los tests"', P.text],
      [10.5, '  # por defecto: --sandbox read-only', P.dim],
      [12, '$ codex exec --sandbox workspace-write "…"', P.amber]
    ], t, { s: 20, lh: 46, a: seg(t, .5, 1) });
    alpha(seg(t, 14.5, 15.2), () => {
      box(1100, 150, 680, 300, { fill: '#0B0E13', shadow: 40 });
      T('.github/workflows/codex.yml', 1140, 200, { s: 18, w: 600, mono: true, col: P.dim });
      YAML.forEach((l, i) => T(typed(l, (t - 15 - i * .4) / .5), 1140, 255 + i * 40, { s: 18, w: 500, mono: true, col: i === 3 && t > 17 ? P.amber : '#D7DBE3' }));
      chip('la clave, como secret', 1140, 470, { s: 18, ...AMB, a: seg(t, 17.5, 18) });
    });
    alpha(seg(t, 22, 22.7), () => {
      box(140, 520, 900, 360, { fill: '#0B0E13', shadow: 40 });
      T('$ codex exec --json "…" > registro.jsonl', 180, 575, { s: 20, w: 500, mono: true });
      JSONL.forEach((l, i) => T(typed(l, (t - 23 - i * .6) / .5), 180, 630 + i * 44, { s: 19, w: 500, mono: true, col: i === 3 ? P.green2 : '#9DB9F5' }));
      T('$ codex resume --last', 180, 840, { s: 20, w: 500, mono: true, col: P.amber, a: seg(t, 26.5, 27) });
    });
    alpha(seg(t, 30.5, 31.2), () => {
      box(1100, 540, 680, 340, { fill: P.panel2, stroke: P.line2 });
      T('tsoft-dev/reembolsos-parciales/', 1140, 595, { s: 20, w: 600, mono: true, col: P.red2 });
      RASTRO.forEach((f, i) => T('├─ ' + f, 1140, 645 + i * 44, { s: 20, w: 500, mono: true, a: seg(t, 31 + i * .4, 31.4 + i * .4) }));
    });
  }
});

/* ---------- 6.3 Operar: costos y evals ---------- */
const EFF = [['explorador', 1], ['planificador', 3], ['desarrollador', 2], ['documentador', 1], ['qa', 2]];
const EVAL = [['"Creá el endpoint de reembolsos"', 'usa la skill', true], ['"Agregá GET /refunds/:id"', 'usa la skill', true],
              ['"Escribí la migración de saldos"', 'no la usa', true], ['"Documentá el módulo de pagos"', 'no la usa', false]];
S.push({
  label: 'Costos y evals', dur: 40, section: '6.3 · Operar',
  cap: [[.5, 6.5, 'Cada token cuesta. Primera regla: el modelo y el esfuerzo según la tarea. Explorar no necesita lo mismo que diseñar.'],
        [7, 14, 'La doc de Codex suma más: un AGENTS.md corto, pocos servidores MCP, prompts y material acotados. Con /status ves el uso.'],
        [14.5, 21.5, '¿Y cómo sabés si una skill o un agente sigue funcionando bien después de cambiarlo? Con evals.'],
        [22, 30, 'Un eval es un conjunto de casos con resultado esperado. Diez o veinte pedidos, incluidos los que no deberían activar la skill.'],
        [30.5, 39, 'Los corrés con codex exec, comparás contra lo esperado, y cada falla se convierte en un caso más. Como los tests, pero para el agente.']],
  draw(t, d, c) {
    alpha(1 - seg(t, 14, 14.6), () => {
      T('Esfuerzo según la tarea (ejemplo)', 140, 200, { s: 26, w: 700, col: P.muted });
      EFF.forEach(([n, k], i) => {
        const a = seg(t, 1 + i * .4, 1.5 + i * .4), y = 240 + i * 100;
        T(n, 140, y + 50, { s: 26, w: 700, a });
        for (let j = 0; j < 3; j++) box(420 + j * 150, y + 18, 130, 44, { r: 10, fill: j < k ? (k === 3 ? P.red : k === 2 ? P.amber : P.green) : P.panel2, stroke: P.line2, a });
      });
      T('bajo · medio · alto', 420, 780, { s: 20, w: 500, col: P.dim });
      T('Consejos de la doc de Codex', 1100, 200, { s: 26, w: 700, col: P.muted, a: seg(t, 7, 7.5) });
      ['AGENTS.md corto', 'Pocos servidores MCP', 'Prompts y material acotados', '/status para ver el uso', '/compact si el contexto se llena'].forEach((it, i) => {
        const a = seg(t, 7.5 + i * .8, 8 + i * .8), y = 240 + i * 100;
        box(1100, y, 680, 80, { r: 16, fill: P.panel2, stroke: 'rgba(22,163,122,.5)', a });
        T('✓  ' + it, 1130, y + 50, { s: 26, w: 700, mono: it[0] === '/', a });
      });
    });
    alpha(seg(t, 14.5, 15.2), () => {
      T('eval · skill nuevo-endpoint', 140, 200, { s: 26, w: 700, col: P.muted });
      [['Pedido', 160], ['Esperado', 1000], ['Resultado', 1500]].forEach(([h, x]) => T(h, x, 260, { s: 20, w: 800, ls: 3, col: P.red2, a: seg(t, 22, 22.6) }));
      EVAL.forEach(([q, e, ok], i) => {
        const a = seg(t, 22.5 + i * 1.2, 23.1 + i * 1.2), y = 285 + i * 105, fix = !ok && t > 32;
        box(140, y, 1640, 90, { r: 16, fill: P.panel2, stroke: !ok && t > 28 ? (fix ? P.green : P.red) : P.line2, a });
        T(q, 160, y + 56, { s: 24, w: 600, a });
        T(e, 1000, y + 56, { s: 24, w: 600, col: i > 1 ? P.amber : P.text, a });
        const ra = seg(t, 26 + i * .5, 26.4 + i * .5);
        T(ok || fix ? '✓' : '✗ la usó', 1500, y + 58, { s: 28, w: 900, col: ok || fix ? P.green2 : P.red2, a: ra });
      });
      T(t > 32 ? '4 / 4' : '3 / 4', 1780, 230, { s: 44, w: 900, al: 'right', col: t > 32 ? P.green2 : P.amber, a: seg(t, 28, 28.5) });
      T('$ codex exec --json "…" | node evaluar.js', 140, 760, { s: 22, w: 500, mono: true, a: seg(t, 30.5, 31) });
      chip('la falla → ajustás la description y queda como caso', 140, 790, { s: 20, ...GRN, a: seg(t, 32, 32.6) });
      T('Fuente: blog oficial de OpenAI Developers, "eval skills"', 1780, 860, { s: 18, w: 500, al: 'right', col: P.dim, a: seg(t, 23, 23.5) });
    });
  }
});

/* ---------- 6.4 Plugins ---------- */
S.push(G.seccion('6.4', 'Plugins', 'Compartir lo que funciona.'));
S.push({
  label: 'Plugins', dur: 26, section: '6.4 · Plugins',
  cap: [[.5, 6.5, 'Cuando algo funciona en tu equipo, querés compartirlo. Para eso están los plugins.'],
        [7, 14, 'Un plugin empaqueta skills, servidores MCP y hooks en algo reutilizable, con un manifiesto: plugin.json.'],
        [14.5, 20.5, 'Con /plugins los instalás. Y un equipo puede tener su propio marketplace dentro del repo.'],
        [21, 25.5, 'La misma regla del Módulo 5: un plugin de terceros se revisa antes de instalarlo.']],
  draw(t, d, c) {
    const cx = 560, cy = 470;
    [['book', 'skills', -260, -170], ['globe', 'servidores MCP', 260, -170], ['bolt', 'hooks', 0, 250]].forEach(([ic, n, dx, dy], i) => {
      const k = seg(t, 7.5 + i * 1, 9 + i * 1, E.inOut), x = cx + dx * (1 - k), y = cy + dy * (1 - k), a = seg(t, 7 + i, 7.4 + i) * (1 - k);
      box(x - 120, y - 40, 240, 80, { r: 18, fill: P.panel2, stroke: P.line2, a });
      icon(ic, x - 80, y, 28, P.red2, a, 2);
      T(n, x - 55, y + 9, { s: 22, w: 700, a });
    });
    const pa = seg(t, .8, 1.5, E.back);
    c.save(); c.translate(cx, cy); c.scale(pa, pa);
    box(-110, -100, 220, 200, { r: 26, fill: 'rgba(227,6,19,.18)', stroke: P.red, lw: 3, glow: t > 10 ? 'rgba(227,6,19,.6)' : null });
    icon('box', 0, -20, 80, P.red2, 1, 2.2);
    T('plugin', 0, 70, { s: 26, w: 800, al: 'center' });
    c.restore();
    alpha(seg(t, 9.5, 10.2), () => {
      box(1060, 170, 720, 360, { fill: '#0B0E13', shadow: 40 });
      ['pagos-toolkit/', '├─ plugin.json', '├─ skills/nuevo-endpoint/SKILL.md', '├─ mcp.json', '└─ hooks/hooks.json'].forEach((l, i) =>
        T(typed(l, (t - 10 - i * .5) / .5), 1100, 240 + i * 56, { s: 22, w: 500, mono: true, col: i === 1 ? P.amber : '#D7DBE3' }));
    });
    chip('/plugins · instalar y activar', 1060, 580, { s: 22, mono: false, ...GRN, a: seg(t, 14.8, 15.4) });
    chip('.agents/plugins/marketplace.json · el del equipo', 1060, 650, { s: 22, ...GRN, a: seg(t, 16.5, 17.1) });
    chip('De terceros: se revisa antes de instalar', 1060, 740, { s: 24, ...AMB, a: seg(t, 21.2, 21.8) });
  }
});

/* ---------- 6.5 El TSOFT AI Dev Kit ---------- */
S.push(G.seccion('6.5', 'El TSOFT AI Dev Kit', 'Todo el curso, junto.'));
S.push({
  label: 'El kit', dur: 48, section: '6.5 · El TSOFT AI Dev Kit',
  cap: [[.5, 6.5, 'Todo lo que viste en el curso, junto, es el TSOFT AI Dev Kit: la forma IA first de trabajar, con Juli al mando.'],
        [7, 14, 'Un orquestador —una skill, $orquestador— coordina cinco subagentes: explorador, planificador, desarrollador, documentador y QA.'],
        [14.5, 21.5, 'El material de la feature va en docs/. Cada subagente deja su resultado en tsoft-dev, en la carpeta de la feature.'],
        [22, 29.5, 'Después de cada paso, el orquestador te pregunta: ¿aprobás o ajustás? ¿Seguimos o pausamos? Si pausás, el estado queda guardado.'],
        [30, 38, 'Los subagentes no se invocan entre sí: la profundidad máxima es uno. Y el desarrollador nunca toca código sin plan aprobado.'],
        [38.5, 47.5, 'Los archivos del kit son tuyos, no del cliente: se excluyen en .git/info/exclude, sin tocar el .gitignore. La carpeta docs sí se comparte.']],
  draw(t, d, c) {
    alpha(seg(t, .5, 1.2), () => {
      box(760, 150, 400, 90, { r: 45, fill: 'rgba(227,6,19,.18)', stroke: P.red, lw: 3 });
      T('$orquestador', 960, 207, { s: 32, w: 800, mono: true, al: 'center' });
      juli(300, 250, .32, { t, mood: 'happy', look: .6 });
      T('Juli al mando', 300, 290, { s: 20, w: 700, al: 'center', col: P.muted });
    });
    ROLES.forEach(([ic, n, sb, col], i) => {
      const a = seg(t, 7.5 + i * .5, 8.1 + i * .5), x = RX(i);
      ln(960, 240, x + 140, 330, P.line2, 2, a, [6, 6]);
      box(x, 330, 280, 190, { r: 22, fill: P.panel2, stroke: P.line2, a });
      bit(x + 60, 400, 26, { t, col, seed: i, a, ring: false });
      T(n, x + 100, 410, { s: 24, w: 800, a });
      chip(sb, x + 30, 450, { s: 16, mono: true, ...(sb === 'read-only' ? GRN : AMB), a });
    });
    chip('max_depth = 1 · no se invocan entre sí', 1340, 170, { s: 20, mono: false, ...AMB, a: seg(t, 30.2, 30.8) });
    // docs → tsoft-dev
    alpha(seg(t, 14.5, 15.2) * (1 - seg(t, 21.5, 22)), () => {
      box(140, 580, 560, 280, { fill: P.panel2, stroke: P.line2 });
      T('docs/', 180, 640, { s: 24, w: 700, mono: true, col: P.green2 });
      T('reembolsos-parciales.md', 180, 690, { s: 22, w: 500, mono: true });
      T('se comparte con el equipo', 180, 820, { s: 20, w: 500, col: P.muted });
      ln(720, 720, 800, 720, P.red2, 3); T('→', 790, 730, { s: 30, w: 900, col: P.red2 });
      box(820, 580, 960, 280, { fill: '#0B0E13' });
      T('tsoft-dev/reembolsos-parciales/', 860, 640, { s: 22, w: 600, mono: true, col: P.red2 });
      RASTRO.forEach((f, i) => T('├─ ' + f, 860 + (i > 2 ? 440 : 0), 690 + (i % 3) * 46, { s: 20, w: 500, mono: true, a: seg(t, 16 + i * .5, 16.4 + i * .5) }));
    });
    // Human in the loop
    alpha(seg(t, 22, 22.7) * (1 - seg(t, 38, 38.5)), () => {
      terminal(140, 570, 1000, 310, 'codex · $orquestador reembolsos-parciales  (simulación)', [
        [22.5, '✅ Explorador completado.', P.green2],
        [23.8, '¿Aprobás este output?   A. Aprobado   B. Ajustes', P.text],
        [25.3, '¿Continuamos?   1. Seguir   2. Pausar   3. Saltar', P.text],
        [27, '› A · 2   (estado guardado en orquestador-estado.md)', P.amber]
      ], t, { s: 20, lh: 50 });
      box(1200, 570, 580, 310, { r: 22, fill: 'rgba(227,6,19,.12)', stroke: P.red, a: seg(t, 34, 34.6) });
      icon('lock', 1260, 640, 38, P.red2, seg(t, 34, 34.6), 2.2);
      TW('El desarrollador nunca toca código sin plan aprobado.', 1240, 720, 500, 44, { s: 32, w: 800, a: seg(t, 34, 34.6) });
    });
    alpha(seg(t, 38.5, 39.2), () => {
      terminal(140, 570, 1100, 310, 'terminal · pagos-api', [
        [39, '$ echo ".codex/" >> .git/info/exclude', P.text],
        [40, '$ echo "AGENTS.md" >> .git/info/exclude', P.text],
        [41, '$ echo "tsoft-dev/" >> .git/info/exclude', P.text],
        [42.5, '# docs/ no se excluye: es del equipo', P.green2]
      ], t, { s: 21, lh: 50 });
      chip('sin tocar el .gitignore del cliente', 1300, 700, { s: 22, ...AMB, a: seg(t, 41.5, 42) });
    });
  }
});

/* ---------- 6.6 ¿Qué está mal? ---------- */
S.push(G.seccion('6.6', '¿Qué está mal?', 'Ejercicio final.'));
const MAL = [['.codex/agents/desarrollador.toml', ['name = "desarrollador"', 'description = "Implementa el plan aprobado."', 'sandbox_mode = "danger-full-access"', 'approval_policy = "never"', 'developer_instructions = """Implementá…"""'], 150],
             ['AGENTS.md', ['## Comandos', 'npm test · npm run build', '## Deploy', 'DEPLOY_TOKEN = "prod-8f3a91c7…"'], 560]];
const ERR = [[0, 2, 15.5, 'Acceso total', '→ workspace-write alcanza'], [0, 3, 23, 'Sin aprobaciones', '→ on-request: lo irreversible pasa por vos'],
             [1, 3, 30.5, 'Un secreto en el AGENTS.md', '→ variable de entorno o gestor de secretos']];
S.push({
  label: 'Qué está mal', dur: 44, section: '6.6 · ¿Qué está mal?',
  cap: [[.5, 6.5, 'Ejercicio final. Esta configuración tiene tres errores graves. Pausá el video y buscalos.'],
        [7, 15, 'Pensalo con lo que viste en el curso: permisos, humanos y secretos.'],
        [15.5, 22.5, 'Uno: el desarrollador tiene acceso total, danger-full-access. Con workspace-write alcanza.'],
        [23, 30, 'Dos: las aprobaciones están apagadas, en never. Nadie revisa antes de lo irreversible.'],
        [30.5, 37.5, 'Tres: un token de producción escrito en el AGENTS.md, un archivo que el agente lee siempre.'],
        [38, 43.5, 'Mínimo privilegio, un humano en el loop y nunca secretos al alcance. Eso es delegar con control.']],
  draw(t, d, c) {
    MAL.forEach(([f, lines, y0], k) => {
      const h = k ? 320 : 380;
      box(140, y0, 900, h, { fill: '#0B0E13', shadow: 40, a: seg(t, .5 + k * .5, 1.1 + k * .5) });
      T(f, 180, y0 + 50, { s: 20, w: 600, mono: true, col: P.dim, a: seg(t, .5 + k * .5, 1.1 + k * .5) });
      lines.forEach((l, i) => {
        const e = ERR.find(r => r[0] === k && r[1] === i), on = e && t > e[2], y = y0 + 110 + i * 54;
        if (on) box(160, y - 36, 860, 50, { r: 10, fill: 'rgba(227,6,19,.16)', stroke: P.red, a: seg(t, e[2], e[2] + .5) });
        T(l, 180, y, { s: 21, w: 500, mono: true, col: on ? P.red2 : '#D7DBE3', a: seg(t, 1 + k * .5 + i * .2, 1.5 + k * .5 + i * .2) });
      });
    });
    alpha(seg(t, 1, 1.6) * (1 - seg(t, 15, 15.5)), () => {
      box(1100, 250, 680, 360, { r: 26, fill: P.panel2, stroke: P.amber });
      T('⏸', 1440, 400, { s: 110, w: 900, al: 'center', col: P.amber });
      T('Pausá y buscá', 1440, 480, { s: 40, w: 900, al: 'center' });
      T('3 errores graves', 1440, 530, { s: 26, w: 600, al: 'center', col: P.muted });
      ['permisos', 'humanos', 'secretos'].forEach((p, i) => chip(p, 1230 + i * 150, 690, { s: 20, al: 'center', ...AMB, a: seg(t, 7.5 + i * .6, 8 + i * .6) }));
    });
    ERR.forEach(([, , ts, n, fix], i) => {
      const a = seg(t, ts, ts + .6), y = 160 + i * 190;
      box(1100, y, 680, 160, { r: 22, fill: P.panel2, stroke: P.red, a });
      dot(1150, y + 55, 24, P.red, a); T(String(i + 1), 1150, y + 64, { s: 26, w: 900, al: 'center', a });
      T(n, 1195, y + 65, { s: 28, w: 800, a });
      T(fix, 1130, y + 120, { s: 22, w: 600, col: P.green2, a: seg(t, ts + 2, ts + 2.6) });
    });
    chip('Mínimo privilegio · humano en el loop · nunca secretos', 1100, 760, { s: 22, ...GRN, a: seg(t, 38.2, 38.8) });
  }
});

/* ---------- Paso 5 ---------- */
S.push({
  label: 'Probalo vos', dur: 34, section: '6.7 · Paso 5',
  cap: [[.5, 6, 'Tu turno, y el último paso del recorrido: el kit completo en una feature real.'],
        [6.5, 13.5, 'Instalá el TSOFT AI Dev Kit en tu repo, y excluí sus archivos con .git/info/exclude.'],
        [14, 21, 'Elegí una feature chica y real. Poné su material en docs/ e invocá $orquestador con el nombre de la feature.'],
        [21.5, 28, 'Recorré todo el flujo, aprobando cada paso. Y anotá qué funcionó y qué ajustarías: eso mejora el kit.'],
        [28.5, 33.5, 'Compartí lo que aprendiste en el canal del AI Adoption Program.']],
  draw(t, d, c) {
    T('Paso 5 · El kit en una feature real', 160, 230, { s: 56, w: 900 });
    chip('1 feature · en tu repo', 1260, 188, { s: 22, ...AMB });
    [['Instalá el kit', 'En tu repo, con sus archivos en .git/info/exclude.'],
     ['Una feature real', 'Material en docs/ y $orquestador <feature>.'],
     ['Todo el flujo', 'Aprobá cada paso y anotá qué ajustarías.']].forEach(([n, txt], i) => {
      const a = seg(t, 1 + i * .8, 1.7 + i * .8), x = 160 + i * 540;
      box(x, 290, 500, 420, { fill: P.panel2, stroke: P.line2, a });
      dot(x + 60, 360, 34, P.red, a); T(String(i + 1), x + 60, 374, { s: 36, w: 900, al: 'center', a });
      TW(n, x + 40, 460, 430, 40, { s: 34, w: 800, a });
      TW(txt, x + 40, 560, 420, 40, { s: 27, w: 400, col: P.muted, a });
    });
    chip('Compartí lo aprendido en el canal del AI Adoption Program', 160, 760, { s: 22, ...GRN, a: seg(t, 28.7, 29.3) });
  }
});

/* ---------- Resumen, challenge y cierre del curso ---------- */
S.push(G.resumen([
  'Subagentes: cada parte del trabajo, con su contexto y sus permisos.',
  'Mínimo privilegio y un humano entre paso y paso.',
  'codex exec y la Action oficial llevan Codex a CI, con trazas.',
  'Modelo y esfuerzo según la tarea; evals para no retroceder.',
  'El TSOFT AI Dev Kit: todo el curso, junto, listo para usar.'
]));
const QV = PREGUNTAS.preguntas.filter(q => q.video);
S.push(G.challengeIntro(QV.length));
QV.forEach((q, i) => S.push(G.pregunta(q, i, QV.length)));

const MODS = ['0 · Cómo piensa la IA', '1 · Del chat al agente', '2 · Darle contexto', '3 · Especificar', '4 · Que se verifique solo', '5 · Capturar y conectar', '6 · Delegar y operar'];
S.push({
  label: 'Cierre', dur: 18, section: '',
  cap: [[.6, 6.2, '¡Terminaste el curso! Pasaste de usar la IA en el chat a trabajar con agentes, con Juli al mando.'],
        [6.7, 12, 'Hacé el quiz del módulo, y llevá el TSOFT AI Dev Kit a tu próxima feature.'],
        [12.5, 17, 'Dudas y consultas: el canal del AI Adoption Program. TSOFT, make it real.']],
  draw(t, d, c) {
    network(t, 1, 960, 500, 900, 420, 56, 11, .45 * seg(t, 0, 1));
    const k = seg(t, .2, .9, E.back);
    c.save(); c.translate(960, 200); c.scale(k, k);
    dot(0, 0, 80, P.green); icon('check', 0, 0, 90, '#fff', 1, 3); c.restore();
    T('Curso completo', 960, 370, { s: 84, w: 900, al: 'center', a: seg(t, .6, 1.3) });
    T('Desarrollo potenciado por IA con Codex', 960, 425, { s: 30, w: 500, al: 'center', col: P.muted, a: seg(t, 1, 1.6) });
    MODS.forEach((m, i) => {
      const a = seg(t, 1.8 + i * .3, 2.2 + i * .3), row = i < 4 ? 0 : 1, n = row ? 3 : 4, j = row ? i - 4 : i;
      const w = measure('✓ ' + m, 22, 700) + 44, gap = 20, tot = row ? 1180 : 1500;
      chip('✓ ' + m, 960 - tot / 2 + j * (tot / n) + (tot / n) / 2, 465 + row * 62, { s: 22, al: 'center', ...GRN, a });
    });
    chip('Siguiente paso: el quiz del módulo', 960, 600, { s: 26, al: 'center', ...AMB, a: seg(t, 4, 4.6) });
    T('TSOFT — MAKE IT REAL', 960, 690, { s: 30, w: 900, ls: 6, al: 'center', col: P.red2, a: seg(t, 12.5, 13.1) });
    const wx = lerp(-100, 2020, seg(t, 3, 16.5, E.lin));
    juliWalk(wx, 900, 1, t, true);
    bit(wx - 110, 800 + Math.sin(t * 3) * 8, 26, { t, mood: 'happy', ring: false });
    const end = seg(t, 16.8, 18, E.lin);
    if (end > 0) { ga(end); c.fillStyle = '#000'; c.fillRect(0, 0, W, H); }
  }
});

META.assets = {
  juli: { sprite: 'juli', w: 600, h: 620 }, bit: { sprite: 'bit', w: 600, h: 600 }, walk: { sprite: 'walk', w: 300, h: 420 },
  problema: { scene: 'El problema', at: 21 }, subagentes: { scene: 'Subagentes', at: 11 }, toml: { scene: 'Subagentes', at: 44 },
  control: { scene: 'Delegar con control', at: 33 }, ci: { scene: 'CI y trazabilidad', at: 37 }, costos: { scene: 'Costos y evals', at: 13 },
  evals: { scene: 'Costos y evals', at: 37 }, plugins: { scene: 'Plugins', at: 24 }, kit: { scene: 'El kit', at: 36 },
  exclude: { scene: 'El kit', at: 46 }, mal: { scene: 'Qué está mal', at: 42 }, paso5: { scene: 'Probalo vos', at: 30 }
};
F.run(S, META);
})();
