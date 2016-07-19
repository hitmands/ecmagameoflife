"use strict";

document.addEventListener('DOMContentLoaded', () => {
  let element = document.getElementById("GameOfLife");

  let options = {
    "cellSize": 60,
    "rows": 6,
    "columns": 6,
    "aliveColor": "#333",
    "deadColor": "#fff",
    "verbose": true
  };

  let game = new GameOfLife(element, options);

  Object.assign(window, {
    game
  });

  game
    .prepare()
    .then(GameOfLifeCtrl.bind(Object.create(null), game))
  ;
});
