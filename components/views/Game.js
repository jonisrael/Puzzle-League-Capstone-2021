import html from "html-literal";

export default st => html`
  <body>
    <h1>Welcome to Jonathan Israel's Puzzle League Score Rush!</h1>
    <h2>
      Use the arrow keys to move, x to swap blocks, and z to raise the stack
      when legal.<br />
    </h2>
    <h3>
      Clear blocks by matching 3 adjacent blocks. If you match 4 or more you
      will get more points. Create chains by matching a second combo on top of a
      recently cleared combo before the blocks fall. Chains will get you the
      most points. You lose when the stack reaches the top.
    </h3>
    <h3>
      The stack rise speed will get faster every 20 seconds, which also
      increases the multiplier of combos/chains by 0.1x. At two minutes,
      "overtime" begins, and the stack rise speed will be extremely fast.
      However, all point scores will be doubled at 2.0x. Have fun!
    </h3>
    <div id="canvas-container">
      <h3 class="stats" id="all-stats"></h3>
      <h3 class="stats" id="time"></h3>
      <h3 class="stats" id="score"></h3>
      <h3 class="stats" id="chain"></h3>
      <h3 class="stats" id="level"></h3>
    </div>
    <!-- <canvas id ="canvas" width="192" height="384", background-color></canvas>  -->
    <!-- <canvas id ="canvas" width="192" height="448", background-color></canvas>  -->
    <h2 id="high-score"></h2>
    <div id="debug"></div>
  </body>
`;