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

      <li>
        The logic for detecting chains is not completely perfect in regards to
        the original games. Sometimes chains end later than they should, do not
        start properly, or in the rarest case, do not reset at all. In general,
        it is more generous than harmful to your score. If this bug happens and
        you gain a lot of unintentional points...please be nice to your fellow
        junior programmer and consider not posting the score on the leaderboard.
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
        When first running the game, sound does not always preload upon loading
        the website, even when importing sound files. This means that when a
        sound effect or voice is played for the first time, it may be
        delayed.<strong>
          (Update 9/24) I probably came up with a terrible way to solve this,
          but it seems to work. Basically, all 70+ sounds imported into the game
          play immediately upon the user interacting with any part of my website
          for the first time -- but it is at 0 volume, so the user won't hear
          anything. This seems to solve the problem once they are all loaded.
          However, the problem is that some computers can take as long as 10-15
          seconds to load all of the audio, which means that if you launch the
          game quickly after loading the website, the audio may not be ready. If
          anyone knows of another way to do this,
          <u>please let me know!!!</u></strong
        >
      </li>
      <li>
        Sometimes the stack will rise 1/16th of a line when clearing a block,
        even though it should stop immediately. This can lead to an unintended
        KO even if you clear a block just before the stack tops out.
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
