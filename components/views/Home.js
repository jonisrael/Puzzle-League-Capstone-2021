import html from "html-literal";

export default st => html`
  <section id="home-page">
    <body>
      <h1>Welcome to Jonathan Israel's Puzzle League Blitz!</h1>
      <h2>
        Use the arrow keys to move, x to swap blocks, and z to raise the stack
        when legal.<br />
      </h2>
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
        However, all point scores will be doubled. Have fun!
      </h3>
      <div id="debug"></div>
    </body>
  </section>
`;

//<!-- <canvas id ="canvas" width="192" height="384", background-color></canvas>  -->
//<!-- <canvas id ="canvas" width="192" height="448", background-color></canvas>  -->
