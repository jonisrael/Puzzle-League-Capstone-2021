import { game, win } from "../global";
import { audio } from "../fileImports";
import { gameLoop } from "../../puzzleleague";
import { playAudio } from "./audioFunctions";

export function pause(lostFocus = false) {
  game.paused = true;
  playAudio(audio.pause, 0.1);
  lostFocus
    ? (win.mainInfoDisplay.innerHTML = "Pause -- Window Lost Focus")
    : (win.mainInfoDisplay.innerHTML = "Pause");
  win.mainInfoDisplay.style.color = "blue";
  win.cvs.style.display = "none";
  game.Music.pause();
  document.getElementById("resume-button").style.display = "flex";
  document.getElementById("restart-button").style.display = "flex";
  document.getElementById("menu-button").style.display = "flex";
}

export function unpause() {
  game.paused = false;
  win.mainInfoDisplay.innerHTML = game.message;
  win.cvs.style.display = "flex";
  game.Music.play();
  document.getElementById("resume-button").style.display = "none";
  document.getElementById("restart-button").style.display = "none";
  document.getElementById("menu-button").style.display = "none";
}

// For some reason pausing audio is backwards, Music.play() for pause() and Music.play for unpause
