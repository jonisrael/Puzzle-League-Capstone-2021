// import html from "html-literal";
import { game } from "../global";

export function submitResults() {
  let homePage = document.getElementById("home-page");
  let form = document.createElement("form");
  form.setAttribute("id", "form");
  form.setAttribute("method", "POST");
  form.setAttribute("action", "");
  homePage.appendChild(form);
  let gameOver = document.createElement("h2");
  gameOver.setAttribute("id", "game-over");
  gameOver.innerHTML = "Game Over!";
  homePage.appendChild(gameOver);
}
