"use strict";

function GameOfLifeCtrl(game) {
  let REASON = "userinput";
  game.lifeCycleInterval = 500;

  const PATTERNS = {
    "NONE": 0,
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
        this.drawBlock(419);
        break;
      case PATTERNS.BEEHIVE:
        this.drawBeehive(379);
        break;
      case PATTERNS.LOAF:
        this.drawLoaf(419);
        break;
      case PATTERNS.BOAT:
        this.drawBoat(83);
        break;
      case PATTERNS.TOAD:
        this.drawToad(83);
        break;
      case PATTERNS.BLINKER:
        this.drawBlinker(83);
        break;
      case PATTERNS.BEACON:
        this.drawBeacon(83);
        break;
      case PATTERNS.PULSAR:
        this.drawPulsar(137);
        break;
      case PATTERNS.PENTADECATHLON:
        this.drawPentadecathlon(179);
        break;
      case PATTERNS.GLIDER:
        this.drawGlider(2);
        break;
      case PATTERNS.LIGHTWEIGHT_SPACESHIP:
        this.drawLightWeightSpaceShip(397);
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

    cell
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .east
      .live()
    ;

    return this;
  };
  this.drawBeehive = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

      cell
        .live()

        .neighborhood
        .northwest
        .live()

        .neighborhood
        .west
        .live()

        .neighborhood
        .southwest
        .live()

        .neighborhood
        .southeast
        .live()

        .neighborhood
        .east
        .live()
      ;

    return this;
  };
  this.drawLoaf = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    cell
      .live()

      .neighborhood
      .northwest
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .southwest
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .northeast
      .live()

      .neighborhood
      .northeast
      .live()
    ;

    return this;
  };
  this.drawBoat = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    cell
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .southwest
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .northeast
      .live()
    ;

    return this;
  };
  this.drawBlinker = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    cell
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .west
      .live()
    ;

    return this;
  };
  this.drawToad = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    cell
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .northwest
      .live()
    ;

    return this;
  };
  this.drawBeacon = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    cell
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .southwest

      .neighborhood
      .southwest
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .north
      .live()
    ;

    return this;
  };
  this.drawPulsar = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    cell
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .south

      .neighborhood
      .south
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .east

      .neighborhood
      .east
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .south

      .neighborhood
      .south

      .neighborhood
      .south

      .neighborhood
      .south

      .neighborhood
      .south

      .neighborhood
      .south
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .west

      .neighborhood
      .west
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .southwest
      .live()

      .neighborhood
      .northwest
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .southeast

      .neighborhood
      .south
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .west

      .neighborhood
      .west

      .neighborhood
      .west

      .neighborhood
      .west

      .neighborhood
      .west

      .neighborhood
      .west
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .north

      .neighborhood
      .north
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .northwest
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .west

      .neighborhood
      .west
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .north

      .neighborhood
      .north

      .neighborhood
      .north

      .neighborhood
      .north

      .neighborhood
      .north

      .neighborhood
      .north
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .east

      .neighborhood
      .east
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .northeast
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .north

      .neighborhood
      .north
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .north
      .live()
    ;

    return this;
  };
  this.drawPentadecathlon = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    cell
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .south

      .neighborhood
      .south
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .north
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .south

      .neighborhood
      .south
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .west
      .live()
    ;

    return this;
  };
  this.drawGlider = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    cell
      .live()

      .neighborhood
      .southwest
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .east
      .live()

      .neighborhood
      .east
      .live()
    ;

    return this;
  };
  this.drawLightWeightSpaceShip = (cell) => {
    cell = Cell.is(cell) ? cell: game.getCell(cell);

    cell
      .live()

      .neighborhood
      .southeast
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .south
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .west
      .live()

      .neighborhood
      .northwest
      .live()

      .neighborhood
      .north

      .neighborhood
      .north
      .live()
    ;

    return this;
  };


  this.restoreCurrentPattern = () => this.setPattern(this.currentPattern);
}
