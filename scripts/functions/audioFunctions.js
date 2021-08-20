import { audio } from "../fileImports";

import { game } from "../global";

export function playAudio(file, volume = 0.1) {
  let Sound = new Audio();
  try {
    Sound.volume = volume;
    Sound.pause = true;
    Sound.currentTime = 0;
    Sound.src = file;
    Sound.play();
  } catch (error) {
    console.log(`Audio play failed. File: ${file}`);
  }
}

export function playChainSFX() {
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
  game.Music.pause = true;
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
