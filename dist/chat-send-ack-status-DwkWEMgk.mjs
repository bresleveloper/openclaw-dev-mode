import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
//#region src/shared/chat-send-ack-status.ts
function normalizeTerminalChatSendAckStatus(status) {
	const normalized = normalizeLowercaseStringOrEmpty(status);
	return normalized === "ok" || normalized === "timeout" || normalized === "error" ? normalized : void 0;
}
//#endregion
export { normalizeTerminalChatSendAckStatus as t };
