# capacitacionIA

Experiencia web narrativa del **TSOFT AI Adoption Program 2026 · Desarrollo**:
los conceptos para construir tu propio ecosistema agéntico de desarrollo, contados
como una historia visual e interactiva que avanza con el scroll.

## Cómo verla

Abrí `index.html` en Chrome o Edge. No necesita servidor ni instalación: es HTML,
CSS y JavaScript sin dependencias (las fuentes vienen de Google Fonts; sin internet
usa las del sistema).

## Recorrido

Punto de partida → Cómo piensa un LLM → El agente → Contexto → Especificar →
Skills → Conectar → Delegar → Verificar → Medir y operar → El kit → Próximo nivel.

Incluye demos interactivas (comparador hoy/destino, próximo token, ventana de
contexto, juego "¿AGENTS.md, skill o hook?", rayos X de prompt injection, slider de
checkpoints, simulador) y un glosario con los 22 conceptos.

> Algunos datos y ejemplos de las demos (porcentajes, código, ticket, simulador)
> son ilustrativos.

## Video: "De lunes a martes"

En `video/` está la versión en formato corto animado (~3 minutos, 1920×1080): la
historia de Juli, una dev, y Bit, su agente, que recorre los mismos conceptos como
un relato y no como slides.

- **Verlo en el navegador:** abrí `video/index.html` (espacio = play/pausa,
  flechas = ±5 s, F = pantalla completa).
- **Generar el MP4:** con Node 22+, Chrome o Edge y ffmpeg instalados:

  ```
  cd video
  node exportar-mp4.mjs                    # → de-lunes-a-martes.mp4 (30 fps)
  node exportar-mp4.mjs --fps 60           # más fluido, tarda el doble
  node exportar-mp4.mjs --from 40 --to 60  # solo un tramo, para revisar
  ```

  El script dibuja el video cuadro por cuadro (no graba la pantalla), así que el
  resultado es siempre idéntico y sin saltos. El video no tiene audio: se le puede
  sumar música o locución en cualquier editor.
