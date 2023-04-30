

export function gameOver(board) {
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


export class ComputerPlayer {
  constructor(depth) {
      this.depth = depth;
    }

    getGridCopy(board){
      var newBoard = JSON.parse(JSON.stringify(board))
      return newBoard
    }
  
    getBestMove(player, board) {
      var gridCopy = this.getGridCopy(board);
      let bestMove = null;
      let bestScore = -Infinity;
      let alpha = -Infinity;
      let beta = Infinity;
      
      console.log(gridCopy)
      // Generate all possible moves for the current player
      const moves = this.generateMoves(gridCopy, player);
      console.log(moves)
      
      
      // Evaluate each move using the Minimax algorithm with Alpha-Beta pruning
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        
        // Make a copy of the board and apply the move
        const newBoard = this.applyMove(gridCopy, player, move.x, move.y);
        
        // Evaluate the move using the Minimax algorithm with Alpha-Beta pruning
        const score = this.minimax(newBoard, player, this.depth - 1, alpha, beta, false);
        console.log(score)
        
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
      console.log(bestMove)
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
      
                let x = row + i;
                let y = col + j;
                let foundOpponent = false;
      
                while (x >= 0 && x < 8 && y >= 0 && y < 8) {
                  if (boards[x][y] === 0) {
                    break;
                  }
      
                  if (boards[x][y] === player) {
                    if (foundOpponent) {
                      moves.push({x: row, y: col});
                    }
                    break;
                  }
      
                  foundOpponent = true;
                  x += i;
                  y += j;
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
          var x = availableMoves[i].x;
          var y = availableMoves[i].y;
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
