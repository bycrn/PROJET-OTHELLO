

let blackBackground = document.getElementById("blackBackground");
let boardLayer ;
let scoreLabel;
let canMoveLayer;

const GAP = 3;
const CELL_WIDTH = 65;

let turn = 1;
let gameOver = false;

let tokens = [
    [0,0,0,0,0,0,0,0], //1
    [0,0,0,0,0,0,0,0], //2
    [0,0,0,0,0,0,0,0], //3
    [0,0,0,2,1,0,0,0], //4
    [0,0,0,1,2,0,0,0], //5
    [0,0,0,0,0,0,0,0], //6
    [0,0,0,0,0,0,0,0], //7
    [0,0,0,0,0,0,0,0]  //8
]


window.onload=function()
{   
    canMoveLayer = document.getElementById("canMoveLayer");
    scoreLabel = document.getElementById("score");
    blackBackground = document.getElementById("blackBackground");
    boardLayer = document.getElementById("boardLayer");
    blackBackground.style.width = CELL_WIDTH * 8 + (GAP*9);
    blackBackground.style.height = CELL_WIDTH * 8 + (GAP*9);
    drawGreenSquares();
    drawToken();
    drawCanMoveLayer();

}

function drawGreenSquares(){
    for (let row = 0; row < 8; row++){
        for (let column = 0; column < 8; column++){

            let greenSquare = document.createElement("div")
            greenSquare.style.position ="absolute";
            greenSquare.style.width = CELL_WIDTH;
            greenSquare.style.height = CELL_WIDTH;
            greenSquare.style.backgroundColor = "green";
            greenSquare.style.left = (CELL_WIDTH + GAP) * column + GAP;
            greenSquare.style.top = (CELL_WIDTH + GAP) * row + GAP;
            greenSquare.setAttribute("onClick", "clickedSquare("+row+", "+column+")");

            blackBackground.appendChild(greenSquare);
        }
    }
}



function drawToken() {
    if (!boardLayer) {
        console.error("boardLayer is null or undefined");
        return;
      }
    for (let row = 0; row < 8; row++){
        for (let column = 0; column < 8; column++){
            let valueToken = tokens[row][column];
            if (valueToken == 0){

            }
            else{
                let token = document.createElement("div")
                token.style.position ="absolute";
                token.style.width = CELL_WIDTH-4;
                token.style.height = CELL_WIDTH-4;
                token.style.borderRadius = "50%";
                token.style.left = (CELL_WIDTH + GAP) * column + GAP+2;
                token.style.top = (CELL_WIDTH + GAP) * row + GAP+2;
                // solid color
                if (valueToken == 1){
                    token.style.backgroundColor = "black";
                }
                if (valueToken == 2){
                    token.style.backgroundColor = "white";
                } 
                boardLayer.appendChild(token);
                
            }
        }
    }
}

function drawCanMoveLayer() {

    canMoveLayer.innerHTML = "";
    for (let row = 0; row < 8; row++){
        for (let column = 0; column < 8; column++){
            let valueToken = tokens[row][column];
            if (valueToken == 0 && canClickSpot(turn, row, column)){
                let outLine = document.createElement("div")
                outLine.style.position ="absolute";
                outLine.style.width = CELL_WIDTH-8;
                outLine.style.height = CELL_WIDTH-8;
                outLine.style.borderRadius = "50%";
                outLine.style.left = (CELL_WIDTH + GAP) * column + GAP+2;
                outLine.style.top = (CELL_WIDTH + GAP) * row + GAP+2;
                outLine.style.zIndex = 2;
                outLine.setAttribute("onClick", "clickedSquare("+row+", "+column+")");
                if (turn == 1){
                    outLine.style.border = "2px solid black";
                }
                if (turn == 2){
                    outLine.style.border = "2px solid white";
                } 
                canMoveLayer.appendChild(outLine);
            }
        }
    }
}


function canMove(id){
    for (let row = 0; row < 8; row++){
        for (let column = 0; column < 8; column++)
        {
            if (canClickSpot(id, row, column)){return true;}   
        }
    }   
    return false;
}

function clickedSquare(row,column) {

    if (gameOver) return;
    /* Si le joueur à le droit de cliquer, 
        on flip tous les pions affectés 
    else 
        return
    */

   if ( tokens[row][column] != 0 ){
        return;
   }
   
   if (canClickSpot(turn, row,column)) {
    let affectedTokens = getAffectedTokens(turn, row,column);
    flipTokens(affectedTokens);

    tokens[row][column] = turn;
    if (turn == 1 && canMove(2)){turn = 2;}
    else if (turn == 2 && canMove(1)){turn = 1;}
    if (canMove(1) == false && canMove(2) == false){
        alert("Game Over");
        gameOver = true;
    }
    drawToken();
    drawCanMoveLayer();
    reDrawScore();
   }
}


function reDrawScore(){
    let ones = 0;
    let twos = 0;

    for (let row = 0; row < 8; row++){
        for (let column = 0; column < 8; column++)
        {
            let valueToken = tokens[row][column];
            if (valueToken == 1){ ones +=1;}
            else if (valueToken==2){twos +=1;}
        }
    }    
    scoreLabel.innerHTML = "Black: " + ones + "White: " + twos;
}

function  canClickSpot(id, row,column){
    /* 
    if the number of affected discs by clicking at this post would be 0 
        Return FALSE 
    otherwise 
        Return true
    */
   let affectedTokens = getAffectedTokens(id, row, column);
   if (affectedTokens.length == 0) {return false;}
   else {return true;}

}

function getAffectedTokens(playerID, row, col) {
    var affectedTokens = [];
    const opponentID = playerID === 1 ? 2 : 1;
  
    // Check the 8 directions around the placed disk
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) {
          continue; // skip the current position
        }
  
        let x = row + dx;
        let y = col + dy;
        let disksToFlip = [];
  
        // Keep moving in the current direction until we hit a boundary or an empty space
        while (x >= 0 && x < 8 && y >= 0 && y < 8 && tokens[x][y] === opponentID) {

            // If we hit a disk of the current player, add all the disks in the current direction to the affectedTokens array
            let tokenLocation = {
                row : x,
                column : y
            }; 
            disksToFlip.push(tokenLocation);
            x += dx;
            y += dy;
            
            if (x >= 0 && x < 8 && y >= 0 && y < 8 && tokens[x][y] === playerID) {   
                affectedTokens = affectedTokens.concat(disksToFlip);
                break;
            }   
        } 
      }
    }
    return affectedTokens;
}


function  flipTokens(affectedTokens){
     /*
    for all the items in the list: affectedTokens:
        if the token at that has spot as value 
          make it a 2
        else 
          make it a 1
    */
   for (let i = 0; i < affectedTokens.length; i++){
    let spot = affectedTokens[i];
    if (tokens[spot.row][spot.column] == 1){
        tokens[spot.row][spot.column] = 2;
    } else {
        tokens[spot.row][spot.column] = 1;
    }
 }
    
}
