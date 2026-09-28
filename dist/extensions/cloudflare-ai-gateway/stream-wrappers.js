import { createAnthropicThinkingPrefillPayloadWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/cloudflare-ai-gateway/stream-wrappers.ts
const log = createSubsystemLogger("cloudflare-ai-gateway-stream");
function shouldPatchAnthropicMessagesPayload(model) {
	return model?.api === void 0 || model.api === "anthropic-messages";
}
/**
* Creates a wrapper that removes trailing assistant prefill messages before
* extended-thinking Anthropic requests are sent through Cloudflare.
*/
function createCloudflareAiGatewayAnthropicThinkingPrefillWrapper(baseStreamFn) {
	return createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn, (stripped) => {
		log.warn(`removed ${stripped} trailing assistant prefill message${stripped === 1 ? "" : "s"} because Anthropic extended thinking requires conversations to end with a user turn`);
	});
}
/**
* Applies the Anthropic payload wrapper only for Anthropic-compatible models.
*/
function wrapCloudflareAiGatewayProviderStream(ctx) {
	if (!shouldPatchAnthropicMessagesPayload(ctx.model)) return ctx.streamFn;
	return createCloudflareAiGatewayAnthropicThinkingPrefillWrapper(ctx.streamFn);
}
//#endregion
export { wrapCloudflareAiGatewayProviderStream };
