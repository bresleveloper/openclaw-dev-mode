//#region src/gateway/server-methods/chat-text-normalization.ts
function normalizeOptionalChatText(value) {
	return value?.trim() || void 0;
}
function normalizeUnknownChatText(value) {
	return typeof value === "string" ? normalizeOptionalChatText(value) : void 0;
}
//#endregion
export { normalizeUnknownChatText as n, normalizeOptionalChatText as t };
