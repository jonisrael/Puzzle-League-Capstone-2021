import html from "html-literal";

export default (st) => html`
  <header id="header">
    <h1>Puzzle League Arcade (01/31 3:10pm)</h1>
    <h1 style="color:white">${st.header}</h1>

    <ul id="sound-mute-menu">
      <input type="checkbox" id="mute-announcer" class="mute-buttons"></input>
      <label for="mute-sfx">Mute Announcer</label>
      <input type="checkbox" id="mute-music" class="mute-buttons"></input>
      <label for="mute-sfx">Mute Music</label>
      <input type="checkbox" id="mute-sfx" class="mute-buttons"></input>
      <label for="mute-sfx">Mute SFX</label>
    </ul>
  </header>
`;
