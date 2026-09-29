// Preguntas del Módulo 6. Las usa el challenge del video (video: true), el quiz interactivo y el pptx.
(function (root) {
  root.PREGUNTAS = {
    modulo: 6,
    titulo: 'Delegar y operar',
    preguntas: [
      {
        q: '¿Para qué sirve un subagente?',
        opts: ['Para que el agente trabaje más rápido escribiendo menos', 'Para delegar una parte del trabajo en un agente con su propio contexto, instrucciones y permisos', 'Para no tener que revisar el resultado'],
        ok: 1, video: true,
        exp: 'Cada subagente trabaja con contexto limpio y devuelve un resultado. La sesión principal no se llena de detalles y cada rol tiene solo lo que necesita.'
      },
      {
        q: 'El subagente que explora el repo y arma el scope, ¿qué acceso debería tener?',
        opts: ['Solo lectura', 'Escritura en todo el workspace', 'Acceso total, sin sandbox'],
        ok: 0, video: true,
        exp: 'Mínimo privilegio: si su trabajo es leer, que solo pueda leer. Escribir queda para quien implementa, y con el plan aprobado.'
      },
      {
        q: 'En el TSOFT AI Dev Kit, ¿cuándo toca código el desarrollador?',
        opts: ['Apenas el explorador termina', 'Cuando el QA lo pide', 'Nunca sin que vos hayas aprobado el plan explícitamente'],
        ok: 2, video: true,
        exp: 'Es la regla que nunca se rompe del kit: Human in the Loop. El orquestador pausa después de cada paso y espera tu aprobación.'
      },
      {
        q: 'Un subagente encuentra una ambigüedad en la spec. ¿Qué hace?',
        opts: ['La resuelve con su mejor supuesto', 'La deja escrita como pregunta cerrada, y la sesión principal te la hace a vos', 'Frena todo el flujo y borra lo hecho'],
        ok: 1,
        exp: 'Un subagente corre de punta a punta y no puede preguntarte en vivo. Deja las preguntas redactadas y el orquestador te las lleva al chat.'
      },
      {
        q: '¿Qué es un eval?',
        opts: ['Un conjunto de casos con resultado esperado para comprobar que un prompt, skill o agente sigue funcionando bien', 'Una opinión del agente sobre su propio trabajo', 'Un comando para ver cuántos tokens usaste'],
        ok: 0, video: true,
        exp: 'Como los tests, pero para el comportamiento del agente: si cambiás una skill o un prompt, los evals te dicen si mejoró o empeoró.'
      },
      {
        q: '¿Cómo se usa Codex en un pipeline de CI?',
        opts: ['No se puede: solo funciona en el chat', 'Con codex exec, en modo no interactivo y con el sandbox más restrictivo que alcance', 'Con acceso total para que no se trabe'],
        ok: 1,
        exp: 'En CI no hay nadie para aprobar en vivo: se usa codex exec con permisos acotados, y el resultado vuelve como PR o comentario que un humano revisa.'
      },
      {
        q: '¿Cuál de estas es una buena práctica de costos?',
        opts: ['Usar siempre el modelo más grande para todo', 'Elegir el modelo y el esfuerzo según la tarea, y mantener el contexto limpio', 'No mirar el consumo nunca'],
        ok: 1, video: true,
        exp: 'Explorar o documentar no necesita lo mismo que planificar una arquitectura. Modelo por tarea, contexto chico y /compact cuando hace falta.'
      },
      {
        q: 'Un subagente con acceso total, sin aprobación y con el token de producción en el AGENTS.md. ¿Qué está mal?',
        opts: ['Nada, así es más rápido', 'Solo el token', 'Todo: sin mínimo privilegio, sin humano en el loop y con un secreto al alcance'],
        ok: 2,
        exp: 'Tres fallas de una: permisos de más, nadie aprobando y un secreto en un archivo que el agente lee. Es el ejercicio de "¿qué está mal?".'
      }
    ]
  };
})(typeof module !== 'undefined' ? module.exports : window);
