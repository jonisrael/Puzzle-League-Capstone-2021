import html from "html-literal";

export default st => html`
  <section id="leaderboard-page">
    <h1 id="leaderboard-header">Score Leaderboard</h1>
    <p style="font-size:small">
      Note: If name has * before it, enough game slowdown was detected that
      could have given the player an advantage, and so these names are placed at
      the bottom of the leaderboard. For more information, see "Known Bugs".
    </p>
    <table id="ranked-table">
      <tr>
        <th>ALIAS</th>
        <th>SCORE</th>
        <th>SURVIVED</th>
        <th>BEST CHAIN</th>
        <th>BLOCKS CLEARED</th>
        <th>DATE</th>
        <th>TIME</th>
      </tr>
      <span id="score-list-display">${st.markup}</span>
    </table>
  </section>
`;
