import html from "html-literal";

export default st => html`
  <section id="home-page">
    <div id="container">
      <h2 style="color:white;">Welcome to Puzzle League: Arcade Edition!</h2>
      <h1>Controls:</h1>
      <ul style="list-style-type:none; font-size:large;">
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
          >Clear blocks by matching 3 or more adjacent blocks vertically or
          horizontally.</strong
        >
        This is referred to as a "clear", "match", or "combo". If you create a
        match of 4 or morem, you will get more points. Finally, you can create
        chains by clearing a second match on top of a recently cleared combo
        before the blocks fall. Chains will get you the most points. You lose
        when the stack reaches the top. For a visual explanation, you can click
        the "Tutorials" tab at the top.
      </p>
      <p>
        The stack rise speed will get faster every 20 seconds, which also
        increases the multiplier of combos/chains by 0.1x. At two minutes,
        "overtime" begins, and the stack rise speed will be extremely fast.
        However, all point scores will be doubled. You can see more information
        in the "Scoring" tab at the top.
      </p>
      <p>
        After the game ends and depending on your hardware you can submit your
        score to the leaderboard. Practice up, and see if you can get that #1
        spot!
      </p>
      <hr />
      <h1 style="color:red">NOTICE ABOUT POSTING SCORES!!!</h1>
      <p style="color:black">
        This game was written in Javascript for a coding bootcamp capstone
        project.
        <strong
          >It is not a consistent programming language with running games
          optimally</strong
        >, and there are issues with the game running too slowly and can lead to
        an <strong>unintended advantage</strong>. If the app detects that the
        in-game timer is five or more seconds behind a real timer,
        <strong>your score will not be ranked.</strong>
        You can still post to the leaderboards, but unranked scores will have a
        * in front of the name and be placed at the bottom of the leaderboards.
      </p>
      <p>
        I have implemented diffeerent frame-rates for running the game. You can
        run it at 60 FPS (frames per second), which is the original intended way
        I programmed it, and will make the in-game animations the smoothest.
        However, I have found that many computers cannot run it at full speed,
        which means that they will not be able to post to the leaderboard if the
        frame-rate is detected to be too slow.
      </p>
      <p>
        For most computers,
        <span style="color:red; font-weight:bold;"
          ><u>it is recommended to run the game at 30 FPS</u></span
        >. In this mode I have doubled the speed of all animations and game
        events to simulate it running at 60fps. Some animations may not look at
        smooth, but it is more guaranteed to run the game at its intended full
        speed.
      </p>
      <div id="game-container">
        <div id="left-column">
          <button id="double-button" class="default-button">
            Click to Play<br />
            30 FPS<br />(Recommended)
          </button>
        </div>
        <div id="right-column">
          <button id="start-button" class="default-button">
            Click to Play<br />
            60FPS<br />(Highest Animation Quality)
          </button>
        </div>
      </div>
    </div>
  </section>
`;

//<!-- <canvas id ="canvas" width="192" height="384", background-color></canvas>  -->
//<!-- <canvas id ="canvas" width="192" height="448", background-color></canvas>  -->
