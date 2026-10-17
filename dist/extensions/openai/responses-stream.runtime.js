import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../llm-BoijNIT8.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { i as streamSimple } from "../../stream-CL_UFGCU.mjs";
import { n as buildProviderStreamFamilyHooks } from "../../provider-stream-aRo8sEaq.mjs";
import "../../provider-stream-family-DbJy-rAq.mjs";
import "../../token-sharing-CmBELw8t.mjs";
import { t as createOpenAINativeWebSearchWrapper } from "../../native-web-search-CUmOOmgJ.mjs";
//#region extensions/openai/responses-stream.runtime.ts
const { wrapStreamFn } = buildProviderStreamFamilyHooks("openai-responses-defaults");
const SIWC_SERVICE_TIERS = [
	"default",
	"priority",
	"ultrafast",
	"slow"
];
function wrapOpenAIResponsesStream(ctx) {
	let streamContext = ctx;
	if (ctx.auth?.mode === "oauth" && ctx.auth.authFlow === "chatgpt-token-sharing") {
		const underlying = ctx.streamFn ?? streamSimple;
		streamContext = {
			...ctx,
			extraParams: {
				...ctx.extraParams,
				transport: "sse",
				responsesServerCompaction: false
			},
			streamFn: (model, context, options) => {
				const headers = new Headers(options?.headers);
				headers.set("x-openai-chatpass-test", "codex-direct");
				const sharingOptions = {
					...options,
					headers: Object.fromEntries(headers.entries()),
					transport: "sse",
					replayResponsesItemIds: false,
					onPayload: async (payload, payloadModel) => {
						const transformed = await options?.onPayload?.(payload, payloadModel);
						const request = asOptionalRecord(transformed ?? payload);
						if (!request) throw new Error("ChatGPT token sharing requires a Responses request object.");
						if (request.service_tier != null && !SIWC_SERVICE_TIERS.some((tier) => tier === request.service_tier)) throw new Error(`Sign in with ChatGPT does not support this service tier. Remove serviceTier/service_tier from the model params or select one of: ${SIWC_SERVICE_TIERS.join(", ")}.`);
						request.store = false;
						for (const field of [
							"context_management",
							"metadata",
							"max_output_tokens",
							"temperature",
							"top_p",
							"prompt_cache_retention"
						]) delete request[field];
						return request;
					}
				};
				return underlying(model, context, sharingOptions);
			}
		};
	}
	return createOpenAINativeWebSearchWrapper(wrapStreamFn?.(streamContext) ?? streamContext.streamFn, {
		config: ctx.config,
		nativeWebSearchAllowedByToolPolicy: ctx.nativeWebSearchAllowedByToolPolicy
	});
}
//#endregion
export { wrapOpenAIResponsesStream };
