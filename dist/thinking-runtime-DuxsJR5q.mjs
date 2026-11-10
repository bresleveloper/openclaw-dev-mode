import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { o as resolveAutoAgentHarnessId } from "./support-CqB31PZB.mjs";
import { n as resolveAvailableAgentHarnessPolicy } from "./availability-CUqXgij4.mjs";
import { c as resolveSupportedThinkingLevel } from "./thinking-BCNoGfZ5.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
//#region src/agents/thinking-runtime.ts
function hasResolvedThinkingCatalogEntry(params) {
	const modelId = normalizeOptionalString(params.model);
	if (!modelId) return false;
	const normalizedProvider = normalizeProviderId(params.provider);
	const entry = params.catalog?.find((candidate) => normalizeProviderId(candidate.provider) === normalizedProvider && candidate.id === modelId);
	return entry?.reasoning !== void 0 && (params.agentRuntime === void 0 || entry.nativeRuntime === void 0 || entry.nativeRuntime === params.agentRuntime);
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
		mode: params.mode ?? "projection",
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
/** Resolves the concrete runtime that owns a candidate turn; a concrete caller selection wins. */
function resolveCandidateAgentRuntime(params) {
	const concreteRuntime = params.agentRuntime?.trim().toLowerCase();
	if (concreteRuntime && concreteRuntime !== "auto" && concreteRuntime !== "default") return concreteRuntime;
	return resolveEffectiveAgentRuntime({
		cfg: params.cfg ?? {},
		provider: params.provider,
		modelId: params.modelId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry
	});
}
/** Revalidates a turn-local thinking level after fallback selects its actual model/runtime. */
function resolveCandidateThinkingLevel(params) {
	if (!params.level) return;
	return resolveSupportedThinkingLevel({
		provider: params.provider,
		model: params.modelId,
		level: params.level,
		catalog: params.catalog,
		agentRuntime: resolveCandidateAgentRuntime(params)
	});
}
//#endregion
export { resolveCandidateThinkingLevel as a, resolveCandidateAgentRuntime as i, hasResolvedThinkingCatalogEntry as n, resolveEffectiveAgentRuntime as o, normalizeThinkingCatalogProviders as r, concretizeAgentRuntime as t };
