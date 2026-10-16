import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { t as classifyProviderFailoverSignalWithPlugin } from "./provider-failover-MPv4CVnn.mjs";
import { a as isBillingErrorMessage, d as isRateLimitErrorMessage, u as isProviderRequestSizeCeilingError } from "./message-patterns-Oyttjfxg.mjs";
import { a as isContextOverflowErrorFromTables, i as hasRateLimitTpmHint, n as classifyFailoverSignalCore, o as isReasoningConstraintErrorMessage, s as looksLikeProviderContextOverflowCandidate, t as classifyFailoverReasonCore } from "./classify-core-DvEr6ITj.mjs";
import "./classification-rules-CID2woQZ.mjs";
import { matchesContextOverflowMessage } from "@openclaw/ai/internal/runtime";
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
	if (isContextOverflowError(errorMessage)) return true;
	return !normalizeLowercaseStringOrEmpty(errorMessage).includes("prompt template") && !matchesContextOverflowMessage(errorMessage, "rate-limit-hint") && matchesContextOverflowMessage(errorMessage, "failover-hint");
}
//#endregion
//#region src/agents/failover/classify.ts
function classifyFailoverSignal(signal, opts) {
	return classifyFailoverSignalCore(signal, (context) => classifyProviderPluginError({
		...context,
		providerPlugin: opts?.providerPlugin
	}));
}
function classifyFailoverReason(raw, opts) {
	return classifyFailoverReasonCore(raw, opts, (context) => classifyProviderPluginError({
		...context,
		providerPlugin: opts?.providerPlugin
	}));
}
//#endregion
export { isLikelyContextOverflowError as i, classifyFailoverSignal as n, isContextOverflowError as r, classifyFailoverReason as t };
