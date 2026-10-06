import { c as buildProviderStreamFamilyHooks } from "../../provider-stream-8FA_Ndye.mjs";
import "../../provider-stream-family-BhcBffRx.mjs";
import { t as createOpenAINativeWebSearchWrapper } from "../../native-web-search-fqbNsadh.mjs";
//#region extensions/openai/responses-stream.runtime.ts
const { wrapStreamFn } = buildProviderStreamFamilyHooks("openai-responses-defaults");
function wrapOpenAIResponsesStream(ctx) {
	return createOpenAINativeWebSearchWrapper(wrapStreamFn?.(ctx) ?? ctx.streamFn, {
		config: ctx.config,
		agentId: ctx.agentId,
		nativeWebSearchAllowedByToolPolicy: ctx.nativeWebSearchAllowedByToolPolicy
	});
}
//#endregion
export { wrapOpenAIResponsesStream };
