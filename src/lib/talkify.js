import React from "react";
import 'talkify-tts';
import '../../node_modules/talkify-tts/dist/styles/talkify-common.css';
import '../../node_modules/talkify-tts/dist/styles/talkify-audiocontrols.css';
import '../../node_modules/talkify-tts/dist/styles/talkify-playlist.css';

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

        window.talkify.messageHub.subscribe("ReactJsComponent", "*", (message, topic) => {
            this.props.eventlistener(message, topic);
        });

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

        this.state = {
            isRemoteVoice: isRemoteVoice,
            playlist: null
        };
    }

    componentWillUnmount() {
        window.talkify.messageHub.unsubscribe("ReactJsComponent", "*");
        window.talkify.messageHub.unsubscribe("ReactJsComponent", "*.player.*.play");

        if (this.state.playlist) {
            this.state.playlist.dispose();
        }

        this.player.dispose();
    }

    componentDidUpdate(prevProps) {
        if (this.props.voice !== prevProps.voice) {
            var isRemote = this.__isRemote(this.props.voice);

            if (isRemote && this.player instanceof window.talkify.Html5Player) {
                this.player.dispose();
                this.player = new window.talkify.TtsPlayer();

                this.__playerDidMount(prevProps);

                this.__setPlayerOnPlaylist(this.player);
            } else if (!isRemote && this.player instanceof window.talkify.TtsPlayer) {
                this.player.dispose();
                this.player = new window.talkify.Html5Player();

                this.__playerDidMount(prevProps);

                this.__setPlayerOnPlaylist(this.player);
            } else {
                this.__playerDidUpdate(prevProps);
            }
        } else {
            this.__playerDidUpdate(prevProps);
        }

        if (this.props.playlist) {
            this.props.playlist.textinteraction ? this.state.playlist.enableTextInteraction() : this.state.playlist.disableTextInteraction();
        }
    }

    componentDidMount() {
        if (this.props.playlist) {
            window.talkify.messageHub.subscribe("ReactJsComponent", "*.player.*.play", message => {
                var item = message.item;

                var queue = this.state.playlist.getQueue();

                var match = queue.find(x => x === item);

                if (match) {
                    this.setState({ playlist: this.state.playlist });
                }
            });

            var builder = new window.talkify.playlist().begin().usingPlayer(this.player).subscribeTo({
                onEnded: () => this.setState({ playlist: this.state.playlist })
            });

            if (this.props.playlist.textinteraction) {
                builder.withTextInteraction();
            }

            if (this.props.playlist.elements) {
                builder.withElements(this.props.playlist.elements);
            }

            if (this.props.playlist.rootselector) {
                builder.withRootSelector(this.props.playlist.rootselector);
            }

            var playlist = builder.build();

            this.setState({ playlist: playlist });

            if (this.props.play) {
                playlist.play();
            }
        }

        this.__playerDidMount();
    }

    __setPlayerOnPlaylist(player) {
        if (this.state.playlist) {
            this.state.playlist.setPlayer(player);
        }
    }

    __isRemote(voice) {
        if (!voice) {
            return !!this.props.remoteservice;
        }

        return voice.constructor.name !== "SpeechSynthesisVoice";
    }

    __setConfiguration() {
        window.talkify.config.debug = this.props.debugMode || false;

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

    __playerDidMount() {
        if (this.props.voice) {
            this.player.forceVoice(this.props.voice);
        }

        if (this.props.useTextHighlighting) {
            this.props.useTextHighlighting ? this.player.enableTextHighlighting() : this.player.disableTextHighlighting();
        }

        if (this.props.rate !== null && this.props.rate !== undefined) {
            this.player.setRate(this.props.rate);
        }

        if (this.props.forcedLanguage) {
            this.player.forcedLanguage(this.forcedLanguage);
        }

        if (this.props.volume !== null && this.props.volume !== undefined && this.player.setVolume) {
            this.player.setVolume(this.props.volume);
        }

        if (this.props.play && this.props.text) {
            this.player.playText(this.props.text);
        }
    }

    __playerDidUpdate(prevProps) {
        if (this.props.useTextHighlighting !== prevProps.useTextHighlighting) {
            this.props.useTextHighlighting ? this.player.enableTextHighlighting() : this.player.disableTextHighlighting();
        }

        if (this.props.voice !== prevProps.voice) {
            this.player.forceVoice(this.props.voice);
        }

        if (this.props.rate !== prevProps.rate) {
            this.player.setRate(this.props.rate);
        }

        if (this.props.volume !== prevProps.volume && this.player.setVolume) {
            this.player.setVolume(this.props.volume);
        }

        if (this.props.play !== prevProps.play) {
            this.props.play ? this.player.play() : this.player.pause();
        }

        if (this.props.text !== prevProps.text || this.props.voice !== prevProps.voice) {
            this.player.playText(this.props.text);
        }

        if (this.props.forcedLanguage !== prevProps.forcedLanguage) {
            this.player.forcedLanguage(this.props.forcedLanguage);
        }
    }

    render() {
        return (
            <section>
                {this.state.playlist && React.cloneElement(this.props.children, { playlist: this.state.playlist })}
            </section>

        );
    }
}