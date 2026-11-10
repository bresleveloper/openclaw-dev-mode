import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-DqJSDH8t.mjs";
import { o as getRuntimeConfigSnapshot, s as getRuntimeConfigSnapshotMetadata } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as parseModelCatalogRef } from "./model-catalog-refs-D3xvQZh0.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { E as tryResolveLegacyCompatibilityAgentId, b as resolveNativeModelPrimary, o as resolveAgentEntry } from "./agent-scope-config-fjA2T9Gz.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { _ as resolveSessionAgentIds } from "./agent-scope-DXrnO3F4.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import { i as resolveProviderModelPolicySurface } from "./provider-model-routes-CmpBxrCV.mjs";
import { r as resolveProviderModelRouteAuthRequirement } from "./provider-model-route-auth-C7odu5x8.mjs";
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
const agentModelPolicyIndexes = /* @__PURE__ */ new WeakMap();
function readAgentModelPolicyIndex(models, config) {
	const publication = config === getRuntimeConfigSnapshot() ? getRuntimeConfigSnapshotMetadata() : null;
	const cacheable = publication !== null || isDeeplyFrozenPlainData(models);
	const cached = agentModelPolicyIndexes.get(models);
	if (cacheable && cached && cached.publication === publication) return cached.index;
	const index = /* @__PURE__ */ new Map();
	for (const [entryId, entry] of Object.entries(models)) {
		const policy = entry?.agentRuntime;
		if (!hasRuntimePolicy(policy)) continue;
		const parsed = parseModelCatalogRef(entryId.trim());
		const match = {
			entryId,
			provider: parsed?.provider ?? "",
			policy
		};
		for (const key of parsed ? [entryId.trim(), parsed.modelId] : [entryId.trim()]) {
			const matches = index.get(key);
			if (matches) matches.push(match);
			else index.set(key, [match]);
		}
	}
	if (cacheable) agentModelPolicyIndexes.set(models, {
		publication,
		index
	});
	return index;
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
		const key = params.matchKind === "provider-wildcard" ? "*" : modelId ?? "";
		for (const match of readAgentModelPolicyIndex(models, params.config).get(key) ?? []) {
			if (!(modelEntryMatchKind({
				entryId: match.entryId,
				provider: params.provider,
				modelId: modelId ?? ""
			}) === params.matchKind)) continue;
			scopeMatches.push(match);
		}
		const resolved = resolvePolicyMatch(scopeMatches, callerProvider);
		if (resolved.policy || resolved.ambiguous) return resolved;
	}
	return {};
}
function resolveModelConfig(params) {
	const modelId = normalizeModelIdForProvider(params.provider, params.modelId);
	if (!modelId || !Array.isArray(params.providerConfig?.models)) return;
	return params.providerConfig.models.find((entry) => {
		const entryId = entry.id.trim();
		return entryId === modelId || entryId.endsWith(modelId) && modelEntryMatchKind({
			entryId,
			provider: params.provider,
			modelId
		}) === "exact";
	});
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
	const resolveIntent = (provider, profile, runtimeId, source) => {
		const authRequirement = profile && provider ? resolveProviderModelAuthPolicy({
			provider,
			mode: params.config?.auth?.profiles?.[profile]?.mode ?? params.resolveProfileAuthMode?.(profile),
			authFlow: params.resolveProfileAuthFlow?.(profile)
		}).authRequirement : void 0;
		const runtime = runtimeId && !isDefaultAgentRuntimeId(runtimeId) ? runtimeId : void 0;
		if (authRequirement) return {
			...runtime ? { runtimeId: runtime } : {},
			authRequirement,
			source
		};
		return runtime ? {
			runtimeId: runtime,
			source
		} : void 0;
	};
	const selected = splitTrailingAuthProfile(params.modelId ?? "");
	const provider = resolveEffectiveProvider(params.provider, selected.model);
	const configured = params.runtimePolicy ?? resolveModelRuntimePolicy({
		...params,
		modelId: selected.model
	});
	const runtimeId = normalizeOptionalAgentRuntimeId(configured.policy?.id);
	const explicit = resolveIntent(provider, selected.profile, runtimeId, "explicit");
	if (explicit) return explicit;
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
	return resolveIntent(primaryRef.provider, primarySelection?.profile, inheritedRuntimeId, "inherited");
}
//#endregion
export { isAuthModeAllowedForModel as a, assertAuthModeAllowedForModel as i, resolveModelRouteIntent as n, resolveProviderModelAuthPolicy as o, resolveModelRuntimePolicy as r, resolveAgentRuntimePolicyAgentId as t };
