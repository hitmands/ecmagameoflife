"use strict";

document.addEventListener('DOMContentLoaded', () => {
  let element = document.getElementById("GameOfLife");

  let options = {
    "cellSize": 30,
    "rows": 20,
    "columns": 40,
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
