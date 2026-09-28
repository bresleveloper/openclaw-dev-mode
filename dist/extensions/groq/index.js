import { groqMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-D8U6uSHC.mjs";
import { createAssistantMessageEventStream, streamSimple } from "openclaw/plugin-sdk/llm";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
//#region extensions/groq/index.ts
const GROQ_OVERSIZED_RECOVERY_MODEL_ID = "llama-3.3-70b-versatile";
const GROQ_FALLBACK_MAX_TOKENS = 1024;
function hasWireMaxTokens(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
	const record = value;
	return record.max_completion_tokens !== void 0 || record.max_tokens !== void 0;
}
function hasExplicitMaxTokens(extraParams) {
	return extraParams?.maxTokens !== void 0 || hasWireMaxTokens(extraParams) || hasWireMaxTokens(extraParams?.extra_body) || hasWireMaxTokens(extraParams?.extraBody);
}
function isGroqTpmRequestTooLargeEvent(event) {
	if (event.type !== "error") return false;
	const message = event.error.errorMessage?.toLowerCase() ?? "";
	return message.includes("413 request too large for model") && message.includes("tokens per minute (tpm)") && message.includes("limit ") && message.includes("requested ");
}
function wrapGroqOversizedRequestRecovery(streamFn, enabled) {
	const underlying = streamFn ?? streamSimple;
	if (!enabled) return underlying;
	const withoutTools = (model, context, options) => {
		const originalOnPayload = options?.onPayload;
		return underlying(model, context, {
			...options,
			async onPayload(payload, payloadModel) {
				const replacement = await originalOnPayload?.(payload, payloadModel);
				const finalPayload = replacement && typeof replacement === "object" ? replacement : payload;
				const record = finalPayload;
				delete record.tools;
				delete record.tool_choice;
				delete record.parallel_tool_calls;
				delete record.parallelToolCalls;
				delete record.max_tokens;
				delete record.max_completion_tokens;
				record.max_completion_tokens = GROQ_FALLBACK_MAX_TOKENS;
				return finalPayload;
			}
		});
	};
	return (model, context, options) => {
		if (options?.maxTokens !== void 0) return underlying(model, context, options);
		const initial = underlying(model, context, options);
		const output = createAssistantMessageEventStream();
		(async () => {
			try {
				const resolvedInitial = await Promise.resolve(initial);
				let forwarded = false;
				let retryWithoutTools = false;
				for await (const event of resolvedInitial) {
					if (!forwarded && !options?.signal?.aborted && isGroqTpmRequestTooLargeEvent(event)) {
						retryWithoutTools = true;
						break;
					}
					output.push(event);
					forwarded = true;
				}
				if (retryWithoutTools) {
					const fallback = await Promise.resolve(withoutTools(model, context, options));
					for await (const event of fallback) output.push(event);
				}
			} catch (error) {
				output.push({
					type: "error",
					reason: "error",
					error: {
						role: "assistant",
						content: [],
						api: model.api,
						provider: model.provider,
						model: model.id,
						usage: {
							input: 0,
							output: 0,
							cacheRead: 0,
							cacheWrite: 0,
							totalTokens: 0,
							cost: {
								input: 0,
								output: 0,
								cacheRead: 0,
								cacheWrite: 0,
								total: 0
							}
						},
						stopReason: "error",
						errorMessage: error instanceof Error ? error.message : String(error),
						timestamp: Date.now()
					}
				});
			} finally {
				output.end();
			}
		})();
		return output;
	};
}
var groq_default = defineSingleProviderPluginEntry({
	id: "groq",
	name: "Groq Provider",
	description: "Bundled Groq provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Groq",
		docsPath: "/providers/groq",
		catalog: {
			liveModelDiscovery: true,
			discoveryMode: "strict"
		},
		wrapStreamFn: (ctx) => wrapGroqOversizedRequestRecovery(ctx.streamFn, ctx.modelId === GROQ_OVERSIZED_RECOVERY_MODEL_ID && !hasExplicitMaxTokens(ctx.extraParams) && !hasExplicitMaxTokens(ctx.model?.params) && ctx.model?.maxTokensSource === "discovered")
	},
	register(api) {
		api.registerMediaUnderstandingProvider(groqMediaUnderstandingProvider);
	}
});
//#endregion
export { groq_default as default };
