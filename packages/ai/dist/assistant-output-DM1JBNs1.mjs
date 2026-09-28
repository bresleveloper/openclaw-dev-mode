import { a as createEmptyTransportUsage } from "./transport-stream-shared-B5RioB_Q.mjs";
//#region packages/ai/src/transports/assistant-output.ts
function createAssistantOutput(model, api = model.api) {
	return {
		role: "assistant",
		content: [],
		api,
		provider: model.provider,
		model: model.id,
		usage: createEmptyTransportUsage(),
		stopReason: "stop",
		timestamp: Date.now()
	};
}
//#endregion
export { createAssistantOutput as t };
