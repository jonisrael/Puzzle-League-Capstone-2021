import * as state from "../../store";

import html from "html-literal";
import { game, sound, win } from "../global";

export function showNotification(messageLabel) {
  // document.getElementById("container").style.display = "none";
  if (messageLabel.includes("appleWarning")) appleWarning();
  if (messageLabel.includes("soundStatement")) soundStatement();
  return;
  // let patchNotesOverlay = document.createElement("div");
  // patchNotesOverlay.setAttribute("id", "patch-notes-overlay");
  // document.getElementById("home-page").prepend(patchNotesOverlay);
  // let patchNotesBlock = document.createElement("div");
  // patchNotesBlock.setAttribute("id", "patch-notes-block");
  // patchNotesOverlay.appendChild(patchNotesBlock);
  // if (messageLabel === "appleWarning") {
  //   patchNotesBlock.innerHTML = appleWarning();
  // }
  // patchNotesBlock.innerHTML = html`
  //   <h2>
  //     Watch the AI play!
  //     <a
  //       href="https://youtu.be/QOKbWRvVWUM"
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       >https://youtu.be/QOKbWRvVWUM</a
  //     >
  //   </h2>
  // `;
}

function appleWarning() {
  console.log("attempting to show apple warning");
  if (win.gamesCompleted > 0) return;
  let patchNotesOverlay = document.createElement("div");
  patchNotesOverlay.setAttribute("id", "patch-notes-overlay");
  document.getElementById("home-page").prepend(patchNotesOverlay);
  let patchNotesBlock = document.createElement("div");
  patchNotesBlock.setAttribute("id", "patch-notes-block");
  patchNotesOverlay.appendChild(patchNotesBlock);
  game.paused = 1;
  // localStorage.setItem("mute-music", "true");
  localStorage.setItem("mute-sfx", "true");
  localStorage.setItem("mute-announcer", "true");
  win.muteMusic.checked = true;
  win.muteAnnouncer.checked = true;
  win.muteSFX.checked = true;
  localStorage.setItem("apple-warning-shown-march", "true");
  patchNotesBlock.innerHTML = html`
    <p>
      Apple products have issues with sound effects not playing correctly, and
      has automatically been disabled. You can still re-enable it in the options
      menu. <br /><strong>Click anywhere to continue</strong>.
    </p>
  `;
  patchNotesOverlay.addEventListener("click", () => {
    patchNotesOverlay.remove();
    game.paused = 0;
    document.getElementById("container").style.display = "block";
  });
}

function soundStatement() {
  console.log("attempting to show sound statement");
  if (win.gamesCompleted > 0) return;
  let patchNotesOverlay = document.createElement("div");
  patchNotesOverlay.setAttribute("id", "patch-notes-overlay");
  document.getElementById("home-page").prepend(patchNotesOverlay);
  let patchNotesBlock = document.createElement("div");
  patchNotesBlock.setAttribute("id", "patch-notes-block");
  patchNotesOverlay.appendChild(patchNotesBlock);
  game.paused = 1;
  // win.muteMusic.checked = true;
  // win.muteAnnouncer.checked = true;
  // win.muteSFX.checked = true;
  localStorage.setItem("apple-warning-shown-march", "true");
  patchNotesBlock.innerHTML = html`
    <p>
      Play the game with the sound ON for the best experience! <br /><strong
        >Click anywhere to continue</strong
      >.
    </p>
  `;
  patchNotesOverlay.addEventListener("click", () => {
    patchNotesOverlay.remove();
    game.paused = 0;
    document.getElementById("container").style.display = "block";
  });
}

// <h2 style="color:black;">
//   v1.01 (10/06/21) Patch Notes
// </h2>
// <label>Game Changes</label>
// <ul>
//   <li>
//     WASD controls are now allowed for people who prefer their left hand for
//     movement. You can activate it by pressing "W" at the home screen.
//   </li>
// </ul>
// <label>Website Changes</label>
// <ul>
//   <li>
//     Added new patch notes page! This shows up when first loading the
//     website. This also gives time for the game to preload audio game files
//     before launching the game.
//   </li>
//   <li>
//     Added a function to display network errors on the webpage if the
//     application fails to reach the WorldTimeAPI or leaderboard database.
//   </li>
//   <li>
//     Added a feature to start the game if "Play Game" is selected in the Nav
//     Bar when already on home page.
//   </li>
// </ul>
// <label>Leaderboard Changes</label>
// <ul>
//   <li>
//     Bug involving leaderboard not updating after scores are posted has been
//     fixed, as well as "Refresh" buttons were added to update the
//     leaderboard.
//   </li>
//   <li>
//     Leaderboard now limits users to 3 postings of the same name. If posting
//     a fourth name, it will overwrite the lowest score, and will also give
//     another notification if the score is lower than all of the scores on the
//     leaderboard. Hopefully this will incentivize people to keep updating
//     their scores without worrying about taking up too much of the
//     leaderboard.
//   </li>
//   <li>
//     Leaderboard posting has changed -- It will no longer delete entries, but
//     instead overwrite old ones. This should fix problems with accidentally
//     adding or removing the number of elements on the leaderboard (currently
//     at 50)
//   </li>
//   <li>
//     When posting scores, the name field will be automatically pre-filled
//     with the last name submitted to the leaderboard.
//   </li>
//   <li>
//     When posting scores, the window will automatically go to the leaderboard
//     and scroll to your score's spot on the leaderboard. That score is
//     highlighted yellow, while your other scores are highlighted orange.
//   </li>
// </ul>
