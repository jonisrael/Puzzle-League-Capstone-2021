import html from "html-literal";

export default st => html`
  <section id="set-controls">
    <h1>Set Up Controls</h1>
    <h2>All Controls Use Nintendo Switch Button Names</h2>
    <form>
      <p>For keyboard, all controls have Pause/P to Pause/Unpause the game. Pressing ESC once will pause the game, and pressing it again will close the game and return to main menu.</p>
      <label for="keyboard-controls">Select Controls Scheme for Keyboard</label>
      <select name="keyboard-controls" id="keyboard-controls" required>
        <option value = "arrow-x-swap">Arrow Key Movement, X/S Swap, Z/R Raise (Default)</option>
        <option value = "arrow-z-swap">Arrow Key Movement, Z/R Swap, XS Raise</option>
        <option value = "wasd-k-swap">WASD Movement, K/NumPad1 Swap, L/NumPad2 Raise</option>
        <option value = "wasd-l-swap">WASD Movement, L/Num2 Swap, K/Num1 Raise</option>
      </select>
      <br>
      <br>
      <h1>Gamepad Controls Setup</h1>
      <p>For gamepad, all movement is controlled by left stick /d-pad and pause is controlled by Start/Options/Menu/Pause Button. In the Pause menu, Pressing Start will Pause/Unpause the game and pressing Raise will do quick-restart.</p>
      <label for="gamepad-swap">Select Gamepad Swap Button (Nintendo Switch Layout)</label>
      <select name="gamepad-swap" id="gamepad-swap" required>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="X">X</option>
        <option value="Y">Y</option>
        <option value="L">L</option>
        <option value="R">R</option>
        <option value="ZL">ZL</option>
        <option value="ZR">ZR</option>
      </select>
      <label for="gamepad-raise">Select Gamepad Raise Button (Nintendo Switch Layout)</label>
      <select name="gamepad-raise" id="gamepad-raise" required>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="X">X</option>
        <option value="Y">Y</option>
        <option value="L">L</option>
        <option value="R">R</option>
        <option value="ZL">ZL</option>
        <option value="ZR">ZR</option>
      </select>
      <input type="submit" value="controls" id="game-controls">Accept Changes</input>
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
