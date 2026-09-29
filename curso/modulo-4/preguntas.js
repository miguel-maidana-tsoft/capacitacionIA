// Preguntas del Módulo 4. Las usa el challenge del video (video: true), el quiz interactivo y el pptx.
(function (root) {
  root.PREGUNTAS = {
    modulo: 4,
    titulo: 'Que se verifique solo',
    preguntas: [
      {
        q: '¿Qué es lo más valioso que le podés dar a un agente?',
        opts: ['Un prompt más largo', 'Una forma de saber si lo hizo bien: tests, lint, build', 'El modelo más caro'],
        ok: 1, video: true,
        exp: 'Un agente que puede verificar su trabajo se corrige solo. Uno que no puede, te entrega el error a vos.'
      },
      {
        q: '¿Cómo es el feedback loop de un agente?',
        opts: ['Escribe código, corre tests/lint/build, lee el error y corrige, hasta que pase', 'Escribe código y espera que vos lo pruebes', 'Corre los tests una sola vez al final del día'],
        ok: 0,
        exp: 'El loop agéntico aplicado a la verificación: escribir, verificar, leer el error y corregir, dentro de la misma tarea.'
      },
      {
        q: '¿Dónde conviene dejar escritos los comandos de test, lint y build?',
        opts: ['En un mensaje del chat, cada vez', 'En el AGENTS.md del proyecto', 'En ningún lado: el agente los adivina'],
        ok: 1, video: true,
        exp: 'En el AGENTS.md: así el agente sabe cómo verificarse en cada sesión, sin que tengas que repetírselo.'
      },
      {
        q: 'Una regla que no se puede romper nunca, como "no ejecutes rm -rf" o "no hagas push a main". ¿Dónde va?',
        opts: ['En el prompt, bien en mayúsculas', 'En el AGENTS.md', 'En un mecanismo determinístico que la haga cumplir siempre, como un hook o una regla de comandos'],
        ok: 2, video: true,
        exp: 'Una instrucción en un prompt o en el AGENTS.md es una sugerencia: se puede olvidar. Lo que nunca se rompe se implementa de forma determinística.'
      },
      {
        q: '¿Por qué el agente que escribió el código no debería ser el único que lo revise?',
        opts: ['Porque tiende a confirmar su propio trabajo: comparte los mismos supuestos', 'Porque los agentes no pueden leer código', 'No hay problema: es el mejor revisor posible'],
        ok: 0, video: true,
        exp: 'Quien escribió el código no es el mejor revisor, tampoco cuando es un agente. Un revisor con contexto limpio encuentra lo que el autor no ve.'
      },
      {
        q: '¿Cuáles son los tres filtros antes del merge?',
        opts: ['Tests, lint y build', 'Auto-verificación del agente, un revisor separado con contexto limpio y la revisión humana del diff', 'Spec, plan y código'],
        ok: 1, video: true,
        exp: 'Cada filtro atrapa lo que se le escapó al anterior. El último, la revisión humana del diff, es el que tiene la responsabilidad.'
      },
      {
        q: 'Tu proyecto no tiene tests. ¿Qué conviene hacer antes de delegar tareas grandes al agente?',
        opts: ['Nada, el agente no los necesita', 'Delegar igual y revisar todo a mano', 'Darle al menos una forma de verificar: tests básicos, tipado estricto o un linter configurado'],
        ok: 2,
        exp: 'Sin verificación, cada error llega hasta vos. Empezar por unos pocos tests o un linter ya le da al agente con qué corregirse.'
      },
      {
        q: 'El agente te dice "listo, todos los tests pasan". ¿Qué hacés?',
        opts: ['Lo mergeo directo', 'Reviso el diff y confirmo que los tests realmente se corrieron y pasan', 'Le pido que lo diga de nuevo'],
        ok: 1,
        exp: 'El tono seguro no es evidencia. Mirá el resultado real de los comandos en la sesión y revisá el diff: es el último filtro.'
      }
    ]
  };
})(typeof module !== 'undefined' ? module.exports : window);
