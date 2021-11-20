/******************************************************************/

// main environment variable

/* 
-> The first letter in each cell represents the color
-> The second letter represents the piece type (bishop, rook...)
-> The third letter uniquely identifies each piece from other similar 
   pieces. 
*/

var env = [
    ['brl','bnl','bbl','bk','bq','bbr','bnr','brr'],
    ['bp1','bp2','bp3','bp4','bp5','bp6','bp7','bp8'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['wp1','wp2','wp3','wp4','wp5','wp6','wp7','wp8'],
    ['wrl','wnl','wbl','wk','wq','wbr','wnr','wrr'],
];

var color = {
    "b":"black",
    "w":"white"
}

var pieceDict = {
    "r":"rook",
    "n":"knight",
    "b":"bishop",
    "k":"king",
    "q":"queen",
    "p":"pawn"
};

var chance = 'w'; // Checks which players gets to move

var main = document.getElementById("main");
var turn = document.getElementById("turn");

var moves = [] // store valid moves
var selectedPiece = ''; // store selected piece

/******************************************************************/
// Create the front-end and environment

renderPositions();

function renderPositions(){
    /* 
    renders the front-end of the board
    function is called everytime a move is made
    */
    if(chance=='w') turn.innerHTML = "<p>White's Turn</p>";
    else turn.innerHTML = "<p>Black's Turn</p>";

    main.innerHTML = "";
    var alt = 0, id=0;
    for(var i=0;i<8;i++){
        main.innerHTML+=`<div class="row" id="row${i}"></div>`;
        for(var j=0;j<8;j++){
            var className = "square ";
            if(alt%2==0) className+="white";
            else className+="brown";
            if(j!=7) alt+=1;
    
            document.getElementById(`row${i}`).innerHTML += `<div class="${className}" id="square_${id}" onclick="clickAction(${i},${j})"></div>`;
            id+=1;
        }
    }

    id = 0;
    for(var i=0;i<8;i++){
        for(var j=0;j<8;j++){
            var square = document.getElementById(`square_${id}`);
            if(env[i][j]==''){
                square.innerHTML = "";
            }
            else{
                square.innerHTML += `<img class="pieces" src='./pieces/${color[env[i][j][0]]}_${pieceDict[env[i][j][1]]}.png'>`;
            }
            id+=1;
        }
    }
}

/******************************************************************/
// helper functions
function isMoveInMoves(move){
     /* 
        checks if the selected square is a move
    */
    for(var i=0;i<moves.length;i++){
        if(moves[i][0]==move[0] && moves[i][1]==move[1]){
            return true;
        }
    }
    return false;
}


/******************************************************************/
// get moves for pieces

function clickAction(i,j){

     /* 
        checks if the square clicked on by the user is a move 
        or to select a piece
    */

    renderPositions();
    if(isMoveInMoves([i,j])){
        movePiece(selectedPiece, i,j);
        if(chance=='w') chance = 'b';
        else chance = 'w';
        moves = [];
        if(chance=='w') turn.innerHTML = "<p>White's Turn</p>";
        else turn.innerHTML = "<p>Black's Turn</p>";
    }
    else{
        selectedPiece = env[i][j];

        if(selectedPiece[0]!=chance) return;

        if(env[i][j][1]=='p'){
            moves = getPawnMoves(i,j);
            displayMoves(moves);
        }
        else if(env[i][j][1]=='b'){
            moves = getBishopMoves(i,j);
            displayMoves(moves);
        }
        else if(env[i][j][1]=='n'){
            moves = getKnightMoves(i,j);
            displayMoves(moves);
        }
        else if(env[i][j][1]=='r'){
            moves = getRookMoves(i,j);
            displayMoves(moves);
        }
        else if(env[i][j][1]=='q'){
            moves = getQueenMoves(i,j);
            displayMoves(moves);
        }
        else if(env[i][j][1]=='k'){
            moves = getKingMoves(i,j);
            displayMoves(moves);
        }
        else moves = [];
    }
    
}

function movePiece(selectedPiece, i, j){
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(env[i][j]==selectedPiece){
                env[i][j] = '';
                break;
            } 
        }
    }
    env[i][j] = selectedPiece;
    renderPositions();
}

function displayMoves(moves){
    moves.forEach(move=>{
        var id = move[0]*8 + move[1];
        document.getElementById(`square_${id}`).innerHTML+=`<div class="move_circle"></div>`;
    });
}

function getPawnMoves(i,j){
    var sign = 1;
    let moves = [];
    let currentPiece = env[i][j];
    if(env[i][j][0]=='w') sign = -1;

    if(i+sign<0 || i+sign>=8) return [];

    // up-left if opponent piece is there
    if(j-1>=0 && env[i+sign][j-1]!='' && env[i+sign][j-1][0]!=currentPiece[0]){
        moves.push([i+sign,j-1]);
    } 
    // up-right if opponent piece is there
    if(j+1<8 && env[i+sign][j+1]!='' && env[i+sign][j+1][0]!=currentPiece[0]){
        moves.push([i+sign,j+1]);
    } 

    if(env[i+sign*1][j]==''){
        moves.push([i + sign*1,j]);
    } else{
        return moves;
    }
    if(((sign==1 && i==1) || (sign==-1 && i==6)) && currentPiece[0]!=env[i + sign*2][j][0]) moves.push([i + sign*2,j]);
    return moves;
}

function getBishopMoves(i,j){
    var moves = [];
    var currentPiece = env[i][j];
    // up-right
    var i_idx = i, j_idx = j;
    while(i_idx>=0 && j_idx<8){
        if(i_idx!=i && j_idx!=j) moves.push([i_idx, j_idx]);
        if((i_idx!=i && j_idx!=j) && env[i_idx][j_idx]!=''){
            let checkIfSameColor = env[i_idx][j_idx][0]==currentPiece[0];
            if(checkIfSameColor){
                moves.pop();
            }
            break;
        }
        i_idx-=1; j_idx+=1;
    }
    //up-left
    i_idx = i, j_idx = j;
    while(i_idx>=0 && j_idx>=0){
        if(i_idx!=i && j_idx!=j) moves.push([i_idx, j_idx]);
        if((i_idx!=i && j_idx!=j) && env[i_idx][j_idx]!=''){
            let checkIfSameColor = env[i_idx][j_idx][0]==currentPiece[0];
            if(checkIfSameColor){
                moves.pop();
            }
            break;
        }
        i_idx-=1; j_idx-=1;
    }

    //down-left
    i_idx = i, j_idx = j;
    while(i_idx<8 && j_idx>=0){
        if(i_idx!=i && j_idx!=j) moves.push([i_idx, j_idx]);
        if((i_idx!=i && j_idx!=j) && env[i_idx][j_idx]!=''){
            let checkIfSameColor = env[i_idx][j_idx][0]==currentPiece[0];
            if(checkIfSameColor){
                moves.pop();
            }
            break;
        }
        i_idx+=1; j_idx-=1;
    }

    //down-right
    i_idx = i, j_idx = j;
    while(i_idx<8 && j_idx<8){
        if(i_idx!=i && j_idx!=j) moves.push([i_idx, j_idx]);
        if((i_idx!=i && j_idx!=j) && env[i_idx][j_idx]!=''){
            let checkIfSameColor = env[i_idx][j_idx][0]==currentPiece[0];
            if(checkIfSameColor){
                moves.pop();
            }
            break;
        }
        i_idx+=1; j_idx+=1;
    }
    return moves;
}

function getKnightMoves(i,j){
    var moves = [];
    var currentPiece = env[i][j];
    //top-right
    if(i-2>=0 && j+1<8 && env[i-2][j+1][0]!=currentPiece[0]){
        moves.push([i-2,j+1]);
    }
    //top-left
    if(i-2>=0 && j-1>=0 && env[i-2][j-1][0]!=currentPiece[0]){
        moves.push([i-2,j-1]);
    }
    //down-left
    if(i+2<8 && j-1>=0 && env[i+2][j-1][0]!=currentPiece[0]){
        moves.push([i+2,j-1]);
    }
    //down-right
    if(i+2<8 && j+1<8 && env[i+2][j+1][0]!=currentPiece[0]){
        moves.push([i+2,j+1]);
    }

    //right-up
    if(j+2<8 && i-1>=0 && env[i-1][j+2][0]!=currentPiece[0]){
        moves.push([i-1,j+2]);
    }
    //right-down
    if(j+2<8 && i+1<8 && env[i+1][j+2][0]!=currentPiece[0]){
        moves.push([i+1,j+2]);
    }
    //left-down
    if(j-2>=0 && i+1<8 && env[i+1][j-2][0]!=currentPiece[0]){
        moves.push([i+1,j-2]);
    }
    //left-up
    if(j-2>=0 && i-1>=0 && env[i-1][j-2][0]!=currentPiece[0]){
        moves.push([i-1,j-2]);
    }

    return moves;
}

function getRookMoves(i,j){
    var i_idx=i, j_idx=j;
    var moves = [];
    let currentPiece = env[i][j];
    //right
    while(j_idx<8){
        if(j_idx!=j) moves.push([i_idx, j_idx]);
        if(j_idx!=j && env[i_idx][j_idx]!=''){
            if(env[i_idx][j_idx][0]==currentPiece[0]){
                moves.pop();
            }
            break;
        }
        j_idx+=1;
    }
    //left
    i_idx=i, j_idx=j;
    while(j_idx>=0){
        if(j_idx!=j) moves.push([i_idx, j_idx]);
        if(j_idx!=j && env[i_idx][j_idx]!=''){
            if(env[i_idx][j_idx][0]==currentPiece[0]){
                moves.pop();
                
            }
            break;
        }
        j_idx-=1;
    }
    //up
    i_idx=i, j_idx=j;
    while(i_idx>=0){
        if(i_idx!=i) moves.push([i_idx, j_idx]);
        if(i_idx!=i && env[i_idx][j_idx]!=''){
            if(env[i_idx][j_idx][0]==currentPiece[0]){
                moves.pop();
                
            }
            break;
        }
        i_idx-=1;
    }
    //down
    i_idx=i, j_idx=j;
    while(i_idx<8){
        if(i_idx!=i) moves.push([i_idx, j_idx]);
        if(i_idx!=i && env[i_idx][j_idx]!=''){
            if(env[i_idx][j_idx][0]==currentPiece[0]){
                moves.pop();
                
            }
            break;
        }
        i_idx+=1;
    }
    return moves;
}

function getQueenMoves(i,j){
    var i_idx=i, j_idx=j;
    var moves = [];
    let currentPiece = env[i][j];
    //right
    while(j_idx<8){
        if(j_idx!=j) moves.push([i_idx, j_idx]);
        if(j_idx!=j && env[i_idx][j_idx]!=''){
            if(currentPiece[0]==env[i_idx][j_idx][0]){
                moves.pop();
            }
            break;
        }
        j_idx+=1;
    }
    //left
    i_idx=i, j_idx=j;
    while(j_idx>=0){
        if(j_idx!=j) moves.push([i_idx, j_idx]);
        if(j_idx!=j && env[i_idx][j_idx]!=''){
            if(currentPiece[0]==env[i_idx][j_idx][0]){
                moves.pop();
            }
            break;
        }
        j_idx-=1;
    }
    //up
    i_idx=i, j_idx=j;
    while(i_idx>=0){
        if(i_idx!=i) moves.push([i_idx, j_idx]);
        if(i_idx!=i && env[i_idx][j_idx]!=''){
            if(currentPiece[0]==env[i_idx][j_idx][0]){
                moves.pop();
            }
            break;
        }
        i_idx-=1;
    }
    //down
    i_idx=i, j_idx=j;
    while(i_idx<8){
        if(i_idx!=i) moves.push([i_idx, j_idx]);
        if(i_idx!=i && env[i_idx][j_idx]!=''){
            if(currentPiece[0]==env[i_idx][j_idx][0]){
                moves.pop();
            }
            break;
        }
        i_idx+=1;
    }
    //up-right
    i_idx = i, j_idx = j;
    while(i_idx>=0 && j_idx<8){
        if(i_idx!=i && j_idx!=j) moves.push([i_idx, j_idx]);
        if((i_idx!=i && j_idx!=j) && env[i_idx][j_idx]!=''){
            if(currentPiece[0]==env[i_idx][j_idx][0]){
                moves.pop();
            }
            break;
        }
        i_idx-=1; j_idx+=1;
    }
    //up-left
    i_idx = i, j_idx = j;
    while(i_idx>=0 && j_idx>=0){
        if(i_idx!=i && j_idx!=j) moves.push([i_idx, j_idx]);
        if((i_idx!=i && j_idx!=j) && env[i_idx][j_idx]!=''){
            if(currentPiece[0]==env[i_idx][j_idx][0]){
                moves.pop();
            }
            break;
        }
        i_idx-=1; j_idx-=1;
    }

    //down-left
    i_idx = i, j_idx = j;
    while(i_idx<8 && j_idx>=0){
        if(i_idx!=i && j_idx!=j) moves.push([i_idx, j_idx]);
        if((i_idx!=i && j_idx!=j) && env[i_idx][j_idx]!=''){
            if(currentPiece[0]==env[i_idx][j_idx][0]){
                moves.pop();
            }
            break;
        }
        i_idx+=1; j_idx-=1;
    }

    //down-right
    i_idx = i, j_idx = j;
    while(i_idx<8 && j_idx<8){
        if(i_idx!=i && j_idx!=j) moves.push([i_idx, j_idx]);
        if((i_idx!=i && j_idx!=j) && env[i_idx][j_idx]!=''){
            if(currentPiece[0]==env[i_idx][j_idx][0]){
                moves.pop();
            }
            break;
        }
        i_idx+=1; j_idx+=1;
    }
    return moves;
}

function getKingMoves(i,j){
    var moves = [];
    let currentPiece = env[i][j];
    //down
    if(i+1<8 && j>=0 && currentPiece[0]!=env[i+1][j][0]){
        moves.push([i+1,j]);
    }
    //up
    if(i-1>=0 && j>=0 && currentPiece[0]!=env[i-1][j][0]){
        moves.push([i-1,j]);
    }
    //down-right
    if(i+1<8 && j+1<8 && currentPiece[0]!=env[i+1][j+1][0]){
        moves.push([i+1,j+1]);
    }
    //top-left
    if(i-1>=0 && j-1>=0 && currentPiece[0]!=env[i-1][j-1][0]){
        moves.push([i-1,j-1]);
    }
    //down-left
    if(i+1<8 && j-1>=0 && currentPiece[0]!=env[i+1][j-1][0]){
        moves.push([i+1,j-1]);
    }
    //left
    if(i<8 && j-1>=0 && currentPiece[0]!=env[i][j-1][0]){
        moves.push([i,j-1]);
    }
    //right
    if(i<8 && j+1<8 && currentPiece[0]!=env[i][j+1][0]){
        moves.push([i,j+1]);
    }
    //top-right
    if(i-1>=0 && j+1<8 && currentPiece[0]!=env[i-1][j+1][0]){
        moves.push([i-1,j+1]);
    }
    return moves;
}
/******************************************************************/