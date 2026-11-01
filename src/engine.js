/* ---------- Mini animation engine in the spirit of 3Blue1Brown / Manim ---------- */
const NS = 'http://www.w3.org/2000/svg';
const W = 1600, H = 900;
const C = {
  bg: '#0d0e12', fg: '#ECECEC', dim: '#8A8F98', faint: '#3a3f4a',
  blue: '#58C4DD', teal: '#5CD0B3', green: '#83C167', yellow: '#F7D96F',
  red: '#FC6255', gold: '#F0AC5F', purple: '#B189C6', maroon: '#C55F73', grid: '#29ABCA'
};
const FONT = "'Source Serif 4','Noto Serif',Georgia,serif";
const MONO = "'JetBrains Mono','DejaVu Sans Mono',monospace";

let INSTANT = false, SKIP = false, GEN = 0;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const linear = t => t;
const lerp = (a, b, t) => a + (b - a) * t;

function tween(dur, fn, e = ease) {
  if (INSTANT || SKIP || dur <= 0) { fn(1); return Promise.resolve(); }
  const gen = GEN;
  return new Promise(res => {
    const t0 = performance.now();
    const f = now => {
      if (gen !== GEN) { res(); return; }
      const t = (now - t0) / dur;
      if (SKIP || t >= 1) { fn(1); res(); return; }
      fn(e(Math.max(0, t))); requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  });
}
const wait = ms => tween(ms, () => {});
const all = (...ps) => Promise.all(ps.flat());
async function lag(list, fn, gap) { const ps = []; for (let i = 0; i < list.length; i++) { ps.push(fn(list[i], i)); if (gap) await wait(gap); } return Promise.all(ps); }

function E(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function lerpColor(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); }

/* transform state kept on element */
function setT(e, o) {
  const t = e._t || (e._t = { x: 0, y: 0, s: 1, r: 0 });
  Object.assign(t, o);
  e.setAttribute('transform', `translate(${t.x} ${t.y}) rotate(${t.r}) scale(${t.s})`);
  return e;
}
function moveT(e, o, dur = 800, ez) {
  const t = e._t || (e._t = { x: 0, y: 0, s: 1, r: 0 }); const from = { ...t };
  return tween(dur, k => { const n = {}; for (const key in o) n[key] = lerp(from[key], o[key], k); setT(e, n); }, ez);
}
function op(e, v) { e.setAttribute('opacity', v); return e; }
function getOp(e) { const v = e.getAttribute('opacity'); return v == null ? 1 : +v; }
function fadeIn(e, dur = 600, dy = 0) {
  if (!e) return Promise.resolve();
  const o0 = getOp(e) >= 1 ? 0 : getOp(e);
  if (dy) { const t = e._t || setT(e, {})._t; const y1 = t.y; setT(e, { y: y1 + dy }); moveT(e, { y: y1 }, dur); }
  return tween(dur, k => op(e, lerp(o0, 1, k)));
}
function fadeOut(e, dur = 500, remove = false) {
  if (!e) return Promise.resolve();
  const o0 = getOp(e);
  return tween(dur, k => op(e, lerp(o0, 0, k))).then(() => { if (remove) e.remove(); });
}
function anim(e, to, dur = 800, ez) {
  const from = {};
  for (const k in to) {
    const cur = e.getAttribute(k);
    from[k] = (typeof to[k] === 'string' && to[k][0] === '#') ? (cur && cur[0] === '#' ? cur : to[k]) : (cur == null ? 0 : +cur);
  }
  return tween(dur, t => {
    for (const k in to) {
      const v = typeof to[k] === 'string' ? lerpColor(from[k], to[k], t) : lerp(from[k], to[k], t);
      e.setAttribute(k, v);
    }
  }, ez);
}
/* stroke-draw for any geometry element; fill fades in afterwards */
function geoms(e) { return ['path', 'line', 'polyline', 'polygon', 'circle', 'rect', 'ellipse'].includes(e.tagName) ? [e] : [...e.querySelectorAll('path,line,polyline,polygon,circle,rect,ellipse')]; }
function create(e, dur = 1000, stagger = 0) {
  op(e, 1);
  const gs = geoms(e);
  return Promise.all(gs.map((g, i) => {
    const len = (g.getTotalLength ? g.getTotalLength() : 1000) || 1;
    const fo = g.getAttribute('fill-opacity') ?? (g.getAttribute('fill') && g.getAttribute('fill') !== 'none' ? 1 : 0);
    g.style.strokeDasharray = len; g.style.strokeDashoffset = len; g.setAttribute('fill-opacity', 0);
    const d0 = stagger * i;
    return wait(d0).then(() => tween(dur, k => { g.style.strokeDashoffset = len * (1 - k); }))
      .then(() => { g.style.strokeDasharray = ''; g.style.strokeDashoffset = ''; return tween(+fo ? 400 : 0, k => g.setAttribute('fill-opacity', fo * k)); });
  }));
}
function uncreate(e, dur = 700) {
  const gs = geoms(e);
  return Promise.all(gs.map(g => { const len = g.getTotalLength ? g.getTotalLength() : 1000; g.style.strokeDasharray = len; g.setAttribute('fill-opacity', 0); return tween(dur, k => g.style.strokeDashoffset = len * k); })).then(() => op(e, 0));
}
/* 3b1b "Write": outline each glyph, then fill */
function write(e, dur = 1200) {
  if (!e) return Promise.resolve();
  op(e, 1);
  const gs = [...e.querySelectorAll('.gl')];
  if (!gs.length) return fadeIn(e, dur / 2);
  const per = Math.min(600, dur * 0.6), gap = gs.length > 1 ? (dur - per) / (gs.length - 1) : 0;
  return Promise.all(gs.map((g, i) => {
    const len = g.getTotalLength ? g.getTotalLength() : 50;
    const isRule = g.classList.contains('rule');
    if (g.classList.contains('srule')) { g.setAttribute('opacity', 0); return wait(gap * i).then(() => tween(per, k => g.setAttribute('opacity', k))); }
    if (INSTANT || SKIP) { g.style.strokeDasharray = ''; g.setAttribute('fill-opacity', 1); g.setAttribute('stroke-width', 0); return; }
    g.setAttribute('fill-opacity', 0); g.setAttribute('stroke-width', isRule ? 0 : 0.18);
    g.style.strokeDasharray = len; g.style.strokeDashoffset = len;
    return wait(gap * i).then(() => tween(per, k => {
      g.style.strokeDashoffset = len * (1 - Math.min(1, k * 1.4));
      g.setAttribute('fill-opacity', Math.max(0, (k - 0.45) / 0.55));
    }, linear)).then(() => { g.style.strokeDasharray = ''; g.setAttribute('stroke-width', 0); g.setAttribute('fill-opacity', 1); });
  }));
}
function unwrite(e, dur = 500) { return fadeOut(e, dur); }
/* flash: scale pulse of the inner group + color */
function indicate(e, color = C.yellow, dur = 900) {
  const inner = e.querySelector(':scope > .in') || e;
  inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = 'center';
  const old = inner.style.color;
  return tween(dur, k => {
    const s = 1 + 0.18 * Math.sin(Math.PI * k);
    inner.style.transform = `scale(${s})`;
    inner.style.color = k < 1 ? lerpColor(old && old[0] === '#' ? old : C.fg, color, Math.sin(Math.PI * k)) : old;
  }, linear).then(() => { inner.style.transform = ''; inner.style.color = old; });
}
function recolor(e, color, dur = 500) {
  const inner = e.querySelector(':scope > .in') || e;
  const from = inner.style.color && inner.style.color[0] === '#' ? inner.style.color : (inner._color || C.fg);
  return tween(dur, k => inner.style.color = lerpColor(from, color, k)).then(() => inner._color = color);
}

/* ---------- geometry helpers ---------- */
function clipHalf(poly, a, b, c) { // keep a*x+b*y+c <= 0
  const out = []; const f = p => a * p[0] + b * p[1] + c;
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i], Q = poly[(i + 1) % poly.length], fp = f(P), fq = f(Q);
    if (fp <= 1e-9) out.push(P);
    if ((fp < -1e-9 && fq > 1e-9) || (fp > 1e-9 && fq < -1e-9)) { const t = fp / (fp - fq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
  }
  return out;
}
function clipAll(poly, cons) { return cons.reduce((p, c) => p.length ? clipHalf(p, ...c) : p, poly); }

/* ---------- Scene context ---------- */
class S {
  constructor(root) { this.root = root; this.defs = E('defs', {}, root); }
  g(parent = this.root, attrs = {}) { return E('g', attrs, parent); }
  hidden(e, h) { if (h !== false) op(e, 0); return e; }
  line(x1, y1, x2, y2, o = {}) {
    return this.hidden(E('line', { x1, y1, x2, y2, stroke: o.color || C.fg, 'stroke-width': o.w || 3, 'stroke-dasharray': o.dash, 'stroke-linecap': 'round', opacity: o.opacity }, o.parent || this.root), o.show ? false : true);
  }
  path(d, o = {}) {
    return this.hidden(E('path', { d, stroke: o.color || C.fg, 'stroke-width': o.w ?? 3, fill: o.fill || 'none', 'fill-opacity': o.fo, 'stroke-dasharray': o.dash, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, o.parent || this.root), o.show ? false : true);
  }
  poly(pts, o = {}) { return this.path(ptsD(pts, true), o); }
  circle(cx, cy, r, o = {}) {
    return this.hidden(E('circle', { cx, cy, r, fill: o.fill || C.fg, stroke: o.color || 'none', 'stroke-width': o.w || 0, 'fill-opacity': o.fo }, o.parent || this.root), o.show ? false : true);
  }
  rect(x, y, w, h, o = {}) {
    return this.hidden(E('rect', { x, y, width: w, height: h, rx: o.rx ?? 10, fill: o.fill || 'none', 'fill-opacity': o.fo, stroke: o.color || C.fg, 'stroke-width': o.w ?? 2, 'stroke-dasharray': o.dash }, o.parent || this.root), o.show ? false : true);
  }
  /* SVG text; supports simple markup: {y|text} colors a span */
  text(str, o = {}) {
    const g = E('g', {}, o.parent || this.root); setT(g, { x: o.x || 0, y: o.y || 0 });
    const lines = String(str).split('\n'); const lh = (o.size || 30) * (o.lh || 1.35);
    const t = E('text', { 'font-family': o.mono ? MONO : FONT, 'font-size': o.size || 30, fill: o.color || C.fg, 'text-anchor': { l: 'start', c: 'middle', r: 'end' }[o.anchor || 'l'], 'font-weight': o.weight, 'font-style': o.italic ? 'italic' : null, 'xml:space': 'preserve', style: 'white-space:pre' }, g);
    t.classList.add('in');
    const CM = { y: C.yellow, b: C.blue, t: C.teal, g: C.green, r: C.red, o: C.gold, p: C.purple, d: C.dim };
    lines.forEach((ln, i) => {
      const parts = ln.split(/(\{[a-z]\|[^}]*\})/);
      let first = true;
      parts.forEach(p => {
        if (!p) return;
        const m = p.match(/^\{([a-z])\|(.*)\}$/);
        const sp = E('tspan', {}, t);
        if (first) { sp.setAttribute('x', 0); sp.setAttribute('dy', i === 0 ? 0 : lh); first = false; }
        if (m) { sp.setAttribute('fill', CM[m[1]]); sp.textContent = m[2]; if (o.boldMarks) sp.setAttribute('font-weight', 600); }
        else sp.textContent = p;
      });
      if (first) { const sp = E('tspan', { x: 0, dy: i === 0 ? 0 : lh }, t); sp.textContent = ' '; }
    });
    return this.hidden(g, o.show ? false : true);
  }
  /* LaTeX (pre-rendered). size = font px; anchor l|c|r; y = baseline */
  tex(raw, o = {}) {
    const F = TEX.F[raw]; if (!F) { console.warn('missing tex', raw); return this.text(raw, o); }
    const k = (o.size || 36) / 10;
    const g = E('g', {}, o.parent || this.root);
    const ax = { l: 0, c: F.w / 2, r: F.w }[o.anchor || 'l'];
    const ay = o.vcenter ? F.h / 2 : F.b;
    setT(g, { x: o.x || 0, y: o.y || 0 });
    const inner = E('g', { transform: `scale(${k}) translate(${-ax} ${-ay})` }, g);
    const content = E('g', { fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 0 }, inner);
    content.classList.add('in');
    content.style.color = o.color || C.fg; content._color = o.color || C.fg;
    for (const it of F.i) {
      let p;
      if (it[0] === 'R') {
        p = E('path', { d: it[1], transform: it[2] || null }, content);
        if (it[5] === 's') { p.setAttribute('fill', 'none'); p.setAttribute('stroke', it[3] || 'currentColor'); p.setAttribute('stroke-width', it[4]); p.classList.add('srule'); }
        else { if (it[3]) p.setAttribute('fill', it[3]); p.classList.add('rule'); }
      } else {
        p = E('path', { d: TEX.D[it[0]], transform: `translate(${it[1]} ${it[2]})` }, content);
        if (it[3]) { p.setAttribute('fill', it[3]); p.setAttribute('stroke', it[3]); }
      }
      p.classList.add('gl');
    }
    g._w = F.w * k; g._h = F.h * k; g._b = F.b * k; g._ax = ax * k;
    return this.hidden(g, o.show ? false : true);
  }
  /* row of tex pieces laid out left→right sharing a baseline */
  texRow(raws, o = {}) {
    const k = (o.size || 36) / 10, gap = o.gap ?? (o.size || 36) * 0.35;
    const ws = raws.map(r => (TEX.F[r] ? TEX.F[r].w * k : 100));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (raws.length - 1);
    let x = (o.x || 0) - ({ l: 0, c: total / 2, r: total }[o.anchor || 'l']);
    const items = raws.map((r, i) => { const t = this.tex(r, { ...o, anchor: 'l', x, y: o.y }); t._cx = x + ws[i] / 2; x += ws[i] + gap; return t; });
    items.total = total;
    return items;
  }
  /* surrounding rectangle for a tex/text element */
  box(e, o = {}) {
    const b = bboxIn(e, this.root); const p = o.pad ?? 12;
    return this.rect(b.x - p, b.y - p, b.width + 2 * p, b.height + 2 * p, { color: o.color || C.yellow, w: o.w || 3, rx: o.rx ?? 8, fill: o.fill, fo: o.fo });
  }
  label(str, o = {}) { return this.text(str, { size: 24, color: C.dim, x: 64, y: 58, ...o }); }
  title(str, o = {}) { return this.text(str, { size: 46, x: 64, y: 124, ...o }); }
  arrow(x1, y1, x2, y2, o = {}) {
    const g = E('g', {}, o.parent || this.root);
    const col = o.color || C.fg, w = o.w || 4, hs = o.head || 16;
    const a = Math.atan2(y2 - y1, x2 - x1);
    const bx = x2 - Math.cos(a) * hs * 0.9, by = y2 - Math.sin(a) * hs * 0.9;
    E('line', { x1, y1, x2: bx, y2: by, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    const h = [[x2, y2], [x2 - Math.cos(a - 0.4) * hs, y2 - Math.sin(a - 0.4) * hs], [x2 - Math.cos(a + 0.4) * hs, y2 - Math.sin(a + 0.4) * hs]];
    E('path', { d: ptsD(h, true), fill: col, stroke: col, 'stroke-width': 1 }, g);
    return this.hidden(g, o.show ? false : true);
  }
  curveArrow(x1, y1, x2, y2, bend, o = {}) {
    const g = E('g', {}, o.parent || this.root); const col = o.color || C.fg;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
    const cx = mx - dy / L * bend, cy = my + dx / L * bend;
    const hs = 16; const a = Math.atan2(y2 - cy, x2 - cx);
    E('path', { d: `M${x1} ${y1} Q${cx} ${cy} ${x2 - Math.cos(a) * hs * .8} ${y2 - Math.sin(a) * hs * .8}`, fill: 'none', stroke: col, 'stroke-width': o.w || 4, 'stroke-linecap': 'round' }, g);
    E('path', { d: ptsD([[x2, y2], [x2 - Math.cos(a - .4) * hs, y2 - Math.sin(a - .4) * hs], [x2 - Math.cos(a + .4) * hs, y2 - Math.sin(a + .4) * hs]], true), fill: col }, g);
    return this.hidden(g, o.show ? false : true);
  }
  /* coordinate plane */
  plane(o) {
    const P = new Plane(this, o); return P;
  }
  code(lines, o = {}) { // monospace block; markup {y|..} supported
    return this.text(lines, { mono: true, size: o.size || 26, lh: 1.45, ...o });
  }
  card(x, y, w, h, o = {}) { return this.rect(x, y, w, h, { color: o.color || C.faint, fill: o.fill || '#161820', fo: o.fo ?? 1, w: o.w ?? 2, rx: 14, ...o }); }
}
function ptsD(pts, close) { return pts.length ? 'M' + pts.map(p => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join(' L') + (close ? ' Z' : '') : ''; }
function bboxIn(e, root) {
  const b = e.getBBox(); const m = e.getCTM(), r = root.getCTM().inverse().multiply(m);
  const pts = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(([x, y]) => { const p = new DOMPoint(x, y).matrixTransform(r); return [p.x, p.y]; });
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  return { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys) };
}

class Plane {
  constructor(s, o) {
    this.s = s; Object.assign(this, { x0: 0, x1: 10, y0: 0, y1: 6, left: 120, top: 160, unit: 70, step: 1, labels: true }, o);
    this.g = s.g(o.parent || s.root); op(this.g, 0);
    this.gridG = E('g', {}, this.g); this.axG = E('g', {}, this.g); this.lblG = E('g', {}, this.g);
    this.layer = E('g', {}, this.g); // content layer
    const X = v => this.X(v), Y = v => this.Y(v);
    for (let x = Math.ceil(this.x0); x <= this.x1; x += this.step) if (x !== 0 || this.y0 > 0) E('line', { x1: X(x), y1: Y(this.y0), x2: X(x), y2: Y(this.y1), stroke: C.grid, 'stroke-opacity': .32, 'stroke-width': 1.5 }, this.gridG);
    for (let y = Math.ceil(this.y0); y <= this.y1; y += this.step) if (y !== 0 || this.x0 > 0) E('line', { x1: X(this.x0), y1: Y(y), x2: X(this.x1), y2: Y(y), stroke: C.grid, 'stroke-opacity': .32, 'stroke-width': 1.5 }, this.gridG);
    const ax = Math.max(this.x0, Math.min(0, this.x1)), ay = Math.max(this.y0, Math.min(0, this.y1));
    E('line', { x1: X(this.x0), y1: Y(ay), x2: X(this.x1) + 18, y2: Y(ay), stroke: C.fg, 'stroke-width': 2.5 }, this.axG);
    E('line', { x1: X(ax), y1: Y(this.y0), x2: X(ax), y2: Y(this.y1) - 18, stroke: C.fg, 'stroke-width': 2.5 }, this.axG);
    E('path', { d: ptsD([[X(this.x1) + 30, Y(ay)], [X(this.x1) + 14, Y(ay) - 7], [X(this.x1) + 14, Y(ay) + 7]], true), fill: C.fg }, this.axG);
    E('path', { d: ptsD([[X(ax), Y(this.y1) - 30], [X(ax) - 7, Y(this.y1) - 14], [X(ax) + 7, Y(this.y1) - 14]], true), fill: C.fg }, this.axG);
    if (this.labels) {
      const ls = this.labelStep || this.step;
      for (let x = Math.ceil(this.x0); x <= this.x1; x += ls) if (x !== ax || true) { const t = E('text', { x: X(x), y: Y(ay) + 28, 'font-size': 20, fill: C.dim, 'text-anchor': 'middle', 'font-family': FONT }, this.lblG); t.textContent = x; }
      for (let y = Math.ceil(this.y0); y <= this.y1; y += ls) if (y !== ay) { const t = E('text', { x: X(ax) - 12, y: Y(y) + 7, 'font-size': 20, fill: C.dim, 'text-anchor': 'end', 'font-family': FONT }, this.lblG); t.textContent = y; }
      const xl = E('text', { x: X(this.x1) + 34, y: Y(ay) + 8, 'font-size': 26, fill: C.fg, 'font-style': 'italic', 'font-family': FONT }, this.lblG); xl.textContent = this.xName || 'x';
      const yl = E('text', { x: X(ax) + 12, y: Y(this.y1) - 26, 'font-size': 26, fill: C.fg, 'font-style': 'italic', 'font-family': FONT }, this.lblG); yl.textContent = this.yName || 'y';
    }
    this.bounds = [[this.x0, this.y0], [this.x1, this.y0], [this.x1, this.y1], [this.x0, this.y1]];
  }
  X(x) { return this.left + (x - this.x0) * this.unit; }
  Y(y) { return this.top + (this.y1 - y) * this.unit; }
  P(x, y) { return [this.X(x), this.Y(y)]; }
  S(pts) { return pts.map(p => this.P(p[0], p[1])); }
  async create(dur = 1400) {
    op(this.g, 1); [this.gridG, this.axG, this.lblG].forEach(g => op(g, 0));
    op(this.gridG, 1);
    const lines = [...this.gridG.children];
    lines.forEach(l => { l.style.strokeDasharray = 2000; l.style.strokeDashoffset = 2000; });
    const p = Promise.all(lines.map((l, i) => wait(i * (dur * 0.4) / lines.length).then(() => tween(dur * 0.6, k => l.style.strokeDashoffset = 2000 * (1 - k))).then(() => l.style.strokeDasharray = '')));
    await all(create(this.axG, dur * 0.7), fadeIn(this.lblG, dur));
    await p;
  }
  show() { op(this.g, 1); }
  poly(pts, o = {}) { return this.s.poly(this.S(pts), { parent: this.layer, ...o }); }
  seg(a, b, o = {}) { const [x1, y1] = this.P(...a), [x2, y2] = this.P(...b); return this.s.line(x1, y1, x2, y2, { parent: this.layer, ...o }); }
  polyline(pts, o = {}) { return this.s.path(ptsD(this.S(pts)), { parent: this.layer, ...o }); }
  dot(x, y, o = {}) { const [a, b] = this.P(x, y); return this.s.circle(a, b, o.r || 7, { parent: this.layer, fill: o.color || C.fg, ...o }); }
  half(a, b, c, o = {}) { return this.poly(clipHalf(this.bounds, a, b, c), { w: 0, fill: o.color || C.yellow, fo: o.fo ?? .18, ...o }); }
  lineEq(a, b, c, o = {}) { // full line a x + b y + c = 0 across the plane
    const pts = [];
    const B = this.bounds; for (let i = 0; i < 4; i++) { const P = B[i], Q = B[(i + 1) % 4]; const fp = a * P[0] + b * P[1] + c, fq = a * Q[0] + b * Q[1] + c; if (fp === 0) pts.push(P); else if (fp * fq < 0) { const t = fp / (fp - fq); pts.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); } }
    return this.seg(pts[0], pts[1], o);
  }
  text(str, x, y, o = {}) { const [a, b] = this.P(x, y); return this.s.text(str, { parent: this.layer, x: a + (o.dx || 0), y: b + (o.dy || 0), size: 24, ...o }); }
  tex(raw, x, y, o = {}) { const [a, b] = this.P(x, y); return this.s.tex(raw, { parent: this.layer, x: a + (o.dx || 0), y: b + (o.dy || 0), size: 28, ...o }); }
}

/* simple 3D camera */
function cam3(o) {
  return (x, y, z) => {
    const c = Math.cos(o.yaw), s = Math.sin(o.yaw);
    const X = x * c - y * s, Y = x * s + y * c;
    return [o.cx + o.s * X, o.cy - o.s * (z * Math.cos(o.pitch) + Y * Math.sin(o.pitch))];
  };
}
