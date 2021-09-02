import html from "html-literal";

export default st => html`
  <section id="history-page">
    <!-- <img src="../assets/Images/Tetris_Attack_box_art.png" id="box-art" />d -->
    <h1 id="more-info" class="headers">History of Puzzle League</h1>
    Puzzle League is a tetris-like game created by Intelligent Systems Co. in
    Japan. The player arranges 3 or more adjacent blocks (also known as panels)
    with the same color to create a combo and clear them from the board. You can
    also do more advanced techniques such as chains to gain more points. Usually
    the main game is multiplayer, where upon creating combos and chains, it will
    send garbage blocks to your opponent on top of their stack to top them out.
    <br />
    Since 1995, there have been a couple of Puzzle League games released. It
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
        <a href="https://en.wikipedia.org/wiki/Tetris_Attack">Tetris Attack</a>
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

    Panel De Pon was the first game, released exclusively in Japan. The story
    was about a fairy named Lip who needed to rescue her other fairy friends
    from monsters who use their magic to make an endless rainstorm on their
    homeland. It was viewed that this would not be popular for Western
    audiences, so it was rebranded to the name Tetris Attack and instead starred
    Yoshi from the Mario series as the main protagonist. Although the gameplay
    and most of the music was the same, many of the images and sprites were
    altered to fit the theme, and the story was branded to have Bowser and his
    minions curse all of Yoshi's friends, and Yoshi has to save them. This
    version was released worldwide outside of Japan the following year.<br />
    In 2000, the game was rebranded with the Pokemon title, and Pokemon Puzzle
    League and Pokemon Puzzle Challenge were released in the next year. The game
    featured a lot of the same modes, but added more stages, puzzles, and
    challengers. The AI computer opponents were also significantly better, as in
    Tetris Attack the AI did not know how to make chains. There was also a 3D
    mode, which was basically the same as 2D, but instead of 6 columns it had 18
    and looked like a cylinder. (To be continued...)
  </section>
`;
