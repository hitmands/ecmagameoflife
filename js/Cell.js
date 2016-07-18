const LIFESTATUS_REASONS = {
  "UNKNOWN": "unknown",
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
  }

  set lifeStatusReason(val) {
    if(!val) {
      val = LIFESTATUS_REASONS.UNKNOWN;
    }

    this.__LIFESTATUS_REASON__ = val;
    this.el.dataset.lifeStatusReason = val;
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
    }

  }

  get aliveNeighbors() {
    return this.neighbors.filter(cell => cell.alive);
  }
  get deadNeighbors() {
    return this.neighbors.filter(cell => cell.dead);
  }
  get totalAliveNeighbors() {
    return this.aliveNeighbors.length;
  }
  get totalDeadNeighbors() {
    return this.deadNeighbors.length;
  }

  get neighbors() {
    return this.__siblings__;
  }
  set neighbor(cell) {
    if(!Cell.is(cell)) {
      throw "neighbor must be an instance of Cell";
    }

    if(cell.neighbors.length >= Cell.MAX_NEIGHBOURS) {
      throw `Cannot set more than ${Cell.MAX_NEIGHBOURS} neighbours`;
    }

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
    if(this.dead) {
      if(this.hasExactlyThreeAliveNeighbours()) {
        return this.live(LIFESTATUS_REASONS.REPRODUCTION);
      }

      return this.kill();
    }

    if(this.hasLessThanTwoAliveNeighbours()) {
      return this.dead(LIFESTATUS_REASONS.ISOLATION);
    }

    if(this.hasMoreThanThreeAliveNeighbours()) {
      return this.dead(LIFESTATUS_REASONS.OVERPOPULATION);
    }

    if(this.hasTwoOrThreeAliveNeighbours()) {
      return this.live(LIFESTATUS_REASONS.SURVIVAL);
    }


    return this;
  }

  hasLessThanTwoAliveNeighbours() {
    return this.totalAliveNeighbors < 2;
  }
  hasTwoOrThreeAliveNeighbours() {
    return this.totalAliveNeighbors === 2 || this.totalAliveNeighbors === 3;
  }
  hasMoreThanThreeAliveNeighbours() {
    return this.totalAliveNeighbors > 3;
  }
  hasExactlyThreeAliveNeighbours() {
    return this.totalAliveNeighbors === 3;
  }

  static get ALIVE_CLASSNAME() {
    return "is-alive";
  }
  static get DEATH_CLASSNAME() {
    return "is-dead";
  }
  static get MAX_NEIGHBOURS() {
    return 6;
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
