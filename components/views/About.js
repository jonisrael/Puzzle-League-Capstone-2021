import html from "html-literal";

export default st => html`
  <section id="about-page">
    <body>
      <div>
        <h2>About me!</h2>
        <p>
          I'm Jonathan Israel and I am the creator of this web application. This
          was part of my capstone project for the
          <a href="https://savvycoders.com/fullstackdevelopmentcourse/"
            >Savvy Coders Full-Stack Development Bootcamp</a
          >, June 2021 cohort. You can check out my github on my other various
          coding projects <a href="https://github.com/jonisrael">here</a>,
          including a
          <a href="https://github.com/jonisrael/Tetris_Rush_v1.0"
            >Tetris Clone</a
          >
          where you can choose to play with either
          <a href="https://tetris.wiki/Tetris_(NES,_Nintendo)"
            >Classic NES Tetris mechanics</a
          >
          or a Tetris Rush minigame I created with
          <a href="https://tetris.fandom.com/wiki/Tetris_Guideline"
            >modern Tetris Guideline Mechanics</a
          >.
        </p>
        <p>
          For my capstone I cloned the Puzzle League game series, but I wanted
          to make my own game mode and add the over-the-top announcer from one
          of my favorite fighting games, Street Fighter IV. I thought it would
          be an interesting capstone since this game as a small cult following
          and is not very well-known today. I have greatly enjoyed the
          troubleshooting and problem solving aspect of coding this game, and as
          a junior programmer this was extremely helpful with getting used to
          javascript.
        </p>
        <p>
          In preparation for the code camp, I ended up starting this game in
          early May, which gave me about seven weeks to create a base
          application. It was not good enough to just have the game though, as I
          had to also meet certain requirements. First, this game needed to be a
          single-page-application (SPA) uploaded to Netlify that contained
          multiple views. You can think of views as pages, but the main
          difference with an SPA is that pages do not need to reload. Next, this
          SPA needed to access an API. I used
          <a href="http://worldtimeapi.org/">World Time API</a> that is accessed
          when the user starts playing the game. Upon game completion, this
          information is used to postmark the date and time the user played the
          game. Finally, I needed to utilize a MongoDB cloud database and upload
          that data it to a
          <a href="https://puzzle-league-blitz.herokuapp.com/games"
            >Heroku server</a
          >
          -- so I made a Leaderboard page, which retrieves the list from this
          server, sorts the data by score, and prints a view containing
          leaderboard rankings.
        </p>
        <p>
          I have spent a lot of time on this, and although it isn't as perfect
          as I would like it to be, I hope you still enjoy this game. This code
          camp was very fun, and I recommend Savvy Coders if you are interested
          in learning how to program!
        </p>

        <p>
          You can reach me at
          <a href="mailto:jonisrael45@gmail.com">jonisrael45@gmail.com</a> for
          feedback or to report/help me fix bugs if you would like. I am also on
          <a href="https://www.linkedin.com/in/jonathan-israel-3ba281159/"
            >LinkedIn</a
          >
          for business inquiries, and my Discord tag is GiefKid#0722 for
          anything else. Thank you so much for playing my game!
        </p>
      </div>
    </body>
  </section>
`;
