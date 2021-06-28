import * as actions from './actionTypes';

export function initialize() {
  return {
    type: actions.INITIALIZE
  };
}

export function deInitialize() {
  return {
    type: actions.DEINITIALIZE
  };
}


export function connectServer() {
  return {
    type: actions.CONNECT
  };
}

export function socketUrl() {
  return {
    type: actions.SOCKET_URL
  };
}

export function lastConversationMessageTime() {
  return {
    type: actions.LAST_CONVERSATION_MESSAGE_TIME
  };
}

export function lastConversationMessageTimeUpdate(time) {
  return {
    type: actions.LAST_CONVERSATION_MESSAGE_TIME_UPDATE,
    time
  };
}

export function informationForm() {
  return {
    type: actions.INFORMATION_FORM
  };
}

export function showInformationForm() {
  return {
    type: actions.SHOW_INFORMATION_FORM
  };
}


export function disconnectServer() {
  return {
    type: actions.DISCONNECT
  };
}

export function getOpenState() {
  return {
    type: actions.GET_OPEN_STATE
  };
}

export function getVisibleState() {
  return {
    type: actions.GET_VISIBLE_STATE
  };
}

export function showChat() {
  return {
    type: actions.SHOW_CHAT
  };
}

export function hideChat() {
  return {
    type: actions.HIDE_CHAT
  };
}

export function toggleChat() {
  return {
    type: actions.TOGGLE_CHAT
  };
}

export function openChat() {
  return {
    type: actions.OPEN_CHAT
  };
}

export function closeChat() {
  return {
    type: actions.CLOSE_CHAT
  };
}

export function toggleFullScreen() {
  return {
    type: actions.TOGGLE_FULLSCREEN
  };
}

export function toggleInputDisabled() {
  return {
    type: actions.TOGGLE_INPUT_DISABLED
  };
}

export function toggleInputDisable() {
  return {
    type: actions.TOGGLE_INPUT_DISABLE
  };
}

export function toggleInputEnable() {
  return {
    type: actions.TOGGLE_INPUT_ENABLE
  };
}


export function messageChannel() {
  return {
    type: actions.MESSAGE_CHANNEL
  };
}

export function messageChannelBotToAgent() {
  return {
    type: actions.MESSAGE_CHANNEL_BOT_TO_AGENT
  };
}

export function messageChannelAgentToBot() {
  return {
    type: actions.MESSAGE_CHANNEL_AGENT_TO_BOT
  };
}

export function messageChannelAdminToBot() {
  return {
    type: actions.MESSAGE_CHANNEL_ADMIN_TO_BOT
  };
}

export function messageChannelBotToAdmin() {
  return {
    type: actions.MESSAGE_CHANNEL_BOT_TO_ADMIN
  };
}

export function messageChannelAgentToAdmin() {
  return {
    type: actions.MESSAGE_CHANNEL_AGENT_TO_ADMIN
  };
}

export function messageChannelAdminToAgent() {
  return {
    type: actions.MESSAGE_CHANNEL_ADMIN_TO_AGENT
  };
}

export function changeInputFieldHint(hint) {
  return {
    type: actions.CHANGE_INPUT_FIELD_HINT,
    hint
  };
}

export function addUserMessage(message) {
  return {
    type: actions.ADD_NEW_USER_MESSAGE,
    message
  };
}

export function emitUserMessage(message) {
  return {
    type: actions.EMIT_NEW_USER_MESSAGE,
    message
  };
}

export function addResponseMessage(message) {
  return {
    type: actions.ADD_NEW_RESPONSE_MESSAGE,
    message
  };
}

export function addLinkSnippet(link) {
  return {
    type: actions.ADD_NEW_LINK_SNIPPET,
    link
  };
}

export function addVideoSnippet(video) {
  return {
    type: actions.ADD_NEW_VIDEO_VIDREPLY,
    video
  };
}

export function addImageSnippet(image) {
  return {
    type: actions.ADD_NEW_IMAGE_IMGREPLY,
    image
  };
}

export function addCustomSnippet(custom) {
  return {
    type: actions.ADD_NEW_CUSTOM_CUSTOMREPLY,
    custom
  };
}

export function addQuickReply(quickReply) {
  return {
    type: actions.ADD_QUICK_REPLY,
    quickReply
  };
}

export function setQuickReply(id, title) {
  return {
    type: actions.SET_QUICK_REPLY,
    id,
    title
  };
}

export function insertUserMessage(index, text) {
  return {
    type: actions.INSERT_NEW_USER_MESSAGE,
    index,
    text
  };
}

/* export function renderCustomComponent(component, props, showAvatar) {
  return {
    type: actions.ADD_COMPONENT_MESSAGE,
    component,
    props,
    showAvatar
  };
}
 */
export function dropMessages() {
  return {
    type: actions.DROP_MESSAGES
  };
}

export function pullSession() {
  return {
    type: actions.PULL_SESSION
  };
}

export function newUnreadMessage() {
  return {
    type: actions.NEW_UNREAD_MESSAGE
  };
}
