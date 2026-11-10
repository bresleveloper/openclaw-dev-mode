import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { d as isProviderRequestSizeCeilingError, f as isRateLimitErrorMessage, o as isBillingErrorMessage } from "./message-patterns-DSkmGYcR.mjs";
import { i as looksLikeProviderContextOverflowCandidate, n as isContextOverflowErrorFromTables, r as isReasoningConstraintErrorMessage, t as hasRateLimitTpmHint } from "./context-overflow-tables-Cn71vUg0.mjs";
import { t as classifyProviderFailoverSignalWithPlugin } from "./provider-failover-07_cMyqo.mjs";
import { matchesContextOverflowMessage } from "@openclaw/ai/internal/shared";
//#region src/agents/failover/provider-patterns.ts
function classifyProviderPluginError(context) {
	const { providerPlugin, ...providerContext } = context;
	if (providerPlugin === null) return null;
	if (providerPlugin) {
		const ownedContext = {
			...providerContext,
			provider: providerPlugin.id
		};
		if (providerPlugin.matchesContextOverflowError?.(ownedContext)) return "context_overflow";
		return providerPlugin.classifyFailoverReason?.(ownedContext) ?? null;
	}
	return classifyProviderFailoverSignalWithPlugin({
		provider: context.provider,
		context: providerContext
	}) ?? null;
}
//#endregion
//#region src/agents/failover/context-overflow.ts
function isContextOverflowError(errorMessage, opts) {
	if (!errorMessage) return false;
	return isContextOverflowErrorFromTables(errorMessage) || looksLikeProviderContextOverflowCandidate(errorMessage) && classifyProviderPluginError({
		errorMessage,
		providerPlugin: opts?.providerPlugin
	}) === "context_overflow";
}
function isLikelyContextOverflowError(errorMessage) {
	if (!errorMessage) return false;
	if (isProviderRequestSizeCeilingError(errorMessage)) return isContextOverflowErrorFromTables(errorMessage);
	if (hasRateLimitTpmHint(errorMessage) || isReasoningConstraintErrorMessage(errorMessage) || isBillingErrorMessage(errorMessage) || matchesContextOverflowMessage(errorMessage, "context-window-too-small") || isRateLimitErrorMessage(errorMessage)) return false;
	return isContextOverflowError(errorMessage) || !normalizeLowercaseStringOrEmpty(errorMessage).includes("prompt template") && !matchesContextOverflowMessage(errorMessage, "rate-limit-hint") && matchesContextOverflowMessage(errorMessage, "failover-hint");
}
//#endregion
export { isLikelyContextOverflowError as n, classifyProviderPluginError as r, isContextOverflowError as t };
