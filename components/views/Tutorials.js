import html from "html-literal";

export default st => html`
  <section id="tutorials-page">
    <h1 id="tutorials-header" style="font-size: xx-large;">
      Tutorials
    </h1>
    <h2>How to play</h2>
    <div id="container">
      <iframe
        width="960"
        height="540"
        src="https://www.youtube.com/embed/VMN_9xiTZtg"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <br />
    <hr color="red" />
    <br />
    <h2>Intermediate Chain Example & Explanation</h2>
    <iframe
      width="960"
      height="540"
      src="https://www.youtube.com/embed/3do_FYRj0ms"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
    <br />
    <hr color="red" />
    <br />
    <h2>Advanced 9x Chain Example</h2>
    <iframe
      width="960"
      height="540"
      src="https://www.youtube.com/embed/XqHQl1OB-cw"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </section>
`;
