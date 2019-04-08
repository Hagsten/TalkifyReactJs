import React from 'react';
import { render } from "react-dom";
import { Talkify, TtsPlayer, Html5Player, TalkifyPlaylistItem } from "./lib";

class TestItem extends React.Component {
    //TODO: Solve state update on playlist queue so that we can act on for example isPlaying here. Ideas is to listen to player-events (*.play / *.ended)
    render() {
        return (<div className={this.props.item.isPlaying ? "playing" : ""}>{this.props.item.text}</div>);
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            debugMode: true,
            voice: null,
            texthighlighting: true,
            rate: 1,
            volume: 0.3,
            playlist: {
                textinteraction: true,
                rootselector: "#root"
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

    setRate() {
        this.setState({ rate: 2 });
    }

    increaseVolume() {
        this.setState({ volume: this.state.volume + 0.1 });
    }

    toggleTextHighlighting() {
        this.setState({ texthighlighting: !this.state.texthighlighting });
    }

    toggleTextInteraction() {
        var playlist = this.state.playlist;
        playlist.textinteraction = !playlist.textinteraction;

        this.setState({ playlist: playlist });
    }

    eventlistener(message, topic) {
        console.log("ReactJs", message, topic);
    }

    render() {
        var remoteservice = {
            host: 'https://talkify.net/',
            apikey: ""
        };

        var usePlaylist = true;

        return (
            <div>
                <button onClick={() => this.setAutoVoice()}>Automatic voice</button>
                <button onClick={() => this.setRemoteVoice()}>Remote voice</button>
                <button onClick={() => this.setLocalVoice()}>Local voice</button>
                <button onClick={() => this.toggleTextHighlighting()}>Toggle text highlighting</button>
                <button onClick={() => this.toggleTextInteraction()}>Toggle text interaction</button>
                <button onClick={() => this.setRate()}>Set rate to 2</button>
                <button onClick={() => this.increaseVolume()}>Increase volume</button>



                {usePlaylist ?
                    <>
                        <p>Hello there, you are now using the playlist feature</p>
                        <p>Lorem ipsum</p>
                        <Talkify
                            debugMode={this.state.debugMode}
                            controlcenter
                            remoteservice={remoteservice}
                            play={true}
                            useTextHighlighting={this.state.texthighlighting}
                            playlist={this.state.playlist}
                            voice={this.state.voice}
                            rate={this.state.rate}
                            volume={this.state.volume}
                            eventlistener={this.eventlistener}>
                            <TalkifyPlaylistItem><TestItem /></TalkifyPlaylistItem>
                        </Talkify>
                    </> :
                    <Talkify
                        debugMode={this.state.debugMode}
                        remoteservice={remoteservice}
                        controlcenter
                        text="Hello there, this is just a plain text"
                        play={true}
                        useTextHighlighting={this.state.texthighlighting}
                        voice={this.state.voice}
                        rate={this.state.rate}
                        volume={this.state.volume}
                        eventlistener={this.eventlistener} />}

            </div>);

    }
}

render(<App />, document.getElementById("root"));