import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as classifyProviderFailoverSignalWithPlugin } from "./provider-failover-Ckkg2-zr.mjs";
import { a as isBillingErrorMessage, d as isRateLimitErrorMessage, u as isProviderRequestSizeCeilingError } from "./message-patterns-D0mFl7L8.mjs";
import { a as isContextOverflowErrorFromTables, i as hasRateLimitTpmHint, n as classifyFailoverSignalCore, o as isReasoningConstraintErrorMessage, s as looksLikeProviderContextOverflowCandidate, t as classifyFailoverReasonCore } from "./classify-core-BTxG3xnT.mjs";
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
	if (hasRateLimitTpmHint(errorMessage)) return false;
	if (isReasoningConstraintErrorMessage(errorMessage)) return false;
	if (isBillingErrorMessage(errorMessage)) return false;
	if (matchesContextOverflowMessage(errorMessage, "context-window-too-small")) return false;
	if (isRateLimitErrorMessage(errorMessage)) return false;
	if (isContextOverflowError(errorMessage)) return true;
	if (normalizeLowercaseStringOrEmpty(errorMessage).includes("prompt template")) return false;
	if (matchesContextOverflowMessage(errorMessage, "rate-limit-hint")) return false;
	return matchesContextOverflowMessage(errorMessage, "failover-hint");
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
function isFailoverErrorMessage(raw, opts) {
	return classifyFailoverReason(raw, opts) !== null;
}
//#endregion
export { isLikelyContextOverflowError as a, isContextOverflowError as i, classifyFailoverSignal as n, isFailoverErrorMessage as r, classifyFailoverReason as t };
