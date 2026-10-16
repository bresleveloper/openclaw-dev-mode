import { createAnthropicThinkingPrefillPayloadWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
//#region extensions/cloudflare-ai-gateway/stream-wrappers.ts
const log = createSubsystemLogger("cloudflare-ai-gateway-stream");
function wrapCloudflareAiGatewayProviderStream(ctx) {
	if (ctx.model?.api !== void 0 && ctx.model.api !== "anthropic-messages") return ctx.streamFn;
	return createAnthropicThinkingPrefillPayloadWrapper(ctx.streamFn, (stripped) => {
		log.warn(`removed ${stripped} trailing assistant prefill message${stripped === 1 ? "" : "s"} because Anthropic extended thinking requires conversations to end with a user turn`);
	});
}
//#endregion
export { wrapCloudflareAiGatewayProviderStream };
