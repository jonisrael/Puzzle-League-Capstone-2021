import html from "html-literal";

export default st => html`
  <section id="home-page">
    <div id="container">
      <h2 style="color:white;">Welcome to Puzzle League: Arcade Edition!</h2>

      <h1>Controls</h1>
      <ul id="controls">
        <li>
          Press Arrow keys to <strong>move</strong> the Rectangular Cursor
        </li>
        <li>Press S or X to <strong>swap</strong> blocks at the Cursor</li>
        <li>Press R or Z to <strong>raise</strong> the stack one row.</li>
      </ul>
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
        <strong>does NOT run on Firefox correctly</strong>, but runs fine on
        Chrome, Safari, and Edge, with Edge somehow having the best performance
        results (If you have a Windows computer, Microsoft Edge is
        preinstalled).
      </p>
      <hr />
      <h1>Game Controller Support</h1>
      <p>...there isn't any currently. HOWEVER, you can use applications like <a href = https://joytokey.net/en/>JoyToKey</a> or <a href="https://keysticks.net/">Keysticks</a> to map buttons to keyboard inputs. I may add this support later depending on website popularity.</p>
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
        computers and can lead to an unintended advantage If
        the app detects that the in-game timer is five or more seconds behind a
        real timer,
        <strong>your score cannot be ranked.</strong>
      </p>
      <div id="game-container">
        <div id="left-column">
          <button id="arcade-button" class="default-button start-buttons">
            Play Arcade!<br />(Enter/Space)
          </button>
        </div>
        <div id="right-column" style="display:none">
          <button id="training-button" class="default-button start-buttons">
            Training Mode<br />[Beta]<br />(T or S)
          </button>
        </div>
      </div>
    </div>
  </section>
`;
