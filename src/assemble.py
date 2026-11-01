import subprocess, sys
import os
scenes = os.environ.get('SC','scenes1.js scenes2a.js').split()
r = subprocess.run([sys.executable, 'texbuild.py', 'tex.json'] + scenes)
if r.returncode: sys.exit(1)
t = open('template.html', encoding='utf8').read()
rep = {
    '/*TEXDATA*/': 'const TEX = ' + open('tex.json', encoding='utf8').read() + ';',
    '/*ENGINE*/': open('engine.js', encoding='utf8').read(),
    '/*PLAYER*/': open('player.js', encoding='utf8').read(),
    '/*SCENES*/': '\n'.join(open(f, encoding='utf8').read() for f in scenes),
}
for k, v in rep.items():
    t = t.replace(k, v.replace('</script', '<\\/script'))
open('dist/index.html', 'w', encoding='utf8').write(t)
print('ok', len(t))
