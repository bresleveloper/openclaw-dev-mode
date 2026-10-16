//#region src/shared/chat-attachment-frame-budget.ts
const WS_FRAME_ENVELOPE_SLACK_BYTES = 262144;
function resolveChatAttachmentFrameBudgetBytes(maxPayloadBytes) {
	return Math.max(0, Math.floor((maxPayloadBytes - WS_FRAME_ENVELOPE_SLACK_BYTES) * 3 / 4));
}
//#endregion
export { resolveChatAttachmentFrameBudgetBytes as t };
