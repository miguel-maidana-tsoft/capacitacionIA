// Agrega la música oficial de fondo (sonido-videos-tsoft.mp3) a un video, sin tocar la imagen.
//   node musicalizar.cjs entrada.mp4 salida.mp4
// La pista (2:24) tiene su propio fade-out desde el segundo 137: se corta ahí y se encadena
// consigo misma con fundidos cruzados de 3 s hasta cubrir el video. Fade de entrada 2 s y de
// salida 5 s. Volumen de fondo: -20 LUFS. Mismo criterio que la versión oficial del corto (v3-musica).
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const [, , IN, OUT] = process.argv;
if (!IN || !OUT) { console.error('Uso: node musicalizar.cjs entrada.mp4 salida.mp4'); process.exit(1); }
const MUSICA = path.join(__dirname, 'sonido-videos-tsoft.mp3');
const CORTE = 137, XF = 3;

const dur = f => { const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(spawnSync('ffmpeg', ['-i', f], { encoding: 'utf8' }).stderr); return +m[1] * 3600 + +m[2] * 60 + +m[3]; };
const D = dur(IN);
const vueltas = Math.max(1, Math.ceil((D - XF) / (CORTE - XF)) + 1);

const inputs = ['-i', IN];
for (let i = 0; i < vueltas; i++) inputs.push('-i', MUSICA);
let f = '';
for (let i = 0; i < vueltas; i++) f += `[${i + 1}:a]atrim=0:${CORTE},asetpts=N/SR/TB[m${i}];`;
let prev = 'm0';
for (let i = 1; i < vueltas; i++) { f += `[${prev}][m${i}]acrossfade=d=${XF}:c1=tri:c2=tri[x${i}];`; prev = `x${i}`; }
f += `[${prev}]atrim=0:${D.toFixed(3)},asetpts=N/SR/TB,afade=t=in:st=0:d=2,afade=t=out:st=${(D - 5).toFixed(3)}:d=5,loudnorm=I=-20:TP=-2:LRA=11,aresample=48000[musica]`;

execFileSync('ffmpeg', ['-v', 'error', '-y', ...inputs, '-filter_complex', f, '-map', '0:v', '-map', '[musica]',
  '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ac', '2', '-movflags', '+faststart', '-shortest', OUT], { stdio: 'inherit' });
console.log(`Listo: ${OUT} (${Math.floor(D / 60)}:${String(Math.round(D % 60)).padStart(2, '0')}, ${vueltas} vueltas de música)`);
