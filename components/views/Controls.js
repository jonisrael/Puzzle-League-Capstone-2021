import html from "html-literal";

export default (st) => html`
  <section id="set-controls">
    <div id="set-controls-container">
      <h2>Controls</h2>
      <h1>Keyboard Controls Setup</h1>
      <form>
        <p>For keyboard, all controls have Pause/P to Pause/Unpause the game. Pressing ESC once will pause the game, and pressing it again will close the game and return to main menu.</p>
        <p>Select Controls For Keyboard</p>

        <div id=keyboard-controls-container>
          <div id=left-choice-container class=choice-container>
            <label id=left-label>Left</label>
            <select id="left" class=kb-controls></select>
          </div>
          <div id=up-choice-container class=choice-container>
            <label id=up-label>Up</label>
            <select id="up" class=kb-controls></select>
          </div>
          <div id=right-choice-container class=choice-container>
            <label id=right-label>Right</label>
            <select id="right" class=kb-controls></select>
          </div>
          <div id=down-choice-container class=choice-container>
            <label id=down-label>Down</label>
            <select id="down" class=kb-controls></select>
          </div>
          <div id=swap-choice-container class=choice-container>
            <label id=swap-1-label>Swap</label>
            <select id="swap-1" class=kb-controls></select>
            <label id=swap-2-label>Swap Alt</label>
            <select id="swap-2" class=kb-controls></select>
          </div>
          <div id=raise-choice-container class=choice-container>
            <label id=raise-1-label>Raise</label>
            <select id="raise-1" class=kb-controls></select>
            <label id=raise-2-label>Raise Alt</label>
            <select id="raise-2" class=kb-controls></select>
          </div>
        </div>
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
    </div>


    <div class="mobile-not-available-message">
      <p>This page is for keyboard/gamepad users on a desktop computer! Please go to a different page!</p>
    </div>
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
