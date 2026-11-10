//#region src/config/sessions/session-model-fallback.ts
function createAgentPatchedSessionModelFallback(params) {
	const { entry } = params;
	return {
		prevModel: params.model,
		prevProvider: params.provider,
		...entry.modelOverride ? { prevModelOverride: entry.modelOverride } : {},
		...entry.providerOverride ? { prevProviderOverride: entry.providerOverride } : {},
		...entry.modelOverrideSource ? { prevModelOverrideSource: entry.modelOverrideSource } : {},
		...entry.modelOverrideRouteResolution ? { prevModelOverrideRouteResolution: entry.modelOverrideRouteResolution } : {},
		...entry.modelOverrideFallbackOriginProvider ? { prevModelOverrideFallbackOriginProvider: entry.modelOverrideFallbackOriginProvider } : {},
		...entry.modelOverrideFallbackOriginModel ? { prevModelOverrideFallbackOriginModel: entry.modelOverrideFallbackOriginModel } : {},
		...entry.authProfileOverride ? { prevAuthProfileOverride: entry.authProfileOverride } : {},
		...entry.authProfileOverrideSource ? { prevAuthProfileOverrideSource: entry.authProfileOverrideSource } : {},
		...entry.authProfileOverrideCompactionCount !== void 0 ? { prevAuthProfileOverrideCompactionCount: entry.authProfileOverrideCompactionCount } : {},
		...entry.contextWindow ? { prevContextWindow: entry.contextWindow } : {},
		...entry.thinkingLevel ? { prevThinkingLevel: entry.thinkingLevel } : {},
		ts: params.ts,
		source: "agent-patch"
	};
}
//#endregion
export { createAgentPatchedSessionModelFallback as t };
