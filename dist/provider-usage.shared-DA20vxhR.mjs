import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
//#region src/infra/provider-usage.shared.ts
/** One provider cannot hold the aggregate usage response beyond this deadline. */
const PROVIDER_USAGE_TIMEOUT_MS = 5e3;
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
	xai: "xAI",
	xiaomi: "Xiaomi",
	"xiaomi-token-plan": "Xiaomi Token Plan",
	zai: "z.ai"
};
/** Dynamic-key lookup view; closed-key reads should use PROVIDER_LABELS directly. */
function providerUsageLabel(provider) {
	return PROVIDER_LABELS[provider];
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
	if (normalized === "claude-cli") return "anthropic";
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
/** Aborts usage collection and returns a fallback when its deadline expires. */
const raceUsageTimeout = async (work, ms, fallback) => {
	let timeout;
	const controller = new AbortController();
	const timeoutMs = resolveTimerTimeoutMs(ms, 1);
	try {
		return await Promise.race([new Promise((resolve) => {
			timeout = setTimeout(() => {
				resolve(fallback);
				controller.abort(new DOMException("Usage collection timed out", "TimeoutError"));
			}, timeoutMs);
		}), work(controller.signal)]);
	} finally {
		if (timeout) clearTimeout(timeout);
	}
};
//#endregion
export { isOAuthOnlyUsageProvider as a, resolveUsageProviderId as c, ignoredErrors as i, PROVIDER_USAGE_TIMEOUT_MS as n, providerUsageLabel as o, clampPercent as r, raceUsageTimeout as s, PROVIDER_LABELS as t };
