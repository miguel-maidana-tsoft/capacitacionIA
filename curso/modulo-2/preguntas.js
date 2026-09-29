// Preguntas del Módulo 2. Las usa el challenge del video (video: true), el quiz interactivo y el pptx.
(function (root) {
  root.PREGUNTAS = {
    modulo: 2,
    titulo: 'Darle contexto',
    preguntas: [
      {
        q: 'El agente te devuelve un resultado genérico que no sigue las convenciones del proyecto. ¿Qué te preguntás primero?',
        opts: ['¿Tenía la información que necesitaba para hacerlo bien?', '¿Debería usar otro modelo?', '¿Tengo que escribir el prompt más largo?'],
        ok: 0, video: true,
        exp: 'Con agentes, el context engineering pesa más que el prompt engineering: la mayoría de los malos resultados son falta de contexto, no de modelo.'
      },
      {
        q: '¿Qué es el context engineering?',
        opts: ['Escribir prompts más elaborados', 'Diseñar qué información tiene el agente mientras trabaja: qué, cuándo y cuánto', 'Comprimir los archivos para que entren en la ventana'],
        ok: 1,
        exp: 'El prompt engineering se ocupa de cómo pedir. El context engineering, de qué sabe el agente: qué información, cuándo se carga y cuánta.'
      },
      {
        q: '¿Qué frase le sirve más a un agente dentro de un AGENTS.md?',
        opts: ['"Usamos buenas prácticas y código limpio."', '"Escribí código de calidad."', '"Errores: try/catch + logger.error, nunca console.log."'],
        ok: 2, video: true,
        exp: 'Lo genérico no ayuda: el agente ya "cree" que hace buenas prácticas. Lo que sirve es concreto y verificable: qué usar, dónde y qué nunca hacer.'
      },
      {
        q: 'Corregiste lo mismo dos veces en el chat con el agente. ¿Qué hacés?',
        opts: ['Lo agrego al AGENTS.md', 'Se lo repito cada vez que haga falta', 'Cambio de modelo'],
        ok: 0, video: true,
        exp: 'La regla: si lo corregís dos veces, va al AGENTS.md. Así la próxima sesión arranca sabiéndolo, sin depender de que te acuerdes de decirlo.'
      },
      {
        q: '¿Qué conviene poner en el AGENTS.md?',
        opts: ['Toda la documentación del proyecto, cuanto más mejor', 'Lo que aplica siempre: stack, estructura, convenciones, comandos de build y test, y lo que nunca se hace', 'Las contraseñas y tokens para que el agente pueda trabajar solo'],
        ok: 1, video: true,
        exp: 'El AGENTS.md es corto y general: se carga siempre. El detalle de cada tarea va en skills. Y nunca información sensible: ni tokens, ni contraseñas, ni datos de producción.'
      },
      {
        q: 'Tenés 30 guías del equipo. ¿Cómo evitás llenar la ventana de contexto?',
        opts: ['Las pego todas en el AGENTS.md', 'Con progressive disclosure: el agente ve solo el nombre y la descripción de cada una, y abre la que la tarea necesita', 'Se las paso al agente de a una, a mano, en cada sesión'],
        ok: 1, video: true,
        exp: 'Progressive disclosure: lo general siempre cargado, el índice siempre visible en una línea, y el detalle completo solo cuando hace falta. Es la base de las skills (Módulo 5).'
      },
      {
        q: '¿Qué pasa si le das demasiado contexto al agente?',
        opts: ['Nada: más contexto siempre es mejor', 'Trabaja más rápido', 'Se pierde, tarda más y cuesta más'],
        ok: 2,
        exp: 'Poco contexto da resultados genéricos; demasiado lo vuelve lento, caro y lo hace perder foco. El objetivo es el punto justo.'
      },
      {
        q: 'Trabajás en el repo de un cliente con el kit de TSOFT. ¿Qué hacés con los archivos del kit, como el AGENTS.md?',
        opts: ['Los subo al repo del cliente junto con el código', 'Los excluyo solo de forma local con .git/info/exclude', 'Los agrego al .gitignore del proyecto'],
        ok: 1,
        exp: 'Los archivos del kit son nuestros, no del cliente: se excluyen de manera local con .git/info/exclude, sin tocar el .gitignore del proyecto.'
      }
    ]
  };
})(typeof module !== 'undefined' ? module.exports : window);
