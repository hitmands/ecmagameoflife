"use strict";

function GameOfLifeCtrl(game) {
  let REASON = "userdefined";
  game.lifeCycleInterval = 500;

  let controls = (($) => {
    let el = $.getElementById('GameOfLife-Controls');
    let toggle = el.querySelector('[data-controls-toggle]');
    let viewport = el.querySelector('[data-controls-viewport]');

    toggle.onclick = () => {
      game.isPlaying() ? game.pause() : game.play();
    };

    return {el, toggle, viewport};
  })(document);

  game.onLifeCycle((event, data) => {
    controls.viewport.innerHTML = data.lifeCycle;

    setTimeout(()=> {
      game.walk(cell => {
        cell.lifeStatus === LIFESTATUS.ALIVE ? cell.live() : cell.kill()
      })
    }, 1);
  });

  Cell.onClick(game, (event, cell) => {
    event.stopPropagation();

    cell.alive ? cell.kill(REASON) : cell.live(REASON);
  });

  //game.live(2, 18, 33, 32, 31); // BOAT;
  game.live(

  ); //cannons
}
