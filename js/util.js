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




// function disableMenu() {
//   document.addEventListener("contextmenu", function(a){
//       a.preventDefault();
//   })
// }