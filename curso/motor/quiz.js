/* Quiz interactivo del curso. Lee window.PREGUNTAS (definido en preguntas.js de cada módulo). */
(() => {
  const D = window.PREGUNTAS, Q = D.preguntas, el = id => document.getElementById(id);
  const KEY = `tsoft-curso-m${D.modulo}-mejor`;
  let i = 0, score = 0, answered = false, missed = [];
  document.title = `Quiz · Módulo ${D.modulo} · ${D.titulo} · TSOFT`;
  el('titulo').textContent = `Quiz · Módulo ${D.modulo}: ${D.titulo}`;
  el('sub').textContent = `${Q.length} preguntas. Elegí una opción y mirá la explicación antes de seguir.`;

  function show() {
    answered = false;
    el('bar').style.width = (i / Q.length * 100) + '%';
    const q = Q[i];
    el('card').innerHTML = `
      <div class="qn">PREGUNTA ${i + 1} DE ${Q.length}</div>
      <div class="q">${q.q}</div>
      ${q.opts.map((o, k) => `<button class="opt" data-k="${k}"><b>${'ABC'[k]}</b><span>${o}</span></button>`).join('')}
      <div class="fb" id="fb"></div>
      <div class="actions"><button class="btn" id="next" disabled>${i === Q.length - 1 ? 'Ver resultado' : 'Siguiente'}</button></div>`;
    el('card').querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => pick(+b.dataset.k)));
    el('next').addEventListener('click', () => { i++; i < Q.length ? show() : result(); });
  }
  function pick(k) {
    if (answered) return;
    answered = true;
    const q = Q[i], ok = k === q.ok;
    if (ok) score++; else missed.push(q);
    el('card').querySelectorAll('.opt').forEach((b, j) => {
      b.disabled = true;
      if (j === q.ok) b.classList.add('ok');
      else if (j === k) b.classList.add('ko');
      else b.classList.add('dim');
    });
    const fb = el('fb');
    fb.className = 'fb show ' + (ok ? 'good' : 'bad');
    fb.innerHTML = `<strong>${ok ? '¡Correcto!' : 'No es esa.'}</strong>${q.exp}`;
    el('next').disabled = false;
    el('next').focus();
  }
  function result() {
    el('bar').style.width = '100%';
    const best = Math.max(score, +(localStorage.getItem(KEY) || 0));
    try { localStorage.setItem(KEY, best); } catch (e) {}
    const pct = score / Q.length;
    const lvl = pct === 1 ? '¡Perfecto! Dominás el módulo.' : pct >= .75 ? 'Muy bien. Estás listo para el próximo módulo.' : pct >= .5 ? 'Bien, pero conviene repasar algunos puntos.' : 'Volvé a ver el video antes de seguir.';
    el('card').innerHTML = `<div class="result">
      <div class="qn">RESULTADO</div>
      <div class="score">${score}<small> / ${Q.length}</small></div>
      <div class="lvl">${lvl}</div>
      ${missed.length ? `<div class="review"><h3>PARA REPASAR</h3>${missed.map(q => `<div><strong>${q.q}</strong><p>Respuesta: ${q.opts[q.ok]}. ${q.exp}</p></div>`).join('')}</div>` : ''}
      <div class="actions" style="justify-content:center"><button class="btn ghost" id="again">Hacerlo de nuevo</button><a class="btn ghost" href="index.html" style="text-decoration:none">Volver al video</a><a class="btn" href="../index.html" style="text-decoration:none">Ir al curso →</a></div>
      <div class="best">Tu mejor puntaje en este navegador: ${best} / ${Q.length}</div></div>`;
    el('again').addEventListener('click', () => { i = 0; score = 0; missed = []; show(); });
  }
  addEventListener('keydown', e => {
    if (!answered && ['a', 'b', 'c', '1', '2', '3'].includes(e.key.toLowerCase())) pick('abc123'.indexOf(e.key.toLowerCase()) % 3);
    else if (answered && e.key === 'Enter' && el('next')) el('next').click();
  });
  show();
})();
