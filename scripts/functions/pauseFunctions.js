import { game, win, perf, debug } from "../global";
import { audio } from "../fileImports";
import { playAudio } from "./audioFunctions";
import { action } from "../controls";

export function pause(lostFocus = false, message = "") {
  document.getElementById("fps-display").style.display = "none";
  game.paused = true;
  console.log(
    `FRAME ${game.frames}\n`,
    "game:",
    game,
    "win:",
    win,
    "perf:",
    perf,
    "action:",
    action,
    `At ${game.cursor.x}, ${game.cursor.y}`,
    game.board[game.cursor.x][game.cursor.y],
    `At ${game.cursor.x + 1}, ${game.cursor.y}`,
    game.board[game.cursor.x + 1][game.cursor.y]
  );

  perf.pauseStartTime = Date.now();
  if (!debug.enabled) playAudio(audio.pause, 0.1);
  if (lostFocus) win.mainInfoDisplay.innerHTML = "Pause -- Clicked Off Tab";
  else if (message === "aiCrash")
    win.mainInfoDisplay.innerHTML = "Pause -- AI Error";
  else if (debug.enabled)
    win.mainInfoDisplay.innerHTML = `Pause -- Frame ${game.frames}`;
  else win.mainInfoDisplay.innerHTML = "Pause";
  game.Music.volume *= 0.25;
  // game.Music.pause();
  if (debug.enabled) return; // keep board showing in debug mode
  win.mainInfoDisplay.style.color = "blue";
  win.cvs.style.display = "none";
  document.getElementById("fps-display").style.display = "none";
  document.getElementById("resume-button").style.display = "flex";
  document.getElementById("restart-button").style.display = "flex";
  document.getElementById("menu-button").style.display = "flex";
}

export function unpause() {
  game.paused = false;
  let pauseTime = Date.now() - perf.pauseStartTime;
  pauseTime = Math.floor(pauseTime / 100) / 10;
  perf.sumOfPauseTimes += pauseTime;
  win.mainInfoDisplay.innerHTML = game.message;
  win.cvs.style.display = "flex";
  // game.Music.play();
  game.Music.volume *= 4;
  document.getElementById("fps-display").style.display = "flex";
  document.getElementById("resume-button").style.display = "none";
  document.getElementById("restart-button").style.display = "none";
  document.getElementById("menu-button").style.display = "none";
}
