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