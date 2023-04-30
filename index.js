import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";

import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
import dotenv from "dotenv";
import {
  win,
  api,
  game,
  loadAudios,
  loadedAudios,
  leaderboard,
  sound,
} from "./scripts/global";
import {
  defaultControls,
  preselectControls,
  saveControls,
  savedControls,
  setUpASCIIOptions,
} from "./scripts/controls";
import { startGame } from "./scripts/functions/startGame";
import { extractTimeFromAPI } from "./scripts/functions/submitResults";
import { populateLeaderboard } from "./scripts/functions/populateLeaderboard";
import { showNotification } from "./scripts/functions/showNotification";
import {
  setNewKeyboardControls,
  setNewGamepadControls,
} from "./scripts/controls";
import { tutorial } from "./scripts/tutorial/tutorialScript";
import { middleMenuSetup } from "./scripts/functions/middleMenu";
dotenv.config();

export const router = new Navigo(window.location.origin);

export function render(st) {
  console.log(st);
  if (win.view === "Controls" && win.controlChangeWasMade) {
    if (win.view !== st.view && confirm("Save Controls?")) {
      saveControls();
    }
  }
  win.view = st.view;
  win.viewChanged = true;
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
  `;
  router.updatePageLinks();

  // localStorage.removeItem("patchNotesShown");
  // console.log("patch notes shown:", localStorage.getItem("patchNotesShown"));
  if (st.view === "Home" && !localStorage.getItem("patchNotesShown")) {
    // win.patchNotesShown = true;
    // showPatchNotes();
    localStorage.setItem("patchNotesShown", "true");
  }
  document.getElementById("browser").innerHTML = win.browser;
  document.getElementById("os").innerHTML = win.os;
  addEventListeners(st);
}

function addEventListeners(st) {
  // add event listeners to Nav items for navigation
  document.querySelectorAll("nav a").forEach((navLink) =>
    navLink.addEventListener("click", (event) => {
      event.preventDefault();
      // Failsafe: If already on home page, do not reload it upon clicking it.
      win.running = false;
      sound.Music[1].volume = 0;
      // If on homepage and game playing, revert to homepage. If game not playing, start game.
      if (st.view === "Home" && state[event.target.title].view === "Home") {
        if (
          document.getElementById("canvas") ||
          document.getElementById("button_2")
        ) {
          render(state[event.target.title]);
        } else {
          game.mode = "arcade";
          middleMenuSetup("timeControl");
        }
      }
    })
  );

  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );

  // add event listener for the the home/game page
  win.muteAnnouncer = document.getElementById("mute-announcer");
  win.muteMusic = document.getElementById("mute-music");
  win.muteSFX = document.getElementById("mute-sfx");
  if (st.view === "Leaderboard") {
    document.querySelectorAll(".refresh-buttons").forEach((item) => {
      item.addEventListener("click", () => {
        // document.querySelector(".nav-links a[title=Home]").click();
        // document.querySelector(".nav-links a[title=Leaderboard]").click();
        item.innerHTML = "Fetching...";
        getLeaderboardData(true);
      });
    });
    document.querySelectorAll(".tab-links").forEach((item) => {
      item.addEventListener("click", function(e) {
        let tab_id = e.target.outerText;
        console.log(e, tab_id, tab_id === "Marathon");
        // Declare all variables
        let i, tabcontent, tablinks;

        // Get all elements with class="tabcontent" and hide them
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }

        // Get all elements with class="tablinks" and remove the class "active"
        tablinks = document.getElementsByClassName("tab-links");
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        // Show the current tab, and add an "active" class to the button that opened the tab
        document.getElementById(tab_id).style.display = "block";
        e.currentTarget.className += " active";
      });
    });
  }
  if (st.view === "Controls") {
    // if saved
    // checkPreselectedControls(savedControls);
    win.controlChangeWasMade = false;
    for (let i = 1; i <= 8; i++) {
      setUpASCIIOptions(
        `#keyboard-controls-container > div:nth-child(${i}) > select`
      );
    }
    setUpASCIIOptions("#swap-2");
    setUpASCIIOptions("#raise-2");
    setUpASCIIOptions("#turn-clockwise-2");
    setUpASCIIOptions("#turn-cc-2");
    preselectControls();
    document
      .getElementById("accept-game-controls")
      .addEventListener("click", function(event) {
        event.preventDefault();
        if (confirm("Save Controls?")) {
          saveControls();
          render(state.Controls);
          displayMessage("Controls successfully saved!", false);
        }
      });
    document
      .getElementById("restore-defaults")
      .addEventListener("click", function(event) {
        if (confirm("Reset your controls to default?")) {
          savedControls.keyboard = defaultControls.keyboard;
          savedControls.gamepad = defaultControls.gamepad;
          localStorage.setItem("controls", JSON.stringify(savedControls));
          if (st.view === "Controls") {
            render(state.Controls);
            displayMessage("Controls restored to default.", false);
          }
        } else {
          event.preventDefault();
        }
      });
    document.querySelectorAll(".kb-controls").forEach((el) =>
      el.addEventListener("click", () => {
        win.controlChangeWasMade = true;
        console.log("control change was made");
      })
    );
  }

  if (st.view === "Home") {
    console.log(document.getElementById("patch-notes-overlay"));
    if (document.getElementById("patch-notes-overlay")) {
      console.log("fire");
      document
        .getElementById("patch-notes-overlay")
        .addEventListener("click", () => {
          document.getElementById("patch-notes-overlay").remove();
          win.patchNotesShown = true;
        });
    }
    window.addEventListener("gamepadconnected", function(e) {
      displayMessage(`Gamepad connected.<br />ID: ${e.gamepad.id}`, false);
      win.gamepadPort = e.gamepad.index;
      console.log(win.gamepadPort);
      console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index,
        e.gamepad.id,
        e.gamepad.buttons.length,
        e.gamepad.axes.length
      );
    });

    let startButtons = Array.from(
      document.getElementsByClassName("start-buttons")
    );
    for (let i = 0; i < startButtons.length; i++) {
      startButtons[i].addEventListener("click", () => {
        api.data = getWorldTimeAPI();
        startButtons.forEach((element) => element.remove());
        if (i === 0) {
          game.mode = "arcade";
          if (win.gamesCompleted === 0) {
            middleMenuSetup("firstGameTutorialQuestion");
          } else if (win.gamesCompleted === 2) {
            middleMenuSetup("coupleGamesTutorialQuestion");
          } else {
            middleMenuSetup("timeControl");
          }
        }
        if (i === 1) {
          game.mode = "tutorial";
          tutorial.chainChallenge = false;
          middleMenuSetup("selectTutorial");
        }
        if (i === 2) {
          game.mode = "tutorial";
          tutorial.chainChallenge = true;
          startGame();
        }
        if (i === 3) {
          game.mode = "training";
          startGame();
        }
        if (i === 4) {
          game.mode = "cpu-play";
          game.cursor_type = "defaultCursor";
          middleMenuSetup("setAISpeed");
        }
        // startGame(); // USE WHEN DISABLING MIDDLE MENUS
      });
    }
    win.muteAnnouncer.checked =
      eval(localStorage.getItem("mute-announcer")) || false;
    win.muteMusic.checked = eval(localStorage.getItem("mute-music")) || false;
    win.muteSFX.checked = eval(localStorage.getItem("mute-sfx")) || false;

    document.getElementById("mute-announcer").addEventListener("click", () => {
      localStorage.setItem(
        "mute-announcer",
        document.getElementById("mute-announcer").checked
      );
    });
    document.getElementById("mute-music").addEventListener("click", () => {
      localStorage.setItem(
        "mute-music",
        document.getElementById("mute-music").checked
      );
    });
    document.getElementById("mute-sfx").addEventListener("click", () => {
      localStorage.setItem(
        "mute-sfx",
        document.getElementById("mute-sfx").checked
      );
    });
    if (window.location.host.includes("localhost")) {
      // just to remind me that I am in development mode when website is not live
      document.querySelector("#container").className = `localhost-dev-mode`;
      document.querySelector(
        "#container"
      ).style.backgroundColor = `palegoldenrod`;
    }
  }
}

export function getWorldTimeAPI() {
  console.log("Fetching WorldTime Data...");
  let dateTimeString = "";
  axios
    .get("https://worldtimeapi.org/api/ip")
    .then((response) => {
      dateTimeString = response.data.datetime;
      console.log("Fetch Successful!");
      api.data = extractTimeFromAPI(dateTimeString);
    })
    .catch((error) => {
      console.log("Fetching Worldtime failed", error);
      leaderboard.reason = "no-worldtime";
      return error;
    });
}

export function deleteEntry(_id) {
  axios
    .delete(`${process.env.API}/games/${_id}`) // process.env.API accesses API
    .then((response) => {
      console.log(`Deletion Successful.`);
    })
    .catch((error) => {
      leaderboard.reason = "no-leaderboard";
      displayMessage(`Deletion Failed. ${error}`);
      console.log("Deletion Failed.", error);
    });
}

export function updateEntry(newData, indexToReplace) {
  console.log("entry:", leaderboard.data[indexToReplace]);
  console.log("index:", indexToReplace);
  axios
    .put(
      `${process.env.API}/games/${leaderboard.data[indexToReplace]._id}`,
      newData
    ) // process.env.API accesses API
    .then((response) => {
      console.log(`Update Successful! Setting username to ${newData.name}`);
      localStorage.setItem("username", newData.name);
      localStorage.setItem("kc", newData.kc);
    })
    .catch((error) => {
      leaderboard.reason = "no-leaderboard";
      displayMessage(
        `Failed to Update Leaderboard at Rank ${indexToReplace + 1}. ${error}`,
        true,
        0,
        10000
      );
      console.log(
        `Update Request Failed, index ${indexToReplace}. Error Msg:`,
        error
      );
    });
}

export function sendData(requestData) {
  console.log("Posting data...");
  axios
    .post(`${process.env.API}/games`, requestData) // process.env.API accesses API
    .then((response) => {
      console.log("Posted!");
    })
    .catch((error) => {
      leaderboard.reason = "no-leaderboard";
      displayMessage(`Failed to Post Data. ${error}`);
      console.log("Failed to Post", error);
    });
}

export function getLeaderboardData(populate = false) {
  axios
    .get("https://puzzle-league-arcade.onrender.com/games")
    .then((response) => {
      console.log("Got Leaderboard!");
      leaderboard.data = []; // reset it until new leaderboard appears
      leaderboard.data = response.data.sort((a, b) =>
        parseInt(a.score) < parseInt(b.score) ? 1 : -1
      );
      if (populate) {
        state["Leaderboard"].markup = populateLeaderboard();
        render(state.Leaderboard);
        router.navigate("/Leaderboard");
        console.log("refreshed leaderboard");
        if (document.getElementById("user-post")) {
          console.log("user-post found, scrolling into view");
          document
            .getElementById("user-post")
            .scrollIntoView({ block: "center" });
        }
      }
    })
    .catch((error) => {
      leaderboard.reason = "no-leaderboard";
      console.log("Failed to fetch Leaderboard Data from home page:", error);
      if (!win.running) {
        displayMessage(
          `Failed to access leaderboard database from render server. ${error}`
        );
      }
    });
}

export function displayMessage(msg, err = true, scroll = true, timeout = 9000) {
  if (document.getElementById("app-message"))
    document.getElementById("app-message").remove();
  let appMessageDisplay = document.createElement("div");
  appMessageDisplay.className = "app-message-display";
  appMessageDisplay.setAttribute("id", "app-message");
  document.getElementById("root").prepend(appMessageDisplay);
  let appMessage = document.createElement("h1");
  appMessage.className = "app-message-display";
  appMessage.innerHTML = `<u>${msg}</u>`;
  appMessageDisplay.append(appMessage);
  appMessage.style.color = err ? "#FF5555" : "#55FF55";
  setTimeout(() => {
    if (appMessageDisplay) appMessageDisplay.remove();
    else console.log("message is not there");
  }, timeout);
  if (scroll) {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }
}

export function checkPreselectedControls(controls) {
  let keyboardControls = document.getElementById("keyboard-controls-container");
  // determine keyboard preselection
  keyboardControls[0].selected =
    controls.keyboard.up[0] === 38 && controls.keyboard.swap[1] === 88; // swap is x
  keyboardControls[1].selected =
    controls.keyboard.up[0] === 38 && controls.keyboard.swap[1] !== 88; // swap is z
  keyboardControls[2].selected =
    controls.keyboard.up[0] !== 38 && controls.keyboard.swap[0] === 75; // swap is k
  keyboardControls[3].selected =
    controls.keyboard.up[0] !== 38 && controls.keyboard.swap[0] !== 75; // swap is l

  let gamepadSwap = document.getElementById("gamepad-swap");
  let gamepadRaise = document.getElementById("gamepad-raise");
  let swapArray = Object.values(gamepadSwap)[0];
  console.log(gamepadSwap[0]);
  let gamepad;
  for (let i = 0; i < gamepadSwap.length; i++) {
    gamepadSwap[i].selected = controls.gamepad.swap.includes(i);
    gamepadRaise[i].selected = controls.gamepad.raise.includes(i);
  }
}

router.hooks({
  before: (done, params) => {
    const page =
      params && params.hasOwnProperty("page")
        ? capitalize(params.page)
        : "Home";
    switch (page) {
      case "Leaderboard":
        render(state.Leaderboard);
        document.getElementById("leaderboard-page").innerHTML =
          "Fetching Leaderboard...if 15 seconds have passed, try refreshing the page.";
        document.getElementById("leaderboard-page").style =
          "color:black; font-size:large; text-align: center; padding: 10px;";
        axios
          .get("https://puzzle-league-arcade.onrender.com/games")
          .then((response) => {
            leaderboard.data = response.data.sort((a, b) =>
              parseInt(a.score) < parseInt(b.score) ? 1 : -1
            );
            state[page].markup = populateLeaderboard(true);
            done();
          })
          .catch((error) => {
            leaderboard.reason = "no-leaderboard";
            console.log("Failed to fetch Leaderboard Data:", error);
            // render(state.Home);
            // router.navigate("/Home");
            displayMessage(
              `Failed to fetch leaderboard data. Returned to Home Page. ${error}`
            );
          });
        break;
      default:
        done();
    }
  },
});

router
  .on({
    "/": () => render(state.Home),
    ":page": (params) => render(state[capitalize(params.page)]),
  })
  .resolve();

getLeaderboardData(false); // will wake up collection server on website load
