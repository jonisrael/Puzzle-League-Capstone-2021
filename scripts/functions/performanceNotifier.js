import { game, win, performance } from "../global";

export function performanceNotifier() {
  let container = document.getElementById("container");
  let performanceMessage = document.createElement("h2");
  performanceMessage.setAttribute("id", "performanceMessage");
  performanceMessage.innerHTML =
    "It has been determined that your device is running the game much slower than intended. It is recommended you restart the game and play on low performance setting. Click Yes to restart the game using this game setting.";
  container.append(performanceMessage);
  let options = document.createElement("div");
  options.setAttribute("id", "options-menu");
  container.appendChild(options);
  let yesOption = document.createElement("button");
  yesOption.className = "default-button";
  yesOption.setAttribute("id", "yes-option");
  yesOption.innerHTML = "Yes";
  options.appendChild(yesOption);
  let noOption = document.createElement("button");
  noOption.className = "default-button";
  noOption.setAttribute("id", "no-option");
  noOption.innerHTML = "No";
  options.appendChild(noOption);
}
