import html from "html-literal";

export default links => html`
  <nav>
    <i class="fas fa-bars"></i>
    <ul class="hidden--mobile nav-links">
      ${links.map(
        link =>
          `<li><a href="/${link.title}" title="${link.title}" data-navigo>${link.text}</a></li>`
      )}
    </ul>
  </nav>
`;

// export default links => html`
// <nav id="nav-bar">
//     <ul>
//         <li><a href="Home.html">Home</a></li>
//         <li><a href="Tutorial.html">News</a></li>
//         <li><a href="contact.html">Contact</a></li>
//         <li><a href="about.asp">About</a></li>
//     </ul>
// </nav>
// `;
