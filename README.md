# Neo Geo Plus Patcher

A web patcher for Loren Vanderbilt III's Neo Geo fan updates. Drop in your own copy of the original game, pick what
you play on (MAME, RetroArch, MiSTer, Analogue Pocket, BackBit Platinum) and download a zip laid out for that system,
with a README. Everything happens in your browser: your files are never uploaded, and this repo holds no game data.

- Blue's Journey Plus: `?game=bjplus`
- The Irritating Maze Plus: `?game=timplus`

## How it fits together

- `index.html` is the page. `?game=<id>` picks the game; with no game it lists them.
- `patcher.js` is the engine: it reads zips and folders, finds the game's files by checksum (a MAME set or a
  Darksoft-style folder), patches them, checks every patched file's checksum and builds each system's package.
- `games.js` holds each game's wording (names, MAME set, credit, itch page). Edit it by hand.
- `games/<id>/patchdata.js` is one release's data: checksums, patch bytes, Darksoft layout, packages and install
  steps. Each game's `tools/release.py` writes it, with `--publish`; don't edit it.
- `tools/ngpatcher.py` is what each game's `release.py` imports (this repo sits next to theirs): it wraps the
  data, writes it here, and makes a copy of the page for one game alone (itch.io's HTML upload, offline use).
- `tools/convert_old.js` converted the two Beta 1 releases, made before this repo existed. Not needed again.

## Testing

```
node tools/test.js bjplus ../blues-journey-plus/roms/bjourney.zip ../blues-journey-plus/dist/bjplus-beta1
node tools/test.js timplus ../tim-plus/roms/irrmaze.zip ../tim-plus/dist/timplus-beta1
```

These patch the original set the way the page does and check every package against the release's own
ready-patched copies.
