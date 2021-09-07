import html from "html-literal";

export default st => html`
  <section id="leaderboard-page">
    <h1 id="leaderboard-header">Score Leaderboard</h1>
    <div id="container">
      <h2 id="score-list-header">
      <pre>|       ALIAS      |  SCORE  |  ALIVE |  BEST CHAIN  |  BLOCKS CLEARED  |         DATE          |<br>
      </h2>
      <h2 id="score-list-display">${st.markup}</h2>
      </pre>
    </div>
  </section>
`;
