import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { S as tryResolveLegacyCompatibilityAgentId, o as resolveAgentEntry } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./legacy.default-agent-owner-B5Sofm47.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-BbSyhfVf.mjs";
import { y as resolveSessionAgentIds } from "./agent-scope-CTuYDtny.mjs";
import { r as resolveProviderModelRouteAuthRequirement } from "./provider-model-route-auth-DkAaX3ui.mjs";
//#region src/agents/model-runtime-policy.ts
/**
* Model runtime policy resolution.
*
* Agent execution uses this to choose a model/provider-specific runtime policy
* from agent entries, model catalog config, provider config, or QA overrides.
*/
/** Resolve request hints; prepared owner facts never re-admit a canonical sentinel. */
function resolveAgentRuntimePolicyAgentId(params) {
	if (params.agentScope?.kind === "prepared") return params.agentScope.agentId;
	return params.config && (params.agentId?.trim() || params.sessionKey?.trim()) ? resolveSessionAgentIds({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}).sessionAgentId : params.agentId;
}
function hasRuntimePolicy(value) {
	return Boolean(value?.id?.trim());
}
function normalizeModelIdForProvider(provider, modelId) {
	const trimmed = modelId?.trim();
	if (!trimmed) return;
	const slash = trimmed.indexOf("/");
	if (slash <= 0) return trimmed;
	const modelProvider = normalizeProviderId(trimmed.slice(0, slash));
	const expectedProvider = normalizeProviderId(provider ?? "");
	if (expectedProvider && modelProvider !== expectedProvider) return trimmed;
	return trimmed.slice(slash + 1).trim() || void 0;
}
function resolveEffectiveProvider(provider, modelId) {
	const normalizedProvider = normalizeProviderId(provider ?? "");
	if (normalizedProvider) return normalizedProvider;
	return parseModelCatalogRef(modelId?.trim() ?? "")?.provider;
}
function resolvePolicyMatch(matches, callerProvider) {
	const providerMatches = callerProvider ? matches.filter((match) => match.provider === callerProvider) : [];
	const candidates = providerMatches.length > 0 ? providerMatches : matches;
	const [first] = candidates;
	if (!first) return {};
	if (!callerProvider && candidates.some((match) => match.provider !== first.provider)) return { ambiguous: true };
	return {
		policy: first.policy,
		source: "model",
		matchedProvider: first.provider || callerProvider
	};
}
function modelEntryMatchKind(params) {
	const entryId = params.entryId.trim();
	if (entryId === params.modelId) return "exact";
	const parsed = parseModelCatalogRef(entryId);
	if (!parsed) return "none";
	const callerProvider = normalizeProviderId(params.provider ?? "");
	if (callerProvider && parsed.provider !== callerProvider) return "none";
	if (parsed.modelId === params.modelId) return "exact";
	if (parsed.modelId === "*") return "provider-wildcard";
	return "none";
}
function resolveAgentModelEntryRuntimePolicy(params) {
	const modelId = normalizeModelIdForProvider(params.provider, params.modelId);
	if (!params.config || !modelId && params.matchKind !== "provider-wildcard") return {};
	const modelMaps = [(params.agentId ? resolveAgentEntry(params.config, params.agentId) : void 0)?.models, params.config.agents?.defaults?.models];
	const callerProvider = normalizeProviderId(params.provider ?? "");
	for (const models of modelMaps) {
		const scopeMatches = [];
		if (!models) continue;
		for (const key of Object.keys(models)) {
			const policy = models[key]?.agentRuntime;
			if (!policy || !hasRuntimePolicy(policy)) continue;
			if (!(modelEntryMatchKind({
				entryId: key,
				provider: params.provider,
				modelId: modelId ?? ""
			}) === params.matchKind)) continue;
			scopeMatches.push({
				provider: parseModelCatalogRef(key)?.provider ?? "",
				policy
			});
		}
		const resolved = resolvePolicyMatch(scopeMatches, callerProvider);
		if (resolved.policy || resolved.ambiguous) return resolved;
	}
	return {};
}
function resolveModelConfig(params) {
	const modelId = normalizeModelIdForProvider(params.provider, params.modelId);
	if (!modelId || !Array.isArray(params.providerConfig?.models)) return;
	return params.providerConfig.models.find((entry) => modelEntryMatchKind({
		entryId: entry.id,
		provider: params.provider,
		modelId
	}) === "exact");
}
/** Resolves the effective runtime policy for an agent/model/provider selection. */
function resolveModelRuntimePolicy(params) {
	const callerProvider = normalizeProviderId(params.provider ?? "");
	const effectiveProvider = resolveEffectiveProvider(params.provider, params.modelId);
	const inferredMatchedProvider = callerProvider ? void 0 : effectiveProvider;
	if (process.env.OPENCLAW_BUILD_PRIVATE_QA === "1") {
		const forcedRuntime = process.env.OPENCLAW_QA_FORCE_RUNTIME?.trim().toLowerCase();
		if (forcedRuntime === "openclaw" || forcedRuntime === "codex") return {
			policy: { id: forcedRuntime },
			source: "model",
			forcedByEnvironment: true
		};
	}
	const agentId = Boolean(params.agentScope || params.agentId?.trim() || params.sessionKey?.trim()) ? resolveAgentRuntimePolicyAgentId(params) : params.config && tryResolveLegacyCompatibilityAgentId(params.config);
	const agentModelPolicy = resolveAgentModelEntryRuntimePolicy({
		...params,
		agentId,
		provider: effectiveProvider,
		matchKind: "exact"
	});
	if (agentModelPolicy.ambiguous) return {};
	if (agentModelPolicy.policy) return agentModelPolicy;
	const providerConfig = effectiveProvider ? resolveMergedModelProviderConfig(params.config, effectiveProvider) : void 0;
	const modelConfig = resolveModelConfig({
		providerConfig,
		provider: effectiveProvider,
		modelId: params.modelId
	});
	if (hasRuntimePolicy(modelConfig?.agentRuntime)) return {
		policy: modelConfig?.agentRuntime,
		source: "model",
		...inferredMatchedProvider ? { matchedProvider: inferredMatchedProvider } : {}
	};
	const agentWildcardModelPolicy = resolveAgentModelEntryRuntimePolicy({
		...params,
		agentId,
		provider: effectiveProvider,
		matchKind: "provider-wildcard"
	});
	if (agentWildcardModelPolicy.policy) return agentWildcardModelPolicy;
	if (hasRuntimePolicy(providerConfig?.agentRuntime)) return {
		policy: providerConfig?.agentRuntime,
		source: "provider",
		...inferredMatchedProvider ? { matchedProvider: inferredMatchedProvider } : {}
	};
	return {};
}
/** Projects authored routing intent without changing harness compatibility or selection. */
function resolveModelRouteIntent(params) {
	const selected = splitTrailingAuthProfile(params.modelId ?? "");
	const configured = params.runtimePolicy ?? resolveModelRuntimePolicy({
		...params,
		modelId: selected.model
	});
	const runtimeId = normalizeOptionalAgentRuntimeId(configured.policy?.id);
	const selectedRequirement = resolveProviderModelRouteAuthRequirement(selected.profile ? params.config?.auth?.profiles?.[selected.profile]?.mode ?? params.resolveProfileAuthMode?.(selected.profile) : void 0);
	if (selectedRequirement) return {
		...runtimeId && !isDefaultAgentRuntimeId(runtimeId) ? { runtimeId } : {},
		authRequirement: selectedRequirement,
		source: "explicit"
	};
	if (runtimeId && !isDefaultAgentRuntimeId(runtimeId)) return {
		runtimeId,
		source: "explicit"
	};
	if (!params.config) return;
	const agentId = resolveAgentRuntimePolicyAgentId(params);
	const agentEntry = agentId ? resolveAgentEntry(params.config, agentId) : void 0;
	const primary = resolveAgentModelPrimaryValue(agentEntry?.model) ?? resolveAgentModelPrimaryValue(params.config.agents?.defaults?.model);
	const primarySelection = primary ? splitTrailingAuthProfile(primary) : void 0;
	const primaryRef = params.primaryModel ? {
		provider: params.primaryModel.provider,
		modelId: splitTrailingAuthProfile(params.primaryModel.model).model
	} : primarySelection ? parseModelCatalogRef(primarySelection.model) : null;
	if (!primaryRef || primaryRef.provider !== resolveEffectiveProvider(params.provider, params.modelId)) return;
	const inheritedPolicy = resolveModelRuntimePolicy({
		...params,
		provider: primaryRef.provider,
		modelId: primaryRef.modelId
	});
	const inheritedRuntimeId = normalizeOptionalAgentRuntimeId(inheritedPolicy.policy?.id);
	const primaryRequirement = resolveProviderModelRouteAuthRequirement(primarySelection?.profile ? params.config.auth?.profiles?.[primarySelection.profile]?.mode ?? params.resolveProfileAuthMode?.(primarySelection.profile) : void 0);
	if (primaryRequirement) return {
		...inheritedRuntimeId && !isDefaultAgentRuntimeId(inheritedRuntimeId) ? { runtimeId: inheritedRuntimeId } : {},
		authRequirement: primaryRequirement,
		source: "inherited"
	};
	return inheritedRuntimeId && !isDefaultAgentRuntimeId(inheritedRuntimeId) ? {
		runtimeId: inheritedRuntimeId,
		source: "inherited"
	} : void 0;
}
//#endregion
export { resolveModelRouteIntent as n, resolveModelRuntimePolicy as r, resolveAgentRuntimePolicyAgentId as t };
