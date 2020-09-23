'use strict';
console.log('Minesweeper');

var mine = '💣';

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
  gBoard = buildBoard();
  renderBoard(gBoard);
}

function buildBoard() {
  var board = [];
  //  var currBoard = JSON.parse(JSON.stringify(gBoard));
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
  createBombs(board, gLevel.MINES);
  return board;
}

renderBoard(gBoard);

function renderBoard(board) {
  console.table(board);
  var elBoard = document.querySelector('.board');
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';
    for (var j = 0; j < board[0].length; j++) {
      var currCell = board[i][j];
      var cellClass = getClassName({ i: i, j: j });
      strHTML += `\t<td class="`;
      if (!currCell.isShown) strHTML += 'hide';
      strHTML += ` cell ${cellClass}" onclick="cellClicked(event, this,${i},${j})"  >\n`;
      strHTML += '\t</td>\n';
    }
    strHTML += '</tr>\n';
    console.log(strHTML);
    elBoard.innerHTML = strHTML;
  }
  console.log(board);
}
//   board[2][1].gBoard.isShown = true;

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
  //   console.log(neighborsSum);
  return neighborsSum;
}

function cellClicked(ev, theString, i, j) {
  var currCell = gBoard[i][j];
  var neighbors = setMinesNegsCount(i, j, gBoard);
  console.log(neighbors);
  theString.innerText = currCell.isMine ? mine : neighbors;
  // currCell[i][j].gBoard.isShown = true;

  setMinesNegsCount(i, j, board);
}

function cellMarked(elCell) {}

function checkGameOver() {}

function expandShown(board, elCell, i, j) {}

function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

function createBombs(board, amount) {
  var bomb = {
    minesAroundCount: 0,
    isShown: false,
    isMine: true,
    isMarked: false,
  };
  for (let i = 0; i < amount; i++) {
    var num1 = getRandNum();
    var num2 = getRandNum();
    if (!board[num1][num2].isMine) {
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
