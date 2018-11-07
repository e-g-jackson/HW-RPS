var mainDiv = document.getElementById('mainDiv');
// remover of "" --> .replace(/['"]+/g, '')
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAi9FA4lGeKeKcjtxqBziNNUU22GSJM7nk",
    authDomain: "hw-rps-2d0d7.firebaseapp.com",
    databaseURL: "https://hw-rps-2d0d7.firebaseio.com",
    projectId: "hw-rps-2d0d7",
    storageBucket: "hw-rps-2d0d7.appspot.com",
    messagingSenderId: "587126988617"
};

firebase.initializeApp(config);

//declaring variables
var database = firebase.database();
var name;
var userId;
var info;
var numUsers;
var numSubs;

var userData = database.ref('/ids/' + window.localStorage.userId)
var subHeaderCreator = function(){
    var subHeader = document.createElement('span');
    var pName = '<span id = \'pName\'></span>';
    var ws = '<span id = \'ws\'></span>';
    var ls = '<span id = \'ls\'></span>';
        $(subHeader).html('Name: ' + pName + '   Wins: ' + ws + '   Losses: ' + ls );
        $(subHeader).attr('id', 'subHeader');
        $(subHeader).appendTo('body');
        subHeaderFxn();
}
var subHeaderFxn = function(){
    userData.on('value', function(snap){
    var name = snap.child('screenName').val();
    var wins = snap.child('wins').val();
    var losses = snap.child('losses').val();
    $('#pName').text(name)
    $('#ws').text(wins);
    $('#ls').text(losses);
    })
};
var gameSubmissions = database.ref('/game');
    gameSubmissions.on('value', function(snap){
        numSubs = snap.numChildren();
    })

//tracking viewers
var connectionsRef = database.ref('/connections');
var connectedRef = database.ref('.info/connected');
connectedRef.on('value', function(snap){
    if (snap.val()){
        var con = connectionsRef.push(true);
        con.onDisconnect().remove()
    }
});

connectionsRef.on('value', function(snap){
    $('#connected-viewers').text(snap.numChildren());
    numUsers = snap.numChildren();
});

//first page
var startScreen = function(){
    var startButton = document.createElement('button');
    $(startButton).text('Start!');
    $(startButton).attr('id', 'startButton')
    $(startButton).attr('class', 'btn btn-lg btn-outline-light')
    $(mainDiv).empty();
    $(mainDiv).html('<h2>Multiplayer mode!</h2><br>Once two players are ready, the Rock, Paper, Scissors game will begin!<br><br><p>Click the start button to continue!</p>');
    $(mainDiv).append(startButton);
    $(startButton).on('click', function(){
        subHeaderFxn();
        setupGame();
    })
};

var setupGame = function(){
        //check localStorage for previously saved 'userId'
        if (typeof (window.localStorage.userId) === 'null' || typeof (window.localStorage.userId) === 'undefined'){
            userIdGenerator();
            var inputName = document.createElement('input');
            var inputButton = document.createElement('button');
            var lineBreak = '<br>';
                $(inputName).attr('id', 'nameBox');
                $(inputName).attr('placeholder', 'What would you like to be called?');
                $(inputButton).attr('id', 'inputButton');
                $(inputButton).attr('class', 'btn btn-lg btn-outline-light');
                $(inputButton).text('Find Opponent!');
                $(mainDiv).empty();
                $(mainDiv).html('Find an Opponent!')
                $(lineBreak).appendTo(mainDiv);
                $(lineBreak).appendTo(mainDiv);
                $(inputName).appendTo(mainDiv);
                $(lineBreak).appendTo(mainDiv);
                $(lineBreak).appendTo(mainDiv);
                $(inputButton).appendTo(mainDiv);
           
            $(inputButton).on('click', function(){
                name = $(inputName).val().trim();
                window.localStorage.setItem('name', name);
                info = {
                    screenName: name,
                    userId: userId.replace(/['"]+/g, ''),
                    wins:0,
                    losses:0,
                }
                    
                database.ref('/ids').child(userId.replace(/['"]+/g, '')).set({
                    screenName: info.screenName,
                    userId: userId.replace(/['"]+/g, ''),
                    wins: info.wins,
                    losses: info.losses,
                });

                initialize();
            });
        } 
        else{
            var identity = window.localStorage.userId;
            var welcomeDiv = document.createElement('div');
            var goButton = document.createElement('button');
                $(goButton).attr('id', 'goButton');
                $(goButton).attr('class', 'btn btn-lg btn-outline-light');
                $(goButton).text('Go!')
            nameRecall = window.localStorage.name
            info = database.ref('/ids').child(identity);
                $(mainDiv).empty();
                $(welcomeDiv).html('<h1> Welcome back ' + nameRecall + '!');
                $(welcomeDiv).appendTo(mainDiv)
                $(goButton).appendTo(welcomeDiv);
            $(goButton).on('click', function(){
                initialize();
            })
        }
};

//Generates unique 10 digit number for user for firebase reference
function userIdGenerator(){
    var pt1 = Math.floor((Math.random() * 9 ) + 1);
    var pt2 = Math.floor((Math.random() * 9 ) + 1);
    var pt3 = Math.floor((Math.random() * 9 ) + 1);
    var pt4 = Math.floor((Math.random() * 9 ) + 1);
    var pt5 = Math.floor((Math.random() * 9 ) + 1);
    var pt6 = Math.floor((Math.random() * 9 ) + 1);
    var pt7 = Math.floor((Math.random() * 9 ) + 1);
    var pt8 = Math.floor((Math.random() * 9 ) + 1);
    var pt9 = Math.floor((Math.random() * 9 ) + 1);
    var pt0 = Math.floor((Math.random() * 9 ) + 1);
    userId = "'" + pt1 + pt2 + pt3 + pt4 + pt5 + pt6 + pt7 + pt8 + pt9 + pt0 + "'";
    window.localStorage.setItem('userId', userId.replace(/['"]+/g, ''));
};

var initialize = function(){
    $(mainDiv).html('');
    $(connectionsRef);
    if(numUsers == 2){
            
        var infoDiv = document.createElement('div');
            $(infoDiv).attr('id', 'infoDiv');
        var buttonDiv = document.createElement('div');
            $(buttonDiv).attr('id', 'buttonDiv');
        var rockButton = document.createElement('button');
            $(rockButton).html('<i class="far fa-hand-rock fa-3x"></i><h3>Rock</h3>');
            $(rockButton).attr('id', 'rock');
            $(rockButton).attr('class', 'btn btn-lg btn-outline-light');
            $(rockButton).appendTo(buttonDiv);
        var paperButton = document.createElement('button');
            $(paperButton).html('<i class="far fa-hand-paper fa-3x"></i><h3>Paper</h3>');
            $(paperButton).attr('id', 'paper');
            $(paperButton).attr('class', 'btn btn-lg btn-outline-light');
            $(paperButton).appendTo(buttonDiv);
        var scissorsButton = document.createElement('button');
            $(scissorsButton).html('<i class="far fa-hand-scissors fa-3x"></i><h3>Scissors</h3>');
            $(scissorsButton).attr('id', 'scissors');
            $(scissorsButton).attr('class', 'btn btn-lg btn-outline-light');
            $(scissorsButton).appendTo(buttonDiv);
            $(infoDiv).html('<h2>Pick Rock, Paper, or Scissors!</h2> <br><br><br>')
            $(mainDiv).append(infoDiv);
            $(mainDiv).append(buttonDiv);
            
        //submitting R,P, or S
        $('body').on('click', 'button', function(){
            var buttonId = $(this).attr('id');
            var gameData = database.ref('/game/' + window.localStorage.userId);
                gameData.set(buttonId);
            window.localStorage.setItem('playerSub', buttonId)
            playerCounter();
        });
    }

    else if(numUsers < 2){
        var sorryDiv = document.createElement('div')
            $(sorryDiv).attr('id', 'sorryDiv');
            $(sorryDiv).html('<h2>Sorry, there are not enough players yet.</h2>');
            $(sorryDiv).appendTo(mainDiv);
        var sorryButton = document.createElement('button');
            $(sorryButton).attr('id', 'sorryButton');
            $(sorryButton).attr('class', 'btn btn-lg btn-outline-light')
            $(sorryButton).text('Try Again?');
            $(sorryButton).appendTo(mainDiv);
            $(sorryButton).on('click', function(){
                window.location.reload(true);
            })
    }
    else if (numUsers > 2){
        $(mainDiv).empty();
        $(mainDiv).html('<h2>Too many people playing right now!</h2>')
        startOver();
    }

};

var playerCounter = function(){
    if(numSubs < 2){ 
        $(mainDiv).empty();
        $(mainDiv).html('<h2>Waiting for response!</h2>')
        gameSubmissions.on('value', function(snap){
            numSubs = snap.numChildren();
            if(numSubs < 2){
                setTimeout(function(){
                    playerCounter();
                }, 1000)
            }
        });
    }
    else if(numSubs == 2){
        var gameIds = database.ref('/playerIds');
        gameIds.once('value', function(snap) {
            if(snap.child('player1').val() == true){
                database.ref('/playerIds').update({player1 : (window.localStorage.userId)});
                window.localStorage.setItem('playerNum', 'player1');
            }
            else if(snap.child('player1').val() != true && snap.child('player2').val() == true){
                database.ref('/playerIds').update({player2 : (window.localStorage.userId)});
                window.localStorage.setItem('playerNum', 'player2');
            }
        });
        setInterval(function(){
            gameIds.once('value', function(snap){
                if (window.localStorage.playerNum == "player1"){
                    window.localStorage.setItem('opponentNum', snap.child('/player2').val())
                }
                else if (window.localStorage.playerNum == "player2"){
                    window.localStorage.setItem('opponentNum', snap.child('/player1').val())
                }
            })
        }, 2000);
        $(mainDiv).empty();
        $(mainDiv).html('<h2>Comparing...</h2>')
        compare();
    }
}
//Compares submission values & decides winner
var compare = function(){
    var playerNumber = window.localStorage.userId;
    var oppoNum = window.localStorage.opponentNum;
    var oppoSubmission = database.ref('/game/' + oppoNum)
    var oppoSub;
    var playerSub;
    oppoSubmission.on('value', function(snap){
        var oppoSubmission = snap.val();
        if(oppoSubmission == null){ setTimeout(function(){ compare() }, 2000)}
        else {
        window.localStorage.setItem('oppoSub', oppoSubmission);
        oppoSub = window.localStorage.oppoSub;
        playerSub = window.localStorage.playerSub;
        if(playerSub == 'rock' && oppoSub == 'rock'){ tie() }
        else if(playerSub == 'rock' && oppoSub == 'paper'){ lose() }
        else if(playerSub == 'rock' && oppoSub == 'scissors'){ win() }
        else if(playerSub == 'paper' && oppoSub == 'rock'){ win() }
        else if(playerSub == 'paper' && oppoSub == 'paper'){ tie() }
        else if(playerSub == 'paper' && oppoSub == 'scissors'){ lose() }
        else if(playerSub == 'scissors' && oppoSub == 'rock'){ lose() }
        else if(playerSub == 'scissors' && oppoSub == 'paper'){ win() }
        else if(playerSub == 'scissors' && oppoSub == 'scissors'){ tie() }}
    });
};
var tie = function(){
    var tieMessage = document.createElement('div')
        $(tieMessage).html('<h2>You Tied!</h2>')
        $(mainDiv).empty();
        $(tieMessage).appendTo(mainDiv);
        subHeaderFxn();
        startOver();
    
};
var win = function(){
    var winMessage = document.createElement('div');
        $(winMessage).html('<h2>You Won!</h2>');
        $(mainDiv).empty();
        $(winMessage).appendTo(mainDiv);
    var winNum = database.ref('/ids/' + window.localStorage.userId);
    winNum.once('value', function(snap){
        var number = snap.child('wins').val();
        winNum.update({wins: (number + 1)});
    });
    subHeaderFxn();
    startOver();
};
var lose = function(){
    var loseMessage = document.createElement('div')
    $(loseMessage).html('<h2>You Lost!</h2>')
    $(mainDiv).empty();
    $(loseMessage).appendTo(mainDiv);
    var loseNum = database.ref('/ids/' + window.localStorage.userId);
    loseNum.once('value', function(snap){
        var number = snap.child('losses').val();
        loseNum.update({losses: (number + 1)});
    });
    subHeaderFxn();
    startOver();
};
var startOver = function(){
    localStorage.removeItem('playerSub');
    localStorage.removeItem('oppoSub');
    database.ref('/playerIds').set({player1: true, player2: true})
    var sOver = document.createElement('button');
        $(sOver).attr('id', 'startOverButton');
        $(sOver).attr('class', 'btn btn-lg btn-outline-light')
        $(sOver).text('Start Over')
        $(sOver).appendTo(mainDiv);
        $(sOver).on('click', function(){
            window.location.reload(true);
        })
};

//page-ready instructions
$(document).ready(function(){
    database.ref('/playerIds').set({player1: true, player2: true})
    gameSubmissions.remove();
    subHeaderCreator();
    startScreen();
});