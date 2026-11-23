// Test the engine (patcher.js) with a game's patch data, against that release's own ready-patched packages:
//     node tools/test.js ID ORIGINAL_ZIP RELEASE_DIR
//     node tools/test.js bjplus ../blues-journey-plus/roms/bjourney.zip ../blues-journey-plus/dist/bjplus-beta1
// It patches the original MAME set the patcher's way, builds every package and checks each file against
// RELEASE_DIR/private/<system>/ (README.txt aside: the private copy's first lines differ; a zip inside a package
// by its contents). The data: RELEASE_DIR/patcher/'s copy if it has one, else this repo's games/ID/. Also: a Darksoft-style folder as input, a changed program ROM, and something that isn't the game.
"use strict";
var fs = require("fs"), path = require("path");
var id = process.argv[2], originalZip = process.argv[3], release = process.argv[4];
if (!release) { console.error("usage: node tools/test.js ID ORIGINAL_ZIP RELEASE_DIR"); process.exit(2); }
var own = path.resolve(release, "patcher", "games", id, "patchdata.js");   // the release's copy, else the live one
var D = require(fs.existsSync(own) ? own : path.join(__dirname, "..", "games", id, "patchdata.js"));
var P = require(path.join(__dirname, "..", "patcher.js"));
var GAMES = require(path.join(__dirname, "..", "games.js"));
var failures = 0;

function check(ok, what) {
  console.log((ok ? "ok    " : "FAIL  ") + what);
  if (!ok) failures++;
}
function same(a, b) {
  return a.length === b.length && Buffer.compare(Buffer.from(a), Buffer.from(b)) === 0;
}
async function zipMap(data) {
  var m = {};
  (await P.readZip(data)).forEach(function (f) { m[f.name] = f.data; });
  return m;
}

(async function () {
  check(GAMES.some(function (g) { return g.id === id; }), id + " is in games.js");
  var original = new Uint8Array(fs.readFileSync(originalZip)), set = path.basename(originalZip, ".zip");
  var id1 = await P.identify(D, [{ name: path.basename(originalZip), data: original }]);
  check(id1.ok, "the MAME set's " + path.basename(originalZip) + " is recognised");

  var t = Date.now(), built = await P.patch(D, id1.files);
  check(true, "patched, every file's checksum right (" + (Date.now() - t) + " ms)");

  for (var i = 0; i < D.packages.length; i++) {
    var pkg = D.packages[i], files = await P.packageFiles(D, pkg, built), bad = [];
    for (var j = 0; j < files.length; j++) {
      var f = files[j], disk = path.join(release, "private", pkg.id, f.name);
      if (f.name === "README.txt") { if (!fs.existsSync(disk)) bad.push(f.name); continue; }
      if (!fs.existsSync(disk)) { bad.push(f.name + " (not in private/)"); continue; }
      var want = new Uint8Array(fs.readFileSync(disk));
      if (/\.zip$/.test(f.name)) {
        var a = await zipMap(f.data), b = await zipMap(want);
        if (Object.keys(a).sort().join() !== Object.keys(b).sort().join() ||
            Object.keys(a).some(function (k) { return !same(a[k], b[k]); })) bad.push(f.name);
      } else if (!same(f.data, want)) bad.push(f.name);
    }
    var zipped = await P.buildPackage(D, pkg, built), back = await zipMap(zipped);
    if (Object.keys(back).length !== files.length) bad.push("(its zip)");
    check(bad.length === 0, pkg.label + ": " + files.length + " files, " + Math.round(zipped.length / 1024) +
          " KB" + (bad.length ? " - wrong: " + bad.join(", ") : ""));
  }

  var orig = await zipMap(original), dark = P.darksoft(D, orig);
  var fromDark = await P.identify(D, Object.keys(dark).map(function (n) { return { name: set + "/" + n, data: dark[n] }; }));
  check(fromDark.ok && D.order.every(function (n) { return same(fromDark.files[n], orig[n]); }),
        "a Darksoft-style folder is recognised and turned back into the MAME files");

  var prom = D.order[0], wrong = Object.keys(orig).map(function (n) {
    var d = orig[n].slice(); if (n === prom) d[100] ^= 1; return { name: n, data: d };
  });
  var w = await P.identify(D, wrong);
  check(!w.ok && w.status.filter(function (s) { return s.state === "other"; }).map(function (s) { return s.name; }).join() === prom,
        "a changed program ROM is reported as a different version, by name");
  var none = await P.identify(D, [{ name: "readme.txt", data: new TextEncoder().encode("hello") }]);
  check(!none.ok && none.status.every(function (s) { return s.state === "missing"; }), "something else: every file missing");

  console.log(failures ? failures + " failed" : "all passed");
  process.exit(failures ? 1 : 0);
})().catch(function (e) { console.error(e); process.exit(1); });
