import { Header, Nav, Main, Footer } from "./components";
import * as state from "/store";
import Navigo from "navigo";
import { capitalize } from "lodash";

const router = new Navigo(window.location.origin);

router.on({
  ":page": params => render(state[capitalize(params.page)]),
  "/": () => render(state.Home)
});

function render(st) {
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
  `;

  router.updatePageLinks();
}

render(state.Home);
