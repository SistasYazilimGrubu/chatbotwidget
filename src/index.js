import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Widget from './components/Widget';
import { initStore, store } from './store/store';
import socket from './socket';
import axios from 'axios';

class ConnectedWidget extends React.Component {
  stylesLoaded = false;

  constructor(props) {
    super(props);
    this.state = {
      widgetConfiguration: null,
      information: null
    };
  }

  componentWillMount() {
    const projectId = this.props.customData.projectId || localStorage.getItem('chatbot.projectId'); // Storage daha ayarlanmadığı için burada localStorage kullanılıyor.

    const headers = {};

    if (this.props.widgetAccessToken == null || this.props.widgetAccessToken === '') {
      throw new Error('Widget Access Token Missing!');
    }

    if (this.props.customData && this.props.customData.accessToken) {
      headers['Access-Token'] = this.props.customData.accessToken;
    }

    // TODO: '/api/configuration/DEFAULT_WIDGET_ACCESS_TOKEN' -> ilk proje otomatik seçilir ve o projenin ayarları getirilir
    // TODO: '/api/configuration/1/DEFAULT_WIDGET_ACCESS_TOKEN' -> 1 id'li projenin ayarları
    // TODO: '/api/configuration/2/DEFAULT_WIDGET_ACCESS_TOKEN' -> 2 id'li projenin ayarları
    // TODO: Başka bir projeye geçilmek istendiğinde localStorage -> 'chatbot.projectId' değeri güncellenmeli ve socket bağlantısı tekrar kurulmalı.

    this.widgetConfigurationPromise = axios.get(`${this.props.socketUrl}/api/configuration/${projectId != null ? (`${projectId}/`) : ''}${this.props.widgetAccessToken}`, { headers })
      .then((result) => {
        const configuration = result.data;

        console.log(configuration);

        localStorage.setItem('chatbot.projectId', configuration.projectConfiguration.project.projectId);

        this.setState({
          widgetConfiguration: configuration.projectConfiguration.widgetConfiguration,
          information: configuration.projectConfiguration.information
        });
      }, (reason) => {
        console.error(reason);
        console.log(reason.response.data.detail);

        this.setState({
          widgetConfiguration: null,
          information: null
        });
      });
  }

  componentWillUnmount() {
    if (this.widgetConfigurationPromise) {
      this.widgetConfigurationPromise.cancel();
    }
  }

  loadStyles() {
    if (!this.stylesLoaded && window._webChatStyleElements) {
      let lastInsertedElement = null;

      for (const k in window._webChatStyleElements) {
        if (window._webChatStyleElements.hasOwnProperty(k)) {
          const element = window._webChatStyleElements[k];

          let parent;
          if (element.innerText.startsWith('@import url')) {
            parent = document.querySelector('head');

            parent.appendChild(element);
          } else {
            parent = document.getWebChatElement();

            if (!lastInsertedElement) {
              parent.insertBefore(element, parent.firstChild);
            } else if (lastInsertedElement.nextSibling) {
              parent.insertBefore(element, lastInsertedElement.nextSibling);
            } else {
              parent.appendChild(element);
            }

            lastInsertedElement = element;
          }
        }
      }

      this.stylesLoaded = true;
      // delete window._webChatStyleElements;
    }
  }

  render() {
    if (this.state.widgetConfiguration == null) {
      return null;
    }
    this.loadStyles();

    const storage = (this.state.widgetConfiguration.params.storage || this.props.params.storage) === 'session' ? sessionStorage : localStorage;
    const projectId = this.props.customData.projectId || localStorage.getItem('chatbot.projectId');

    deleteStorage(storage, this.props, this.state);

    const sock = socket(storage, this.props.socketUrl, this.props.widgetAccessToken, projectId, this.props.customData, this.state.widgetConfiguration.socketPath || this.props.socketPath);

    initStore(
      this.state.widgetConfiguration.inputTextFieldHint || this.props.inputTextFieldHint,
      this.state.widgetConfiguration.connectingText || this.props.connectingText,
      sock,
      storage,
      this.state.widgetConfiguration.docViewer || this.props.docViewer,
      this.props.socketUrl,
      this.state.widgetConfiguration.buttonType || this.props.buttonType
    );

    return (
      <Provider store={store}>
        <Widget
          socket={sock}
          interval={this.state.widgetConfiguration.interval || this.props.interval}
          initPayload={this.state.widgetConfiguration.initPayload || this.props.initPayload}
          redirectBotMessage={this.state.widgetConfiguration.redirectBotMessage || this.props.redirectBotMessage}
          redirectGenesysMessage={this.state.widgetConfiguration.redirectGenesysMessage || this.props.redirectGenesysMessage}
          errorMessage={this.state.widgetConfiguration.errorMessage || this.props.errorMessage}
          title={this.state.widgetConfiguration.title || this.props.title}
          subtitle={this.state.widgetConfiguration.subtitle || this.props.subtitle}
          customData={this.props.customData}
          handleNewUserMessage={this.props.handleNewUserMessage}
          profileAvatar={this.state.widgetConfiguration.profileAvatar || this.props.profileAvatar}
          agentAvatar={this.state.widgetConfiguration.agentAvatar || this.props.agentAvatar}
          botAvatar={this.state.widgetConfiguration.botAvatar || this.props.botAvatar}
          adminAvatar={this.state.widgetConfiguration.adminAvatar || this.props.adminAvatar}
          systemAvatar={this.state.widgetConfiguration.systemAvatar || this.props.systemAvatar}
          clientAvatar={this.state.widgetConfiguration.clientAvatar || this.props.clientAvatar}
          conversationHistoryTimeInMinutes={this.state.widgetConfiguration.conversationHistoryTimeInMinutes || this.props.conversationHistoryTimeInMinutes}
          showCloseButton={this.state.widgetConfiguration.showCloseButton || this.props.showCloseButton}
          showFullScreenButton={this.state.widgetConfiguration.showFullScreenButton || this.props.showFullScreenButton}
          hideWhenNotConnected={this.state.widgetConfiguration.hideWhenNotConnected || this.props.hideWhenNotConnected}
          fullScreenMode={this.state.widgetConfiguration.fullScreenMode || this.props.fullScreenMode}
          badge={this.props.badge}
          inputCharacterLength={this.state.widgetConfiguration.inputCharacterLength || this.props.inputCharacterLength}
          readonly={this.state.widgetConfiguration.readonly || this.props.readonly}
          embedded={this.state.widgetConfiguration.embedded || this.props.embedded}
          socketDirectlyConnect={this.state.widgetConfiguration.socketDirectlyConnect || this.props.socketDirectlyConnect}
          params={this.state.widgetConfiguration.params || this.props.params}
          storage={storage}
          openLauncherImage={this.state.widgetConfiguration.openLauncherImage || this.props.openLauncherImage}
          closeImage={this.state.widgetConfiguration.closeImage || this.props.closeImage}
          customComponent={this.props.customComponent}
          formBackgroundColor={this.state.information.formBackgroundColor || this.props.formBackgroundColor}
          widgetColor={this.state.information.widgetColor || this.props.widgetColor}
          headerColor={this.state.information.headerColor || this.props.headerColor}
          formItemColor={this.state.information.formItemColor || this.props.formItemColor}
          images={this.state.information.images || this.props.images}
          texts={this.state.information.texts || this.props.texts}
          menuQuickReplies={this.state.information.menuQuickReplies || this.props.menuQuickReplies}
          titleInfo={this.state.information.titleInfo || this.props.titleInfo}
          info={this.state.information.info || this.props.info}
          fontSize={this.state.information.fontSize || this.props.fontSize}
          fontFamily={this.state.information.fontFamily || this.props.fontFamily}
          responseFontSize={this.state.widgetConfiguration.responseFontSize || this.props.responseFontSize}
          responseFontFamily={this.state.widgetConfiguration.responseFontFamily || this.props.responseFontFamily}
          buttonType={this.state.widgetConfiguration.buttonType || this.props.buttonType}
          disableTooltips={this.state.widgetConfiguration.disableTooltips || this.props.disableTooltips}
          newMessageAlert={this.state.widgetConfiguration.newMessageAlert || this.props.newMessageAlert}
        />
      </Provider>
    );
  }
}

ConnectedWidget.propTypes = {
  initPayload: PropTypes.string,
  interval: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  socketUrl: PropTypes.string.isRequired,
  socketPath: PropTypes.string,
  customData: PropTypes.shape({}),
  handleNewUserMessage: PropTypes.func,
  profileAvatar: PropTypes.string,
  agentAvatar: PropTypes.string,
  botAvatar: PropTypes.string,
  adminAvatar: PropTypes.string,
  systemAvatar: PropTypes.string,
  inputTextFieldHint: PropTypes.string,
  inputCharacterLength: PropTypes.number,
  connectingText: PropTypes.string,
  showCloseButton: PropTypes.bool,
  showFullScreenButton: PropTypes.bool,
  hideWhenNotConnected: PropTypes.bool,
  fullScreenMode: PropTypes.bool,
  badge: PropTypes.number,
  readonly: PropTypes.bool,
  embedded: PropTypes.bool,
  socketDirectlyConnect: PropTypes.bool,
  params: PropTypes.object,
  openLauncherImage: PropTypes.string,
  closeImage: PropTypes.string,
  docViewer: PropTypes.bool,
  customComponent: PropTypes.func,
  storage: PropTypes.object,
  buttonType: PropTypes.string,
  disableTooltips: PropTypes.bool,
  newMessageAlert: PropTypes.bool
};

ConnectedWidget.defaultProps = {
  title: 'Welcome',
  customData: {},
  interval: 2000,
  inputTextFieldHint: 'Mesajınızı yazabilirsiniz...',
  inputCharacterLength: 300,
  connectingText: 'Waiting for server...',
  fullScreenMode: false,
  hideWhenNotConnected: false,
  socketUrl: 'http://localhost',
  badge: 0,
  readonly: false,
  embedded: false,
  socketDirectlyConnect: false,
  params: {
    storage: 'local'
  },
  docViewer: false,
  showCloseButton: true,
  showFullScreenButton: false,
  buttonType: 'square',
  disableTooltips: false,
  newMessageAlert: false
};

export default ConnectedWidget;

function deleteStorage(storage, props, state){
  if (props.customData == null || props.customData.conversationId != null) {
    return;
  }

  if ((!state.widgetConfiguration.readonly && !props.readonly) &&
      storage.getItem('chatbot.conversationId') == null || storage.getItem('chatbot.conversationId') === props.customData.conversationId) {
    return;
  }

  const lastConversationMessageTime = storage.getItem("chatbot.lastConversationMessageTime");
  console.log("lastConversationMessageTime= ", lastConversationMessageTime);

  const  conversationHistoryTimeInMinutes = state.widgetConfiguration.conversationHistoryTimeInMinutes || props.conversationHistoryTimeInMinutes;
  console.log("conversationHistoryTimeInMunites= ", conversationHistoryTimeInMinutes);

  if (conversationHistoryTimeInMinutes == null) {
    return;
  }

  if (lastConversationMessageTime == null
      || lastConversationMessageTime === ''
      || (Date.now() - lastConversationMessageTime) < (conversationHistoryTimeInMinutes * 60 * 1000)) {
    return;
  }

  for (const key in storage) {
    if (storage.hasOwnProperty(key) && key.startsWith('chatbot.')) {
      console.log("storage key= ", key);
      storage.removeItem(key);
    }
  }
}
