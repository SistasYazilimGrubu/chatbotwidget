import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  toggleInputDisable,
  toggleInputEnable,
  addResponseMessage,
  messageChannelBotToAgent,
  messageChannelAgentToBot,
  emitUserMessage
} from 'actions';
import './style.scss';

class RedirectChatOptions extends Component {
  state = {
    enable: false,
    confirmIsDisable: '',
    refuseIsDisable: ''
  };

  componentWillMount() {
    if (this.state.enable === false) {
      this.props.inputDisable();
    }
  }

  componentDidUpdate() {
    const elem = document.getWebChatElement().getElementById('messages-wrapper').lastChild;
    if (elem.childNodes[1].id !== 'redirect-chat-template') {
      this.props.inputEnable();
    }
  }

  idGenerator = () => 'xxxxxxyxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  handleClick(item) {
    const { storage, redirectBotMessage, redirectGenesysMessage } = this.props.messagesComponent;

    if (item.title === 'Onayla') {
      this.setState({ confirmIsDisable: 'disabled' });
      this.setState({ enable: true });

      this.props.inputDisable();

      this.props.sendUserMessage({
        type: 'CHANGE_CHAT_MESSAGE_TARGET',
        text: `{"conversationId": "${storage.getItem('chatbot.conversationId')}", "chatServiceType": "GENESYS"}`
      });

      this.props.submitMessage({ text: redirectGenesysMessage, avatar: '' });

      this.props.messageChannelBotToAgent();
    }

    if (item.title === 'Vazgeç') {
      this.setState({ refuseIsDisable: 'disabled' });
      this.setState({ confirmIsDisable: 'disabled' });
      this.setState({ enable: true });

      this.props.inputEnable();

      this.props.sendUserMessage({
        type: 'CHANGE_CHAT_MESSAGE_TARGET',
        text: `{"conversationId": "${storage.getItem('chatbot.conversationId')}", "chatServiceType": "RASA"}`
      });

      this.props.submitMessage({ text: redirectBotMessage, avatar: '' });

      this.props.messageChannelAgentToBot();
    }
  }

  render() {
    const { title, menu } = this.props.message;

    const menus = menu.map((item) => {
      let id = '';

      if (this.state[`${item.src}Id`] === '') {
        id = this.idGenerator();
        this.setState({ [`${item.src}Id`]: id });
      }

      const disabled = item.src === 'onayla' ? this.state.confirmIsDisable : this.state.refuseIsDisable;
      const className = item.title === 'Onayla' ? 'accept' : 'nonaccept';

      return (
        <button key={item.title} id={this.state[`${item.src}Id`]} disabled={disabled} className={className} onClick={this.handleClick.bind(this, item)}>
          <span>
            {
              (item.img && true) ?
                item.img.includes('/content/img') ?
                  <img className="button-icon" src={this.props.socketUrl + item.img} />
                  :
                  <img className="button-icon" src={item.img} />
                :
                ''
            }
            {item.title}
          </span>
        </button>
      );
    });

    return (
      <div id="redirect-chat-template" className="response">
        <div>
          {title}
        </div>
        <div className="redirect-options">
          {menus}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socketUrl: state.behavior.get('socketUrl')
});

const mapDispatchToProps = dispatch => ({
  submitMessage: (userResponse) => {
    // dispatch(addUserMessage(userResponse));
    dispatch(addResponseMessage(userResponse));
  },
  inputDisable: () => {
    dispatch(toggleInputDisable());
  },
  messageChannelBotToAgent: () => {
    dispatch(messageChannelBotToAgent());
  },
  messageChannelAgentToBot: () => {
    dispatch(messageChannelAgentToBot());
  },
  inputEnable: () => {
    dispatch(toggleInputEnable());
  },
  sendUserMessage: (userResponse) => {
    dispatch(emitUserMessage(userResponse));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RedirectChatOptions);
