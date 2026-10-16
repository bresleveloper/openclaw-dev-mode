import { isProxyReasoningUnsupportedModelHint } from "openclaw/plugin-sdk/provider-model-shared";
import { asOptionalRecord, normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveProviderRequestHeaders } from "openclaw/plugin-sdk/provider-http";
import { normalizeOpenAICompatibleReasoningPayload } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/kilocode/stream.ts
function normalizeKilocodeStopAfterCaller(value, fallbackPayload) {
	const payload = asOptionalRecord(value) ?? fallbackPayload;
	if (typeof payload?.stop === "string") payload.stop = [payload.stop];
	return value;
}
function wrapKilocodeProviderStream(ctx) {
	if (normalizeOptionalLowercaseString(ctx.provider) !== "kilocode" || !ctx.streamFn) return;
	const underlying = ctx.streamFn;
	const thinkingLevel = ctx.modelId === "kilo-auto/balanced" || isProxyReasoningUnsupportedModelHint(ctx.modelId) ? void 0 : ctx.thinkingLevel;
	return (model, context, options) => {
		const originalOnPayload = options?.onPayload;
		const headers = resolveProviderRequestHeaders({
			provider: typeof model.provider === "string" ? model.provider : "kilocode",
			api: model.api,
			baseUrl: typeof model.baseUrl === "string" ? model.baseUrl : void 0,
			capability: "llm",
			transport: "stream",
			callerHeaders: options?.headers,
			defaultHeaders: { "X-KILOCODE-FEATURE": process.env.KILOCODE_FEATURE?.trim() || "openclaw" },
			precedence: "defaults-win"
		});
		return underlying(model, context, {
			...options,
			headers,
			onPayload(payload, payloadModel) {
				const payloadObj = asOptionalRecord(payload);
				if (payloadObj) normalizeOpenAICompatibleReasoningPayload(payloadObj, thinkingLevel);
				const result = originalOnPayload?.(payload, payloadModel);
				if (result && typeof result.then === "function") return Promise.resolve(result).then((resolved) => normalizeKilocodeStopAfterCaller(resolved, payloadObj));
				return normalizeKilocodeStopAfterCaller(result, payloadObj);
			}
		});
	};
}
//#endregion
export { wrapKilocodeProviderStream };
