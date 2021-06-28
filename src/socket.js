import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

export let STOMP_SOCKET;
let CONNECTED = false;
let RECONNECTION_TIMEOUT;

export default function (storage, socketUrl, widgetAccessToken, projectId, customData, path) {
  function connect(connectCallback = () => {}, errorCallback = () => {}, messageReceivedCallback = () => {}) {
    let conversationId;
    if (customData != null && customData.conversationId != null) {
      conversationId = customData.conversationId;
      storage.setItem('chatbot.conversationId', conversationId);
    } else {
      conversationId = storage.getItem('chatbot.conversationId');
    }

    if (conversationId == null || conversationId === 'null') {
      conversationId = Math.random().toString(36).substring(4); // 8 character random string

      storage.setItem('chatbot.conversationId', conversationId);

      console.log(`New Conversation has created with ID: ${conversationId}`);
    } else {
      console.log(`Persistent Conversation has found with ID: ${conversationId}`);
    }

    if (STOMP_SOCKET == null) {
      let url = socketUrl + path;

      if (customData && customData.accessToken) {
        url += `?accessToken=${customData.accessToken}`;
      }

      STOMP_SOCKET = Stomp.over(new SockJS(url));

      STOMP_SOCKET.connect({ widgetAccessToken, projectId, conversationId, ...customData }, () => {
        const sessionId = STOMP_SOCKET.ws._transport.url.match('\/[0-9]+\/([A-Za-z0-9]{8})')[1];

        console.log(`Socket connection has established. ${conversationId} - ${sessionId}`);

        STOMP_SOCKET.subscribe(`/topic/chat/${sessionId}/reply-chat-message`, messageReceivedCallback, { conversationId, ...customData });

        CONNECTED = true;

        connectCallback();
      }, () => {
        errorCallback();

        reconnect();
      });
    } else {
      reconnect();
    }

    function reconnect() {
      if (!RECONNECTION_TIMEOUT) {
        disconnect(() => console.log('Reconnecting to Socket'), {
          widgetAccessToken,
          projectId,
          conversationId
        });
        RECONNECTION_TIMEOUT = setTimeout(() => {
          connect(connectCallback, errorCallback, messageReceivedCallback);

          RECONNECTION_TIMEOUT = undefined;
        }, 5000);
      }
    }
  }

  function disconnect(disconnectCallback = () => {}, headers = {}) {
    if (STOMP_SOCKET != null) {
      const conversationId = storage.getItem('chatbot.conversationId');

      console.log(`Socket has disconnected. ${conversationId}`);

      STOMP_SOCKET.disconnect(disconnectCallback, { widgetAccessToken, projectId, conversationId });
      STOMP_SOCKET = undefined;

      CONNECTED = false;
    }
  }

  function send(message) {
    if (STOMP_SOCKET != null) {
      /* message = {
          ...message,
          widgetAccessToken,
          projectId
      }; */

      STOMP_SOCKET.send('/app/chat/send-chat-message', {}, JSON.stringify(message));
    }
  }

  function isConnected() {
    return CONNECTED;
  }

  return {
    connect,
    disconnect,
    send,
    isConnected
  };
}
