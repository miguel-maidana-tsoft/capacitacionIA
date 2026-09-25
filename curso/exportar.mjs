// Exporta un módulo del curso: video MP4 (cuadro por cuadro) e imágenes para el pptx.
//
//   node exportar.mjs --modulo 0                  -> modulo-0/modulo-0.mp4 (1920x1080, 30 fps)
//   node exportar.mjs --modulo 0 --assets         -> modulo-0/img/*.png (capturas y personajes para el pptx)
//   node exportar.mjs --modulo 0 --ritmo 1        -> ritmo original (por defecto 1.35, lectura cómoda)
//   node exportar.mjs --modulo 0 --info           -> duración y escenas
//   node exportar.mjs --modulo 0 --cues           -> modulo-0/narracion.json (textos para la voz)
//   node exportar.mjs --modulo 0 --from 40 --to 60 --out tramo.mp4
//   node exportar.mjs --modulo 0 --stills 5,30 --dir carpeta
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
if (args.modulo === undefined) { console.error('Indicá el módulo: node exportar.mjs --modulo 0'); process.exit(1); }
const MOD = String(args.modulo), DIR = path.join(here, `modulo-${MOD}`);
const FPS = +(args.fps || 30);
const OUT = path.resolve(DIR, args.out || `modulo-${MOD}.mp4`);
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

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'curso-'));
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
await send('Page.navigate', { url: pathToFileURL(path.join(DIR, 'index.html')).href + '?export=1' + (args.ritmo ? '&ritmo=' + args.ritmo : '') });
for (let i = 0; i < 80; i++) { if (await evaluate('!!window.FILM').catch(() => false)) break; await sleep(250); }
await evaluate('FILM.ready.then(() => true)');
const duration = await evaluate('FILM.duration');
const grab = (t, fmt = 'jpeg') => evaluate(`(FILM.renderAt(${t}), document.getElementById('film').toDataURL('image/${fmt}', .93).split(',')[1])`);
const done = () => { cleanup(); process.exit(0); };

if (args.info) {
  const sc = await evaluate('FILM.scenes');
  console.log(`Duración: ${Math.floor(duration / 60)}:${String(Math.round(duration % 60)).padStart(2, '0')} (${duration.toFixed(1)} s)`);
  sc.forEach(s => console.log(`  ${s.start.toFixed(1).padStart(6)} s  ${s.label}`));
  done();
}
if (args.cues) {
  const cues = await evaluate('FILM.cues()');
  fs.writeFileSync(path.join(DIR, 'narracion.json'), JSON.stringify({ duracion: duration, cues }, null, 1));
  console.log(`${cues.length} textos de narración → modulo-${MOD}/narracion.json`);
  done();
}
if (args.assets) {
  const out = path.join(DIR, 'img'); fs.mkdirSync(out, { recursive: true });
  for (const n of await evaluate('FILM.assetNames()')) {
    const b64 = (await evaluate(`FILM.asset(${JSON.stringify(n)})`)).split(',')[1];
    fs.writeFileSync(path.join(out, n + '.png'), Buffer.from(b64, 'base64'));
    console.log('imagen', n);
  }
  done();
}
if (args.stills) {
  const out = path.resolve(args.dir || path.join(DIR, 'stills')); fs.mkdirSync(out, { recursive: true });
  for (const s of String(args.stills).split(',')) {
    fs.writeFileSync(path.join(out, `t${Number(s).toFixed(1).padStart(6, '0')}.png`), Buffer.from(await grab(+s, 'png'), 'base64'));
    console.log('still', s);
  }
  done();
}

const from = +(args.from || 0), to = Math.min(duration, +(args.to || duration));
const frames = Math.round((to - from) * FPS);
console.log(`Módulo ${MOD} · ${duration.toFixed(1)} s · ${frames} cuadros a ${FPS} fps → ${OUT}`);
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
done();
