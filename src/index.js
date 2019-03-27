import React from 'react';
import { render } from "react-dom";
import { Talkify } from "./lib";

const App = () => (
  <Talkify></Talkify>
);

render(<App />, document.getElementById("root"));