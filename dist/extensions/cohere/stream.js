import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/cohere/stream.ts
function wrapCohereProviderStream(ctx) {
	return createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload }) => {
		if (Array.isArray(payload.messages)) payload.messages = payload.messages.map((message) => message && typeof message === "object" && message.role === "system" ? {
			...message,
			role: "developer"
		} : message);
		delete payload.tool_choice;
	});
}
//#endregion
export { wrapCohereProviderStream };
