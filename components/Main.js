import * as views from "./views";
import html from "html-literal";
export default (st) => html`
  <div id="main">${views[st.view](st)}</div>
`;
