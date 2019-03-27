import React from 'react';
import { render } from "react-dom";
import { Talkify, TalkifyPlaylist, TtsPlayer } from "./lib";

class App extends React.Component {
    render() {
        var remoteservice = {
            host: 'https://talkify.net/',
            apikey: "foobar"
        };

        var usePlaylist = true;

        if (usePlaylist) {
            return (
                <Talkify remoteservice={remoteservice} controlcenter>
                    <TalkifyPlaylist textinteraction elements="p">
                        <TtsPlayer></TtsPlayer>
                    </TalkifyPlaylist>
                </Talkify>);
        } else {
            return (
                <Talkify remoteservice={remoteservice} controlcenter>
                    <TtsPlayer></TtsPlayer>
                </Talkify>);
        }
    }
}

render(<App />, document.getElementById("root"));