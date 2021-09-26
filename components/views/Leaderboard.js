import html from "html-literal";

export default st => html`
  <section id="leaderboard-page">
    <h1 id="leaderboard-header">Score Leaderboard</h1>
    <p style="font-size:small">
      Note: If name has * before it, enough game slowdown was detected that
      could have given the player an advantage, and so these names are placed at
      the bottom of the leaderboard. For more information, see "Known Bugs".
    </p>
    <h2 style="color:blue">Ranked</h2>
    <table id="ranked-table">
      <tr style="color:blue">
        <th>RANK</th>
        <th>SCORE</th>
        <th>NAME</th>
        <th>SURVIVED</th>
        <th>BEST CHAIN</th>
        <th>BLOCKS CLEARED</th>
        <th>DATE</th>
        <th>TIME</th>
      </tr>
      <span id="ranked-scores-display">${st.rankedMarkup}</span>
    </table>

    <br />
    <hr />
    <h2 style="color:red">Unranked</h2>
    <table id="ranked-table">
      <tr style="color:red">
        <th>RANK</th>
        <th>SCORE</th>
        <th>NAME</th>
        <th>SURVIVED</th>
        <th>BEST CHAIN</th>
        <th>BLOCKS CLEARED</th>
        <th>DATE</th>
        <th>TIME</th>
      </tr>
      <span id="ranked-scores-display">${st.unrankedMarkup}</span>
    </table>
  </section>
`;
