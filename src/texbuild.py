#!/usr/bin/env python3
"""Pre-render every tx`...` formula found in the scene sources to path data (JSON).
Usage: python3 texbuild.py out.json src1.js src2.js ..."""
import re, sys, json, subprocess, os, tempfile, xml.etree.ElementTree as ET

out = sys.argv[1]
srcs = sys.argv[2:]
raws = []
for f in srcs:
    for m in re.finditer(r'tx`((?:[^`\\]|\\.)*)`', open(f, encoding='utf8').read()):
        s = m.group(1)
        if s not in raws:
            raws.append(s)

PRE = r"""\documentclass{article}
\usepackage{fontspec}
\usepackage{amsmath,amssymb,xcolor}
\usepackage[active,tightpage]{preview}
\setlength\PreviewBorder{0pt}
\newcommand{\Yl}[1]{\textcolor[HTML]{F7D96F}{#1}}
\newcommand{\Bl}[1]{\textcolor[HTML]{58C4DD}{#1}}
\newcommand{\Tl}[1]{\textcolor[HTML]{5CD0B3}{#1}}
\newcommand{\Gr}[1]{\textcolor[HTML]{83C167}{#1}}
\newcommand{\Rd}[1]{\textcolor[HTML]{FC6255}{#1}}
\newcommand{\Go}[1]{\textcolor[HTML]{F0AC5F}{#1}}
\newcommand{\Pu}[1]{\textcolor[HTML]{B189C6}{#1}}
\newcommand{\Dm}[1]{\textcolor[HTML]{8A8F98}{#1}}
\newcommand{\Ex}{\exists}
\begin{document}
"""
body = []
for r in raws:
    body.append(r"\sbox0{$\displaystyle " + r + r"$}\typeout{TEXDIM:\the\ht0:\the\dp0:\the\wd0}" + "\n" +
                r"\begin{preview}\usebox0\end{preview}" + "\n")
tmp = tempfile.mkdtemp()
open(os.path.join(tmp, 'f.tex'), 'w', encoding='utf8').write(PRE + ''.join(body) + r"\end{document}")
p = subprocess.run(["xelatex", '-interaction=nonstopmode', 'f.tex'], cwd=tmp, capture_output=True, text=True)
log = open(os.path.join(tmp, 'f.log'), encoding='latin1').read()
dims = re.findall(r'TEXDIM:([\d.]+)pt:([\d.]+)pt:([\d.]+)pt', log)
if p.returncode != 0 or len(dims) != len(raws):
    errs = re.findall(r'^! .*$(?:\n.*){0,3}', log, re.M)
    print('LATEX FAILED', len(dims), len(raws)); print('\n'.join(errs[:10]))
    sys.exit(1)

NS = {'s': 'http://www.w3.org/2000/svg', 'x': 'http://www.w3.org/1999/xlink'}
def col(v):
    if not v or v == 'none': return v
    m = re.match(r'rgb\(([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)%\)', v)
    if not m: return v
    rgb = [round(float(c) * 2.55) for c in m.groups()]
    if rgb == [0, 0, 0]: return None
    return '#%02X%02X%02X' % tuple(rgb)

D = []; Didx = {}
def di(d):
    d = re.sub(r'(\d+\.\d{3})\d+', r'\1', d.strip())
    if d not in Didx:
        Didx[d] = len(D); D.append(d)
    return Didx[d]

res = {}
for i, r in enumerate(raws):
    svgf = os.path.join(tmp, 'p%d.svg' % i)
    subprocess.run(['pdftocairo', '-svg', '-f', str(i + 1), '-l', str(i + 1), os.path.join(tmp, 'f.pdf'), svgf], check=True)
    root = ET.parse(svgf).getroot()
    W = float(root.get('width').replace('pt', '')); H = float(root.get('height').replace('pt', ''))
    glyph = {}
    for g in root.iter('{%s}g' % NS['s']):
        gid = g.get('id')
        if gid and gid.startswith('glyph'):
            ps = [pp.get('d') for pp in g.findall('s:path', NS) if pp.get('d')]
            glyph[gid] = ' '.join(ps)
    items = []
    def walk(el, fill, stroke, sw):
        tag = el.tag.split('}')[1]
        if tag in ('defs', 'clipPath'): return
        if el.get('fill') is not None: fill = col(el.get('fill'))
        if el.get('stroke') is not None: stroke = 'none' if el.get('stroke') == 'none' else (col(el.get('stroke')) or 'cur')
        if el.get('stroke-width') is not None: sw = float(el.get('stroke-width'))
        if tag == 'use':
            href = el.get('{%s}href' % NS['x']) or el.get('href')
            d = glyph.get(href[1:], '')
            if d.strip():
                items.append([di(d), round(float(el.get('x', 0)), 3), round(float(el.get('y', 0)), 3), fill])
        elif tag == 'path' and el.get('d'):
            tr = el.get('transform', '')
            if stroke and stroke != 'none':
                items.append(['R', el.get('d'), tr, None if stroke == 'cur' else stroke, sw or 0.4, 's'])
            else:
                items.append(['R', el.get('d'), tr, fill, 0, 'f'])
        for c in el: walk(c, fill, stroke, sw)
    walk(root, None, None, None)
    ht, dp, wd = [float(v) for v in dims[i]]
    base = H * ht / (ht + dp) if ht + dp > 0 else H
    res[r] = {'w': round(W, 3), 'h': round(H, 3), 'b': round(base, 3), 'i': items}

json.dump({'D': D, 'F': res}, open(out, 'w'), ensure_ascii=False, separators=(',', ':'))
print('formulas', len(raws), 'glyphs', len(D), 'bytes', os.path.getsize(out))
