"use strict";

document.addEventListener('DOMContentLoaded', () => {
  let element = document.getElementById("GameOfLife");

  let options = {
    "cellSize": 20,
    "rows": 25,
    "columns": 25,
    "aliveColor": "#333",
    "deadColor": "#fff"
  };

  let game = new GameOfLife(element, options);

  Object.assign(window, {
    game
  });

  game
    .start()
    .then(GameOfLifeCtrl.bind(Object.create(null), game))
  ;
});
