import { p as normalizeTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import "./agent-scope-config-fjA2T9Gz.mjs";
import { n as listAgentEntries } from "./agent-roster-gkYP38su.mjs";
import { o as resolveAgentModelFallbackValues, s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
//#region src/agents/auth-profiles/external-cli-scope.ts
function addProviderScopeId(out, value) {
	const raw = value?.trim();
	if (!raw) return;
	out.add(raw);
	const normalized = normalizeProviderId(raw);
	if (normalized) out.add(normalized);
}
function addProviderScopeFromModelRef(out, value) {
	const raw = value?.trim();
	if (!raw) return;
	const slash = raw.indexOf("/");
	if (slash <= 0) return;
	addProviderScopeId(out, raw.slice(0, slash));
}
function addProviderScopeFromModelConfig(out, model) {
	addProviderScopeFromModelRef(out, resolveAgentModelPrimaryValue(model));
	for (const fallback of resolveAgentModelFallbackValues(model)) addProviderScopeFromModelRef(out, fallback);
}
function addExternalCliRuntimeScope(out, value) {
	const normalized = normalizeProviderId(value?.trim() ?? "");
	if (normalized === "claude-cli" || normalized === "codex" || normalized === "codex-cli" || normalized === "codex-app-server" || normalized === "google-gemini-cli" || normalized === "openai" || normalized === "minimax" || normalized === "minimax-cli" || normalized === "minimax-portal") addProviderScopeId(out, normalized);
}
function addExternalCliRuntimeScopeFromModelMap(out, models) {
	for (const entry of Object.values(models ?? {})) addExternalCliRuntimeScope(out, entry?.agentRuntime?.id);
}
function resolveExternalCliAuthScopeFromConfig(cfg) {
	const providerIds = /* @__PURE__ */ new Set();
	const profileIds = /* @__PURE__ */ new Set();
	for (const id of Object.keys(cfg.models?.providers ?? {})) addProviderScopeId(providerIds, id);
	for (const [profileId, profile] of Object.entries(cfg.auth?.profiles ?? {})) {
		const normalizedProfileId = profileId.trim();
		if (normalizedProfileId) profileIds.add(normalizedProfileId);
		addProviderScopeId(providerIds, profile?.provider);
	}
	for (const [provider, orderedProfileIds] of Object.entries(cfg.auth?.order ?? {})) {
		addProviderScopeId(providerIds, provider);
		for (const profileId of orderedProfileIds ?? []) {
			const normalizedProfileId = profileId.trim();
			if (normalizedProfileId) profileIds.add(normalizedProfileId);
		}
	}
	const defaults = cfg.agents?.defaults;
	addProviderScopeFromModelConfig(providerIds, defaults?.model);
	addProviderScopeFromModelConfig(providerIds, defaults?.imageModel);
	addProviderScopeFromModelConfig(providerIds, defaults?.mediaModels?.image);
	addProviderScopeFromModelConfig(providerIds, defaults?.mediaModels?.video);
	addProviderScopeFromModelConfig(providerIds, defaults?.mediaModels?.music);
	addProviderScopeFromModelConfig(providerIds, defaults?.voiceModel);
	addProviderScopeFromModelConfig(providerIds, defaults?.pdfModel);
	addExternalCliRuntimeScopeFromModelMap(providerIds, defaults?.models);
	for (const provider of Object.values(cfg.models?.providers ?? {})) {
		addExternalCliRuntimeScope(providerIds, provider?.agentRuntime?.id);
		for (const model of provider?.models ?? []) addExternalCliRuntimeScope(providerIds, model?.agentRuntime?.id);
	}
	for (const agent of listAgentEntries(cfg)) {
		addProviderScopeFromModelConfig(providerIds, agent.model);
		addProviderScopeFromModelConfig(providerIds, agent.subagents?.model);
		addExternalCliRuntimeScopeFromModelMap(providerIds, agent.models);
	}
	if (providerIds.size === 0 && profileIds.size === 0) return;
	return {
		providerIds: [...providerIds].toSorted((left, right) => left.localeCompare(right)),
		profileIds: [...profileIds].toSorted((left, right) => left.localeCompare(right))
	};
}
//#endregion
//#region src/agents/auth-profiles/external-cli-discovery.ts
function externalCliDiscoveryNone(params) {
	return {
		mode: "none",
		allowKeychainPrompt: false,
		...params?.config ? { config: params.config } : {}
	};
}
function externalCliDiscoveryScoped(params) {
	return {
		mode: "scoped",
		...params.allowKeychainPrompt !== void 0 ? { allowKeychainPrompt: params.allowKeychainPrompt } : {},
		...params.config ? { config: params.config } : {},
		...params.providerIds ? { providerIds: params.providerIds } : {},
		...params.profileIds ? { profileIds: params.profileIds } : {}
	};
}
function externalCliDiscoveryForProviderAuth(params) {
	const profileIds = normalizeTrimmedStringList([params.profileId, params.preferredProfile]);
	return externalCliDiscoveryScoped({
		config: params.cfg,
		allowKeychainPrompt: params.allowKeychainPrompt ?? false,
		providerIds: [params.provider],
		...profileIds.length > 0 ? { profileIds } : {}
	});
}
function externalCliDiscoveryForConfigStatus(params) {
	const scope = resolveExternalCliAuthScopeFromConfig(params.cfg);
	return scope ? externalCliDiscoveryScoped({
		config: params.cfg,
		allowKeychainPrompt: params.allowKeychainPrompt ?? false,
		providerIds: scope.providerIds,
		profileIds: scope.profileIds
	}) : externalCliDiscoveryNone({ config: params.cfg });
}
function externalCliDiscoveryForProviders(params) {
	const providers = normalizeTrimmedStringList([...params.providers]);
	if (providers.length === 0) return externalCliDiscoveryNone({ config: params.cfg });
	return externalCliDiscoveryScoped({
		config: params.cfg,
		allowKeychainPrompt: params.allowKeychainPrompt ?? false,
		providerIds: providers
	});
}
//#endregion
export { resolveExternalCliAuthScopeFromConfig as a, externalCliDiscoveryScoped as i, externalCliDiscoveryForProviderAuth as n, externalCliDiscoveryForProviders as r, externalCliDiscoveryForConfigStatus as t };
