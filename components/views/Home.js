import html from "html-literal";

export default st => html`
  <section id="home-page">
    <body>
      <img src="../assets/Images/Tetris_Attack_box_art.png" id="box-art" />
      <h1 id="more-info" class="headers">More Info</h1>
      Puzzle League is a tetris-like game where the player arranges 3 or more
      adjacent blocks with the same color to create a combo and clear them from
      the board. You can also do more advanced techniques such as chains to gain
      more points. Usually the main game is multiplayer, where upon creating
      combos and chains, it will send garbage blocks to your opponent in attempt
      to top them out. There are other game modes such as a puzzle mode or a
      line clear mode, but with the limited time I have, I chose to focus on the
      single-player game modes involving scores.<br /><br />
      The main two modes that involve score are the two-minute time-trial and
      endless mode. In endless mode, the speed the stack rises gets faster and
      faster, but theoretically you can play it forever. In time trial, the
      speed is the same but you have a two minute time-limit to get the highest
      score possible.<br /><br />Outside of a couple animations, I did my best
      to replicate the game mechanics of the original game. If you would like to
      learn more information about how I programmed the game, some improvements
      I will implement later,
      <strong>as well as a list of bugs (Should I keep this?)</strong>, you can
      check out my <a href="/About">About</a> page.<br /><br />
      To make my clone a little more interesting, I created my own game mode
      called "Puzzle League Blitz". My idea was to combine the endless and
      time-trial mode into an arcade style 2-3 minute round. The stack rise
      speed as well as match clear speed will rapidly increase every twenty
      seconds, along with a score multiplier. At two minutes, it becomes nearly
      unplayably fast, but the player is rewarded for survival time. At three
      minutes, it is basically unplayable.<br /><br /><strong
        >NOT FINISHED YET</strong
      >Since 1995, there have been a couple of Puzzle League games released. It
      also had an interesting history on what regions of the world various games
      were released in. This is the main list of games that created new content:
      <ul id="list-of-games" class="lists">
        <li>
          <a href="https://panepon.fandom.com/wiki/Panel_De_Pon_Wiki"
            >Panel De Pon</a
          >
          (1995 Super Nintendo, Japan Only)
        </li>
        <li>
          <a href="https://en.wikipedia.org/wiki/Tetris_Attack"
            >Tetris Attack</a
          >
          (1996 Super Nintendo, Worldwide)
        </li>
        <li>
          <a href="https://en.wikipedia.org/wiki/Pok%C3%A9mon_Puzzle_League"
            >Pokemon Puzzle League</a
          >
          (2000 Nintendo 64, NA and Europe)
        </li>
        <li>
          <a href="https://en.wikipedia.org/wiki/Pokemon_Puzzle_Challenge"
            >Pokemon Puzzle Challenge</a
          >
          (2000 Game Boy Color, Worldwide)
        </li>
        <li>
          <a href="https://en.wikipedia.org/wiki/Planet_Puzzle_League"
            >Planet Puzzle League</a
          >
          (2007 Nintendo DS, Worldwide)
        </li>
      </ul>
      <br /><br />
      <h2>Tutorial</h2>
    </body>
  </section>
`;
