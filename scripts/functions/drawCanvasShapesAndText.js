import { game, win, grid, preset } from "../global";

export function drawScoreEarnedMessage(message, x, y, SQ, rise) {
  let pixelX = 0;
  win.ctx.textAlign = "left";
  let pixelY = (y + 1 - 1.1) * SQ - rise;
  if (x === 1) {
    pixelX = (1 / 3) * SQ;
  } else if (x === 2) {
    pixelX = SQ;
  } else if (x === 4) {
    pixelX = win.cvs.width - SQ / 2;
    win.ctx.textAlign = "right";
  } else if (x === grid.COLS - 1) {
    pixelX = win.cvs.width;
    win.ctx.textAlign = "right";
  } else {
    pixelX = win.cvs.width / 2;
    win.ctx.textAlign = "center";
  }
  win.ctx.font = `${0.75 * SQ}px Comic Sans MS, Comic Sans, cursive`;
  message = `+${game.scoreEarned}`;
  win.ctx.fillStyle = game.board[x][y].color;
  win.ctx.fillText(message, pixelX, pixelY, win.cvs.width);
  win.ctx.strokeStyle = "white";
  win.ctx.strokeText(message, pixelX, pixelY, win.cvs.width);
  if (
    0 !== 0 &&
    game.currentChain > 1 &&
    game.board[x][y].availForPrimaryChain
  ) {
    if (0 === 0 || game.frameMod[6] < 3) {
      win.ctx.fillStyle =
        game.currentChain < 4
          ? "orange"
          : game.currentChain < 6
          ? "gold"
          : game.currentChain < 9
          ? "pink"
          : "red";
    } else {
      win.ctx.fillStyle = "silver";
    }

    win.ctx.fillText(
      `${game.currentChain}x`,
      pixelX,
      pixelY - SQ,
      win.cvs.width
    );
    // win.ctx.strokeStyle = "white";
    // win.ctx.strokeText(
    //   `${game.currentChain}x`,
    //   pixelX,
    //   pixelY - SQ,
    //   win.cvs.width
    // );
  }
}

export function drawScoreEarnedMessage2(message, x, y, SQ, rise) {
  message = `+${x ** 5}`;
  const blinkTimePreset = game.board[x][y].switchToFaceFrame;
  const timeRemaining =
    game.board[x][y].timer - game.board[x][y].switchToFaceFrame;

  let pixelX = x * SQ;
  let pixelY = (y + 1) * SQ - rise;
  let offsetX = x < grid.COLS / 2 ? -0.5 * SQ : -1.5 * SQ;
  let offsetY = y > 1 ? -1 * SQ : 1.1 * SQ;
  // let blinkOffset = (SQ * timeRemaining) / blinkTimePreset / 2;
  // let extraOffset = blinkOffset;
  // console.log(
  //   game.board[x][y].timer,
  //   timeRemaining,
  //   Math.floor(blinkOffset / SQ)
  // );
  // if (game.board[x][y].timer === 119) {
  //   console.log(
  //     x,
  //     y,
  //     pixelX,
  //     pixelY,
  //     offsetX / SQ,
  //     offsetY / SQ,
  //     pixelX + offsetX,
  //     pixelY + offsetY
  //   );
  // }

  let blinkOffset = 0; // ! change
  let xLoc = pixelX + offsetX;
  let yLoc = pixelY + offsetY - blinkOffset;
  // let xLoc = pixelX;
  // let yLoc = pixelY;
  // win.ctx.globalAlpha = 0.8;
  // let gradient = win.ctx.createLinearGradient(
  //   pixelX,
  //   pixelY,
  //   pixelX - 10,
  //   pixelY - 10
  // );
  // gradient.addColorStop(0, "silver");
  // gradient.addColorStop(0.5, "white");
  // gradient.addColorStop(1, "silver");
  // win.ctx.fillStyle = gradient;
  win.ctx.font = `${1.5 * SQ}px Comic Sans MS, Comic Sans, cursive`;
  win.ctx.fillStyle = game.board[x][y].color;
  win.ctx.fillText(message, xLoc, yLoc, 3 * SQ);
  win.ctx.strokeStyle = "white";
  // win.ctx.strokeWidth = "50px";
  win.ctx.strokeText(message, xLoc, yLoc, 3 * SQ);
}
