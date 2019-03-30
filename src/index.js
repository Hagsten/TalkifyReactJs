import React from 'react';
import { render } from "react-dom";
import { Talkify, TtsPlayer, Html5Player, TalkifyPlaylistItem } from "./lib";

class TestItem extends React.Component {
    render() {
        return (<span>{this.props.item.text}</span>);
    }
}

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            voice: null
        }
    }

    setAutoVoice(){
        this.setState({voice : null});
    }

    setLocalVoice(){
        this.setState({voice : null});
    }

    setRemoteVoice(){
        this.setState({voice : null});
    }

    render() {
        var remoteservice = {
            host: 'https://talkify.net/',
            apikey: ""
        };

        var playlist = {
            useTextInteraction: true,
            elements: "p"
        };

        var voice = {};

        var usePlaylist = true;

        if (usePlaylist) {
            return (
                <div>
                    <button onClick={() => this.setAutoVoice()}>Automatic voice</button>
                    <button onClick={() => this.setRemoteVoice()}>Remote voice</button>
                    <button onClick={() => this.setLocalVoice()}>Local voice</button>

                    <Talkify
                        controlcenter
                        remoteservice={remoteservice}
                        play={true}
                        playlist={playlist}
                        voice={voice}>
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