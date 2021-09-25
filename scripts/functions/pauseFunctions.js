import { game, win, performance } from "../global";
import { audio } from "../fileImports";
import { playAudio } from "./audioFunctions";

export function pause(lostFocus = false) {
  document.getElementById("fps-display").style.display = "none";
  game.paused = true;
  performance.pauseStartTime = Date.now();
  playAudio(audio.pause, 0.1);
  lostFocus
    ? (win.mainInfoDisplay.innerHTML = "Pause -- Window Lost Focus")
    : (win.mainInfoDisplay.innerHTML = "Pause");
  win.mainInfoDisplay.style.color = "blue";
  win.cvs.style.display = "none";
  game.Music.pause();
  document.getElementById("fps-display").style.display = "none";
  document.getElementById("resume-button").style.display = "flex";
  document.getElementById("restart-button").style.display = "flex";
  document.getElementById("menu-button").style.display = "flex";
}

export function unpause() {
  game.paused = false;
  let pauseTime = Date.now() - performance.pauseStartTime;
  pauseTime = Math.floor(pauseTime / 100) / 10;
  performance.sumOfPauseTimes += pauseTime;
  // realTimer = Math.floor(realTimer / 100) / 10
  win.mainInfoDisplay.innerHTML = game.message;
  win.cvs.style.display = "flex";
  game.Music.play();
  document.getElementById("fps-display").style.display = "flex";
  document.getElementById("resume-button").style.display = "none";
  document.getElementById("restart-button").style.display = "none";
  document.getElementById("menu-button").style.display = "none";
}
