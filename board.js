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

function getPawnMoves(i, j, env) {
    var sign = 1;
    let moves = [];
    let currentPiece = env[i][j];
    if (env[i][j][0] == 'w') sign = -1;

    if (i + sign < 0 || i + sign >= 8) return [];

    // up-left if opponent piece is there
    if (j - 1 >= 0 && env[i + sign][j - 1] != '' && env[i + sign][j - 1][0] != currentPiece[0]) {
        moves.push([i + sign, j - 1]);
    }
    // up-right if opponent piece is there
    if (j + 1 < 8 && env[i + sign][j + 1] != '' && env[i + sign][j + 1][0] != currentPiece[0]) {
        moves.push([i + sign, j + 1]);
    }

    if (env[i + sign * 1][j] == '') {
        moves.push([i + sign * 1, j]);
    } else {
        return moves;
    }
    if (((sign == 1 && i == 1) || (sign == -1 && i == 6)) && env[i + sign * 2][j] == '') moves.push([i + sign * 2, j]);
    return moves;
}

function getBishopMoves(i, j, env) {
    var moves = [];
    var currentPiece = env[i][j];
    // up-right
    var i_idx = i, j_idx = j;
    while (i_idx >= 0 && j_idx < 8) {
        if (i_idx != i && j_idx != j) moves.push([i_idx, j_idx]);
        if ((i_idx != i && j_idx != j) && env[i_idx][j_idx] != '') {
            let checkIfSameColor = env[i_idx][j_idx][0] == currentPiece[0];
            if (checkIfSameColor) {
                moves.pop();
            }
            break;
        }
        i_idx -= 1; j_idx += 1;
    }
    //up-left
    i_idx = i, j_idx = j;
    while (i_idx >= 0 && j_idx >= 0) {
        if (i_idx != i && j_idx != j) moves.push([i_idx, j_idx]);
        if ((i_idx != i && j_idx != j) && env[i_idx][j_idx] != '') {
            let checkIfSameColor = env[i_idx][j_idx][0] == currentPiece[0];
            if (checkIfSameColor) {
                moves.pop();
            }
            break;
        }
        i_idx -= 1; j_idx -= 1;
    }

    //down-left
    i_idx = i, j_idx = j;
    while (i_idx < 8 && j_idx >= 0) {
        if (i_idx != i && j_idx != j) moves.push([i_idx, j_idx]);
        if ((i_idx != i && j_idx != j) && env[i_idx][j_idx] != '') {
            let checkIfSameColor = env[i_idx][j_idx][0] == currentPiece[0];
            if (checkIfSameColor) {
                moves.pop();
            }
            break;
        }
        i_idx += 1; j_idx -= 1;
    }

    //down-right
    i_idx = i, j_idx = j;
    while (i_idx < 8 && j_idx < 8) {
        if (i_idx != i && j_idx != j) moves.push([i_idx, j_idx]);
        if ((i_idx != i && j_idx != j) && env[i_idx][j_idx] != '') {
            let checkIfSameColor = env[i_idx][j_idx][0] == currentPiece[0];
            if (checkIfSameColor) {
                moves.pop();
            }
            break;
        }
        i_idx += 1; j_idx += 1;
    }
    return moves;
}

function getKnightMoves(i, j, env) {
    var moves = [];
    var currentPiece = env[i][j];
    //top-right
    if (i - 2 >= 0 && j + 1 < 8 && env[i - 2][j + 1][0] != currentPiece[0]) {
        moves.push([i - 2, j + 1]);
    }
    //top-left
    if (i - 2 >= 0 && j - 1 >= 0 && env[i - 2][j - 1][0] != currentPiece[0]) {
        moves.push([i - 2, j - 1]);
    }
    //down-left
    if (i + 2 < 8 && j - 1 >= 0 && env[i + 2][j - 1][0] != currentPiece[0]) {
        moves.push([i + 2, j - 1]);
    }
    //down-right
    if (i + 2 < 8 && j + 1 < 8 && env[i + 2][j + 1][0] != currentPiece[0]) {
        moves.push([i + 2, j + 1]);
    }

    //right-up
    if (j + 2 < 8 && i - 1 >= 0 && env[i - 1][j + 2][0] != currentPiece[0]) {
        moves.push([i - 1, j + 2]);
    }
    //right-down
    if (j + 2 < 8 && i + 1 < 8 && env[i + 1][j + 2][0] != currentPiece[0]) {
        moves.push([i + 1, j + 2]);
    }
    //left-down
    if (j - 2 >= 0 && i + 1 < 8 && env[i + 1][j - 2][0] != currentPiece[0]) {
        moves.push([i + 1, j - 2]);
    }
    //left-up
    if (j - 2 >= 0 && i - 1 >= 0 && env[i - 1][j - 2][0] != currentPiece[0]) {
        moves.push([i - 1, j - 2]);
    }

    return moves;
}

function getRookMoves(i, j, env) {
    var i_idx = i, j_idx = j;
    var moves = [];
    let currentPiece = env[i][j];
    //right
    while (j_idx < 8) {
        if (j_idx != j) moves.push([i_idx, j_idx]);
        if (j_idx != j && env[i_idx][j_idx] != '') {
            if (env[i_idx][j_idx][0] == currentPiece[0]) {
                moves.pop();
            }
            break;
        }
        j_idx += 1;
    }
    //left
    i_idx = i, j_idx = j;
    while (j_idx >= 0) {
        if (j_idx != j) moves.push([i_idx, j_idx]);
        if (j_idx != j && env[i_idx][j_idx] != '') {
            if (env[i_idx][j_idx][0] == currentPiece[0]) {
                moves.pop();

            }
            break;
        }
        j_idx -= 1;
    }
    //up
    i_idx = i, j_idx = j;
    while (i_idx >= 0) {
        if (i_idx != i) moves.push([i_idx, j_idx]);
        if (i_idx != i && env[i_idx][j_idx] != '') {
            if (env[i_idx][j_idx][0] == currentPiece[0]) {
                moves.pop();

            }
            break;
        }
        i_idx -= 1;
    }
    //down
    i_idx = i, j_idx = j;
    while (i_idx < 8) {
        if (i_idx != i) moves.push([i_idx, j_idx]);
        if (i_idx != i && env[i_idx][j_idx] != '') {
            if (env[i_idx][j_idx][0] == currentPiece[0]) {
                moves.pop();

            }
            break;
        }
        i_idx += 1;
    }
    return moves;
}

function getQueenMoves(i, j, env) {
    var i_idx = i, j_idx = j;
    var moves = [];
    let currentPiece = env[i][j];
    //right
    while (j_idx < 8) {
        if (j_idx != j) moves.push([i_idx, j_idx]);
        if (j_idx != j && env[i_idx][j_idx] != '') {
            if (currentPiece[0] == env[i_idx][j_idx][0]) {
                moves.pop();
            }
            break;
        }
        j_idx += 1;
    }
    //left
    i_idx = i, j_idx = j;
    while (j_idx >= 0) {
        if (j_idx != j) moves.push([i_idx, j_idx]);
        if (j_idx != j && env[i_idx][j_idx] != '') {
            if (currentPiece[0] == env[i_idx][j_idx][0]) {
                moves.pop();
            }
            break;
        }
        j_idx -= 1;
    }
    //up
    i_idx = i, j_idx = j;
    while (i_idx >= 0) {
        if (i_idx != i) moves.push([i_idx, j_idx]);
        if (i_idx != i && env[i_idx][j_idx] != '') {
            if (currentPiece[0] == env[i_idx][j_idx][0]) {
                moves.pop();
            }
            break;
        }
        i_idx -= 1;
    }
    //down
    i_idx = i, j_idx = j;
    while (i_idx < 8) {
        if (i_idx != i) moves.push([i_idx, j_idx]);
        if (i_idx != i && env[i_idx][j_idx] != '') {
            if (currentPiece[0] == env[i_idx][j_idx][0]) {
                moves.pop();
            }
            break;
        }
        i_idx += 1;
    }
    //up-right
    i_idx = i, j_idx = j;
    while (i_idx >= 0 && j_idx < 8) {
        if (i_idx != i && j_idx != j) moves.push([i_idx, j_idx]);
        if ((i_idx != i && j_idx != j) && env[i_idx][j_idx] != '') {
            if (currentPiece[0] == env[i_idx][j_idx][0]) {
                moves.pop();
            }
            break;
        }
        i_idx -= 1; j_idx += 1;
    }
    //up-left
    i_idx = i, j_idx = j;
    while (i_idx >= 0 && j_idx >= 0) {
        if (i_idx != i && j_idx != j) moves.push([i_idx, j_idx]);
        if ((i_idx != i && j_idx != j) && env[i_idx][j_idx] != '') {
            if (currentPiece[0] == env[i_idx][j_idx][0]) {
                moves.pop();
            }
            break;
        }
        i_idx -= 1; j_idx -= 1;
    }

    //down-left
    i_idx = i, j_idx = j;
    while (i_idx < 8 && j_idx >= 0) {
        if (i_idx != i && j_idx != j) moves.push([i_idx, j_idx]);
        if ((i_idx != i && j_idx != j) && env[i_idx][j_idx] != '') {
            if (currentPiece[0] == env[i_idx][j_idx][0]) {
                moves.pop();
            }
            break;
        }
        i_idx += 1; j_idx -= 1;
    }

    //down-right
    i_idx = i, j_idx = j;
    while (i_idx < 8 && j_idx < 8) {
        if (i_idx != i && j_idx != j) moves.push([i_idx, j_idx]);
        if ((i_idx != i && j_idx != j) && env[i_idx][j_idx] != '') {
            if (currentPiece[0] == env[i_idx][j_idx][0]) {
                moves.pop();
            }
            break;
        }
        i_idx += 1; j_idx += 1;
    }
    return moves;
}

function getKingMoves(i, j, env) {
    var moves = [];
    let currentPiece = env[i][j];
    //down
    if (i + 1 < 8 && j >= 0 && currentPiece[0] != env[i + 1][j][0]) {
        moves.push([i + 1, j]);
    }
    //up
    if (i - 1 >= 0 && j >= 0 && currentPiece[0] != env[i - 1][j][0]) {
        moves.push([i - 1, j]);
    }
    //down-right
    if (i + 1 < 8 && j + 1 < 8 && currentPiece[0] != env[i + 1][j + 1][0]) {
        moves.push([i + 1, j + 1]);
    }
    //top-left
    if (i - 1 >= 0 && j - 1 >= 0 && currentPiece[0] != env[i - 1][j - 1][0]) {
        moves.push([i - 1, j - 1]);
    }
    //down-left
    if (i + 1 < 8 && j - 1 >= 0 && currentPiece[0] != env[i + 1][j - 1][0]) {
        moves.push([i + 1, j - 1]);
    }
    //left
    if (i < 8 && j - 1 >= 0 && currentPiece[0] != env[i][j - 1][0]) {
        moves.push([i, j - 1]);
    }
    //right
    if (i < 8 && j + 1 < 8 && currentPiece[0] != env[i][j + 1][0]) {
        moves.push([i, j + 1]);
    }
    //top-right
    if (i - 1 >= 0 && j + 1 < 8 && currentPiece[0] != env[i - 1][j + 1][0]) {
        moves.push([i - 1, j + 1]);
    }
    return moves;
}
/******************************************************************/

/******************************************************************/
// MIN MAX helper functions
function getKillScore([...env], move) {
    if (env[move[0]][move[1]] != '') {
        return 1;
    }
    return 0;
}

/******************************************************************/
// MIN MAX ALGORITHM

function botMove() {
    let envClone = clone(env);
    var piece, maxScore = -1000000, bestMoves = [];
    console.log("Bot score before move: ", evaluateBoard(envClone, 0));
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            // get all possible moves for that particular piece
            let botMoves = [];
            if (envClone[i][j] != '' && envClone[i][j][0] == botChar) {
                if (env[i][j][1] == 'p') {
                    botMoves = getPawnMoves(i, j, envClone);
                }
                else if (env[i][j][1] == 'b') {
                    botMoves = getBishopMoves(i, j, envClone);
                }
                else if (env[i][j][1] == 'n') {
                    botMoves = getKnightMoves(i, j, envClone);
                }
                else if (env[i][j][1] == 'r') {
                    botMoves = getRookMoves(i, j, envClone);
                }
                else if (env[i][j][1] == 'q') {
                    botMoves = getQueenMoves(i, j, envClone);
                }
                else if (env[i][j][1] == 'k') {
                    botMoves = getKingMoves(i, j, envClone);
                }
            }

            // get score for each move
            botMoves.forEach(m => {
                let envModified = makeMoveInEnv([...envClone], envClone[i][j], m[0], m[1]);
                let killScore = getKillScore(env, m) * (maxDepth);
                let score = getMoveScore(envModified, false, 1, killScore);
                //console.log(score);
                if (score > maxScore) {
                    bestMoves = []
                    piece = env[i][j];
                    maxScore = score;
                    bestMoves.push([piece, m]);
                    //console.log(env[i][j]);
                    //console.log(maxScore);
                }
                else if (score == maxScore) {
                    piece = env[i][j];
                    bestMoves.push([piece, m]);
                }
            });

        }
    }
    console.log("Number of possibilities evaluated: ", numPossibleMoves);
    console.log("Move score: ", maxScore);
    numPossibleMoves = 0;
    //console.log(bestMove);
    //console.log(maxScore);
    var randomMove = Math.floor(Math.random() * bestMoves.length);
    env = makeMoveInEnv([...env], bestMoves[randomMove][0], bestMoves[randomMove][1][0], bestMoves[randomMove][1][1], true);
    renderPositions();
    alterChance();
}

function makeMoveInEnv([...envClone], piece, i, j, final = false) {
    let envCopy = clone(envClone);
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (envCopy[i][j] == piece) {
                envCopy[i][j] = "";
                if (final) moveMadeBlocks.push(i * 8 + j);
            }
        }
    }
    envCopy[i][j] = piece;
    if (final) moveMadeBlocks.push(i * 8 + j);
    return envCopy;
}

function evaluateBoard(envClone, killScore) {
    let score = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (envClone[i][j][0] == botChar) {
                score += 1.001 * defenseWeight * pieceWts[envClone[i][j][1]];
                // score += 1; // To ensure more players stay alive and not sacrifice
            }
        }
    }

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (envClone[i][j][0] == userChar) {
                score -= attackWeight * pieceWts[envClone[i][j][1]];
            }
        }
    }

    return score;
}

// uses minmax recursive algorithm to find the best option
function getMoveScore([...envClone], isMax, depth, allKillScore) {
    numPossibleMoves++;
    let env = clone(envClone);
    if (depth == maxDepth) {
        // if the king is killed or depth is reached, evaluate the board and return score.
        let evaluationScore = evaluateBoard(env, allKillScore);
        return evaluationScore;
    }

    if (isMax) {
        let maxScore = -1000000;
        // check score for all possible next moves and store maximum
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // get all possible moves for that particular piece
                let botMoves = [];
                if (env[i][j] != '' && env[i][j][0] == botChar) {
                    if (env[i][j][1] == 'p') {
                        botMoves = getPawnMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'b') {
                        botMoves = getBishopMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'n') {
                        botMoves = getKnightMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'r') {
                        botMoves = getRookMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'q') {
                        botMoves = getQueenMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'k') {
                        botMoves = getKingMoves(i, j, env);
                    }
                }
                // get score for each move
                botMoves.forEach(m => {
                    let envModified = makeMoveInEnv(env, env[i][j], m[0], m[1]);
                    let killScore = getKillScore(env, m) * (maxDepth - depth - 1);
                    let score = getMoveScore(envModified, false, depth + 1, allKillScore + killScore);
                    //console.log(score);
                    if (score > maxScore) {
                        maxScore = score;
                    }
                });
            }
        }
        return maxScore;

    }
    else {
        let minScore = 1000000;
        // check score for all possible next moves and store maximum
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                // get all possible moves for that particular piece
                let botMoves = [];
                if (env[i][j] != '' && env[i][j][0] == userChar) {
                    if (env[i][j][1] == 'p') {
                        botMoves = getPawnMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'b') {
                        botMoves = getBishopMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'n') {
                        botMoves = getKnightMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'r') {
                        botMoves = getRookMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'q') {
                        botMoves = getQueenMoves(i, j, env);
                    }
                    else if (env[i][j][1] == 'k') {
                        botMoves = getKingMoves(i, j, env);
                    }
                }
                // get score for each move
                botMoves.forEach(m => {
                    let envModified = makeMoveInEnv(env, env[i][j], m[0], m[1]);
                    let killScore = getKillScore(env, m) * (maxDepth - depth);
                    let score = getMoveScore(envModified, true, depth + 1, allKillScore - killScore);
                    //console.log(score);
                    if (score < minScore) {
                        minScore = score;
                    }
                });
            }
        }
        return minScore;
    }
}