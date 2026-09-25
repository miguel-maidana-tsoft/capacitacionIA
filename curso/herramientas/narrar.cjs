// Agrega narración con voz neural (Microsoft, español rioplatense) a un video ya renderizado.
//   node narrar.cjs 0                    -> ../modulo-0/modulo-0-con-voz.mp4
//   node narrar.cjs 0 --voz es-AR-ElenaNeural
// Antes: node ../exportar.mjs --modulo 0 --cues  (genera modulo-0/narracion.json)
// El video original (modulo-N.mp4) no se modifica.
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

const N = process.argv[2];
const vi = process.argv.indexOf('--voz');
const VOZ = vi > 0 ? process.argv[vi + 1] : 'es-AR-TomasNeural';
const DIR = path.join(__dirname, '..', `modulo-${N}`);
const VIDEO = path.join(DIR, `modulo-${N}.mp4`);
// con la voz por defecto: modulo-N-con-voz.mp4; con otra voz: modulo-N-con-voz-<nombre>.mp4
const OUT = path.join(DIR, vi > 0 ? `modulo-${N}-con-voz-${VOZ.split('-')[2].replace('Neural', '').toLowerCase()}.mp4` : `modulo-${N}-con-voz.mp4`);
const { cues } = JSON.parse(fs.readFileSync(path.join(DIR, 'narracion.json'), 'utf8'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'voz-'));

// Cómo se tiene que leer lo que en pantalla está escrito para leer, no para decir
const PRONUNCIA = [
  [/AGENTS\.md/g, 'agents punto em de'], [/pagos-api/g, 'pagos A P I'], [/\bAPI\b/g, 'A P I'],
  [/console\.log/g, 'console punto log'], [/logger\.error/g, 'logger punto error'],
  [/payments\.refundAll\(\)/g, 'payments punto refund all'], [/refundAll/g, 'refund all'],
  [/calcularRecargo/g, 'calcular recargo'], [/validateAmount\(\)/g, 'validate amount'],
  [/\bLLM\b/g, 'ele ele eme'], [/\bMCP\b/g, 'eme ce pe'], [/\bIA\b/g, 'I A'], [/—/g, ', '], [/…/g, '...']
];
const decir = s => PRONUNCIA.reduce((a, [r, x]) => a.replace(r, x), s);
const dur = f => { const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(spawnSync('ffmpeg', ['-i', f], { encoding: 'utf8' }).stderr); return +m[1] * 3600 + +m[2] * 60 + +m[3]; };

(async () => {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOZ, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
  const clips = []; let prevEnd = 0;
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i], d = path.join(TMP, String(i)); fs.mkdirSync(d);
    const { audioFilePath } = await tts.toFile(d, decir(c.text));
    let f = audioFilePath, len = dur(f);
    // tiempo disponible: hasta la próxima frase (o el fin del subtítulo + 1 s)
    const next = cues[i + 1] ? cues[i + 1].t : c.t + len + 1;
    const avail = Math.max(.8, Math.min(next, c.end ? c.end + 1 : next) - c.t - .12);
    let tempo = 1;
    if (len > avail) {
      tempo = Math.min(len / avail, 1.12);
      const g = path.join(d, 'ajustado.mp3');
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', f, '-filter:a', `atempo=${tempo.toFixed(3)}`, g]);
      f = g; len = dur(f);
    }
    // si la frase anterior todavía suena, esta arranca apenas termina aquella
    const t0 = Math.max(c.t, prevEnd + .15); prevEnd = t0 + len;
    const warn = t0 - c.t > .05 ? `  (+${(t0 - c.t).toFixed(1)} s)` : '';
    console.log(`${t0.toFixed(1).padStart(6)} s  ${len.toFixed(1)} s${tempo > 1 ? ` (x${tempo.toFixed(2)})` : ''}${warn}  ${c.text.slice(0, 60)}`);
    clips.push({ f, t: t0 });
  }
  tts.close();
  // mezcla: cada frase en su momento
  const inputs = clips.flatMap(c => ['-i', c.f]);
  const filt = clips.map((c, i) => `[${i + 1}:a]adelay=${Math.round(c.t * 1000)}:all=1[a${i}]`).join(';') +
    ';' + clips.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${clips.length}:normalize=0:dropout_transition=0,loudnorm=I=-16:TP=-1.5:LRA=11[voz]`;
  fs.writeFileSync(path.join(TMP, 'filtro.txt'), filt);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', VIDEO, ...inputs, '-/filter_complex', path.join(TMP, 'filtro.txt'),
    '-map', '0:v', '-map', '[voz]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
  console.log(`\nListo: ${OUT}  (voz: ${VOZ})`);
})().catch(e => { console.error(e); process.exit(1); });
