import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./provider-model-metadata-GUXZiNxy.mjs";
import { a as isOpenAIApiBaseUrl, o as isOpenAICodexBaseUrl } from "./base-url-CsNC9nJ8.mjs";
//#region extensions/openai/transport-policy.ts
const DEFAULT_OPENAI_WS_DEGRADE_COOLDOWN_MS = 6e4;
const AZURE_PROVIDER_IDS = /* @__PURE__ */ new Set(["azure-openai", "azure-openai-responses"]);
function isAzureOpenAIBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return false;
	try {
		return normalizeLowercaseStringOrEmpty(new URL(trimmed).hostname).endsWith(".openai.azure.com");
	} catch {
		return false;
	}
}
function normalizeIdentityValue(value, maxLength = 160) {
	const trimmed = value.trim().replace(/[\r\n]+/g, " ");
	return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
}
function usesKnownNativeOpenAIRoute(provider, baseUrl) {
	const normalizedProvider = normalizeProviderId(provider);
	if (!normalizedProvider) return false;
	if (normalizedProvider === "openai") return !baseUrl || isOpenAIApiBaseUrl(baseUrl) || isOpenAICodexBaseUrl(baseUrl);
	if (AZURE_PROVIDER_IDS.has(normalizedProvider)) return !baseUrl || isAzureOpenAIBaseUrl(baseUrl);
	return false;
}
function resolveSessionHeaders(sessionIdValue) {
	if (!sessionIdValue) return;
	const sessionId = normalizeIdentityValue(sessionIdValue);
	if (!sessionId) return;
	return {
		"x-client-request-id": sessionId,
		"x-openclaw-session-id": sessionId
	};
}
function resolveOpenAITransportTurnState(ctx) {
	if (!usesKnownNativeOpenAIRoute(ctx.provider, ctx.model?.baseUrl)) return;
	const sessionHeaders = resolveSessionHeaders(ctx.sessionId);
	if (!sessionHeaders) return ctx.transport === "websocket" ? { websocket: { degradeCooldownMs: DEFAULT_OPENAI_WS_DEGRADE_COOLDOWN_MS } } : void 0;
	const turnId = normalizeIdentityValue(ctx.turnId);
	const attempt = String(Math.max(1, ctx.attempt));
	return {
		headers: {
			...sessionHeaders,
			"x-openclaw-turn-id": turnId,
			"x-openclaw-turn-attempt": attempt
		},
		metadata: {
			openclaw_session_id: sessionHeaders["x-openclaw-session-id"] ?? "",
			openclaw_turn_id: turnId,
			openclaw_turn_attempt: attempt,
			openclaw_transport: ctx.transport
		},
		...ctx.transport === "websocket" ? { websocket: {
			headers: sessionHeaders,
			degradeCooldownMs: DEFAULT_OPENAI_WS_DEGRADE_COOLDOWN_MS
		} } : {}
	};
}
//#endregion
export { resolveOpenAITransportTurnState as t };
