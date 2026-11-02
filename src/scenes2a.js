/* ================= 12. 4.2.1 công thức nguyên tử ================= */
scene('nguyen-tu', '4.2.1', 'Công thức nguyên tử của ngôn ngữ L', s => {
  const lab = s.label('4.2 The Linear Constraint Data Model — 4.2.1 biểu diễn dữ liệu');
  const ttl = s.title('Viên gạch duy nhất: {y|đẳng thức / bất đẳng thức tuyến tính}');
  const atom = s.tex(tx`\Yl{a_1}\Bl{x_1}+\Yl{a_2}\Bl{x_2}+\cdots+\Yl{a_p}\Bl{x_p}\ \ \theta\ \ \Yl{a_0},\qquad \theta\in\{=,\ \le\}`, { x: 800, y: 300, anchor: 'c', size: 50 });
  const n1 = s.text('{b|xᵢ}: biến nhận giá trị thực      {y|aᵢ}: hằng số nguyên  (hệ số hữu tỉ → nhân mẫu chung)', { x: 800, y: 385, anchor: 'c', size: 28 });
  const n2 = s.text('aᵢxᵢ chỉ là xᵢ cộng aᵢ lần → chỉ cần: biến, số nguyên, {y|+}, và {y|=} hoặc {y|≤}', { x: 800, y: 435, anchor: 'c', size: 28, color: C.dim });
  const d0 = s.text('Định nghĩa', { x: 800, y: 545, anchor: 'c', size: 26, color: C.yellow });
  const d1 = s.tex(tx`S\subseteq\mathbb{R}^k\ \text{là \emph{linear constraint relation} nếu có}\ \ \varphi(x_1,\dots,x_k)\in L`, { x: 800, y: 610, anchor: 'c', size: 36 });
  const d2 = s.tex(tx`\text{sao cho}\qquad \varphi(p_1,\dots,p_k)\ \text{đúng}\ \iff\ (p_1,\dots,p_k)\in S`, { x: 800, y: 680, anchor: 'c', size: 36 });
  const d3 = s.text('φ: một {y|constraint representation} của S   ·   S: {b|diễn giải} (interpretation) của φ', { x: 800, y: 770, anchor: 'c', size: 26, color: C.dim });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1200); await write(atom, 2200); },
    async () => { await fadeIn(n1, 600, 10); await fadeIn(n2, 600, 10); },
    async () => { await fadeIn(d0, 400); await write(d1, 1600); await write(d2, 1400); await fadeIn(d3, 600); }
  ];
});

/* ================= 13. DNF ================= */
scene('dnf', '4.2.1', 'Dạng chuẩn: không lượng từ + DNF', s => {
  const lab = s.label('4.2.1 — dạng chuẩn để làm việc có hệ thống');
  const ttl = s.title('Một tập S có vô số công thức — ta chọn {y|một dạng chuẩn}');
  const b1 = s.text('① {y|Không lượng từ} (quantifier-free): không mất gì — mọi công thức trên ℝ đều có dạng tương đương không lượng từ.', { x: 80, y: 220, size: 26 });
  const b2 = s.text('② Dạng {y|DNF}:', { x: 80, y: 270, size: 26 });
  const row = s.texRow([tx`\varphi\ \equiv`, tx`\Bl{\bigvee_{i=1}^{n}}`, tx`\Big(\,\Yl{\bigwedge_{j=1}^{m_i}\varphi_{i,j}}\,\Big)`], { x: 470, y: 470, anchor: 'c', size: 56, gap: 22 });
  const ay = s.arrow(row[2]._cx, 545, row[2]._cx + 30, 600, { color: C.yellow, w: 3 });
  const tY = s.text('mỗi hội = một {y|symbolic tuple} tᵢ\n= giao các nửa không gian = tập {b|lồi}', { x: row[2]._cx - 40, y: 645, size: 26 });
  const ab = s.arrow(row[1]._cx, 362, row[1]._cx, 325, { color: C.blue, w: 3 });
  const tB = s.text('cả quan hệ = {b|hợp hữu hạn} các phần lồi', { x: row[1]._cx, y: 308, size: 26, color: C.fg, anchor: 'c' });
  // mini picture: P split into convex pieces
  const M = p => [960 + p[0] * 58, 640 - p[1] * 58];
  const q1 = s.poly(P1.map(M), { color: C.blue, w: 3, fill: C.blue, fo: .4 });
  const q2 = s.poly(P2.map(M), { color: C.teal, w: 3, fill: C.teal, fo: .4 });
  const lt1 = s.tex(tx`\Bl{t_1}`, { x: M([3.8, 2.2])[0], y: M([3.8, 2.2])[1], size: 34 });
  const lt2 = s.tex(tx`\Tl{t_2}`, { x: M([7.7, 1.8])[0], y: M([7.7, 1.8])[1], size: 34 });
  const lr = s.tex(tx`\text{Spat}=\{\Bl{t_1},\ \Tl{t_2}\}`, { x: 1250, y: 720, anchor: 'c', size: 36 });
  const cap = captioner(s, { y: 820, x: 80, size: 26 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1200); await fadeIn(b1, 600, 10); },
    async () => { await fadeIn(b2, 500); await lag(row, r => write(r, 1100), 350); },
    async () => { await all(create(ay, 600), fadeIn(tY, 700)); await all(create(q1, 900), create(q2, 900)); await all(write(lt1, 500), write(lt2, 500)); },
    async () => { await all(create(ab, 600), fadeIn(tB, 700)); await write(lr, 900); },
    async () => { await cap('Hệ quả: đa giác phải được {y|chia thành các phần lồi trước khi lưu} (làm sẵn lúc nạp dữ liệu).'); }
  ];
});

/* ================= 14. Relational calculus ================= */
scene('first-order', '4.2.2', 'First-order queries = relational calculus', s => {
  const lab = s.label('4.2.2 — ngôn ngữ truy vấn first-order');
  const ttl = s.title('Truy vấn là một {y|mẫu} (pattern) cần thỏa');
  const q = s.text('“Tên các bang chứa county mã 94220”', { x: 800, y: 250, anchor: 'c', size: 32, italic: true, color: C.dim });
  const row = s.texRow([tx`\{\ \text{state-name}\ \mid\ \exists\,\Yl{\text{scode}}\ \big(`, tx`\text{State}(\Yl{\text{scode}},\ \text{state-name})`, tx`\wedge`, tx`\text{County}(\Tl{94220},\ \Yl{\text{scode}},\ \Dm{\_}\,)`, tx`\big)\ \}`], { x: 800, y: 370, anchor: 'c', size: 40, gap: 12 });
  const a1 = s.text('{y|cùng biến scode ở hai nơi}  →  {y|join} hai bảng trên thuộc tính đó', { x: 330, y: 500, size: 30 });
  const a2 = s.text('{t|hằng 94220} ở vị trí county-code  →  phép {t|chọn} (selection)', { x: 330, y: 565, size: 30 });
  const a3 = s.text('{d|dấu “_”}  →  thuộc tính không quan tâm (anonymous variable)', { x: 330, y: 630, size: 30 });
  const cap = captioner(s, { y: 760, x: 800, anchor: 'c', size: 30 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1100); await fadeIn(q, 600); await lag(row, r => write(r, 900), 250); },
    async () => { await fadeIn(a1, 600, 10); await all(indicate(row[0], C.yellow), indicate(row[1], C.yellow), indicate(row[3], C.yellow)); },
    async () => { await fadeIn(a2, 600, 10); await indicate(row[3], C.teal); await fadeIn(a3, 600, 10); },
    async () => { await cap('Phần lớn SQL là cú pháp thân thiện của ngôn ngữ này — và nó dùng {y|y nguyên} cho quan hệ ràng buộc.'); }
  ];
});

/* ================= 15. Ba truy vấn trên Road/Spat ================= */
const roadY = x => x <= 6 ? x - 1 : x <= 8 ? (28 - 3 * x) / 2 : (3 * x - 20) / 2;
const STRIPS = [[[-1, 0, 4], [1, 0, -6], [-1, 1, 1]], [[-1, 0, 6], [1, 0, -8], [3, 2, -28]], [[-1, 0, 8], [1, 0, -10], [-3, 2, 20]]];
const Q3 = [P1, P2].flatMap(P => STRIPS.map(st => clipAll(P, st))).filter(p => p.length > 2);
scene('ba-truy-van', '4.2.2', 'Ba truy vấn mẫu: ∧ · ∧¬ · ∃', s => {
  const lab = s.label('4.2.2 — Figure 4.4, 4.6, 4.7');
  const ttl = s.title('Ba truy vấn trên Road và Spat');
  const Pl = s.plane({ x0: 0, x1: 11, y0: 0, y1: 7, unit: 58, left: 830, top: 190 });
  const p1 = Pl.poly(P1, { color: C.blue, w: 2, fill: C.blue, fo: .2 }), p2 = Pl.poly(P2, { color: C.blue, w: 2, fill: C.blue, fo: .2 });
  const rd = Pl.polyline(ROAD, { color: C.gold, w: 4 });
  const sl = Pl.text('Spat', 2.2, 1.5, { color: C.blue, size: 24 }), rl = Pl.text('Road', 10.1, 5.4, { color: C.gold, size: 24 });
  const Q = [
    [tx`\{x,y\mid \text{Spat}(x,y)\wedge\text{Road}(x,y)\}`, 'giao Spat và Road (Figure 4.4)'],
    [tx`\{x,y\mid \text{Road}(x,y)\wedge\neg\,\text{Spat}(x,y)\}`, 'phần Road nằm ngoài Spat (Figure 4.6)'],
    [tx`\{x,y\mid \exists y'\,(\text{Spat}(x,y)\wedge\text{Road}(x,y')\wedge y\le y')\}`, 'điểm của Spat có Road nằm phía trên (Figure 4.7)']
  ].map(([t, d], i) => { const g = s.g(); op(g, 0); s.text(`Query ${i + 1}`, { x: 80, y: 260 + i * 150, size: 24, color: C.yellow, parent: g, show: true }); s.tex(t, { x: 80, y: 310 + i * 150, size: 28, parent: g, show: true }); s.text(d, { x: 80, y: 350 + i * 150, size: 22, color: C.dim, parent: g, show: true }); return g; });
  const r1 = [[[4, 3], [4.75, 3.75]], [[43 / 6, 13 / 4], [8, 2]], [[8, 2], [9, 3.5]]].map(([a, b]) => Pl.seg(a, b, { color: C.red, w: 8 }));
  const r2a = Pl.polyline([[4.75, 3.75], [6, 5], [43 / 6, 13 / 4]], { color: C.purple, w: 8 }), r2b = Pl.seg([9, 3.5], [10, 5], { color: C.purple, w: 8 });
  const holes = [[4.75, 3.75], [43 / 6, 13 / 4], [9, 3.5]].map(p => { const [x, y] = Pl.P(...p); return s.circle(x, y, 8, { parent: Pl.layer, fill: C.bg, color: C.purple, w: 3 }); });
  const res3 = s.path('', { parent: Pl.layer, color: C.green, w: 2, fill: C.green, fo: .55 }); op(res3, 1);
  const probe = Pl.seg([4, 0], [4, 7], { color: C.fg, w: 2, dash: '6 6' });
  const pd = Pl.dot(4, 3, { color: C.gold, r: 8 }), pdl = Pl.tex(tx`(x,y')`, 4, 3, { size: 22, dx: 12, dy: -12, color: C.gold });
  const sweep = X => {
    const d = Q3.map(p => ptsD(Pl.S(clipHalf(p, 1, 0, -X)), true)).filter(Boolean).join(' ');
    res3.setAttribute('d', d);
    const [px] = Pl.P(X, 0); probe.setAttribute('x1', px); probe.setAttribute('x2', px);
    const [ax, ay] = Pl.P(X, roadY(X)); pd.setAttribute('cx', ax); pd.setAttribute('cy', ay); setT(pdl, { x: ax + 12, y: ay - 12 });
  };
  const cap = captioner(s, { y: 800, x: 80, size: 26 });
  const focus = i => all(Q.map((q, j) => anim(q, { opacity: j === i ? 1 : .3 }, 400)));
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 900); await Pl.create(900); await all(create(p1, 700), create(p2, 700), fadeIn(sl)); await all(create(rd, 800), fadeIn(rl)); },
    async () => { await fadeIn(Q[0], 600, 10); await all(r1.map(r => create(r, 700))); await cap('Query 1: thay Spat, Road bằng công thức φ₁, φ₂ → ψ ≡ φ₁ ∧ φ₂, không lượng từ → chỉ cần đưa về {y|DNF}.'); },
    async () => {
      await all(r1.map(r => fadeOut(r, 400))); await fadeIn(Q[1], 600, 10); await focus(1);
      await all(create(r2a, 900), create(r2b, 600)); await all(holes.map(h => fadeIn(h, 400)));
      await cap('Query 2: ψ ≡ φ₁ ∧ {y|¬}φ₂ → phải khử phủ định (De Morgan rồi phân phối). Đầu mút rỗng: ¬(≤) cho ra {y|<}.');
    },
    async () => {
      await all(fadeOut(r2a), fadeOut(r2b), holes.map(h => fadeOut(h))); await fadeIn(Q[2], 600, 10); await focus(2);
      await cap('Query 3: với mỗi (x, y) ∈ Spat, có (x, y′) trên Road cùng x mà {y|y ≤ y′} không?');
      sweep(4); await all(fadeIn(probe, 300), popDot(pd), fadeIn(pdl, 300));
      await tween(4200, k => sweep(lerp(4, 9, k)), linear);
      await all(fadeOut(probe, 400), fadeOut(pd, 400), fadeOut(pdl, 400));
      await cap('Kết quả: phần Spat nằm “dưới” con đường. Công thức có {y|∃y′} → phải {y|khử lượng từ} rồi đưa về DNF.');
    },
    async () => { await focus(-1); await all(Q.map(q => anim(q, { opacity: 1 }, 400))); await cap('Hai câu hỏi trọng tâm: {y|closure} (kết quả còn là linear constraint relation?) và {y|computability} (có thuật toán?) — trả lời ở các slide sau.'); }
  ];
});

/* ================= 16. Khử lượng từ ================= */
scene('khu-luong-tu', '4.2.2', 'Khử lượng từ: ví dụ trên đoạn s₁', s => {
  const lab = s.label('4.2.2 — quantifier elimination (minh họa trên s₁)');
  const ttl = s.title('Làm cho {y|∃y′} biến mất');
  const L1 = s.tex(tx`\exists y'\ \big(\ \Yl{y'=x-1}\ \wedge\ 4\le x\le 6\ \wedge\ 3\le \Yl{y'}\le 5\ \wedge\ y\le \Yl{y'}\ \big)`, { x: 80, y: 270, size: 34 });
  const sub = s.text('thế  y′ = x − 1 :', { x: 80, y: 350, size: 28, color: C.yellow });
  const L2 = s.tex(tx`3\le \Yl{x-1}\le 5\ \wedge\ 4\le x\le 6\ \wedge\ y\le \Yl{x-1}`, { x: 80, y: 420, size: 34 });
  const nt = s.tex(tx`\Dm{3\le x-1\le 5\iff 4\le x\le 6\ \ (\text{trùng})}`, { x: 80, y: 480, size: 26 });
  const L3 = s.tex(tx`\Gr{4\le x\le 6\ \wedge\ y\le x-1}`, { x: 80, y: 560, size: 40 });
  const ok = s.text('lượng từ đã biến mất ✓', { x: 520, y: 558, size: 28, color: C.green });
  const Pl = s.plane({ x0: 0, x1: 8, y0: 0, y1: 6, unit: 60, left: 1020, top: 200 });
  const s1 = Pl.seg([4, 3], [6, 5], { color: C.gold, w: 5 });
  const s1l = Pl.tex(tx`\Go{s_1}`, 4.6, 4.4, { size: 26 });
  const reg = Pl.poly([[4, 0], [6, 0], [6, 5], [4, 3]], { color: C.green, w: 2.5, fill: C.green, fo: .4 });
  const k1 = s.text('Mọi công thức trong L đều có dạng tương đương {y|không lượng từ}, và có {y|thuật toán} tính ra nó.', { x: 80, y: 700, size: 27 });
  const k2 = s.text('⇒ mọi first-order query tính được ở {b|dạng đóng} (DNF không lượng từ), chi phí {y|đa thức} theo kích thước CSDL.', { x: 80, y: 750, size: 27 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 900); await write(L1, 2000); await Pl.create(800); await all(create(s1, 600), write(s1l, 400)); },
    async () => { await fadeIn(sub, 500); await indicate(L1, C.yellow); await write(L2, 1500); await fadeIn(nt, 600); },
    async () => { await write(L3, 1200); await fadeIn(ok, 500); await create(reg, 1200); },
    async () => { await fadeIn(k1, 600, 10); await fadeIn(k2, 600, 10); },
  ];
});

/* ================= 17. Đại số ================= */
scene('dai-so', '4.2.3', 'Đại số: mỗi phép toán có bản symbolic', s => {
  const lab = s.label('4.2.3 — algebraic queries');
  const ttl = s.title('Từ khai báo sang thủ tục: {y|đại số} trên symbolic tuple');
  const hd = [['tầng abstract', 120], ['trên symbolic tuple (e₁, e₂ biểu diễn R₁, R₂)', 420], ['ghi chú', 1110]].map(([t, x]) => s.text(t, { x, y: 205, size: 22, color: C.dim }));
  const hl = s.line(100, 222, 1500, 222, { color: C.faint, w: 2 });
  const R = [
    [tx`\sigma_F(R_1)`, tx`\{\,t_1\wedge F\mid t_1\in e_1\}`, 'chỉ nối thêm một ràng buộc'],
    [tx`R_1\times R_2`, tx`\{\,t_1\wedge t_2\mid t_1\in e_1,\ t_2\in e_2\}`, 'mọi cặp tuple'],
    [tx`R_1\bowtie R_2`, tx`\{\,t_1\wedge t_2\mid t_1\in e_1,\ t_2\in e_2\}`, 'chung một phần biến'],
    [tx`R_1\cap R_2`, tx`\{\,t_1\wedge t_2\mid t_1\in e_1,\ t_2\in e_2\}`, 'chung toàn bộ biến'],
    [tx`\pi_{\vec x}(R_1)`, tx`\{\,\pi_{\vec x}(t)\mid t\in e_1\}`, 'khử các biến không được giữ lại'],
    [tx`R_1\cup R_2`, tx`e_1\cup e_2`, 'gộp hai tập tuple'],
    [tx`R_1-R_2`, tx`\{\,t_1\wedge t_2\mid t_1\in e_1,\ t_2\in (e_2)^c\}`, '(e₂)ᶜ = DNF của ¬e₂']
  ].map(([a, b, c], i) => { const y = 280 + i * 70; const g = s.g(); op(g, 0); s.tex(a, { x: 120, y, size: 32, parent: g, show: true }); s.tex(b, { x: 420, y, size: 32, parent: g, show: true }); s.text(c, { x: 1110, y: y - 2, size: 24, color: C.dim, parent: g, show: true }); return g; });
  const box = s.rect(405, 280 + 70 - 44, 640, 3 * 70 - 6, { color: C.yellow, w: 2.5 });
  const boxR = s.rect(405, 280 + 6 * 70 - 44, 640, 64, { color: C.red, w: 2.5 });
  const cap = captioner(s, { y: 800, x: 80, size: 26 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1100); await all(hd.map(h => fadeIn(h, 500)), create(hl, 600)); await lag(R, r => fadeIn(r, 500, 8), 220); },
    async () => { await create(box, 800); await cap('⋈, ∩, × cùng một công thức — khác ở {y|tập biến}: R(x, y) ⋈ S(y, z) ghép theo y; nếu S là S(x, y) thì ⋈ chính là ∩.'); },
    async () => { await fadeOut(box, 400); await create(boxR, 700); await cap('Hiệu đắt nhất: e₂ có n tuple, tuple i có mᵢ ràng buộc → ¬e₂ có thể tới {r|m₁·m₂·…·mₙ} số hạng (nhận xét thêm).'); }
  ];
});

/* ================= 18. Selection ================= */
scene('selection', '4.2.3', 'Selection σ y≤5 (Spat)', s => {
  const lab = s.label('4.2.3 — Ví dụ 1: Figure 4.8, 4.9');
  const ttl = s.title('Selection với điều kiện {y|y ≤ 5}: thêm vào {y|mọi} tuple');
  const Pl = s.plane({ x0: 0, x1: 10, y0: 0, y1: 7, unit: 60, left: 80, top: 180 });
  const p1 = Pl.poly(P1, { color: C.blue, w: 3, fill: C.blue, fo: .35 });
  let p2 = Pl.poly(P2, { color: C.teal, w: 3, fill: C.teal, fo: .35 });
  const P2c = clipHalf(P2, 0, 1, -5);
  const p2n = Pl.poly(P2c, { color: C.teal, w: 3, fill: C.teal, fo: .35 });
  const cutoff = Pl.poly(clipHalf(P2, 0, -1, 5), { color: C.red, w: 2, fill: C.red, fo: .45 });
  const y5 = Pl.seg([0, 5], [10, 5], { color: C.yellow, w: 3, dash: '10 8' });
  const y5l = Pl.tex(tx`\Yl{y=5}`, 0.3, 5, { dy: -12, size: 26 });
  const c1 = s.texRow([tx`\Bl{t_1}:\ y\le x\wedge y\ge 1\wedge x+3y-16\le 0\wedge 3x-2y-15\le 0`, tx`\wedge\ \Yl{y\le 5}`], { x: 770, y: 330, size: 27 });
  const c2 = s.texRow([tx`\Tl{t_2}:\ x\le 9\wedge y\ge 1\wedge 3x-2y-15\ge 0`, tx`\wedge\ \Yl{y\le 5}`], { x: 770, y: 430, size: 27 });
  const n1 = s.text('thừa: P₁ đã có y ≤ 4 (đỉnh cao nhất (4,4))', { x: 770, y: 375, size: 22, color: C.dim });
  const n2 = s.text('cắt thật sự: P₂ có đỉnh (9, 6)', { x: 770, y: 475, size: 22, color: C.red });
  const cap = captioner(s, { y: 700, x: 770, size: 26 });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1100); await Pl.create(800); await all(create(p1, 800), create(p2, 800)); await write(c1[0], 1200); await write(c2[0], 1000); },
    async () => { await create(y5, 900); await write(y5l, 500);
      for (const c of [c1, c2]) { const t = { ...c[1]._t }; setT(c[1], { x: Pl.X(9), y: Pl.Y(5) - 10, s: .6 }); op(c[1], 1); await moveT(c[1], { x: t.x, y: t.y, s: 1 }, 800); } },
    async () => { await fadeIn(cutoff, 400); await all(fadeOut(cutoff, 900), fadeIn(p2n, 600), fadeOut(p2, 600)); await fadeIn(n2, 500); await fadeIn(n1, 500); await anim(c1[1], { opacity: .4 }, 400); },
    async () => { await cap('σ và ∩ là {y|thuần ký hiệu}:\nchỉ ghép thêm ràng buộc, không sửa ràng buộc nào.'); }
  ];
});

/* ================= 19. Projection (Fourier–Motzkin) ================= */
scene('chieu', '4.2.3', 'Projection π x (Spat): khử biến y', s => {
  const lab = s.label('4.2.3 — Ví dụ 3: Figure 4.10, 4.11, 4.12 (Fourier–Motzkin)');
  const ttl = s.title('Chiếu Spat lên trục x');
  const Pl = s.plane({ x0: 0, x1: 10, y0: 0, y1: 7, unit: 60, left: 80, top: 180 });
  const p1 = Pl.poly(P1, { color: C.blue, w: 2, fill: C.blue, fo: .3 });
  const p2 = Pl.poly(P2, { color: C.teal, w: 2, fill: C.teal, fo: .3 });
  const lo1 = [Pl.seg([1, 1], [17 / 3, 1], { color: C.blue, w: 7 }), Pl.seg([17 / 3, 1], [7, 3], { color: C.blue, w: 7 })];
  const up1 = [Pl.seg([1, 1], [4, 4], { color: C.gold, w: 7 }), Pl.seg([4, 4], [7, 3], { color: C.gold, w: 7 })];
  const lo2 = [Pl.seg([17 / 3, 1], [9, 1], { color: C.blue, w: 7 })];
  const up2 = [Pl.seg([17 / 3, 1], [9, 6], { color: C.gold, w: 7 })];
  const vline = Pl.seg([0, 0], [0, 7], { color: C.fg, w: 2, dash: '6 6' });
  const feas = Pl.seg([0, 0], [0, 0], { color: C.green, w: 8 });
  const sh1 = Pl.seg([1, 0], [1, 0], { color: C.blue, w: 9 }), sh2 = Pl.seg([17 / 3, 0], [17 / 3, 0], { color: C.teal, w: 9 });
  setT(sh1, { y: -14 }); setT(sh2, { y: -32 });
  const B1 = { lo: [x => 1, x => 1.5 * x - 7.5], up: [x => x, x => (16 - x) / 3], xmax: 1e9, a: 1, b: 7, sh: sh1 };
  const B2 = { lo: [x => 1], up: [x => 1.5 * x - 7.5], xmax: 9, a: 17 / 3, b: 9, sh: sh2 };
  const sweep = (B, X) => {
    const lo = Math.max(...B.lo.map(f => f(X))), up = Math.min(...B.up.map(f => f(X)));
    const [vx] = Pl.P(X, 0); vline.setAttribute('x1', vx); vline.setAttribute('x2', vx);
    const ok = lo <= up + 1e-9 && X <= B.xmax;
    const [fx, fy1] = Pl.P(X, lo), [, fy2] = Pl.P(X, up);
    feas.setAttribute('x1', fx); feas.setAttribute('x2', fx); feas.setAttribute('y1', fy1); feas.setAttribute('y2', ok ? fy2 : fy1); feas.setAttribute('opacity', ok ? 1 : 0);
    const e = Math.min(X, B.b);
    if (X >= B.a) { B.sh.setAttribute('x2', Pl.X(e)); }
  };
  const panel = s.g();
  const T = (raw, y, o = {}) => s.tex(raw, { x: 760, y, size: 28, parent: panel, ...o });
  const h1 = s.text('P₁ — Bước 1: tách y thành cận dưới / cận trên', { x: 760, y: 240, size: 26, color: C.yellow, parent: panel });
  const b1 = T(tx`\Bl{\text{cận dưới:}}\ \ y\ge 1,\qquad y\ge \tfrac{3x}{2}-\tfrac{15}{2}`, 305);
  const b2 = T(tx`\Go{\text{cận trên:}}\ \ y\le x,\qquad y\le -\tfrac{x}{3}+\tfrac{16}{3}`, 370);
  const h2 = s.text('Bước 2: có y  ⇔  {b|mọi cận dưới} ≤ {o|mọi cận trên}', { x: 760, y: 440, size: 26, parent: panel });
  const pr = [tx`1\le x\ \Rightarrow\ x\ge 1`, tx`\tfrac{3x}{2}-\tfrac{15}{2}\le x\ \Rightarrow\ x\le 15`, tx`1\le -\tfrac{x}{3}+\tfrac{16}{3}\ \Rightarrow\ x\le 13`, tx`\tfrac{3x}{2}-\tfrac{15}{2}\le -\tfrac{x}{3}+\tfrac{16}{3}\ \Rightarrow\ x\le 7`].map((r, i) => T(r, 510 + i * 62));
  const strikes = [1, 2].map(i => s.line(750, 510 + i * 62 - 10, 1240, 510 + i * 62 - 10, { color: C.red, w: 3, parent: panel }));
  const red = s.text('thừa (redundant)', { x: 1260, y: 568, size: 22, color: C.red, parent: panel });
  const r1 = s.tex(tx`\pi_x(P_1)=\Bl{[\,1,\ 7\,]}`, { x: 760, y: 800, size: 34 });
  const panel2 = s.g();
  const U = (raw, y) => s.tex(raw, { x: 760, y, size: 28, parent: panel2 });
  const g1 = s.text('P₂ — làm tương tự', { x: 760, y: 240, size: 26, color: C.teal, parent: panel2 });
  const g2 = U(tx`\Bl{\text{cận dưới:}}\ y\ge 1\qquad \Go{\text{cận trên:}}\ y\le \tfrac{3x}{2}-\tfrac{15}{2}`, 305);
  const g3 = U(tx`\text{không chứa }y:\ \ x\le 9`, 370);
  const g4 = U(tx`1\le \tfrac{3x}{2}-\tfrac{15}{2}\ \Rightarrow\ x\ge \tfrac{17}{3}`, 445);
  const r2 = s.tex(tx`\pi_x(P_2)=\Tl{[\,\tfrac{17}{3},\ 9\,]}`, { x: 1180, y: 800, size: 34 });
  const fin = s.tex(tx`\pi_x(\text{Spat})=(\Bl{1\le x\le 7})\vee(\Tl{\tfrac{17}{3}\le x\le 9})\ =\ [\,1,\ 9\,]`, { x: 760, y: 560, size: 32 });
  const ov = Pl.seg([17 / 3, 0], [7, 0], { color: C.yellow, w: 6 }); setT(ov, { y: -23 });
  const ovt = s.text('hai đoạn chồng nhau (17/3 ≈ 5.67 < 7) — hợp lý: đa giác trải từ x = 1 đến x = 9', { x: 760, y: 640, size: 22, color: C.dim });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 800); await Pl.create(800); await all(create(p1, 800), create(p2, 800)); await anim(p2, { opacity: .25 }, 400); },
    async () => { await fadeIn(h1, 500); await all(lo1.map(e => create(e, 700))); await write(b1, 1100); await all(up1.map(e => create(e, 700))); await write(b2, 1100); },
    async () => {
      await fadeIn(h2, 500); sweep(B1, 0.3); op(vline, 1); op(sh1, 1); op(feas, 0);
      await fadeIn(vline, 300);
      await tween(4800, k => sweep(B1, lerp(0.3, 9.6, k)), linear);
      await fadeOut(vline, 300); feas.setAttribute('opacity', 0);
    },
    async () => { await lag(pr, r => write(r, 1100), 350); },
    async () => { await all(strikes.map(l => create(l, 500))); await fadeIn(red, 400); await write(r1, 900); await indicate(sh1, C.blue); },
    async () => {
      await fadeOut(panel, 500); await all(anim(p1, { opacity: .25 }, 400), anim(p2, { opacity: 1 }, 400), [...lo1, ...up1].map(e => fadeOut(e, 400)));
      await fadeIn(g1, 400); await all(create(lo2[0], 600), create(up2[0], 600)); await write(g2, 1000); await write(g3, 700);
      sweep(B2, 0.3); op(sh2, 1); op(vline, 1); await fadeIn(vline, 300);
      await tween(3600, k => sweep(B2, lerp(0.3, 9.6, k)), linear);
      await fadeOut(vline, 300); feas.setAttribute('opacity', 0);
      await write(g4, 1000); await write(r2, 900);
    },
    async () => { await fadeOut(panel2, 400); await all(anim(p1, { opacity: 1 }, 400), fadeOut(lo2[0]), fadeOut(up2[0])); await write(fin, 1600); await create(ov, 600); await fadeIn(ovt, 500); }
  ];
});

/* ================= 20. Simplification ================= */
scene('rut-gon', '4.2.3', 'Simplification: tuple rỗng và ràng buộc thừa', s => {
  const lab = s.label('4.2.3 — tuple không nhất quán và tuple thừa');
  const ttl = s.title('Kết quả của các phép toán cần được {y|dọn dẹp}');
  const c1 = s.card(80, 210, 690, 300, {}), c2 = s.card(830, 210, 690, 300, {});
  const t1 = s.text('Tuple {r|không nhất quán} (rỗng)', { x: 110, y: 265, size: 30, parent: s.root });
  const f1 = s.tex(tx`s_1\wedge P_2:\ \ y=x-1,\ \ 3x-2y\ge 15`, { x: 110, y: 350, size: 30 });
  const f1b = s.tex(tx`\Rightarrow\ x+2\ge 15\ \Rightarrow\ x\ge 13\ \ \text{mà}\ x\le 6\ \Rightarrow\ \Rd{\varnothing}`, { x: 110, y: 420, size: 30 });
  const t2 = s.text('Ràng buộc {y|thừa} (redundant)', { x: 860, y: 265, size: 30 });
  const f2 = s.tex(tx`x\le 15,\ \ x\le 13,\ \ \Yl{x\le 7}`, { x: 860, y: 350, size: 32 });
  const f2b = s.tex(tx`\Rightarrow\ \text{chỉ cần giữ}\ \Yl{x\le 7}`, { x: 860, y: 420, size: 32 });
  const ar = s.arrow(800, 540, 800, 610, { color: C.yellow, w: 4 });
  const sm = s.tex(tx`\textbf{simplification}`, { x: 800, y: 670, anchor: 'c', size: 46, color: C.yellow });
  const sm2 = s.text('bỏ tuple rỗng · bỏ ràng buộc thừa — độ phức tạp phụ thuộc số biến;\ntrong 2D có kỹ thuật đơn giản và hiệu quả', { x: 800, y: 740, anchor: 'c', size: 26, color: C.dim });
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 1000); await fadeIn(c1, 500); await fadeIn(t1, 500); await write(f1, 1200); await write(f1b, 1400); },
    async () => { await fadeIn(c2, 500); await fadeIn(t2, 500); await write(f2, 1000); await write(f2b, 1000); },
    async () => { await create(ar, 500); await write(sm, 1200); await fadeIn(sm2, 700); }
  ];
});

/* ================= 21. Ưu / nhược ================= */
scene('uu-nhuoc', '4.2.3', 'Điểm mạnh và hạn chế', s => {
  const lab = s.label('4.2.3 — trang 133–134');
  const ttl = s.title('Đánh đổi của mô hình tuyến tính');
  const hG = s.text('Điểm mạnh', { x: 100, y: 230, size: 36, color: C.green });
  const hR = s.text('Hạn chế', { x: 830, y: 230, size: 36, color: C.red });
  const dv = s.line(790, 200, 790, 800, { color: C.faint, w: 2 });
  const G = ['Truy vấn không gian bằng ngôn ngữ {g|thuần quan hệ}.', 'Nhìn đối tượng ở mức trừu tượng cao: một truy vấn\ngiao viết giống nhau cho đoạn, điểm, đa giác.', 'Mở rộng {g|tự nhiên} lên chiều cao hơn.']
    .map((t, i) => s.text('• ' + t, { x: 100, y: 310 + i * 120, size: 27 }));
  const Rr = ['Biểu diễn {r|không gọn}: DNF buộc chia đa giác thành\ncác phần lồi ngay trong CSDL.', 'Sức biểu diễn giới hạn với L = {≤, +, 0, 1}:\n{r|khoảng cách} cần phép nhân → không biểu diễn được.', 'Quan hệ topo: được nhưng biểu thức phức tạp;\nthêm toán tử topo vào ngôn ngữ → vấn đề còn đang nghiên cứu.']
    .map((t, i) => s.text('• ' + t, { x: 830, y: 310 + i * 150, size: 27 }));
  return [
    async () => { await fadeIn(lab, 400); await write(ttl, 900); await create(dv, 600); await fadeIn(hG, 500); await lag(G, g => fadeIn(g, 600, 10), 300); },
    async () => { await fadeIn(hR, 500); await lag(Rr, g => fadeIn(g, 600, 10), 400); }
  ];
});

