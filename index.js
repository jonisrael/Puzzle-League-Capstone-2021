import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";

import Navigo from "navigo";
import { capitalize } from "lodash";
import axios from "axios";
import dotenv from "dotenv";
import { win } from "./scripts/global";

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
  currentView = st.view;
  console.log("render has been called");
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
  `;
  router.updatePageLinks();

  // addEventListeners(st);
}

export { currentView };
