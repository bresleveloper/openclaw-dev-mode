import { t as FAILOVER_REASONS$1 } from "./failover-reasons-Mjd0tFtT.mjs";
import { a as resolveLoadedProviderRuntimePlugin, i as resolveLoadedProviderPluginsForHooks } from "./provider-hook-runtime-BGP4teSf.mjs";
//#region src/agents/failover/signal.ts
/** Persisted and wire-visible failover reason codes. Spellings are frozen. */
const FAILOVER_REASONS = FAILOVER_REASONS$1;
//#endregion
//#region src/plugins/provider-failover.ts
function isFailoverReason(value) {
	return typeof value === "string" && FAILOVER_REASONS.some((reason) => reason === value);
}
function classifyProviderFailoverSignalWithPlugin(params) {
	const plugins = resolveProviderPluginsForScopedHook(params);
	for (const plugin of plugins) {
		if (plugin.matchesContextOverflowError?.(params.context)) return "context_overflow";
		const reason = plugin.classifyFailoverReason?.(params.context);
		if (reason) return isFailoverReason(reason) ? reason : void 0;
	}
}
function resolveProviderPluginsForScopedHook(params) {
	if (!params.provider) return resolveLoadedProviderPluginsForHooks(params) ?? [];
	const plugin = resolveLoadedProviderRuntimePlugin({
		...params,
		provider: params.provider
	});
	if (plugin) return [plugin];
	if (hasStructuredFailoverDescriptor(params.context)) return [];
	return resolveLoadedProviderPluginsForHooks(params) ?? [];
}
function hasStructuredFailoverDescriptor(context) {
	return context.status !== void 0 || context.code !== void 0 || context.errorType !== void 0;
}
//#endregion
export { classifyProviderFailoverSignalWithPlugin as t };
