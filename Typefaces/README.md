# Typefaces

| Folder | Display name |
|--------|----------------|
| `istorya/` | Istorya |
| `clayletter/` | Clayletter |
| `suburb/` | Suburb |
| `pearface/` | PearFace |
| `rough-pixel/` | Rough Pixel |
| `sketchface/` | Sketchface |
| `warp-woven/` | Warp Woven |

Add `Typefaces/{slug}/font.woff2` and an entry in `typefaces.js` (include a `description` string for the short blurb). Keep one woff2 per folder (site loads `font.woff2` by default).

Each folder should include `charset.json` (list of supported characters for the specimen grid). Regenerate after replacing a font:

```bash
python3 scripts/build-typeface-charsets.py
```
