$(document).ready(console.log("JQuery ready"));
// CREATE A REFERENCE TO FIREBASE
var fireRef = new Firebase("https://mmafighter.firebaseio.com/");

function loadRookie(){
  console.log ("ran load rookie");
  var tempAttribute =[];
  //CREATE PROMISE VARIABLE
  var rookieArray = rookieArrayPromise();
  //CREATE DEFFERED OBJECT
  function rookieArrayPromise(){

    var rookieDeferred = $.Deferred();
    fireRef.child("rookie").once('value', function (snap) {
      rookieDeferred.resolve(snap);
    });
    return rookieDeferred.promise();
  }
  //FUNCTION ON COMPLETION OF PROMISED DATA.
  rookieArray.done(function(fighterArray){
    fighterArray.forEach(function(fighterChild){
      tempAttribute =[];
      fighterChild.forEach(function(attributeChild){
        tempAttribute.push(attributeChild.val());
      });
      //APPLY DATA TO PLAYER PAGE HERE
      var tempMoney = tempAttribute[1] * 100
     $('#rookieList > tbody:last-child').append('<tr><td>'+tempAttribute[9]+'</td><td>'+tempAttribute[0]+'</td><td>'+tempAttribute[0]+'</td><td>'+tempAttribute[6]+'</td><td>'+tempAttribute[17]+'</td><td>'+tempAttribute[12]+'</td><td>'+tempAttribute[10]+'</td><td>'+tempAttribute[13]+'</td><td>'+tempAttribute[14]+'</td><td>'+tempAttribute[3]+'</td><td>'+tempAttribute[4]+'</td><td>'+tempAttribute[7]+'</td><td>'+tempAttribute[8]+'</td><td>'+tempAttribute[5]+'</td><td>'+tempAttribute[11]+'</td><td>'+tempAttribute[16]+'</td><td>'+tempAttribute[2]+'</td><td>'+tempAttribute[15]+'</td>');
    });

  });

}

function createFighter(){
  var locationId = $('#childNameInput').val();
  var skillId = $('#skillInput').val();
  var nameId = $('#fighterNameInput').val();
  var tempAverage = parseInt(skillId);
  var skillAverage = parseInt(skillId);
  var goalAverage = parseInt(skillId);
  var tempNum = 0;
  var tempIndex = 0;
  var skillArray =[];
  var totalAttribute = 12;
  for (var i = 0; i < totalAttribute; i++) {
    var tempMin = 10;
    var tempMax = 100;
    var tempSkill = nearAverageRandom(skillAverage, tempMin ,tempMax);
    skillArray[i] = tempSkill;
    tempNum = 0;
    $.each(skillArray, function( index, value ) {
      tempNum += value;
      tempIndex = index + 1;
    });
    tempAverage = Math.floor(tempNum / (tempIndex));
    var remainAttribute = totalAttribute - i -1;
    skillAverage = Math.floor(((goalAverage * totalAttribute ) - tempNum) / remainAttribute);
    //console.log("skillAverage is "+skillAverage + " tempNum " +tempNum+" remainAttribute "+ remainAttribute);
  };
  var tempHeight = nearAverageRandom(72,60,84);
  var tempReach = (tempHeight/2) + randNum(-4,4);
  var tempWeight = 110+randNum(0,210);
  var tempAge = 18+ randNum(0,9);
  fireRef.child(locationId).push ({"name": nameId,"age":tempAge, "average skill" : tempAverage, "durability": skillArray[0] , "gAttack": skillArray[1],"gDefence":skillArray[2],"heart":skillArray[3],"initiative":skillArray[4],"intelgence":skillArray[5],"prestige":skillArray[6],"quickness":skillArray[7],"sAttack":skillArray[8],"sDefence":skillArray[9],"stamina":skillArray[10],"strength":skillArray[11],"height":tempHeight,"weight":tempWeight,"reach":tempReach});
  alert("created fighter");
}

function randNum(min,max){
  adjMax = (max-min) +1;
  var tempNum = Math.floor((Math.random() * adjMax) + min);
  return tempNum;
}

function nearAverageRandom(startNum, min, max){
  // console.log ("nearAverageRandom run");
  for (var i = 0; i < 10; i++) {
    // console.log ("the small number is " +smallNum);
    var smallNum = randNum(-5,5);
    // console.log ("the start number is " +startNum);
    startNum +=  smallNum;
    if (startNum >max){startNum = max;}
    if (startNum <min){startNum = min;}
  }
  return startNum;
}

function loadUserFighter (){
  console.log ("ran load user fighters");
  var currentUser = localStorage.localUserId;
  var currentPass = localStorage.localUserPassword;
  var fighterName = [];
  var fighterIq =[];
  var tempAttribute = [];
  //CREATE PROMISE VARIABLE
  var userArray = userArrayPromise();
  //CREATE DEFFERED OBJECT
  function userArrayPromise(){
    var userDeferred = $.Deferred();
    fireRef.child(currentUser).once('value', function (snap) {
      userDeferred.resolve(snap);
    });
    return userDeferred.promise();
  }
  //FUNCTION ON COMPLETION OF PROMISED DATA.
  userArray.done(function(fighterArray){
    fighterArray.forEach(function(fighterChild){
      if (fighterChild.key()!="password"){
          tempAttribute =[];
          //PUSH EACH ATTRIBUTE VALUE INTO THE TEMP ATTRIBUTE ARRAY
          fighterChild.forEach(function(attributeChild){
            tempAttribute.push(attributeChild.val());
          });
          //APPLY DATA TO PLAYER PAGE HERE
          $('#rookieList > tbody:last-child').append('<tr><td>'+tempAttribute[9]+'</td><td>'+tempAttribute[0]+'</td><td>'+tempAttribute[6]+'</td><td>'+tempAttribute[17]+'</td><td>'+tempAttribute[12]+'</td><td>'+tempAttribute[10]+'</td><td>'+tempAttribute[13]+'</td><td>'+tempAttribute[14]+'</td><td>'+tempAttribute[3]+'</td><td>'+tempAttribute[4]+'</td><td>'+tempAttribute[7]+'</td><td>'+tempAttribute[8]+'</td><td>'+tempAttribute[5]+'</td><td>'+tempAttribute[11]+'</td><td>'+tempAttribute[16]+'</td><td>'+tempAttribute[2]+'</td><td>'+tempAttribute[15]+'</td>');
      }
    });
  });
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
          window.location.assign("player.html");
        } else {
          alert("password doesn't match");
        }
      } else {
        console.log("new user created.")
        fireRef.child(userId).set({password : userData});
        window.location.assign("player.html");
      }
  });
}

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