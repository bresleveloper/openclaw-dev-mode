import { j as resolveTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import "./number-coercion-EqFmHmOw.js";
import { i as normalizeProviderId } from "./provider-id-Dq06Bcx6.js";
//#region src/infra/provider-usage.shared.ts
/** Default timeout for provider usage collection. */
const DEFAULT_TIMEOUT_MS = 5e3;
const PROVIDER_LABELS = {
	anthropic: "Claude",
	deepseek: "DeepSeek",
	"github-copilot": "Copilot",
	"google-gemini-cli": "Gemini",
	minimax: "MiniMax",
	openai: "OpenAI",
	xiaomi: "Xiaomi",
	"xiaomi-token-plan": "Xiaomi Token Plan",
	zai: "z.ai"
};
const usageProviders = [
	"anthropic",
	"deepseek",
	"github-copilot",
	"google-gemini-cli",
	"minimax",
	"openai",
	"xiaomi",
	"xiaomi-token-plan",
	"zai"
];
/** Returns true for providers whose usage endpoint is only meaningful with OAuth/token auth. */
function isOAuthOnlyUsageProvider(provider) {
	return provider === "openai";
}
/** Maps model/provider ids and credential type into supported usage provider ids. */
function resolveUsageProviderId(provider, options) {
	if (!provider) return;
	const normalized = normalizeProviderId(provider);
	if (normalized === "openai" && (options?.credentialType === "oauth" || options?.credentialType === "token")) return "openai";
	if (normalized === "openai") return;
	if (normalized === "minimax-portal" || normalized === "minimax-cn" || normalized === "minimax-portal-cn") return "minimax";
	return usageProviders.includes(normalized) ? normalized : void 0;
}
const ignoredErrors = new Set([
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
export { isOAuthOnlyUsageProvider as a, withTimeout as c, ignoredErrors as i, PROVIDER_LABELS as n, resolveUsageProviderId as o, clampPercent as r, usageProviders as s, DEFAULT_TIMEOUT_MS as t };
