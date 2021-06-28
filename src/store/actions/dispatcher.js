import { store } from '../store';
import * as actions from './index';

export function isOpen() {
  return store.dispatch(actions.getOpenState());
}

export function isVisible() {
  return store.dispatch(actions.getVisibleState());
}

export function initialize() {
  store.dispatch(actions.initialize());
}

export function deInitialize() {
  store.dispatch(actions.deInitialize());
}

export function connect() {
  store.dispatch(actions.connect());
}

export function disconnect() {
  store.dispatch(actions.disconnect());
}

export function socketUrl() {
  store.dispatch(actions.socketUrl());
}

export function lastConversationMessageTime() {
  store.dispatch(actions.lastConversationMessageTime());
}

export function lastConversationMessageTimeUpdate(time) {
  store.dispatch(actions.lastConversationMessageTimeUpdate(time));
}

export function informationForm() {
  store.dispatch(actions.informationForm());
}

export function showInformationForm() {
  store.dispatch(actions.showInformationForm());
}

export function addUserMessage(message) {
  store.dispatch(actions.addUserMessage(message));
}

export function emitUserMessage(message) {
  store.dispatch(actions.emitUserMessage(message));
}

export function addResponseMessage(message) {
  store.dispatch(actions.addResponseMessage(message));
}

export function addLinkSnippet(link) {
  store.dispatch(actions.addLinkSnippet(link));
}

export function addVideoSnippet(video) {
  store.dispatch(actions.addVideoSnippet(video));
}

export function addImageSnippet(image) {
  store.dispatch(actions.addImageSnippet(image));
}

export function addCustomSnippet(custom) {
  store.dispatch(actions.addCustomSnippet(custom));
}


export function addQuickReply(quickReply) {
  store.dispatch(actions.addQuickReply(quickReply));
}

export function setQuickReply(id, title) {
  store.dispatch(actions.setQuickReply(id, title));
}

export function insertUserMessage(id, text) {
  store.dispatch(actions.insertUserMessage(id, text));
}

export function renderCustomComponent(component, props, showAvatar = false) {
  store.dispatch(actions.renderCustomComponent(component, props, showAvatar));
}

export function openChat() {
  store.dispatch(actions.openChat());
}

export function closeChat() {
  store.dispatch(actions.closeChat());
}

export function toggleChat() {
  store.dispatch(actions.toggleChat());
}

export function showChat() {
  store.dispatch(actions.showChat());
}

export function hideChat() {
  store.dispatch(actions.hideChat());
}

export function messageChannel() {
  store.dispatch(actions.messageChannel());
}

export function messageChannelBotToAgent() {
  store.dispatch(actions.messageChannelBotToAgent());
}

export function messageChannelAgentToBot() {
  store.dispatch(actions.messageChannelAgentToBot());
}

export function messageChannelAdminToBot() {
  store.dispatch(actions.messageChannelAdminToBot());
}

export function messageChannelBotToAdmin() {
  store.dispatch(actions.messageChannelBotToAdmin());
}

export function messageChannelAdminToAgent() {
  store.dispatch(actions.messageChannelAdminToAgent());
}

export function messageChannelAgentToAdmin() {
  store.dispatch(actions.messageChannelAgentToAdmin());
}

export function toggleFullScreen() {
  store.dispatch(actions.toggleFullScreen());
}

export function toggleInputDisabled() {
  store.dispatch(actions.toggleInputDisabled());
}

export function toggleInputDisable() {
  store.dispatch(actions.toggleInputDisable());
}

export function toggleInputEnable() {
  store.dispatch(actions.toggleInputEnable());
}

export function changeInputFieldHint(hint) {
  store.dispatch(actions.changeInputFieldHint(hint));
}

export function dropMessages() {
  store.dispatch(actions.dropMessages());
}

export function pullSession() {
  store.dispatch(actions.pullSession());
}

export function newUnreadMessage() {
  store.dispatch(actions.newUnreadMessage());
}
