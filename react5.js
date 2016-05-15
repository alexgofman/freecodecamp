// Code for Roguelike Game RPG
class Player {
  constructor() {
    this.y = 39;
    this.x = 32;
    this.level = 1;
    this.health = 100;
    this.damage = 30;
    this.weapon = 'knife';
  }

  getDamage() {
    return Math.round(this.damage + (this.damage * this.level / 3));
  }
}

class HealthBox {
  constructor() {
    this.type = Map.TILE.HEALTH;
    this.health = 40;
  }
}

class WeaponAxe {
  constructor() {
    this.type = Map.TILE.WEAPON;
    this.damage = 80;
    this.weapon = 'axe';
  }
}

class SimpleEnemy {
  constructor() {
    this.type = Map.TILE.ENEMY;
    this.damage = 20;
    this.health = 40;
  }
}

class BossEnemy {
  constructor() {
    this.type = Map.TILE.BOSS;
    this.damage = 60;
    this.health = 160;
  }
}

class Map {
  static TILE = {
    BOSS : 6,
    ENEMY : 5,
    WEAPON : 4,
    HEALTH : 3,
    PLAYER : 2,
    WALL : 1,
    FLOOR : 0
  };

  static CLASS = {
    6 : 'tile-boss',
    5 : 'tile-enemy',
    4 : 'tile-weapon', // before was 'tile_weapon'
    3 : 'tile-health',
    2 : 'tile-player',
    1 : 'tile-wall',
    0 : 'tile-floor'
  };

  static INSTANCE = {
    init : null
  };

  constructor() {
    this.board = [];
    this.initialBoard = [];
    this.player = new Player();
    Map.INSTANCE.init = this;
    this.gameOver = false;
    this.youWin = false;
    this.overcast = true;
  }

  load(dn) {
    this.width = dn.width;
    this.height = dn.height;
    this.tileSize = dn.tile;
    this.initialBoard = this.mapBoard(dn);
    this.entities = this.randomizeEntities([
      new HealthBox(), new HealthBox(), new HealthBox(), new HealthBox(),
      new WeaponAxe(), new SimpleEnemy(), new SimpleEnemy(), new BossEnemy()
    ]);
    this.board = this.mapEntities();
    return this;
  }

  randomizeEntities(entities) {
    let takenPositions = [];
    let isTaken = (x, y) => {
      return takenPositions.filter( p => p.x === x && p.y === y).length > 0;
    }
    let createPos = () => {
      let x = 0,
          y = 0;

      while(this.initialBoard[y] && this.initialBoard[y][x] &&
            this.initialBoard[y][x] !== Map.TILE.FLOOR && !isTaken(x, y)) {
              x = Math.round(Math.random() * this.width);
              y = Math.round(Math.random() * this.height);
            }
            takenPositions.push({x, y});
            return {x, y};
    };

    return entities.map((e) => {
      let pos = createPos();
      e.x = pos.x;
      e.y = pos.y;
      return e;
    });
  }

  mapBoard(dn) {
    let board = [];
    for (let y = 0; y < this.height; y++) {
      board[y] = [];
      for (let x = 0; x < this.width; x++) {
        board[y][x] = dn.data[(y * this.height + x)];
      }
    }
    return board;
  }

  entityAt(x, y) {
    return this.entities.filter( e => e.x === x && e.y === y)[0] || null;
  }

  removeEntity(x, y) {
    let pos = null;
    for (let i = 0; i < this.entities.length; i++) {
      if (this.entities[i].x === x && this.entities[i].y === y) {
        this.entities.splice(i, 1);
      }
    }
    return this.entities;
  }

  mapEntities() {
    let board = this.initialBoard.map((row, y) => {
      return row.map((col, x) => {
        let ent = this.entities ? this.entityAt(x, y) : null;
        return ent !== null ? ent.type : col;
      });
    });

    // Map Player position
    return board.map((row, y) => {
      return row.map((col, x) => {
        return x === this.player.x && y === this.player.y ? Map.TILE.PLAYER : col;
      });
    });
  }

  takeHEALTH(x, y) {
    let ent = this.entityAt(x, y);
    this.player.health += ent.health;
    this.removeEntity(x, y);
  }

  takeWEAPON(x, y) {
    let ent = this.entityAt(x, y);
    this.player.weapon = ent.weapon;
    this.player.damage = ent.damage;
    this.removeEntity(x, y);
  }

  fight(x, y) {
    let ent = this.entityAt(x, y);
    ent.health -= this.player.getDamage();
    this.player.health -= ent.damage;

    if (this.player.health <= 0) {
      this.gameOver = true;
      return false;
    }

    if (ent.health <= 0) {
      this.player.level += 1;
      this.removeEntity(x, y);

      if (ent.type === Map.TILE.BOSS) {
        this.gameOver = true;
        this.youWin = true;
      }

      return true;
    }

    return false;
  }

  whatAt(x, y) {
    return this.board[y][x];
  }

  static createMap(data) {
    return {
      type : 'CREATE_MAP',
      payload : data
    }
  }

  static movePlayer(x, y) {
    return {
      type : 'MOVE_PLAYER',
      payload : {x, y}
    }
  }

  static toggleVis() {
    return {
      type : 'TOGGLE_VIS',
      payload : null
    }
  }

  static reducer(state, action) {
    if (action.type === 'CREATE_MAP') {
      return Object.assign({}, action.payload);
    }

    if (action.type === 'TOGGLE_VIS') {
      const map = Map.INSTANCE.init;
      map.overcast = !map.overcast;
      return Object.assign({}, map);
    }

    if (action.type === 'MOVE_PLAYER') {
      const map = Map.INSTANCE.init;
      const x = map.player.x + action.payload.x;
      const y = map.player.y + action.payload.y;
      const wot = map.whatAt(x, y);

      switch(wot) {
        case Map.TILE.HEALTH:
          map.takeHEALTH(x, y);
          map.player.y = y;
          map.player.x = x;
          break;
        case Map.TILE.WEAPON:
          map.takeWEAPON(x, y);
          map.player.y = y;
          map.player.x = x;
          break;
        case Map.TILE.FLOOR:
          map.player.y = y;
          map.player.x = x;
          break;
        case Map.TILE.ENEMY:
          if (map.fight(x, y)) {
            map.player.y = y;
            map.player.x = x;
          }
          break;
        case Map.TILE.BOSS:
          if (map.fight(x, y)) {
            map.player.y = y;
            map.player.x = x;
          }
          break;
      }

      map.board = map.mapEntities();
      return Object.assign({}, map);
    }
  }
}

class MapRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { dim : null }
  }

  componentDidMount() {
    this.setState({
      dim : document.getElementById('level-board').getBoundingClientRect()
    });
  }

  centerIt(x, y) {
    if (this.state.dim === null) {
      return {
        w : 0,
        h : 0
      };
    }

    const w = this.state.dim.width / 2
              - this.props.game.player.x * this.props.game.tileSize;
    const h = this.state.dim.height / 2
              - this.props.game.player.y * this.props.game.tileSize;

    return {
      w : Math.round(w),
      h : Math.round(h)
    };
  }

  render() {
    let rows = this.props.game.board.map((row, rowIdx) => {
      let cols = row.map((col, colIdx) => {
        return <div className={Map.CLASS[col]}></div>
      });

      return (
        <div key={rowIdx} className='tiles-row'>{cols}</div>
      );
    });

    let pos = this.centerIt.call(this, this.props.game.player.x, this.props.game.player.y);
    let style = {
      left : pos.w + 'px',
      top : pos.h + 'px',
      width : this.props.game.width * this.props.game.tileSize + 'px',
      height : this.props.game.height * this.props.game.tileSize + 'px';
    };

    let cls = this.props.game.overcast ? 'level-board overcast' : 'level-board';

    return (
      <div id='level-board' className={cls}>
        <div className='level-map' style={style}>
          {rows}
        </div>
      </div>
    );
  }
}

class GameBoard extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', this.onKey.bind(this), true);
  }

  restartGame() {
    this.props.dispatch(Map.createMap(new Map().load(dngMap)));
  }

  onKey(e) {
    switch (e.code) {
      case 'KeyW':
        this.props.dispatch(Map.movePlayer(0, -1));
        break;
      case 'KeyS':
        this.props.dispatch(Map.movePlayer(0, 1));
        break;
      case 'KeyA':
        this.props.dispatch(Map.movePlayer(-1, 0));
        break;
      case 'KeyD':
        this.props.dispatch(Map.movePlayer(1, 0));
        break;
    }
    e.preventDefault();
  }

  render() {
    rreturn (
      <div className="game-container">
        <div className="game-board text-center">
          <h3>Roguelike Dungeon Crawler</h3>
          <div className="board-info">
            <span><i className="fa fa-star"></i>
              {this.props.game.player.level}</span>
            <span><i className="fa fa-paw"></i>
              {this.props.game.player.getDamage()}</span>
            <span><i className="fa fa-heart"></i>
             {this.props.game.player.health}
            </span>
            <span><i className="fa fa-gavel"></i>
              {this.props.game.player.weapon}
            </span>
            <span><i className="fa fa-gamepad"></i>
             awsd</span>
            <small className="label" onClick={this.props.dispatch.bind(this,Map.toggleVis())}>Full View</small>
          </div>
         { this.props.game.gameOver ?
            <div className="game-over text-center"
              onClick={this.restartGame.bind(this)}>
              {this.props.game.youWin ?
                <span>you win</span>
               :
                <span>game over</span>
              }
             </div>
          :
          <MapRenderer game={this.props.game} />
         }
        </div>
      </div>
    );
  }
}

let gameStore = Redux.createStore(Map.reducer);
let ConnectedBoard = ReactRedux.connect((state) => {
  return { game : state }
})
(GameBoard);
let Provider = ReactRedux.Provider;

gameStore.dispatch(Map.createMap(new Map().load(dngMap)));

React.render(<Provider store={gameStore}><ConnectedBoard /></Provider>, document.body);
