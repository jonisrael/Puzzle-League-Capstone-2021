import html from "html-literal";

export default (st) => html`
  <section id="leaderboard-page">
    <h2 id="leaderboard-header">Score Leaderboard</h2>
    <!-- <p style="font-size:small">
      Note: If name has * before it, enough game slowdown was detected that
      could have given the player an advantage, and so these names are placed at
      the bottom of the leaderboard. For more information, see "Known Bugs".
    </p> -->
    <button class="default-button refresh-buttons" id="refresh-top">
      Refresh Leaderboard
    </button>

    <div class="tab" style="display: none;">
      <button class="tab-links active">
        Blitz
      </button>
      <button class="tab-links">
        Standard
      </button>
      <button class="tab-links">
        Marathon
      </button>
    </div>
    <div id="Blitz" class="tab-content">
      <h2 style="color:black">Blitz Leaderboards</h2>
      <table id="ranked-table">
        <tr style="color:black">
          <th>RANK</th>
          <th>NAME</th>
          <th>SCORE</th>
          <th>SURVIVED</th>
          <th>BEST CHAIN</th>
          <th>BLOCKS CLEARED</th>
          <h4 id="scroll-dialogue"><== Scroll ==></h4>
          <th>DATE</th>
          <th>TIME</th>
        </tr>
        <span id="ranked-scores-display">${st.markup}</span>
      </table>
    </div>
    <div id="Standard" class="tab-content">
      <!-- <h2 style="color:black">Standard Leaderboard</h2> -->
      <h1 style="color:red">Standard Leaderboard Coming Soon!</h1>
      <!-- <table id="ranked-table">
        <tr style="color:black">
          <th>RANK</th>
          <th>NAME</th>
          <th>SCORE</th>
          <th>SURVIVED</th>
          <th>BEST CHAIN</th>
          <th>BLOCKS CLEARED</th>
          <h4 id="scroll-dialogue"><== Scroll ==></h4>
          <th>DATE</th>
          <th>TIME</th>
        </tr>
        <span id="ranked-scores-display">${st.markup}</span>
      </table> -->
    </div>
    <div id="Marathon" class="tab-content">
      <!-- <h2 style="color:black">Marathon Leaderboard</h2> -->
      <h1 style="color:red">Marathon Leaderboard Coming Soon!</h1>
      <!-- <table id="ranked-table">
        <tr style="color:black">
          <th>RANK</th>
          <th>NAME</th>
          <th>SCORE</th>
          <th>SURVIVED</th>
          <th>BEST CHAIN</th>
          <th>BLOCKS CLEARED</th>
          <h4 id="scroll-dialogue"><== Scroll ==></h4>
          <th>DATE</th>
          <th>TIME</th>
        </tr>
        <span id="ranked-scores-display">${st.markup}</span>
      </table> -->
    </div>

    <button class="default-button refresh-buttons">
      Refresh Leaderboard
    </button>
  </section>
`;
