import React from "react";
import 'talkify-tts';
import '../../node_modules/talkify-tts/dist/styles/talkify-common.css';
import '../../node_modules/talkify-tts/dist/styles/talkify-audiocontrols.css';

export class TtsPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.player = new window.talkify.TtsPlayer().enableTextHighlighting();

        if (this.props.onPlayerCreated) {
            this.props.onPlayerCreated(this.player);
        }
    }

    render() {
        return null;
    }
}

export class TalkifyPlaylist extends React.Component {
    constructor(props) {
        super(props);

        this.playlist = null;

        this.onPlayerCreated = this.onPlayerCreated.bind(this);
    }

    onPlayerCreated(player) {
        console.log(player);

        var builder = new window.talkify.playlist().begin().usingPlayer(player);

        if (this.props.textinteraction) {
            builder.withTextInteraction();
        }

        if (this.props.elements) {
            builder.withElements(this.props.elements);
        }

        this.playlist = builder.build();
    }

    render() {

        return (
            React.cloneElement(this.props.children, { onPlayerCreated: this.onPlayerCreated })
        );
    }
}

export class Talkify extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.talkify.config.remoteService.host = this.props.remoteservice.host;
        window.talkify.config.remoteService.apiKey = this.props.remoteservice.apikey;
        window.talkify.config.remoteService.active = !!this.props.remoteservice;

        window.talkify.config.ui = {
            audioControls: {
                enabled: !!this.props.controlcenter
            }
        };

        window.talkify.config.keyboardCommands.enabled = false;
        window.talkify.config.voiceCommands.enabled = false;
    }

    render() {
        return (
            <>
                <span>Hello world</span>
                {this.props.children}
            </>
        );
    }
}