/* ================= Shared data (đúng số liệu trong tài liệu) ================= */
const SPAT = [[1, 1], [7, 1], [7, 3], [4, 4]];
const SPAT_C = [[-1, 1, 0], [1, 0, -7], [0, -1, 1], [1, 3, -16]];
const ROAD = [[4, 3], [6, 5], [8, 2], [10, 5]];
const PP = [[1, 1], [9, 1], [9, 6], [7, 3], [4, 4]];
const P1 = [[1, 1], [17 / 3, 1], [7, 3], [4, 4]];
const P2 = [[17 / 3, 1], [9, 1], [9, 6]];
const P1C = [[-1, 1, 0], [0, -1, 1], [1, 3, -16], [3, -2, -15]];
const P2C = [[1, 0, -9], [0, -1, 1], [-3, 2, 15]];
const SEGS = [
  { a: [4, 3], b: [6, 5], eq: [1, -1, -1], box: [4, 6, 3, 5] },
  { a: [6, 5], b: [8, 2], eq: [3, 2, -28], box: [6, 8, 2, 5] },
  { a: [8, 2], b: [10, 5], eq: [3, -2, -20], box: [8, 10, 2, 5] }
];
const inside = (p, cons) => cons.every(([a, b, c]) => a * p[0] + b * p[1] + c <= 1e-9);
function rng(seed) { let s = seed >>> 0; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }

function captioner(s, o = {}) {
  let curEl = null;
  return async (str, oo = {}) => {
    const old = curEl;
    curEl = str ? s.text(str, { x: 80, y: 780, size: 30, ...o, ...oo }) : null;
    await all(old ? fadeOut(old, 300, true) : null, curEl ? fadeIn(curEl, 600) : null);
  };
}
function lineEnds(Pl, a, b, c) {
  const pts = []; const B = Pl.bounds;
  for (let i = 0; i < 4; i++) { const P = B[i], Q = B[(i + 1) % 4]; const fp = a * P[0] + b * P[1] + c, fq = a * Q[0] + b * Q[1] + c; if (Math.abs(fp) < 1e-9) pts.push(P); else if (fp * fq < 0) { const t = fp / (fp - fq); pts.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); } }
  return pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
}
/* animate a full line shrinking to a segment */
function shrinkLine(Pl, ln, A, B) {
  const [x1, y1] = Pl.P(...A), [x2, y2] = Pl.P(...B);
  return anim(ln, { x1, y1, x2, y2 }, 1000);
}
function popDot(d, dur = 400) { op(d, 1); const r = +d.getAttribute('r'); return tween(dur, k => d.setAttribute('r', r * (k < .6 ? k / .6 * 1.5 : 1.5 - (k - .6) / .4 * .5))); }

/* ================= 1. Tiêu đề ================= */
scene('mo-dau', 'Chương 4', 'The Constraint Data Model', s => {
  const t1 = s.text('Chương 4', { x: 800, y: 300, anchor: 'c', size: 40, color: C.dim });
  const t2 = s.tex(tx`\text{The Constraint Data Model}`, { x: 800, y: 420, anchor: 'c', size: 84 });
  const ln = s.line(420, 470, 1180, 470, { color: C.yellow, w: 2 });
  const t3 = s.text('quan hệ {b|vô hạn}   →   công thức {y|hữu hạn}   →   tính trên công thức', { x: 800, y: 560, anchor: 'c', size: 36 });
  const t4 = s.text('Tài liệu học · mục 4.1 → 4.5 (sách trang 114–147)', { x: 800, y: 760, anchor: 'c', size: 24, color: C.dim });
  return [async () => { await fadeIn(t1, 600); await write(t2, 2000); await create(ln, 700); await fadeIn(t3, 900, 12); await fadeIn(t4, 600); }];
});

/* ================= 2. Câu hỏi gốc ================= */
scene('tap-diem', 'Mở đầu · 4.1.1', 'Một đối tượng là một tập điểm', s => {
  const lab = s.label('Mở đầu · 4.1.1 — Table 4.1, Figure 4.1');
  const ttl = s.title('Quan hệ thì hữu hạn — đa giác thì {y|vô hạn} điểm');
  const Pl = s.plane({ x0: 0, x1: 8, y0: 0, y1: 5, unit: 80, left: 760, top: 210 });
  // table
  const tb = s.g(); op(tb, 0);
  const hx = s.tex(tx`\text{Spat}(x,\,y)`, { x: 360, y: 270, anchor: 'c', size: 38, parent: tb, show: true });
  E('line', { x1: 220, y1: 300, x2: 500, y2: 300, stroke: C.fg, 'stroke-width': 2 }, tb);
  E('line', { x1: 360, y1: 310, x2: 360, y2: 600, stroke: C.faint, 'stroke-width': 2 }, tb);
  const pts = [[1, 1], [7, 3], [4, 4], [7, 1]];
  const pair = (a, b, y, col) => { const g = s.g(); op(g, 0); s.text(a, { x: 290, y, anchor: 'c', size: 32, color: col, parent: g, show: true }); s.text(b, { x: 430, y, anchor: 'c', size: 32, color: col, parent: g, show: true }); return g; };
  const rows = pts.map((p, i) => pair(String(p[0]), String(p[1]), 350 + i * 56));
  const dots = pts.map(p => Pl.dot(p[0], p[1], { color: C.yellow, r: 9 }));
  const lbls = pts.map(p => Pl.text(`(${p[0]}, ${p[1]})`, p[0], p[1], { dx: 12, dy: -14, size: 22, color: C.dim }));
  const cap = captioner(s, { y: 740 });
  const poly = Pl.poly(SPAT, { color: C.blue, w: 4, fill: C.blue, fo: .18 });
  // dots filling the polygon
  const R = rng(7), cloud = s.g(Pl.layer); const N = 520; const cl = [];
  while (cl.length < N) { const p = [1 + R() * 6, 1 + R() * 3]; if (inside(p, SPAT_C)) cl.push(p); }
  const cdots = cl.map(p => { const [x, y] = Pl.P(...p); return E('circle', { cx: x, cy: y, r: 2.6, fill: C.blue, opacity: 0 }, cloud); });
  const rows2 = [['1', '1'], ['1.001', '1'], ['1.002', '1'], ['1.003', '1'], ['⋮', '⋮']].map((t, i) => pair(t[0], t[1], 350 + i * 56, C.blue));
  const inf = s.tex(tx`\#\text{dòng} \to \infty`, { x: 360, y: 670, anchor: 'c', size: 40, color: C.yellow });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1200); await Pl.create(1200); await fadeIn(tb, 500);
      for (let i = 0; i < 4; i++) { await all(fadeIn(rows[i], 400, 10), popDot(dots[i]), fadeIn(lbls[i], 400)); }
      await cap('Tập {y|4 điểm} (Figure 4.1a) → bảng Spat có đúng {y|4 dòng}. Dễ.'); },
    async () => { await all(lbls.map(l => fadeOut(l, 300))); await create(poly, 1400); await cap('Còn đa giác (Figure 4.1b) thì sao? Mỗi điểm bên trong cũng là một tuple…'); },
    async () => {
      await all(rows.map(r => fadeOut(r, 300)), dots.map(d => fadeOut(d, 300)));
      const pr = lag(rows2, r => fadeIn(r, 400, 10), 260);
      await tween(2600, k => { const n = Math.floor(k * N); for (let i = 0; i < n; i++) cdots[i].setAttribute('opacity', .85); }, linear);
      await pr; await write(inf, 900);
      await cap('Bảng lý thuyết phải chứa {b|mọi} cặp tọa độ trong đa giác → {y|vô hạn dòng}.');
    },
    async () => { await cap('Constraint data model: {y|giữ nguyên mô hình quan hệ}, chỉ cho phép quan hệ {b|vô hạn}.', { size: 32 }); }
  ];
});

/* ================= 3. Truy vấn = join ================= */
scene('join', '4.1.1', 'Giao hai đối tượng = join trên x, y', s => {
  const lab = s.label('4.1.1 — truy vấn trên quan hệ vô hạn');
  const ttl = s.title('Cắt đối tượng bằng một truy vấn SQL bình thường');
  const code1 = s.code('select x, y\nfrom   Spat, {y|Rect}\nwhere  Spat.x = {y|Rect}.x\n  and  Spat.y = {y|Rect}.y', { x: 90, y: 300, size: 32 });
  const code2 = s.code('select x, y\nfrom   Spat, {o|Road}\nwhere  Spat.x = {o|Road}.x\n  and  Spat.y = {o|Road}.y', { x: 90, y: 300, size: 32 });
  const Pl = s.plane({ x0: 0, x1: 11, y0: 0, y1: 6, unit: 62, left: 760, top: 210 });
  const sp = Pl.poly(SPAT, { color: C.blue, w: 3.5, fill: C.blue, fo: .22 });
  const spl = Pl.text('Spat', 2.2, 1.6, { color: C.blue, size: 26 });
  const RC = [[-1, 0, 3], [1, 0, -8], [0, -1, 2], [0, 1, -4.5]];
  const rc = Pl.poly([[3, 2], [8, 2], [8, 4.5], [3, 4.5]], { color: C.yellow, w: 3, fill: C.yellow, fo: .1, dash: '10 8' });
  const rcl = Pl.text('Rect', 8.15, 4.7, { color: C.yellow, size: 26 });
  const inter = Pl.poly(clipAll(SPAT, RC), { color: C.green, w: 4, fill: C.green, fo: .6 });
  const road = Pl.polyline(ROAD, { color: C.gold, w: 5 });
  const rdl = Pl.text('Road', 10.1, 5.3, { color: C.gold, size: 26 });
  const rin = Pl.seg([4, 3], [4.75, 3.75], { color: C.red, w: 9 });
  const probe = Pl.dot(1, 5, { r: 10, color: C.fg });
  const hl = s.rect(78, 360, 560, 112, { color: C.yellow, w: 2.5, rx: 8 });
  const cap = captioner(s, { y: 680 });
  const b1 = s.text('① Không cần biết {y|kiểu} đối tượng: đoạn, hình chữ nhật hay đa giác đều chỉ là {b|tập điểm}.', { x: 90, y: 760, size: 28 });
  const b2 = s.text('② Không cần kỹ năng hình học: khai báo {y|muốn gì}, hệ thống lo phần {y|làm thế nào}.', { x: 90, y: 815, size: 28 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1200); await all(Pl.create(1000), fadeIn(code1, 900, 10)); await all(create(sp, 1100), fadeIn(spl)); await all(create(rc, 1000), fadeIn(rcl)); },
    async () => {
      await create(hl, 700); await cap('Join trên {y|cả hai cột}: (x, y) có trong kết quả ⇔ nó thuộc {b|Spat} {y|và} thuộc {y|Rect}.');
      await popDot(probe);
      const A = [1, 5.4], B = [9.5, 1.3];
      await tween(3200, k => {
        const p = [lerp(A[0], B[0], k), lerp(A[1], B[1], k)]; const [x, y] = Pl.P(...p);
        probe.setAttribute('cx', x); probe.setAttribute('cy', y);
        const a = inside(p, SPAT_C), b = inside(p, RC);
        probe.setAttribute('fill', a && b ? C.green : a ? C.blue : b ? C.yellow : C.fg);
      }, linear);
      await fadeOut(probe, 300); await create(inter, 900);
      await cap('Kết quả chính là {g|giao} của hai tập điểm.');
    },
    async () => {
      await all(uncreate(rc, 600), fadeOut(rcl), fadeOut(inter), fadeOut(hl));
      await all(fadeOut(code1, 400), fadeIn(code2, 600));
      await all(create(road, 1200), fadeIn(rdl));
      await create(rin, 600); await indicate(rin.parentNode === Pl.layer ? rin : rin, C.red, 600);
      await cap('Thay Rect bằng Road (một con đường): {y|đúng câu lệnh đó} cho ra giao đường ∩ vùng.');
    },
    async () => { await cap(''); await fadeIn(b1, 600, 10); await fadeIn(b2, 600, 10); }
  ];
});

/* ================= 4. Quan hệ = công thức ================= */
scene('cong-thuc', '4.1.2', 'Nhìn quan hệ như một công thức', s => {
  const lab = s.label('4.1.2 — Bước 1: quan hệ ↔ công thức logic');
  const ttl = s.title('Tập nghiệm của công thức = nội dung quan hệ');
  const Pl = s.plane({ x0: 0, x1: 8, y0: 0, y1: 5, unit: 72, left: 120, top: 190 });
  const pts = [[1, 1], [7, 3], [4, 4], [7, 1]];
  const dots = pts.map(p => Pl.dot(p[0], p[1], { color: C.yellow, r: 9 }));
  const row = s.texRow([tx`\varphi_{\text{Spat}}\equiv`, tx`(x=1\wedge y=1)`, tx`\vee`, tx`(x=7\wedge y=3)`, tx`\vee`, tx`(x=4\wedge y=4)`, tx`\vee`, tx`(x=7\wedge y=1)`], { x: 800, y: 680, anchor: 'c', size: 34 });
  const t1 = s.text('Một tuple [a, b]  ≡  {y|x = a ∧ y = b}', { x: 830, y: 300, size: 32 });
  const t2 = s.text('Cả quan hệ  =  {b|tuyển (∨)} của các {y|hội (∧)}', { x: 830, y: 370, size: 32 });
  const t3 = s.text('Chưa có gì mới… nhưng nếu cho phép\nthêm vị từ {y|≤} và phép {y|+} vào công thức?', { x: 830, y: 470, size: 32, color: C.fg });
  const t4 = s.tex(tx`\Yl{\le},\ \Yl{+}\ \Longrightarrow\ \text{mô tả được cả tập vô hạn}`, { x: 830, y: 790, size: 34 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1200); await Pl.create(1000); await all(dots.map(popDot)); await write(row[0], 700); },
    async () => {
      const pieces = [1, 3, 5, 7];
      for (let i = 0; i < 4; i++) {
        const pc = row[pieces[i]], t = { ...pc._t }; const [px, py] = Pl.P(...pts[i]);
        setT(pc, { x: px - 10, y: py - 20, s: .4 }); op(pc, 1);
        await all(indicate(dots[i], C.yellow, 500), moveT(pc, { x: t.x, y: t.y, s: 1 }, 900), i ? fadeIn(row[pieces[i] - 1], 600) : null);
      }
      await fadeIn(t1, 600, 10);
    },
    async () => { await fadeIn(t2, 600, 10); await all([1, 3, 5, 7].map(i => indicate(row[i], C.yellow, 700))); await all([2, 4, 6].map(i => indicate(row[i], C.blue, 700))); },
    async () => { await fadeIn(t3, 700, 10); await write(t4, 1400); }
  ];
});

/* ================= 5. Nửa mặt phẳng ================= */
scene('nua-mat-phang', '4.1.2', 'Đa giác lồi = hội các nửa mặt phẳng', s => {
  const lab = s.label('4.1.2 — Bước 2: đa giác lồi (Figure 4.1b)');
  const ttl = s.title('Mỗi ràng buộc là một {y|nửa mặt phẳng}');
  const Pl = s.plane({ x0: 0, x1: 9, y0: 0, y1: 6, unit: 74, left: 100, top: 190 });
  const cols = [C.yellow, C.teal, C.purple, C.gold];
  const cons = SPAT_C;
  const head = s.tex(tx`\varphi_{\text{Spat}}\ \equiv`, { x: 900, y: 270, size: 38 });
  const fr = [tx`\Yl{y\le x}`, tx`\wedge\ \Tl{x\le 7}`, tx`\wedge\ \Pu{y\ge 1}`, tx`\wedge\ \Go{x+3y-16\le 0}`].map((r, i) => s.tex(r, { x: 940, y: 340 + i * 64, size: 38 }));
  const edges = [[[1, 1], [4, 4]], [[7, 1], [7, 3]], [[1, 1], [7, 1]], [[4, 4], [7, 3]]];
  let region = Pl.poly(Pl.bounds, { color: C.blue, w: 0, fill: C.blue, fo: .0 });
  const gen = s.text('Dạng tổng quát:  {y|αx + βy + γ ≤ 0}  ↔  một nửa mặt phẳng', { x: 100, y: 720, size: 28 });
  const vtx = SPAT.map(p => Pl.dot(p[0], p[1], { r: 7, color: C.fg }));
  const vl = [['(1,1)', -50, 30], ['(7,1)', 10, 30], ['(7,3)', 12, -8], ['(4,4)', -30, -16]].map((v, i) => Pl.text(v[0], SPAT[i][0], SPAT[i][1], { dx: v[1], dy: v[2], size: 22, color: C.dim }));
  const conv = s.text('Hội  =  giao các nửa mặt phẳng  =  một tập {b|lồi}', { x: 900, y: 620, size: 30 });
  const ok = Pl.dot(3, 2, { r: 9, color: C.green }), bad = Pl.dot(8, 3, { r: 9, color: C.red });
  const okT = s.tex(tx`(3,2):\ 2\le 3,\ 3\le 7,\ 2\ge 1,\ 3+6-16=-7\le 0\ \ \Gr{\checkmark}`, { x: 900, y: 700, size: 28 });
  const badT = s.tex(tx`(8,3):\ x=8>7\ \ \Rd{\times}`, { x: 900, y: 760, size: 28 });
  const st = [async () => { await fadeIn(lab, 400); await write(ttl, 1200); await Pl.create(1000); await write(head, 700); await fadeIn(gen, 600); }];
  cons.forEach((c, i) => st.push(async () => {
    const ends = lineEnds(Pl, ...c); const ln = Pl.seg(ends[0], ends[1], { color: cols[i], w: 3 });
    const hp = Pl.half(...c, { color: cols[i], fo: .2 });
    await all(create(ln, 800), write(fr[i], 900));
    await fadeIn(hp, 600);
    const newPts = Pl.S(clipAll(Pl.bounds, cons.slice(0, i + 1)));
    const nr = s.poly(newPts, { parent: Pl.layer, color: C.blue, w: 3, fill: C.blue, fo: .3 });
    await all(fadeIn(nr, 700), fadeOut(region, 700, true), fadeOut(hp, 900, true));
    region = nr;
    await anim(ln, { 'stroke-opacity': .25 }, 400);
    const e = edges[i]; const eg = Pl.seg(e[0], e[1], { color: cols[i], w: 6 }); await create(eg, 500);
  }));
  st.push(async () => { await all(vtx.map(popDot), vl.map(l => fadeIn(l, 500))); await fadeIn(conv, 600, 10); });
  st.push(async () => { await popDot(ok); await write(okT, 1400); await popDot(bad); await write(badT, 900); });
  return st;
});

/* ================= 6. Dựng ràng buộc từ một cạnh ================= */
scene('dung-rang-buoc', '4.1.2', 'Tự dựng ràng buộc từ hai đỉnh', s => {
  const lab = s.label('4.1.2 — từ danh sách đỉnh (vector) sang ràng buộc');
  const ttl = s.title('Cạnh (4,4) → (7,3) cho ra ràng buộc nào?');
  const Pl = s.plane({ x0: 0, x1: 9, y0: 0, y1: 6, unit: 74, left: 100, top: 190 });
  Pl.show(); op(Pl.g, 0);
  const sp = Pl.poly(SPAT, { color: C.blue, w: 3, fill: C.blue, fo: .2 });
  const edge = Pl.seg([4, 4], [7, 3], { color: C.yellow, w: 7 });
  const [ax, ay] = Pl.P(4, 4), [bx, by] = Pl.P(7, 3);
  const dA = s.arrow(ax, ay, bx, by, { color: C.yellow, w: 5, parent: Pl.layer });
  const t1 = s.tex(tx`\Yl{\vec d=(7-4,\ 3-4)=(3,-1)}`, { x: 880, y: 300, size: 36 });
  const [mx, my] = Pl.P(5.5, 3.5);
  const ng = s.g(Pl.layer); op(ng, 0); setT(ng, { x: mx, y: my, r: Math.atan2(1, 3) * 180 / Math.PI });
  s.arrow(0, 0, 110, 0, { color: C.teal, w: 5, parent: ng, show: true });
  const t2 = s.tex(tx`\Tl{\vec n=(1,3)}\quad(\text{xoay }\vec d\text{ một góc }90^\circ)`, { x: 880, y: 380, size: 36 });
  const ends = lineEnds(Pl, 1, 3, -16);
  const ln = Pl.seg(ends[0], ends[1], { color: C.teal, w: 3, dash: '12 9' });
  const t3 = s.tex(tx`\Tl{1}\cdot x+\Tl{3}\cdot y=1\cdot 4+3\cdot 4=16`, { x: 880, y: 460, size: 36 });
  const ip = Pl.dot(3, 2, { r: 9, color: C.green });
  const ipl = Pl.text('(3, 2) bên trong', 3, 2, { dx: -80, dy: 36, size: 22, color: C.green });
  const t4 = s.tex(tx`3+3\cdot 2-16=-7\le 0\ \Rightarrow\ \Yl{x+3y-16\le 0}`, { x: 880, y: 540, size: 36 });
  const hp = Pl.half(1, 3, -16, { color: C.yellow, fo: .14 });
  const t5 = s.text('Lặp lại cho {y|mọi cạnh} rồi lấy {y|hội}:\ndanh sách đỉnh  →  biểu diễn bằng ràng buộc.', { x: 880, y: 650, size: 30 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1100); await Pl.create(900); await create(sp, 900); await create(edge, 600); },
    async () => { await create(dA, 800); await write(t1, 1200); },
    async () => { op(ng, 1); await fadeIn(ng, 300); await moveT(ng, { r: Math.atan2(1, 3) * 180 / Math.PI - 90 }, 1200); await write(t2, 1200); },
    async () => { await create(ln, 1000); await write(t3, 1300); },
    async () => { await popDot(ip); await fadeIn(ipl); await write(t4, 1400); await fadeIn(hp, 700); },
    async () => { await fadeIn(t5, 700, 10); }
  ];
});

/* ================= 7. Polyline ================= */
scene('polyline', '4.1.2', 'Polyline: đường thẳng bị cắt bởi hình chữ nhật bao', s => {
  const lab = s.label('4.1.2 — Bước 3: polyline và tuyển (Figure 4.2)');
  const ttl = s.title('Polyline L = ⟨[4,3], [6,5], [8,2], [10,5]⟩');
  const Pl = s.plane({ x0: 0, x1: 11, y0: 0, y1: 6, unit: 66, left: 90, top: 190 });
  const ghost = Pl.polyline(ROAD, { color: C.dim, w: 2, dash: '6 8' });
  const vd = ROAD.map(p => Pl.dot(p[0], p[1], { r: 6, color: C.dim }));
  const rows = [tx`(4\le x\le 6\wedge 3\le y\le 5\wedge \Yl{x-y-1=0})`, tx`\vee\,(6\le x\le 8\wedge 2\le y\le 5\wedge \Yl{3x+2y-28=0})`, tx`\vee\,(8\le x\le 10\wedge 2\le y\le 5\wedge \Yl{3x-2y-20=0})`]
    .map((r, i) => s.tex(r, { x: 880, y: 300 + i * 80, size: 27 }));
  const tags = ['s₁', 's₂', 's₃'].map((t, i) => s.text(t, { x: 1540, y: 300 + i * 80, size: 28, color: C.blue, anchor: 'r' }));
  const cap = captioner(s, { y: 700, x: 90 });
  const st = [async () => { await fadeIn(lab, 400); await write(ttl, 1200); await Pl.create(900); await all(create(ghost, 900), vd.map(popDot)); }];
  SEGS.forEach((sg, i) => st.push(async () => {
    const e = lineEnds(Pl, ...sg.eq); const ln = Pl.seg(e[0], e[1], { color: C.yellow, w: 4 });
    const [x0, x1, y0, y1] = sg.box;
    const bx = Pl.poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], { color: C.blue, w: 2.5, dash: '9 7', fill: C.blue, fo: .08 });
    if (i === 0) await cap('Đẳng thức {y|x − y − 1 = 0} một mình là {y|cả đường thẳng} — nó đi qua cả (100, 99)!');
    await create(ln, i ? 600 : 1000);
    if (i === 0) await cap('Thêm {b|hình chữ nhật bao} 4 ≤ x ≤ 6, 3 ≤ y ≤ 5 để cắt đường thẳng thành đoạn.');
    await create(bx, i ? 500 : 900);
    const [A, B] = [sg.a, sg.b].sort((p, q) => p[0] - q[0]);
    await shrinkLine(Pl, ln, A, B); await anim(ln, { stroke: C.blue, 'stroke-width': 6 }, 400);
    await all(fadeOut(bx, 500), write(rows[i], 1300), fadeIn(tags[i], 600));
    if (i === 2) await cap('Mỗi đoạn = một hội (∧);  cả polyline = {b|tuyển (∨)} các hội.');
  }));
  return st;
});

/* ================= 8. Đa giác không lồi ================= */
scene('khong-loi', '4.1.2', 'Đa giác không lồi = hợp các phần lồi', s => {
  const lab = s.label('4.1.2 — Bước 4: Figure 4.3');
  const ttl = s.title('P = ⟨(1,1), (9,1), (9,6), (7,3), (4,4)⟩ có một {r|đỉnh lõm}');
  const Pl = s.plane({ x0: 0, x1: 10, y0: 0, y1: 7, unit: 64, left: 90, top: 180 });
  const pg = Pl.poly(PP, { color: C.fg, w: 3.5, fill: C.fg, fo: .1 });
  const rv = Pl.dot(7, 3, { r: 10, color: C.red });
  const chord = Pl.seg([4, 4], [9, 6], { color: C.red, w: 3, dash: '8 7' });
  const cd = [Pl.dot(4, 4, { r: 7, color: C.red }), Pl.dot(9, 6, { r: 7, color: C.red })];
  const cut = Pl.seg([17 / 3, 1], [9, 6], { color: C.yellow, w: 3, dash: '12 8' });
  const cutT = Pl.tex(tx`\Yl{3x-2y=15}`, 5.6, 5.4, { size: 26 });
  const c17 = Pl.tex(tx`\tfrac{17}{3}`, 17 / 3, 1, { dx: -10, dy: 40, size: 24, color: C.yellow });
  const p1 = Pl.poly(P1, { color: C.blue, w: 3.5, fill: C.blue, fo: .45 });
  const p2 = Pl.poly(P2, { color: C.teal, w: 3.5, fill: C.teal, fo: .45 });
  const l1 = Pl.tex(tx`\Bl{P_1}`, 3.6, 2.2, { size: 34 }), l2 = Pl.tex(tx`\Tl{P_2}`, 7.9, 1.8, { size: 34 });
  const f1 = s.tex(tx`\Bl{P_1}:\ y\le x\wedge y\ge 1\wedge x+3y-16\le 0\wedge \Yl{3x-2y-15\le 0}`, { x: 830, y: 300, size: 30 });
  const f2 = s.tex(tx`\Tl{P_2}:\ x\le 9\wedge y\ge 1\wedge \Yl{3x-2y-15\ge 0}`, { x: 830, y: 370, size: 30 });
  const voc = s.text('{y|Symbolic tuple}: hội các ràng buộc → một tập lồi\n{y|Symbolic relation}: tập hữu hạn các symbolic tuple\n{y|DNF}: tuyển của các hội (disjunctive normal form)', { x: 830, y: 500, size: 28, lh: 1.7 });
  const cap = captioner(s, { y: 720, x: 90 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1300); await Pl.create(900); await create(pg, 1300); },
    async () => { await popDot(rv); await indicate(rv, C.red); await all(cd.map(popDot)); await create(chord, 900); await cap('Nối hai điểm của P mà đoạn nối {r|đi ra ngoài} → P không lồi → không thể là {y|một} hội.'); },
    async () => { await all(fadeOut(chord), cd.map(d => fadeOut(d))); await cap('Kéo dài cạnh đi vào đỉnh lõm: cạnh (7,3)–(9,6) nằm trên đường {y|3x − 2y = 15}.'); await create(cut, 1100); await all(write(cutT, 900), write(c17, 700)); },
    async () => {
      await all(fadeIn(p1, 700), fadeIn(p2, 700), fadeOut(pg, 700), fadeOut(rv, 400));
      await all(moveT(p1, { x: -18 }, 700), moveT(p2, { x: 22 }, 700));
      await all(write(l1, 600), write(l2, 600));
      await all(moveT(p1, { x: 0 }, 700), moveT(p2, { x: 0 }, 700));
      await cap('Hai thành phần {b|lồi} P₁, P₂ — chung đoạn biên nằm trên đường cắt.');
    },
    async () => { await write(f1, 1500); await write(f2, 1200); },
    async () => { await cap(''); await fadeIn(voc, 800, 10); }
  ];
});

/* ================= 9. Road ∩ Spat ================= */
scene('giao', '4.1.3', 'Road ∩ Spat: chỉ là nối hai công thức bằng ∧', s => {
  const lab = s.label('4.1.3 — Figure 4.4, Table 4.2');
  const ttl = s.title('Giao Road ∩ Spat tính {y|trên công thức}');
  const Pl = s.plane({ x0: 0, x1: 11, y0: 0, y1: 7, unit: 60, left: 80, top: 180 });
  const p1 = Pl.poly(P1, { color: C.blue, w: 2.5, fill: C.blue, fo: .25 });
  const p2 = Pl.poly(P2, { color: C.teal, w: 2.5, fill: C.teal, fo: .25 });
  const segs = SEGS.map(sg => Pl.seg(sg.a, sg.b, { color: C.gold, w: 5 }));
  const sl = ['s₁', 's₂', 's₃'].map((t, i) => Pl.text(t, ...[[4.4, 4.5], [7.3, 4.2], [9.75, 3.4]][i], { color: C.gold, size: 24 }));
  const pl = [Pl.tex(tx`\Bl{P_1}`, 2.6, 1.5, { size: 28 }), Pl.tex(tx`\Tl{P_2}`, 8.2, 1.6, { size: 28 })];
  const F = s.tex(tx`[\,\Go{s_1}\vee \Go{s_2}\vee \Go{s_3}\,]\ \wedge\ [\,\Bl{P_1}\vee \Tl{P_2}\,]`, { x: 1180, y: 270, anchor: 'c', size: 40 });
  const arr = s.arrow(1180, 300, 1180, 345, { color: C.dim, w: 3 });
  const dist = s.text('phân phối ∧ trên ∨  →  3 × 2 = {y|6} symbolic tuple', { x: 1180, y: 385, anchor: 'c', size: 26, color: C.dim });
  const cellRaw = [[tx`\Go{s_1}\wedge \Bl{P_1}`, tx`\Go{s_1}\wedge \Tl{P_2}`], [tx`\Go{s_2}\wedge \Bl{P_1}`, tx`\Go{s_2}\wedge \Tl{P_2}`], [tx`\Go{s_3}\wedge \Bl{P_1}`, tx`\Go{s_3}\wedge \Tl{P_2}`]];
  const cx = [890, 1210], cy = [460, 545, 630];
  const cards = [], cells = [], res = [];
  const R = [[[[4, 3], [4.75, 3.75]], null], [null, [[43 / 6, 13 / 4], [8, 2]]], [null, [[8, 2], [9, 3.5]]]];
  const resTxt = [['(4,3)→(4.75, 3.75)', '∅'], ['∅', '(7.17, 3.25)→(8,2)'], ['∅', '(8,2)→(9, 3.5)']];
  const red = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) {
    cards.push(s.card(cx[j], cy[i] - 40, 300, 64, {}));
    cells.push(s.tex(cellRaw[i][j], { x: cx[j] + 18, y: cy[i], size: 28 }));
    const r = R[i][j];
    res.push(s.text(resTxt[i][j], { x: cx[j] + 290, y: cy[i] - 2, size: r ? 20 : 30, anchor: 'r', color: r ? C.red : C.dim }));
    red.push(r ? Pl.seg(r[0], r[1], { color: C.red, w: 9 }) : null);
  }
  const cap = captioner(s, { y: 770, x: 80, size: 28 });
  const fin = [tx`(4\le x\le 4.75\wedge 3\le y\le 3.75\wedge x-y-1=0)`, tx`\vee\,(7.17\le x\le 8\wedge 2\le y\le 3.25\wedge 3x+2y-28=0)`, tx`\vee\,(8\le x\le 9\wedge 2\le y\le 3.5\wedge 3x-2y-20=0)`].map((r, i) => s.tex(r, { x: 830, y: 470 + i * 70, size: 25, color: C.red }));
  const note = s.text('(sách làm tròn 43/6 ≈ 7.17)', { x: 830, y: 690, size: 22, color: C.dim });
  const st = [
    async () => { await fadeIn(lab, 400); await write(ttl, 1100); await Pl.create(800); await all(create(p1, 800), create(p2, 800), fadeIn(pl[0]), fadeIn(pl[1])); await all(segs.map(x => create(x, 800)), sl.map(x => fadeIn(x))); },
    async () => { await cap('(x, y) ∈ giao ⇔ thỏa công thức của Road {y|và} công thức của Spat.'); await write(F, 1500); },
    async () => { await create(arr, 500); await fadeIn(dist, 500); await lag([0, 1, 2, 3, 4, 5], i => all(fadeIn(cards[i], 400), write(cells[i], 700)), 150); }
  ];
  for (let i = 0; i < 3; i++) st.push(async () => {
    if (i === 0) await cap('Tính từng cặp: một đoạn ∧ một thành phần lồi.');
    for (let j = 0; j < 2; j++) {
      const k = i * 2 + j; const P = j ? p2 : p1;
      await all(anim(segs[i], { 'stroke-width': 9, stroke: C.yellow }, 300), anim(P, { 'fill-opacity': .6 }, 300), anim(cards[k], { stroke: C.yellow }, 300));
      if (red[k]) await create(red[k], 600); else await wait(250);
      await fadeIn(res[k], 400);
      await all(anim(segs[i], { 'stroke-width': 5, stroke: C.gold }, 300), anim(P, { 'fill-opacity': .25 }, 300), anim(cards[k], { stroke: C.faint }, 300));
    }
  });
  st.push(async () => {
    await cap('Bỏ 3 tuple rỗng → biểu diễn gọn của kết quả (khớp sách):');
    await all([...cards, ...cells, ...res, arr, dist].map(e => fadeOut(e, 500)));
    await lag(fin, f => write(f, 1200), 400); await fadeIn(note, 500);
  });
  st.push(async () => { await cap('Mấu chốt: phép giao ký hiệu {y|chỉ là nối bằng ∧}. Phần khó (tuple rỗng, rút gọn) để cho bước {b|simplification}.'); });
  return st;
});

/* ================= 10. Ba tầng ================= */
scene('ba-tang', '4.1.4', 'Ba tầng: abstract · symbolic · physical', s => {
  const lab = s.label('4.1.4 — Figure 4.5');
  const ttl = s.title('Người dùng hỏi trên bảng — máy tính trên công thức');
  const Ls = [['abstract', C.blue, 300], ['symbolic', C.yellow, 540], ['physical', C.dim, 760]];
  const tags = Ls.map(([t, c, y]) => s.text(t, { x: 90, y, size: 32, color: c, italic: true }));
  const bands = Ls.map(([t, c, y]) => s.rect(70, y - 70, 1460, 120, { color: c, w: 1.5, rx: 18, fill: c, fo: .05 }));
  const R = s.tex(tx`R`, { x: 560, y: 312, anchor: 'c', size: 64, color: C.blue });
  const qR = s.tex(tx`q(R)`, { x: 1160, y: 312, anchor: 'c', size: 60, color: C.blue });
  const aq = s.arrow(620, 292, 1070, 292, { color: C.blue, w: 4 });
  const aqT = s.tex(tx`q`, { x: 845, y: 270, anchor: 'c', size: 40, color: C.blue });
  const phi = s.tex(tx`\varphi`, { x: 560, y: 556, anchor: 'c', size: 64, color: C.yellow });
  const qp = s.tex(tx`q'(\varphi)`, { x: 1160, y: 556, anchor: 'c', size: 60, color: C.yellow });
  const aq2 = s.arrow(620, 536, 1070, 536, { color: C.yellow, w: 4 });
  const aq2T = s.tex(tx`q'`, { x: 845, y: 514, anchor: 'c', size: 40, color: C.yellow });
  const d1 = s.arrow(560, 350, 560, 480, { color: C.dim, w: 3 });
  const d2 = s.arrow(1160, 480, 1160, 350, { color: C.green, w: 4 });
  const d1T = s.text('biểu diễn hữu hạn', { x: 580, y: 425, size: 22, color: C.dim });
  const d2T = s.text('q′(φ) là biểu diễn\nhữu hạn của q(R)', { x: 1180, y: 410, size: 22, color: C.green });
  const ph = s.text('lưu trữ & thực thi trên đĩa — không bàn chi tiết ở đây', { x: 800, y: 770, anchor: 'c', size: 26, color: C.dim });
  const n1 = s.text('người dùng thấy bảng tuple (điểm) — hữu hạn hay vô hạn đều được', { x: 845, y: 335, size: 20, color: C.dim, anchor: 'c' });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1200); await all(create(bands[0], 700), fadeIn(tags[0])); await write(R, 600); await fadeIn(n1, 500); },
    async () => { await all(create(aq, 800), write(aqT, 600)); await write(qR, 700); },
    async () => { await all(create(bands[1], 700), fadeIn(tags[1])); await all(create(d1, 700), fadeIn(d1T)); await write(phi, 600); await all(create(aq2, 800), write(aq2T, 600)); await write(qp, 700); },
    async () => { await all(create(d2, 800), fadeIn(d2T, 600)); await all(indicate(qR, C.green), indicate(qp, C.green)); },
    async () => { await all(create(bands[2], 700), fadeIn(tags[2])); await fadeIn(ph, 600); }
  ];
});

/* ================= 11. Chọn loại ràng buộc ================= */
scene('tuyen-tinh', '4.1.4', 'Linear: chỉ + và ≤', s => {
  const lab = s.label('4.1.4 — loại ràng buộc quyết định lớp đối tượng');
  const ttl = s.title('Chọn phép toán nào cho ràng buộc?');
  const L = s.tex(tx`\{\,+,\ \le,\ =\,\}`, { x: 420, y: 290, anchor: 'c', size: 52, color: C.yellow });
  const Lt = s.text('linear constraint model', { x: 420, y: 350, anchor: 'c', size: 28, color: C.yellow });
  const Rr = s.tex(tx`\{\,+,\ \times,\ \le,\ =\,\}`, { x: 1180, y: 290, anchor: 'c', size: 52, color: C.purple });
  const Rt = s.text('polynomial constraints', { x: 1180, y: 350, anchor: 'c', size: 28, color: C.purple });
  const div = s.line(800, 230, 800, 760, { color: C.faint, w: 2 });
  const seg = s.line(170, 520, 300, 430, { color: C.blue, w: 5 });
  const tri = s.poly([[340, 540], [480, 540], [440, 420]], { color: C.blue, w: 3.5, fill: C.blue, fo: .3 });
  const cube = s.g(); op(cube, 0);
  [[[540, 470], [620, 470], [620, 550], [540, 550]], [[570, 440], [650, 440], [650, 520], [570, 520]]].forEach(q => E('path', { d: ptsD(q, true), fill: C.blue, 'fill-opacity': .15, stroke: C.blue, 'stroke-width': 3 }, cube));
  [[540, 470, 570, 440], [620, 470, 650, 440], [620, 550, 650, 520], [540, 550, 570, 520]].forEach(l => E('line', { x1: l[0], y1: l[1], x2: l[2], y2: l[3], stroke: C.blue, 'stroke-width': 3 }, cube));
  const lt = s.text('đoạn thẳng · đa giác · đa diện', { x: 420, y: 620, anchor: 'c', size: 28 });
  const circ = s.circle(1180, 465, 85, { fill: C.purple, fo: .3, color: C.purple, w: 4 });
  const ct = s.tex(tx`x^2+y^2\le 1`, { x: 1180, y: 625, anchor: 'c', size: 40 });
  const ct2 = s.text('đường cong bậc cao — nhưng {r|tính toán đắt hơn}', { x: 1180, y: 680, anchor: 'c', size: 26 });
  const cross = s.g(); op(cross, 0); E('line', { x1: 1080, y1: 365, x2: 1280, y2: 565, stroke: C.red, 'stroke-width': 7 }, cross); E('line', { x1: 1280, y1: 365, x2: 1080, y2: 565, stroke: C.red, 'stroke-width': 7 }, cross);
  const cap = captioner(s, { y: 810, x: 800, anchor: 'c', size: 30 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1100); await write(L, 900); await fadeIn(Lt); await all(create(seg, 700), create(tri, 900), fadeIn(cube, 900)); await fadeIn(lt, 500); },
    async () => { await create(div, 600); await write(Rr, 900); await fadeIn(Rt); await create(circ, 1000); await write(ct, 900); await fadeIn(ct2, 500); },
    async () => { await create(cross, 600); await cap('Chương này dùng mô hình {y|tuyến tính}: hình tròn đơn vị cần phép nhân → {r|không} biểu diễn được.'); }
  ];
});
