import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
/* import fullscreen from 'assets/fullscreen_button.svg';
import fullscreenExit from 'assets/fullscreen_exit_button.svg'; */
import {
  addResponseMessage,
  messageChannelAgentToBot,
  showInformationForm,
  toggleInputEnable,
  emitUserMessage
} from 'actions';
import './style.scss';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      botAvatar: this.props.socketUrl + this.props.botAvatar,
      minimizeImage: `${this.props.socketUrl}/content/img/minimize.png`,
      informationImage: `${this.props.socketUrl}/content/img/information.png`
    };
  }

  questionForm = () => {
    if (this.props.showInformation === true) {
      // document.getWebChatElement().getElementById("informationForm").className =" scale-down-ver-top"
      this.props.showInformationForm();
      document.getWebChatElement().getElementById('messages-wrapper').style.display = 'block';
      document.getWebChatElement().getElementById('messageDiv') ? document.getWebChatElement().getElementById('messageDiv').style.display = '' : '';
      document.getWebChatElement().getElementById('informationForm').style.display = 'none';
    } else if (this.props.showInformation === false) {
      this.props.showInformationForm();
      document.getWebChatElement().getElementById('messages-wrapper').style.display = 'none';
      document.getWebChatElement().getElementById('messageDiv') ? document.getWebChatElement().getElementById('messageDiv').style.display = 'none' : '';
      document.getWebChatElement().getElementById('informationForm').style.display = 'block';
    }
  };

  messageChannelToBot = () => {
    const { storage, redirectBotMessage } = this.props;

    this.props.sendUserMessage({
      type: 'CHANGE_CHAT_MESSAGE_TARGET',
      text: `{"conversationId": "${storage.getItem('chatbot.conversationId')}", "chatServiceType": "RASA"}`
    });

    this.props.inputEnable();
    this.setState({ enable: true });
    this.props.submitMessage({ text: redirectBotMessage, avatar: '' });
    this.props.messageChannelAgentToBot();
  };

  handleMouseIn = (tip) => {
    this.setState({ [tip.target.id]: true });
  };

  handleMouseOut = (tip) => {
    this.setState({ [tip.target.id]: false });
  };

  render() {
    const title = this.props.title;
    const subtitle = this.props.subtitle;
    /*     let fullScreenMode = this.props.fullScreenMode;
        let toggleFullScreen = this.props.toggleFullScreen;
        let toggleChat = this.props.toggleChat;
        let showFullScreenButton = this.props.showFullScreenButton; */
    const connected = this.props.connected;
    const connectingText = this.props.connectingText;
    let endConversationButton;

    if (this.props.messageChannel === 'AGENT') {
      endConversationButton = (<div className="return-bot-div">
        <img
          onMouseOver={this.handleMouseIn} id="returnBotHover" onMouseOut={this.handleMouseOut}
          className="return-bot" onClick={this.messageChannelToBot} src={this.state.botAvatar}
        />
        <div>
          <div className="tooltip tooltips" style={{ display: this.state.returnBotHover ? 'block' : 'none' }}>
            Canlı desteği sonlandır.
          </div>
        </div>
      </div>);
    } else if (this.props.messageChannel === 'ADMIN') {
      endConversationButton = (<div className="return-bot-div">
        <img
          onMouseOver={this.handleMouseIn} id="returnBotHover" onMouseOut={this.handleMouseOut}
          className="return-bot" onClick={this.messageChannelToBot} src={this.state.botAvatar}
        />
        <div>
          <div className="tooltip tooltips" style={{ display: this.state.returnBotHover ? 'block' : 'none' }}>
            Canlı konuşmayı sonlandır.
          </div>
        </div>
      </div>);
    } else {
      endConversationButton = '';
    }

    return (
      <div>
        <div className="header">
          <div>
            <h4 className="title">{title}</h4>
          </div>
          <div className="header-buttons">
            <img className="minimize-button" src={this.state.minimizeImage} onClick={this.props.toggleChat} />
            {
              endConversationButton
            }
            <div className="question-image-div">
              <img
                onMouseOver={this.handleMouseIn} id="questionFormHover" onMouseOut={this.handleMouseOut}
                className="question-image" onClick={this.questionForm} src={this.state.informationImage}
              />
              <div>
                <div className="tooltip tooltips" style={{ display: this.state.questionFormHover ? 'block' : 'none' }}>
                  Bilgilendirme ekranı.
                </div>
              </div>
            </div>

            {/* {
              showFullScreenButton &&
              <button className="toggle-fullscreen-button" onClick={toggleFullScreen}>
                <img
                  className={`toggle-fullscreen ${fullScreenMode ? 'fullScreenExitImage' : 'fullScreenImage'}`}
                  src={fullScreenMode ? fullscreenExit : fullscreen}
                  alt="toggle fullscreen"
                />
              </button>
            }

            <img className="minimize-image" onClick={toggleChat} src="/content/img/minimize.png" /> */}

          </div>
          {subtitle && <span>{subtitle}</span>}
        </div>
        {
          !connected &&
            <span className="loading">
              {connectingText}
            </span>
        }
      </div>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  fullScreenMode: PropTypes.bool,
  toggleFullScreen: PropTypes.func,
  toggleChat: PropTypes.func,
  showFullScreenButton: PropTypes.bool,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
  closeImage: PropTypes.string
};

const mapStateToProps = state => ({
  showInformation: state.behavior.get('showInformation'),
  messageChannel: state.behavior.get('messageChannel'),
  socketUrl: state.behavior.get('socketUrl')
});


const mapDispatchToProps = dispatch => ({
  showInformationForm: () => {
    dispatch(showInformationForm());
  },
  messageChannelAgentToBot: () => {
    dispatch(messageChannelAgentToBot());
  },
  inputEnable: () => {
    dispatch(toggleInputEnable());
  },
  submitMessage: (userResponse) => {
    // dispatch(addUserMessage(userResponse));
    dispatch(addResponseMessage(userResponse));
  },
  sendUserMessage: (userResponse) => {
    dispatch(emitUserMessage(userResponse));
  }
});


export default connect(mapStateToProps, mapDispatchToProps)(Header);
