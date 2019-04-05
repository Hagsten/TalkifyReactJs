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
            voice: null,
            texthighlighting: true,
            playlist: {
                textinteraction: true,
                rootselector: "body"
            }
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

    toggleTextHighlighting() {
        this.setState({ texthighlighting: !this.state.texthighlighting });
    }

    toggleTextInteraction() {
        var playlist = this.state.playlist;
        playlist.textinteraction = !playlist.textinteraction;

        this.setState({ playlist: playlist });
    }

    eventlistener(message, topic){
        console.log("ReactJs", message, topic);
    }

    render() {
        var remoteservice = {
            host: 'https://talkify.net/',
            apikey: ""
        };

        var usePlaylist = true;

        if (usePlaylist) {
            return (
                <div>
                    <button onClick={() => this.setAutoVoice()}>Automatic voice</button>
                    <button onClick={() => this.setRemoteVoice()}>Remote voice</button>
                    <button onClick={() => this.setLocalVoice()}>Local voice</button>
                    <button onClick={() => this.toggleTextHighlighting()}>Toggle text highlighting</button>
                    <button onClick={() => this.toggleTextInteraction()}>Toggle text interaction</button>

                    <p>
                        Hello world, how do you do?</p>

                    <Talkify
                        controlcenter
                        remoteservice={remoteservice}
                        play={true}
                        useTextHighlighting={this.state.texthighlighting}
                        playlist={this.state.playlist}
                        voice={this.state.voice}
                        eventlistener={this.eventlistener}>
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