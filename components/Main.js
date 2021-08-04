import * as views from "./views";

export default st => `
  ${views[st.view](st)}
`;
