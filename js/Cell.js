const LIFESTATUS_REASONS = {
  "UNKNOWN": "unknown",
  "INITIAL": "initial",
  "SURVIVAL": "survival",
  "REPRODUCTION": "reproduction",
  "ISOLATION": "isolation",
  "OVERPOPULATION": "overpopulation"
};

const LIFESTATUS = {
  "INITIAL" : 0,
  "ALIVE": 1,
  "DEAD": 2
};

class Cell {
  constructor(id, alive) {
    this.id = id;
    Cell.createHtmlElement(this);

    this.alive = alive;

    this.el.onclick = this.onClick.bind(this);
    this.el.onmouseover = this.onMouseOver.bind(this);
    this.el.id = `Cell-${this.id}`;
    this.el.title = `CELL: ${this.id}`;
    this.el.dataset.id = this.id;

    this.__siblings__ = [];
    this.__neighborhood__ = {
      "north": null,
      "northwest": null,
      "west": null,
      "southwest": null,
      "south": null,
      "southeast": null,
      "east": null,
      "northeast": null,
    };
    this.coords = null;

    this.lifeStatusReason = LIFESTATUS_REASONS.INITIAL;
    this.lifeStatus = LIFESTATUS.INITIAL;
  }

  set lifeStatusReason(val) {
    if(!val) {
      val = LIFESTATUS_REASONS.UNKNOWN;
    }

    this.__LIFESTATUS_REASON__ = val;
    this.el.dataset.lifeStatusReason = this.lifeStatusReason;
  }
  get lifeStatusReason() {
    return this.__LIFESTATUS_REASON__;
  }

  get dead() {
    return !this.alive;
  }

  get alive() {
    return this._alive;
  }

  get lifeStatus() {
    return this.__LIFESTATUS__;
  }
  set lifeStatus(val) {
    this.__LIFESTATUS__ = val;
  }

  set alive(val) {
    this._alive = !!val;

    if(this.alive) {
      this.el.classList.add(Cell.ALIVE_CLASSNAME);
      this.el.classList.remove(Cell.DEATH_CLASSNAME);
    } else {
      this.el.classList.remove(Cell.ALIVE_CLASSNAME);
      this.el.classList.add(Cell.DEATH_CLASSNAME);
    }

  }

  get aliveNeighbors() {
    return this.neighbors.filter(cell => cell.alive);
  }
  get deadNeighbors() {
    return this.neighbors.filter(cell => cell.dead);
  }
  get totalNeighbors() {
    return this.neighbors.length;
  }
  get totalAliveNeighbors() {
    return this.aliveNeighbors.length;
  }
  get totalDeadNeighbors() {
    return this.deadNeighbors.length;
  }

  get neighborhood() {
    return this.__neighborhood__;
  }
  get neighbors() {
    return this.__siblings__;
  }
  set neighbor(arg) {
    let {cell, position} = arg;

    if(!Cell.is(cell)) {
      throw "neighbor must be an instance of Cell";
    }

    if(cell.totalNeighbors > Cell.MAX_NEIGHBORS) {
      throw `Cannot set more than ${Cell.MAX_NEIGHBORS} neighbors. Currently: ${this.totalNeighbors}`;
    }

    if(!(this.neighborhood.hasOwnProperty(position))) {
      throw `Invalid value for position: ${position}`;
    }

    this.__neighborhood__[position] = cell;
    this.__siblings__.push(cell);
  }

  get game() {
    return this.__game__ || null;
  }
  set game(game) {
    if(!GameOfLife.is(game)) {
      throw "game must be an instance of GameOfLife";
    }

    this.__game__ = game;
    this.onLifeCycle(() => this.lifeCheck());
  }

  onClick(e) {
    return this;
  }
  onMouseOver() {

    return this;
  }
  onLifeCycle(callback) {
    this.game.onLifeCycle(callback, this);

    return this;
  }

  kill() {
    if(this.alive) {
      this.alive = false;
    }

    return this;
  }
  live() {
    if(this.dead) {
      this.alive = true;
    }

    return this;
  }
  lifeCheck() {

    let
      reason = this.lifeStatusReason,
      alive = this.alive,
      lifeCycle = this.game.lifeCycle,
      neighbors = this.totalNeighbors,
      aliveNeighbors = this.totalAliveNeighbors,
      deadNeighbors = this.totalDeadNeighbors,
      dieAtLifeCycle = this.dieAtLifeCycle,

      logId = `CELL ID:${this.id}`
    ;

    if(this.game.verbose) {
      console.groupCollapsed(logId);
    }

    if(alive) {
      this.game.verbose && console.log(1);

      if(this.hasLessThanTwoAliveNeighbors()) {
        this.game.verbose && console.log(1.1);

        this.lifeStatusReason = LIFESTATUS_REASONS.ISOLATION;
        this.lifeStatus = LIFESTATUS.DEAD;

      } else if(this.hasMoreThanThreeAliveNeighbors()) {
        this.game.verbose && console.log(1.2);

        this.lifeStatusReason = LIFESTATUS_REASONS.OVERPOPULATION;
        this.lifeStatus = LIFESTATUS.DEAD;

      } else if(this.hasTwoOrThreeAliveNeighbors()) {
        this.game.verbose && console.log(1.3);

        this.lifeStatusReason = LIFESTATUS_REASONS.SURVIVAL;
        this.lifeStatus = LIFESTATUS.ALIVE;
      }

    } else {
      this.game.verbose && console.log(2);

      if(this.hasExactlyThreeAliveNeighbors()) {
        this.game.verbose && console.log(2.1);

        this.lifeStatusReason = LIFESTATUS_REASONS.REPRODUCTION;
        this.lifeStatus = LIFESTATUS.ALIVE;
      }

    }

    if(this.game.verbose) {
      console.log(this.lifeStatusReason.toUpperCase(), (this.alive ? "ALIVE" : "DEAD"), {
        life: {prev: alive, current: this.alive}
        , lifeStatus: {prev: reason, current: this.lifeStatusReason}
        , lifeCycle, dieAtLifeCycle
        , neighbors: {total: neighbors,  alive: aliveNeighbors, dead: deadNeighbors}
      }
//        , this
      );

      console.groupEnd(logId);
    }

    return this;
  }

  hasLessThanTwoAliveNeighbors() {
    return this.totalAliveNeighbors < 2;
  }
  hasTwoOrThreeAliveNeighbors() {
    return this.totalAliveNeighbors === 2 || this.totalAliveNeighbors === 3;
  }
  hasMoreThanThreeAliveNeighbors() {
    return this.totalAliveNeighbors > 3;
  }
  hasExactlyThreeAliveNeighbors() {
    return this.totalAliveNeighbors === 3;
  }

  is(arg) {
    return Cell.is(arg) && (this.id === arg.id);
  }

  static get ALIVE_CLASSNAME() {
    return "is-alive";
  }
  static get DEATH_CLASSNAME() {
    return "is-dead";
  }
  static get MAX_NEIGHBORS() {
    return 8;
  }

  static is(arg) {
    return arg instanceof Cell;
  }
  static createHtmlElement(instance) {
    let el = document.createElement('div');

    el.classList.add('cell');

    el.cell = instance;
    instance.el = el;
    return Cell;
  }
  static onClick(game, cb) {
    game.el.addEventListener("click", event => {
      let cell;

      try {
        cell = event.target.cell;
      } catch(e) {}

      if(cell) {
        cb.call(null, event, cell);
      }
    });
  }
}
