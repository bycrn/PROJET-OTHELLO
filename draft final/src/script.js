import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui';
import TWEEN from '@tweenjs/tween.js'

/**
 * Variable Declaration
 */

const colors = {
  color1 : 0x203e14,
  color2 : 0x5db53b,
  white :  0xede0f5,
  black :  0x292929,
  light : 'skyblue',
  light2 : 0x256709,
  light3 : 0x0d5173
}

let score = {
  black : 0,
  white : 0
}

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

let gameOver = false;
var mouse, raycaster;

// Canvas
const canvas = document.querySelector('canvas.webgl')
var scene = new THREE.Scene();
var gui = new dat.GUI()



/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(colors.light, 1.5);
// // Add the light to the scene
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(colors.light3, 0.2, 100)
pointLight1.position.set(5, 10, 5);
scene.add(pointLight1)

const pointLight = new THREE.PointLight(colors.light2, 0.6,100)
pointLight.position.x = -5
pointLight.position.y = 6
pointLight.position.z = 0
scene.add(pointLight)

/**
 * Textures
 */
// const textureLoader = new THREE.TextureLoader()

/**
 * Fonts
 */
var textScore = document.getElementById('score')
  

/**
 * Board creation 
 *      cubes and disks
 */

var diskGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.05);
var blackMaterial = new THREE.MeshStandardMaterial({ color: colors.black });
blackMaterial.roughness = 0.1
var whiteMaterial = new THREE.MeshStandardMaterial({ color: colors.white });
whiteMaterial.roughness = 0.1
const cubeGeometry = new THREE.BoxGeometry(1, 0.2, 1);



class Board {
  constructor() {
    // group creation
    this.board = new THREE.Group();
    this.boardChunk = new THREE.Group();
    this.disks = new THREE.Group();
    
    //Creation of tokens
    
    this.currentPlayer = 2;
    this.gridLogic = [
      [0,0,0,0,0,0,0,0], //1
      [0,0,0,0,0,0,0,0], //2
      [0,0,0,0,0,0,0,0], //3
      [0,0,0,0,0,0,0,0], //4
      [0,0,0,0,0,0,0,0], //5
      [0,0,0,0,0,0,0,0], //6
      [0,0,0,0,0,0,0,0], //7
      [0,0,0,0,0,0,0,0]  //8
    ];

    this._createBoard();
    this._createInitialDisks();
    this.board.rotation.z = Math.PI
    this.board.position.set(-1,0,0)
    this.board.add(this.boardChunk, this.disks)
    
  }

  /**
 * Board Creation
 */

  _createBoard() 
  {
    let i = 0;
    // Create saqure for the platform
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) { 
        let cube;
        var lightGreen =  new THREE.MeshStandardMaterial({color: colors.color2})
        var darkGreen =  new THREE.MeshStandardMaterial({color: colors.color1})
        lightGreen.roughness = 0.1
        darkGreen.roughness = 0.1
        if (column % 2 == 0) 
        {
          cube = new THREE.Mesh(cubeGeometry, row % 2 == 0 ? lightGreen : darkGreen);
        }
        else 
        {
          cube = new THREE.Mesh(cubeGeometry, row % 2 == 0 ? darkGreen : lightGreen);
        }
      cube.userData.idnum = i;
      i++;
      cube.position.set(row, 0, column);
      this.boardChunk.add(cube);
      }
      
    }
  }    


  // setter

  setCurrentTurn() 
  {
    if (this.currentPlayer === 1) this.currentPlayer = 2;
    else this.currentPlayer = 1;
    
  }
  setgridLogic(row, column, currentPlayer){
    this.gridLogic[row][column] = currentPlayer
  }
  // getter

  getgridLogic(row,column){
    return this.gridLogic[row][column];
  }

  /**
 * Jeton Loading
 */

  _createInitialDisks() 
  {
    this.placeDisk(3, 3);
    this.placeDisk(3, 4);
    this.placeDisk(4, 4);
    this.placeDisk(4, 3);
    this.setCurrentTurn()
  }

  placeDisk(row, column) {
    // console.log(row,column)
    if (this.getgridLogic(row, column) === 0) {

      const createADisk = (turn) => {
        const disk = new THREE.Group();
        const whiteDisk = new THREE.Mesh(diskGeometry, whiteMaterial);
        const blackDisk = new THREE.Mesh(diskGeometry, blackMaterial);
        if (turn === 1) {
          whiteDisk.position.y = 0
          blackDisk.position.y = 0.05
        } else {
          blackDisk.position.y = 0
          whiteDisk.position.y = 0.05
        }
        disk.add(blackDisk, whiteDisk)
        return disk
      }
  
      const disk = createADisk(this.currentPlayer)
      disk.position.set(row, -0.15, column);
      disk.rotation.z = Math.PI
  
      this.setgridLogic(row, column, this.currentPlayer)
      this.disks.add(disk)
      this.setCurrentTurn()
    } else {
      console.error('already a disk in this spot!!!')
    }
    // console.log(this.gridLogic)
    
  }
  

  foundChild(row, column) {
    if (this.getgridLogic(row, column)!= 0)
    {
      var childToFind = null;
      for (var i = 0; i < this.disks.children.length; i++) 
      {
        var child = this.disks.children[i];

        if (child.position.x === row && child.position.z === column) {
          childToFind = child;
        }
      } 
      return childToFind;
    } else console.error('No disk placed to found')
    
}

  foundSpot(row, column){
    if (this.getgridLogic(row, column) === 0)
    {
      var childToFind = null;
      for (var i = 0; i < this.boardChunk.children.length; i++) 
      {
        var child = this.boardChunk.children[i];

        if (child.position.x === row && child.position.z === column) {
          childToFind = child;
        }
      } 
      return childToFind;
    } else console.error('Spot used')
    
  }

  // Changer la couleur d'une case de la plateforme de jeu


  ResetBoardColor(){
    for (let row = 0; row < 8; row++){
      for (let column = 0; column < 8; column++)
      { 
        var cellIndex = row + column * 8 
        if (column % 2 ===0) {
 
          this.boardChunk.children[cellIndex].material
          .color.set(row % 2 == 0 ? colors.color2 : colors.color1)
        }
        else {
          this.boardChunk.children[cellIndex].material
          .color.set(row % 2 == 0 ? colors.color1 : colors.color2)
        }    
      }
    }
  }


}

 
class ComputerPlayer {
    constructor(depth) {
      this.depth = depth;
      this.grid = JSON.parse(JSON.stringify(othelloBoard.gridLogic))
    }

    updateGrid(){
      this.grid = JSON.parse(JSON.stringify(othelloBoard.gridLogic))
      console.log(this.grid)
    }
  
    getBestMove(player) {
      var board = this.updateGrid();
      let bestMove = null;
      let bestScore = -Infinity;
      let alpha = -Infinity;
      let beta = Infinity;
      
      // Generate all possible moves for the current player
      const moves = this.generateMoves(board, player);
      
      // Evaluate each move using the Minimax algorithm with Alpha-Beta pruning
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        
        // Make a copy of the board and apply the move
        const newBoard = this.applyMove(this.board, player, move.x, move.y);
        
        // Evaluate the move using the Minimax algorithm with Alpha-Beta pruning
        const score = this.minimax(newBoard, player, this.depth - 1, alpha, beta, false);
        
        // Update the best move and best score
        if (score > bestScore) {
          bestMove = move;
          bestScore = score;
        }
        
        // Update alpha for Alpha-Beta pruning
        alpha = Math.max(alpha, bestScore);
        
        // Prune the search if beta <= alpha
        if (beta <= alpha) {
          break;
        }
      }
      
      // Return the best move
      return bestMove;
    }
    
    generateMoves(board, player) {
      // TODO: Implement a function to generate all possible moves for the current player
          const moves = [];

      // Loop through each position on the board
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (board[row][col] === 0) { // If the position is empty
            // Check if the move is valid
            if (isValidMove(board, player, row, col)) {
              // Add the move to the list of available moves
              moves.push({ row, col });
            }
          }
        }
      }

      return moves;
    }
    
    applyMove(board, player, x, y) {
      // TODO: Implement a function to make a copy of the board and apply the move
      var newBoard = JSON.parse(JSON.stringify(board))
      newBoard[x][y] = player

    }
    
    evaluateBoard(board, player) {
      // TODO: Implement a function to evaluate the score of the board for the current player
      var playerScore = 0;

      for (let row = 0; row < 8; row++) {
        for (let column = 0; column < 8; column++) {
          const result = board[row][column]
          if (result === player) {playerScore++}
        }
      }
      return playerScore;
    }

    
    minimax(board, player, depth, alpha, beta, isMaximizingPlayer) {
      // TODO: Implement the Minimax algorithm with Alpha-Beta pruning
       // Check if the game is over or if we reached the maximum depth
      if (depth === 0 || gameOver(board)) {
        return evaluateBoard(board, player);
      }
      
      if (isMaximizingPlayer) {
        // Maximize the score for the current player
        let maxEval = -Infinity;
        const availableMoves = generateMoves(board, player);
    
        for (let i = 0; i < availableMoves.length; i++) {
          const [x, y] = availableMoves[i];
          const newBoard = applyMove(board, player, x, y);
          const evaluation = minimax(newBoard, player, depth - 1, alpha, beta, false);
          maxEval = Math.max(maxEval, evaluation);
          alpha = Math.max(alpha, evaluation);
    
          if (beta <= alpha) {
            break; // Beta cut-off
          }
        }
        return maxEval;
      } else {
        // Minimize the score for the opponent player
        let minEval = Infinity;
        const opponent = 3 - player; // Assuming the players are labeled as 1 and 2
    
        const availableMoves = generateMoves(board, opponent);
        for (let i = 0; i < availableMoves.length; i++) {
          const [x, y] = availableMoves[i];
          const newBoard = applyMove(board, opponent, x, y);
          const evaluation = minimax(newBoard, player, depth - 1, alpha, beta, true);
          minEval = Math.min(minEval, evaluation);
          beta = Math.min(beta, evaluation);
    
          if (beta <= alpha) {
            break; // Alpha cut-off
          }
        }
    
        return minEval;
      }
    } 
}

  




/**
 * Initialize board
 */

var othelloBoard = new Board();
scene.add(othelloBoard.board);
var computer = new ComputerPlayer()
console.log(computer.gridObject)

// console.log('a', othelloBoard.foundSpot(0,0))
// console.log(othelloBoard.foundChild(x,y))
/**
 * Axes Creation
 */

// const axesHelper = new THREE.AxesHelper(5);
// axesHelper.position.set(-4.5,0,3.5)
// axesHelper.rotation.y = Math.PI
// scene.add( axesHelper );



/**
 * Function interaction board
 */

// To changes cube color
// need to add in the game later
// othelloBoard.board.children[0].children[0].material.color.set('red')

// othelloBoard.changeCellColor(0+3, 0+3, 0xff0000);

function addClickListenerToBoard(othelloBoard, camera, onSquareClick) {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
  function onClick(event) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(othelloBoard.boardChunk.children, true);
    // intersects[0].object.material.color.set('hotpink')

    if (intersects.length > 0) {
      const cellPosition = {x: intersects[0].object.position.x, z: intersects[0].object.position.z};
      onSquareClick(cellPosition.x, cellPosition.z);
    }
  }

  canvas.addEventListener('click', onClick);

}





/**
 * Fonctionnalité jeu
 */


function changeCellColor(row, column) 
{ 
  // Calculate the index of the cell in the boardChunk group
  console.log(row, column)
  const cellMesh = othelloBoard.foundSpot(row,column);
  cellMesh.material.color.set('yellow'); // Set the new color of the material
}

// function drawCanMoveLayer() {

//   canMoveLayer.innerHTML = "";
//   for (let row = 0; row < 8; row++){
//       for (let column = 0; column < 8; column++){
//           let valueToken = tokens[row][column];
//           if (valueToken == 0 && canClickSpot(turn, row, column)){
//               let outLine = document.createElement("div")
//               outLine.style.position ="absolute";
//               outLine.style.width = CELL_WIDTH-8;
//               outLine.style.height = CELL_WIDTH-8;
//               outLine.style.borderRadius = "50%";
//               outLine.style.left = (CELL_WIDTH + GAP) * column + GAP+2;
//               outLine.style.top = (CELL_WIDTH + GAP) * row + GAP+2;
//               outLine.style.zIndex = 2;
//               outLine.setAttribute("onClick", "clickedSquare("+row+", "+column+")");
//               if (turn == 1){
//                   outLine.style.border = "2px solid black";
//               }
//               if (turn == 2){
//                   outLine.style.border = "2px solid white";
//               } 
//               canMoveLayer.appendChild(outLine);
//           }
//       }
//   }
// }

function canMove(id){
  for (let row = 0; row < 8; row++){
    for (let column = 0; column < 8; column++)
    {
      if (canClickSquare(id, row, column)){return true;}   
    }
  }   
  return false;
}

// Si le joueur est autorisé à cliquer, 
// tous les jetons affectés se retournent

const onSquareClick = (row,column) => {
  if (gameOver) return;

  /* Si le joueur à le droit de cliquer, 
        on flip tous les pions affectés 
    else 
        return
    */

  if (othelloBoard.gridLogic[row][column] !== 0){
    console.log(`Clicked on cell (${row}, ${column})`);
    return;
  }

  var turn = othelloBoard.currentPlayer;
  if (canClickSquare(turn, row, column)) 
    {
      
      let affectedDisks = getAffectedDisk(turn,row,column);
      flipDisks(affectedDisks);
      
      turn = othelloBoard.currentPlayer;
      console.log(canMove(1), canMove(2))
      if (canMove(1) == false && canMove(2) == false){
        
        alert('Game Over')
        gameOver = true;
      }
      othelloBoard.placeDisk(row, column);
      // drawCanMoveLayer()
      setScore(score)
      computer.updateGrid()
    }
  }

  // const textScore = document.getElementById('score')
  

  function setScore(score) {
    score.black = 0; score.white = 0;

    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        const result = othelloBoard.getgridLogic(row, column)
  
        if (result === 1) {
          score.black++
        } else if (result === 2) {
          score.white++
        }
      }
    }
    textScore.innerHTML = 'Black :&nbsp;&nbsp;' + score.black + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;White :&nbsp;&nbsp;' + score.white
  
  }


function canClickSquare(id, row,column){
  /* 
    if the number of affected discs by clicking at this post would be 0 
        Return FALSE 
    otherwise 
        Return true
    */

  var affectedDisks = getAffectedDisk(id, row, column);
  if (affectedDisks.length == 0) {return false;}
  else {return true;}
}



function getAffectedDisk(id, row,column){
  var affectedTokens = []
    // from current spot;
    // for all eight directions. (left right up down and 4 diagoals)
    // move along in deriction until your reach a blank or your own color
    // (keeping track of all the opposite color locations along the way)
    // if the terminal tile is your own color
    //   add those locations to the list that will be returned
    // return the list of affected tokens

    //to the right
    let couldBeAffected = [];
    let columnIterator = column;
    while (columnIterator < 7){
        columnIterator += 1;
        var valueAtSpot  = othelloBoard.getgridLogic(row, columnIterator);
        if (valueAtSpot == 0 || valueAtSpot == id){
            if (valueAtSpot == id){
                affectedTokens = affectedTokens.concat(couldBeAffected);
            }
            break;
        }
        else {
            let tokenLocation = {
                row : row,
                column : columnIterator
            };
            couldBeAffected.push(tokenLocation);
        }
    }

    couldBeAffected = [];
    columnIterator = column;
    // to the left
    while (columnIterator > 0){
      columnIterator -= 1;
      var valueAtSpot = othelloBoard.getgridLogic(row, columnIterator);
      if (valueAtSpot == 0 || valueAtSpot == id){
          if (valueAtSpot == id){
              affectedTokens = affectedTokens.concat(couldBeAffected);
          }
          break;
      }
      else {
          let tokenLocation = {
              row : row,
              column : columnIterator
          };
          couldBeAffected.push(tokenLocation);
      }
  }


    couldBeAffected = [];
    let rowIterator = row;
    
    // above
    while (rowIterator > 0){
      rowIterator -= 1;
      var valueAtSpot  = othelloBoard.getgridLogic(rowIterator, column);
      if (valueAtSpot == 0 || valueAtSpot == id)
      {
        if (valueAtSpot == id)
        {
          affectedTokens = affectedTokens.concat(couldBeAffected);
        }break;
      }
      else 
      {
        let tokenLocation =
        {
            row : rowIterator,
              column : column
        };
        couldBeAffected.push(tokenLocation);
      }
  }

    couldBeAffected = [];
    rowIterator = row;
    
    // below

    while (rowIterator < 7){
      rowIterator += 1;
      var valueAtSpot  = othelloBoard.getgridLogic(rowIterator, column);
      if (valueAtSpot == 0 || valueAtSpot == id)
      {
        if (valueAtSpot == id)
        {
          affectedTokens = affectedTokens.concat(couldBeAffected);
        }break;
      }
      else 
      {
        let tokenLocation =
        {
            row : rowIterator,
              column : column
        };
        couldBeAffected.push(tokenLocation);
      }
  }


    // down right
    couldBeAffected = [];
    rowIterator = row;
    columnIterator = column;

    while (rowIterator < 7  && columnIterator < 7){
      rowIterator += 1;
      columnIterator += 1;
      var valueAtSpot  = othelloBoard.getgridLogic(rowIterator, columnIterator);
      if (valueAtSpot == 0 || valueAtSpot == id)
      {
        if (valueAtSpot == id)
        {
          affectedTokens = affectedTokens.concat(couldBeAffected);
        }break;
      }
      else 
      {
        let tokenLocation =
        {
            row : rowIterator,
              column : columnIterator
        };
        couldBeAffected.push(tokenLocation);
      }
  }

  // down left
  couldBeAffected = [];
  rowIterator = row;
  columnIterator = column;

    while (rowIterator > 0 && columnIterator > 0){
      rowIterator -= 1;
      columnIterator -= 1;
      var valueAtSpot  = othelloBoard.getgridLogic(rowIterator, columnIterator);
      if (valueAtSpot == 0 || valueAtSpot == id)
      {
        if (valueAtSpot == id)
        {
          affectedTokens = affectedTokens.concat(couldBeAffected);
        }break;
      }
      else 
      {
        let tokenLocation =
        {
            row : rowIterator,
              column : columnIterator
        };
        couldBeAffected.push(tokenLocation);
      }
  }

  // up to the right 
  couldBeAffected = [];
  rowIterator = row;
  columnIterator = column;

    while (rowIterator > 0 && columnIterator < 7){
      rowIterator -= 1;
      columnIterator += 1;
      var valueAtSpot  = othelloBoard.getgridLogic(rowIterator, columnIterator);
      if (valueAtSpot == 0 || valueAtSpot == id)
      {
        if (valueAtSpot == id)
        {
          affectedTokens = affectedTokens.concat(couldBeAffected);
        }break;
      }
      else 
      {
        let tokenLocation =
        {
            row : rowIterator,
              column : columnIterator
        };
        couldBeAffected.push(tokenLocation);
      }
  }

  // up to the left 
  couldBeAffected = [];
    rowIterator = row;
    columnIterator = column;

    while (rowIterator < 7 && columnIterator > 0){
      rowIterator += 1;
      columnIterator -= 1;
      var valueAtSpot  = othelloBoard.getgridLogic(rowIterator, columnIterator);
      if (valueAtSpot == 0 || valueAtSpot == id)
      {
        if (valueAtSpot == id)
        {
          affectedTokens = affectedTokens.concat(couldBeAffected);
        }break;
      }
      else 
      {
        let tokenLocation =
        {
            row : rowIterator,
              column : columnIterator
        };
        couldBeAffected.push(tokenLocation);
      }
  }

  return affectedTokens;
}


function animateRotationDisk(row, col) {
  var disk = othelloBoard.foundChild(row, col)
  disk.position.y = -0.15
  const isFlipped = disk.rotation.z !== 0;


  // Move the disk up before flipping
  const upAnimation = new TWEEN.Tween(disk.position)
    .to({
      y: disk.position.y - 0.9,
    }, 250)
    .easing(TWEEN.Easing.Quadratic.In)
    .chain(
      // Rotate the disk to simulate the flip
      new TWEEN.Tween(disk.rotation)
        .to({
          z: isFlipped ? 0 : Math.PI,
        }, 500)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onComplete(() => {
          disk.userData.isFlipped = !isFlipped;
        })
    )
    .start();

  // Move the disk back down after flipping
  new TWEEN.Tween(disk.position)
    .to({
      y: disk.position.y -0.04,
    }, 250)
    .easing(TWEEN.Easing.Quadratic.Out)
    .delay(500)
    .start();
}

 // rest of the function

// for all the items in affected lists
// if disk at spot as value 1 make it 2
// else make it 1
function flipDisks(affectedDisks){
  for (var i = 0; i < affectedDisks.length; i++){
    var spot = affectedDisks[i]
    if(othelloBoard.gridLogic[spot.row][spot.column] === 1)
    {
      othelloBoard.gridLogic[spot.row][spot.column] = 2;
    }
    else 
    { 
      othelloBoard.gridLogic[spot.row][spot.column] = 1;
    }
    animateRotationDisk(spot.row,spot.column)

    othelloBoard.foundChild(spot.row, spot.column).position.y = -0.15
  }
    
}


/**
 * Camera
 */

// Base camera
var camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.set(-5.5,9,3.5)


/**
 * To test : Console Log 
 */
// consoloe.log()

// console.log(othelloBoard.disks.children[0])
// console.log(othelloBoard.gridLogic)


/**
 * Debug
 */


class PositionGUI {
  constructor(obj, name) {
    this.obj = obj
    this.name = name
  }
  get modify() {
    return this.obj[this.name]
  }
  set modify(v) {
    this.obj[this.name] = v
  }
}

const folder = gui.addFolder('Position')
folder
  .add(new PositionGUI(camera.position, 'x'), 'modify', -20, 20)
  .name('x')
  .step(0.01)
folder
  .add(new PositionGUI(camera.position, 'y'), 'modify', -20, 20)
  .name('y')
  .step(0.01)
folder
  .add(new PositionGUI(camera.position, 'z'), 'modify', -20, 20)
  .name('z')
  .step(0.01)

const light = gui.addFolder('light')
light : {
  const color = light.addFolder('color')
  color : {
    color.addColor(pointLight1, 'color')
    .name('2'),
    color.addColor(pointLight, 'color')
    .name('1')
  }
  const intensity = light.addFolder('intensity')
  intensity : {
    intensity.add(pointLight1, 'intensity')
    .min(0)
    .max(20)
    .step(0.01)
    .name('2'),
    intensity.add(pointLight, 'intensity')
    .min(0)
    .max(20)
    .step(0.01)
    .name('1')
  }
}
const boardGui = gui.addFolder('board')
boardGui
  .add(new PositionGUI(othelloBoard.boardChunk.position, 'x')
  , 'modify'
  , -20
  , 20)
  .name('x')
  .step(0.01)
  boardGui
  .add(new PositionGUI(othelloBoard.boardChunk.position, 'y')
  , 'modify'
  , -20
  , 20)
  .name('y')
  .step(0.01)
boardGui
  .add(new PositionGUI(othelloBoard.boardChunk.position, 'z')
  , 'modify'
  , -20
  , 20)
  .name('z')
  .step(0.01)



/**
 * Sizes
 */

//prevent the resizing : native javascript

window.addEventListener('resize', () => {

  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer and canvas
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('dblclick', () =>{
  const fullscreenElement = document.fullscreenElement || document.webkitfullscreenElement
  if (!fullscreenElement){
      if(canvas.requestFullscreen)
      {
          canvas.requestFullscreen()
      }
      else if(canvas.webkitRequestFullscreen)
      {
          canvas.webkitRequestFullscreen()
      }
  }else{
      if(document.exitFullscreen)
      {
          document.exitFullscreen()
      }
      else if(document.webkitExitFullscreen)
      {
          document.webkitExitFullscreen()
      }
  }
})

addClickListenerToBoard(othelloBoard, camera, onSquareClick);



/**
 * Controls
 */
var controls = new OrbitControls(camera, canvas)
  controls.target.set(-4.5, 0, 3.5);
  controls.enableDamping = true;


/**
 * Renderer
 */

var renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)

const boxPositon = new THREE.Vector3()


/**
 * Animate
 */

function animate() {
  boxPositon.setFromMatrixPosition(othelloBoard.board.matrixWorld);
  boxPositon.project(camera);
  var rect = canvas.getBoundingClientRect()
  var widthHalf = sizes.width/4, heightHalf = sizes.height/4;
  boxPositon.x = rect.left + (boxPositon.x * widthHalf) + widthHalf;
  boxPositon.y = rect.top -(boxPositon.y * heightHalf) + heightHalf;
  textScore.style.top = `${boxPositon.y}px`;
  textScore.style.left = `${boxPositon.x}px`;


  controls.update();
  renderer.render(scene, camera);
  TWEEN.update()
  window.requestAnimationFrame(animate);
}

animate()
