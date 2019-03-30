import React from "react";
import ReactDOM from "react-dom";
import { Talkify, TtsPlayer, Html5Player, TalkifyPlaylistItem } from "./talkify";

ReactDOM.render(<div>
    <p>Hello world</p>
    <p>Hello again</p>
    </div>, document.getElementById("root"));

export { Talkify, TtsPlayer, Html5Player, TalkifyPlaylistItem };