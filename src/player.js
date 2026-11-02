/* ---------- Player: scenes, steps, navigation ---------- */
const SCENES = [];
function scene(id, sec, title, build) { SCENES.push({ id, sec, title, build }); }
const tx = s => s.raw[0];

let cur = 0, step = 0, steps = [], busy = false;
const svg = document.getElementById('stage');

async function load(i, k = 0) {
  GEN++; SKIP = false; busy = false;
  cur = Math.max(0, Math.min(SCENES.length - 1, i));
  const old = svg.querySelector('#root'); if (old) old.remove();
  const root = E('g', { id: 'root' }, svg);
  const s = new S(root);
  INSTANT = true;
  try {
    steps = (await SCENES[cur].build(s)) || [];
    if (k < 0) k = steps.length;
    for (let j = 0; j < k && j < steps.length; j++) await steps[j]();
  } finally { INSTANT = false; }
  step = Math.min(k, steps.length);
  try { history.replaceState(null, '', '#' + SCENES[cur].id); } catch (e) {}
  ui();
}
async function runStep() {
  if (step >= steps.length) return;
  const g = GEN; busy = true; ui();
  const fn = steps[step++];
  ui();
  await fn();
  if (g === GEN) { busy = false; SKIP = false; ui(); }
}
async function next() {
  if (busy) { SKIP = true; return; }
  if (step < steps.length) return runStep();
  if (cur < SCENES.length - 1) { await load(cur + 1, 0); return runStep(); }
}
async function prev() {
  if (step > 1) return load(cur, step - 1);
  if (cur > 0) return load(cur - 1, -1);
  return load(0, 0);
}
function ui() {
  const sc = SCENES[cur];
  document.getElementById('sec').textContent = sc.sec;
  document.getElementById('ttl').textContent = sc.title;
  document.getElementById('num').textContent = (cur + 1) + ' / ' + SCENES.length;
  const d = document.getElementById('dots'); d.innerHTML = '';
  for (let i = 0; i < steps.length; i++) { const s = document.createElement('i'); if (i < step) s.className = 'on'; d.appendChild(s); }
  const stt = document.getElementById('st'), cue = document.getElementById('cue');
  if (busy) { stt.className = 'run'; stt.textContent = '● đang chạy…'; cue.className = ''; }
  else if (step < steps.length) { stt.className = 'ok'; stt.textContent = '✓ xong · bấm → tiếp'; cue.className = 'on'; cue.textContent = '→'; }
  else { stt.className = 'end'; stt.textContent = cur < SCENES.length - 1 ? '✓ hết cảnh · → sang cảnh sau' : '✓ hết bài'; cue.className = 'on end'; cue.textContent = cur < SCENES.length - 1 ? '⏭' : '■'; }
  const dd = d.children; if (busy && step > 0 && dd[step - 1]) dd[step - 1].className = 'cur';
  document.getElementById('bar').style.width = ((cur + (steps.length ? step / steps.length : 1)) / SCENES.length * 100) + '%';
}
function buildMenu() {
  const m = document.getElementById('menu-list'); m.innerHTML = '';
  SCENES.forEach((sc, i) => {
    const b = document.createElement('button');
    b.innerHTML = `<span>${i + 1}</span><em>${sc.sec}</em>${sc.title}`;
    b.onclick = () => { toggleMenu(false); load(i, 0).then(runStep); };
    m.appendChild(b);
  });
}
function toggleMenu(v) { const m = document.getElementById('menu'); m.classList.toggle('open', v ?? !m.classList.contains('open')); }
function fullscreen() { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); else document.exitFullscreen(); } catch (e) {} }

document.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (['ArrowRight', ' ', 'PageDown', 'Enter', 'ArrowDown'].includes(k)) { e.preventDefault(); next(); }
  else if (['ArrowLeft', 'PageUp', 'Backspace', 'ArrowUp'].includes(k)) { e.preventDefault(); prev(); }
  else if (k === 'r' || k === 'R') { load(cur, 0).then(runStep); }
  else if (k === 'f' || k === 'F') fullscreen();
  else if (k === 'm' || k === 'M' || k === 'Escape') toggleMenu(k === 'Escape' ? false : undefined);
  else if (k === 'Home') load(0, 0).then(runStep);
});
svg.addEventListener('click', e => { const r = svg.getBoundingClientRect(); (e.clientX - r.left < r.width * 0.25) ? prev() : next(); });
document.getElementById('bn').onclick = next;
document.getElementById('bp').onclick = prev;
document.getElementById('bm').onclick = () => toggleMenu();
document.getElementById('bf').onclick = fullscreen;
document.getElementById('br').onclick = () => load(cur, 0).then(runStep);

window.addEventListener('load', () => {
  if (window.ORDER) { const O = window.ORDER, base = SCENES.map(x => x.id); SCENES.sort((a, b) => { const i = O.indexOf(a.id), j = O.indexOf(b.id); return (i < 0 ? 1000 + base.indexOf(a.id) : i) - (j < 0 ? 1000 + base.indexOf(b.id) : j); }); }
  buildMenu();
  const h = location.hash.slice(1); const i = SCENES.findIndex(s => s.id === h);
  load(i >= 0 ? i : 0, 0).then(() => { if (!window.__TEST) runStep(); });
});
/* test hooks */
window.__goto = (i, k) => load(i, k);
window.__info = () => SCENES.map((s, i) => [i, s.id]);
