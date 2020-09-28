'use strict';

function getRandNum() {
  var rand = Math.floor(Math.random() * gLevel.SIZE);
  return rand;
}

function getClassName(location) {
  var cellClass = 'cell-' + location.i + '-' + location.j;
  return cellClass;
}

function setTime() {
  var minutesLabel = document.getElementById('minutes');
  var secondsLabel = document.getElementById('seconds');
  gTotalSeconds++;
  secondsLabel.innerHTML = pad(gTotalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(gTotalSeconds / 60));
}

function pad(val) {
  var valString = val + '';
  if (valString.length < 2) {
    return '0' + valString;
  } else {
    return valString;
  }
}

window.addEventListener(
  'contextmenu',
  function (e) {
    e.preventDefault();
  },
  false
);

function renderCell(i, j, value) {
  var elCell = document.querySelector('.cell-' + i + '-' + j);
  if (value === 0) value = '';
  elCell.innerText = `${value}`;
  if (value !== MINE) gBoard[i][j].isShown = true;
  elCell.classList.add('show');
  if (value === MINE) elCell.classList.add('bombShow');
}
