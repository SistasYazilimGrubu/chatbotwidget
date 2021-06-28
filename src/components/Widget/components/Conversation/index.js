import React from 'react';
import PropTypes from 'prop-types';

import Header from './components/Header';
import Messages from './components/Messages';
import Sender from './components/Sender';
import './style.scss';

const Conversation = props =>
  <div className="conversation-container">
    <Header
      title={props.title}
      subtitle={props.subtitle}
      toggleChat={props.toggleChat}
      toggleFullScreen={props.toggleFullScreen}
      fullScreenMode={props.fullScreenMode}
      showCloseButton={props.showCloseButton}
      showFullScreenButton={props.showFullScreenButton}
      connected={props.connected}
      errorMessage={props.errorMessage}
      redirectBotMessage={props.redirectBotMessage}
      connectingText={props.connectingText}
      closeImage={props.closeImage}
      botAvatar={props.botAvatar}
      storage={props.storage}
    />
    <Messages
      profileAvatar={props.profileAvatar}
      agentAvatar={props.agentAvatar}
      errorMessage={props.errorMessage}
      redirectBotMessage={props.redirectBotMessage}
      redirectGenesysMessage={props.redirectGenesysMessage}
      botAvatar={props.botAvatar}
      showInformation={props.showInformation}
      systemAvatar={props.systemAvatar}
      clientAvatar={props.clientAvatar}
      conversationHistoryTimeInMinutes={props.conversationHistoryTimeInMinutes}
      params={props.params}
      customComponent={props.customComponent}
      storage={props.storage}
      images={props.images}
      texts={props.texts}
      menuQuickReplies={props.menuQuickReplies}
      titleInfo={props.titleInfo}
      info={props.info}
    />
    <Sender
      sendMessage={props.sendMessage}
      showInformation={props.showInformation}
      disabledInput={props.disabledInput}
      readonly={props.readonly}
      embedded={props.embedded}
      inputCharacterLength={props.inputCharacterLength}
    />
  </div>;

Conversation.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  sendMessage: PropTypes.func,
  profileAvatar: PropTypes.string,
  agentAvatar: PropTypes.string,
  botAvatar: PropTypes.string,
  systemAvatar: PropTypes.string,
  toggleFullScreen: PropTypes.func,
  fullScreenMode: PropTypes.bool,
  toggleChat: PropTypes.func,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  disabledInput: PropTypes.bool,
  params: PropTypes.object,
  connected: PropTypes.bool,
  connectingText: PropTypes.string,
  closeImage: PropTypes.string,
  customComponent: PropTypes.func,
  inputCharacterLength: PropTypes.number,
  storage: PropTypes.object
};


export default Conversation;
