"use strict";

function GameOfLifeCtrl(game) {
  let REASON = "userinput";
  game.lifeCycleInterval = 500;

  const PATTERNS = {
    "BLOCK": 1,
    "BEEHIVE": 2,
    "LOAF": 3,
    "BOAT": 4,
    "BLINKER": 5,
    "TOAD": 6,
    "BEACON": 7,
    "PULSAR": 8,
    "PENTADECATHLON": 9,
    "GLIDER": 10,
    "LIGHTWEIGHT_SPACESHIP": 11
  };

  let controls = (($) => {
    let el = $.getElementById('GameOfLife-Controls');
    let toggle = el.querySelector('[data-controls-toggle]');
    let next = el.querySelector('[data-controls-nextlifecycle]');
    let clear = el.querySelector('[data-controls-reset]');
    let viewport = el.querySelector('[data-controls-viewport]');
    let select = $.querySelector('#GameOfLife-Patterns');

    toggle.onclick = () => game.isPlaying() ? game.pause() : game.play();
    next.onclick = () => game.nextLifeCycle();
    clear.onclick = () => {
      this.reset();
      this.restoreCurrentPattern();
    };

    select.onchange = () => this.setPattern(Number(select.value));

    return {el, toggle, viewport, next, select};
  })(document);

  game.onLifeCycle((event, data) => {
    controls.viewport.innerHTML = data.lifeCycle;

    setTimeout(()=> {
      game.walk(cell => {
        cell.lifeStatus === LIFESTATUS.ALIVE ? cell.live() : cell.kill()
      })
    }, 0);
  });

  Cell.onClick(game, (event, cell) => {
    event.stopPropagation();

    cell.alive ? cell.kill(REASON) : cell.live(REASON);
  });

  this.currentPattern = 0;
  this.setPattern = (type) => {
    this.reset();
    this.currentPattern = type;

    switch(this.currentPattern) {
      case PATTERNS.BLOCK:
        this.drawBlock(83);
        break;
    }
  };

  this.reset = () => {
    game.pause();
    game.lifeCycle = 0;
    controls.viewport.innerHTML = `${game.lifeCycle}`;

    game.walk(cell => {
      cell.kill();
      cell.lifeStatus = LIFESTATUS.INITIAL;
      cell.lifeStatusReason = LIFESTATUS_REASONS.INITIAL;
    });
  };

  this.drawBlock = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    let {west, south, southwest} = cell.neighborhood;
    cell.live();
    try {
      cell.live();
      west.live();
      south.live();
      southwest.live();
    } catch(e) {}
  };

  this.restoreCurrentPattern = () => this.setPattern(this.currentPattern);
}
