import html from "html-literal";

export default st => html`
  <section id="leaderboard-page">
    <h1 id="leaderboard-header">Score Leaderboard</h1>
    <div id="leaderboard-container">
      <h2 id="score-list-header">
        <pre>|       ALIAS       |  SCORE  |  SURVIVED  |  BEST CHAIN  |  BLOCKS CLEARED  |          DATE         |<br /></pre>
      </h2>
      <h2 id="score-list-display"><pre>${st.markup}</pre></h2>
    </div>
  </section>
`;
