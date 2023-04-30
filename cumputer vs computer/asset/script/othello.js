

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

console.log(tokens)

function gameOver(board) {
  let blackCount = 0;
  let whiteCount = 0;
  let emptyCount = 0;

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 1) {
        blackCount++;
      } else if (board[i][j] === 2) {
        whiteCount++;
      } else {
        emptyCount++;
      }
    }
  }

  if (emptyCount === 0) {
    if (blackCount > whiteCount) {
      alert("Black wins!");
      return true
    } else if (whiteCount > blackCount) {
      alert("White wins!");
      return true
    } else {
      alert("It's a tie!");
      return true

    }
  } else if (blackCount === 0) {
    return "White wins!";
  } else if (whiteCount === 0) {
    return "Black wins!";
  } else {
    return false;
  }
}


class ComputerPlayer {
    constructor(depth) {
      this.depth = depth;
      this.grid = JSON.parse(JSON.stringify(tokens))
    }

    updateGrid(){
      this.grid = JSON.parse(JSON.stringify(tokens))
      console.log(this.grid)
      return this.grid
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
        const newBoard = this.applyMove(board, player, move.x, move.y);
        
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
    
    generateMoves(boards, player) {
        const moves = [];
      
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            if (boards[row][col] !== 0) {
              continue;
            }
      
            for (let i = -1; i <= 1; i++) {
              for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) {
                  continue;
                }
      
                let x = col + j;
                let y = row + i;
                let foundOpponent = false;
      
                while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                  if (boards[y][x] === 0) {
                    break;
                  }
      
                  if (boards[y][x] === player) {
                    if (foundOpponent) {
                      moves.push({x: col, y: row});
                    }
                    break;
                  }
      
                  foundOpponent = true;
                  x += j;
                  y += i;
                }
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
      return newBoard

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
        return this.evaluateBoard(board, player);
      }
      
      if (isMaximizingPlayer) {
        // Maximize the score for the current player
        let maxEval = -Infinity;
        const availableMoves = this.generateMoves(board, player);
    
        for (let i = 0; i < availableMoves.length; i++) {
          var x = availableMoves[i].x;
          var y = availableMoves[i].y;
          console.log('x,y', x, y)
          const newBoard = this.applyMove(board, player, x, y);
          const evaluation = this.minimax(newBoard, player, depth - 1, alpha, beta, false);
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
    
        const availableMoves = this.generateMoves(board, opponent);

        for (let i = 0; i < availableMoves.length; i++) {
          console.log(availableMoves[i])
          var x = availableMoves[i].x;
          var y = availableMoves[i].y;
          console.log('x,y', x, y)
          const newBoard = this.applyMove(board, opponent, x, y);
          const evaluation = this.minimax(newBoard, player, depth - 1, alpha, beta, true);
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

// Create a new instance of the `ComputerPlayer` class with a depth of 5
const computer = new ComputerPlayer(4);

// Generate a move for player 1 (represented by the value 1 in the grid)
const move = computer.getBestMove(1);

console.log(`Computer's move: row ${move.x}, column ${move.y}`);
