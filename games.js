// The games this patcher knows, with the words its page uses for each. Each game's patch data is
// games/<id>/patchdata.js, written by that game's tools/release.py; this file is edited by hand.
//   game      the original game's name, as the page says it ("Your copy of ...")
//   set       the MAME set's name (its zip, and the Darksoft-style folder's)
//   setLong   what the set is, for the "different version" message
//   blurb     one line for the list of games
//   page      the game's itch.io page
//   credit    the footer's line
(function (root) {
  var GAMES = [
    {
      id: "bjplus",
      name: "Blue's Journey Plus",
      game: "Blue's Journey",
      set: "bjourney",
      setLong: "Blue's Journey / Raguy, ALM-001 ~ ALH-001",
      blurb: "The charming 1990 platformer, polished: big Blue artwork, a pause menu, a new translation and many fixes.",
      page: "https://powerwindows.itch.io/blues-journey-plus",
      credit: "Blue's Journey © 1990 Alpha Denshi / SNK. Blue's Journey Plus is an unofficial fan project by " +
              "Loren Vanderbilt III."
    },
    {
      id: "timplus",
      name: "The Irritating Maze Plus",
      game: "The Irritating Maze",
      set: "irrmaze",
      setLong: "The Irritating Maze / Ultra Denryu Iraira Bou",
      blurb: "The trackball-only arcade maze, made playable with a joystick on the home console and any MVS.",
      page: "https://powerwindows.itch.io/the-irritating-maze-plus",
      credit: "The Irritating Maze © 1997 SNK / Saurus. The Irritating Maze Plus is an unofficial fan project by " +
              "Loren Vanderbilt III."
    }
  ];
  if (typeof module !== "undefined") module.exports = GAMES;
  else root.NGGAMES = GAMES;
})(this);
