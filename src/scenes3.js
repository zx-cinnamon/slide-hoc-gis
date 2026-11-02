/* ================= Cảnh bổ sung (giải thích dễ hiểu) ================= */
function miniTable(s, x, y, title, cols, rows, o = {}) {
  const g = s.g(); op(g, 0); const cw = o.cw || 110;
  s.text(title, { x, y, size: o.ts || 26, color: o.tc || C.yellow, parent: g, show: true });
  cols.forEach((c, i) => s.text(c, { x: x + i * cw, y: y + 40, size: 20, color: C.dim, parent: g, show: true, mono: true }));
  E('line', { x1: x - 8, y1: y + 54, x2: x + cw * cols.length - 10, y2: y + 54, stroke: C.faint, 'stroke-width': 1.5 }, g);
  rows.forEach((r, j) => r.forEach((v, i) => s.text(v, { x: x + i * cw, y: y + 88 + j * 36, size: 22, parent: g, show: true, mono: true, color: o.rc || C.fg })));
  g._rowY = j => y + 88 + j * 36;
  return g;
}
function setTxt(el, str, color) { const sp = el.querySelector('tspan'); sp.textContent = str; if (color) sp.setAttribute('fill', color); }
function clipSeg(A, B, cons) {
  let lo = 0, hi = 1;
  for (const [a, b, c] of cons) {
    const fa = a * A[0] + b * A[1] + c, fb = a * B[0] + b * B[1] + c;
    if (Math.abs(fb - fa) < 1e-12) { if (fa > 1e-9) return null; continue; }
    const t = fa / (fa - fb);
    if (fa > 0) lo = Math.max(lo, t); else if (fb > 0) hi = Math.min(hi, t);
  }
  return hi - lo > 1e-9 ? [lo, hi] : null;
}
const at = (A, B, t) => [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
const polyCons = p => p.map((a, i) => { const b = p[(i + 1) % p.length]; const A = b[1] - a[1], B = a[0] - b[0]; return [A, B, -(A * a[0] + B * a[1])]; });

/* ---------- Ba tầng: ví dụ dễ hiểu ---------- */
scene('ba-tang-vi-du', '4.1.4', 'Nói dễ hiểu: hỏi trên bảng, tính trên công thức', s => {
  const lab = s.label('4.1.4 — ví dụ minh họa cho Figure 4.5');
  const ttl = s.title('Người dùng {b|nghĩ} bằng bảng — máy tính {y|làm} bằng công thức');
  const dv = s.line(800, 170, 800, 760, { color: C.faint, w: 2 });
  const hL = s.text('Người dùng nghĩ (abstract)', { x: 400, y: 200, anchor: 'c', size: 28, color: C.blue });
  const hR = s.text('Máy tính làm (symbolic)', { x: 1200, y: 200, anchor: 'c', size: 28, color: C.yellow });
  const tS = miniTable(s, 90, 250, 'Spat(x, y)', ['x', 'y'], [['1', '1'], ['1.001', '1'], ['⋮', '⋮']], { cw: 110, tc: C.blue });
  const tR = miniTable(s, 440, 250, 'Rect(x, y)', ['x', 'y'], [['3', '2'], ['3.001', '2'], ['⋮', '⋮']], { cw: 110, tc: C.blue });
  const inf = s.text('mỗi bảng có {r|vô hạn dòng}', { x: 400, y: 470, anchor: 'c', size: 24 });
  const aL = s.arrow(400, 490, 400, 545, { color: C.blue, w: 3 });
  const qL = s.code('select x, y from Spat, Rect\nwhere Spat.x = Rect.x and Spat.y = Rect.y', { x: 400, y: 585, anchor: 'c', size: 20 });
  const rL = s.text('kết quả: lại vô hạn dòng → {r|không thể quét từng dòng}', { x: 400, y: 680, anchor: 'c', size: 24 });
  const f1 = s.tex(tx`\varphi_{\text{Spat}}:\ y\le x\wedge x\le 7\wedge y\ge 1\wedge x+3y\le 16`, { x: 840, y: 290, size: 27 });
  const f2 = s.tex(tx`\varphi_{\text{Rect}}:\ 3\le x\le 8\wedge 2\le y\le 4.5`, { x: 840, y: 350, size: 27 });
  const fin = s.text('mỗi công thức: {y|vài ràng buộc}, hữu hạn', { x: 1200, y: 400, anchor: 'c', size: 22, color: C.dim });
  const aR = s.arrow(1200, 425, 1200, 480, { color: C.yellow, w: 3 });
  const aRt = s.text('q′ = nối bằng ∧', { x: 1220, y: 460, size: 22, color: C.yellow });
  const res = s.tex(tx`\varphi_{\text{Spat}}\wedge\varphi_{\text{Rect}}\quad(6\ \text{ràng buộc})`, { x: 1200, y: 530, anchor: 'c', size: 30, color: C.yellow });
  const ask = s.text('Hỏi: điểm {g|(5, 3)} có trong kết quả không?', { x: 800, y: 790, anchor: 'c', size: 28 });
  const qq = s.text('?', { x: 400, y: 735, anchor: 'c', size: 40, color: C.red });
  const ck1 = s.tex(tx`3\le 5\ \Gr{\checkmark}\ \ 5\le 7\ \Gr{\checkmark}\ \ 3\ge 1\ \Gr{\checkmark}\ \ 14\le 16\ \Gr{\checkmark}`, { x: 840, y: 610, size: 26 });
  const ck2 = s.tex(tx`3\le 5\le 8\ \Gr{\checkmark}\ \ 2\le 3\le 4.5\ \Gr{\checkmark}\ \ \Rightarrow\ \Gr{\text{có}}`, { x: 840, y: 665, size: 26 });
  const sum = s.text('Thay số vào công thức kết quả  =  tra trong bảng kết quả. Người dùng {y|không bao giờ} phải thấy công thức.', { x: 800, y: 850, anchor: 'c', size: 26 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1100); await create(dv, 500); await fadeIn(hL, 500); await all(fadeIn(tS, 600), fadeIn(tR, 600)); await fadeIn(inf, 500); await create(aL, 400); await fadeIn(qL, 600); await fadeIn(rL, 500); },
    async () => { await fadeIn(hR, 500); await write(f1, 1300); await write(f2, 900); await fadeIn(fin, 400); await all(create(aR, 400), fadeIn(aRt, 400)); await write(res, 1100); },
    async () => { await fadeIn(ask, 500); await fadeIn(qq, 400); await write(ck1, 1300); await write(ck2, 1100); },
    async () => { await all(fadeOut(ask, 300)); await fadeIn(sum, 600, 10); }
  ];
});

/* ---------- Định nghĩa nói nôm na ---------- */
scene('dinh-nghia-de-hieu', '4.2.1', 'Định nghĩa, nói nôm na', s => {
  const lab = s.label('4.2.1 — hiểu định nghĩa linear constraint relation');
  const ttl = s.title('Một tập điểm “mô tả được bằng + và ≤”');
  const say = s.text('S là {y|linear constraint relation} nếu có một công thức φ, chỉ dùng {y|+, ≤, =} và số,\nsao cho: {g|thay tọa độ của điểm p vào φ → đúng} chính xác khi {g|p nằm trong S}.', { x: 80, y: 205, size: 28 });
  const Pl = s.plane({ x0: 0, x1: 9, y0: 0, y1: 6, unit: 62, left: 90, top: 320 });
  const sp = Pl.poly(SPAT, { color: C.blue, w: 3, fill: C.blue, fo: .25 });
  const Sl = Pl.text('S', 2.6, 1.6, { size: 30, color: C.blue });
  const rowsR = [tx`y\le x`, tx`x\le 7`, tx`y\ge 1`, tx`x+3y-16\le 0`];
  const hd = s.tex(tx`\varphi(x,y):`, { x: 880, y: 360, size: 32 });
  const rows = rowsR.map((r, i) => s.tex(r, { x: 920, y: 420 + i * 52, size: 30 }));
  const sts = rowsR.map((r, i) => s.text(' ', { x: 1180, y: 420 + i * 52, size: 30 }));
  const pt = s.text(' ', { x: 880, y: 650, size: 28, mono: true });
  const verdict = s.text(' ', { x: 880, y: 700, size: 28 });
  const probe = Pl.dot(0.5, 5, { r: 10, color: C.fg });
  const ex = s.text('{g|✓} đoạn, đa giác, hợp nhiều đa giác (dùng ∨)        {r|✗} hình tròn x² + y² ≤ 1 (cần phép nhân)', { x: 80, y: 790, size: 26 });
  const kk = s.text('k = số chiều: k = 2 là mặt phẳng (x, y); thêm z hay thời gian t thì k = 3.   φ: “bản mô tả” (representation) · S: “tập được mô tả” (interpretation)', { x: 80, y: 840, size: 21, color: C.dim });
  const evalAt = (p) => {
    const vals = SPAT_C.map(([a, b, c]) => a * p[0] + b * p[1] + c <= 1e-9);
    vals.forEach((v, i) => setTxt(sts[i], v ? '✓' : '✗', v ? C.green : C.red));
    setTxt(pt, `p = (${p[0].toFixed(1)}, ${p[1].toFixed(1)})`, C.fg);
    const all1 = vals.every(Boolean);
    setTxt(verdict, all1 ? 'φ(p) đúng  →  p ∈ S' : 'φ(p) sai  →  p ∉ S', all1 ? C.green : C.red);
    probe.setAttribute('fill', all1 ? C.green : C.red);
    const [x, y] = Pl.P(...p); probe.setAttribute('cx', x); probe.setAttribute('cy', y);
  };
  const path = [[0.5, 5], [3, 2.2], [5, 2.5], [8.2, 2.5], [6, 3.6], [4, 2]];
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 900); await fadeIn(say, 800, 10); },
    async () => { await Pl.create(800); await create(sp, 800); await fadeIn(Sl, 400); await write(hd, 600); await lag(rows, r => write(r, 600), 150); },
    async () => {
      evalAt(path[0]); await all(fadeIn(probe, 300), fadeIn(pt, 300), fadeIn(verdict, 300), sts.map(x => fadeIn(x, 300)));
      for (let i = 0; i < path.length - 1; i++) { const A = path[i], B = path[i + 1]; await tween(1300, k => evalAt(at(A, B, k))); await wait(500); }
    },
    async () => { await fadeIn(ex, 600, 10); await fadeIn(kk, 600); }
  ];
});

/* ---------- Vì sao cần dạng chuẩn ---------- */
scene('vi-sao-dang-chuan', '4.2.1', 'Vì sao cần dạng chuẩn — và vì sao là 2 điều kiện', s => {
  const lab = s.label('4.2.1 — dạng chuẩn');
  const ttl = s.title('Cùng một tập điểm, {y|vô số} cách viết công thức');
  const fs = [tx`y\le x`, tx`x-y\ge 0`, tx`2y\le 2x`, tx`\neg\,(y>x)`, tx`\exists z\,(z=x\wedge y\le z)`].map((r, i) => s.tex(r, { x: 120 + i * 270, y: 250, size: 32 }));
  const M = p => [720 + p[0] * 28, 505 - p[1] * 28];
  const hp = s.poly([[0, 0], [6, 0], [6, 6]].map(M), { color: C.blue, w: 2.5, fill: C.blue, fo: .3 });
  const ax = s.g(); op(ax, 0); E('line', { x1: M([0, 0])[0], y1: M([0, 0])[1], x2: M([6.5, 0])[0], y2: M([6.5, 0])[1], stroke: C.fg, 'stroke-width': 2 }, ax); E('line', { x1: M([0, 0])[0], y1: M([0, 0])[1], x2: M([0, 6.5])[0], y2: M([0, 6.5])[1], stroke: C.fg, 'stroke-width': 2 }, ax);
  const arrs = fs.map((f, i) => s.arrow(120 + i * 270 + 70, 282, 800 + (i - 2) * 25, 325, { color: C.faint, w: 2 }));
  const same = s.text('→ đều là {b|cùng một} nửa mặt phẳng', { x: 940, y: 440, size: 26 });
  const need = s.text('Máy tính cần {y|một khuôn thống nhất} — để công thức trông giống {y|một cái bảng}:', { x: 80, y: 550, size: 28 });
  const c1 = s.card(80, 585, 700, 230), c2 = s.card(820, 585, 700, 230);
  const t1 = s.text('① {y|Không lượng từ} (không ∃, ∀)', { x: 110, y: 630, size: 28 });
  const d1 = s.text('∃ là “có một giá trị nào đó” → muốn thử một điểm phải đi\n{r|tìm} giá trị đó; không ghi thành một dòng được.\nKhông mất gì: trên ℝ luôn khử được ∃ (ví dụ slide sau).', { x: 110, y: 680, size: 22, color: C.fg });
  const t2 = s.text('② Dạng {y|DNF}: (… ∧ …) ∨ (… ∧ …) ∨ …', { x: 850, y: 630, size: 28 });
  const d2 = s.text('mỗi hội (∧) = {y|một dòng} (symbolic tuple),\ndấu ∨ = xếp các dòng thành {y|bảng}.\nPhép toán làm máy móc: giao = ghép từng cặp dòng.', { x: 850, y: 680, size: 22 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await lag(fs, f => write(f, 700), 200); },
    async () => { await all(arrs.map(a => create(a, 500))); await all(fadeIn(ax, 400), create(hp, 800)); await fadeIn(same, 500); },
    async () => { await fadeIn(need, 600, 10); },
    async () => { await fadeIn(c1, 400); await fadeIn(t1, 400); await fadeIn(d1, 600); },
    async () => { await fadeIn(c2, 400); await fadeIn(t2, 400); await fadeIn(d2, 600); }
  ];
});

/* ---------- Ví dụ khử ∃ trên ℝ ---------- */
scene('khong-luong-tu-vd', '4.2.1', 'Ví dụ: công thức có ∃ → dạng không lượng từ', s => {
  const lab = s.label('4.2.1 — “mọi công thức trên ℝ đều có dạng tương đương không lượng từ”');
  const ttl = s.title('Khử ∃: hỏi “{y|có y nào} nằm giữa 1 và x không?”');
  const Pl = s.plane({ x0: 0, x1: 7, y0: 0, y1: 6, unit: 66, left: 90, top: 190 });
  const reg = Pl.poly(clipAll(Pl.bounds, [[0, -1, 1], [-1, 1, 0]]), { color: C.blue, w: 2.5, fill: C.blue, fo: .3 });
  const l1 = Pl.seg([0, 1], [7, 1], { color: C.blue, w: 2, dash: '8 6' }), l2 = Pl.seg([0, 0], [6, 6], { color: C.blue, w: 2, dash: '8 6' });
  const L1 = s.tex(tx`\exists y\ \big(\,1\le y\ \wedge\ y\le x\,\big)`, { x: 760, y: 280, size: 40 });
  const m1 = s.text('vùng xanh: các cặp (x, y) thỏa 1 ≤ y ≤ x', { x: 760, y: 340, size: 24, color: C.dim });
  const vline = Pl.seg([0, 0], [0, 6], { color: C.fg, w: 2, dash: '6 6' });
  const seg = Pl.seg([0, 0], [0, 0], { color: C.green, w: 8 });
  const sh = Pl.seg([1, 0], [1, 0], { color: C.yellow, w: 9 }); setT(sh, { y: -10 });
  const rd = s.text(' ', { x: 760, y: 420, size: 26 });
  const L2 = s.tex(tx`\iff\ \ \Yl{1\le x}`, { x: 760, y: 510, size: 44 });
  const m2 = s.text('“có y ở giữa 1 và x” đúng khi và chỉ khi 1 ≤ x — {y|không còn ∃}.', { x: 760, y: 570, size: 24 });
  const E2 = s.tex(tx`\exists z\,\big(x+z=5\wedge z\ge 0\big)\ \iff\ x\le 5`, { x: 760, y: 680, size: 32 });
  const m3 = s.text('ví dụ khác: thế z = 5 − x vào z ≥ 0. Cách làm tổng quát (Fourier–Motzkin) ở mục 4.2.3.', { x: 760, y: 730, size: 22, color: C.dim });
  const sweep = X => {
    const [vx] = Pl.P(X, 0); vline.setAttribute('x1', vx); vline.setAttribute('x2', vx);
    const ok = X >= 1;
    const [, y1] = Pl.P(X, 1), [, y2] = Pl.P(X, Math.min(X, 6));
    seg.setAttribute('x1', vx); seg.setAttribute('x2', vx); seg.setAttribute('y1', y1); seg.setAttribute('y2', ok ? y2 : y1); seg.setAttribute('opacity', ok ? 1 : 0);
    if (ok) sh.setAttribute('x2', vx);
    setTxt(rd, ok ? `x = ${X.toFixed(1)}: có y (đoạn xanh lá)  ✓` : `x = ${X.toFixed(1)}: không có y nào  ✗`, ok ? C.green : C.red);
  };
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await Pl.create(800); await write(L1, 1200); await all(create(l1, 600), create(l2, 600)); await fadeIn(reg, 600); await fadeIn(m1, 400); },
    async () => { sweep(0.2); op(vline, 1); op(sh, 1); await all(fadeIn(vline, 300), fadeIn(rd, 300)); await tween(4200, k => sweep(lerp(0.2, 6.8, k)), linear); },
    async () => { await write(L2, 1000); await fadeIn(m2, 500); },
    async () => { await write(E2, 1300); await fadeIn(m3, 500); }
  ];
});

/* ---------- First-order: mẫu khớp với bảng ---------- */
scene('first-order-bang', '4.2.2', 'Mẫu được khớp vào bảng thế nào?', s => {
  const lab = s.label('4.2.2 — cấu trúc bảng (dữ liệu minh họa)');
  const ttl = s.title('Đi từng bước: tìm tên bang chứa county {t|94220}');
  const row = s.texRow([tx`\{\ \text{state-name}\ \mid\ \exists\,\Yl{\text{scode}}\ \big(`, tx`\text{State}(\Yl{\text{scode}},\ \text{state-name})`, tx`\wedge`, tx`\text{County}(\Tl{94220},\ \Yl{\text{scode}},\ \Dm{\_}\,)`, tx`\big)\ \}`], { x: 800, y: 230, anchor: 'c', size: 32, gap: 10 });
  const tSt = miniTable(s, 110, 310, 'State', ['scode', 'state-name'], [['06', 'California'], ['32', 'Nevada'], ['41', 'Oregon']], { cw: 150 });
  const tCo = miniTable(s, 760, 310, 'County', ['county-code', 'scode', 'county-name'], [['94220', '06', 'San Jose'], ['94221', '06', 'Santa Clara'], ['70010', '32', 'Washoe']], { cw: 220 });
  const note = s.text('(dữ liệu minh họa)', { x: 1520, y: 300, size: 18, color: C.dim, anchor: 'r' });
  const hl = (x, y, w, c) => s.rect(x, y - 28, w, 40, { color: c, w: 2.5, rx: 6, fill: c, fo: .12 });
  const hC = hl(745, tCo._rowY(0), 690, C.teal), hS = hl(95, tSt._rowY(0), 330, C.yellow);
  const s1 = s.text('① County({t|94220}, scode, _) khớp dòng đầu  →  {y|scode = 06}', { x: 110, y: 560, size: 26 });
  const s2 = s.text('② State({y|06}, state-name) khớp  →  state-name = {g|California}', { x: 110, y: 615, size: 26 });
  const s3 = s.text('Kết quả: { {g|California} }    (cột county-name ứng với “_” — không quan tâm)', { x: 110, y: 670, size: 26 });
  const sql = s.code('select s.state_name\nfrom   State s, County c\nwhere  c.county_code = 94220  -- {t|phép chọn}\n  and  c.scode = s.scode       -- {y|join}', { x: 110, y: 740, size: 22 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await lag(row, r => write(r, 700), 150); await all(fadeIn(tSt, 600), fadeIn(tCo, 600), fadeIn(note)); },
    async () => { await indicate(row[3], C.teal); await create(hC, 700); await fadeIn(s1, 500, 10); },
    async () => { await indicate(row[1], C.yellow); await create(hS, 700); await fadeIn(s2, 500, 10); },
    async () => { await fadeIn(s3, 500, 10); await fadeIn(sql, 700); }
  ];
});

/* ---------- Ví dụ thực tế: bang và highway ---------- */
const STATE = [[1, 1], [6, 0.8], [7.5, 4], [4, 6], [1.2, 5]];
const HWY = [[0, 2.5], [3, 3.5], [5, 2], [9, 5.5]];
scene('vi-du-thuc-te', '4.2.2', 'Ví dụ thực tế: Bang và Highway', s => {
  const lab = s.label('4.2.2 — ba truy vấn mẫu, áp vào bản đồ (minh họa)');
  const ttl = s.title('Thay Spat = {b|một bang}, Road = {o|một highway}');
  const Pl = s.plane({ x0: 0, x1: 10, y0: 0, y1: 7, unit: 60, left: 870, top: 190 });
  const st = Pl.poly(STATE, { color: C.blue, w: 3, fill: C.blue, fo: .2 });
  const hw = Pl.polyline(HWY, { color: C.gold, w: 5 });
  const stl = Pl.text('State (bang)', 2.6, 4.7, { size: 24, color: C.blue }), hwl = Pl.text('Highway', 7.6, 5.6, { size: 24, color: C.gold });
  const SC = polyCons(STATE);
  const inS = [], outS = [];
  for (let i = 0; i < 3; i++) { const A = HWY[i], B = HWY[i + 1]; const r = clipSeg(A, B, SC); if (!r) { outS.push([A, B]); continue; } if (r[0] > 1e-6) outS.push([A, at(A, B, r[0])]); inS.push([at(A, B, r[0]), at(A, B, r[1])]); if (r[1] < 1 - 1e-6) outS.push([at(A, B, r[1]), B]); }
  const q1 = inS.map(([a, b]) => Pl.seg(a, b, { color: C.red, w: 9 }));
  const q2 = outS.map(([a, b]) => Pl.seg(a, b, { color: C.purple, w: 9 }));
  const south = []; for (let i = 0; i < 3; i++) { const A = HWY[i], B = HWY[i + 1]; const m = (B[1] - A[1]) / (B[0] - A[0]); const pc = clipAll(STATE, [[-1, 0, A[0]], [1, 0, -B[0]], [-m, 1, m * A[0] - A[1]]]); if (pc.length > 2) south.push(Pl.poly(pc, { color: C.green, w: 2, fill: C.green, fo: .55 })); }
  const Q = [
    ['Query 1 · highway đi qua bang ở đâu?', tx`\{x,y\mid \text{State}(x,y)\wedge\text{Highway}(x,y)\}`, 'đoạn highway {r|nằm trong} bang'],
    ['Query 2 · đoạn nào nằm ngoài bang?', tx`\{x,y\mid \text{Highway}(x,y)\wedge\neg\,\text{State}(x,y)\}`, 'đoạn highway {p|ngoài} bang'],
    ['Query 3 · phần bang ở phía nam highway', tx`\{x,y\mid \exists y'\,(\text{State}(x,y)\wedge\text{Highway}(x,y')\wedge y\le y')\}`, 'phần bang {g|dưới} highway (cùng x)']
  ].map(([t, f, d], i) => { const g = s.g(); op(g, 0); s.text(t, { x: 80, y: 260 + i * 160, size: 25, color: C.yellow, parent: g, show: true }); s.tex(f, { x: 80, y: 312 + i * 160, size: 26, parent: g, show: true }); s.text(d, { x: 80, y: 356 + i * 160, size: 22, parent: g, show: true }); return g; });
  const sql = s.code('select x, y from State, Highway\nwhere State.x = Highway.x and State.y = Highway.y', { x: 80, y: 760, size: 20, color: C.dim });
  const focus = i => all(Q.map((q, j) => anim(q, { opacity: j === i ? 1 : .3 }, 300)));
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await Pl.create(800); await all(create(st, 900), fadeIn(stl)); await all(create(hw, 900), fadeIn(hwl)); },
    async () => { await fadeIn(Q[0], 500, 10); await all(q1.map(x => create(x, 700))); await fadeIn(sql, 500); },
    async () => { await fadeOut(sql, 300); await all(q1.map(x => fadeOut(x, 300))); await fadeIn(Q[1], 500, 10); await focus(1); await all(q2.map(x => create(x, 700))); },
    async () => { await all(q2.map(x => fadeOut(x, 300))); await fadeIn(Q[2], 500, 10); await focus(2); await lag(south, x => fadeIn(x, 500), 200); }
  ];
});

/* ---------- Còn truy vấn nào khác? ---------- */
scene('truy-van-khac', '4.2.2', 'Ngoài 3 truy vấn trên còn gì nữa?', s => {
  const lab = s.label('4.2.2 — ví dụ thêm (không có trong sách)');
  const ttl = s.title('Mọi công thức ghép từ {y|∧, ∨, ¬, ∃} đều là một truy vấn');
  const Pl = s.plane({ x0: 0, x1: 11, y0: 0, y1: 7, unit: 58, left: 830, top: 190 });
  const p1 = Pl.poly(P1, { color: C.blue, w: 2, fill: C.blue, fo: .2 }), p2 = Pl.poly(P2, { color: C.blue, w: 2, fill: C.blue, fo: .2 });
  const rd = Pl.polyline(ROAD, { color: C.gold, w: 4 });
  const sl = Pl.text('Spat', 2.2, 1.5, { color: C.blue, size: 24 }), rl = Pl.text('Road', 10.1, 5.4, { color: C.gold, size: 24 });
  const I = [
    [tx`\{x,y\mid \text{Spat}(x,y)\vee\text{Road}(x,y)\}`, 'Hợp: gộp vùng và con đường'],
    [tx`\{x,y\mid \text{Spat}(x,y)\wedge x\le 5\}`, 'Chọn theo điều kiện: phần Spat bên trái x = 5'],
    [tx`\{x\mid \exists y\ \text{Spat}(x,y)\}`, 'Chiếu: “bóng” của Spat trên trục x'],
    [tx`\exists x\,\exists y\,\big(\text{Spat}(x,y)\wedge\text{Road}(x,y)\big)`, 'Có/không: Road có cắt Spat không?'],
    [tx`\text{Spat}(3,\,2)\ ?`, 'Một điểm cụ thể có thuộc Spat không?']
  ].map(([f, d], i) => { const g = s.g(); op(g, 0); s.tex(f, { x: 80, y: 260 + i * 98, size: 26, parent: g, show: true }); s.text(d, { x: 80, y: 298 + i * 98, size: 21, color: C.dim, parent: g, show: true }); return g; });
  const uni = s.g(); op(uni, 0); [P1, P2].forEach(p => E('path', { d: ptsD(Pl.S(p), true), fill: C.green, 'fill-opacity': .5, stroke: C.green, 'stroke-width': 2 }, uni)); E('path', { d: ptsD(Pl.S(ROAD)), fill: 'none', stroke: C.green, 'stroke-width': 7 }, uni); Pl.layer.appendChild(uni);
  const x5 = Pl.seg([5, 0], [5, 7], { color: C.yellow, w: 2.5, dash: '8 6' });
  const left = Pl.poly(clipHalf(P1, 1, 0, -5), { color: C.green, w: 2, fill: C.green, fo: .6 });
  const pr = Pl.seg([1, 0], [9, 0], { color: C.green, w: 9 }); setT(pr, { y: -10 });
  const prl = Pl.tex(tx`[1,\,9]`, 5, 0, { dy: -24, size: 26, color: C.green, anchor: 'c' });
  const yes = s.text('ĐÚNG', { x: Pl.X(5.2), y: Pl.Y(6.2), size: 36, color: C.green, weight: 600 });
  const ix = [[[4, 3], [4.75, 3.75]], [[43 / 6, 13 / 4], [8, 2]], [[8, 2], [9, 3.5]]].map(([a, b]) => Pl.seg(a, b, { color: C.red, w: 8 }));
  const d32 = Pl.dot(3, 2, { r: 10, color: C.green }); const d32l = Pl.text('(3, 2) ✓', 3, 2, { dx: 14, dy: 8, size: 22, color: C.green });
  const cap = captioner(s, { y: 800, x: 80, size: 25 });
  const focus = i => all(I.map((q, j) => anim(q, { opacity: j === i ? 1 : .3 }, 300)));
  const clear = (...e) => all(e.flat().map(x => fadeOut(x, 300)));
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await Pl.create(800); await all(create(p1, 700), create(p2, 700), fadeIn(sl), create(rd, 700), fadeIn(rl)); },
    async () => { await fadeIn(I[0], 500, 10); await focus(0); await fadeIn(uni, 600); },
    async () => { await clear(uni); await fadeIn(I[1], 500, 10); await focus(1); await create(x5, 600); await fadeIn(left, 600); },
    async () => { await clear(x5, left); await fadeIn(I[2], 500, 10); await focus(2); await create(pr, 900); await write(prl, 500); await cap('Đây chính là phép chiếu π sẽ gặp ở phần đại số (4.2.3).'); },
    async () => { await clear(pr, prl); await cap(''); await fadeIn(I[3], 500, 10); await focus(3); await all(ix.map(x => create(x, 500))); await fadeIn(yes, 400); await cap('Không còn biến tự do → kết quả chỉ là {g|đúng} / {r|sai}.'); },
    async () => { await clear(ix, yes); await cap(''); await fadeIn(I[4], 500, 10); await focus(4); await popDot(d32); await fadeIn(d32l, 400); },
    async () => { await all(I.map(q => anim(q, { opacity: 1 }, 300))); await cap('∀ cũng viết được: ∀y φ ⇔ ¬∃y ¬φ.  {r|Không} hỏi được: “cách nhau ≤ 2 km” — khoảng cách cần phép nhân.'); }
  ];
});

/* ---------- Closure & computability: câu trả lời ---------- */
scene('closure', '4.2.2', 'Closure & computability: câu trả lời', s => {
  const lab = s.label('4.2.2 — hai câu hỏi trọng tâm');
  const ttl = s.title('Hai câu hỏi — cả hai đều trả lời {g|CÓ}');
  const dv = s.line(800, 170, 800, 820, { color: C.faint, w: 2 });
  const hL = s.text('Closure: kết quả còn là quan hệ ràng buộc?', { x: 400, y: 200, anchor: 'c', size: 26, color: C.yellow });
  const hR = s.text('Computability: có thuật toán tính?', { x: 1200, y: 200, anchor: 'c', size: 26, color: C.yellow });
  const box = (x, y, w, t, c) => { const g = s.g(); op(g, 0); s.rect(x - w / 2, y - 38, w, 64, { color: c, w: 2.5, fill: c, fo: .12, parent: g, show: true }); s.text(t, { x, y: y + 4, anchor: 'c', size: 22, parent: g, show: true }); return g; };
  const b1 = box(190, 300, 300, 'Spat, Road (DNF)', C.blue), b2 = box(610, 300, 300, 'vùng Query 3 (DNF)', C.green), b3 = box(610, 470, 300, '[4, 9] (DNF)', C.green);
  const a1 = s.arrow(345, 300, 455, 300, { color: C.fg, w: 3 }), a1t = s.text('Query 3', { x: 400, y: 280, anchor: 'c', size: 20, color: C.dim });
  const a2 = s.arrow(610, 340, 610, 425, { color: C.fg, w: 3 }), a2t = s.text('chiếu lên x', { x: 625, y: 390, size: 20, color: C.dim });
  const loop = s.curveArrow(460, 470, 180, 345, -80, { color: C.green, w: 3 });
  const lt = s.text('kết quả dùng tiếp\ncho truy vấn sau', { x: 190, y: 470, anchor: 'c', size: 20, color: C.green });
  const an1 = s.text('{g|CÓ}: luôn ra lại DNF tuyến tính —\ngiống SQL: bảng vào → bảng ra.', { x: 400, y: 590, anchor: 'c', size: 25 });
  const an1b = s.text('Vì vậy truy vấn cũng chỉ được dùng + và ≤:\n“cách điểm p không quá 1” sẽ cho {r|hình tròn}\n→ ra ngoài mô hình tuyến tính.', { x: 400, y: 700, anchor: 'c', size: 21, color: C.dim });
  const stg = [['① thay tên quan hệ bằng công thức', tx`\text{Spat}(x,y)\ \to\ \varphi_1(x,y)`], ['② khử lượng từ ∃', tx`\exists y'(\dots)\ \to\ 4\le x\le 6\wedge y\le x-1`], ['③ đưa về DNF', tx`(A_1\vee A_2)\wedge(B_1\vee B_2)\to\textstyle\bigvee_{i,j} A_i\wedge B_j`], ['④ rút gọn', tx`x\le 15,\ x\le 7\ \to\ x\le 7`]]
    .map(([t, f], i) => { const y = 270 + i * 120; const g = s.g(); op(g, 0); s.rect(850, y - 34, 660, 100, { color: C.faint, w: 2, fill: '#161820', fo: 1, parent: g, show: true }); s.text(t, { x: 870, y, size: 22, color: C.yellow, parent: g, show: true }); s.tex(f, { x: 870, y: y + 46, size: 24, parent: g, show: true }); return g; });
  const tok = s.circle(835, 270, 9, { fill: C.yellow });
  const an2 = s.text('{g|CÓ}: luôn ra DNF không lượng từ, chi phí {y|đa thức}\ntheo kích thước dữ liệu → có thuật toán hiệu quả.', { x: 1180, y: 770, anchor: 'c', size: 23 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 900); await create(dv, 400); await fadeIn(hL, 500); await fadeIn(b1, 400); await all(create(a1, 500), fadeIn(a1t)); await fadeIn(b2, 400); await all(create(a2, 500), fadeIn(a2t)); await fadeIn(b3, 400); await all(create(loop, 700), fadeIn(lt, 500)); },
    async () => { await fadeIn(an1, 600, 10); await fadeIn(an1b, 600); },
    async () => { await fadeIn(hR, 500); await lag(stg, g => fadeIn(g, 500, 8), 250); op(tok, 1); await tween(3000, k => tok.setAttribute('cy', 270 + 360 * k), linear); await fadeIn(an2, 600, 10); }
  ];
});

/* ---------- ×, ⋈, ∩, σ: cùng một phép “∧” ---------- */
scene('bon-phep', '4.2.3', '×, ⋈, ∩, σ: thực chất là một phép', s => {
  const lab = s.label('4.2.3 — bốn phép đầu của đại số');
  const ttl = s.title('Bốn phép, một ý: {y|kéo dãn ra đủ biến, rồi lấy giao (∧)}');
  const Pl = s.plane({ x0: 0, x1: 9, y0: 0, y1: 6, unit: 66, left: 90, top: 190 });
  const panel = s.g();
  const T = (raw, y, o = {}) => s.tex(raw, { x: 790, y, size: 28, parent: panel, ...o });
  const X = (str, y, o = {}) => s.text(str, { x: 790, y, size: 24, parent: panel, ...o });
  const objs = [];
  const keep = (...e) => { objs.push(...e); return e[0]; };
  const clearAll = () => all(objs.splice(0).map(e => fadeOut(e, 350)));
  // × : interval × interval = rectangle
  const r1 = keep(Pl.seg([1, 0], [3, 0], { color: C.blue, w: 9 })), r2 = keep(Pl.seg([0, 2], [0, 4], { color: C.gold, w: 9 }));
  const b1 = keep(Pl.poly([[1, 0], [3, 0], [3, 0], [1, 0]], { color: C.blue, w: 0, fill: C.blue, fo: .22 })), b2 = keep(Pl.poly([[0, 2], [0, 2], [0, 4], [0, 4]], { color: C.gold, w: 0, fill: C.gold, fo: .22 }));
  const rect = keep(Pl.poly([[1, 2], [3, 2], [3, 4], [1, 4]], { color: C.green, w: 3, fill: C.green, fo: .6 }));
  const hx = keep(X('① Tích ×: {y|không chung biến}', 250, { color: C.fg, size: 28 }));
  const fx1 = keep(T(tx`\Bl{R_1(x):\ 1\le x\le 3}\qquad \Go{R_2(y):\ 2\le y\le 4}`, 320));
  const fx2 = keep(X('R₁ không nói gì về y → {b|dải dọc};  R₂ không nói gì về x → {o|dải ngang}', 375, { size: 22, color: C.dim }));
  const fx3 = keep(T(tx`R_1\times R_2:\ \Bl{1\le x\le 3}\wedge\Go{2\le y\le 4}`, 440));
  const fx4 = keep(X('= giao hai dải = {g|hình chữ nhật}', 490, { size: 24 }));
  const growB = (poly, pts) => k => poly.setAttribute('d', ptsD(Pl.S(pts(k)), true));
  // ⋈ : polygon R(x,y) with band S(y)
  const RS = [[1, 1], [7, 1], [7, 3], [4, 4]];
  const jR = Pl.poly(RS, { color: C.blue, w: 3, fill: C.blue, fo: .25 });
  const jS = Pl.poly([[0, 2], [9, 2], [9, 3.5], [0, 3.5]], { color: C.gold, w: 2, dash: '8 6', fill: C.gold, fo: .18 });
  const jS0 = Pl.seg([0, 2], [0, 3.5], { color: C.gold, w: 9 });
  const jRes = Pl.poly(clipAll(RS, [[0, -1, 2], [0, 1, -3.5]]), { color: C.green, w: 3, fill: C.green, fo: .6 });
  const hj = X('② Join ⋈: {y|chung một phần biến} (ở đây: y)', 250, { size: 28 });
  const fj1 = T(tx`\Bl{R(x,y)}:\ y\le x\wedge x\le 7\wedge y\ge 1\wedge x+3y\le 16`, 320);
  const fj2 = T(tx`\Go{S(y)}:\ 2\le y\le 3.5`, 375);
  const fj3 = X('S chỉ có y → kéo dãn theo x thành {o|dải ngang}; ghép theo y', 425, { size: 22, color: C.dim });
  const fj4 = T(tx`R\bowtie S:\ \Bl{R}\wedge\Go{2\le y\le 3.5}`, 490);
  // ∩
  const iS = Pl.poly([[3, 2], [8, 2], [8, 4.5], [3, 4.5]], { color: C.gold, w: 2.5, dash: '8 6', fill: C.gold, fo: .15 });
  const iRes = Pl.poly(clipAll(RS, [[-1, 0, 3], [1, 0, -8], [0, -1, 2], [0, 1, -4.5]]), { color: C.green, w: 3, fill: C.green, fo: .6 });
  const hi = X('③ Giao ∩: {y|chung tất cả biến} (x và y)', 250, { size: 28 });
  const fi1 = T(tx`\Go{S(x,y)}:\ 3\le x\le 8\wedge 2\le y\le 4.5`, 320);
  const fi2 = X('không cần kéo dãn — đã cùng không gian', 375, { size: 22, color: C.dim });
  const fi3 = T(tx`R\cap S:\ \Bl{R}\wedge\Go{S}`, 440);
  // σ
  const sH = Pl.half(1, 1, -6.5, { color: C.purple, fo: .18 });
  const sL = Pl.seg([0.5, 6], [6.5, 0], { color: C.purple, w: 2.5, dash: '8 6' });
  const sRes = Pl.poly(clipHalf(RS, 1, 1, -6.5), { color: C.green, w: 3, fill: C.green, fo: .6 });
  const hs = X('④ Chọn σ: ⋈ với {p|một ràng buộc}', 250, { size: 28 });
  const fs1 = T(tx`F:\ \Pu{x+y\le 6.5}\ \ \text{(cũng là một quan hệ: nửa mặt phẳng)}`, 320, { size: 26 });
  const fs2 = T(tx`\sigma_F(R)=R\bowtie F:\ \Bl{R}\wedge\Pu{x+y\le 6.5}`, 390);
  // summary
  const sum = s.g(); op(sum, 0);
  const center = s.tex(tx`t_1\wedge t_2`, { x: 800, y: 560, anchor: 'c', size: 60, color: C.yellow, parent: sum, show: true });
  s.text('chỉ nối ràng buộc — không tính hình học', { x: 800, y: 615, anchor: 'c', size: 24, color: C.dim, parent: sum, show: true });
  const nodes = [['×', 'không chung biến', 260, 300], ['⋈', 'chung một phần', 620, 260], ['∩', 'chung tất cả', 980, 260], ['σ', '⋈ với một ràng buộc', 1340, 300]];
  nodes.forEach(([o, d, x, y]) => { s.text(o, { x, y, anchor: 'c', size: 64, color: C.blue, parent: sum, show: true }); s.text(d, { x, y: y + 44, anchor: 'c', size: 22, parent: sum, show: true }); s.arrow(x + (800 - x) * .15, y + 70, x + (800 - x) * .7, 500, { color: C.faint, w: 3, parent: sum, show: true }); });
  s.text('× là ⋈ khi không có biến chung   ·   ∩ là ⋈ khi mọi biến đều chung   ·   số tuple kết quả = |e₁| · |e₂|', { x: 800, y: 720, anchor: 'c', size: 24, parent: sum, show: true });
  [jR, jS, jS0, jRes, hj, fj1, fj2, fj3, fj4, iS, iRes, hi, fi1, fi2, fi3, sH, sL, sRes, hs, fs1, fs2].forEach(e => op(e, 0));
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1100); await Pl.create(800); await fadeIn(hx, 500); await all(create(r1, 600), create(r2, 600)); await write(fx1, 1100); },
    async () => {
      await fadeIn(fx2, 500); op(b1, 1); op(b2, 1);
      await all(tween(1300, growB(b1, k => [[1, 0], [3, 0], [3, 6 * k], [1, 6 * k]])), tween(1300, growB(b2, k => [[0, 2], [9 * k, 2], [9 * k, 4], [0, 4]])));
      await create(rect, 700); await write(fx3, 1000); await fadeIn(fx4, 500);
    },
    async () => {
      await clearAll(); await fadeIn(hj, 500); await create(jR, 800); await write(fj1, 1100); await create(jS0, 400); await write(fj2, 700);
      await fadeIn(fj3, 400); op(jS, 1); await tween(1200, growB(jS, k => [[0, 2], [9 * k, 2], [9 * k, 3.5], [0, 3.5]])); await create(jRes, 700); await write(fj4, 900);
    },
    async () => { await all([jS, jS0, jRes, hj, fj1, fj2, fj3, fj4].map(e => fadeOut(e, 350))); await fadeIn(hi, 500); await create(iS, 700); await write(fi1, 900); await fadeIn(fi2, 400); await create(iRes, 700); await write(fi3, 800); },
    async () => { await all([iS, iRes, hi, fi1, fi2, fi3].map(e => fadeOut(e, 350))); await fadeIn(hs, 500); await create(sL, 700); await fadeIn(sH, 500); await write(fs1, 1000); await create(sRes, 700); await write(fs2, 1000); },
    async () => { await all([Pl.g, jR, sH, sL, sRes, hs, fs1, fs2].map(e => fadeOut(e, 400))); await fadeIn(sum, 800); await indicate(center, C.yellow); }
  ];
});

/* ---------- Thứ tự cảnh ---------- */
window.ORDER = ['mo-dau', 'tap-diem', 'join', 'cong-thuc', 'nua-mat-phang', 'dung-rang-buoc', 'polyline', 'khong-loi', 'giao', 'ba-tang', 'ba-tang-vi-du', 'tuyen-tinh',
  'nguyen-tu', 'dinh-nghia-de-hieu', 'vi-sao-dang-chuan', 'khong-luong-tu-vd', 'dnf', 'first-order', 'first-order-bang', 'ba-truy-van', 'vi-du-thuc-te', 'truy-van-khac', 'khu-luong-tu', 'closure',
  'dai-so', 'bon-phep', 'selection', 'chieu', 'rut-gon', 'uu-nhuoc',
  'nested', 'inter', 'overlay', 'tin', 'quy-dao', 'truy-van-443', 'tong-ket'];
