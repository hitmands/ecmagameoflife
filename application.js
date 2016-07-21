"use strict";

document.addEventListener('DOMContentLoaded', () => {
  let element = document.getElementById("GameOfLife");

  let options = {
    "cellSize": 40,
    "rows": 15,
    "columns": 15,
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
