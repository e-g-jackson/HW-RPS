var mainDiv = document.getElementById('mainDiv');

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
    console.log('startScreen function')
    var startButton = document.createElement('button');
    $(startButton).text('Start!');
    $(startButton).attr('id', 'startButton')
    $(startButton).attr('class', 'btn btn-lg btn-info')
    $(mainDiv).empty();
    $(mainDiv).html('<h2>Multiplayer mode!</h2><br><p>Click the start button to continue!</p>');
    $(mainDiv).append(startButton);
    $(startButton).on('click', function(){
        setupGame();
    })
};

var setupGame = function(){
    console.log('setupGame function');
    // console.log(typeof window.storage.userId);

        //check localStorage for previously saved 'userId'
        if (typeof (window.localStorage.userId) === 'null' || typeof (window.localStorage.userId) === 'undefined'){
            userIdGenerator();
            
            console.log('userId generated!')
            
            var inputName = document.createElement('input');
            var inputButton = document.createElement('button');
            var lineBreak = '<br>';
                $(inputName).attr('id', 'nameBox');
                $(inputName).attr('placeholder', 'What would you like to be called?');
                $(inputButton).attr('id', 'inputButton');
                $(inputButton).attr('class', 'btn btn-lg btn-info');
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
                    userId: userId,
                    wins:0,
                    losses:0,
                }
                
                console.log(JSON.parse(JSON.stringify(info)));
                    
                    
                database.ref('/ids').child(userId).set({
                    screenName: info.screenName,
                    userId: userId,
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
                $(goButton).attr('class', 'btn btn-lg btn-info');
                $(goButton).text('Go!')
            nameRecall = window.localStorage.name
            info = database.ref('/ids').child(identity);
                $(mainDiv).empty();
                $(welcomeDiv).html('<h1> Welcome back ' + nameRecall + '!');
                $(welcomeDiv).appendTo(mainDiv)
                $(goButton).appendTo(welcomeDiv);
            console.log("welcome back " + nameRecall + "!");
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
    userId = '"' + pt1 + pt2 + pt3 + pt4 + pt5 + pt6 + pt7 + pt8 + pt9 + pt0 + '"';
    window.localStorage.setItem('userId', userId);
    console.log('userId = ' + userId);
};

var initialize = function(){
    console.log('initialize function');
    $(mainDiv).html('');
    $(connectionsRef);
    if(numUsers == 2){
        console.log('just the right number!')
            
        var infoDiv = document.createElement('div');
            $(infoDiv).attr('id', 'infoDiv');
        var buttonDiv = document.createElement('div');
            $(buttonDiv).attr('id', 'buttonDiv');
        var rockButton = document.createElement('button');
            $(rockButton).text('Rock');
            $(rockButton).attr('id', 'rock');
            $(rockButton).attr('class', 'btn btn-lg btn-info');
            $(rockButton).appendTo(buttonDiv);
        var paperButton = document.createElement('button');
            $(paperButton).text('Paper');
            $(paperButton).attr('id', 'paper');
            $(paperButton).attr('class', 'btn btn-lg btn-info');
            $(paperButton).appendTo(buttonDiv);
        var scissorsButton = document.createElement('button');
            $(scissorsButton).text('Scissors');
            $(scissorsButton).attr('id', 'scissors');
            $(scissorsButton).attr('class', 'btn btn-lg btn-info');
            $(scissorsButton).appendTo(buttonDiv);
            $(infoDiv).html('Pick Rock, Paper, or Scissors! <br><br><br>')
            $(mainDiv).append(infoDiv);
            $(mainDiv).append(buttonDiv);
        //submitting R,P, or S
        $('body').on('click', 'button', function(){
                console.log('you\'ve made your move, now we wait.');
            var buttonId = $(this).attr('id');
            var gameData = database.ref('/game/' + window.localStorage.userId);
                gameData.set(buttonId);
                console.log('number of submissions: ' + numSubs)
            var compare = function(){
                if(numSubs < 2){
                    console.log('waiting for response')
                    $(mainDiv).empty();
                    $(mainDiv).html('<h2>Waiting for response!</h2>')
                    $(gameSubmissions).on('value', function(){
                        if(numSubs == 2){
                            compare();
                        }
                    })
                }
                else if(numSubs == 2){
                    console.log('now we compare')
                }
            }
            compare();
        });
    }

    else if(numUsers < 2){
        console.log('not enough peeps');
        var sorryDiv = document.createElement('div')
            $(sorryDiv).attr('id', 'sorryDiv');
            $(sorryDiv).html('<h2>Sorry, there are not enough players yet.</h2>');
            $(sorryDiv).appendTo(mainDiv);
        var sorryButton = document.createElement('button');
            $(sorryButton).attr('id', 'sorryButton');
            $(sorryButton).attr('class', 'btn btn-lg btn-info')
            $(sorryButton).text('Try Again?');
            $(sorryButton).appendTo(mainDiv);
            $(sorryButton).on('click', function(){
                initialize();
            })
    }
    else if (numUsers > 2){
        console.log('Sorry, too many users. Try again soon!')
    }

};

database.ref().on('value', function(snapshot){
    console.log(JSON.stringify(snapshot))
});

//page-ready instructions
$(document).ready(function(){
    console.log('first!');
    console.log(JSON.stringify(localStorage));
    startScreen();
});