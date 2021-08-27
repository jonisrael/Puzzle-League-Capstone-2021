import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";

import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
import dotenv from "dotenv";
import { win } from "./scripts/global";
import { startGame } from "./app";

dotenv.config();

let currentView = "";
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
      render(state[event.target.title]);
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
    console.log(homePage);
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

// router.hooks({
//   before: (done, params) => {
//     const page =
//       params && params.hasOwnProperty("page")
//         ? capitalize(params.page)
//         : "Home";

//     switch (page) {
//       case "Home" {

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

export { router, currentView };
