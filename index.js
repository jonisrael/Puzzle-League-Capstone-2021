import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";

import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
import dotenv from "dotenv";
import { win, api, game } from "./scripts/global";
import { startGame } from "./scripts/functions/beginGame";
import { extractTimeFromAPI } from "./scripts/functions/submitResults";
import { pause, unpause } from "./scripts/functions/pauseFunctions";
dotenv.config();

const router = new Navigo(window.location.origin);

function render(st) {
  win.view = st.view;
  win.viewChanged = true;
  console.log("render has been called");
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
      if (!(st.view === "Home" && state[event.target.title].view === "Home")) {
        render(state[event.target.title]);
      } else {
        location.reload();
      }
    })
  );

  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );

  // event listener for the the home/game page
  if (st.view === "Home") {
    win.muteAnnouncer = document.getElementById("mute-announcer");
    win.muteMusic = document.getElementById("mute-music");
    win.muteSFX = document.getElementById("mute-sfx");
    let container = document.getElementById("container");

    let startButton = document.createElement("button");
    startButton.setAttribute("id", "click-to-play");
    startButton.className = "default-button";
    startButton.innerHTML = "Click to play";
    container.appendChild(startButton);
    startButton.addEventListener("click", () => {
      startButton.remove();
      getWorldTimeAPI();
      startGame(1);
    });
    let doubleButton = document.createElement("button");
    doubleButton.setAttribute("id", "double-to-play");
    doubleButton.className = "default-button";
    doubleButton.innerHTML = "Double to play";
    container.appendChild(doubleButton);
    doubleButton.addEventListener("click", () => {
      doubleButton.remove();
      getWorldTimeAPI();
      startGame(2);
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
      case "Leaderboard":
        axios
          .get("https://puzzle-league-blitz.herokuapp.com/games")
          .then(response => {
            let sortedData = response.data.sort((a, b) =>
              parseInt(a.score) < parseInt(b.score) ? 1 : -1
            );
            state[page].games = sortedData;
            console.log(state[page]);
            console.log(sortedData);
            state[page].markup = "";
            for (let entry of sortedData) {
              let score = entry.score;
              if (parseInt(score) > 99999) score = "99999";
              while (score.length < 5) {
                score = "0" + score;
              }

              let name = entry.name;
              while (name.length < 15) {
                if (name.length % 2 == 0) {
                  name += " ";
                } else {
                  name = " " + name;
                }
              }

              let largestChain = `${entry.largestChain}`;
              if (largestChain.length === 1) largestChain = `0${largestChain}`;

              let totalClears = `${entry.totalClears}`;
              if (totalClears.length === 1) totalClears = `00${totalClears}`;
              if (totalClears.length === 2) totalClears = `0${totalClears}`;
              if (totalClears.length > 3) totalClears = "999";

              state[page].markup += `|  ${name}  |  ${score}  |    ${
                entry.duration
              }    |      ${largestChain}      |       ${totalClears}        |  ${
                entry.month
              }/${entry.day}/${entry.year.slice(2.4)} ${entry.hour}:${
                // slice used to not overwrite old leaderboard data
                entry.minute
              } ${entry.meridian}  |<br>`;
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
