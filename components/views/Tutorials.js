import html from "html-literal";

export default st => html`
  <section id="tutorials-page">
    <h1 id="tutorials-header" style="font-size: xx-large;">
      Tutorials
    </h1>
    <h2>How to play</h2>
    <div id="container">
      <iframe
        width="640"
        height="360"
        src="https://www.youtube.com/embed/5o8C81D-Uo0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <br />
    <hr color="black" />
    <br />
    <h2>Intermediate Chain Example & Explanation</h2>
    <iframe
      width="640"
      height="360"
      src="https://www.youtube.com/embed/3do_FYRj0ms"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <br />
    <hr color="black" />
    <br />
    <h2>Advanced 9x Chain Example</h2>
    <iframe
      width="640"
      height="360"
      src="https://www.youtube.com/embed/w0Fk-lySHTw"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <br />
    <hr color="black" />
    <br />
    <h1 id="tutorials-header" style="font-size: xx-large;">
      Other Media
    </h1>
    <h2>Watch the AI play! (version 11/1/2021)</h2>
    <iframe
      width="640"
      height="360"
      src="https://www.youtube.com/embed/QOKbWRvVWUM"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </section>
`;
