import { audio } from "../fileImports";
import {
  announcer,
  arbiter,
  bestScores,
  debug,
  game,
  lastIndex,
  music,
  randInt,
  sound,
  win,
} from "../global";
import { playAnnouncer, playAudio, playMusic } from "./audioFunctions";
import { updateTrainingButtons } from "./trainingControls";

export const arcadeEvents = {};

export function defineTimeEvents(timeControl, isBeforeOvertime = true) {
  game.timeControl = timeControl;
  const overtimeStart = game.timeControl * 3600;
  let nextOvertime, levelUpIncrement;
  if (isBeforeOvertime) {
    nextOvertime = overtimeStart;
    levelUpIncrement = overtimeStart / 6;
  } else {
    nextOvertime = overtimeStart + (game.level - 4) * 3600;
    levelUpIncrement = 1200;
  }

  arcadeEvents.levelUpIncrement = levelUpIncrement;
  arcadeEvents.secondsPerLevel = levelUpIncrement / 60;
  arcadeEvents.overtimeStart = overtimeStart;
  arcadeEvents.superOvertimeStart = overtimeStart + 7200;
  arcadeEvents.nextOvertime = nextOvertime;
  arcadeEvents.tenSecondsRemain = nextOvertime - 600;
  arcadeEvents.resetMessagePriority1 = nextOvertime - 480;
  arcadeEvents.fiveSecondsRemain = nextOvertime - 300;
  arcadeEvents.fourSecondsRemain = nextOvertime - 240;
  arcadeEvents.threeSecondsRemain = nextOvertime - 180;
  arcadeEvents.twoSecondsRemain = nextOvertime - 120;
  arcadeEvents.oneSecondRemains = nextOvertime - 60;
  arcadeEvents.resetMessagePriority2 = game.frames + 180;
  arcadeEvents.nextText = "overtime";
}

export function checkTime() {
  // if (game.mode === "tutorial") return;
  // let eventFrames = beforeOvertime
  //   ? game.frames
  //   : game.frames - 1200 * 3 * game.timeControl;
  if (win.muteMusic.checked && game.frames < 60) sound.Music[1].pause();

  switch (game.frames) {
    case -180:
      sound.Music[1].pause();
      game.countdownMinutes = game.timeControl;
      // if (win.restartGame) {
      //   game.frames = -62;
      //   break;
      // }
      debug.show = false;
      game.messagePriority = "3...";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer3, 0.2, true);
      break;
    case -176:
      document
        .getElementById("home-page")
        .scrollIntoView({ behavior: "smooth", block: "end" });
      break;
    case -120:
      game.messagePriority = "2...";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer2, 0.2, true);
      break;
    case -74:
      if (game.mode !== "training") break;
      game.messagePriority = "Training Stage...";
      updateTrainingButtons();
      if (!win.muteAnnouncer.checked)
        playAudio(audio.announcerTrainingStage, 0.1, true);
      break;
    case -60:
      if (game.mode === "training") break;
      game.countdownMinutes = game.timeControl;
      sound.Music[1].pause();
      if (win.restartGame || game.mode === "cpu-play") {
        document
          .getElementById("home-page")
          .scrollIntoView({ behavior: "smooth", block: "end" });
        if (!win.muteAnnouncer.checked) {
          playAudio(audio.announcerReady, 0.2, true);
          game.messagePriority = "Ready...";
        }
      } else {
        if (!win.muteAnnouncer.checked) playAudio(audio.announcer1, 0.2, true);
        game.messagePriority = "1...";
      }
      win.restartGame = false;
      break;
    case 0:
      game.messagePriority = "Go!";
      game.countdownMinutes = game.timeControl;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcerGo, 0.1, true);
      break;
    case 60:
      if (!game.over && !debug.enabled && game.mode !== "tutorial")
        playMusic(music[randInt(music.length, true, lastIndex.music, "music")]);
      game.messagePriority = "";
      game.defaultMessage =
        "Arrow Keys and S/R to play, or use a Touch Screen!";
      game.message = game.defaultMessage;
      break;
    case arcadeEvents.tenSecondsRemain:
      if (game.mode === "training") break;
      if (game.frames < arcadeEvents.overtimeStart)
        arcadeEvents.nextText = "overtime";
      else if (game.frames < arcadeEvents.superOvertimeStart - 1200)
        arcadeEvents.nextText = "speed-up";
      else arcadeEvents.nextText = "super-overtime";
      if (game.frames < arcadeEvents.overtimeStart)
        game.messagePriority = `10 seconds before ${arcadeEvents.nextText}!`;
      // playAudio(audio.arbiterOvertimeWarning);
      playAnnouncer(
        announcer.hurryUpDialogue,
        announcer.hurryUpIndexLastPicked,
        "hurryUp",
        0.2,
        true
      );
      break;
    case arcadeEvents.resetMessagePriority1:
      if (game.mode === "training") break;
      game.messagePriority = "";
      break;
    case arcadeEvents.fiveSecondsRemain:
      if (game.mode === "training") break;
      game.messagePriority = `5 seconds before ${arcadeEvents.nextText}...`;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer5, 0.2, true);
      break;
    case arcadeEvents.fourSecondsRemain:
      if (game.mode === "training") break;
      game.messagePriority = `4 seconds before ${arcadeEvents.nextText}...`;
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer4, 0.2, true);
      break;
    case arcadeEvents.threeSecondsRemain:
      if (game.mode === "training") break;
      game.messagePriority = `3 seconds before ${arcadeEvents.nextText}...`;
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer3, 0.2, true);
      break;
    case arcadeEvents.twoSecondsRemain:
      if (game.mode === "training") break;
      game.messagePriority = `2 seconds before ${arcadeEvents.nextText}...`;
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer2, 0.2, true);
      break;
    case arcadeEvents.oneSecondRemains:
      if (game.mode === "training") break;
      game.messagePriority = `1 second before ${arcadeEvents.nextText}...`;
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer1, 0.2, true);
      break;
    case arcadeEvents.nextOvertime:
      if (game.mode === "training") break;
      if (game.frames === arcadeEvents.nextOvertime)
        game.messagePriority = "Overtime, Stay Focused!";
      else if (game.frames === arcadeEvents.superOvertimeStart) {
        game.messagePriority = "Super Overtime! Keep it up...";
      } else if (game.level % 2 === 0)
        game.messagePriority = "Block Delay Timers are getting shorter...";
      else if (game.level % 2 === 1)
        game.messagePriority = "Board Rise Speed has doubled...";
      playAnnouncer(
        announcer.overtimeDialogue,
        announcer.overtimeIndexLastPicked,
        "overtime",
        0.2,
        true
      );
      defineTimeEvents(game.timeControl, false); // beforeOvertime is false
      break;
    case arcadeEvents.nextOvertime + 140:
      break;
    case arcadeEvents.resetMessagePriority2:
      if (game.mode === "training") break;
      game.messagePriority = "";
      break;
  }
}
