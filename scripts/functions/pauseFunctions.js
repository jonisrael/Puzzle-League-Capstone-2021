import { game, win, performance, debug } from "../global";
import { audio } from "../fileImports";
import { playAudio } from "./audioFunctions";

export function pause(lostFocus = false, aiCrash = false) {
  document.getElementById("fps-display").style.display = "none";
  game.paused = true;
  console.log(game);
  performance.pauseStartTime = Date.now();
  playAudio(audio.pause, 0.1);
  if (lostFocus) win.mainInfoDisplay.innerHTML = "Pause -- Window Lost Focus";
  else if (aiCrash) win.mainInfoDisplay.innerHTML = "Pause -- AI Error";
  else win.mainInfoDisplay.innerHTML = "Pause";
  game.Music.pause();
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
  let pauseTime = Date.now() - performance.pauseStartTime;
  pauseTime = Math.floor(pauseTime / 100) / 10;
  performance.sumOfPauseTimes += pauseTime;
  win.mainInfoDisplay.innerHTML = game.message;
  win.cvs.style.display = "flex";
  game.Music.play();
  document.getElementById("fps-display").style.display = "flex";
  document.getElementById("resume-button").style.display = "none";
  document.getElementById("restart-button").style.display = "none";
  document.getElementById("menu-button").style.display = "none";
}
