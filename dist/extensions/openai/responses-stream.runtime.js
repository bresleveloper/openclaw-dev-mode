import { c as buildProviderStreamFamilyHooks } from "../../provider-stream-DQUA16y1.mjs";
import "../../provider-stream-family-YEUW6xGn.mjs";
import { t as createOpenAINativeWebSearchWrapper } from "../../native-web-search-acwGPiI2.mjs";
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
