import {
  game,
  win,
  perf,
  debug,
  touch,
  helpPlayer,
  cpu,
  sound,
} from "../global";
import { audio } from "../fileImports";
import { playAudio } from "./audioFunctions";
import { action } from "../controls";
import { tutorial } from "../tutorial/tutorialScript";

export function pause(lostFocus = false, message = "Pause") {
  // document.getElementById("fps-display").style.display = "none";
  game.paused = true;

  console.log(
    `FRAME ${game.frames}`,
    "\ngame:",
    game,
    game.board[game.cursor.x][game.cursor.y],
    "\nwin",
    win,
    "\nsound",
    sound,
    "\ntouch",
    touch,
    "\ncpu",
    cpu,
    "\nhelpPlayer",
    helpPlayer,
    "\ndebug",
    debug,
    "\nperf",
    perf,
    "\ntutorial",
    tutorial,
    game.cursor_type[0] === "d"
      ? game.board[game.cursor.x + 1][game.cursor.y]
      : ""
  );
  //   "win:",
  //   win,
  //   "perf:",
  //   perf,
  //   "action:",
  //   action,
  //   game.board[game.cursor.x][game.cursor.y],

  // );

  perf.pauseStartTime = Date.now();
  if (!debug.enabled) playAudio(audio.pause, 0.1);
  if (lostFocus) {
    win.mainInfoDisplay.innerHTML = "Pause -- Clicked Off Tab";
    // sound.Music[1].pause();
  } else if (message === "aiCrash")
    win.mainInfoDisplay.innerHTML = "Pause -- AI Error";
  else if (debug.enabled && message === "Pause")
    win.mainInfoDisplay.innerHTML = `Pause -- Frame ${game.frames}`;
  else win.mainInfoDisplay.innerHTML = message;
  // sound.Music[1].volume *= 0.25;
  sound.Music[1].pause();
  if (!debug.enabled) {
    // still show board during debug mode
    win.mainInfoDisplay.style.color = "black";
    win.cvs.style.display = "none";
    // document.getElementById("fps-display").style.display = "none";
    document.getElementById("resume-button").style.display = "flex";
    document.getElementById("restart-button").style.display = "flex";
    document.getElementById("menu-button").style.display = "flex";
  }
}

export function unpause() {
  game.paused = false;
  let pauseTime = Date.now() - perf.pauseStartTime;
  pauseTime = Math.floor(pauseTime / 100) / 10;
  perf.thisPauseTime = 0;
  perf.sumOfPauseTimes += pauseTime;
  win.mainInfoDisplay.innerHTML = game.message;
  win.cvs.style.display = "block";
  if (game.frames >= 0) sound.Music[1].play();
  // sound.Music[1].volume *= 4;
  // document.getElementById("fps-display").style.display = "flex";
  document.getElementById("resume-button").style.display = "none";
  document.getElementById("restart-button").style.display = "none";
  document.getElementById("menu-button").style.display = "none";
}
