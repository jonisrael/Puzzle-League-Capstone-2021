import html from "html-literal";

export default (links) => html`
  <nav id="nav-bar">
    <i class="fas fa-bars"></i>
    <ul class="nav-links">
      ${links.map(
        (link) =>
          `<li><a href="/${link.title}" title="${link.title}" style="color:${
            link.title === "Home" ? "yellow" : "white"
          }" data-navigo>${link.text}</a></li>`
      )}
    </ul>
  </nav>
`;
