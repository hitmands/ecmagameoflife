class GameOfLife {
  constructor(el, options) {
    this.el = el;

    this.opts = Object.assign({
      "cellSize": 60,
      "rows": 8,
      "columns": 8,
      "aliveColor": "#333",
      "deadColor": "#fff",
      "theme": "default",
      "verbose": false
    }, options);

    this.cellsCount = this.opts.rows * this.opts.columns;
    GameOfLife.decorateBoard(this);
  }

  getCell(id) {
    let cell = this.cells[id];
    if(!Cell.is(cell)) {
      throw `${id} is not a valid cell id. Available Range ${GameOfLife.INITIAL_CELL_ID}:${this.cellsCount}`;
    }

    return cell;
  }

  kill(...ids) {
    for(let id of ids) {
      this.getCell(id).kill();
    }

    return this;
  }
  live(...ids) {
    for(let id of ids) {
      this.getCell(id).live();
    }

    return this;
  }
  killAll() {
    return this.walk(cell => cell.kill());
  }
  liveAll() {
    return this.walk(cell => cell.live());
  }

  walk(callback) {
    for(let id = GameOfLife.INITIAL_CELL_ID; id <= this.cellsCount; id++) {
      callback(this.getCell(id), id);
    }

    return this;
  }
  start() {
    let body = this.el.querySelector(`.${GameOfLife.NAMESPACE}-body`);
    this.viewport = document.createElement('div');
    this.viewport.classList.add(`${GameOfLife.NAMESPACE}-viewport`);

    this.lifeCycle = 0;
    body.innerHTML = "";
    body.appendChild(this.viewport);

    this.cells = Object.create(null);
    this.pause();
    this.el.classList.add(GameOfLife.PRISTINE_CLASSNAME);
    return new Promise((resolve, reject) => {
      for(let id = GameOfLife.INITIAL_CELL_ID; id <= this.cellsCount; id++) {
        let cell = new Cell(id, false);
        cell.game = this;
        this.cells[id] = cell;
        this.viewport.appendChild(cell.el);
      }

      resolve(this);
    });
  }

  emitLifeCyclEvent() {
    let event = GameOfLife.createEvent();

    this.lifeCycle += 1;
    if(this.verbose) {
      console.log(
        `%cGameOfLife:(${this.id}) - Life Cycle ${this.lifeCycle}`,
        `color: ${this.opts.aliveColor}; background-color: ${this.opts.deadColor};`
      );
    }

    event.initCustomEvent(this.LIFECYCLE_EVENTNAME, true, true, {
      lifeCycle: this.lifeCycle
    });
    GameOfLife.triggerEvent(event);
  }

  onLifeCycle(callback, _this = null) {
    document.addEventListener(this.LIFECYCLE_EVENTNAME, (event) => {
      callback.call(_this, event, event.detail);
    });

    return this;
  }

  play() {
    if(this.isPaused()) {
      this.el.classList.remove(GameOfLife.PAUSE_CLASSNAME, GameOfLife.PRISTINE_CLASSNAME);
      this.el.classList.add(GameOfLife.PLAY_CLASSNAME);
      this.__INTERVAL__ = window.setInterval(() => {
        this.emitLifeCyclEvent();
      }, this.lifeCycleInterval);
      this.__IS_PLAYING__ = true;
    }

    return this;
  }
  pause() {
    if(this.isPlaying()) {
      window.clearInterval(this.__INTERVAL__);
      this.el.classList.add(GameOfLife.PAUSE_CLASSNAME);
      this.el.classList.remove(GameOfLife.PLAY_CLASSNAME);
      this.__IS_PLAYING__ = false;
    }

    return this;
  }
  isPaused() {
    return !this.isPlaying();
  }
  isPlaying() {
    return this.__IS_PLAYING__;
  }

  get LIFECYCLE_EVENTNAME() {
    return `${this.id}.${GameOfLife.LIFECYCLE_EVENTNAME}`;
  }
  get id() {
    return this.el.id;
  }
  get lifeCycle() {
    return this.__lifeCycle__;
  }
  set lifeCycle(val) {
    this.__lifeCycle__ = Number(val) || 0;
    this.el.dataset.lifeCycle = this.lifeCycle;
  }

  get lifeCycleInterval() {
    return this.__LIFECYCLE_INTERVAL__ || 1000;
  }
  set lifeCycleInterval(ms) {
    this.__LIFECYCLE_INTERVAL__ = Number(ms);
  }


  set verbose(val) {
    this.opts.verbose = !!val;
  }
  get verbose() {
    return !!this.opts.verbose;
  }

  static get NAMESPACE() {
    return "gameoflife";
  }
  static get INITIAL_CELL_ID() {
    return 1;
  }
  static get PAUSE_CLASSNAME() {
    return "is-paused";
  }
  static get PRISTINE_CLASSNAME() {
    return "is-pristine";
  }
  static get PLAY_CLASSNAME() {
    return "is-playing";
  }
  static get LIFECYCLE_EVENTNAME() {
    return "GAMEOFLIFE_EVENT::LIFECYCLE";
  }

  static decorateBoard(i) {
    let _id = i.id;
    let id = `${_id}StyleOptions`;
    let style = document.getElementById(id);

    if(!style) {
      style = document.createElement('style');
      style.id = id;
      document.head.appendChild(style);
    }

    i.el.dataset.theme = i.opts.theme;
    style.innerHTML = `
#${_id} {
  --cell-size: ${i.opts.cellSize}px;
  --cell-alive-color: ${i.opts.aliveColor};
  --cell-dead-color: ${i.opts.deadColor};
  --board-width: ${i.opts.columns * i.opts.cellSize}px;
  --board-height: ${i.opts.rows * i.opts.cellSize}px;
}
`;

  }
  static createEvent() {
    return document.createEvent("CustomEvent");
  }
  static triggerEvent(event) {
    document.dispatchEvent(event);
  }
  static is(arg) {
    return arg instanceof GameOfLife;
  }
}
