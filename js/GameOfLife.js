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

    this.verbose = this.opts.verbose;

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
  getCellByCoords(row, col) {
    row = Number(row) || 0;
    col = Number(col) || 0;

    if(
      (row < GameOfLife.INITIAL_CELL_ID) ||
      (col < GameOfLife.INITIAL_CELL_ID) ||
      (row > this.opts.rows) ||
      (col > this.opts.columns)
    ) {
      throw `{row: ${row}, col: ${col}} are not valid coordinates`;
    }

    return this.getCell(
      (this.opts.columns * row) - (this.opts.columns - col)
    );
  }
  getCellNeighborhood(arg) {
    let cell = Cell.is(arg) ? arg : this.getCell(arg);

    let east, west, north, south;
    let northeast, northwest, southeast, southwest;

    let
      row = cell.coords.row,
      col = cell.coords.col;

    let
      n = row - 1,
      w = col + 1,
      s = row + 1,
      e = col - 1
      ;

    try {
      north = this.getCellByCoords(n, col);
    } catch(e) {
      north = null;
    }

    try {
      northwest = this.getCellByCoords(n,  w);
    } catch(e) {
      northwest = null;
    }

    try {
      west = this.getCellByCoords(row, w);
    } catch(e) {
      west = null;
    }

    try {
      southwest = this.getCellByCoords(s,  w);
    } catch(e) {
      southwest = null;
    }

    try {
      south = this.getCellByCoords(s, col);
    } catch(e) {
      south = null;
    }

    try {
      southeast = this.getCellByCoords(s,  e);
    } catch(e) {
      southeast = null;
    }

    try {
      east = this.getCellByCoords(row, e);
    } catch(e) {
      east = null;
    }

    try {
      northeast = this.getCellByCoords(n, e);
    } catch(e) {
      northeast = null;
    }

    return {
//      cell,
      east, west, north, south,
      northeast, northwest, southeast, southwest
    };
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

  forEach(callback, _this = null) {
    let start = GameOfLife.INITIAL_CELL_ID;

    for(let i = 0, row = start; row <= this.opts.rows; row++) {
      for(let col = start; col <= this.opts.columns; col++) {
        callback.call(_this,  i++, i, row,  col);
      }
    }

    return this;
  }
  walk(callback, _this = null) {
    this.forEach((cellIndex, cellId, row, col) => {
      callback(this.getCell(cellId), {cellIndex, cellId, row,  col});
    }, _this);

    return this;
  }

  emitLifeCycleEvent() {
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
    return this;
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
        this.emitLifeCycleEvent();
      }, this.lifeCycleInterval);
      this.__IS_PLAYING__ = true;
    }

    return this;
  }
  nextLifeCycle() {
    return this.emitLifeCycleEvent();
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

  prepare() {
    this.pause();
    this.lifeCycle = 0;

    this.viewport = document.createElement('div');
    this.viewport.classList.add(`${GameOfLife.NAMESPACE}-viewport`);

    let body = this.el.querySelector(`.${GameOfLife.NAMESPACE}-body`);
    body.innerHTML = "";
    body.appendChild(this.viewport);

    this.cells = Object.create(null);
    this.el.classList.add(GameOfLife.PRISTINE_CLASSNAME);

    return new Promise((resolve, reject) => {

      this
        .forEach((index, id, row, col) => {
        let cell = new Cell(id, false);

        cell.coords = {row, col};
        cell.game = this;
        this.cells[id] = cell;
        this.viewport.appendChild(cell.el);
      })
        .walk((cell, info) => {
          let neighborhood = this.getCellNeighborhood(cell);

          for(let position in neighborhood) {
            if(!neighborhood.hasOwnProperty(position) || !neighborhood[position]) {
              continue;
            }

            let siblingCell = neighborhood[position];
            cell.neighbor = {position, cell: siblingCell};
          }
        })
      ;

      resolve(this);
    });
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
    let isPlaying = this.isPlaying();

    isPlaying && this.pause();
    this.__LIFECYCLE_INTERVAL__ = Number(ms);
    isPlaying && this.play();
  }

  set verbose(val) {
    this.opts.verbose = !!val;
    this.el.dataset.verbose = this.opts.verbose;
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
  --rows: ${i.opts.rows};
  --columns: ${i.opts.columns};
  --cell-alive-color: ${i.opts.aliveColor};
  --cell-dead-color: ${i.opts.deadColor};
  --board-width: calc(var(--columns) * var(--cell-size));
  --board-height: calc(var(--rows) * var(--cell-size));
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
