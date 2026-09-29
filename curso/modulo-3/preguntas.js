// Preguntas del Módulo 3. Las usa el challenge del video (video: true), el quiz interactivo y el pptx.
(function (root) {
  root.PREGUNTAS = {
    modulo: 3,
    titulo: 'Especificar antes de construir',
    preguntas: [
      {
        q: 'Un agente ejecuta…',
        opts: ['Lo que le decís, no lo que quisiste decir', 'Lo que quisiste decir, aunque no lo escribas', 'Siempre la solución más segura'],
        ok: 0, video: true,
        exp: 'El agente no adivina la intención: completa los huecos con supuestos. Por eso en SDD la intención se escribe antes, en la spec.'
      },
      {
        q: '¿Qué es Spec-Driven Development?',
        opts: ['Documentar el código cuando ya está terminado', 'Escribir y validar una especificación antes de generar código, y medir todo contra ella', 'Generar el código primero y después los tests'],
        ok: 1,
        exp: 'En SDD la spec es el contrato: spec → plan → código → verificación, y todo se verifica contra la spec.'
      },
      {
        q: '¿Dónde conviene descubrir una ambigüedad?',
        opts: ['En producción, cuando la reporta un usuario', 'En el code review', 'En la spec, antes de escribir código'],
        ok: 2, video: true,
        exp: 'Corregir una spec cuesta minutos. Corregir el código que salió de una spec ambigua cuesta horas.'
      },
      {
        q: '¿Cuál de estas NO es una de las seis piezas de una buena spec?',
        opts: ['Criterios de aceptación verificables', 'El nombre de las variables que se van a usar', 'Lo que queda fuera de scope'],
        ok: 1, video: true,
        exp: 'Las seis piezas: qué se construye, actores, flujo principal, casos borde, fuera de scope y criterios de aceptación. El cómo (nombres, código) va en el plan.'
      },
      {
        q: 'Test rápido para saber si una spec está lista:',
        opts: ['Que tenga más de dos páginas', 'Que la haya escrito alguien senior', 'Que alguien nuevo en el equipo pueda implementarla sin tener que preguntar'],
        ok: 2,
        exp: 'Si un humano nuevo no podría implementarla sin preguntar, el agente tampoco: va a rellenar los huecos con supuestos.'
      },
      {
        q: '¿Cuál es el checkpoint más valioso para una persona en el flujo?',
        opts: ['Aprobar el plan antes de que se escriba una sola línea de código', 'Revisar cada línea mientras el agente escribe', 'Aprobar cada comando que ejecuta el agente'],
        ok: 0, video: true,
        exp: 'Aprobar el plan es barato y evita construir rápido sobre un error. Demasiados checkpoints generan fatiga: se termina aprobando sin leer.'
      },
      {
        q: 'El agente tiene una duda sobre la spec. ¿Qué es lo ideal?',
        opts: ['Que asuma lo más razonable y siga', 'Que la deje escrita como pregunta cerrada para que la responda una persona', 'Que la ignore y lo resuelva en los tests'],
        ok: 1, video: true,
        exp: 'Ambigüedades → preguntas cerradas, nunca supuestos. Es como trabaja el Explorador del TSOFT AI Dev Kit.'
      },
      {
        q: '¿Qué relación hay entre la spec y el trabajo de QA?',
        opts: ['Ninguna: QA prueba lo que el desarrollador entregó', 'Los criterios de aceptación de la spec le dicen a QA exactamente qué validar', 'QA escribe la spec después del desarrollo'],
        ok: 1,
        exp: 'Con criterios de aceptación verificables, QA sabe qué validar y la verificación se hace contra la spec, no contra lo que salió.'
      }
    ]
  };
})(typeof module !== 'undefined' ? module.exports : window);
