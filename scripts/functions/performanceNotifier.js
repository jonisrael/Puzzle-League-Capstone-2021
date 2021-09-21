import { game, win, performance } from "../global";

export function performanceNotifier() {
  let container = document.getElementById("container");
  let performanceMessage = document.createElement("h2");
  performanceMessage.setAttribute("id", "performance-message");
  performanceMessage.innerHTML = `<hr>It has been determined that your device is running too slow due to the in-game clock being five or more seconds behind realtime. You will be unable to post scores. It is recommended to restart the game and play on a lower performance setting or close other applications. Click "Restart Game" to restart the game at 30 fps or "Continue" to play without being able to post scores.`;
  container.insertBefore(
    performanceMessage,
    document.getElementById("game-container")
  );
  // let options = document.createElement("div");
  // options.setAttribute("id", "options-menu");
  // container.appendChild(options);
  // let yesOption = document.createElement("button");
  // yesOption.className = "default-button";
  // yesOption.setAttribute("id", "yes-option");
  // yesOption.innerHTML = "Yes";
  // options.appendChild(yesOption);
  // let noOption = document.createElement("button");
  // noOption.className = "default-button";
  // noOption.setAttribute("id", "no-option");
  // noOption.innerHTML = "No";
  // options.appendChild(noOption);
}
