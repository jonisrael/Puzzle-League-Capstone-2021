import { audio } from "../fileImports";
import {
  announcer,
  debug,
  game,
  lastIndex,
  music,
  randInt,
  win,
} from "../global";
import { playAnnouncer, playAudio, playMusic } from "./audioFunctions";

export function checkTime(beforeOvertime) {
  let eventFrames = beforeOvertime ? game.frames : game.frames - 7200;
  win.muteMusic.checked && game.frames > 60
    ? (game.Music.volume = 0)
    : (game.Music.volume = 0.2);
  switch (eventFrames) {
    case -180:
      game.Music.pause();
      if (win.restartGame) {
        game.frames = -62;
        break;
      }
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
      if (!win.muteAnnouncer.checked)
        playAudio(audio.announcerTrainingStage, 0.2, true);
      break;
    case -60:
      if (game.mode === "training") break;
      game.Music.pause();
      if (win.restartGame) {
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
      if (!win.muteAnnouncer.checked) playAudio(audio.announcerGo, 0.1, true);

      break;
    case 60:
      if (!debug.enabled && !game.tutorialRunning && beforeOvertime)
        playMusic(music[randInt(music.length, true, lastIndex.music, "music")]);
      game.messagePriority = "";
      game.defaultMessage = "X to swap Z to lift the stack!";
      game.message = game.defaultMessage;

      break;
    case 6600:
      if (game.mode === "training") break;
      game.messagePriority = "10 seconds before overtime!";
      playAnnouncer(
        announcer.hurryUpDialogue,
        announcer.hurryUpIndexLastPicked,
        "hurryUp"
      );
      break;
    case 6700:
      if (game.mode === "training") break;
      game.messagePriority = "";
      break;
    case 6900:
      if (game.mode === "training") break;
      game.messagePriority = "5 seconds before overtime...";
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer5, 0.2, true);
      break;
    case 6960:
      if (game.mode === "training") break;
      game.messagePriority = "4 seconds before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer4, 0.2, true);
      break;
    case 7020:
      if (game.mode === "training") break;
      game.messagePriority = "3 seconds before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer3, 0.2, true);
      break;
    case 7080:
      if (game.mode === "training") break;
      game.messagePriority = "2 seconds before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer2, 0.2, true);
      break;
    case 7140:
      if (game.mode === "training") break;
      game.messagePriority = "1 second before overtime...";
      game.defaultMessage = game.message;
      if (!win.muteAnnouncer.checked) playAudio(audio.announcer1, 0.2, true);
      break;
    case 7200:
      if (game.mode === "training") break;
      game.messagePriority = "Overtime, I hope you're ready...";
      game.defaultMessage = game.message;
      playAnnouncer(
        announcer.overtimeDialogue,
        announcer.overtimeIndexLastPicked,
        "overtime"
      );
      break;
    case 7320:
      if (game.mode === "training") break;
      game.messagePriority = "";
  }
}
