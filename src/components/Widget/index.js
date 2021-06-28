import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  addCustomSnippet,
  addImageSnippet,
  addLinkSnippet,
  addQuickReply,
  addResponseMessage,
  addUserMessage,
  addVideoSnippet,
  closeChat,
  connectServer,
  deInitialize,
  disconnectServer,
  dropMessages,
  emitUserMessage,
  initialize,
  lastConversationMessageTimeUpdate,
  messageChannelAgentToBot,
  messageChannelBotToAgent,
  messageChannelAdminToBot,
  messageChannelBotToAdmin,
  messageChannelAgentToAdmin,
  messageChannelAdminToAgent,
  openChat,
  pullSession,
  renderCustomComponent,
  showChat,
  toggleChat,
  toggleFullScreen,
  newUnreadMessage
} from 'actions';
import { isCustom, isImage, isQR, isSnippet, isText, isVideo } from './msgProcessor';
import WidgetLayout from './layout';
import { NEXT_MESSAGE } from 'constants';

export let counter = 0;

class Widget extends Component {
  constructor(props) {
    super(props);

    this.messages = [];
    this.typingCount = 0;
    this.agentStartTypingClearTimer = null;

    setInterval(() => {
      if (this.messages.length > 0) {
        this.dispatchMessage(this.messages.shift());
        this.scrollToBottom();
      }
    }, this.props.interval);
  }

    // Farklı browserler kendi arasında senkron olmalı.
    onFocus = () => {
      this.props.dispatch(pullSession());
    };

    componentDidMount() {
      const { storage, socket, widgetColor, formBackgroundColor, formItemColor, headerColor, fontSize, fontFamily, responseFontSize, responseFontFamily } = this.props;

      window.addEventListener('focus', this.onFocus);

      this.props.dispatch(pullSession());

      if (this.props.socketDirectlyConnect || this.props.embedded || storage.getItem('chatbot.conversationId') != null) {
        this.connectToSocket();
      }

      if (this.props.embedded && this.props.initialized) {
        this.props.dispatch(showChat());
        this.props.dispatch(openChat());
      }

      document.body.style.setProperty('--form-item-color', formItemColor);
      document.body.style.setProperty('--form-background-color', formBackgroundColor);
      document.body.style.setProperty('--widget-color', widgetColor);
      document.body.style.setProperty('--header-color', headerColor);
      document.body.style.setProperty('--font-size', fontSize);
      document.body.style.setProperty('--font-family', fontFamily);
      document.body.style.setProperty('--response-font-size', responseFontSize);
      document.body.style.setProperty('--response-font-family', responseFontFamily);
    }

    connectToSocket = () => {
      const { socket, storage } = this.props;

      if (this.props.connected === false) {
        socket.connect(() => {
          this.props.dispatch(connectServer());

          const nextMessage = storage.getItem(`chatbot.${NEXT_MESSAGE}`);

          if (nextMessage !== null) {
            const { message, expiry } = JSON.parse(nextMessage);
            storage.removeItem(`chatbot.${NEXT_MESSAGE}`);

            if (expiry === 0 || expiry > Date.now()) {
              this.props.dispatch(addUserMessage(message));
              this.props.dispatch(emitUserMessage(message));
            }
          }
        }, this.disconnectFromSocket, this.onMessageReceived);
      }
    };

    disconnectFromSocket = () => {
      if (this.props.connected === true) {
        this.props.dispatch(closeChat());
        this.props.dispatch(dropMessages());
        this.props.dispatch(deInitialize());
        this.props.dispatch(lastConversationMessageTimeUpdate(''));

        this.props.socket.disconnect();
        this.props.dispatch(disconnectServer());

        for (const key in this.props.storage) {
          if (this.props.storage.hasOwnProperty(key) && key.startsWith('chatbot.')) {
            this.props.storage.removeItem(key);
          }
        }

        localStorage.removeItem('chatbot.project');
      }
    };

    addMessage = (originalChatMessage, message) => {
      if (this.props.embedded) {
        if (originalChatMessage.hasOwnProperty('messageDirection') && originalChatMessage.messageDirection === 'INBOUND') {
          this.props.dispatch(addUserMessage(message));
        } else {
          this.dispatchMessage(message);
        }
      } else {
        this.messages.push(message);
      }
    };

    getAvatar = (chatMessage) => {
      if (chatMessage.messageChannel === 'BOT') {
        return this.props.botAvatar;
      } else if (chatMessage.messageChannel === 'AGENT') {
        return this.props.agentAvatar;
      } else if (chatMessage.messageChannel === 'ADMIN' || chatMessage.messageChannel === 'BROADCAST') {
        return this.props.adminAvatar;
      }
      return this.props.systemAvatar;
    };

    handleChatMessage = (chatMessage) => {
      if (chatMessage == null) {
        return;
      }

      if (chatMessage.type === 'AGENT_START_TYPING') { // Yazıyor Messajının ekrana basıldığı yer
        this.showTypingAnimation(chatMessage);
      } else if (chatMessage.type === 'CHAT') { // Chat Mesajınnın ekrana basıldığı yer.
        if (this.props.newMessageAlert) {
          sistasChatbotMessageReceived();
        }

        if (Array.isArray(chatMessage.content)) {
          const messageSize = Object.entries(chatMessage.content).length;
          if (messageSize !== 0) {
            chatMessage.content.forEach((content) => {
              if (content.recipient_id != null) {
                delete content.recipient_id;
              }

              if (content.text == null) {
                this.addMessage(chatMessage, { custom: content, avatar: this.getAvatar(chatMessage) });
              } else {
                this.addMessage(chatMessage, { text: content.text, avatar: this.getAvatar(chatMessage) });
              }
            });
          } else {
            this.addMessage(chatMessage, { text: 'Lütfen daha sonra tekrar deneyiniz.', avatar: this.getAvatar(chatMessage) });
          }
        } else if ((chatMessage.content != null && chatMessage.content.custom != null && (chatMessage.content.custom.type === 'changeChatMessageTarget' || chatMessage.content.custom.type === 'button'))
                || (chatMessage.content != null && (chatMessage.content.indexOf('changeChatMessageTarget') !== -1 || chatMessage.content.indexOf('button') !== -1))) {
          const message = { custom: Object, avatar: this.getAvatar(chatMessage) };

          if (typeof chatMessage.content === 'string') {
            message.custom = JSON.parse(chatMessage.content);
          } else {
            message.custom = chatMessage.content;
          }

          this.addMessage(chatMessage, message);
        } else if (!this.props.isChatOpen && !this.props.disableTooltips) {
          this.addMessage(chatMessage, { text: chatMessage.content, avatar: this.getAvatar(chatMessage) });
          this.props.dispatch(newUnreadMessage());
        } else {
          this.addMessage(chatMessage, { text: chatMessage.content, avatar: this.getAvatar(chatMessage) });
        }

        if (this.props.messageChannel !== chatMessage.messageChannel) {
          if (this.props.messageChannel === 'BOT' && chatMessage.messageChannel === 'AGENT') {
            this.props.dispatch(messageChannelBotToAgent());
          } else if (this.props.messageChannel === 'AGENT' && chatMessage.messageChannel === 'BOT') {
            this.props.dispatch(messageChannelAgentToBot());
          } else if (this.props.messageChannel === 'BOT' && chatMessage.messageChannel === 'ADMIN') {
            this.props.dispatch(messageChannelBotToAdmin());
          } else if (this.props.messageChannel === 'ADMIN' && chatMessage.messageChannel === 'BOT') {
            this.props.dispatch(messageChannelAdminToBot());
          } else if (this.props.messageChannel === 'AGENT' && chatMessage.messageChannel === 'ADMIN') {
            this.props.dispatch(messageChannelAgentToAdmin());
          } else if (this.props.messageChannel === 'ADMIN' && chatMessage.messageChannel === 'AGENT') {
            this.props.dispatch(messageChannelAdminToAgent());
          }
        }
      } else if (chatMessage.type === 'AGENT_STOP_TYPING') {
        // this.hideTypingAnimation();
      }
    };

    scrollToBottom = () => {
      const messagesDiv = document.getWebChatElement().getElementById('messages');
      if (messagesDiv != null) {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }
    };

    showTypingAnimation = (chatMessage) => {
      this.typingCount++;

      const messagesWrapper = document.getWebChatElement().getElementById('messages-wrapper'); // Genel Tüm mesajların bulunduğu Div

      if (messagesWrapper.lastChild.id !== 'messageDiv') {
        const messageDiv = document.createElement('div'); // Create Agent Start Typing Message And AvatarDiv

        messageDiv.className = 'message';
        messageDiv.id = 'messageDiv';
        messageDiv.innerHTML = `${'' +
                "<img src='"}${this.props.socketUrl}${this.getAvatar(chatMessage)}' class="avatar" alt="profile" />` +
                '<div class=\'response typing-animation\'>' +
                '   <div class=\'message-text\' id=\'messageText\'>' +
                '       <div class=\'markdown\'>' +
                '           <div class="lds-ellipsis">' +
                '               <div></div>' +
                '               <div></div>' +
                '               <div></div>' +
                '               <div></div>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>';

        messagesWrapper.appendChild(messageDiv); // Tüm mesajların olduğu Div'e mesajımızı ekliyoruz.

        this.scrollToBottom();

        if (this.agentStartTypingClearTimer != null) {
          clearTimeout(this.agentStartTypingClearTimer);
        }

        this.agentStartTypingClearTimer = setTimeout(() => {
          this.hideTypingAnimation(true);
        }, 10000);
      }
    };

    hideTypingAnimation = (reset = false) => {
      this.typingCount--;

      if (reset || this.typingCount < 0) {
        this.typingCount = 0;
      }

      if (this.typingCount === 0) {
        const messageDiv = document.getWebChatElement().getElementById('messageDiv');

        if (messageDiv != null) {
          const messagesWrapper = document.getWebChatElement().getElementById('messages-wrapper');

          if (messagesWrapper != null) {
            messagesWrapper.removeChild(messageDiv);
          }
        }
      }
    };

    onMessageReceived = (payload) => {
      counter = 0;

      this.props.dispatch(lastConversationMessageTimeUpdate(Date.now()));
      this.props.storage.setItem('chatbot.lastConversationMessageTime', Date.now());

      const body = JSON.parse(payload.body);

      if (Array.isArray(body)) {
        for (const k in body) {
          if (body.hasOwnProperty(k)) {
            this.handleChatMessage(body[k]);
          }
        }
      } else {
        this.handleChatMessage(body);
      }
    };

    componentDidUpdate() {
      this.props.dispatch(pullSession());

      // if (!this.props.readonly) {
      this.trySendInitPayload();
      // }

      if (this.props.embedded && this.props.initialized) {
        this.props.dispatch(showChat());
        this.props.dispatch(openChat());
      }
    }

    componentWillUnmount() {
      const { socket } = this.props;

      window.removeEventListener('focus', this.onFocus);

      socket.disconnect();
    }

    // TODO: Need to erase redux store on load if localStorage
    // is erased. Then behavior on reload can be consistent with
    // behavior on first load

    trySendInitPayload = () => {
      const {
        initPayload,
        customData,
        socket,
        initialized,
        isChatOpen,
        isChatVisible,
        readonly,
        embedded,
        connected
      } = this.props;

      // Send initial payload when chat is opened or widget is shown
      if (!initialized && connected && (((isChatOpen && isChatVisible) || embedded))) {
        this.props.dispatch(initialize());
        const init = { text: initPayload, avatar: this.props.botAvatar };
        this.props.dispatch(addResponseMessage(init));
      }
    };

    toggleConversation = () => {
      this.props.dispatch(toggleChat());
      this.connectToSocket();
    };

    toggleFullScreen = () => {
      this.props.dispatch(toggleFullScreen());
      this.connectToSocket();
    };

    dispatchMessage(message) {
      if (Object.keys(message).length === 0) {
        return;
      }
      if (isText(message)) {
        this.props.dispatch(addResponseMessage(message));
      } else if (isQR(message)) {
        this.props.dispatch(addQuickReply(message));
      } else if (isSnippet(message)) {
        const element = message.attachment.payload.elements[0];
        this.props.dispatch(addLinkSnippet({
          title: element.title,
          content: element.buttons[0].title,
          link: element.buttons[0].url,
          target: '_blank'
        }));
      } else if (isVideo(message)) {
        const element = message.attachment.payload;
        this.props.dispatch(addVideoSnippet({
          title: element.title,
          video: element.src
        }));
      } else if (isCustom(message)) {
        this.props.dispatch(addCustomSnippet({
          custom: message
        }));
      } else if (isImage(message)) {
        const element = message.attachment.payload;
        this.props.dispatch(addImageSnippet({
          title: element.title,
          image: element.src
        }));
      } else {
        // some custom message
        const props = message;
        if (this.props.customComponent) {
          this.props.dispatch(renderCustomComponent(this.props.customComponent, props, true));
        }
      }

      this.hideTypingAnimation();
    }

    handleMessageSubmit = (event) => {
      // event.target.message.disabled=true;
      event.preventDefault();
      if (event.target.message.value.trim().length === 0 || this.props.readonly) {
        return false;
      }

      const chatMessageWithChannel = { text: event.target.message.value, avatar: this.props.clientAvatar };

      this.props.dispatch(addUserMessage(chatMessageWithChannel));
      this.props.dispatch(emitUserMessage(chatMessageWithChannel));

      event.target.message.value = '';
    };

    render() {
      return (
        <WidgetLayout
          toggleChat={this.toggleConversation}
          toggleFullScreen={this.toggleFullScreen}
          onSendMessage={this.handleMessageSubmit}
          title={this.props.title}
          redirectGenesysMessage={this.props.redirectGenesysMessage}
          redirectBotMessage={this.props.redirectBotMessage}
          errorMessage={this.props.errorMessage}
          subtitle={this.props.subtitle}
          customData={this.props.customData}
          showInformation={this.props.showInformation}
          profileAvatar={this.props.profileAvatar}
          agentAvatar={this.props.agentAvatar}
          botAvatar={this.props.botAvatar}
          systemAvatar={this.props.systemAvatar}
          clientAvatar={this.props.clientAvatar}
          conversationHistoryTimeInMinutes={this.props.conversationHistoryTimeInMinutes}
          showCloseButton={this.props.showCloseButton}
          showFullScreenButton={this.props.showFullScreenButton}
          hideWhenNotConnected={this.props.hideWhenNotConnected}
          fullScreenMode={this.props.fullScreenMode}
          isChatOpen={this.props.isChatOpen}
          isChatVisible={this.props.isChatVisible}
          badge={this.props.badge}
          readonly={this.props.readonly}
          embedded={this.props.embedded}
          params={this.props.params}
          openLauncherImage={this.props.openLauncherImage}
          closeImage={this.props.closeImage}
          customComponent={this.props.customComponent}
          inputCharacterLength={this.props.inputCharacterLength}
          storage={this.props.storage}
          images={this.props.images}
          texts={this.props.texts}
          menuQuickReplies={this.props.menuQuickReplies}
          titleInfo={this.props.titleInfo}
          info={this.props.info}
          displayUnreadCount={this.props.displayUnreadCount}
        />
      );
    }
}

const mapStateToProps = state => ({
  initialized: state.behavior.get('initialized'),
  connected: state.behavior.get('connected'),
  isChatOpen: state.behavior.get('isChatOpen'),
  isChatVisible: state.behavior.get('isChatVisible'),
  fullScreenMode: state.behavior.get('fullScreenMode'),
  showInformation: state.behavior.get('showInformation'),
  socketUrl: state.behavior.get('socketUrl'),
  lastConversationMessageTime: state.behavior.get('lastConversationMessageTime'),
  messageChannel: state.behavior.get('messageChannel')
});

Widget.propTypes = {
  interval: PropTypes.number,
  title: PropTypes.string,
  customData: PropTypes.shape({}),
  subtitle: PropTypes.string,
  initPayload: PropTypes.string,
  profileAvatar: PropTypes.string,
  agentAvatar: PropTypes.string,
  botAvatar: PropTypes.string,
  adminAvatar: PropTypes.string,
  systemAvatar: PropTypes.string,
  clientAvatar: PropTypes.string,
  conversationHistoryTimeInMinutes: PropTypes.number,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  isChatVisible: PropTypes.bool,
  isChatOpen: PropTypes.bool,
  badge: PropTypes.number,
  socket: PropTypes.shape({}),
  readonly: PropTypes.bool,
  embedded: PropTypes.bool,
  params: PropTypes.object,
  connected: PropTypes.bool,
  initialized: PropTypes.bool,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  customComponent: PropTypes.func,
  inputCharacterLength: PropTypes.number,
  inputTextFieldHint: PropTypes.string,
  storage: PropTypes.object,
  formBackgroundColor: PropTypes.string,
  widgetColor: PropTypes.string,
  headerColor: PropTypes.string,
  formItemColor: PropTypes.string,
  images: PropTypes.array,
  texts: PropTypes.array,
  menuQuickReplies: PropTypes.array,
  titleInfo: PropTypes.string,
  info: PropTypes.string,
  fontSize: PropTypes.string,
  fontFamily: PropTypes.string,
  responseFontSize: PropTypes.string,
  responseFontFamily: PropTypes.string,
  displayUnreadCount: PropTypes.bool,
  disableTooltips: PropTypes.bool,
  newMessageAlert: PropTypes.bool
};

Widget.defaultProps = {
  isChatOpen: false,
  isChatVisible: true,
  fullScreenMode: false,
  displayUnreadCount: true,
  disableTooltips: false,
  newMessageAlert: false
};

export default connect(mapStateToProps)(Widget);
