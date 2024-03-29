import html from "html-literal";

export default (st) => html`
  <section id="home-page">
    <div id="container">
      <h1 id="welcome">Welcome to Puzzle League Arcade!</h1>
      <h2 id="author-name">Created by Jonathan Israel</h2>
      <!-- <h1>Controls</h1>
      <ul id="controls">
        <li>Press Arrow keys to <strong>move</strong> the Cursor</li>
        <li>Press S or X to <strong>swap</strong> blocks at the Cursor</li>
        <li>Press R or Z to <strong>raise</strong> the stack one row.</li>
      </ul> -->
      <hr />
      <h1>Controls</h1>
      <p style="text-align: center;">
        This game can be played both on a computer and a mobile device!
        <br /><strong>Mobile: </strong>You can use a touch screen to order
        blocks to move horizontally or vertically. <br /><strong
          >Desktop:</strong
        >
        Use classic Puzzle League controls with the arrow keys to move the
        cursor, X or S to swap blocks, and Z or R to raise the stack. New to my
        game, you can press C or T to turn the cursor 90 degrees.
      </p>
      <hr />
      <h1>How to play</h1>
      <p>
        <strong>
          Clear blocks and score points by matching 3 or more blocks vertically
          or horizontally.</strong
        >
        You can do this by swapping blocks horizontally. If you match more than
        3, and you'll get a slight bonus based on the size of the clear.
      </p>
      <p>
        You can also score points by creating a
        <strong>chain</strong>. You can create a chain by setting up a second
        combo on top of a recently cleared combo such that when the blocks hit
        the ground, they match with other blocks. This is visually explained in
        the tutorial above. Chains are the best way to score points.
      </p>
      <p>
        The game ends when the stack reaches the top. The speed of the game will
        increase in incremental levels, along with the score you earn for clears
        and chains. At the end of the time control (usually two minutes),
        "Overtime" occurs, and the stack speed will significantly increase until
        you lose. However, the score you earn here will be at least doubled, and
        you'll also gain points based on how long you survive.
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
      <div id="start-options">
        <button id="arcade-button" class="default-button start-buttons">
          Play Game!
        </button>
        <button id="tutorial-mode" class="default-button start-buttons">
          Interactive Tutorials (2022)
        </button>
        <button id="chain-challenge-mode" class="default-button start-buttons">
          Chain Puzzle
        </button>
        <button id="training-mode" class="default-button start-buttons">
          Training Mode
        </button>
        <button id="ai-plays-button" class="default-button start-buttons">
          See My AI Play!
        </button>
      </div>
      <hr />
      <p>
        This game is inspired by the 90's "Puzzle League" series and plays in a
        similar way. However, this is my own program that uses its own code
        built from scratch using pure Javascript. I have developed unique
        mechanics and control systems not in the original games, as well as a
        more simplified scoring system. You can check out more information in
        the "Tutorials" section (many tutorials are still in development).
      </p>
      <hr />
    </div>
  </section>
`;
