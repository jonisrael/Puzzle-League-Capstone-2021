import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";

import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
import dotenv from "dotenv";
import { win, api } from "./scripts/global";
import { startGame, generateOpeningBoard } from "./app";
import { extractTimeFromAPI } from "./scripts/functions/submitResults";

dotenv.config();

const router = new Navigo(window.location.origin);

router
  .on({
    "/": () => render(state.Home),
    ":page": params => render(state[capitalize(params.page)])
  })
  .resolve();

// render(state.Home);

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
      // Failsafe: Do not reload home page if already on home-page
      if (!(st.view === "Home" && state[event.target.title].view === "Home")) {
        render(state[event.target.title]);
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
    let homePage = document.getElementById("home-page");
    let startButton = document.createElement("button");
    startButton.setAttribute("id", "click-to-play");
    startButton.innerHTML = "Click to play";
    homePage.appendChild(startButton);
    startButton.addEventListener("click", () => {
      startButton.remove();
      startGame();
    });
  }
}

export function getWorldTimeAPI() {
  console.log("getting worldTimeAPI");
  let dateTimeString = "";
  axios
    .get("https://worldtimeapi.org/api/ip")
    .then(response => {
      dateTimeString = response.data.datetime;
      console.log("Fetch Successful");
      console.log(dateTimeString);
      api.data = extractTimeFromAPI(dateTimeString);
    })
    .catch(error => {
      console.log("Fetch failed", error);
      return error;
    });
  // generateOpeningBoard();
}

export function sendData(requestData) {
  let dateTimeString;
  axios
    .post(`${process.env.API}/games`, requestData) // process.env.API accesses API
    .then(response => {
      console.log("Posted!");
      state.Home.games.push(response.data);
      // router.navigate("/Games");
    })
    .catch(error => {
      console.log("Failed to Post", error);
    });
}

// router.hooks({
//   before: (done, params) => {
//     const page =
//       params && params.hasOwnProperty("page")
//         ? capitalize(params.page)
//         : "Home";

//     switch (page) {
//       case "Home" {
//         axios
//         .get(`${process.env.API}/games`)
//         .then(response =>) {

//         }
//         break;
//       }
//       default:
//         done();
//     }
//   }
// });

router
  .on({
    "/": () => render(state.Home),
    ":page": params => render(state[capitalize(params.page)])
  })
  .resolve();

export { router };
