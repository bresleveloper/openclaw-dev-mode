import { createPayloadPatchStreamWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/longcat/stream.ts
function createLongCatThinkingWrapper(baseStreamFn, thinkingLevel) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload }) => {
		payload.thinking = { type: thinkingLevel === "off" ? "disabled" : "enabled" };
		delete payload.reasoning_effort;
	}, { shouldPatch: ({ model }) => model.api === "openai-completions" && model.provider === "longcat" });
}
//#endregion
export { createLongCatThinkingWrapper };
