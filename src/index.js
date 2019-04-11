import React from 'react';
import { render } from "react-dom";
import { Talkify, TalkifyPlaylistItem } from "./lib";
import '../node_modules/talkify-tts/dist/styles/talkify-common.css';
import '../node_modules/talkify-tts/dist/styles/talkify-audiocontrols.css';
import '../node_modules/talkify-tts/dist/styles/talkify-playlist.css';

class TestItem extends React.Component {
    render() {
        return (<div className={this.props.item.isPlaying ? "playlist-playing" : ""}>{this.props.item.text}</div>);
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

        window.speechSynthesis.getVoices();
    }

    setAutoVoice() {
        this.setState({ voice: null });
    }

    setLocalVoice() {
        var voice = window.speechSynthesis.getVoices()[0];
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
        //console.log("ReactJs", message, topic);
    }

    render() {
        var remoteservice = {
            host: 'https://talkify.net/',
            apikey: "[INSERT-API-KEY-HERE]"
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
                            play={false}
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