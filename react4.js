// Code for Game Of Life
/*

let board = [],
    width = 70,
    height = 50,
    cells = width * height,
    running = 0,
    delay = 50,
    generation = 0,
    ReactCell;

$(document).ready(() => {
  $('.gen').text('0');
  $('.population').text('0');
  clearBoard();
  initialSet();
  createBoard();
  activateBoard();
  running = 1;
  runIt();
});

function clearBoard() {
  board = [];
  for (let i = 0; i < (cells); i++) {
    board[i] = { id: i, status: 'cell dead' };
  }
  generation = 0;
  $('.gen').text('0');
}

function createBoard() {
  $('#container').empty();

  class ReactCell extends React.Component {
    getInitialState() {
      // sets the initial state to the contents of the board variable
      return {cellBoard: board};
    }

    componentDidMount() {
      // componentDidMount is called when the component is rendered.
      // this can be uncomented so that repeated drawBoard() calls are not required.
      // this.timer = setInterval(this.updateCells, delay);
    }

    // componentWillUnmount is called if the component is closed
    componentWillUnmount() {
      clearInterval(this.timer);
    }

    updateCells() {
      this.setState({cellBoard: this.props.board});
    }

    render() {
      return (
        <div>
          {this.props.board.map((cell, i) => {
          return(<div className={cell.status} key={i} id={i}></div>)
          })
          }
        </div>
      );
    }
  }

  drawBoard();
}

function runGeneration() {
  let newBoard = [],
      cellStatus = '';

  for (let i = 0; i < (cells); i++) {
    newBoard.push({
      id: i,
      status: 'cell dead'
    });

    let check = cellCheck(i);

    // keeps the living cell alive if it has 2 or 3 living neighbors
    if ((board[i].status == 'cell alive' || board[i].status == 'cell alive old') && (check == 3 || check == 2)) {
      newBoard[i] = {id: i, status: 'cell alive old'};
    }

    // brings the dead cell to life if there are exactly 3 neighbors
    if (board[i].status == 'cell dead' && check == 3) {
      newBoard[i] = {id: i, status: 'cell alive'};
    }
  }

  // check to see if all of the cells are dead. Stops the run.
  for (let i = 0; i < cells; i++) {
    if (board[i].status == 'cell alive' || board[i].status == 'cell alive old') {
      break;
    }
    if (i == cells - 1) {
      $('.clear').addClass('activeButton');
      setTimeout(() => {
        $('.clear').removeClass('activeButton');
      }, 400);
      running = 0;
      clearBoard();
      drawBoard();
    }
  }

  return newBoard;
}

function drawBoard(passedBoard) {
  ReactDOM.render(<ReactCell board={board} generation={generation}/>,
  document.getElementById('container'));
}

function activateBoard() {
  $('.cell').click(() => {
    let cellNum = $(this).attr('id');
    if (board[cellNum].status == 'cell alive' || board[cellNum].status == 'cell alive old') {
      board[cellNum].status = 'cell dead';
    } else {
      board[cellNum].status = 'cell alive';
    }

    drawBoard();
    console.log(cellNum + ' ' + board[cellNum].status);
  })

  $('.clear').click(() => {
    $('.stop').removeClass('activeButton');
    $('.clear').addClass('activeButton');
    setTimeout(() => {
      $('.clear').removeClass('activeButton');
    }, 700);
    running = 0;
    generation = 0;
    clearBoard();
    drawBoard();
    $('.gen').text('0');
    $('.population').text('0');
  });

  $('.run').click(() => {
    $('.stop').removeClass('activeButton');
    $('.reset').removeClass('activeButton');
    $('.run').addClass('activeButton');
    setTimeout(() => {
      $('.run').removeClass('activeButton');
    }, 700);
    running = 1;
    runIt();
  });

  $('.stop').click(() => {
    $('.stop').addClass('activeButton');
    running = 0;
  });

  $('.50').click(() => {
    running = 0;
    width = 50;
    height = 50;
    cells = width * height;
    clearBoard();
    createBoard();
    $('.70').removeClass('activeButton');
    $('.100').removeClass('activeButton');
    $('.50').addClass('activeButton');
    $('cell:nth-child(70n + 1)').css('clear', 'none');
    $('cell:nth-child(100n + 1)').css('clear', 'none');
    $('cell:nth-child(50n + 1)').css('clear', 'both');
    $('cell').css({"width":"12px", "height":"12px"});
    $('#container').css({"width": "650px", "height": "390px"});
    removeListeners();
    activateBoard();
    console.log("w: " + width + " h: " + height);
  });

  $('.70').click(() => {
    running = 0;
    width = 70;
    height = 50;
    cells = width * height;
    clearBoard();
    createBoard(board);
    $('.50').removeClass('activeButton');
    $('.100').removeClass('activeButton');
    $('.70').addClass('activeButton');
    $('.cell:nth-child(100n + 1)').css('clear', 'none');
    $('.cell:nth-child(50n + 1)').css('clear', 'none');
    $('.cell:nth-child(70n + 1)').css('clear', 'both');
    $('.cell').css({"width":"11px", "height":"11px"});
    $('#container').css({"width":"840px", "height":"600px"});
    removeListeners();
    activateBoard();
    console.log("w: " + width + " h: " + height);
  });

  $('.100').click(() => {
    running = 0;
    width = 100;
    height = 80;
    cells = width * height;
    clearBoard();
    createBoard(board);
    $('.50').removeClass('activeButton');
    $('.70').removeClass('activeButton');
    $('.100').addClass('activeButton');
    $('.cell:nth-child(50n + 1)').css("clear", "none");
		$('.cell:nth-child(70n + 1)').css("clear", "none");
		$('.cell:nth-child(100n + 1)').css("clear", "both");
		$('.cell').css({"width":"8px","height":"8px"})
		$('#container').css({"width": "900", "height": "720"});
		removeListeners();
		activateBoard();
		console.log("w: " + width + " h: " + height);
  });

  $('.slow').click(() => {
    delay = 200;
    $('.medium').removeClass('activeButton');
    $('.fast').removeClass('activeButton');
    $('.slow').addClass('activeButton');
  });

  $('.medium').click(() => {
    delay = 110;
    $('.slow').removeClass('activeButton');
    $('.fast').removeClass('activeButton');
    $('.medium').addClass('activeButton');
  });

  $('.fast').click(() => {
    delay = 50;
    $('.slow').removeClass('activeButton');
    $('.medium').removeClass('activeButton');
    $('.fast').addClass('activeButton');
  });
}

function removeListeners() {
  $('.50').off();
  $('.70').off();
  $('.100').off();
  $('.run').off();
  $('.reset').off();
  $('.stop').off();
  $('.cell').off();
  $('.slow').off();
  $('.medium').off();
  $('.fast').off();
}

function runIt() {
  if (running = 1) {
    setTimeout(() => {
      generation++;
      board = runGeneration();
      $('.gen').text(generation);
      setTimeout(() => {
        drawBoard();
        runIt();
      }, delay);
    }, 0);
  }
}

function cellCheck(i) {
  let count = 0;
  let borderCell = 0;
  // checks wrap-around for the top row going upward to the bottom
  if (i >= 0 && i <= (width - 1)) {
    borderCell = 1;
    let dif = width - i;
    // console
  }
}

*/


// CODE for GAME OF LIFE 2

console.clear();

let gameSize = [50, 70];

class Game extends React.Component {
  getInitialState() {
    let grid = [];
    for (let i = 0; i < gameSize[0]; i++) {
      let row = [];
      for (let j = 0; j < gameSize[1]; j++) {
        row.push(Math.random() < .5);
        grid.push(row);
      }
    }

    return {
      game: grid,
      time: 100,
      gen: 0
    };
  }

  cellLives(a, b) {
    let count = 0;
    let own_c = this.state.game[a][b];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if ((a + i) >= 0 && (a + i) < gameSize[0] && (b + j) >= 0 && (b + j) < gameSize[1] && !(i == 0 && j == 0)) {
          if (this.state.game[a + i][b + j]) {
            count++;
          }
        }
      }
    }
    return count === 3 || (own_c && count === 2);
  }

  nextGen() {
    let ret = [];
    for (let i = 0; i < gameSize[0]; i++) {
      ret.push([]);
      for (let j = 0; j < gameSize[1]; j++) {
        ret[i].push(this.cellLives(i, j));
      }
    }

    return ret;
  }

  setTime(v) {
    let t = this;
    return () => t.setState({time: v});
  }

  clearGame() {
    var grid = [];
    for (let i = 0; i < gameSize[0]; i++) {
      let row = [];
      for (let j = 0; j < gameSize[1]; j++) {
        row.push(false);
      }
      grid.push(row);
    }

    this.setState({game: grid, gen: 0});
  }

  setInterval() {
    if (this.interval)  {
      clearInterval();
    }
    let t = this;
    let timeout = () => {
      t.interval = setTimeout(timeout, t.state.time);
      t.setState({game: t.nextGen(), gen: t.state.gen + 1});
    };

    this.interval = setTimeout(timeout, this.state.time);
  }

  clearInterval() {
    clearTimeout(this.interval);
    console.log('cleared');
    this.interval = false;
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.setInterval();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
    this.clearInterval();
  }

  toggleCell(i, j) {
    let grid = this;
    return () => {
      let temp = [];
      for (let k = 0; k < gameSize[0]; k++) {
        temp.push(grid.state.game[k].slice(0));
      }
      temp[i][j] = !temp[i][j];
      grid.setState({game: temp});
    };
  }

  render() {
    return (
      <div className='gameContainer'>
        <h1>Game of Life</h1>
        <h4>Generation {this.state.gen}</h4>
        <div className='game'>
          {
            this.state.game.map( (row, i) =>
              <div className='linha'>
                {
                  row.map( (cell, j) => <div onMouseDown={this.toggleCell(i, j)} className={'cell ' + (this.state.game[i][j] ? 'old' : '')}></div> )
                }
              </div>
          )}
        </div>

        <div className='buttons'>
          <div className='btn-group'>
            <button className='btn btn-success' onClick={this.setTime(500)}>Slow</button>
            <button className='btn btn-success' onClick={this.setTime(200)}>Mild</button>
            <button className='btn btn-success' onClick={this.setTime(100)}>Fast</button>
          </div>

          <div className='btn-group'>
            <button className='btn btn-success' onClick={this.setInterval}>Start</button>
            <button className='btn btn-success' onClick={this.clearInterval}>Stop</button>
            <button className='btn btn-success' onClick={this.clearGame}>Clear</button>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game/>, document.querySelector('.container'));
