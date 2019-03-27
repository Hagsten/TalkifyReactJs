import React from 'react';
import { render } from "react-dom";
import { Talkify } from "./lib";

class App extends React.Component {
    render() {
        var remoteservice = {
            host: 'https://talkify.net',
            apikey: "apa"
        };

        return (<Talkify remoteservice={remoteservice} controlcenter></Talkify>);
    }
}

render(<App />, document.getElementById("root"));