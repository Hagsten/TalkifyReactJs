import React from 'react';
import { render } from "react-dom";
import { Talkify, TtsPlayer, Html5Player, TalkifyPlaylistItem } from "./lib";

class TestItem extends React.Component {
    render() {
        return (<div>{this.props.item.text}</div>);
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            voice: null
        }
    }

    setAutoVoice() {
        this.setState({ voice: null });
    }

    setLocalVoice() {
        var voice = window.speechSynthesis.getVoices()[0] || window.speechSynthesis.getVoices()[0];
        this.setState({ voice: voice });
    }

    setRemoteVoice() {
        this.setState({ voice: { name: "David" } });
    }

    render() {
        var remoteservice = {
            host: 'https://talkify.net/',
            apikey: ""
        };

        var playlist = {
            useTextInteraction: true,
            rootselector: "body"
        };

        var usePlaylist = true;

        if (usePlaylist) {
            return (
                <div>
                    <button onClick={() => this.setAutoVoice()}>Automatic voice</button>
                    <button onClick={() => this.setRemoteVoice()}>Remote voice</button>
                    <button onClick={() => this.setLocalVoice()}>Local voice</button>

                    <p>
                        Hello world, how do you do?</p>

                    <Talkify
                        controlcenter
                        remoteservice={remoteservice}
                        play={true}
                        useTextHighlighting={true}
                        playlist={playlist}
                        voice={this.state.voice}>
                        <TalkifyPlaylistItem>
                            <TestItem />
                        </TalkifyPlaylistItem>
                    </Talkify>
                </div>);
        } else {
            return (
                <Talkify remoteservice={remoteservice} controlcenter text="Hello there" />);
        }
    }
}

render(<App />, document.getElementById("root"));