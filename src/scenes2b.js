/* ================= 22. Nested relations ================= */
scene('nested', '4.3.1', 'Nested relations: hình học là một quan hệ lồng', s => {
  const lab = s.label('4.3 Modeling Entity-Based Data — 4.3.1, Table 4.3, 4.4');
  const ttl = s.title('Một thực thể = {b|thuộc tính mô tả} + {y|hình học}');
  const hx = [110, 360, 620];
  const head = s.g(); op(head, 0);
  ['region_name', 'land_use_type', 'geometry'].forEach((t, i) => s.text(t, { x: hx[i], y: 250, size: 26, mono: true, color: i === 2 ? C.yellow : C.blue, parent: head, show: true }));
  E('line', { x1: 90, y1: 270, x2: 860, y2: 270, stroke: C.fg, 'stroke-width': 2 }, head);
  const mkRow = (a, b, y) => { const g = s.g(); op(g, 0); s.text(a, { x: hx[0], y, size: 26, mono: true, parent: g, show: true }); s.text(b, { x: hx[1], y, size: 26, mono: true, parent: g, show: true }); E('line', { x1: 90, y1: y + 45, x2: 860, y2: y + 45, stroke: C.faint, 'stroke-width': 1.5 }, g); return g; };
  const r1 = mkRow('R1', 'forest', 330), r2 = mkRow('R2', 'grass', 440);
  const q = s.text('?', { x: 680, y: 335, size: 44, color: C.red, anchor: 'c' });
  const qn = s.text('một {r|tập điểm} không phải giá trị nguyên tử (1NF)', { x: 110, y: 540, size: 26 });
  const icon = (y, col, pts) => s.poly(pts.map(p => [640 + p[0] * 14, y + 12 - p[1] * 14]), { color: col, w: 2.5, fill: col, fo: .35 });
  const i1 = icon(330, C.green, [[0, 0], [5, 0], [6, 3], [2, 4]]), i2 = icon(440, C.teal, [[0, 1], [4, 0], [7, 2], [3, 4]]);
  const nn = s.text('→ giá trị của thuộc tính = {y|một quan hệ lồng}\n   (non-first-normal-form, một mức lồng)', { x: 110, y: 530, size: 26 });
  const pan = s.card(940, 200, 590, 420, {});
  const pt = s.text('geometry của R1', { x: 970, y: 250, size: 24, color: C.yellow });
  const abs = s.text('abstract (Table 4.3): liệt kê từng điểm (x, y)\n→ {b|vô hạn dòng}', { x: 970, y: 305, size: 24 });
  const sym = s.text('symbolic (Table 4.4): một/nhiều tuple lồi', { x: 970, y: 450, size: 24, color: C.yellow });
  const sq = s.tex(tx`-1\le x\le 1\ \wedge\ -1\le y\le 1`, { x: 970, y: 520, size: 32 });
  const nt = s.text('(hai bảng sách minh họa độc lập — đừng đối chiếu số liệu)', { x: 970, y: 585, size: 19, color: C.dim });
  const code = s.code('Create Table Land_Use\n ( region_name   varchar(30),\n   land_use_type varchar(30),\n   geometry      {y|R(x, y)},\n   Primary Key (region_name) )', { x: 110, y: 640, size: 24 });
  const cn = s.text('R(x1, …, xd): quan hệ lồng d thuộc tính,\nmỗi thuộc tính là một tọa độ thực', { x: 940, y: 700, size: 24, color: C.dim });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await fadeIn(head, 600); await fadeIn(r1, 500); await fadeIn(q, 400); await indicate(q, C.red); await fadeIn(qn, 500); },
    async () => { await all(fadeOut(q, 300), fadeOut(qn, 300)); await create(i1, 700); await fadeIn(r2, 400); await create(i2, 700); await fadeIn(nn, 600); },
    async () => { await fadeIn(pan, 500); await fadeIn(pt, 400); await fadeIn(abs, 600); await fadeIn(sym, 600); await write(sq, 1100); await fadeIn(nt, 400); },
    async () => { await fadeIn(code, 800, 10); await fadeIn(cn, 600); }
  ];
});

/* ================= 23. Truy vấn tương tác ================= */
const COUNTIES = [[[0, 0], [5, 0], [4.5, 3], [0, 3.5]], [[5, 0], [10, 0], [10, 2.8], [4.5, 3]], [[0, 3.5], [4.5, 3], [5, 6], [0, 6]], [[4.5, 3], [10, 2.8], [10, 6], [5, 6]]];
const CCOL = [C.blue, C.teal, C.purple, C.gold];
function mapAt(s, left, bottom, k) { return p => [left + p[0] * k, bottom - p[1] * k]; }
scene('inter', '4.3.2', '@point hay @rect: cùng một câu truy vấn', s => {
  const lab = s.label('4.3.2 — các truy vấn INTER (tham số từ giao diện)');
  const ttl = s.title('Từ khóa {y|in}: biến chạy qua tuple — và qua {y|điểm}');
  const M = mapAt(s, 880, 600, 64);
  const cs = COUNTIES.map((c, i) => s.poly(c.map(M), { color: CCOL[i], w: 2.5, fill: CCOL[i], fo: .08 }));
  const cl = COUNTIES.map((c, i) => { const cx = c.reduce((a, p) => a + p[0], 0) / c.length, cy = c.reduce((a, p) => a + p[1], 0) / c.length; const [x, y] = M([cx, cy]); return s.text('County ' + (i + 1), { x, y: y + 8, anchor: 'c', size: 22, color: CCOL[i] }); });
  const mapNote = s.text('(bản đồ minh họa)', { x: 1520, y: 640, size: 18, color: C.dim, anchor: 'r' });
  const mk = (sel, par) => s.code(`select ${sel}\nfrom   c in County,\n       p in c.geometry\nwhere  p.x = {y|${par}}.x\n  and  p.y = {y|${par}}.y`, { x: 80, y: 250, size: 25 });
  const k1 = mk('county_name, population', '@point'), k2 = mk('county_name, population', '@rect'), k3 = mk('{p}', '@rect');
  const e1 = s.text('{b|c in County}: biến c chạy qua các tuple (SQL chuẩn: County c)', { x: 80, y: 480, size: 23 });
  const e2 = s.text('{b|p in c.geometry}: p chạy qua các {y|điểm} của c', { x: 80, y: 520, size: 23 });
  const tag = (t) => s.text(t, { x: 880, y: 670, size: 26, color: C.yellow });
  const tg1 = tag('INTER-ADM7: county tại điểm được chỉ trên màn hình'), tg2 = tag('INTER-ADM8: các county cắt hình chữ nhật'), tg3 = tag('INTER-ADM9: phần của các county nằm trong hình chữ nhật');
  const [px, py] = M([7, 4.5]);
  const pt = s.g(); op(pt, 0); E('circle', { cx: px, cy: py, r: 9, fill: C.yellow }, pt); E('circle', { cx: px, cy: py, r: 20, fill: 'none', stroke: C.yellow, 'stroke-width': 2 }, pt);
  const RX = [3, 7, 2, 4.2];
  const [rx0, ry0] = M([RX[0], RX[3]]);
  const rr = s.rect(rx0, ry0, 0, 0, { color: C.yellow, w: 3, dash: '10 6', rx: 2, fill: C.yellow, fo: .06 });
  const RC = [[-1, 0, RX[0]], [1, 0, -RX[1]], [0, -1, RX[2]], [0, 1, -RX[3]]];
  const clips = COUNTIES.map((c, i) => s.poly(clipAll(c, RC).map(M), { color: CCOL[i], w: 2, fill: CCOL[i], fo: .75 }));
  const cap = captioner(s, { y: 800, x: 80, size: 27 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await all(cs.map(c => create(c, 900)), cl.map(c => fadeIn(c, 600)), fadeIn(mapNote)); await fadeIn(k1, 700); await fadeIn(e1, 500); await fadeIn(e2, 500); },
    async () => { await fadeIn(tg1, 400); op(pt, 1); await fadeIn(pt, 300, -40); await anim(cs[3], { 'fill-opacity': .55 }, 600); await cap('Điều kiện p.x = @point.x and p.y = @point.y: county {y|chứa} điểm được chỉ → County 4.'); },
    async () => {
      await all(fadeOut(tg1, 300), fadeOut(pt, 300), anim(cs[3], { 'fill-opacity': .08 }, 300)); await all(fadeOut(k1, 400), fadeIn(k2, 400)); await fadeIn(tg2, 400);
      op(rr, 1); const [rx1, ry1] = M([RX[1], RX[2]]);
      await tween(1200, k => { rr.setAttribute('width', (rx1 - rx0) * k); rr.setAttribute('height', (ry1 - ry0) * k); });
      await all(cs.map(c => anim(c, { 'fill-opacity': .5 }, 600)));
      await cap('Chỉ đổi {y|@point → @rect}: cú pháp giữ nguyên, vì điểm hay hình chữ nhật đều là {b|tập điểm}.');
    },
    async () => { await fadeOut(tg2, 300); await all(fadeOut(k2, 400), fadeIn(k3, 400)); await fadeIn(tg3, 400); await all(cs.map(c => anim(c, { 'fill-opacity': .05 }, 500))); await all(clips.map(c => create(c, 800))); await cap('select {y|{p}}: gom các điểm thành quan hệ lồng → trả về {y|hình học} của phần giao.'); },
    async () => { await cap('Không cần chọn hàm hình học riêng cho điểm hay hình chữ nhật — {y|một câu truy vấn} dùng cho cả hai.'); }
  ];
});

/* ================= 24. Overlay ================= */
scene('overlay', '4.3.2', 'Overlay hai theme (SPAT-ADM-LU2)', s => {
  const lab = s.label('4.3.2 — SPAT-ADMR1, SPAT-ADM-LU1, SPAT-ADM-LU2');
  const ttl = s.title('Overlay = giao {y|mọi cặp} (county, land use)');
  const M = mapAt(s, 880, 600, 64);
  const LU = [{ n: 'forest', c: C.green, p: [[0.5, 0.5], [6.5, 0.5], [6.5, 4.5], [0.5, 4.5]] }, { n: 'living area', c: C.red, p: [[6.5, 0.5], [9.5, 0.5], [9.5, 5.5], [6.5, 4.5]] }];
  const toC = p => { const n = p.length, cons = []; for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n]; const A = b[1] - a[1], B = a[0] - b[0]; cons.push([A, B, -(A * a[0] + B * a[1])]); } return cons; };
  const cs = COUNTIES.map((c, i) => s.poly(c.map(M), { color: C.fg, w: 2, fill: 'none' }));
  const lus = LU.map(l => s.poly(l.p.map(M), { color: l.c, w: 3, fill: l.c, fo: .25, dash: '10 6' }));
  const lul = LU.map((l, i) => s.text(l.n, { x: M(l.p[3])[0] + 10, y: M(l.p[3])[1] + 28, size: 22, color: C.fg }));
  const pieces = []; COUNTIES.forEach((c, i) => LU.forEach(l => { const q = clipAll(c, toC(l.p)); if (q.length > 2) pieces.push(s.poly(q.map(M), { color: CCOL[i], w: 2.5, fill: l.c, fo: .55 })); }));
  const code = s.code('select county_name, land_use_type, {y|{pa}}\nfrom   c in County, lu in Land_Use,\n       pa in c.geometry,\n       pb in lu.geometry\nwhere  {b|pa.x = pb.x and pa.y = pb.y}', { x: 80, y: 250, size: 24 });
  const n1 = s.text('{b|join hình học}: hai biến điểm trùng nhau ⇔ hai thực thể giao nhau', { x: 80, y: 480, size: 23 });
  const n2 = s.text('{y|{pa}}: gom điểm thành quan hệ lồng = hình học của mỗi mảnh', { x: 80, y: 520, size: 23 });
  const n3 = s.text('LU1 (khu dân cư trong San Jose) = cùng join + điều kiện lọc thuộc tính', { x: 80, y: 560, size: 23, color: C.dim });
  const cnt = s.text('', { x: 880, y: 670, size: 26, color: C.yellow });
  const cap = captioner(s, { y: 800, x: 80, size: 27 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await all(cs.map(c => create(c, 800))); await all(lus.map(l => create(l, 900)), lul.map(l => fadeIn(l))); await fadeIn(code, 700); },
    async () => { await fadeIn(n1, 500); await fadeIn(n2, 500); await lag(pieces, p => fadeIn(p, 400), 160); cnt.querySelector('text').firstChild.textContent = `${pieces.length} mảnh (parcel) = ${pieces.length} dòng kết quả`; await fadeIn(cnt, 400); },
    async () => { await fadeIn(n3, 500); await cap('Cặp (county, land use) không giao nhau → không có điểm chung → {y|không sinh dòng nào}.'); }
  ];
});

/* ================= 25. TIN 3D ================= */
scene('tin', '4.4.1', 'Elevation: một tile của TIN', s => {
  const lab = s.label('4.4 Field-Based Data & Moving Objects — 4.4.1, Figure 4.13');
  const ttl = s.title('Độ cao = {y|hàm tuyến tính} của (x, y) trên mỗi tam giác');
  const g3 = s.g(); op(g3, 1);
  const st = { yaw: -0.3, prism: 0, tile: 0, lbl: 0, q: 0, iso: null, show: 0 };
  const ZS = 0.2, H = [10, 18, 13], T = [[0, 0], [4, 0], [0, 3]];
  const cam = { cx: 210, cy: 730, s: 84, yaw: -0.3, pitch: 0.5 };
  const F = (x, y) => 10 + 2 * x + y;
  const render = () => {
    g3.innerHTML = ''; if (!st.show) return; cam.yaw = st.yaw; const pr = cam3(cam);
    const L = (a, b, o = {}) => { const [x1, y1] = pr(...a), [x2, y2] = pr(...b); return E('line', { x1, y1, x2, y2, stroke: o.c || C.fg, 'stroke-width': o.w || 2, 'stroke-dasharray': o.d, opacity: o.op ?? 1 }, g3); };
    const Pg = (pts, o = {}) => E('path', { d: ptsD(pts.map(p => pr(...p)), true), fill: o.f || 'none', 'fill-opacity': o.fo ?? 1, stroke: o.c || 'none', 'stroke-width': o.w || 2, opacity: o.op ?? 1 }, g3);
    const Tx = (t, p, o = {}) => { const [x, y] = pr(...p); const e = E('text', { x: x + (o.dx || 0), y: y + (o.dy || 0), fill: o.c || C.fg, 'font-size': o.sz || 22, 'font-family': FONT, 'font-style': o.it ? 'italic' : null, 'text-anchor': o.a || 'start' }, g3); e.textContent = t; };
    for (let x = 0; x <= 5; x++) L([x, 0, 0], [x, 4, 0], { c: C.grid, op: .3, w: 1.2 });
    for (let y = 0; y <= 4; y++) L([0, y, 0], [5, y, 0], { c: C.grid, op: .3, w: 1.2 });
    L([0, 0, 0], [5.6, 0, 0]); L([0, 0, 0], [0, 4.6, 0]); L([0, 0, 0], [0, 0, 22 * ZS]);
    Tx('x', [5.8, 0, 0], { it: 1, sz: 26 }); Tx('y', [0, 4.8, 0], { it: 1, sz: 26 }); Tx('h', [0, 0, 22.6 * ZS], { it: 1, sz: 26, dx: -6 });
    [10, 20].forEach(h => { L([0, 0, h * ZS], [-0.2, 0, h * ZS]); });
    Pg(T.map(p => [p[0], p[1], 0]), { f: C.blue, fo: .3, c: C.blue, w: 2.5 });
    if (st.prism > 0) { const ph = st.prism * 20 * ZS; T.forEach(p => L([p[0], p[1], 0], [p[0], p[1], ph], { c: C.blue, op: .55 })); Pg(T.map(p => [p[0], p[1], ph]), { c: C.blue, w: 1.2, op: .22 }); [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => Pg([[...T[i], 0], [...T[j], 0], [...T[j], ph], [...T[i], ph]], { f: C.blue, fo: .05 })); }
    if (st.tile > 0) Pg(T.map((p, i) => [p[0], p[1], st.tile * H[i] * ZS]), { f: C.teal, fo: .5, c: C.teal, w: 2.5 });
    if (st.lbl > 0) T.forEach((p, i) => { L([p[0], p[1], 0], [p[0], p[1], H[i] * ZS], { c: C.dim, d: '5 5', op: st.lbl }); Tx(`h=${H[i]}`, [p[0], p[1], H[i] * ZS], { dx: [-70, 12, -70][i], dy: [4, 6, -8][i], c: C.teal, sz: 22 }); });
    if (st.q > 0) { const hz = st.q * 13 * ZS; L([1, 1, 0], [1, 1, hz], { c: C.yellow, w: 3 }); const [x, y] = pr(1, 1, hz); E('circle', { cx: x, cy: y, r: 7, fill: C.yellow }, g3); const [x0, y0] = pr(1, 1, 0); E('circle', { cx: x0, cy: y0, r: 6, fill: C.yellow }, g3); }
    if (st.iso != null) {
      const c = st.iso, z = c * ZS;
      Pg([[0, 0, z], [4.5, 0, z], [4.5, 3.5, z], [0, 3.5, z]], { f: C.yellow, fo: .1, c: C.yellow, w: 1, op: .7 });
      const pts = []; for (let i = 0; i < 3; i++) { const a = T[i], b = T[(i + 1) % 3]; const fa = F(...a) - c, fb = F(...b) - c; if (Math.abs(fa) < 1e-9) pts.push(a); else if (fa * fb < 0) { const t = fa / (fa - fb); pts.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]); } }
      if (pts.length >= 2) { L([...pts[0], z], [...pts[1], z], { c: C.yellow, w: 5 }); L([...pts[0], 0], [...pts[1], 0], { c: C.yellow, w: 3, d: '8 6' }); }
      Tx(`h = ${c.toFixed(1)}`, [4.5, 3.5, z], { dx: 10, dy: 4, c: C.yellow });
    }
  };
  const tw = (dur, o) => { const f = { ...st }; return tween(dur, k => { for (const key in o) st[key] = lerp(f[key] ?? 0, o[key], k); render(); }); };
  const T0 = s.tex(tx`\Bl{c_i(x,y)}\ \wedge\ \Tl{h=f(x,y)}`, { x: 960, y: 250, size: 36 });
  const n0 = s.text('{b|cᵢ}: hội bất đẳng thức của tam giác → “hình trụ” trong 3D\n{t|h = f(x, y)}: mặt phẳng cắt hình trụ đó', { x: 960, y: 290, size: 21, color: C.dim });
  const rows = [tx`f(x,y)=a+bx+cy\quad(\text{ví dụ tự đặt})`, tx`(0,0)\mapsto 10:\quad a=10`, tx`(4,0)\mapsto 18:\quad 10+4b=18\ \Rightarrow\ b=2`, tx`(0,3)\mapsto 13:\quad 10+3c=13\ \Rightarrow\ c=1`].map((r, i) => s.tex(r, { x: 960, y: 370 + i * 58, size: 28 }));
  const tup = s.tex(tx`x\ge 0\wedge y\ge 0\wedge 3x+4y\le 12\wedge \Yl{h=10+2x+y}`, { x: 960, y: 625, size: 30 });
  const qy = s.tex(tx`\sigma_{x=1,\,y=1}:\ \ h=10+2+1=\Yl{13}`, { x: 960, y: 690, size: 28 });
  const iso = s.tex(tx`\text{Query 5: }\sigma_{h=c}\ \Rightarrow\ 2x+y=c-10\ \ (\text{một đoạn})`, { x: 960, y: 750, size: 28 });
  const tin = s.tex(tx`\text{TIN}(x,y,h)=\bigvee_i\big(\,t_i(x,y)\wedge h=f_i(x,y)\,\big)`, { x: 960, y: 830, size: 30, color: C.teal });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); st.show = 1; render(); await fadeIn(g3, 600); await write(T0, 1000); await fadeIn(n0, 500); },
    async () => { await tw(1500, { prism: 1, yaw: -0.38 }); },
    async () => { await tw(1500, { tile: 1, yaw: -0.45 }); await tw(600, { lbl: 1 }); },
    async () => { await lag(rows, r => write(r, 900), 300); await write(tup, 1300); },
    async () => { await tw(1200, { q: 1 }); await write(qy, 900); },
    async () => { st.iso = 10.5; render(); await write(iso, 1000); await tw(3500, { iso: 15, yaw: -0.3 }); },
    async () => { await write(tin, 1400); }
  ];
});

/* ================= 26. Trajectory 3D ================= */
scene('quy-dao', '4.4.2', 'Moving objects: quỹ đạo trong (x, y, t)', s => {
  const lab = s.label('4.4.2 — Figure 4.14');
  const ttl = s.title('Điểm chuyển động = đường gấp khúc trong {y|(x, y, t)}');
  const g3 = s.g();
  const PT = [[0, 0, 0], [10, 5, 1], [10, 10, 2], [20, 15, 5]];
  const pos = t => { for (let i = 0; i < 3; i++) { const a = PT[i], b = PT[i + 1]; if (t <= b[2] || i === 2) { const k = (t - a[2]) / (b[2] - a[2]); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), t]; } } };
  const st = { show: 0, yaw: -0.3, pts: 0, u: 0, shadow: 0, slice: 0 };
  const SX = 0.25, SZ = 0.9;
  const cam = { cx: 170, cy: 720, s: 80, yaw: -0.3, pitch: 0.34 };
  const render = () => {
    g3.innerHTML = ''; if (!st.show) return; cam.yaw = st.yaw; const P3 = cam3(cam); const pr = (x, y, t) => P3(x * SX, y * SX, t * SZ);
    const L = (a, b, o = {}) => { const [x1, y1] = pr(...a), [x2, y2] = pr(...b); return E('line', { x1, y1, x2, y2, stroke: o.c || C.fg, 'stroke-width': o.w || 2, 'stroke-dasharray': o.d, opacity: o.op ?? 1, 'stroke-linecap': 'round' }, g3); };
    const Tx = (t, p, o = {}) => { const [x, y] = pr(...p); const e = E('text', { x: x + (o.dx || 0), y: y + (o.dy || 0), fill: o.c || C.fg, 'font-size': o.sz || 21, 'font-family': FONT, 'font-style': o.it ? 'italic' : null, 'text-anchor': o.a || 'start' }, g3); e.textContent = t; };
    const D = (p, r, c) => { const [x, y] = pr(...p); E('circle', { cx: x, cy: y, r, fill: c }, g3); };
    for (let x = 0; x <= 20; x += 5) L([x, 0, 0], [x, 15, 0], { c: C.grid, op: .3, w: 1.2 });
    for (let y = 0; y <= 15; y += 5) L([0, y, 0], [20, y, 0], { c: C.grid, op: .3, w: 1.2 });
    L([0, 0, 0], [22, 0, 0]); L([0, 0, 0], [0, 17, 0]); L([0, 0, 0], [0, 0, 5.6]);
    Tx('x', [23, 0, 0], { it: 1, sz: 26 }); Tx('y', [0, 18, 0], { it: 1, sz: 26 }); Tx('t', [0, 0, 5.8], { it: 1, sz: 26, dx: -4 });
    [10, 20].forEach(v => Tx(String(v), [v, 0, 0], { dy: 24, c: C.dim, a: 'middle', sz: 18 })); Tx('10', [0, 10, 0], { dx: -26, c: C.dim, sz: 18 });
    for (let t = 1; t <= 5; t++) { L([0, 0, t], [0.6, 0, t]); Tx(String(t), [0, 0, t], { dx: -20, dy: 6, c: C.dim, sz: 18 }); }
    if (st.slice > 0) { const z = 3.5; const q = [[0, 0, z], [20, 0, z], [20, 15, z], [0, 15, z]].map(p => pr(...p)); E('path', { d: ptsD(q, true), fill: C.purple, 'fill-opacity': .14 * st.slice, stroke: C.purple, 'stroke-width': 1.5, opacity: st.slice }, g3); Tx('t = t₁ = 3.5', [20, 0, z], { dx: 10, dy: 6, c: C.purple }); }
    if (st.shadow > 0) { const n = 60; for (let i = 0; i < n; i++) { const a = pos(st.u * i / n), b = pos(st.u * (i + 1) / n); L([a[0], a[1], 0], [b[0], b[1], 0], { c: C.gold, w: 2.5, op: .55 * st.shadow }); } }
    if (st.pts > 0) PT.forEach((p, i) => { L([p[0], p[1], 0], p, { c: C.dim, d: '4 5', op: st.pts }); D(p, 6, C.fg); Tx(`P${i}  t=${p[2]}`, p, { dx: [-70, -78, 12, 12][i], dy: [-6, -10, 2, -6][i], c: C.fg, sz: 19 }); });
    if (st.u > 0) {
      let prev = pos(0); const n = 80;
      for (let i = 1; i <= n; i++) { const p = pos(st.u * i / n); L(prev, p, { c: C.gold, w: 4.5 }); prev = p; }
      const p = pos(st.u); D(p, 9, C.yellow); if (st.shadow > 0) { D([p[0], p[1], 0], 6, C.gold); L([p[0], p[1], 0], p, { c: C.gold, d: '3 4', op: .6 }); }
    }
    if (st.slice >= 1) { const p = pos(3.5); D(p, 10, C.red); D([p[0], p[1], 0], 7, C.red); L([p[0], p[1], 0], p, { c: C.red, d: '4 4' }); Tx('(15, 12.5)', [p[0], p[1], 0], { dx: 12, dy: 20, c: C.red }); }
  };
  const tw = (dur, o, ez) => { const f = { ...st }; return tween(dur, k => { for (const key in o) st[key] = lerp(f[key] ?? 0, o[key], k); render(); }, ez); };
  const clock = s.text('', { x: 80, y: 220, size: 28, color: C.yellow, mono: true }); const ck = clock.querySelector('text');
  const rows = [tx`(x=10t\wedge y=5t\wedge 0\le t\le 1)`, tx`\vee\,(y=5t\wedge x=10\wedge 5\le y\le 10)`, tx`\vee\,(3x=10t+10\wedge 3y=5t+20\wedge 2\le t\le 5)`].map((r, i) => s.tex(r, { x: 960, y: 250 + i * 62, size: 28 }));
  const vt = [tx`[0,1]:\ P_0\to P_1,\ \ v=(10,\ 5)`, tx`[1,2]:\ P_1\to P_2,\ \ v=(0,\ 5)`, tx`[2,5]:\ P_2\to P_3,\ \ v=(\tfrac{10}{3},\ \tfrac{5}{3})`].map((r, i) => s.tex(r, { x: 960, y: 470 + i * 58, size: 27, color: C.dim }));
  const gen = s.tex(tx`\text{Traj}(x,y,t)=\bigvee_i\big(t_i(t)\wedge x=f_i(t)\wedge y=g_i(t)\big)`, { x: 960, y: 690, size: 28, color: C.gold });
  const pw = s.text('tốc độ không đổi mỗi khoảng → {y|tuyến tính từng khúc} (piecewise linear)', { x: 960, y: 740, size: 20, color: C.dim });
  const q1 = s.code('select x, y from Traj1 where t = t₁', { x: 960, y: 810, size: 23 });
  const q1r = s.text('→ (15, 12.5) khi t₁ = 3.5', { x: 960, y: 852, size: 23, color: C.red });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); st.show = 1; render(); await fadeIn(g3, 600); await tw(800, { pts: 1 }); },
    async () => {
      op(clock, 1); const y0 = st.yaw;
      await tween(5000, k => { st.u = 5 * k; st.shadow = 1; st.yaw = lerp(y0, -0.42, k); render(); ck.firstChild.textContent = 't = ' + (5 * k).toFixed(2); }, linear);
    },
    async () => { await lag(rows, r => write(r, 1100), 300); await lag(vt, r => write(r, 800), 200); },
    async () => { await write(gen, 1300); await fadeIn(pw, 500); },
    async () => { await fadeIn(q1, 500); await tw(1200, { slice: 1, yaw: -0.32 }); await fadeIn(q1r, 500); }
  ];
});

/* ================= 27. 4.4.3 Truy vấn ================= */
scene('truy-van-443', '4.4.3', 'Truy vấn trên field & moving points', s => {
  const lab = s.label('4.4.3 — Query 1–7, interpolation key (ikey)');
  const ttl = s.title('Chỉ là {y|chọn}, {y|chiếu}, {y|join} trên các thuộc tính ikey');
  const sch = [['Map', '(x, y, name)', '(x, y)', 'loại sử dụng đất tại mỗi vị trí'], ['Traj1, Traj2', '(t, x, y, a)', 't', 'vị trí và độ cao a của hai máy bay'], ['TINh', '(x, y, h)', '(x, y)', 'độ cao mặt đất h']]
    .map((r, i) => { const g = s.g(); op(g, 0); [80, 320, 560, 720].forEach((x, j) => s.text(r[j], { x, y: 210 + i * 42, size: 23, mono: j < 3, color: j === 2 ? C.yellow : j === 3 ? C.dim : C.fg, parent: g, show: true })); return g; });
  const ik = s.text('ikey', { x: 560, y: 175, size: 20, color: C.yellow });
  const Q = [
    ['Q1', 'select x, y from Traj1 where t = t1', 'σ(t=t₁), π(x,y)', 'máy bay 1 ở đâu lúc t₁'],
    ['Q2', 'select t from Traj2 where x = a and y = b', 'σ(x,y), π(t)', 'máy bay 2 qua (a,b) lúc nào'],
    ['Q3', 'Traj1 T1, Traj2 T2 … T1.x=T2.x, T1.y=T2.y, T1.t=T2.t', '⋈ trên x,y,t', 'cùng chỗ cùng lúc (giao trong (x,y,t))'],
    ['Q4', 'select g.x, g.y, a - h  from TINh g, Traj1 f …', '⋈ trên x,y', 'độ cao so với mặt đất a − h'],
    ['Q5', 'select x, y from TINh where h = 1000', 'σ(h=1000)', 'đường đồng mức (isoline)'],
    ['Q6', 'select x, y, t, h  from TINh g, Traj1 f …', 'Traj1 ⋈ TINh', 'h = f(t) dưới máy bay'],
    ['Q7', '… where h between 1000 and 2000 and name=\'forest\'', '⋈ + σ', 'rừng ở độ cao 1000–2000 m']
  ].map((r, i) => { const y = 370 + i * 62; const g = s.g(); op(g, 0); s.text(r[0], { x: 80, y, size: 22, color: C.yellow, parent: g, show: true }); s.text(r[1], { x: 140, y, size: 19, mono: true, parent: g, show: true }); s.text(r[2], { x: 950, y, size: 22, color: C.teal, parent: g, show: true }); s.text(r[3], { x: 1160, y, size: 20, color: C.dim, parent: g, show: true }); return g; });
  const cap = captioner(s, { y: 830, x: 80, size: 26 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await fadeIn(ik, 300); await lag(sch, r => fadeIn(r, 500, 8), 200); },
    async () => { await lag(Q.slice(0, 3), r => fadeIn(r, 500, 8), 400); },
    async () => { await lag(Q.slice(3), r => fadeIn(r, 500, 8), 400); await cap('“between 1000 and 2000” = {y|h ≥ 1000 ∧ h ≤ 2000}: đúng kiểu ràng buộc tuyến tính. Q4 ghép {y|hai nguồn nội suy} khác nhau.'); },
    async () => { await cap('Người dùng không cần biết ràng buộc, công thức hay số chiều — chỉ dùng {y|SQL quen thuộc}.'); }
  ];
});

/* ================= 28. Tổng kết ================= */
scene('tong-ket', 'Tổng kết', 'Vòng lặp của cả chương', s => {
  const lab = s.label('Tổng kết · 4.5 Bibliographic Notes');
  const ttl = s.title('Giữ vòng này trong đầu — phần còn lại là chi tiết');
  const cx = 800, cy = 470, R = 200;
  const N = [['quan hệ {b|vô hạn}', -90], ['công thức {y|hữu hạn} (DNF)', 0], ['tính trên công thức\n∧ · khử ∃ · simplify', 90], ['kết quả {g|cũng là} công thức', 180]];
  const nodes = N.map(([t, a]) => { const r = a * Math.PI / 180; const x = cx + Math.cos(r) * (R + (a === 0 || a === 180 ? 190 : 0)), y = cy + Math.sin(r) * (R + (a === -90 ? 34 : a === 90 ? 50 : 0)); return s.text(t, { x, y: y + 8, anchor: 'c', size: 30 }); });
  const arcs = [0, 1, 2, 3].map(i => { const a0 = (N[i][1] + 22) * Math.PI / 180, a1 = (N[(i + 1) % 4][1] - 22 + (i === 3 ? 360 : 0)) * Math.PI / 180; const pts = []; for (let k = 0; k <= 30; k++) { const a = lerp(a0, a1, k / 30); pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); } const g = s.g(); op(g, 0); E('path', { d: ptsD(pts), fill: 'none', stroke: C.dim, 'stroke-width': 3 }, g); const p = pts[30], q = pts[28]; const an = Math.atan2(p[1] - q[1], p[0] - q[0]); E('path', { d: ptsD([p, [p[0] - Math.cos(an - .45) * 16, p[1] - Math.sin(an - .45) * 16], [p[0] - Math.cos(an + .45) * 16, p[1] - Math.sin(an + .45) * 16]], true), fill: C.dim }, g); return g; });
  const dot = s.circle(cx, cy - R, 10, { fill: C.yellow });
  const sql = s.text('người dùng chỉ viết {y|SQL}', { x: cx, y: cy + 10, anchor: 'c', size: 24, color: C.dim });
  const bib = s.text('Nguồn gốc: [KKR90], [KKR95] · tổng hợp [KLP00] · dense linear FO(<, +, 0, 1) → tập {b|semilinear} · dense polynomial FO(<, +, ×, 0, 1) → {p|semialgebraic} · đại số theo [GST94]', { x: 800, y: 830, anchor: 'c', size: 20, color: C.dim });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); for (let i = 0; i < 4; i++) { await fadeIn(nodes[i], 500, 10); await create(arcs[i], 600); } await fadeIn(sql, 500); },
    async () => { op(dot, 1); await tween(4000, k => { const a = (-90 + 360 * k) * Math.PI / 180; dot.setAttribute('cx', cx + Math.cos(a) * R); dot.setAttribute('cy', cy + Math.sin(a) * R); }, linear); await fadeOut(dot, 400); },
    async () => { await fadeIn(bib, 700); }
  ];
});
