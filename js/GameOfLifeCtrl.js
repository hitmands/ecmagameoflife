"use strict";

function GameOfLifeCtrl(game) {
  game.lifeCycleInterval = 3000;

  let controls = (($) => {
    let ctrls = $.getElementById('GameOfLife-Controls');
    let toggle = ctrls.querySelector('[data-controls-toggle]');
    let viewport = ctrls.querySelector('[data-controls-viewport]');

    toggle.onclick = () => {
      game.isPlaying() ? game.pause() : game.play();
    };

    game.onLifeCycle((event, data) => {
      viewport.innerHTML = data.lifeCycle;
    });

  })(document);
}
