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
import { render } from "../../index";
import * as state from "../../store";
import { setUpTrainingMode } from "./trainingControls";

export function pause(lostFocus = false, message = "Pause") {
  // document.getElementById("fps-display").style.display = "none";
  game.paused = true;
  document.getElementById("pause-button").innerHTML = "Unpause";
  document.getElementById("pause-button").fontSize = "1.5rem";

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
    addPauseContent();
    // document.getElementById("fps-display").style.display = "none";
    // document.getElementById("resume-button").style.display = "flex";
    // document.getElementById("restart-button").style.display = "flex";
    // document.getElementById("menu-button").style.display = "flex";
    // document.getElementById("more-options").style.display = "flex";
  }
}

export function unpause() {
  game.paused = false;
  if (game.mode === "training" && win.mobile) {
    document.getElementById("pause-button").innerHTML = "Training Features";
    document.getElementById("pause-button").style.fontSize = "0.8rem";
  } else {
    document.getElementById("pause-button").innerHTML = "Pause";
  }
  let pauseTime = Date.now() - perf.pauseStartTime;
  pauseTime = Math.floor(pauseTime / 100) / 10;
  perf.thisPauseTime = 0;
  perf.sumOfPauseTimes += pauseTime;
  win.mainInfoDisplay.innerHTML = game.message;
  win.cvs.style.display = "block";
  if (game.frames >= 0) sound.Music[1].play();
  // sound.Music[1].volume *= 4;
  // document.getElementById("fps-display").style.display = "flex";
  if (document.getElementById("pause-content"))
    document.getElementById("pause-content").remove();
}

export function addPauseContent() {
  let parentElement = document.querySelector(
    win.mobile ? "#game-container" : ".column2"
  );
  let pauseContent = document.createElement("div");
  pauseContent.setAttribute("id", "pause-content");
  parentElement.appendChild(pauseContent);
  if (win.mobile && game.mode === "training") {
    setUpTrainingMode(pauseContent);
  } else {
    let mainPauseOptions = document.createElement("div");
    let mainPauseButtons = [
      ["<u>C</u>ontinue", "resume-button"],
      ["<u>R</u>estart", "restart-button"],
      ["<u>M</u>enu", "menu-button"],
    ];
    for (let i = 0; i < mainPauseButtons.length; i++) {
      let btn = document.createElement("button");
      btn.innerHTML = mainPauseButtons[i][0];
      btn.setAttribute("id", mainPauseButtons[i][1]);
      btn.className = "default-button pause-buttons pause-main-actions";
      if (i === 0) {
        btn.addEventListener("click", () => {
          unpause();
        });
      } else if (i === 1) {
        btn.addEventListener("click", () => {
          win.running = false;
          win.restartGame = true;
        });
      } else if (i === 2) {
        btn.addEventListener("click", () => {
          win.running = false;
          render(state.Home);
        });
      }
      mainPauseOptions.appendChild(btn);
    }
    pauseContent.append(mainPauseOptions);

    let morePauseOptions = document.createElement("div");
    if (game.mode === "arcade" || (game.mode === "training" && !win.mobile)) {
      pauseContent.append(document.createElement("hr"));
      let div = document.createElement("div");
      div.setAttribute("id", "extra-pause-options");
      pauseContent.appendChild(div);
      let extraOptions = [
        ["Game Tutorial (Old)", "game-tutorial-link"],
        ["Touch-Screen Tutorial", "touch-tutorial"],
      ];
      for (let i = 0; i < extraOptions.length; i++) {
        let option = extraOptions[i];
        let btn = document.createElement("button");
        btn.className = "default-button pause-buttons extra-buttons";
        btn.innerHTML = option[0];
        btn.setAttribute("id", option[1]);
        div.appendChild(btn);
        if (i === 0) {
          btn.onclick = function() {
            window.open("https://youtu.be/5o8C81D-Uo0", "_blank");
          };
        }
        if (i === 1) {
          btn.disabled = true;
        }
      }
    }
  }
}
