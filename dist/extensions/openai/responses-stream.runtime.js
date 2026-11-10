import { a as normalizeFastMode } from "../../string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import "../../llm-YCnSGJtn.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import { i as streamSimple } from "../../stream-NAsW_bVF.mjs";
import { n as buildProviderStreamFamilyHooks } from "../../provider-stream-D-B5aERN.mjs";
import "../../provider-stream-family-DCSl210N.mjs";
import { t as resolveOpenAIModelServiceTiers } from "../../service-tier-policy-CETGWqsV.mjs";
import "../../token-sharing-CmBELw8t.mjs";
import { t as createOpenAINativeWebSearchWrapper } from "../../native-web-search-D-t_bS0j.mjs";
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
	const serviceTiers = ctx.model ? resolveOpenAIModelServiceTiers({
		modelId: ctx.model.id,
		api: ctx.model.api,
		baseUrl: ctx.model.baseUrl
	}) : void 0;
	if (serviceTiers) streamContext = {
		...ctx,
		extraParams: {
			...ctx.extraParams,
			fastMode: () => {
				const raw = ctx.extraParams?.fastMode ?? ctx.extraParams?.fast_mode;
				const requested = normalizeFastMode(typeof raw === "function" ? raw() : raw);
				if (requested === void 0) return;
				if (!serviceTiers.includes("priority")) return false;
				return requested === "ultrafast" ? true : requested;
			}
		}
	};
	if (ctx.auth?.mode === "oauth" && ctx.auth.authFlow === "chatgpt-token-sharing") {
		const underlying = streamContext.streamFn ?? streamSimple;
		streamContext = {
			...streamContext,
			extraParams: {
				...streamContext.extraParams,
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
