import React from "react";
import 'talkify-tts';
import '../../node_modules/talkify-tts/dist/styles/talkify-common.css';
import '../../node_modules/talkify-tts/dist/styles/talkify-audiocontrols.css';

class Talkify extends React.Component {
    constructor(props) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        window.talkify.config = {
            remoteService: {
                host: this.props.remoteservice.host,
                apiKey: this.props.remoteservice.apikey,
                active: !!this.props.remoteservice //True to use Talkifys language engine and hosted voices. False only works for Html5Player.
            },
            ui: {
                audioControls: {
                    enabled: !!this.props.controlcenter,
                    container: this.ref.current//document.body
                }
            },
            keyboardCommands: { //Ctrl + command
                enabled: false
            },
            voiceCommands: {
                enabled: false
            }
        };

        var player = new window.talkify.TtsPlayer().enableTextHighlighting();

        new window.talkify.playlist()
            .begin()
            .usingPlayer(player)
            .withTextInteraction()
            .withElements(document.querySelectorAll('p')) //<--Any element you'd like. Leave blank to let Talkify make a good guess
            .build() //<-- Returns an instance.
            .play();
    }

    render() {
        return (
            <span>Hello world</span>
        );
    }
}

export default Talkify;