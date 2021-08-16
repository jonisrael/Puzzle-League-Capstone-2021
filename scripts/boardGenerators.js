// function makeOpeningBoard(index) {
//   console.log(`Board Index Selected: ${index}`);
//   mute = 0;
//   playMusic(mute);
//   cursor.x = 2;
//   cursor.y = 6;
//   disableRaise = false;
//   level = 1;
//   speedGameSetting = speedValues[level];
//   clearGameSetting = clearValues[level];
//   stallGameSetting = stallValues[level];
//   frames = minutes = seconds = 0;
//   score = 0;
//   pause = 0;
//   gameOver = false;
//   board = [];
//   for (let c = 0; c < COLS; c++) {
//     board.push([]);
//     for (let r = 0; r < ROWS + 2; r++) {
//       let block = new Block(
//         c,
//         r,
//         database[index][c][r].color,
//         database[index][c][r].type
//       );
//       board[c].push(block);
//       block.draw(ctx);
//     }
//   }
//   return board;
// }

// function generateOpeningBoard() {
//   cursor.x = 2;
//   cursor.y = 6;

//   mute = 0;
//   playMusic(mute);
//   board = [];
//   disableRaise = false;
//   level = 1;
//   speedGameSetting = speedValues[level];
//   clearGameSetting = clearValues[level];
//   stallGameSetting = stallValues[level];
//   frames = minutes = seconds = 0;
//   score = 0;
//   pause = 0;
//   gameOver = false;
//   for (let c = 0; c < COLS; c++) {
//     board.push([]);
//     for (let r = 0; r < ROWS + 2; r++) {
//       let block = new Block(c, r, VACANT, NORMAL, 0);
//       board[c].push(block);
//       if (r > 11) {
//         board[c][r].color = PIECES[randInt(PIECES.length)];
//         board[c][r].type = DARK;
//       }
//       block.draw(ctx);
//     }
//   }

//   for (let i = 0; i < 30; i++) {
//     // Generate 30 random blocks on bottom 6 rows.
//     while (true) {
//       let x = randInt(COLS);
//       let y = randInt(ROWS / 2) + 6;
//       if (board[x][y].color == VACANT) {
//         board[x][y].color = PIECES[randInt(PIECES.length)];
//         break;
//       }
//     }
//   }

//   for (let c = 0; c < COLS; c++) {
//     // Drop all blocks to bottom
//     let currentBlocks = []; // Temporary
//     for (let r = ROWS - 1; r >= 0; r--) {
//       if (board[c][r].color != VACANT) {
//         currentBlocks.unshift(board[c][r].color);
//       }
//     }
//     while (currentBlocks.length < 12) {
//       currentBlocks.unshift(VACANT);
//     }

//     for (let r = 0; r < currentBlocks.length; r++) {
//       board[c][r].color = currentBlocks[r];
//     }
//   }

//   for (let x = 0; x < COLS; x++) {
//     // Correct Duplicates so blocks of same color cannot be adjacent
//     for (let y = 0; y < ROWS; y++) {
//       if (board[x][y].color != VACANT) {
//         let topBlock = VACANT;
//         let rightBlock = VACANT;
//         let bottomBlock = VACANT;
//         let leftBlock = VACANT;
//         if (y != 0) {
//           topBlock = board[x][y - 1].color;
//         }
//         if (x != 5) {
//           rightBlock = board[x + 1][y].color;
//         }
//         if (y != 11) {
//           bottomBlock = board[x][y + 1].color;
//         }
//         if (x != 0) {
//           leftBlock = board[x - 1][y].color;
//         }

//         while (true) {
//           if (
//             board[x][y].color != topBlock &&
//             board[x][y].color != rightBlock &&
//             board[x][y].color != bottomBlock &&
//             board[x][y].color != leftBlock
//           ) {
//             break;
//           }
//           board[x][y].color = PIECES[randInt(PIECES.length)];
//         }
//       }
//       board[x][y].draw(ctx);
//     }
//   }

//   for (let x = 0; x < COLS; x++) {
//     // Initial Dark Stacks
//     board[x][12].color = PIECES[randInt(PIECES.length)];
//     board[x][13].color = PIECES[randInt(PIECES.length)];
//     if (x > 0) {
//       while (board[x][12].color == board[x - 1][12].color) {
//         board[x][12].color = PIECES[randInt(PIECES.length)];
//       }
//       while (board[x][13].color == board[x - 1][13].color) {
//         board[x][13].color = PIECES[randInt(PIECES.length)];
//       }
//     }
//   }
//   fixNextDarkStack(board);
//   return board;
// }

// export { generateOpeningBoard, makeOpeningBoard as default };
