import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { s as resolveSupportedThinkingLevel } from "./thinking-B1p5pEC8.mjs";
import { l as resolveAutoAgentHarnessId, n as resolveAvailableAgentHarnessPolicy } from "./availability-q42mVdu4.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-CJOaEEoJ.mjs";
//#region src/agents/thinking-runtime.ts
function hasResolvedThinkingCatalogEntry(params) {
	const modelId = normalizeOptionalString(params.model);
	if (!modelId) return false;
	const normalizedProvider = normalizeProviderId(params.provider);
	const entry = params.catalog?.find((candidate) => normalizeProviderId(candidate.provider) === normalizedProvider && candidate.id === modelId);
	return entry?.reasoning !== void 0 && (params.agentRuntime === void 0 || entry.nativeRuntime === void 0 || entry.nativeRuntime === params.agentRuntime);
}
/** Native runtimes resolve their own observations; host turns cannot borrow native-only facts. */
function needsThinkHydration(catalog, provider, model, agentRuntime) {
	return agentRuntime !== "openclaw" || !hasResolvedThinkingCatalogEntry({
		catalog,
		provider,
		model,
		agentRuntime
	});
}
function normalizeThinkingCatalogProviders(catalog) {
	return catalog.map((entry) => {
		const provider = normalizeProviderId(entry.provider);
		return provider === entry.provider ? entry : Object.assign({}, entry, { provider });
	});
}
/** Convert residual auto policy into the built-in fallback when no registry selection is needed. */
function concretizeAgentRuntime(runtime) {
	return runtime === "auto" ? "openclaw" : runtime;
}
/** Resolves an explicit session override before configured model/provider policy. */
function resolveEffectiveAgentRuntime(params) {
	const sessionRuntime = resolveSessionRuntimeOverrideForProvider({
		provider: params.provider,
		entry: params.sessionEntry,
		cfg: params.cfg
	});
	const runtime = resolveAvailableAgentHarnessPolicy({
		...params,
		mode: "projection",
		config: params.cfg,
		modelProvider: {
			api: params.modelApi ?? void 0,
			baseUrl: normalizeOptionalString(params.modelBaseUrl)
		},
		agentHarnessId: params.sessionEntry?.modelSelectionLocked ? sessionRuntime : void 0,
		agentHarnessRuntimeOverride: sessionRuntime
	}).runtime;
	if (runtime === "auto") return resolveAutoAgentHarnessId({
		provider: params.provider,
		modelId: params.modelId,
		config: params.cfg,
		...params.agentScope ? {
			agentScope: params.agentScope,
			sessionKey: params.sessionKey
		} : {}
	}) ?? "openclaw";
	return concretizeAgentRuntime(runtime);
}
/** Revalidates a turn-local thinking level after fallback selects its actual model/runtime. */
function resolveCandidateThinkingLevel(params) {
	if (!params.level) return;
	const concreteRuntime = params.agentRuntime?.trim().toLowerCase();
	const agentRuntime = concreteRuntime && concreteRuntime !== "auto" && concreteRuntime !== "default" ? concreteRuntime : resolveEffectiveAgentRuntime({
		cfg: params.cfg ?? {},
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry
	});
	return resolveSupportedThinkingLevel({
		provider: params.provider,
		model: params.modelId,
		level: params.level,
		catalog: params.catalog,
		agentRuntime
	});
}
//#endregion
export { resolveCandidateThinkingLevel as a, normalizeThinkingCatalogProviders as i, hasResolvedThinkingCatalogEntry as n, resolveEffectiveAgentRuntime as o, needsThinkHydration as r, concretizeAgentRuntime as t };
