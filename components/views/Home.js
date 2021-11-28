import html from "html-literal";

export default st => html`
  <section id="home-page">
    <div id="container">
      <h2 style="color:white;">Welcome to Puzzle League: Arcade Edition!</h2>
      <h1>Controls</h1>
      <ul id="controls">
        <li>Press Arrow keys to <strong>move</strong> the Cursor</li>
        <li>Press S or X to <strong>swap</strong> blocks at the Cursor</li>
        <li>Press R or Z to <strong>raise</strong> the stack one row.</li>
      </ul>
      <hr />
      <div id="game-container">
        <div id="left-column">
          <button id="arcade-button" class="default-button start-buttons">
            Play Arcade! (Enter)
          </button>
          <button
            id="training-mode"
            class="default-button start-buttons"
            style="display:none"
          >
            Play Arcade!<br />WASD Controls<br />(W)
          </button>
        </div>
        <div id="right-column">
          <button
            id="watch-ai-play-button"
            class="default-button start-buttons"
          >
            Watch the AI Play! (B)
          </button>
        </div>
      </div>
      <hr />
      <h1>How to play</h1>
      <p>
        <strong
          >Clear blocks by matching 3 or more blocks vertically or
          horizontally.</strong
        >
        This is a <strong>combo</strong>, and is the basic way to score points.
        If you create a combo of 4 or more, you will get a small bonus depending
        on its size.
      </p>
      <p>
        The more advanced way score points is to create a
        <strong>chain</strong>. You can create a chain by setting up a second
        combo on top of a recently cleared combo such that when the blocks hit
        the ground, they match with other blocks. Chains will get you points
        much faster than single combos on their own. and the larger they are,
        the better bonus you get. More information is in the "Tutorials"
        section.
      </p>
      <p>
        The game ends when the stack reaches the top. The stack rise speed will
        get faster every 20 seconds, which also increases the multiplier amount
        of score earned. More information in the "Scoring" section.
      </p>
      <p>
        After the game ends, you can submit your scores to the leaderboard. The
        <a href="https://www.youtube.com/watch?v=oVI8MO4220w&ab_channel=Duke2go"
          >Announcer</a
        >
        will be watching and cheering you on, so be sure to give it your best
        shot!
      </p>
      <hr />
      <h1>Compatibility</h1>
      <p>
        This game is keyboard only, though I may try and add experimental
        mouse/touch support in the future for moving tiles. This game
        <strong>does NOT usually run on Firefox correctly</strong>, but runs
        fine on Chrome, Safari, and Edge, with Edge somehow having the best
        performance results (If you have a Windows computer, Microsoft Edge is
        preinstalled).
      </p>
      <hr />
      <h1>Game Controller Support</h1>
      <p>
        It is now released! However it is experimental and may not work on all
        devices or controllers. You can click the "Set Controls" view at the top
        to set your controls. If a gamepad is detected to be connected, a
        message will appear at the top of the page.
      </p>
      <hr />
      <h1 style="color:red">Notice about Posting Scores</h1>
      <p style="color:black">
        This game was written in javascript as a capstone for the
        <a href="https://savvycoders.com/fullstackdevelopmentcourse/"
          >Savvy Coders Full Stack Development Bootcamp</a
        >.
        <strong
          >Unfortunately it is not a consistent programming language with
          running games optimally</strong
        >, and there are issues with the game running too slowly on certain
        computers and can lead to an unintended advantage. If the app detects
        that the in-game timer is six or more seconds behind real time,
        <strong>your score cannot be ranked.</strong>
      </p>
    </div>
  </section>
`;
