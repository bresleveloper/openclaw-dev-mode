import { n as inspectSessionBindingByConversation, r as inspectSessionBindingByConversationAsync } from "../session-binding-service-Y64yKy61.js";
//#region src/plugin-sdk/conversation-binding-inspection-runtime.d.ts
export type ConversationBindingInspection = ReturnType<typeof inspectSessionBindingByConversation>;
//#endregion
export { inspectSessionBindingByConversation as inspectConversationBinding, inspectSessionBindingByConversationAsync as inspectConversationBindingAsync };