import { audio, audioList } from "../fileImports";
import {
  game,
  win,
  debug,
  announcer,
  randInt,
  cpu,
  music,
  objectOfAudios,
  loadedAudios,
  detectInfiniteLoop,
  sound,
} from "../global";

export function playAnnouncer(
  arr,
  lastPicked,
  arrType,
  volume = 0.2,
  playbackImportant = true
) {
  if (win.muteAnnouncer.checked) return;

  let selection = randInt(arr.length);
  // console.log("selection", selection, "lastPicked", lastPicked);
  win.loopCounter = 0;
  while (selection === lastPicked) {
    win.loopCounter++;
    if (detectInfiniteLoop("playAnnouncer", win.loopCounter)) break;
    // console.log("need to reselect");
    selection = randInt(arr.length);
  }

  // console.log(arr.length);
  // console.log(selection, lastPicked);
  playAudio(arr[selection], volume, true, playbackImportant);
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
    case "combo":
      announcer.comboIndexLastPicked = selection;
      break;
  } // end switch
}

export function playAudio(
  file,
  volume = 0.2,
  announcerBypass = false,
  playbackImportant = true
) {
  // if sfx is muted but announcer is not, play sound anyway since announcer is not muted
  //test
  // if (debug.enabled) {
  //   const soundsCurrentlyPlaying = [];
  //   Object.keys(objectOfAudios).forEach((key) => {
  //     if (!objectOfAudios[key].paused) {
  //       soundsCurrentlyPlaying.push(
  //         JSON.stringify([
  //           key,
  //           `${Math.floor(
  //             (1000 * objectOfAudios[key].currentTime) /
  //               objectOfAudios[key].duration
  //           ) / 10}%`,
  //         ]).replaceAll('"', "'")
  //       );
  //     }
  //   });
  //   console.log(JSON.stringify(soundsCurrentlyPlaying, null, "\n"), sound);
  // }
  if (win.muteSFX.checked && !announcerBypass) return;
  if (announcerBypass) {
    if (!sound.AnnVoice[1].paused) {
      if (!playbackImportant) return;
      sound.AnnVoice[1].pause();
    }
    sound.AnnVoice[0] = file;
    sound.AnnVoice[1] = objectOfAudios[file];
  } else {
    sound.SFX0[0] = file;
    sound.SFX0[1] = objectOfAudios[file];
  }
  let Sound = objectOfAudios[file];
  try {
    Sound.volume = volume;
    Sound.currentTime = 0;
    if (Sound.readyState > 0) Sound.play();
    else
      console.log(
        Sound.src,
        "was not loaded in time, skipping sound byte. State:",
        Sound.readyState,
        "index location",
        audioList.indexOf(Sound.src)
      );
  } catch (error) {
    console.log(`Audio play failed. File: ${file}`);
  }
}

export function playChainSFX(chain) {
  if (win.muteSFX.checked) return;
  let Sound = objectOfAudios[audio[`chain${chain}`]];
  if (chain == 1) {
    return;
  }
  if (chain < 9) {
    Sound = objectOfAudios[audio[`chain${chain}`]];
  } else {
    Sound = objectOfAudios[audio[`chain9`]];
  }
  Sound.volume = 0.05;
  try {
    if (Sound.readyState > 0) {
      Sound.play();
    } else if (objectOfAudios.chain2.readyState > 1) {
      audio.chain2.play();
    } else {
      console.log("failed to play any chain sound effect");
    }
  } catch (e) {
    console.error("chain sfx playback failed", e, e.stack);
  }
}

export function playMusic(file, volume = 1, currentTime = 0) {
  if (win.muteMusic.checked) return;
  sound.Music[1].pause();
  sound.Music[0] = file;
  sound.Music[1] = objectOfAudios[file];
  if (debug.enabled) console.log("Music track:", sound.Music[1].src);
  sound.Music[1].volume = volume;
  sound.Music[1].currentTime = currentTime;
  sound.Music[1].play();
  // if (sound.Music[1].onended) {
  //   console.log(sound.Music[0], "has ended");
  //   playMusic(music[randInt(music.length)]);
  // }
  // sound.Music[1].loop = loop;
}
