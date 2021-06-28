import React from 'react';
import ReactDOM from 'react-dom';
import '@webcomponents/webcomponentsjs/webcomponents-bundle';
import { closeChat, hideChat, isOpen, isVisible, openChat, showChat, toggleChat, Widget } from './index_for_react_app';

function getUrlVars() {
  const vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => vars[key] = value);
  return vars;
}

const plugin = {
  init: (args) => {
    const urlVars = getUrlVars();

    const customData = {
      ...urlVars,
      ...args.customData
    };

    const shadow = document.querySelector(args.selector).attachShadow({ mode: 'open' });

    document.getWebChatElement = () => shadow;

    ReactDOM.render(
      <Widget
        socketUrl={args.socketUrl}
        socketPath={args.socketPath}
        widgetAccessToken={urlVars.widgetAccessToken || args.widgetAccessToken}
        interval={args.interval}
        initPayload={args.initPayload}
        redirectBotMessage={args.redirectBotMessage}
        errorMessage={args.errorMessage}
        redirectGenesysMessage={args.redirectGenesysMessage}
        title={args.title}
        subtitle={args.subtitle}
        customData={customData}
        inputTextFieldHint={args.inputTextFieldHint}
        inputCharacterLength={args.inputCharacterLength}
        connectingText={args.connectingText}
        profileAvatar={args.profileAvatar}
        agentAvatar={args.agentAvatar}
        botAvatar={args.botAvatar}
        adminAvatar={args.adminAvatar}
        clientAvatar={args.clientAvatar}
        systemAvatar={args.systemAvatar}
        conversationHistoryTimeInMinutes={args.conversationHistoryTimeInMinutes}
        showCloseButton={args.showCloseButton}
        showFullScreenButton={args.showFullScreenButton}
        hideWhenNotConnected={args.hideWhenNotConnected}
        fullScreenMode={args.fullScreenMode}
        badge={args.badge}
        params={args.params}
        readonly={args.readonly}
        embedded={(urlVars.embedded != null && urlVars.embedded.toLowerCase() === 'true') || args.embedded}
        openLauncherImage={args.openLauncherImage}
        closeImage={args.closeImage}
        docViewer={args.docViewer}
        formBackgroundColor={args.formBackgroundColor}
        widgetColor={args.widgetColor}
        headerColor={args.headerColor}
        formItemColor={args.formItemColor}
        images={args.images}
        texts={args.texts}
        menuQuickReplies={args.menuQuickReplies}
        titleInfo={args.titleInfo}
        info={args.info}
        fontSize={args.fontSize}
        fontFamily={args.fontFamily}
        responseFontSize={args.responseFontSize}
        responseFontFamily={args.responseFontFamily}
        buttonType={args.buttonType}
        disableTooltips={args.disableTooltips}
        newMessageAlert={(urlVars.newMessageAlert != null && urlVars.newMessageAlert.toLowerCase() === 'true') || args.newMessageAlert}
      />, shadow
    );
  }
};

export {
  plugin as default,
  Widget,
  toggleChat as toggle,
  openChat as open,
  closeChat as close,
  showChat as show,
  hideChat as hide,
  isOpen,
  isVisible
};
