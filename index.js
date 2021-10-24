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
  loadAllAudios,
  loadedAudios,
  leaderboard
} from "./scripts/global";
import { startGame } from "./scripts/functions/startGame";
import { extractTimeFromAPI } from "./scripts/functions/submitResults";
import { populateLeaderboard } from "./scripts/functions/populateLeaderboard";
import { showPatchNotes } from "./scripts/functions/showPatchNotes";
dotenv.config();

export const router = new Navigo(window.location.origin);

export function render(st) {
  console.log(`loaded audios: ${loadedAudios.length}`);
  win.view = st.view;
  win.viewChanged = true;
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
  `;
  router.updatePageLinks();

  if (st.view === "Home" && !win.patchNotesShown) {
    win.patchNotesShown = true;
    // showPatchNotes();
  }
  addEventListeners(st);
}

function addEventListeners(st) {
  // add event listeners to Nav items for navigation
  document.querySelectorAll("nav a").forEach(navLink =>
    navLink.addEventListener("click", event => {
      event.preventDefault();
      // Failsafe: If already on home page, do not reload it upon clicking it.
      win.running = false;
      game.Music.volume = 0;
      // If on homepage and game playing, revert to homepage. If game not playing, start game.
      if (st.view === "Home" && state[event.target.title].view === "Home") {
        if (document.getElementById("canvas"))
          render(state[event.target.title]);
        else {
          game.mode = "arcade";
          startGame(2);
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
    document.querySelectorAll(".refresh").forEach(item => {
      item.addEventListener("click", () => {
        item.innerHTML = "Fetching...";
        getLeaderboardData(true);
      });
    });
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
    document.getElementById("arcade-button").addEventListener("click", () => {
      api.data = getWorldTimeAPI();
      game.mode = "arcade";
      win.controls = "arrow";
      document.getElementById("arcade-button").remove();
      document.getElementById("wasd-arcade-button").remove();
      document.getElementById("watch-ai-play-button").remove();
      startGame(2);
    });
    document
      .getElementById("wasd-arcade-button")
      .addEventListener("click", () => {
        api.data = getWorldTimeAPI();
        game.mode = "arcade";
        win.controls = "wasd";
        document.getElementById("arcade-button").remove();
        document.getElementById("wasd-arcade-button").remove();
        document.getElementById("watch-ai-play-button").remove();
        startGame(2);
      });
    document
      .getElementById("watch-ai-play-button")
      .addEventListener("click", () => {
        game.mode = "ai playtime";
        document.getElementById("arcade-button").remove();
        document.getElementById("wasd-arcade-button").remove();
        document.getElementById("watch-ai-play-button").remove();
        startGame(2);
      });
    document.addEventListener("click", () => {
      if (loadedAudios.length == 0) {
        console.log("user has clicked the document, loading audios.");
        loadAllAudios();
      }
    });
    document.addEventListener("keydown", () => {
      if (loadedAudios.length == 0) {
        console.log("user has pressed a key, loading audios.");
        loadAllAudios();
      }
    });
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
  }
}

export function getWorldTimeAPI() {
  console.log("Fetching WorldTime Data...");
  let dateTimeString = "";
  axios
    .get("https://worldtimeapi.org/api/ip")
    .then(response => {
      dateTimeString = response.data.datetime;
      console.log("Fetch Successful!");
      api.data = extractTimeFromAPI(dateTimeString);
    })
    .catch(error => {
      console.log("Fetching Worldtime failed", error);
      leaderboard.reason = "no-worldtime";
      return error;
    });
}

export function deleteEntry(_id) {
  axios
    .delete(`${process.env.API}/games/${_id}`) // process.env.API accesses API
    .then(response => {
      console.log(`Deletion Successful.`);
    })
    .catch(error => {
      leaderboard.reason = "no-leaderboard";
      displayError(`Deletion Failed. ${error}`);
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
    .then(response => {
      console.log(`Update Successful. Setting username to ${newData.name}`);
      localStorage.setItem("username", newData.name);
    })
    .catch(error => {
      leaderboard.reason = "no-leaderboard";
      displayError(
        `Failed to Update Leaderboard at Rank ${indexToReplace + 1}. ${error}`
      );
      console.log("Update Failed, index ${indexToReplace)", error);
    });
}

export function sendData(requestData) {
  console.log("Posting data...");
  axios
    .post(`${process.env.API}/games`, requestData) // process.env.API accesses API
    .then(response => {
      console.log("Posted!");
    })
    .catch(error => {
      leaderboard.reason = "no-leaderboard";
      displayError(`Failed to Post Data. ${error}`);
      console.log("Failed to Post", error);
    });
}

export function getLeaderboardData(populate = false) {
  axios
    .get("https://puzzle-league-blitz.herokuapp.com/games")
    .then(response => {
      leaderboard.data = response.data.sort((a, b) =>
        parseInt(a.score) < parseInt(b.score) ? 1 : -1
      );
      console.log("Got Leaderboard!");
      console.log(leaderboard.data);
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
    .catch(error => {
      leaderboard.reason = "no-leaderboard";
      console.log("Failed to fetch Leaderboard Data from home page:", error);
      displayError(
        `Failed to access leaderboard database from heroku server. ${error}`
      );
    });
}

export function displayError(theError) {
  let errorDisplay = document.createElement("div");
  errorDisplay.className = "error-display";
  document.getElementById("root").prepend(errorDisplay);
  let errorMessage = document.createElement("h1");
  errorMessage.className = "error-display";
  errorMessage.innerHTML = `<br /><u>${theError}</u><br><br><hr>`;
  errorDisplay.append(errorMessage);
  window.scrollTo(0, 0);
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
          "color:red; font-size:large; text-align: center; padding: 10px;";
        axios
          .get("https://puzzle-league-blitz.herokuapp.com/games")
          .then(response => {
            leaderboard.data = response.data.sort((a, b) =>
              parseInt(a.score) < parseInt(b.score) ? 1 : -1
            );
            state[page].markup = populateLeaderboard();
            done();
          })
          .catch(error => {
            leaderboard.reason = "no-leaderboard";
            console.log("Failed to fetch Leaderboard Data:", error);
            render(state.Home);
            router.navigate("/Home");
            displayError(
              `Failed to fetch leaderboard data. Returned to Home Page. ${error}`
            );
          });
        break;
      default:
        done();
    }
  }
});

router
  .on({
    "/": () => render(state.Home),
    ":page": params => render(state[capitalize(params.page)])
  })
  .resolve();
