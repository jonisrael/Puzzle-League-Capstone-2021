import html from "html-literal";

export default st => html`
  <section id="bugs-page">
    <h1>Known bugs and glitches</h1>
    <h2>Major Bugs</h2>
    <ul>
      <li>
        Game speed is not consistent at 60 frames per second. Javascript is not
        an efficient language and browsers do not seem to like spending a lot of
        resources on running this game, especially if other tabs are open. In
        rare cases, the game can also run too fast. I have implemented a couple
        of measures for the game to try and fix performance when the game runs
        too fast or too slow, but unfortunately this seems like a fundamental
        problem with javascript, and I do not see how I can fix this in the
        forseeable future. If you have any ideas for improving performance,
        please shoot me an email at
        <a href="mailto:jonisrael45@gmail.com">jonisrael45@gmail.com</a>.<br />
      </li>
      <li>
        Sometimes the stack will stop rising, and you will not be able to
        self-raise the stack either. This can be fixed by dropping a block or
        clearing a set of blocks.
      </li>
      <li>
        Sometimes the stack will create an extra line while rising. This seems
        to be most common during overtime, when the stack is rising very fast.
        It is very unfair and cruel T_T.
      </li>
      <li>
        The logic for detecting chains is not completely perfect in regards to
        the original games. Sometimes chains end later than they should, do not
        start properly, or in the rarest case, do not reset at all. In general,
        it is more generous than harmful to your score. If this bug happens and
        you gain a lot of unintentional points...please be nice to your fellow
        junior programmer and consider not posting the score on the leaderboard.
      </li>
    </ul>
    <br />
    <br />
    <h2>Minor Bugs</h2>
    <ul>
      <li>
        When first running the game, sound does not always preload upon loading
        the website. This means that when a sound effect or voice is played for
        the first time, it may be delayed.
      </li>
      <li>
        Sometimes the stack will rise 1/16th of a line when clearing a block,
        even though it should stop immediately.
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
