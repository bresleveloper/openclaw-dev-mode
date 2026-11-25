import { requiresClaudeDefaultSampling, resolveClaudeMythos5ModelIdentity, resolveClaudeOpus5ModelIdentity, resolveClaudeSonnet5ModelIdentity } from "openclaw/plugin-sdk/provider-model-shared";
import Anthropic from "@anthropic-ai/sdk";
import { adjustMaxTokensForThinking, stream } from "openclaw/plugin-sdk/llm";
import { buildGuardedModelFetch, copyProviderAcceptanceObserver } from "openclaw/plugin-sdk/provider-transport-runtime";
// extensions/amazon-bedrock-mantle/mantle-anthropic.runtime.ts
/**
* Anthropic Messages stream adapter for Bedrock Mantle. It rewrites Mantle
* endpoints to Anthropic-compatible URLs and adjusts thinking-token budgets.
*/
const MANTLE_ANTHROPIC_BETA = "fine-grained-tool-streaming-2025-05-14";
function isClaudeMythosPreviewModel(model) {
	return [
		model.id,
		model.name,
		model.params?.canonicalModelId
	].filter((value) => typeof value === "string").some((value) => /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(value.trim().toLowerCase().replace(/[\s_.:]+/g, "-")));
}
function resolveMantleReasoning(model, options) {
	if (model.id.includes("claude-opus-4-7")) return;
	const opus5 = resolveClaudeOpus5ModelIdentity(model) !== void 0;
	const sonnet5 = resolveClaudeSonnet5ModelIdentity(model) !== void 0;
	const mythosPreview = isClaudeMythosPreviewModel(model);
	const mandatoryMythos = resolveClaudeMythos5ModelIdentity(model) !== void 0 || mythosPreview;
	const reasoning = options?.reasoning ?? (mandatoryMythos || opus5 || sonnet5 ? "high" : void 0);
	if (opus5) return reasoning === "minimal" ? "low" : reasoning;
	if (sonnet5) return reasoning === "off" || reasoning === "minimal" ? "low" : reasoning;
	if (!mandatoryMythos) return reasoning;
	if (reasoning === "off" || reasoning === "minimal") return "low";
	return mythosPreview && (reasoning === "xhigh" || reasoning === "max") ? "high" : reasoning;
}
function createMantleAnthropicStreamFn() {
	return (model, context, options) => {
		const apiKey = options?.apiKey ?? "";
		const trimmed = model.baseUrl.replace(/\/+$/, "");
		const baseURL = trimmed.endsWith("/anthropic") ? trimmed : trimmed.endsWith("/v1") ? `${trimmed.slice(0, -3)}/anthropic` : `${trimmed}/anthropic`;
		const client = new Anthropic({
			apiKey: null,
			authToken: apiKey,
			baseURL,
			dangerouslyAllowBrowser: true,
			defaultHeaders: {
				accept: "application/json",
				"anthropic-dangerous-direct-browser-access": "true",
				"anthropic-beta": MANTLE_ANTHROPIC_BETA,
				...model.headers,
				...options?.headers
			},
			fetch: buildGuardedModelFetch(model)
		});
		const base = copyProviderAcceptanceObserver(options, {
			...requiresClaudeDefaultSampling(model) ? {} : { temperature: options?.temperature },
			maxTokens: options?.maxTokens || (resolveClaudeOpus5ModelIdentity(model) || resolveClaudeSonnet5ModelIdentity(model) || resolveClaudeMythos5ModelIdentity(model) ? model.maxTokens : Math.min(model.maxTokens, 32e3)),
			signal: options?.signal,
			apiKey,
			cacheRetention: options?.cacheRetention,
			sessionId: options?.sessionId,
			onPayload: options?.onPayload,
			onResponse: options?.onResponse,
			maxRetryDelayMs: options?.maxRetryDelayMs,
			metadata: options?.metadata
		});
		const reasoning = resolveMantleReasoning(model, options);
		const opus5 = resolveClaudeOpus5ModelIdentity(model) !== void 0;
		const sonnet5 = resolveClaudeSonnet5ModelIdentity(model) !== void 0;
		const mythos5 = resolveClaudeMythos5ModelIdentity(model) !== void 0;
		if (!reasoning || reasoning === "off") return stream(model, context, {
			...base,
			client,
			thinkingEnabled: false
		});
		if (opus5 || sonnet5 || mythos5) {
			const effort = opus5 || sonnet5 ? reasoning === "minimal" || reasoning === "low" ? "low" : reasoning === "medium" || reasoning === "xhigh" || reasoning === "max" ? reasoning : "high" : reasoning;
			return stream(model, context, {
				...base,
				client,
				thinkingEnabled: true,
				effort
			});
		}
		const thinkingBudgets = {
			max: 16384,
			xhigh: 16384,
			...options?.thinkingBudgets
		};
		const adjusted = adjustMaxTokensForThinking(base.maxTokens || 0, model.maxTokens, reasoning, {
			...thinkingBudgets,
			...reasoning === "xhigh" ? { high: thinkingBudgets.xhigh } : {}
		});
		const adaptiveThinking = isClaudeMythosPreviewModel(model);
		const thinkingEnabled = adaptiveThinking || adjusted.thinkingBudget >= 1024;
		return stream(model, context, {
			...base,
			client,
			maxTokens: adjusted.maxTokens,
			thinkingEnabled,
			...adaptiveThinking ? { effort: reasoning } : thinkingEnabled ? { thinkingBudgetTokens: adjusted.thinkingBudget } : {}
		});
	};
}
export { createMantleAnthropicStreamFn };
