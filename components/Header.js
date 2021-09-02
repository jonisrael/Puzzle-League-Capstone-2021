import html from "html-literal";

export default st => html`
  <header>
    <h1>Jonathan Israel SPA ${st.header}</h1>

    <ul id="sound-mute-menu">
      <input type="checkbox" id="mute-announcer"></input>
      <label for="mute-sfx">Mute Announcer</label>
      <input type="checkbox" id="mute-music"></input>
      <label for="mute-sfx">Mute Music</label>
      <input type="checkbox" id="mute-sfx"></input>
      <label for="mute-sfx">Mute SFX</label>
    </ul>
  </header>
`;
