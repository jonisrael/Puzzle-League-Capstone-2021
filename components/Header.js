import html from "html-literal";

export default (st) => html`
  <header id="header">
    <h1 id="pla-title">Puzzle League Arcade</h1>
    <h2 id=version-release>Last Update: 11/15/22</h2>
    <h1 id="current-page" style="color:white">${st.header}</h1>

    <ul id="sound-mute-menu">
      <input type="checkbox" id="mute-announcer" class="mute-buttons"></input>
      <label for="mute-sfx">Mute Announcer</label>
      <br class="nav-breaks">
      <input type="checkbox" id="mute-music" class="mute-buttons"></input>
      <label for="mute-sfx">Mute Music</label>
      <br class="nav-breaks">
      <input type="checkbox" id="mute-sfx" class="mute-buttons"></input>
      <label for="mute-sfx">Mute SFX</label>
    </ul>
  </header>
`;
