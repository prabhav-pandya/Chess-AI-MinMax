/******************************************************************/

// main environment variable

/* 
-> The first letter in each cell represents the color
-> The second letter represents the piece type (bishop, rook...)
-> The third letter uniquely identifies each piece from other similar 
   pieces. 
*/

let numPossibleMoves = 0;

var env = [
    ['brl', 'bnl', 'bbl', 'bk', 'bq', 'bbr', 'bnr', 'brr'],
    ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8'],
    ['wrl', 'wnl', 'wbl', 'wk', 'wq', 'wbr', 'wnr', 'wrr'],
];

var maxMinRole = {
    "max": "b",
    "min": "w"
};

var color = {
    "b": "black",
    "w": "white"
};

var pieceDict = {
    "r": "rook",
    "n": "knight",
    "b": "bishop",
    "k": "king",
    "q": "queen",
    "p": "pawn"
};

var pieceWts = {
    "r": 60,
    "n": 30,
    "b": 30,
    "k": 10000,
    "q": 200,
    "p": 10
}

var botChar = 'b';
var userChar = 'w';

var chance = 'w'; // Checks which players gets to move

var main = document.getElementById("main");
var turn = document.getElementById("turn");

var moves = [] // store valid moves
var selectedPiece = ''; // store selected piece

var maxDepth = 4;

var defenseWeight = 1;
var attackWeight = 1;

var moveMadeBlocks = [];

/******************************************************************/
// Create the front-end and environment

renderPositions();

function renderPositions() {
    /* 
    renders the front-end of the board
    function is called everytime a move is made
    */
    //console.log(JSON.stringify(moveMadeBlocks));
    if (chance == 'w') turn.innerHTML = "<p>Your Turn</p>";
    else turn.innerHTML = "<p>Bot's Turn</p>";

    main.innerHTML = "";
    var alt = 0, id = 0;
    for (var i = 0; i < 8; i++) {
        main.innerHTML += `<div class="row" id="row${i}"></div>`;
        for (var j = 0; j < 8; j++) {
            var className = "square ";
            if (alt % 2 == 0) className += "white";
            else className += "brown";
            if (j != 7) alt += 1;

            document.getElementById(`row${i}`).innerHTML += `<div class="${className}" id="square_${id}" onclick="clickAction(${i},${j})"></div>`;
            id += 1;
        }
    }

    id = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            var square = document.getElementById(`square_${id}`);
            if (env[i][j] == '') {
                square.innerHTML = "";
            }
            else {
                square.innerHTML += `<img class="pieces" src='./pieces/${color[env[i][j][0]]}_${pieceDict[env[i][j][1]]}.png'>`;
            }
            id += 1;
        }
    }

    // when a move is made, blocks are highlighted...
    moveMadeBlocks.forEach(id => {
        document.getElementById(`square_${id}`).style.backgroundColor = "#ffce99";
    });
    moveMadeBlocks = [];

}

/******************************************************************/
// helper functions

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isMoveInMoves(move) {
    /* 
       checks if the selected square is a move
   */
    for (var i = 0; i < moves.length; i++) {
        if (moves[i][0] == move[0] && moves[i][1] == move[1]) {
            return true;
        }
    }
    return false;
}

function alterChance() {
    if (chance == 'w') chance = 'b';
    else chance = 'w';
    moves = [];
    if (chance == 'w') turn.innerHTML = "<p>Your Turn</p>";
    else turn.innerHTML = `<p>Bot's Turn</p><div class="loader"></div>`;
}

function clone([...env]) {
    var clone = [];
    for (let i = 0; i < 8; i++) {
        let row = [];
        for (let j = 0; j < 8; j++) {
            row.push(env[i][j]);
        }
        clone.push(row);
    }
    return clone;
}

/******************************************************************/
// get moves for pieces

async function clickAction(i, j) {

    /* 
       checks if the square clicked on by the user is a move 
       or to select a piece
   */

    renderPositions();
    if (isMoveInMoves([i, j])) {
        movePiece(selectedPiece, i, j);
        alterChance();
        await sleep(1000); // this ensures that chance is altered
        botMove();
    }
    else {
        selectedPiece = env[i][j];
        moves = [];
        if (selectedPiece[0] != chance) return;

        if (env[i][j][1] == 'p') {
            moves = getPawnMoves(i, j, env);
            displayMoves(moves);
        }
        else if (env[i][j][1] == 'b') {
            moves = getBishopMoves(i, j, env);
            displayMoves(moves);
        }
        else if (env[i][j][1] == 'n') {
            moves = getKnightMoves(i, j, env);
            displayMoves(moves);
        }
        else if (env[i][j][1] == 'r') {
            moves = getRookMoves(i, j, env);
            displayMoves(moves);
        }
        else if (env[i][j][1] == 'q') {
            moves = getQueenMoves(i, j, env);
            displayMoves(moves);
        }
        else if (env[i][j][1] == 'k') {
            moves = getKingMoves(i, j, env);
            displayMoves(moves);
        }
    }

}

function movePiece(selectedPiece, i, j) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (env[i][j] == selectedPiece) {
                env[i][j] = '';
                moveMadeBlocks.push(i * 8 + j);
                break;
            }
        }
    }
    env[i][j] = selectedPiece;
    moveMadeBlocks.push(i * 8 + j);
    renderPositions();
}

function displayMoves(moves) {
    moves.forEach(move => {
        var id = move[0] * 8 + move[1];
        document.getElementById(`square_${id}`).innerHTML += `<div class="move_circle"></div>`;
    });
}

// Get Possible Moves for selected Peice
document.write('<script type="text/javascript" src="PossibleMoves.js" ></script>');

// Get bot's move
document.write('<script type="text/javascript" src="BotMove.js" ></script>');