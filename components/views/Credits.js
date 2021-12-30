import html from "html-literal";

export default st => html`
  <section id="sound-credits-page">
    <body>
      <h1 id="sound-credits-page-header">Credits</h1>
      <h2>Music</h2>
      <ul>
        <li>"Popcorn" by Hot Butter (1972)</li>
        <li>"Sudden Death" from Mario Strikers Charged OST (2007)"</li>
        <li>"Results Screen" from Super Street Fighter IV OST (2010)</li>
      </ul>
      <hr />
      <h2>Audio Samples</h2>
      <ul>
        <li>
          Announcer Voice Samples from Super/Ultra Street Fighter IV (2010,
          2014)
        </li>
        <li>
          "Hold It!" Voice Samples from the Phoenix Wright Ace Attorney series
          (2005)
        </li>
        <li>black Coin 1-8 sound effects from Super Mario 64 (1996)</li>
        <li>
          "Menu Move","Menu Select" sound effects from Super Smash Bros. (1998)
        </li>
        <li>"Player Damaged" sound effects from Undertale (2015)</li>
        <li>
          "Fanfare 1-5", "Topout" sound effects from Planet Puzzle League (2007)
        </li>
      </ul>
      <hr />
      <h2>Images</h2>
      <ul>
        <li>
          Images were created by me, but influenced from the original Panel de
          Pon.
        </li>
      </ul>
      <hr />
      <h2>Code</h2>
      <p>
        The game itself was coded by me from the ground up, and attempts to
        replicate the original Panel De Pon mechanics as best as possible.
        However, I received a lot of help from the
        <a href="https://savvycoders.com/meettheteam/">Savvy Coders Team</a> in
        regards to other website features. These features include converting the
        game into a Single-Page-Application, deploying the site to
        <a href="https://www.netlify.com/">Netlify</a>, get datetime information
        from <a href="https://worldtimeapi.org/">WorldTimeAPI</a>, and use a
        <a href="https://cloud.mongodb.com/">Mongo-DB</a> database to host the
        leaderboard information on <a href="heroku.com">Heroku</a>.
      </p>
    </body>
  </section>
`;
