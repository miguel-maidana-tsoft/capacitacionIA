// Preguntas del Módulo 1. Las usa el challenge del video (video: true), el quiz interactivo y el pptx.
(function (root) {
  root.PREGUNTAS = {
    modulo: 1,
    titulo: 'Del chat al agente',
    preguntas: [
      {
        q: 'Cuando usás la IA en un chat, ¿quién hace el loop de probar, ver el error y corregir?',
        opts: ['El modelo, automáticamente', 'Vos: copiás, probás y volvés con el error', 'Nadie: el chat no se equivoca'],
        ok: 1, video: true,
        exp: 'En un chat vos sos el loop. En un agente, el loop (razonar, actuar, observar) lo hace él y vos definís el objetivo, los límites y cómo se verifica.'
      },
      {
        q: '¿Qué es el tool use?',
        opts: ['El mecanismo por el que el modelo pide ejecutar una herramienta: leer un archivo, editar, correr un comando', 'Instalar herramientas de desarrollo en tu computadora', 'Un plugin del IDE que autocompleta código'],
        ok: 0,
        exp: 'El modelo por sí solo solo genera texto. Con tool use pide una acción, el harness la ejecuta y le devuelve el resultado: así pasa de hablar a hacer.'
      },
      {
        q: 'Usás el mismo modelo en dos herramientas distintas y los resultados son muy diferentes. ¿Por qué?',
        opts: ['Porque el modelo se equivoca al azar', 'Porque una de las dos usa una versión trucha del modelo', 'Porque cambia el harness: las herramientas, el contexto y los permisos que rodean al modelo'],
        ok: 2, video: true,
        exp: 'Modelo + harness = agente. Mismo modelo, distinto harness, distintos resultados: configurar bien el harness es la mitad del trabajo.'
      },
      {
        q: '¿Dónde conviene usar el modelo más capaz, con esfuerzo alto?',
        opts: ['Para resumir y dar formato a la documentación', 'Para entender una spec ambigua y diseñar el plan', 'En todas las tareas por igual, siempre'],
        ok: 1, video: true,
        exp: 'Poné el modelo más capaz donde el error es más caro. Un error al entender la spec o al planificar se arrastra a todo lo que sigue.'
      },
      {
        q: 'Cuando trabajás con un agente, tu rol pasa a ser…',
        opts: ['Definir el objetivo, los límites y cómo se verifica el resultado', 'Copiar y pegar más rápido', 'Escribir cada línea de código a mano y que el agente solo mire'],
        ok: 0, video: true,
        exp: 'Dejás de ejecutar cada paso. Tu trabajo es dar un objetivo claro, poner límites y darle al agente una forma de saber si lo hizo bien.'
      },
      {
        q: 'El agente termina una tarea y te dice "listo". ¿Qué hacés primero?',
        opts: ['Commit y push directo', 'Le pido que lo vuelva a hacer, por las dudas', 'Reviso el diff y confirmo que los tests pasen'],
        ok: 2, video: true,
        exp: 'El agente puede equivocarse con total seguridad. Revisar el diff y ver los tests en verde es tu parte del trabajo: nada entra sin que lo mires.'
      },
      {
        q: '¿Qué parte del harness define qué puede hacer el agente sin pedirte permiso?',
        opts: ['La gestión de contexto', 'Los permisos y el sandbox', 'El modelo que elegiste'],
        ok: 1,
        exp: 'Los permisos y el sandbox marcan los límites: si puede leer, editar o ejecutar comandos solo, y dónde. Más permiso, más velocidad, pero también más riesgo.'
      },
      {
        q: '¿Por qué un error al entender la spec es tan caro?',
        opts: ['Porque se arrastra y crece en el plan, el código y los tests', 'Porque la spec siempre la interpreta el modelo más chico', 'No es caro: se corrige al final sin problema'],
        ok: 0,
        exp: 'Es el efecto bola de nieve: lo que se entiende mal al principio se construye encima. Por eso ahí va el modelo más capaz, y por eso vas a aprender a especificar en el Módulo 3.'
      }
    ]
  };
})(typeof module !== 'undefined' ? module.exports : window);
