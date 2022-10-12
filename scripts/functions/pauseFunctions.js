import {
  game,
  win,
  perf,
  debug,
  touch,
  helpPlayer,
  cpu,
  sound,
  grid,
  replay,
  music,
  randInt,
  overtimeMusic,
  leaderboard,
} from "../global";
import { audio } from "../fileImports";
import { playAudio, playMusic } from "./audioFunctions";
import { action } from "../controls";
import { tutorial } from "../tutorial/tutorialScript";
import { render } from "../../index";
import * as state from "../../store";
import { setUpTrainingMode } from "./trainingControls";
import { drawGrid } from "../../mainGame";
import { previous } from "./playbackGame";
import { arcadeEvents } from "./timeEvents";

export function pause(
  lostFocus = false,
  message = "Pause",
  pauseMusic = true,
  hideRestart = false
) {
  // document.getElementById("fps-display").style.display = "none";
  game.paused = true;
  try {
    printDebugInfo();
  } catch (error) {
    console.error(error, error.stack);
  }
  document.getElementById("pause-button").innerHTML = "Unpause";
  document.getElementById("pause-button").fontSize = "1.5rem";
  //   "win:",
  //   win,
  //   "perf:",
  //   perf,
  //   "action:",
  //   action,
  //   game.board[game.cursor.x][game.cursor.y],

  // );
  perf.pauseStartTime = Date.now();
  if (lostFocus) {
    win.mainInfoDisplay.innerHTML = "Pause -- Clicked Off Tab";
    // sound.Music[1].pause();
  } else if (message === "aiCrash")
    win.mainInfoDisplay.innerHTML = "Pause -- AI Error";
  else if (debug.enabled && message === "Pause")
    win.mainInfoDisplay.innerHTML = `Pause -- Frame ${game.frames}`;
  else win.mainInfoDisplay.innerHTML = message;
  // sound.Music[1].volume *= 0.25;
  if (!debug.enabled) {
    if (pauseMusic) {
      playAudio(audio.pause, 0.1);
      sound.Music[1].pause();
    }

    // still show board during debug mode
    win.mainInfoDisplay.style.color = "black";
    win.cvs.style.display = "none";
    addPauseContent();
    if (hideRestart) {
      document.querySelector("#resume-button").textContent = "Retry";
      document.querySelector("#restart-button").style.display = "none";
      document.querySelector("#menu-button").textContent = "Menu";
      win.mainInfoDisplay.textContent = message;
    }
    // document.getElementById("fps-display").style.display = "none";
    // document.getElementById("resume-button").style.display = "flex";
    // document.getElementById("restart-button").style.display = "flex";
    // document.getElementById("menu-button").style.display = "flex";
    // document.getElementById("more-options").style.display = "flex";
  }
  if (debug.show) {
    win.cvs.height = (grid.ROWS + 2) * grid.SQ;
    drawGrid();
  }
}

export function unpause() {
  game.paused = false;
  if (debug.show) win.cvs.height = grid.ROWS * grid.SQ;
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
  if (game.frames >= 0 && !win.muteMusic.checked) sound.Music[1].play();
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
        ["Change Soundtrack", "change-track"],
        ["Mute/Unmute Sound", "mute-sound"],
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
            game.level <= 5
              ? playMusic(music[randInt(music.length, true)])
              : playMusic(overtimeMusic[randInt(overtimeMusic.length, true)]);
          };
        }
        // ! WILL BE CHANGED WHEN MOBILE TUTORIAL VIDEO IS COMPLETE
        if (i === 1) {
          btn.onclick = function() {
            win.muteMusic.checked = !win.muteMusic.checked;
            win.muteSFX.checked = !win.muteSFX.checked;
            win.muteAnnouncer.checked = !win.muteAnnouncer.checked;
            if (win.muteMusic.checked) sound.Music[1].pause();
            unpause();
          };
        }
      }
    }
  }
}

export function printDebugInfo() {
  tutorial.action = game.board[0][grid.ROWS].timer;
  console.log(
    `FRAME ${game.frames}`,
    "\ngame:",
    game,
    "\nwin",
    win,
    "\nsound",
    sound,
    "\ntouch",
    touch,
    "\ncpu",
    cpu,
    "\nprevious",
    previous,
    "\naction",
    action,
    "\nhelpPlayer",
    helpPlayer,
    "\ndebug",
    debug,
    "\ntutorial",
    tutorial,
    "\nleaderboard",
    leaderboard,
    "\narcadeEvents",
    arcadeEvents,
    "\nreplay",
    replay,
    "\nperf",
    perf,
    game.cursor_type[0] === "d"
      ? game.board[game.cursor.x + 1][game.cursor.y]
      : "",
    `\nblock`,
    game.board[game.cursor.x][game.cursor.y]
  );
}
