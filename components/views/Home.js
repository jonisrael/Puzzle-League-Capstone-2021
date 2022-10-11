import html from "html-literal";

export default (st) => html`
  <section id="home-page">
    <div id="container">
      <h1 id="welcome">Welcome to Blockle!</h1>
      <h2 id="author-name">Created by Jonathan Israel</h2>
      <!-- <h1>Controls</h1>
      <ul id="controls">
        <li>Press Arrow keys to <strong>move</strong> the Cursor</li>
        <li>Press S or X to <strong>swap</strong> blocks at the Cursor</li>
        <li>Press R or Z to <strong>raise</strong> the stack one row.</li>
      </ul> -->
      <hr />
      <br />
      <p style="text-align: center;">Play on a touch screen or on keyboard!</p>
      <hr />
      <div id="start-options">
        <button id="arcade-button" class="default-button start-buttons">
          Play Game!
        </button>
        <button id="tutorial-mode" class="default-button start-buttons">
          Tutorials
        </button>
        <button id="chain-challenge-mode" class="default-button start-buttons">
          Chain Challenge
        </button>
        <button id="training-mode" class="default-button start-buttons">
          Endless Mode
        </button>
        <button id="ai-plays-button" class="default-button start-buttons">
          See My AI Play!
        </button>
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
      <!--   -->
    </div>
  </section>
`;
