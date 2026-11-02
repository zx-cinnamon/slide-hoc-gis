@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Day ban trinh chieu len GitHub
echo (Tao truoc mot repo TRONG tren github.com, vi du: slide-hoc-gis)
echo.
set /p REPO=Dan link repo (vd https://github.com/ten-ban/slide-hoc-gis.git): 
if not exist .git git init
git add .
git commit -m "Slide hoat hoa Chuong 4 - 30 canh"
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO%
git push -u origin main
echo.
echo Xong. Tren GitHub vao Settings - Pages - Deploy from a branch - main / (root) - Save.
pause
