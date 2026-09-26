// Renderiza el corto cuadro por cuadro con Chrome headless y lo codifica a MP4 con ffmpeg.
//
//   node exportar-mp4.mjs                         -> de-lunes-a-martes.mp4 (1920x1080, 30 fps)
//   node exportar-mp4.mjs --v 2                   -> de-lunes-a-martes-v2.mp4 (versión 2 del guion)
//   node exportar-mp4.mjs --fps 60 --out corto.mp4
//   node exportar-mp4.mjs --from 20 --to 40       -> solo un tramo (para revisar)
//   node exportar-mp4.mjs --stills 5,30,62        -> PNGs sueltos en ./stills (sin video)
//
// Requisitos: Node 22+, Google Chrome o Microsoft Edge, y ffmpeg en el PATH.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, arr) => {
  if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]);
  return acc;
}, []));
const FPS = +(args.fps || 30);
const VER = args.v ? String(args.v) : '';
const OUT = path.resolve(here, args.out || (VER ? `de-lunes-a-martes-v${VER}.mp4` : 'de-lunes-a-martes.mp4'));
const PORT = 9400 + Math.floor(Math.random() * 400);

const browsers = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium'
];
const exe = args.chrome || browsers.find(b => fs.existsSync(b));
if (!exe) { console.error('No encontré Chrome ni Edge. Pasalo con --chrome "ruta"'); process.exit(1); }

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'film-'));
const chrome = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--mute-audio',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1920,1080', 'about:blank'], { stdio: 'ignore' });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const cleanup = () => { try { chrome.kill(); } catch {} };
process.on('exit', cleanup);

let targets;
for (let i = 0; i < 60; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (targets.length) break; } catch {}
  await sleep(250);
}
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => { ws.onopen = r; });
let id = 0; const pending = {};
ws.onmessage = e => {
  const m = JSON.parse(e.data);
  if (m.id && pending[m.id]) { pending[m.id](m); delete pending[m.id]; }
  if (m.method === 'Runtime.exceptionThrown') console.error('Error en la página:', m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
};
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async expr => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'error al evaluar');
  return r.result.result.value;
};

await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: pathToFileURL(path.join(here, 'index.html')).href + '?export=1' + (VER ? '&v=' + VER : '') });
for (let i = 0; i < 80; i++) { if (await evaluate('!!window.FILM').catch(() => false)) break; await sleep(250); }
await evaluate('FILM.ready.then(() => true)');
const duration = await evaluate('FILM.duration');
const grab = t => evaluate(`(FILM.renderAt(${t}), document.getElementById('film').toDataURL('image/${args.stills ? 'png' : 'jpeg'}', .93).split(',')[1])`);

if (args.cues) {
  const cues = await evaluate('FILM.cues()');
  const f = path.join(here, `narracion${VER ? '-v' + VER : ''}.json`);
  fs.writeFileSync(f, JSON.stringify({ duracion: duration, cues }, null, 1));
  console.log(`${cues.length} textos → ${f}`);
  cleanup(); process.exit(0);
}
if (args.stills) {
  const dir = path.resolve(here, args.dir || 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const s of String(args.stills).split(',')) {
    fs.writeFileSync(path.join(dir, `t${String(s).padStart(5, '0')}.png`), Buffer.from(await grab(+s), 'base64'));
    console.log('still', s);
  }
  cleanup(); process.exit(0);
}

const from = +(args.from || 0), to = Math.min(duration, +(args.to || duration));
const frames = Math.round((to - from) * FPS);
console.log(`Duración ${duration.toFixed(1)} s · renderizando ${frames} cuadros a ${FPS} fps → ${OUT}`);
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-vf', 'scale=in_range=pc:out_range=tv', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT], { stdio: ['pipe', 'inherit', 'inherit'] });
ff.on('error', () => { console.error('No encontré ffmpeg en el PATH.'); process.exit(1); });

const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  const buf = Buffer.from(await grab(from + f / FPS), 'base64');
  if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % (FPS * 5) === 0) {
    const el = (Date.now() - t0) / 1000, eta = f ? el / f * (frames - f) : 0;
    process.stdout.write(`\r  ${(f / frames * 100).toFixed(0).padStart(3)}% · cuadro ${f}/${frames} · faltan ~${Math.ceil(eta / 60)} min   `);
  }
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
console.log(`\nListo: ${OUT} (${((Date.now() - t0) / 60000).toFixed(1)} min)`);
cleanup(); process.exit(0);
