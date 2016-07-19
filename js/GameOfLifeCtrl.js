"use strict";

function GameOfLifeCtrl(game) {
  let REASON = "userdefined";
  game.lifeCycleInterval = 3000;

  let controls = (($) => {
    let el = $.getElementById('GameOfLife-Controls');
    let toggle = el.querySelector('[data-controls-toggle]');
    let viewport = el.querySelector('[data-controls-viewport]');

    toggle.onclick = () => {
      game.isPlaying() ? game.pause() : game.play();
    };

    game.onLifeCycle((event, data) => {
      viewport.innerHTML = data.lifeCycle;
    });

    return {el, toggle, viewport};
  })(document);


  Cell.onClick(game, (event, cell) => {
    event.stopPropagation();

    cell.alive ? cell.kill(REASON) : cell.live(REASON);
  });

  game.live(35, 30, 23, 22, 28); // BOAT;
}
