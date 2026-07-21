import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
//#region src/infra/provider-usage.shared.ts
/** Default timeout for provider usage collection. */
const DEFAULT_TIMEOUT_MS = 5e3;
const PROVIDER_LABELS = {
	anthropic: "Claude",
	clawrouter: "ClawRouter",
	deepseek: "DeepSeek",
	"github-copilot": "Copilot",
	"google-gemini-cli": "Gemini",
	minimax: "MiniMax",
	openai: "OpenAI",
	openrouter: "OpenRouter",
	venice: "Venice",
	xiaomi: "Xiaomi",
	"xiaomi-token-plan": "Xiaomi Token Plan",
	zai: "z.ai"
};
function resolveProviderUsageDisplayName(provider) {
	return PROVIDER_LABELS[provider] ?? provider;
}
/** Returns true for providers whose usage endpoint is only meaningful with OAuth/token auth. */
function isOAuthOnlyUsageProvider(provider) {
	return provider === "openai";
}
/** Maps model/provider ids and credential type into a normalized usage provider id. */
function resolveUsageProviderId(provider, options) {
	if (!provider) return;
	const normalized = normalizeProviderId(provider);
	if (normalized === "openai" && (options?.credentialType === "oauth" || options?.credentialType === "token")) return "openai";
	if (normalized === "openai") return;
	if (normalized === "minimax-portal" || normalized === "minimax-cn" || normalized === "minimax-portal-cn") return "minimax";
	return normalized || void 0;
}
const ignoredErrors = /* @__PURE__ */ new Set([
	"No credentials",
	"No token",
	"No API key",
	"Not logged in",
	"No auth"
]);
const clampPercent = (value) => Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
/** Resolves a promise with a fallback when usage collection exceeds the timeout. */
const withTimeout = async (work, ms, fallback) => {
	let timeout;
	const timeoutMs = resolveTimerTimeoutMs(ms, 1);
	try {
		return await Promise.race([work, new Promise((resolve) => {
			timeout = setTimeout(() => resolve(fallback), timeoutMs);
		})]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
};
//#endregion
export { isOAuthOnlyUsageProvider as a, withTimeout as c, ignoredErrors as i, PROVIDER_LABELS as n, resolveProviderUsageDisplayName as o, clampPercent as r, resolveUsageProviderId as s, DEFAULT_TIMEOUT_MS as t };
