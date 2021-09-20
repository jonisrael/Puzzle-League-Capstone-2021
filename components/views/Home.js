import html from "html-literal";

export default st => html`
  <section id="home-page">
    <div id="container">
      <h1>Controls:</h1>
      <ul style="list-style-type:none; font-size:large;">
        <li>Press Arrow keys to <strong>move</strong> the Rectangle Cursor</li>
        <li>Press S or X to <strong>swap</strong> blocks at the Cursor</li>
        <li>Press R or Z to <strong>raise</strong> the stack one row.</li>
      </ul>
      <hr />
      <h3>
        Clear blocks by matching 3 adjacent blocks. If you match 4 or more you
        will get more points. Create chains by matching a second combo on top of
        a recently cleared combo before the blocks fall. Chains will get you the
        most points. You lose when the stack reaches the top.
      </h3>
      <h3>
        The stack rise speed will get faster every 20 seconds, which also
        increases the multiplier of combos/chains by 0.1x. At two minutes,
        "overtime" begins, and the stack rise speed will be extremely fast.
        However, all point scores will be doubled. After the game ends, you can
        submit your score to the leaderboard. Practice up, and see if you can
        get that #1 spot!
      </h3>
      <hr />
      <h3 style="color:red">
        It should be noted that pure javascript is not the most consistent at
        running the game. There are issues with the game both running too slow.
        If the app detects that the frame rate has been low for a significant
        portion of the game, you may be notified that your score will have a *
        next to it and may need to be reviewed based on your computer's
        performance information that is sent to the server upon posting a score.
      </h3>
      <div id="game-container">
        <div id="left-column">
          <button id="start-button" class="default-button">
            Click to Play<br />
            60FPS (Smoothest)
          </button>
        </div>
        <div id="right-column">
          <button id="double-button" class="default-button">
            Click to Play<br />
            30 FPS (Recommended)
          </button>
        </div>
      </div>
    </div>
  </section>
`;

//<!-- <canvas id ="canvas" width="192" height="384", background-color></canvas>  -->
//<!-- <canvas id ="canvas" width="192" height="448", background-color></canvas>  -->
