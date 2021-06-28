import React, { Component } from 'react';
import { connect } from 'react-redux';
import InformationForm from '../InformationForm/index';
import { MESSAGES_TYPES } from 'constants';
import { Custom, Image, Message, QuickReply, Snippet, Video } from 'messagesComponents';
import PropTypes from 'prop-types';
import './styles.scss';

class Messages extends Component {
  componentDidMount() {
    if (this.props.showInformation === false) {
      this.scrollToBottom();

      const focusElement = document.getWebChatElement().getElementById('sendinput');

      if (focusElement != null) {
        focusElement.focus();
      }
    }
  }

  componentDidUpdate() {
    if (this.props.showInformation === false) {
      this.scrollToBottom();

      const focusElement = document.getWebChatElement().getElementById('sendinput');

      if (focusElement != null) {
        focusElement.focus();
      }
    }
  }

  getComponentToRender = (message, index, isLast) => {
    const { params } = this.props;

    const ComponentToRender = (() => {
      switch (message.get('type')) {
        case MESSAGES_TYPES.TEXT: {
          return Message;
        }
        case MESSAGES_TYPES.SNIPPET.LINK: {
          return Snippet;
        }
        case MESSAGES_TYPES.VIDREPLY.VIDEO: {
          return Video;
        }
        case MESSAGES_TYPES.CUSTOMREPLY.CUSTOM: {
          return Custom;
        }
        case MESSAGES_TYPES.IMGREPLY.IMAGE: {
          return Image;
        }
        case MESSAGES_TYPES.QUICK_REPLY: {
          return QuickReply;
        }
        case MESSAGES_TYPES.CUSTOM_COMPONENT:
          return connect(store => ({ store }), dispatch => ({ dispatch }))(this.props.customComponent);
      }
      return null;
    })();

    if (message.get('type') === 'component') {
      return <ComponentToRender id={index} {...message.get('props')} messagesComponent={this.props} isLast={isLast} />;
    }

    return (
      <ComponentToRender
        id={index} params={params} messagesComponent={this.props} message={message}
        isLast={isLast}
      />);
  };

  scrollToBottom = () => {
    const messagesDiv = document.getWebChatElement().getElementById('messages');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  render() {
    return (
      <div id="messages" className="messages-container">
        <div id="messages-wrapper">
          {
            this.props.messages.map((message, index) =>
              <div className="message" style={this.props.showInformation === false ? block : none} key={index}>
                {
                  message.get('sender') === 'response' &&
                      message.get('showAvatar') &&
                      (message.get('avatar') || this.props.botAvatar || this.props.systemAvatar) &&
                      <img
                        src={this.props.socketUrl + (message.get('avatar') || this.props.botAvatar || this.props.systemAvatar)}
                        className="avatar" alt="profile"
                      />
                }
                {
                  this.getComponentToRender(message, index, index === this.props.messages.size - 1)
                }
                {
                  message.get('sender') === 'client' &&
                      message.get('showAvatar') &&
                      this.props.clientAvatar &&
                      <img
                        src={this.props.socketUrl + this.props.clientAvatar} className="client-avatar"
                        alt="profile"
                      />
                }
              </div>
            )
          }
        </div>

        <div id="informationForm" style={this.props.showInformation === false ? none : block}>
          <InformationForm
            informationFormItems={this.props.informationFormItems} images={this.props.images}
            texts={this.props.texts} menuQuickReplies={this.props.menuQuickReplies}
            titleInfo={this.props.titleInfo} info={this.props.info}
          />
        </div>
      </div>
    );
  }
}

const none = {
  display: {
    display: 'none'
  }
};

const block = {
  display: {
    display: 'block'
  }
};

const mapStateToProps = store => ({
  messages: store.messages,
  socketUrl: store.behavior.get('socketUrl'),
  behavior: store.behavior
});

Messages.propTypes = {
  storage: PropTypes.object
};

export default connect(mapStateToProps)(Messages);
