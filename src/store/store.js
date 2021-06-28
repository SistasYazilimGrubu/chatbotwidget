import { applyMiddleware, combineReducers, createStore } from 'redux';

import behavior from './reducers/behaviorReducer';
import messages from './reducers/messagesReducer';
import * as actionTypes from './actions/actionTypes';

let store = 'call initStore first';

function initStore(hintText, connectingText, socket, storage, docViewer = false, socketUrl, buttonType) {
  const customMiddleWare = store => next => (action) => {
    switch (action.type) {
      case actionTypes.EMIT_NEW_USER_MESSAGE: {
        const message = {
          conversationId: storage.getItem('chatbot.conversationId'),
          type: action.message.type == null ? 'CHAT' : action.message.type,
          content: action.message.text
        };
        socket.send(message);
      }
      case actionTypes.GET_OPEN_STATE: {
        return store.getState().behavior.get('isChatOpen');
      }
      case actionTypes.GET_VISIBLE_STATE: {
        return store.getState().behavior.get('isChatVisible');
      }
      case actionTypes.GET_FULLSCREEN_STATE: {
        return store.getState().behavior.get('fullScreenMode');
      }
    }

    // console.log('Middleware triggered:', action);
    next(action);
  };
  const reducer = combineReducers({
    behavior: behavior(hintText, connectingText, storage, docViewer, socketUrl, buttonType),
    messages: messages(storage)
  });

  /* eslint-disable no-underscore-dangle */
  // todo prod'da window kapatılacak!!!
  store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && // TODO: prodda kapatılmalı
      window.__REDUX_DEVTOOLS_EXTENSION__(), // TODO: prodda kapatılmalı
    applyMiddleware(customMiddleWare)
  );
  /* eslint-enable */
}

export { initStore, store };
