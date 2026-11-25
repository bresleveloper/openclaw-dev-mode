import { o as createEmptyTransportUsage } from "./transport-stream-shared-DPUASGj0.mjs";
// packages/ai/src/transports/assistant-output.ts
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
export { createAssistantOutput as t };
