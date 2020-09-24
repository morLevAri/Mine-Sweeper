'use strict';
console.log('Minesweeper');

const MINE = '💣';
const FLAG = '🚩';
const LIFE = '💗';

const HAPPY = '😃';
const AFRAID = '😐';
const LOSS = '😵';
const WIN = '😎';

var gLife = 4
var gTimeInterval;
var gTotalSeconds = -1;
var gBoard;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function init() {
  // if (!gGame.isOn) return

  var elBtn = document.querySelector('.newGame');
  elBtn.innerText = HAPPY;
  gBoard = buildBoard();
  gGame.isOn = false;
  var gLife = 4;
  renderBoard(gBoard);
  clearInterval(gTimeInterval);
  gTotalSeconds = -1;
  setTime();
}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = [];
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  console.table(board);
  return board;
}

function renderBoard(board) {
  console.table(board);

  var elBoard = document.querySelector('.board');
  var strHTML = '';
  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < gLevel.SIZE; j++) {
      var currCell = board[i][j];
      var cellClass = getClassName({ i: i, j: j });
      strHTML += `\t<td class="`;

      if (!currCell.isShown) strHTML += 'hide';
      if (currCell.isShown) strHTML += 'show';
      var neighbors = setMinesNegsCount(i, j, board);
      if (currCell.isMine && currCell.isShown) {
        neighbors = MINE;
        strHTML += ' bombShow';
      }
      strHTML += ` cell ${cellClass}" onclick="cellClicked(event, this,${i},${j})" 
       oncontextmenu = "cellMarked(this,${i},${j})"> \n${neighbors} </td>`;
    }
    strHTML += '\n</tr>\n';
    console.log(strHTML);
    elBoard.innerHTML = strHTML;
  }
  console.log(board);
}

function setMinesNegsCount(cellI, cellJ, mat) {
  var neighborsSum = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= mat.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= mat[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (mat[i][j].isMine) neighborsSum++;
    }
  }
  //console.log(neighborsSum);
  return neighborsSum;
}

function cellClicked(ev, str, i, j) {
  if (!gGame.isOn) {
    gTimeInterval = setInterval(setTime, 1000);
    createBombs(gBoard, gLevel.MINES, i, j);
    gGame.isOn = true;
    renderBoard(gBoard);
  }

  var currCell = gBoard[i][j];
  var neighbors = setMinesNegsCount(i, j, gBoard);
  console.log(neighbors);

  if (currCell.isMine) {
    str.innerText = MINE;
    currCell.isShown = true;    
    renderBoard(gBoard); // לבדוק האם להציג את הפצצה מכאן>
    GameOver();
    
  } else {
    str.innerText = neighbors;
    gBoard[i][j].isShown = true;
    renderBoard(gBoard);
    var elBtn = document.querySelector('.newGame');
    elBtn.innerText = AFRAID;
    setTimeout(function () {
      elBtn.innerText = HAPPY;
    }, 150);
  }
  expandShown(gBoard, currCell, i, j);
}

function createBombs(board, amount, cellI, cellJ) {
  var bomb = {
    minesAroundCount: 0,
    isShown: false,
    isMine: true,
    isMarked: false,
  };
  for (let i = 0; i < amount; i++) {
    var num1 = getRandNum();
    var num2 = getRandNum();
    if (
      !board[num1][num2].isMine &&
      board[num1][num2] !== board[cellI][cellJ]
    ) {
      board[num1][num2] = bomb;
    } else {
      i--;
    }
  }
}

function changeLevel(size, mines) {
  gLevel.SIZE = size;
  gLevel.MINES = mines;
  init();
}

function GameOver() {
  
  gLife--;
  var elLives = document.querySelector('.lives');
  elLives.innerText = '';
  for (var i = 0; i < gLife; i++) {
  elLives.innerText += '💗 ' ;
  }
  
  var elBtn = document.querySelector('.newGame');
  elBtn.innerText = LOSS;

  if (gLife === 0){
  //חשיפת המוקשים
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
    }
  }
  alert('you lost')
  } 
}







function cellMarked(str, i, j) {
  // disableMenu();
  if (!gGame.isOn) {
    gTimeInterval = setInterval(setTime, 1000);
    gGame.isOn = true;
    renderBoard(gBoard);
  }
  var currCell = gBoard[i][j];
  str.innerText = FLAG;



}

function expandShown(board, elCell, cellI, cellJ) {
  var neighbors = setMinesNegsCount(cellI, cellJ, board);
  if (neighbors === 0) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i >= board.length) continue;
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (j < 0 || j >= board[i].length) continue;
        if (i === cellI && j === cellJ) continue;
        board[i][j].isShown = true;
      }
    }
  }
}
