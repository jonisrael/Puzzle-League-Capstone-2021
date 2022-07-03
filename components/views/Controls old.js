import html from "html-literal";

export default st => html`
  <section id="set-controls">
    <h2>Controls</h2>
    <h1>Keyboard Controls Setup</h1>
    <form>
      <p>For keyboard, all controls have Pause/P to Pause/Unpause the game. Pressing ESC once will pause the game, and pressing it again will close the game and return to main menu.</p>
      <label for="keyboard-controls">Select Controls Scheme for Keyboard</label>
      <select name="keyboard-controls" id="keyboard-controls" size="1" required>
        <option value="arrow-xs-zr">Arrow Key Movement, X/S Swap, Z/R Raise (Default)</option>
        <option value="arrow-zr-xs">Arrow Key Movement, Z/S Swap, X/R Raise</option>
        <option value="wasd-k4-l5">WASD Movement, K/NumPad4 Swap, L/NumPad5 Raise</option>
        <option value = "wasd-l4-k5">WASD Movement, L/NumPad5 Swap, K/NumPad4 Raise</option>
      </select>
      <br>
      <br>
      <h1>Gamepad Controls Setup (Experimental)</h1>
      <p>For gamepad, all movement is controlled by left/right stick /d-pad and pause is controlled by Start/Options/Menu/Pause Button. In the Pause menu, Pressing Start will Pause/Unpause the game and pressing Raise will do quick-restart. All controls use Nintendo Switch button names and layout.</p>
      <div id="controls-container">
      <div>
      <label for="gamepad-swap">
        Select Swap Gamepad Button(s) (Hold CTRL for Multiple Inputs)
      </label>
      <br>
      <select name="gamepad-swap" id="gamepad-swap" size="8" required multiple>
        <option selected>B Button (0)</option>
        <option selected>A Button (1)</option>
        <option>Y Button (2)</option>
        <option>X Button (3)</option>
        <option>L Button (4)</option>
        <option>R Button (5)</option>
        <option>ZL Button (6)</option>
        <option>ZR Button (7)</option>
      </select>
    </div>
    <br>
    <div id="vl"></div>
    <div>
    <label for="gamepad-raise">Select Raise Gamepad Button(s) (Hold CTRL for Multiple Inputs)</label>
    <br>
      <select name="gamepad-raise" id="gamepad-raise" size="8" required multiple>
      <option>A Button (0)</option>
        <option>B Button (1)</option>
        <option>Y Button (2)</option>
        <option>X Button (3)</option>
        <option selected>L Button (4)</option>
        <option selected>R Button (5)</option>
        <option>ZL Button (6)</option>
        <option>ZR Button (7)</option>
      </select>
      <br>
      </div>
      </div>
      <input type="submit" id="accept-game-controls" class="default-button" value="Save Changes"></input>
      <button id="restore-defaults" class="default-button">Restore Defaults</button>
    </form>

  </section>
`;

/* <form>
<label for="up">Up / Menu Up</label>
<input type="text" id="up" name="up" maxlength="1" /><br />

<label for="down">Down / Menu Down</label>
<input type="text" id="down" name="down" maxlength="1" required /><br />

<label for="left">Left / Menu Left</label>
<input type="text" id="left" name="left" maxlength="1" required /><br />

<label for="right">Right / Menu Right (Alt)</label>
<input type="text" id="right" name="right" maxlength="1" required /><br />

<label for="swap">Swap / Menu Select</label>
<input type="text" id="swap" name="swap" maxlength="1" required /><br />

<label for="raise">Raise / Menu Restart</label>
<input type="text" id="raise" name="raise" maxlength="1" /><br />

<label for="pause">Pause / Unpause / Start Game</label>
<input type="text" id="pause" name="pause" maxlength="1" /><br />

<label for="menu">Pause / Return to Main Menu</label>
<input type="text" id="menu" name="menu" maxlength="1" /><br />
</form> */
