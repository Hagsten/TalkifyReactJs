import _classCallCheck from "C:\\Users\\andre\\Source\\Repos\\TalkifyReactJs\\node_modules\\@babel\\runtime/helpers/esm/classCallCheck";
import _createClass from "C:\\Users\\andre\\Source\\Repos\\TalkifyReactJs\\node_modules\\@babel\\runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "C:\\Users\\andre\\Source\\Repos\\TalkifyReactJs\\node_modules\\@babel\\runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "C:\\Users\\andre\\Source\\Repos\\TalkifyReactJs\\node_modules\\@babel\\runtime/helpers/esm/getPrototypeOf";
import _inherits from "C:\\Users\\andre\\Source\\Repos\\TalkifyReactJs\\node_modules\\@babel\\runtime/helpers/esm/inherits";
import React from "react";
import 'talkify-tts';
export var TalkifyPlaylistItem =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TalkifyPlaylistItem, _React$Component);

  function TalkifyPlaylistItem() {
    _classCallCheck(this, TalkifyPlaylistItem);

    return _possibleConstructorReturn(this, _getPrototypeOf(TalkifyPlaylistItem).apply(this, arguments));
  }

  _createClass(TalkifyPlaylistItem, [{
    key: "render",
    value: function render() {
      var _this = this;

      return this.props.playlist.getQueue().map(function (item) {
        return React.cloneElement(_this.props.children, {
          item: item,
          key: item.text
        });
      });
    }
  }]);

  return TalkifyPlaylistItem;
}(React.Component);
export var Talkify =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(Talkify, _React$Component2);

  function Talkify(props) {
    var _this2;

    _classCallCheck(this, Talkify);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Talkify).call(this, props));

    if (_this2.props.playlist && _this2.props.text) {
      throw new Error("A talkify instance can not use both a playlist and a text to play.");
    }

    if (_this2.props.eventlistener) {
      window.talkify.messageHub.subscribe("ReactJsComponent", "*", function (message, topic) {
        _this2.props.eventlistener(message, topic);
      });
    }

    var isRemoteVoice = _this2.__isRemote(_this2.props.voice);

    if (!_this2.props.remoteservice && isRemoteVoice) {
      throw new Error("A remote (Talkify) voice can only be used when a remote service is active.");
    }

    _this2.__setConfiguration();

    if (isRemoteVoice) {
      _this2.player = new window.talkify.TtsPlayer();
    } else {
      _this2.player = new window.talkify.Html5Player();
    }

    _this2.state = {
      isRemoteVoice: isRemoteVoice,
      playlist: null
    };
    return _this2;
  }

  _createClass(Talkify, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.talkify.messageHub.unsubscribe("ReactJsComponent", "*");
      window.talkify.messageHub.unsubscribe("ReactJsComponent", "*.player.*.play");

      if (this.state.playlist) {
        this.state.playlist.dispose();
      }

      this.player.dispose();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
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
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      if (this.props.playlist) {
        window.talkify.messageHub.subscribe("ReactJsComponent", "*.player.*.play", function (message) {
          var item = message.item;

          var queue = _this3.state.playlist.getQueue();

          var match = queue.find(function (x) {
            return x === item;
          });

          if (match) {
            _this3.setState({
              playlist: _this3.state.playlist
            });
          }
        });
        var builder = new window.talkify.playlist().begin().usingPlayer(this.player).subscribeTo({
          onEnded: function onEnded() {
            return _this3.setState({
              playlist: _this3.state.playlist
            });
          }
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
        this.setState({
          playlist: playlist
        });

        if (this.props.play) {
          playlist.play();
        }
      }

      this.__playerDidMount();
    }
  }, {
    key: "__setPlayerOnPlaylist",
    value: function __setPlayerOnPlaylist(player) {
      if (this.state.playlist) {
        this.state.playlist.setPlayer(player);
      }
    }
  }, {
    key: "__isRemote",
    value: function __isRemote(voice) {
      if (!voice) {
        return !!this.props.remoteservice;
      }

      return voice.constructor.name !== "SpeechSynthesisVoice";
    }
  }, {
    key: "__setConfiguration",
    value: function __setConfiguration() {
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
  }, {
    key: "__playerDidMount",
    value: function __playerDidMount() {
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
  }, {
    key: "__playerDidUpdate",
    value: function __playerDidUpdate(prevProps) {
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
  }, {
    key: "render",
    value: function render() {
      return React.createElement("section", null, this.state.playlist && React.cloneElement(this.props.children, {
        playlist: this.state.playlist
      }));
    }
  }]);

  return Talkify;
}(React.Component);