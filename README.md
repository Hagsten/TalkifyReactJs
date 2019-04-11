The docs is a very rough draft :).

# TalkifyReactJs
Official React components for the Talkify TTS library

## Requirements
Font awesome 5

## Settings
Refer to https://github.com/Hagsten/Talkify#api for information on what values are accepted. 

## Usage
```
this.state = {
    debugMode: true,
    voice: null, //Use null for a automatically selected voice.
    texthighlighting: true,
    rate: 1,
    volume: 0.3,
    playlist: {
        textinteraction: true,
        rootselector: "#root"
    }
}

var remoteservice = {
    host: 'https://talkify.net/',
    apikey: "[INSERT-API-KEY-HERE]"
};

eventlistener(message, topic) {
  //console.log("ReactJs", message, topic);
}

<Talkify
    debugMode={true|false}
    controlcenter
    remoteservice={remoteservice}
    play={true|false}
    useTextHighlighting={this.state.textHighlighting}
    playlist={this.state.playlist} //Omit if you dont need a playlist
    voice={this.state.voice}
    rate={this.state.rate}
    volume={this.state.volume}
    eventlistener={this.eventlistener}>
    <TalkifyPlaylistItem><YourItemComponent /></TalkifyPlaylistItem>
</Talkify>
```                    
## Props
- debugMode: true to output debug information in the console
- controlcenter: uses the Talkify control center. Omit to opt out.
- remoteservice: Configuration object for the remote service (usually Talkify)
- play: true to play. Set to true initially to enable auto play.
- useTextHighlighting: true to enable word by word highlighting while TTS is speaking
- playlist: Configuration object for the playlist. Omit to skip a playlist.
- voice: A voice object. A JSON object wuth a Talkify voice as the name property or a Web Speech API voice (see Talkify docs). Use null for an automatic vocie
- rate: Speech rate. Varies from type of player. Refer to Talkify documentation
- volume: Only available when using a Web Speech API voice
- eventlistener: function which accepts two parameters "message" and "topic". Use this to listen to Talkify events.

## Components
- Talkify: The root element. Required
- TalkifyPlaylistItem: Accepts a child element. The child element will be passed a playlist queue item which allows you to build a playlist UI. Optional.
