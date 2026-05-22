#!/usr/bin/env python3
"""Build charset.json for each Typefaces/{slug}/font.woff2."""

import json
import os
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
TYPEFACES = ROOT / "Typefaces"


def chars_with_outlines(font):
    cmap = font.getBestCmap()
    glyph_set = font.getGlyphSet()
    chars = []

    for cp in sorted(cmap):
        if cp < 0x20 or cp > 0x7E:
            continue

        gid = cmap[cp]
        name = font.getGlyphName(gid) if isinstance(gid, int) else str(gid)
        if name in (".notdef", ".null"):
            continue

        pen = BoundsPen(glyph_set)
        try:
            glyph_set[name].draw(pen)
        except Exception:
            continue

        if pen.bounds is None:
            # Space often has no outlines but is required for setting text.
            if cp != 0x20:
                continue

        chars.append(chr(cp))

    return chars


def main():
    for slug_dir in sorted(TYPEFACES.iterdir()):
        if not slug_dir.is_dir():
            continue

        font_path = slug_dir / "font.woff2"
        if not font_path.is_file():
            continue

        font = TTFont(font_path)
        chars = chars_with_outlines(font)
        out_path = slug_dir / "charset.json"

        with open(out_path, "w", encoding="utf-8") as fh:
            json.dump({"chars": chars}, fh, ensure_ascii=False)

        print(f"{slug_dir.name}: {len(chars)} characters -> {out_path.name}")


if __name__ == "__main__":
    main()
