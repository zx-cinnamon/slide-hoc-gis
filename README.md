# Chương 4 · The Constraint Data Model — trình chiếu hoạt họa

Bản trình chiếu kiểu 3Blue1Brown cho toàn bộ Chương 4, mục 4.1 → 4.5 (37 cảnh). Toàn bộ nằm trong một file `index.html`, không cần server.

**Điều khiển:** → / Space: bước tiếp · ←: lùi · R: chạy lại cảnh · F: toàn màn hình · M: mục lục.
Có thể mở thẳng một cảnh bằng link dạng `index.html#chieu`.

## Đưa lên GitHub Pages

1. Tạo repo trống trên GitHub (ví dụ `slide-hoc-gis`).
2. Trong thư mục này:
   ```
   git init -b main
   git add .
   git commit -m "Slide hoạt họa Chương 4"
   git remote add origin https://github.com/<tên-bạn>/slide-hoc-gis.git
   git push -u origin main
   ```
3. Trên GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
   Sau khoảng 1 phút trang có ở `https://<tên-bạn>.github.io/slide-hoc-gis/`.

## Dựng lại từ mã nguồn (`src/`)

Cần Python 3, XeLaTeX (TeX Live) và `pdftocairo` (poppler) để dựng sẵn công thức LaTeX thành SVG.

```
cd src
mkdir -p dist
python3 assemble.py        # bản đầy đủ 4.1–4.5
cp dist/index.html ../index.html
```

- `engine.js`: bộ hoạt họa (tween, vẽ nét, "write" công thức, mặt phẳng tọa độ, camera 3D)
- `player.js`: điều hướng cảnh/bước
- `scenes1.js`, `scenes2a.js`, `scenes3.js`: các cảnh 4.1–4.2 (scenes3 chứa thứ tự cảnh và các slide giải thích bổ sung) · `scenes2b.js`: 4.3–4.4 và tổng kết
- `texbuild.py`: dựng công thức trong tx`...` thành path SVG
