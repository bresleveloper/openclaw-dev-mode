//#region packages/gateway-protocol/src/chat-work-context.ts
/** Bounded, untrusted send-time reference data; never routing or authorization. */
const CHAT_WORK_CONTEXT_LIMITS = {
	page: 64,
	title: 96,
	sessionKey: 192,
	sessionId: 64,
	agentId: 64,
	workspace: 224,
	file: 224,
	selection: 640
};
//#endregion
export { CHAT_WORK_CONTEXT_LIMITS as t };
