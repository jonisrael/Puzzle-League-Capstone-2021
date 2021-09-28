import html from "html-literal";

export default st => html`
  <section id="bugs-page">
    <h1>
      Known bugs and glitches since graduation (Page made after Savvy Coder
      Graduation, September 15, 2021)
    </h1>
    <h2>Major Bugs</h2>
    <ul>
      <li>
        Game speed is not consistent at 60 frames per second and was converted
        to 30 frames per second for performance. Javascript is not an efficient
        language and browsers do not seem to like spending a lot of resources on
        running this game.<strong
          >If enough performance slowdown is detected, a player will have an
          unfair advantage since all game-speed elements will run
          slower.</strong
        >
        Therefore, a background performance checker will be running. Along with
        the in-game timer, a real timer is kept track of internally within the
        game (viewable in debug mode). If there is a 5 second difference,
        submitting a score to the leaderboard will be unranked. I have
        implemented a couple of measures for the game to try and fix performance
        when the game runs too slow, but unfortunately this seems like a
        fundamental problem with javascript, and I do not see how I can fix this
        in the forseeable future. If you have any ideas for improving
        performance or you see either a new bug, please shoot me an email at
        <a href="mailto:jonisrael45@gmail.com">jonisrael45@gmail.com</a>. You
        can also pull the code yourself from
        <a href="https://github.com/jonisrael/Puzzle-League-Capstone-2021"
          >my GitHub link here</a
        >.<br />
      </li>
      <li>
        Sometimes the stack will stop rising, and you will not be able to
        self-raise the stack either. This can be fixed by dropping a block or
        clearing a set of blocks. (Update 9/23): This most often happened when
        swapping two blocks when one of them was currently in their landing
        animation. This should be fixed. I have also implemented a failsafe
        where if the stack stops rising for five seconds, it will re-enable
        itself and resume moving regardless of game state.
      </li>
      <li>
        Sometimes the stack will create an extra line while rising. This seems
        to be most common during overtime, when the stack is rising very fast.
        It is very unfair and cruel T_T.
        <strong
          >(Update 9/20), I implemented a failsafe flag called "readyForNewRow",
          which has been implemented such that the stack must pass a checkpoint
          before it is eligible to have a new row added below it.</strong
        >
      </li>
      <li>Block chainability is not always assigned to blocks that are currently falling -- only to blocks that are stalling when the blocks below disappear</li>
      <li>
        (9/25) If the user tries to swap a block that is sitting on a clearing
        block, but the clearing block has a vacant square below it, the user
        cannot swap that block, even though in the original game it should be
        allowed. This is due to the rule of not being able to swap airborne
        blocks, but this is an edge case problem and is one of the first bugs
        after game release that I am looking to patch.
      </li>

        The logic for detecting chains is not completely perfect in regards to
        the original games. Sometimes chains end later than they should, do not
        start properly, or in the rarest case, do not reset at all. In general,
        the game is more generous than harmful to your score (as in, it is more likely to award chains that shouldn't be awarded in the original games).
        <strong
          >(Update 9/21) Chain logic has been improved, as a match disappearing
          will no longer add a chainable property to or above non-interactive
          blocks, ending the chain at the proper time. It is still not
          fullproof, and there are probably edge cases to prove it is
          exploitable. (Update 9/24) When a chain ends, if another block is
          clearing the chain counter is now properly set to 1 instead of
          0.</strong
        >
      </li>
    </ul>
    <br />
    <br />
    <h2>Minor Bugs</h2>
    <ul>
      <li>
        When first running the game, sound does not always preload correctly
        upon loading the website when entering the game quickly, even when
        importing sound files. This is due to the app preloading audio files
        upon launching the game so that they can be accessed without delay. This
        means that a few sound effects / countdown voice lines may play all at
        once within the first few seconds of the game (not loudly).
      </li>
      <li>
        Sometimes the stack will rise 1/16th of a line when clearing a block,
        even though it should stop immediately. This can lead to an unintended
        KO even if you clear a block just before the stack tops out. This is
        pretty rare.
      </li>
      <li>
        Mute buttons only work while game is running.
      </li>
    </ul>
    <br />
    <br />
    <h2>Debug Mode</h2>
    <p>
      If you are interested in messing around with the game, you can enable
      debug mode by pressing the ~ key, located above the TAB key. This will
      allow you to stop the game timer and view game information. Upon enabling
      debug mode, you can mess with event timers, freeze the game event timers,
      and display the chain logic on blocks. The controls will be posted in the
      developer console, which you can access on your browser by pressing F12.
    </p>
  </section>
`;
