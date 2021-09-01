import html from "html-literal";

export default st => html`
  <section id="scoring-page">
    <body>
      <h1 id="score-rules-header">Scoring Rules</h1>
      <div id="scoring-rules">
        <h2>FORMULA PER MATCH</h2>
        <h3>
          <pre>
          Score += (Survival Multiplier) * (Block Match Size + CHAIN BONUS)
        </pre>
        </h3>
        <h2>BLOCK MATCH SIZE</h2>
        <h3>
          <pre>
          03 block match:    30
          04 block match:    60
          05 block match:    80
          06 block match:   110
          07 block match:   130
          08 block match:   150
          09 block match:   170
          10 block match:   200
          11 block match:   250
          12 block match:   300
          13 block match:   350
          14 block match:   400
          15 block match:   450
          16 block match:   500
          </pre
          >
        </h3>
        <h2>CHAIN BONUS</h2>
        <h3>
          <pre>
            02x chain:   +  50
            03x chain:   +  70
            04x chain:   + 150
            05x chain:   + 300
            06x chain:   + 400
            07x chain:   + 500
            08x chain:   + 700
            09x chain:   + 900
            10x chain:   +1100
            11x chain:   +1300
            12x chain:   +1500
            13x chain:   +1800
            14x chain:   +2100
            15x chain:   +2400
            16x chain:   +2700
          </pre
          >
        </h3>
        <h2>Survival Multiplier</h2>
        <h3>
          <pre>
            0:00-0:19:    1.00x
            0:20-0:39:    1.15x
            0:40-0:59:    1.30x
            1:00-1:19:    1.50x
            1:20-1:39:    1.65x
            1:40-1:59:    1.80x
            2:00-2:19:    2.00x
            2:20-2:39:    2.25x
            2:40-2:59:    2.50x
            3:00-4:00:    3.00x
          </pre
          >
        </h3>
      </div>
    </body>
  </section>
`;
