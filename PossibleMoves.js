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