import { audio } from "../fileImports";
import { game, win, announcer, randInt } from "../global";

export function playAnnouncer(arr, lastPicked, arrType, mute = 0) {
  if (win.muteAnnouncer.checked) return;

  let selection = randInt(arr.length);
  console.log("selection", selection, "lastPicked", lastPicked);
  while (selection == lastPicked) {
    console.log("need to reselect");
    selection = randInt(arr.length);
  }
  console.log(arr.length);
  console.log(selection, lastPicked);
  playAudio(arr[selection], 0.1, true);
  switch (arrType) {
    case "opening":
      announcer.openingIndexLastPicked = selection;
      break;
    case "smallChain":
      announcer.smallChainIndexLastPicked = selection;
      break;
    case "mediumChain":
      announcer.mediumChainIndexLastPicked = selection;
      break;
    case "largeChain":
      announcer.largeChainIndexLastPicked = selection;
      break;
    case "timeTransition":
      announcer.timeTransitionIndexLastPicked = selection;
      break;
    case "hurryUp":
      announcer.hurryUpIndexLastPicked = selection;
      break;
    case "panic":
      announcer.panicIndexLastPicked = selection;
      break;
    case "overtime":
      announcer.overtimeIndexLastPicked = selection;
      break;
    case "endgame":
      announcer.endgameIndexLastPicked = selection;
      break;
    default:
      console.log("Announcer Playback failed");
  }
}

export function playAudio(file, volume = 0.1, announcerBypass = false) {
  // if sfx is muted but announcer is not, play sound anyway since announcer is not muted
  if (win.muteSFX.checked && !announcerBypass) return;
  let Sound = new Audio();
  try {
    Sound.volume = volume;
    Sound.freeze = true;
    Sound.currentTime = 0;
    Sound.src = file;
    Sound.play();
  } catch (error) {
    console.log(`Audio play failed. File: ${file}`);
  }
}

export function playChainSFX() {
  if (win.muteSFX.checked) return;
  let Sound = new Audio();
  if (game.currentChain == 1) {
    return;
  }
  if (game.currentChain < 9) {
    Sound.src = audio[`chain${game.currentChain}`];
  } else {
    Sound.src = audio.chain9;
  }
  Sound.volume = 0.05;
  Sound.play();
}

export function playMusic(file, volume = 0.1, mute = 0) {
  if (win.muteMusic.checked) return;
  game.Music.freeze = true;
  game.Music.src = file;
  game.Music.play();
  game.Music.loop = true;
  game.Music.playbackRate = 1.0;
  game.Music.volume = volume;
  if (mute == 1) {
    game.Music.volume = 0;
  } else {
    game.Music.volume = 0.1;
  }
  mute = (mute + 1) % 2;
}
