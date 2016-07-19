const LIFESTATUS_REASONS = {
  "UNKNOWN": "unknown",
  "INITIAL": "initial",
  "SURVIVAL": "survival",
  "REPRODUCTION": "reproduction",
  "ISOLATION": "isolation",
  "OVERPOPULATION": "overpopulation"
};

class Cell {
  constructor(id, alive) {
    this.id = id;
    this.el = Cell.createHtmlElement();
    this.alive = alive;

    this.el.onclick = this.onClick.bind(this);
    this.el.onmouseover = this.onMouseOver.bind(this);
    this.el.id = `Cell-${this.id}`;
    this.el.title = `CELL: ${this.id}`;

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
    this.lifeStatusReason = LIFESTATUS_REASONS.INITIAL;
    this.coords = null;
    this.dieAtLifeCycle = void(0);
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
  set alive(val) {
    this._alive = !!val;

    if(this.alive) {
      this.el.classList.add(Cell.ALIVE_CLASSNAME);
      this.el.classList.remove(Cell.DEATH_CLASSNAME);
    } else {
      this.el.classList.remove(Cell.ALIVE_CLASSNAME);
      this.el.classList.add(Cell.DEATH_CLASSNAME);
      this.dieAtLifeCycle = void(0);
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
    e.stopPropagation();

    if(this.alive) {
      this.kill();
    } else {
      this.live();
    }

    return this;
  }
  onMouseOver() {

    return this;
  }
  onLifeCycle(callback) {
    this.game.onLifeCycle(callback, this);

    return this;
  }

  kill(reason) {
    if(this.alive) {
      this.alive = false;
    }

    this.lifeStatusReason = reason;
    return this;
  }
  live(reason) {
    if(this.dead) {
      this.alive = true;
    }

    this.lifeStatusReason = reason;
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
      dieAtLifeCycle = this.dieAtLifeCycle
    ;

    if(dieAtLifeCycle === lifeCycle) {
      this.kill()
    } else if(this.alive) {
      if(this.hasLessThanTwoAliveNeighbors()) {
        this.kill(LIFESTATUS_REASONS.ISOLATION);

      } else if(this.hasMoreThanThreeAliveNeighbors()) {
        this.kill(LIFESTATUS_REASONS.OVERPOPULATION);

      } else if(this.hasTwoOrThreeAliveNeighbors()) {
        this.live(LIFESTATUS_REASONS.SURVIVAL);
        this.dieAtLifeCycle = lifeCycle + 1;
      }

    } else {
      if(this.hasExactlyThreeAliveNeighbors()) {
        this.live(LIFESTATUS_REASONS.REPRODUCTION);
      }

    }

    if(this.game.verbose) {
      console.log(this.id, {
        alive, reason,  lifeCycle, dieAtLifeCycle
        , neighbors: {total: neighbors,  alive: aliveNeighbors, dead: deadNeighbors}
    }
//        , this
      );
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
  static createHtmlElement() {
    let el = document.createElement('div');

    el.classList.add('cell');

    return el;
  }
}
