import { asOptionalRecord, normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { resolveProviderRequestHeaders } from "openclaw/plugin-sdk/provider-http";
import { normalizeOpenAICompatibleReasoningPayload } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/kilocode/stream.ts
const KILOCODE_FEATURE_HEADER = "X-KILOCODE-FEATURE";
const KILOCODE_FEATURE_DEFAULT = "openclaw";
const KILOCODE_FEATURE_ENV_VAR = "KILOCODE_FEATURE";
function resolveKilocodeAppHeaders() {
	const feature = process.env[KILOCODE_FEATURE_ENV_VAR]?.trim() || KILOCODE_FEATURE_DEFAULT;
	return { [KILOCODE_FEATURE_HEADER]: feature };
}
function normalizeKilocodeStopPayload(payloadObj) {
	if (typeof payloadObj.stop === "string") payloadObj.stop = [payloadObj.stop];
}
function normalizeKilocodeStopAfterCaller(value, fallbackPayload) {
	const replacementPayload = asOptionalRecord(value);
	if (replacementPayload) {
		normalizeKilocodeStopPayload(replacementPayload);
		return value;
	}
	if (fallbackPayload) normalizeKilocodeStopPayload(fallbackPayload);
	return value;
}
function isProxyReasoningUnsupported(modelId) {
	const trimmed = normalizeOptionalLowercaseString(modelId);
	const slashIndex = trimmed?.indexOf("/") ?? -1;
	return slashIndex > 0 && trimmed?.slice(0, slashIndex) === "x-ai";
}
function resolveKilocodeThinkingLevel(ctx) {
	if (ctx.modelId === "kilo-auto/balanced" || isProxyReasoningUnsupported(ctx.modelId)) return;
	return ctx.thinkingLevel;
}
function createKilocodeStreamWrapper(baseStreamFn, thinkingLevel) {
	if (!baseStreamFn) return;
	const underlying = baseStreamFn;
	return (model, context, options) => {
		const originalOnPayload = options?.onPayload;
		const headers = resolveProviderRequestHeaders({
			provider: typeof model.provider === "string" ? model.provider : "kilocode",
			api: model.api,
			baseUrl: typeof model.baseUrl === "string" ? model.baseUrl : void 0,
			capability: "llm",
			transport: "stream",
			callerHeaders: options?.headers,
			defaultHeaders: resolveKilocodeAppHeaders(),
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
function wrapKilocodeProviderStream(ctx) {
	if (normalizeOptionalLowercaseString(ctx.provider) !== "kilocode") return;
	return createKilocodeStreamWrapper(ctx.streamFn, resolveKilocodeThinkingLevel(ctx));
}
//#endregion
export { wrapKilocodeProviderStream };
