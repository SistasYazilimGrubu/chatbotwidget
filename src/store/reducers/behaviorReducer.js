import { Map } from 'immutable';
import * as actionTypes from '../actions/actionTypes';
import { SESSION_NAME } from 'constants';
import { getLocalSession, storeParamsTo } from './helper';

export default function (inputFieldTextHint, connectingText, storage, docViewer = false, socketUrl, buttonType) {
  const initialState = Map({
    connected: false,
    lastConversationMessageTime: '',
    socketUrl,
    showInformation: false,
    initialized: false,
    isChatVisible: true,
    isChatOpen: false,
    disabledInput: true,
    docViewer,
    inputFieldTextHint,
    connectingText,
    messageChannel: 'BOT',
    buttonType,
    unreadCount: 0
  });

  return function reducer(state = initialState, action) {
    const storeParams = storeParamsTo(storage);
    switch (action.type) {
      // Each change to the redux store's behavior Map gets recorded to storage
      case actionTypes.SHOW_CHAT: {
        return storeParams(state.update('isChatVisible', isChatVisible => true));
      }
      case actionTypes.HIDE_CHAT: {
        return storeParams(state.update('isChatVisible', isChatVisible => false));
      }
      case actionTypes.TOGGLE_CHAT: {
        return storeParams(state.update('isChatOpen', isChatOpen => !isChatOpen).set('unreadCount', 0));
      }
      case actionTypes.OPEN_CHAT: {
        return storeParams(state.update('isChatOpen', isChatOpen => true).set('unreadCount', 0));
      }
      case actionTypes.CLOSE_CHAT: {
        return storeParams(state.update('isChatOpen', isChatOpen => false));
      }
      case actionTypes.MESSAGE_CHANNEL: {
        const messageChannel = state.get('messageChannel');
        return messageChannel;
      }
      case actionTypes.MESSAGE_CHANNEL_BOT_TO_AGENT: {
        return storeParams(state.update('messageChannel', messageChannel => 'AGENT'));
      }
      case actionTypes.MESSAGE_CHANNEL_AGENT_TO_BOT: {
        return storeParams(state.update('messageChannel', messageChannel => 'BOT'));
      }
      case actionTypes.MESSAGE_CHANNEL_ADMIN_TO_BOT: {
        return storeParams(state.update('messageChannel', messageChannel => 'BOT'));
      }
      case actionTypes.MESSAGE_CHANNEL_BOT_TO_ADMIN: {
        return storeParams(state.update('messageChannel', messageChannel => 'ADMIN'));
      }
      case actionTypes.MESSAGE_CHANNEL_ADMIN_TO_AGENT: {
        return storeParams(state.update('messageChannel', messageChannel => 'AGENT'));
      }
      case actionTypes.MESSAGE_CHANNEL_AGENT_TO_ADMIN: {
        return storeParams(state.update('messageChannel', messageChannel => 'ADMIN'));
      }
      case actionTypes.TOGGLE_FULLSCREEN: {
        return storeParams(state.update('fullScreenMode', fullScreenMode => !fullScreenMode));
      }
      case actionTypes.TOGGLE_INPUT_DISABLED: {
        return storeParams(state.update('disabledInput', disabledInput => !disabledInput));
      }
      case actionTypes.TOGGLE_INPUT_DISABLE: {
        return storeParams(state.update('disabledInput', disabledInput => true));
      }
      case actionTypes.TOGGLE_INPUT_ENABLE: {
        return storeParams(state.update('disabledInput', disabledInput => false));
      }
      case actionTypes.CHANGE_INPUT_FIELD_HINT: {
        return storeParams(state.set('inputFieldTextHint', action.hint));
      }
      case actionTypes.CONNECT: {
        return storeParams(state.set('connected', true).set('disabledInput', false));
      }
      case actionTypes.DISCONNECT: {
        return storeParams(state.set('connected', false).set('disabledInput', true));
      }
      case actionTypes.SOCKET_URL: {
        return state.get('socketUrl');
      }
      case actionTypes.LAST_CONVERSATION_MESSAGE_TIME: {
        const lastConversationMessageTime = state.get('lastConversationMessageTime');
        return lastConversationMessageTime;
      }
      case actionTypes.LAST_CONVERSATION_MESSAGE_TIME_UPDATE: {
        return storeParams(state.update('lastConversationMessageTime', lastConversationMessageTime => action.time));
      }
      case actionTypes.INFORMATION_FORM: {
        const isShowing = state.get('informationForm');
        return isShowing;
      }
      case actionTypes.SHOW_INFORMATION_FORM: {
        return storeParams(state.update('showInformation', showInformation => !showInformation));
      }
      case actionTypes.INITIALIZE: {
        return storeParams(state.set('initialized', true));
      }
      case actionTypes.DEINITIALIZE: {
        return storeParams(state.set('initialized', false));
      }
      case actionTypes.NEW_UNREAD_MESSAGE: {
        return storeParams(state.set('unreadCount', state.get('unreadCount', 0) + 1));
      }
      // Pull params from storage to redux store
      case actionTypes.PULL_SESSION: {
        const localSession = getLocalSession(storage, SESSION_NAME);

        // Do not persist connected state
        const connected = state.get('connected');

        if (localSession && localSession.params) {
          return Map({ ...localSession.params, connected });
        }
        return state;
      }
      default:
        return state;
    }
  };
}
