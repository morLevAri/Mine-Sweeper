'use strict';
console.log('Minesweeper');

const MINE = '💣';
const FLAG = '🚩';
const LIFE = '💗';

const HAPPY = '😃';
const AFRAID = '😐';
const LOSS = '😵';
const WIN = '😎';

var gLife = 3;
var gFlagCounter = 0;
var gTimeInterval;
var gTitleInterval;
var gHappyInterval;
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
  // מאתחלת את המשחק אחרי כל סיום משחק
  document.getElementById('center').style.pointerEvents = 'all';
  var elBtn = document.querySelector('.newGame');
  elBtn.innerText = HAPPY;
  gBoard = buildBoard();
  gGame.isOn = false;
  gLife = 3;
  var elLives = document.querySelector('.lives');
  elLives.innerText = '💗 💗 💗';
  renderBoard(gBoard);
  clearInterval(gTimeInterval);
  gTotalSeconds = -1;
  setTime();
  var elTitle = document.querySelector('.liveMsg');
  elTitle.innerHTML = 'You lost a life, try again';
  elTitle.style.fontSize = '25px';
  elTitle.style.visibility = 'hidden';
  var elLives = document.querySelector('.lives');
  elLives.innerText = '💗 💗 💗';
  elLives.style.visibility = 'visible';

  gFlagCounter = 0;
}

function buildBoard() {
  // בונה את הלוח במודל
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
  // console.table(board);
  return board;
}

function renderBoard(board) {
  // מרנדרת את הלוח בדום
  // console.table(board);
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
      if (neighbors === 0) neighbors = ' ';
      strHTML += ` cell ${cellClass}" onclick="cellClicked(${i},${j})" 
      oncontextmenu = "cellMarked(this, ${i},${j})"> \n${neighbors} </td>`;
    }
    strHTML += '\n</tr>\n';
    // console.log(strHTML);
    elBoard.innerHTML = strHTML;
  }
  // console.log(board);
}

function setMinesNegsCount(cellI, cellJ, mat) {
  // בודקת האם השכנים הם פצצות
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

function cellClicked(i, j) {
  // מה קורה בכל לחיצה על תא
  if (!gGame.isOn) {
    gTimeInterval = setInterval(setTime, 1000);
    createBombs(gBoard, gLevel.MINES, i, j);
    gGame.isOn = true;
  }

  var currCell = gBoard[i][j];
  var neighbors = setMinesNegsCount(i, j, gBoard);
  // console.log(neighbors);

  if (currCell.isMine) {
    renderCell(i, j, MINE);
    GameLose();
  } else {
    if (neighbors === 0) expandShown(gBoard, i, j);
    renderCell(i, j, neighbors);
    var elBtn = document.querySelector('.newGame');
    elBtn.innerText = AFRAID;
    gHappyInterval = setTimeout(function () {
      elBtn.innerText = HAPPY;
    }, 150);
  }
  checkVictory();
}

function createBombs(board, amount, cellI, cellJ) {
  // מייצרת פצצות, רק אחרי הלחיצה הראשונה
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
  // משנה את גודל הטבלה
  gLevel.SIZE = size;
  gLevel.MINES = mines;
  init();
}

function GameLose() {
  //מורידה חיים בתצוגה
  gLife--;
  var elLives = document.querySelector('.lives');
  elLives.innerText = '';
  for (var i = 0; i < gLife; i++) {
    elLives.innerText += '💗 ';
  }

  var elTitle = document.querySelector('.liveMsg');
  elTitle.style.visibility = 'visible';
  gTitleInterval = setTimeout(function () {
    elTitle.style.visibility = 'hidden';
  }, 800);

  if (gLife === 0) {
    // שינוי הודעה
    elTitle.innerHTML = 'YOU LOST!';
    elTitle.style.visibility = 'visible';
    clearInterval(titleInterval);

    // חשיפת המוקשים
    var elBtn = document.querySelector('.newGame');
    elBtn.innerText = LOSS;
    for (var i = 0; i < gLevel.SIZE; i++) {
      for (var j = 0; j < gLevel.SIZE; j++) {
        if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
        renderBoard(gBoard);
      }
    }
    // הסתרה של הלבבות אחרי הפסד סופי
    var elLives = document.querySelector('.lives');
    elLives.innerText = '💗 💗 💗';
    elLives.style.visibility = 'hidden';
    clearInterval(gTimeInterval);

    // מפסיק את האפשרות ללחוץ על הטבלה 
    document.getElementById('center').style.pointerEvents = 'none';
  }
}

function cellMarked(str, i, j) {
  // האם זה הקליק הראשון במשחק
  if (!gGame.isOn) {
    gTimeInterval = setInterval(setTime, 1000);
    gGame.isOn = true;
  }

  // האם לחצתי על דגל קיים
  if (gBoard[i][j].isMarked) {
    gBoard[i][j].isMarked = false;
    gFlagCounter--;
    gBoard[i][j].isShown = false;
    str.innerText = '';
    if (gBoard[i][j].isMine) {
      gBoard[i][j].isMarked = true;
      gFlagCounter += 2;
      str.innerText = FLAG;
    }
  } else {
    // האם סימנתי דגל במקום בלי דגל
    if (!gBoard[i][j].isShown) {
      // האם סימנתי דגל במקום שהוא לא מוצג (מספר קיים)
      str.innerText = FLAG;
      gBoard[i][j].isMarked = true;
      gFlagCounter++;
    }
  }
  var elFlags = document.getElementById('flags');
  elFlags.innerHTML = ' ' + gFlagCounter;

  checkVictory();
}

function checkVictory() {
  // בודקת ניצחון
  var shownCounter = 0;
  var shownBombCounter = 0;
  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      if (gBoard[i][j].isShown) shownCounter++;
      if (gBoard[i][j].isMine) {
        if (gBoard[i][j].isShown) {
          shownBombCounter++;
        }
      }
    }
  }
  if (
    shownCounter - shownBombCounter ===
    gLevel.SIZE ** 2 - gLevel.MINES
  ) {
    gameWin();
  }
}

function gameWin() {
  // מה קורה במצב של נצחון
  var elTitle = document.querySelector('.liveMsg');
  var elBtn = document.querySelector('.newGame');
  clearInterval(gTimeInterval);
  clearInterval(gTitleInterval);
  clearInterval(gHappyInterval);
  document.getElementById('center').style.pointerEvents = 'none';
  elTitle.innerHTML = 'YOU WON!';
  elTitle.style.visibility = 'visible';
  elBtn.innerText = WIN;
  //  renderBoard(gBoard);
}

function expandShown(board, cellI, cellJ) {
  // לולאת שכנים, מרחיבה את התאים מסביב במידה ואין פצצות מסביב
  var neighbors = setMinesNegsCount(cellI, cellJ, board);
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isMarked) continue;
      board[i][j].isShown = true;
      neighbors = setMinesNegsCount(i, j, board);
      renderCell(i, j, neighbors);
      // if (neighbors === 0) cellClicked(i,j)
    }
  }
}
