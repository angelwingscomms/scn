#!/usr/bin/env python3
"""pulls the embedded cover image out of each source PDF and renders it as a
1100x1100 (plus a 750px -s.webp for the grid srcset) 'developing plate': whole cover contained on plate-black, radial
vignette so every title sits in the same pool of light. writes static/covers/<slug>.webp

deps: pypdf, pillow, numpy   (pip install --user pypdf pillow numpy)
"""
import math
import os

import numpy as np
import pypdf
from PIL import Image, ImageEnhance

SRC = os.path.expanduser("~/Downloads")
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "static", "covers")
SIZE = 1100
GRID = 750
PLATE = (8, 9, 12)

BOOKS = {
    "killer-collection": "THE SILENT KILLER COLLECTION.pdf",
    "killer-reset": "THE SILENT KILLER RESET.pdf",
    "ai-cashflow": "AI CASHFLOW BLUEPRINT.pdf",
    "ai-cashflow-2": "AI CASHFLOW BLUEPRINT 2.0.pdf",
    "silent-poverty": "SILENT POVERTY.pdf",
    "digital-skill": "The Digital Skill Nobody is Teaching in School.pdf",
    "jamb": "JAMB MASTERY BLUEPRINT WITH UPDATED 2026 AND 2027 SYLLABUS.pdf",
    "waec": "WAEC A+ BLUEPRINT.pdf",
}

os.makedirs(OUT, exist_ok=True)

yy, xx = np.mgrid[0:SIZE, 0:SIZE]
dist = np.hypot(xx - SIZE / 2, yy - SIZE / 2) / (SIZE / 2 * math.sqrt(2))
t = np.clip((dist - 0.18) / 0.70, 0, 1)
vignette = (1 - (t * t * (3 - 2 * t))) ** 1.15
plate = np.array(PLATE, dtype=np.float32)

for slug, name in BOOKS.items():
    path = os.path.join(SRC, name)
    if not os.path.exists(path):
        raise SystemExit(f"missing source pdf: {path}")
    raw = pypdf.PdfReader(path).pages[0].images[0].data
    tmp = os.path.join(OUT, slug + ".src")
    with open(tmp, "wb") as fh:
        fh.write(raw)

    im = Image.open(tmp).convert("RGB")
    scale = min(SIZE / im.width, SIZE / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    canvas = Image.new("RGB", (SIZE, SIZE), PLATE)
    canvas.paste(im, ((SIZE - im.width) // 2, (SIZE - im.height) // 2))
    canvas = ImageEnhance.Contrast(ImageEnhance.Color(canvas).enhance(0.92)).enhance(1.05)

    arr = np.asarray(canvas).astype(np.float32)
    arr = plate + (arr - plate) * vignette[..., None]
    dest = os.path.join(OUT, slug + ".webp")
    plated = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    plated.save(dest, "WEBP", quality=86, method=6)
    plated.resize((GRID, GRID), Image.LANCZOS).save(
        os.path.join(OUT, slug + "-s.webp"), "WEBP", quality=80, method=6
    )
    os.remove(tmp)
    print(f"ok {slug}.webp {os.path.getsize(dest)} bytes")

OG_W, OG_H, CELL = 1200, 630, 300
sheet = Image.new("RGB", (OG_W, OG_H), PLATE)
for n, slug in enumerate(BOOKS):
    src = Image.open(os.path.join(OUT, slug + ".webp")).convert("RGB").resize((CELL, CELL), Image.LANCZOS)
    sheet.paste(src, ((n % 4) * CELL, (n // 4) * CELL + (OG_H - 2 * CELL) // 2))
yy, xx = np.mgrid[0:OG_H, 0:OG_W]
og_d = np.hypot((xx - OG_W / 2) / (OG_W / 2), (yy - OG_H / 2) / (OG_H / 2)) / math.sqrt(2)
og_t = np.clip((og_d - 0.10) / 0.62, 0, 1)
fall = (1 - (og_t * og_t * (3 - 2 * og_t))) ** 1.1
og = plate + (np.asarray(sheet).astype(np.float32) - plate) * fall[..., None]
og_path = os.path.join(OUT, "..", "og.jpg")
Image.fromarray(np.clip(og, 0, 255).astype(np.uint8)).save(og_path, "JPEG", quality=88)
print(f"ok og.jpg {os.path.getsize(og_path)} bytes")
