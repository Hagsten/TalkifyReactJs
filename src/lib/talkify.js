import React from "react";
import 'talkify-tts';
import '../../node_modules/talkify-tts/dist/styles/talkify-common.css';
import '../../node_modules/talkify-tts/dist/styles/talkify-audiocontrols.css';

export class TtsPlayer extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.voice) {
            this.props.player.forceVoice(this.props.voice);
        }

        if (this.props.useTextHighlighting) {
            this.props.useTextHighlighting ? this.props.player.enableTextHighlighting() : this.props.player.disableTextHighlighting();
        }

        if (this.props.forcedLanguage) {
            this.props.player.forcedLanguage(this.props.forcedLanguage);
        }

        if (this.props.play && this.props.text) {
            this.props.player.playText(this.props.text);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.useTextHighlighting !== prevProps.useTextHighlighting) {
            this.props.useTextHighlighting ? this.props.player.enableTextHighlighting() : this.props.player.disableTextHighlighting();
        }

        if (this.props.voice !== prevProps.voice) {
            this.props.player.forceVoice(this.props.voice);
        }

        if (this.props.play !== prevProps.play) {
            this.props.play ? this.props.player.play() : this.props.player.pause();
        }

        if (this.props.text !== prevProps.text) {
            this.props.player.playText(this.props.text);
        }
    }

    componentWillUnmount() {
        this.props.player.dispose();
    }

    render() {
        return null;
    }
}

export class Html5Player extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.voice) {
            this.props.player.forceVoice(this.props.voice);
        }

        if (this.props.useTextHighlighting) {
            this.props.useTextHighlighting ? this.props.player.enableTextHighlighting() : this.props.player.disableTextHighlighting();
        }

        if (this.props.forcedLanguage) {
            this.props.player.forcedLanguage(this.props.forcedLanguage);
        }

        if (this.props.play && this.props.text) {
            this.props.player.playText(this.props.text);
        }
    }

    componentDidUpdate(prevProps) {
        //TODO: Set rate/volume only supported on html5. Add support for both players before adding support here?
        if (this.props.useTextHighlighting !== prevProps.useTextHighlighting) {
            this.props.useTextHighlighting ? this.props.player.enableTextHighlighting() : this.props.player.disableTextHighlighting();
        }

        if (this.props.voice !== prevProps.voice) {
            this.props.player.forceVoice(this.props.voice);
        }

        if (this.props.play !== prevProps.play) {
            this.props.play ? this.props.player.play() : this.props.player.pause();
        }

        if (this.props.text !== prevProps.text) {
            this.props.player.playText(this.props.text);
        }

        if (this.props.forcedLanguage !== prevProps.forcedLanguage) {
            this.props.player.forcedLanguage(this.props.forcedLanguage);
        }
    }

    componentWillUnmount() {
        this.props.player.dispose();
    }

    render() {
        return null;
    }
}

export class TalkifyPlaylistItem extends React.Component {
    render() {
        return this.props.playlist.getQueue().map(item =>
            React.cloneElement(this.props.children, { item: item, key: item.text })
        );
    }
}

export class Talkify extends React.Component {
    constructor(props) {
        super(props);

        if (this.props.playlist && this.props.text) {
            throw new Error("A talkify instance can not use both a playlist and a text to play.");
        }

        var isRemoteVoice = this.__isRemote(this.props.voice);

        if (!this.props.remoteservice && isRemoteVoice) {
            throw new Error("A remote (Talkify) voice can only be used when a remote service is active.");
        }

        this.__setConfiguration();

        if (isRemoteVoice) {
            this.player = new window.talkify.TtsPlayer();
        } else {
            this.player = new window.talkify.Html5Player();
        }

        if (this.props.playlist) {
            var builder = new window.talkify.playlist().begin().usingPlayer(this.player);

            if (this.props.playlist.textinteraction) {
                builder.withTextInteraction();
            }

            if (this.props.playlist.elements) {
                builder.withElements(this.props.elements);
            }

            this.playlist = builder.build();
        }

        this.state = {
            isRemoteVoice: isRemoteVoice
        };
    }

    componentWillUnmount() {
        if (this.playlist) {
            this.playlist.dispose();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.voice !== prevProps.voice) {
            var isRemote = this.__isRemote(this.props.voice);

            if (isRemote && this.player instanceof window.talkify.Html5Player) {
                this.player = new window.talkify.TtsPlayer();
                this.playlist.setPlayer(this.player);
            } else if (!isRemote && this.player instanceof window.talkify.TtsPlayer) {
                this.player = new window.talkify.Html5Player();
                this.playlist.setPlayer(this.player);
            }
        }
    }

    componentDidMount() {
        if (this.props.play) {
            if (this.props.playlist) {
                this.playlist.play();
            }
        }
    }

    __isRemote(voice) {
        if (!voice) {
            return !!this.props.remoteservice;
        }

        return voice.constructor.name !== "SpeechSynthesisVoice";
    }

    __setConfiguration() {
        window.talkify.config.debug = true;

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
        var isRemoteVoice = this.__isRemote(this.props.voice);

        return (
            <div>
                {isRemoteVoice ?
                    <TtsPlayer voice={this.props.voice} player={this.player} text={this.props.text} play={this.props.play} /> :
                    <Html5Player player={this.player} voice={this.props.voice} text={this.props.text} play={this.props.play} />}
                {this.props.playlist && React.cloneElement(this.props.children, { playlist: this.playlist })}
            </div>

        );
    }
}