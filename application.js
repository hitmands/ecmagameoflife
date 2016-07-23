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

  let
    game = new GameOfLife(element, options),
    scope = GameOfLifeCtrl.bind(Object.create(null))
    ;


  Object.assign(window, {
    game,
    ctrl: scope
  });

  ((el) => {
    let
      born = new Date(1986, 4, 16),
      now = new Date(),

      age = now.getFullYear() - born.getFullYear(),

      tpl = `<span><strong>Giuseppe Mandato</strong> - ${age} years old Frontend Developer</span>`
    ;

    el.innerHTML = tpl;
  })(document.getElementById('Hitmands'));

  game
    .prepare()
    .then(GameOfLifeCtrl.bind(scope,  game))
  ;
});
