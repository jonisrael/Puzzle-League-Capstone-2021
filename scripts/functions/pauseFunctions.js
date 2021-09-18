import { game, win } from "../global";
import { gameLoop } from "../../puzzleleague";

export function pause() {
  game.paused = true;
  win.mainInfoDisplay.innerHTML = "Pause";
  win.mainInfoDisplay.style.color = "blue";
  win.cvs.style.display = "none";
  game.Music.pause();
  document.getElementById("resume-button").style.display = "flex";
}

export function unpause() {
  game.paused = false;
  win.mainInfoDisplay.innerHTML = game.message;
  win.cvs.style.display = "flex";
  game.Music.play();
  document.getElementById("resume-button").style.display = "none";
}

// For some reason pausing audio is backwards, Music.play() for pause() and Music.play for unpause
