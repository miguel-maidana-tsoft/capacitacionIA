// Preguntas del Módulo 0. Las usa el challenge del video (video: true), el quiz interactivo y el pptx.
(function (root) {
  root.PREGUNTAS = {
    modulo: 0,
    titulo: 'Cómo piensa la IA',
    preguntas: [
      {
        q: '¿Qué hace un LLM cuando le hacés una pregunta?',
        opts: ['Busca la respuesta en una base de datos', 'Predice, pieza por pieza, el texto más probable', 'Recuerda tu proyecto de conversaciones anteriores'],
        ok: 1, video: true,
        exp: 'Un LLM no consulta ni recuerda: genera token por token lo más probable, con lo que aprendió y lo que le das en el momento.'
      },
      {
        q: 'En una sesión larga, el agente "olvidó" una convención que le explicaste al principio. ¿Qué pasó más probablemente?',
        opts: ['Se llenó la ventana de contexto y, al compactar, se perdió ese detalle', 'El modelo se actualizó en el medio de la sesión', 'La convención estaba mal explicada'],
        ok: 0, video: true,
        exp: 'Lo que no está en la ventana, para el modelo no existe. Lo importante tiene que estar escrito donde siempre se carga (lo vas a ver en el Módulo 2).'
      },
      {
        q: '¿Qué es un token?',
        opts: ['Una clave de acceso a la API', 'Una línea de código', 'La unidad de texto que procesa el modelo, aproximadamente un fragmento de palabra'],
        ok: 2,
        exp: 'El modelo no lee letras ni palabras sino tokens. El costo, la velocidad y el límite de contexto se miden en tokens.'
      },
      {
        q: 'Necesitás que el código SIEMPRE pase el linter antes de entregarse. ¿Qué es lo más confiable?',
        opts: ['Escribir "siempre corré el linter" en el prompt', 'Pedirle al modelo que no se olvide', 'Hacerlo determinístico: un test o un hook que lo corra siempre'],
        ok: 2, video: true,
        exp: 'Regla de oro: si algo tiene que pasar siempre, no se lo pidas al modelo. Una instrucción es una sugerencia; un test o un hook es una garantía.'
      },
      {
        q: 'La IA te propone usar payments.refundAll() con total seguridad. ¿Qué hacés?',
        opts: ['Confío: el tono es seguro', 'Lo verifico contra la fuente real: la documentación o el código, compilando y corriendo tests', 'Le escribo "no inventes" y le pido de nuevo'],
        ok: 1, video: true,
        exp: 'El tono seguro no indica que sea correcto. Las alucinaciones se controlan con fuentes reales y formas de verificar, no pidiendo.'
      },
      {
        q: 'Le hacés el mismo pedido dos veces y recibís dos respuestas distintas. ¿Es un bug?',
        opts: ['No: el modelo es probabilístico y puede variar', 'Sí: el modelo está funcionando mal', 'Solo pasa con los modelos más chicos'],
        ok: 0, video: true,
        exp: 'Variar es parte de cómo funciona un modelo probabilístico. Por eso lo que no puede variar se resuelve con código determinístico.'
      },
      {
        q: '¿Qué pasa con el costo y la velocidad cuando le cargás mucho más contexto al agente?',
        opts: ['No cambian', 'Baja el costo, porque responde mejor', 'Suben los tokens: más caro y más lento'],
        ok: 2,
        exp: 'Más contexto son más tokens. Poco contexto da resultados genéricos; demasiado, lo vuelve lento, caro y lo hace perderse.'
      },
      {
        q: '¿Cuál es la forma más efectiva de controlar las alucinaciones?',
        opts: ['Darle fuentes reales y formas de verificar su trabajo', 'Escribir el prompt en mayúsculas', 'Pedirle que esté completamente seguro antes de responder'],
        ok: 0,
        exp: 'Documentación, código real, MCP, compilar y correr tests, y revisión humana en los puntos críticos.'
      }
    ]
  };
})(typeof module !== 'undefined' ? module.exports : window);
