# Curso · Desarrollo potenciado por IA con Codex

Curso en 7 módulos (0 a 6), estilo Udemy, para devs que ya usan IA en chat. Cada
módulo tiene:

- **Video** (`modulo-N/modulo-N.mp4`, 1920×1080, subtitulado): contenido con ejemplos
  sobre `pagos-api`, el proyecto de Juli, y un **challenge** al final.
- **Presentación** (`modulo-N/modulo-N.pptx`) en el mismo estilo del video, con la
  narración en las notas del orador.
- **Quiz interactivo** (`modulo-N/quiz.html`) con puntaje y explicación de cada respuesta.

La puerta de entrada para compartir es `index.html` (lista de módulos con sus materiales).

## Plan del curso

| Módulo | Tema | El dev termina con… |
|---|---|---|
| 0 | Cómo piensa la IA | Entender por qué "pedir mejor" no alcanza |
| 1 | Del chat al agente | Una primera tarea resuelta con Codex en su repo |
| 2 | Darle contexto | Paso 1: el AGENTS.md de su proyecto |
| 3 | Especificar antes de construir | Paso 2: la spec de su próxima feature |
| 4 | Que se verifique solo | Paso 3: el agente corriendo tests y build |
| 5 | Capturar y conectar | Paso 4: una convención convertida en skill |
| 6 | Delegar y operar | Paso 5: el TSOFT AI Dev Kit en una feature real |

## Estructura

```
curso/
  index.html              portada del curso
  exportar.mjs            video MP4 e imágenes de cada módulo
  motor/                  motor compartido: animación, personajes, challenge, quiz, player
  herramientas/           generador de pptx (pptxgenjs)
  modulo-N/
    escenas.js            guion y animación del video
    preguntas.js          preguntas (las usan el challenge del video, el quiz y el pptx)
    contenido-pptx.cjs    contenido de la presentación
    index.html · quiz.html · modulo-N.mp4 · modulo-N.pptx · img/
```

## Ritmo

Los videos se reproducen a un **ritmo de lectura cómodo** (1,35× más lento que el guion
original, unos 15 caracteres por segundo en los subtítulos). Se cambia con `--ritmo` al
exportar o con `?ritmo=1` en el navegador.

## Versiones del Módulo 0

- `modulo-0-v2.mp4`: versión vigente, ritmo de lectura cómodo.
- `modulo-0.mp4`: primera versión, ritmo original (más rápido).
- `modulo-0-con-voz.mp4` / `modulo-0-con-voz-elena.mp4`: pruebas con narración, ritmo original.

## Regenerar un módulo

Requisitos: Node 22+, Chrome o Edge, ffmpeg.

```
node exportar.mjs --modulo 0 --info      # duración y escenas
node exportar.mjs --modulo 0 --assets    # capturas y personajes para el pptx
node exportar.mjs --modulo 0             # video MP4 (~18 min de render)
node exportar.mjs --modulo 0 --ritmo 1   # ritmo original, más rápido
cd herramientas && npm install && node armar-pptx.cjs 0
```

Si cambiás una pregunta en `preguntas.js`, se actualizan el challenge del video, el quiz
y el pptx (regenerando video y pptx).
