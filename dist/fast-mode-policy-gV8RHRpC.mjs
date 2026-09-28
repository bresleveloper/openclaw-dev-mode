import { _ as supportsClaudeFastMode, m as resolveClaudeSonnet5ModelIdentity, p as resolveClaudeOpus5ModelIdentity } from "./anthropic-Cy4mTngV.mjs";
//#region extensions/anthropic/fast-mode-policy.ts
function supportsAnthropicPriorityTier(model) {
	return !resolveClaudeOpus5ModelIdentity(model) && !resolveClaudeSonnet5ModelIdentity(model);
}
function normalizeAnthropicServiceTier(value) {
	const normalized = typeof value === "string" ? value.trim().toLowerCase() : void 0;
	return normalized === "auto" || normalized === "standard_only" ? normalized : void 0;
}
/** The request wrapper and model controls share this plan; it does not claim vendor entitlement. */
function resolveAnthropicFastModePlan(context) {
	if (context.provider.trim().toLowerCase() !== "anthropic" || context.runtimeId !== void 0 && context.runtimeId !== "auto" && context.runtimeId !== "openclaw") return;
	if (normalizeAnthropicServiceTier(context.params?.serviceTier ?? context.params?.service_tier) || context.authMode === "oauth") return false;
	const model = {
		id: context.modelId,
		params: context.modelParams
	};
	const native = supportsClaudeFastMode(model);
	if (!native && !supportsAnthropicPriorityTier(model)) return false;
	if (!context.api) return;
	const { endpointClass, allowsAnthropicServiceTier } = context.requestCapabilities;
	if (native ? context.api.trim().toLowerCase() !== "anthropic-messages" || endpointClass !== "default" && endpointClass !== "anthropic-public" : !allowsAnthropicServiceTier) return false;
	if (context.authMode !== "api_key") return;
	return native ? "native" : "service-tier";
}
function resolveFastModeSupport(context) {
	const plan = resolveAnthropicFastModePlan(context);
	return plan === void 0 ? void 0 : plan !== false;
}
//#endregion
export { supportsAnthropicPriorityTier as i, resolveAnthropicFastModePlan as n, resolveFastModeSupport as r, normalizeAnthropicServiceTier as t };
