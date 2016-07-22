"use strict";

document.addEventListener('DOMContentLoaded', () => {
  let element = document.getElementById("GameOfLife");

  let options = {
    "cellSize": 20,
    "rows": 20,
    "columns": 40,
    "aliveColor": "#333",
    "deadColor": "#fff",
    "verbose": false
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
