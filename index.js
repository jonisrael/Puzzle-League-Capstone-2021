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
import { startGame } from "./scripts/functions/beginGame";
import { extractTimeFromAPI } from "./scripts/functions/submitResults";
import { pause, unpause } from "./scripts/functions/pauseFunctions";
import { audio } from "./scripts/fileImports";
dotenv.config();

const router = new Navigo(window.location.origin);

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
      render(state[event.target.title]);
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
  if (st.view === "Home") {
    document.getElementById("arcade-button").addEventListener("click", () => {
      document.getElementById("arcade-button").remove();
      api.data = getWorldTimeAPI();
      game.mode = "arcade";
      startGame(2);
    });
    document.getElementById("training-button").addEventListener("click", () => {
      document.getElementById("training-button").remove();
      game.mode = "training";
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
  if (st.view !== "Home") game.Music.volume = 0;
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
      console.log("Fetch failed", error);
      return error;
    });
}

export function sendData(requestData) {
  console.log("Posting data...");
  axios
    .post(`${process.env.API}/games`, requestData) // process.env.API accesses API
    .then(response => {
      console.log("Posted!");
      state.Home.games.push(response.data);
    })
    .catch(error => {
      console.log("Failed to Post", error);
    });
}

router.hooks({
  before: (done, params) => {
    const page =
      params && params.hasOwnProperty("page")
        ? capitalize(params.page)
        : "Home";

    switch (page) {
      case "Home":
        axios
          .get("https://puzzle-league-blitz.herokuapp.com/games")
          .then(response => {
            let sortedData = response.data.sort((a, b) =>
              parseInt(a.score) < parseInt(b.score) ? 1 : -1
            );
            let rankedData = [];
            let unrankedData = [];
            sortedData.filter(entry => {
              entry.ranked ? rankedData.push(entry) : unrankedData.push(entry);
            });
            for (let i = 0; i < 10; i++) {
              leaderboard.topRankedList.push(rankedData[i]);
            }
            if (rankedData.length > 50) {
              leaderboard.minRankedScore = rankedData[49];
            }
            if (unrankedData.length > 50) {
              leaderboard.minRankedScore = rankedData[49];
            }
          });
        break;
      case "Leaderboard":
        axios
          .get("https://puzzle-league-blitz.herokuapp.com/games")
          .then(response => {
            let sortedData = response.data.sort((a, b) =>
              parseInt(a.score) < parseInt(b.score) ? 1 : -1
            );
            let rankedData = [];
            let unrankedData = [];
            sortedData.filter(entry => {
              entry.ranked ? rankedData.push(entry) : unrankedData.push(entry);
            });
            state[page].rankedGames = rankedData;
            state[page].unrankedGames = unrankedData;
            let leaderboardData = [rankedData, unrankedData];

            state[page].rankedMarkup = "a";
            state[page].unrankedMarkup = "b";

            for (let i = 0; i < 2; i++) {
              let markup = "";
              for (let rank = 0; rank < leaderboardData[i].length; rank++) {
                let entry = leaderboardData[i][rank];
                let score = entry.score;
                if (parseInt(score) > 99999) score = "99999";
                while (score.length < 5) {
                  score = "0" + score;
                }

                let largestChain = `${entry.largestChain}`;
                if (largestChain.length === 1)
                  largestChain = `0${largestChain}`;

                let totalClears = `${entry.totalClears}`;
                if (totalClears.length === 1) totalClears = `00${totalClears}`;
                if (totalClears.length === 2) totalClears = `0${totalClears}`;
                if (totalClears.length > 3) totalClears = "999";

                markup += `
                <tr>
                  <td>
                    ${rank + 1}
                  </td>
                  <td>
                    ${score}
                  </td>
                  <td>
                    ${entry.name}
                  </td>
                  <td>
                    ${entry.duration}
                  </td>
                  <td>
                    ${largestChain}
                  </td>
                  <td>
                    ${totalClears}
                  </td>
                  <td>
                  ${entry.month}/${entry.day}/${entry.year.slice(2.4)}
                  </td>
                  <td>
                  ${entry.hour}:${entry.minute} ${entry.meridian}
                  </td>
                </tr>
                `;
              }
              i == 0
                ? (state[page].rankedMarkup = markup)
                : (state[page].unrankedMarkup = markup);
            }

            done();
          })
          .catch(error => {
            console.log("Failed to fetch Leaderboard:", error);
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
