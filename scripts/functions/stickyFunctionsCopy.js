// import { displayMessage } from "../..";
// import { audio } from "../fileImports";
// import {
//   game,
//   win,
//   grid,
//   touch,
//   INTERACTIVE_TYPES,
//   CLEARING_TYPES,
//   blockIsSolid,
//   blockVacOrClearing,
//   outOfRange,
//   SOLID_TYPES
// } from "../global";
// import { playAudio } from "./audioFunctions";

// let game.undefBlockString =
// '{"name": "undefinedBlock", "x": -1, "y": -1, "color": "vacant", "type": "normal"}';

// let game.undefBlock = JSON.parse(game.undefBlockString);

// export const KeySquare = {
//   Main: game.undefBlock,
//   Highest: game.undefBlock,
//   Lowest: game.undefBlock,
//   SpecialBlock: game.undefBlock
// };

// export const MatchBlocks = [game.undefBlock, game.undefBlock, game.undefBlock];

// export function sticky(x,y) {
//   let result = "";
// }

// function checkLine(x,y) {
//   let ResultingSquare = game.undefBlock
//   for (let j=y-1; j >= 0; j--) {
//     let NextSquare = game.board[x][j];
//     if (NextSquare.availForPrimaryChain || NextSquare.availForSecondaryChain) {
//       ResultingSquare = NextSquare;
//       break;
//     }
//   }
//   if (ResultingSquare !== game.undefBlock) {
//     KeySquare.Lowest = ResultingSquare;

//   }
// }

// function checkChainableBlockAbove(x,y) {
//   let ResultingSquare = game.undefBlock;
//   for (let j=y-1; j >= 0; j--) {
//     let NextSquare = game.board[x][j];
//     if (NextSquare.availForPrimaryChain || NextSquare.availForSecondaryChain && !NextSquare.touched) {
//       ResultingSquare = NextSquare;
//       break;
//     }
//   }
//   console.log("First Chainable Detected (A):", ResultingSquare);
//   return ResultingSquare;
// }

// function findFirstNonVacantBlock(x,y, dir) {
//   let ResultingSquare = game.undefBlock;
//   for (let j=y + dir; j>=0 && j<grid.ROWS; j += dir) {
//     if (game.board[c][j].color !== "vacant") {
//       ResultingSquare = game.board[c][j].type
//       break;
//     }
//   }
//   return ResultingSquare;
// }

// function checkChainableBlockBelow(x,y) {
//   let ResultingSquare = game.undefBlock;
//   for (let j=y-1; j >= 0; j--) {
//     let NextSquare = game.board[x][j];
//     if (NextSquare.availForPrimaryChain || NextSquare.availForSecondaryChain) {
//       ResultingSquare = NextSquare;
//       break;
//     }
//   }
//   console.log("First Chainable Detected (A):", ResultingSquare);
//   return ResultingSquare;
// }

// function checkChainableBlock(x,y) {
//   let [PairBlock, pair] = determinePair
// }

// export function sticky(c, r) {
//   match[0] = [c, r];
//   match[1] = [-1, -1];
//   match[2] = [-1, -1];

//   if (game.currentChain === 0) return false;

//   let MainBlock = game.board[c][r];
//   let [PairBlock, pair] = determinePair(MainBlock);
//   console.log(game.frames, PairBlock, pair);
//   let FirstBlock, SecondBlock, ThirdBlock;
//   let result = "";
//   KeySquare.First = KeySquare.Second = KeySquare.Third = JSON.parse(game.undefBlock);

//   // check above
//   while (true) {
//     if (pair === "B") [FirstBlock, SecondBlock] = [MainBlock, PairBlock];
//     else if (pair === "A") [FirstBlock, SecondBlock] = [PairBlock, MainBlock];
//     else [FirstBlock, SecondBlock] = [MainBlock, JSON.parse(game.undefBlock)];

//     KeySquare.pair = pair;
//     if (pair) {
//       let [x, y] = [SecondBlock.x, SecondBlock.y];
//       KeySquare.First = FirstBlock;
//       KeySquare.Second = SecondBlock;
//       KeySquare.Lowest = firstVacantOrClearingBlockAbove(x, y);
//       if (KeySquare.Lowest.x === -1) break;
//       KeySquare.Highest = findSolidBlockAbove(x, y);
//       playAudio(audio.announcer1);
//       if (KeySquare.Highest.x === -1) break;
//       ThirdBlock = game.board[x][KeySquare.Highest.y - 1];
//       if (!isSolidPair(FirstBlock, ThirdBlock)) break;
//       KeySquare.Third = ThirdBlock;
//       match[2] = [ThirdBlock.x, ThirdBlock.y];
//       result = "Pair |A| Abv1";
//     } else {
//       let [x, y] = [FirstBlock.x, FirstBlock.y];
//       KeySquare.First = FirstBlock;
//       KeySquare.Lowest = firstVacantOrClearingBlockAbove(x, y);
//       if (KeySquare.Lowest.x === -1) break; // no clear line detected above
//       playAudio(audio.announcer2);
//       KeySquare.Highest = lastVacantOrClearingBlockAbove(FirstBlock);
//       if (KeySquare.Highest.x === -1) break; // no block detected past clear line
//       SecondBlock = game.board[x][KeySquare.Highest.y - 1];
//       if (!isSolidPair(FirstBlock, SecondBlock)) break;
//       KeySquare.Second = SecondBlock;
//       match[1] = [SecondBlock.x, SecondBlock.y];
//       ThirdBlock = findSolidBlockAbove(SecondBlock.x, SecondBlock.y - 1);
//       if (!isSolidPair(FirstBlock, ThirdBlock)) break;
//       KeySquare.Third = ThirdBlock;
//       match[2] = [ThirdBlock.x, ThirdBlock.y];
//       result = "Main |A| Abv1 Abv2";
//       return result;
//     }
//     break;
//   }

//   // // check left and right
//   // for (let dir = -1; dir <= 1; dir += 2) {
//   //   while (true) {
//   //     if ((pair === "L" && dir === -1) || (pair === "R" && dir === 1))
//   //       [FirstBlock, SecondBlock] = [MainBlock, PairBlock];
//   //     else if ((pair === "L" && dir === 1) || (pair === "R" && dir === -1))
//   //       [FirstBlock, SecondBlock] = [PairBlock, MainBlock];
//   //     else [FirstBlock, SecondBlock] = [MainBlock, game.undefBlock];

//   //     if (pair) {
//   //       let [x, y] = [SecondBlock.x, SecondBlock.y];
//   //       KeySquare.Lowest = checkSolidGround(x + dir, y);
//   //       if (KeySquare.Lowest.x === -1) break;
//   //       KeySquare.Highest = lastVacantOrClearingBlockAbove(x, y);
//   //       if (KeySquare.Highest.x === -1) break;
//   //       ThirdBlock = game.board[x][KeySquare.Highest.y - 1];
//   //       if (!isSolidPair(FirstBlock, ThirdBlock)) break;
//   //       match[2] = [ThirdBlock.x, ThirdBlock.y];
//   //       result = "Pair |A| Abv1";
//   //     } else {
//   //       let [x, y] = [FirstBlock.x, FirstBlock.y];
//   //       KeySquare.Lowest = firstVacantOrClearingBlockAbove(x, y);
//   //       if (KeySquare.Lowest.x === -1) break; // no clear line detected above
//   //       playAudio(audio.announcerGo);
//   //       KeySquare.Highest = lastVacantOrClearingBlockAbove(x, y);
//   //       if (KeySquare.Highest.x === -1) break; // no block detected past clear line
//   //       SecondBlock = game.board[x][KeySquare.Highest.y - 1];
//   //       if (!isSolidPair(FirstBlock, SecondBlock)) break;
//   //       match[1] = [SecondBlock.x, SecondBlock.y];
//   //       ThirdBlock = findSolidBlockAbove(SecondBlock.x, SecondBlock.y - 1);
//   //       if (!isSolidPair(FirstBlock, ThirdBlock)) break;
//   //       match[2] = [ThirdBlock.x, ThirdBlock.y];
//   //       result = "Main |A| Abv1 Abv2";
//   //     }
//   //     break;
//   //   }
//   //   break; // prevent loop from restarting
//   // }
//   console.log("Results:", result);
//   return !!result;
// }
