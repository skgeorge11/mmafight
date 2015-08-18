$(document).ready(console.log("JQuery ready"));
// CREATE A REFERENCE TO FIREBASE
var fireRef = new Firebase("https://mmafighter.firebaseio.com/");

// function maxWindow() {
//     console.log("ran maxWindow");
//     // Supports most browsers and their versions.
//     var element = document.body;
//     var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
//     if (requestMethod) { // Native full screen.
//         requestMethod.call(element);
//     } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
//         var wscript = new ActiveXObject("WScript.Shell");
//         if (wscript !== null) {
//             wscript.SendKeys("{F11}");
//         }
//     }
// }
function createFighter(){
  var locationId = $('#childNameInput').val();
  var skillId = $('#skillInput').val();
  var tempAverage = parseInt(skillId);
  console.log(" temp average is "+ tempAverage);
  var skillArray =[];
  for (var i = 0; i < 3; i++) {
    var tempSkill = nearAverageRandom(tempAverage, 0 ,100);
    tempAverage = (skillId*2) - tempSkill;
    skillArray[i] = tempSkill;
  };
  fireRef.child(locationId).push ({"average skill" : skillId, "quickness": skillArray[0] , "power": skillArray[1],"IQ":skillArray[2]});
  console.log("created fighter");
}

function randNum(min,max){
  adjMax = max-min;
  var tempNum = Math.floor((Math.random() * adjMax) + min);
  return tempNum;
}

function nearAverageRandom(startNum, min, max){
  console.log ("nearAverageRandom run");
  for (var i = 0; i < 25; i++) {
    console.log ("the small number is " +smallNum);
    var smallNum = randNum(-2,2);
    console.log ("the start number is " +startNum);
    startNum =  1 + startNum;
    console.log ("the start number is " +startNum);
    startNum =  smallNum + startNum;

      if (startNum >max){console.log("max number"); startNum = max;}
      if (startNum <min){console.log("min number");startNum = min;}
  }
  return startNum;
}

function addTextDiv(location, text) {
    $('<p>'+text+'</p>').prependTo(location);
    // $(location).scrollTop( $( location).prop( "scrollHeight" ) );
    // $(location).perfectScrollbar('update');
  }

//CHECK FOR USER DUPLICATION/ SIGN IN
function go() {
  userId = $('#userNameInput');
  userPassword = $('#passwordInput');
  tryCreateUser(userId.val(), userPassword.val());
}
// Tries to set /users/<userId> to the specified data
function tryCreateUser(userId, userData) {
  fireRef.child(userId).once('value',
    function (snap) {
      var snapVal = snap.val();
      var snapPassVal = snap.child("password").val();
      if (snapPassVal != null) {
        console.log("user already exists.")
        if(snapPassVal === userData){
          console.log("password matches");
          localStorage.localUserId = userId;
          localStorage.localUserPassword = userData;
          window.location.assign("fightpage.html");
        } else {
          alert("password doesn't match");
        }
      } else {
        console.log("new user created.")
        fireRef.child(userId).set({password : userData});
        window.location.assign("fightpage.html");
      }
  });
}