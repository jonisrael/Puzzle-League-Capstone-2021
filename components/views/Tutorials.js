import html from "html-literal";

export default st => html`
  <section id="tutorials-page">
    <h1 id="tutorials-header">How to Play</h1>
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
  </section>
`;
