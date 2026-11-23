// One-off: a patchdata.js written by an older release.py (var BJPLUS / TIMPLUS = {...}) -> this repo's format
// (games/<id>/patchdata.js), with Blue's Journey's Darksoft layout added as data.
//     node tools/convert_old.js OLD_PATCHDATA ID
"use strict";
var fs = require("fs"), path = require("path");
var D = require(path.resolve(process.argv[2])), id = process.argv[3];
if (!D.dark) {
  if (id !== "bjplus") throw new Error("no Darksoft layout in " + process.argv[2]);
  var off = D.vrombOffset;
  D.dark = { prom: { file: "022-p1.p1", swap: false }, srom: "022-s1.s1", m1rom: "022-m1.m1",
             crom: [["022-c1.c1", "022-c2.c2"], ["022-c3.c3", "022-c4.c4"]],
             vrom: [["022-v11.v11", 0], ["022-v22.v22", off]],
             vromSize: off + D.target["022-v22.v22"].size, fpga: "13" };
  delete D.vrombOffset;
}
var out = path.join(__dirname, "..", "games", id, "patchdata.js");
fs.writeFileSync(out, "// Converted from " + id + " " + D.version + "'s release - don't edit.\n" +
  "(function (d) { if (typeof module !== \"undefined\") module.exports = d;\n" +
  "  else (window.PATCHDATA = window.PATCHDATA || {})[" + JSON.stringify(id) + "] = d; })(" + JSON.stringify(D) + ");\n");
console.log(out, fs.statSync(out).size, "bytes,", D.version);
