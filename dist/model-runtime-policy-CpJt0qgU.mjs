import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { T as tryResolveLegacyCompatibilityAgentId, o as resolveAgentEntry, y as resolveNativeModelPrimary } from "./agent-scope-config-CDYpzA0r.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { v as resolveSessionAgentIds } from "./agent-scope-CG17uXFn.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-C5LPYz3z.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { i as resolveProviderModelPolicySurface } from "./provider-model-routes-CRUmK7A5.mjs";
import { r as resolveProviderModelRouteAuthRequirement } from "./provider-model-route-auth-Cbwct-ZM.mjs";
//#region src/agents/model-auth-policy.ts
/** Credential renewal and inference authorization are independent provider contracts. */
function resolveProviderModelAuthPolicy(context) {
	return resolveProviderModelPolicySurface(context.provider)?.resolveModelAuthPolicy?.(context) ?? {
		authRequirement: resolveProviderModelRouteAuthRequirement(context.mode) ?? null,
		compatible: true
	};
}
function policyForModel(params) {
	return resolveProviderModelAuthPolicy({
		provider: params.provider,
		mode: params.mode,
		authFlow: params.authFlow,
		capability: params.capability,
		api: params.modelApi,
		baseUrl: params.modelBaseUrl
	});
}
function isAuthModeAllowedForModel(params) {
	return policyForModel(params).compatible;
}
function assertAuthModeAllowedForModel(params) {
	const policy = policyForModel(params);
	if (policy.compatible) return;
	throw new Error(`Auth profile "${params.profileId}" uses ${params.mode} auth, but ${params.provider}/${params.capability ?? params.modelApi ?? "inference"} ${policy.incompatibilityReason ?? "does not accept this credential"}.`);
}
//#endregion
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
	const provider = resolveEffectiveProvider(params.provider, selected.model);
	const configured = params.runtimePolicy ?? resolveModelRuntimePolicy({
		...params,
		modelId: selected.model
	});
	const runtimeId = normalizeOptionalAgentRuntimeId(configured.policy?.id);
	const selectedRequirement = selected.profile && provider ? resolveProviderModelAuthPolicy({
		provider,
		mode: params.config?.auth?.profiles?.[selected.profile]?.mode ?? params.resolveProfileAuthMode?.(selected.profile),
		authFlow: params.resolveProfileAuthFlow?.(selected.profile)
	}).authRequirement : void 0;
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
	const primary = agentId ? resolveNativeModelPrimary(params.config, agentId) : resolveAgentModelPrimaryValue(params.config.agents?.defaults?.model);
	const primarySelection = primary ? splitTrailingAuthProfile(primary) : void 0;
	const primaryRef = params.primaryModel ? {
		provider: params.primaryModel.provider,
		modelId: splitTrailingAuthProfile(params.primaryModel.model).model
	} : primarySelection ? parseModelCatalogRef(primarySelection.model) : null;
	if (!primaryRef || primaryRef.provider !== provider) return;
	const inheritedPolicy = resolveModelRuntimePolicy({
		...params,
		provider: primaryRef.provider,
		modelId: primaryRef.modelId
	});
	const inheritedRuntimeId = normalizeOptionalAgentRuntimeId(inheritedPolicy.policy?.id);
	const primaryRequirement = primarySelection?.profile ? resolveProviderModelAuthPolicy({
		provider: primaryRef.provider,
		mode: params.config.auth?.profiles?.[primarySelection.profile]?.mode ?? params.resolveProfileAuthMode?.(primarySelection.profile),
		authFlow: params.resolveProfileAuthFlow?.(primarySelection.profile)
	}).authRequirement : void 0;
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
export { isAuthModeAllowedForModel as a, assertAuthModeAllowedForModel as i, resolveModelRouteIntent as n, resolveProviderModelAuthPolicy as o, resolveModelRuntimePolicy as r, resolveAgentRuntimePolicyAgentId as t };
