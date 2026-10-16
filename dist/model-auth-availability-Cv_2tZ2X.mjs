import { t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { p as isValidSecretRef } from "./ref-contract-D0kWy5jy.mjs";
import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { i as normalizeProviderIdForAuth, n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-C5LPYz3z.mjs";
import { s as resolveProviderAuthLookupMaps } from "./provider-env-vars-C_lyIdYO.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { a as selectProviderModelAuthSources, c as buildProviderModelAuthSourcePlan, d as toProviderModelAuthReadiness, r as resolveProviderModelRouteAuthRequirement, s as buildProviderModelAuthDirectSource, u as fromProviderModelAuthReadiness } from "./provider-model-route-auth-Cbwct-ZM.mjs";
import { o as resolveProviderModelAuthPolicy } from "./model-runtime-policy-Bz7NzEHI.mjs";
import { i as modelMatchesProviderModelRoute } from "./provider-model-route-BpciAISP.mjs";
import { i as resolveConfiguredOpenAIAuthMode, n as createOpenAIModelRoutesResolver, s as selectOpenAIModelRouteAuth } from "./openai-model-routes-mS12tkxj.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { t as hasAuthoredProviderRequestParams } from "./model-extra-params-C1g6s41K.mjs";
import { i as isActiveUnusableWindow, l as isProfileInCooldown, p as resolveProfileUnusableUntil, u as readInlineProviderApiKeyUsage } from "./profile-usage-stats-BLwxBqRR.mjs";
import { h as getRuntimeExternalCliProfileIds } from "./persisted-BVyWmvfF.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-WXO5HScp.mjs";
import { D as resolveExternalCliAuthProfiles, T as listExternalCliSyncProviderIds } from "./store-SwwRUDrm.mjs";
import { d as getRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-CSLjByUx.mjs";
import { f as resolveManagedSecretRefRuntimeProviderAuth, h as resolveStoredCredentialReadOnlyAvailability, m as resolveSecretRefReadOnlyAvailability, p as hasMalformedSecretInputSyntax } from "./loader-runtime-load-C3He8u8Z.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BJNC949_.mjs";
import { i as resolveAuthProfileEligibility, o as resolveAuthProfileOrderWithMetadata, r as prependAuthProfilePin, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-B7W96aON.mjs";
import { f as listProviderEnvAuthLookupKeys, l as isSecretRefHeaderValueMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import { r as resolveProviderEnvAuthEvidence } from "./model-auth-env-CI3qSPg4.mjs";
import { C as shouldPreferExplicitConfigApiKeyAuth, _ as resolveProviderConfigSecretInput, a as hasSyntheticLocalProviderAuthConfig, o as hasUsableCustomProviderApiKey, y as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-U8dA4bob.mjs";
import { c as resolveCliRuntimeModelBackendBinding, s as resolveCliRuntimeCanonicalProvider } from "./cli-backends-CEoVwGbW.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-B4sEclNg.mjs";
import { t as resolveSelectedModelCredential } from "./model-auth-selected-credential-DJdLesO9.mjs";
import { t as resolveBundledCliBackendAuthPolicy } from "./cli-backend-auth-policy-BJQR9lNK.mjs";
//#region src/agents/model-auth-availability.ts
/** Read-only provider/model auth availability with provider-route selection. */
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
const EXTERNAL_CLI_REFRESH_PROVIDER_IDS = new Set(listExternalCliSyncProviderIds().map(normalizeProviderIdForAuth));
function evaluateCliRuntimeModelAuthAvailability(params, provider, ref, evaluation, evaluateProviderAuth) {
	if (ref.runtimeId === "openclaw") return;
	if (evaluation.routeResolution !== null || normalizeProviderId(provider) === "openai") return;
	const selectedProfileId = ref.pinnedProfileId?.trim() || ref.preferredProfileId?.trim();
	const runtimeProvider = ref.runtimeId && ref.runtimeId !== "auto" ? ref.runtimeId : resolveCliRuntimeExecutionProvider({
		provider,
		cfg: params.cfg,
		agentId: params.agentId,
		modelId: ref.modelId,
		authProfileId: selectedProfileId,
		metadataSnapshot: params.metadataSnapshot,
		preparedAuthDirectories: params.preparedCliRuntimeAuthDirectories
	}) ?? normalizeProviderId(provider);
	const binding = resolveCliRuntimeModelBackendBinding({
		provider,
		runtime: runtimeProvider
	});
	const runtimeOwners = params.metadataSnapshot?.owners?.cliBackends.get(normalizeProviderId(runtimeProvider));
	if (!binding && !runtimeOwners?.length && !resolveCliRuntimeCanonicalProvider({ runtime: runtimeProvider })) return;
	if (ref.runtimeId && runtimeProvider !== normalizeProviderId(provider) && !binding) return {
		availability: false,
		routeResolution: null,
		unavailableReason: "missing-auth"
	};
	if (runtimeOwners?.length) {
		const normalizedPluginConfig = normalizePluginsConfig(params.cfg.plugins);
		if (!runtimeOwners.some((pluginId) => passesManifestOwnerBasePolicy({
			plugin: { id: pluginId },
			normalizedConfig: normalizedPluginConfig
		}))) return {
			...evaluation,
			availability: false,
			unavailableReason: "missing-auth",
			unavailableUntil: void 0
		};
	}
	const authPolicy = resolveBundledCliBackendAuthPolicy(runtimeProvider);
	if (selectedProfileId && authPolicy?.strictSelectedProfile && !authPolicy.nativeAuthProfileIds?.includes(selectedProfileId)) return ref.pinnedProfileId ? evaluateProviderAuth(provider, {
		modelId: ref.modelId,
		requiredProfileId: selectedProfileId
	}) : evaluation;
	if (normalizeProviderId(runtimeProvider) === normalizeProviderId(provider)) return runtimeOwners?.length ? evaluation : void 0;
	const runtimeAuthMode = params.preparedRuntimeAuthModes?.[normalizeProviderIdForAuth(runtimeProvider)];
	return typeof runtimeAuthMode === "string" ? {
		availability: true,
		routeResolution: null,
		selectedAuthMode: runtimeAuthMode,
		evidence: "runtime"
	} : params.preparedSyntheticAuthComplete ? {
		availability: false,
		routeResolution: null,
		unavailableReason: "missing-auth"
	} : {
		availability: void 0,
		routeResolution: null
	};
}
function modeAllowed(provider, target, mode, authFlow) {
	const policy = resolveProviderModelAuthPolicy({
		provider,
		mode,
		authFlow,
		api: target.api ?? void 0,
		baseUrl: typeof target.baseUrl === "string" ? target.baseUrl : void 0
	});
	return policy.compatible && (!target.authRequirement || policy.authRequirement === target.authRequirement);
}
function normalizeModelIdForProvider(provider, modelId) {
	const trimmed = splitTrailingAuthProfile(modelId).model.trim();
	if (!trimmed) return;
	const slash = trimmed.indexOf("/");
	if (slash <= 0) return trimmed;
	return normalizeProviderIdForAuth(trimmed.slice(0, slash)) === provider ? trimmed.slice(slash + 1).trim() || void 0 : void 0;
}
/** Builds one snapshot-scoped read-only auth evaluator. */
function createModelAuthAvailabilityResolver(params) {
	const env = params.env ?? process.env;
	const now = Date.now();
	const isExternalCliProvider = (provider) => EXTERNAL_CLI_REFRESH_PROVIDER_IDS.has(normalizeProviderIdForAuth(provider));
	const externalCliProviderIds = (params.externalCliProviderIds ?? []).filter(isExternalCliProvider);
	const external = externalCliProviderIds.length ? resolveExternalCliAuthProfiles(params.authStore, {
		allowKeychainPrompt: false,
		providerIds: externalCliProviderIds
	}) : [];
	const store = external.length ? {
		...params.authStore,
		profiles: {
			...params.authStore.profiles,
			...Object.fromEntries(external.map((item) => [item.profileId, item.credential]))
		}
	} : params.authStore;
	const runtimeStore = params.preparedRuntimeAuthStore ?? (params.allowPreparedRuntimeAuth !== false ? getRuntimeAuthProfileStoreSnapshotCore(params.agentDir) : void 0);
	const hydratedProfileIds = /* @__PURE__ */ new Set();
	const sameSecretRef = (left, right) => left !== null && right !== null && left.source === right.source && left.provider === right.provider && left.id === right.id;
	const runtimeCredentialOverlay = (profileId, credential) => {
		const runtime = runtimeStore?.profiles[profileId];
		if (!runtime || credential.type !== runtime.type || credential.provider !== runtime.provider) return credential;
		if (credential.type === "oauth" && runtime.type === "oauth" && credential.oauthRef && !hasNonEmptyString(credential.access) && !hasNonEmptyString(credential.refresh) && hasUsableOAuthCredential(runtime, { now })) return runtime;
		if (credential.type === "api_key" && runtime.type === "api_key" && sameSecretRef(parseSecretRef(credential.keyRef ?? credential.key, params.cfg.secrets?.defaults), parseSecretRef(runtime.keyRef, params.cfg.secrets?.defaults)) && hasNonEmptyString(runtime.key)) {
			hydratedProfileIds.add(profileId);
			return {
				...credential,
				key: runtime.key
			};
		}
		if (credential.type === "token" && runtime.type === "token" && sameSecretRef(parseSecretRef(credential.tokenRef ?? credential.token, params.cfg.secrets?.defaults), parseSecretRef(runtime.tokenRef, params.cfg.secrets?.defaults)) && hasNonEmptyString(runtime.token)) {
			hydratedProfileIds.add(profileId);
			return {
				...credential,
				token: runtime.token
			};
		}
		return credential;
	};
	const orderProfiles = runtimeStore ? Object.fromEntries(Object.entries(store.profiles).map(([profileId, credential]) => [profileId, runtimeCredentialOverlay(profileId, credential)])) : store.profiles;
	const orderBaseStore = orderProfiles === store.profiles ? store : {
		...store,
		profiles: orderProfiles
	};
	const orderStore = orderBaseStore.usageStats ? {
		...orderBaseStore,
		usageStats: Object.fromEntries(Object.entries(orderBaseStore.usageStats).map(([id, stats]) => [id, { ...stats }]))
	} : orderBaseStore;
	const { aliasMap, envCandidateMap, authEvidenceMap } = resolveProviderAuthLookupMaps({
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env,
		metadataSnapshot: params.metadataSnapshot
	});
	const synthetic = new Set((params.syntheticAuthProviderRefs ?? []).map(normalizeProviderIdForAuth));
	if (resolveAgentModelPrimaryValue(params.cfg.agents?.defaults?.model)?.split("/", 1)[0] === "codex") synthetic.add("codex");
	const resolveRoutes = (params.routeResolverFactory ?? createOpenAIModelRoutesResolver)({
		config: params.cfg,
		agentId: params.agentId,
		primaryModel: resolveDefaultModelForAgent({
			cfg: params.cfg,
			agentId: params.agentId,
			allowManifestNormalization: false,
			allowPluginNormalization: false
		}),
		resolveProfileAuthMode: (profileId) => store.profiles[profileId]?.type,
		resolveProfileAuthFlow: (profileId) => {
			const credential = orderStore.profiles[profileId];
			return credential?.type === "oauth" ? credential.authFlow : void 0;
		},
		env
	});
	const envCache = /* @__PURE__ */ new Map();
	const orderCache = /* @__PURE__ */ new Map();
	const normalizeProvider = (provider) => {
		const normalized = normalizeProviderIdForAuth(provider);
		return aliasMap[normalized] ?? normalized;
	};
	const externalCliRefreshProfileIds = /* @__PURE__ */ new Set([...external.map((profile) => profile.profileId), ...getRuntimeExternalCliProfileIds(runtimeStore ?? store)]);
	const readOnlyAuthConfig = params.cfg;
	const providerInput = (provider) => resolveProviderConfigSecretInput(params.cfg, provider);
	const prepareAuthTarget = (provider, ref) => {
		const { providerConfig: configured } = providerInput(provider);
		const configuredModelId = ref.modelId ? normalizeModelIdForProvider(provider, ref.modelId) : void 0;
		const configuredModel = configuredModelId ? configured?.models?.find((model) => normalizeModelIdForProvider(provider, model.id) === configuredModelId) : void 0;
		return {
			...ref,
			api: ref.api ?? configuredModel?.api ?? configured?.api,
			baseUrl: ref.baseUrl ?? configuredModel?.baseUrl ?? configured?.baseUrl
		};
	};
	const providerBinding = (provider) => resolveProviderEntryApiKeyProfileReference({
		cfg: params.cfg,
		provider,
		store
	});
	const envAuth = (provider) => {
		const normalized = normalizeProvider(provider);
		if (!envCache.has(normalized)) envCache.set(normalized, resolveProviderEnvAuthEvidence(normalized, env, {
			aliasMap,
			candidateMap: envCandidateMap,
			authEvidenceMap,
			config: params.cfg,
			workspaceDir: params.workspaceDir
		}));
		return envCache.get(normalized);
	};
	const profileOrder = (provider, forModel, preferredProfileId, pinnedProfileId) => {
		const normalized = normalizeProvider(provider);
		const cacheKey = `${normalized}\u0000${forModel ?? ""}\u0000${preferredProfileId ?? ""}\u0000${pinnedProfileId ?? ""}`;
		const cached = orderCache.get(cacheKey);
		if (cached) return cached;
		const resolution = prependAuthProfilePin(resolveAuthProfileOrderWithMetadata({
			cfg: readOnlyAuthConfig,
			store: orderStore,
			provider: normalized,
			preferredProfile: preferredProfileId,
			forModel,
			readinessMode: "read-only"
		}), pinnedProfileId);
		orderCache.set(cacheKey, resolution);
		return resolution;
	};
	const profileMode = (profileId) => store.profiles[profileId]?.type ?? params.cfg.auth?.profiles?.[profileId]?.mode;
	const profilePolicyFactsCache = /* @__PURE__ */ new Map();
	const profilePolicyFacts = (provider, profileId) => {
		const cached = profilePolicyFactsCache.get(profileId);
		if (cached) return cached;
		const credential = orderStore.profiles[profileId];
		const authFlow = credential?.type === "oauth" ? credential.authFlow : void 0;
		const facts = authFlow ? {
			authFlow,
			authRequirement: resolveProviderModelAuthPolicy({
				provider,
				mode: profileMode(profileId),
				authFlow
			}).authRequirement
		} : {};
		profilePolicyFactsCache.set(profileId, facts);
		return facts;
	};
	const profileRequirement = (provider, profileId) => resolveProviderModelRouteAuthRequirement(profileMode(profileId), profilePolicyFacts(provider, profileId).authRequirement);
	const profileCredential = (profileId, credential = store.profiles[profileId]) => {
		return credential ? runtimeCredentialOverlay(profileId, credential) : void 0;
	};
	const profileEligibleForReadOnlyAvailability = (provider, profileId, credential) => {
		const effectiveStore = store.profiles[profileId] === credential ? store : {
			...store,
			profiles: {
				...store.profiles,
				[profileId]: credential
			}
		};
		const eligibility = resolveAuthProfileEligibility({
			cfg: readOnlyAuthConfig,
			store: effectiveStore,
			provider: normalizeProvider(provider),
			profileId,
			now
		});
		return eligibility.eligible || eligibility.reasonCode === "unresolved_ref";
	};
	const invalidProfilePin = (provider, ref) => {
		const profileId = ref.pinnedProfileId?.trim() || void 0;
		return profileId !== void 0 && !resolveAuthProfileEligibility({
			cfg: readOnlyAuthConfig,
			store: orderStore,
			provider: normalizeProvider(provider),
			profileId,
			now
		}).eligible;
	};
	const resolvedProfileAvailability = (provider, profileId, credential, target) => {
		if (!modeAllowed(provider, target, credential.type, credential.type === "oauth" ? credential.authFlow : void 0)) return false;
		if (hydratedProfileIds.has(profileId)) return credential.type !== "token" || credential.expires === void 0 || credential.expires > now;
		return resolveStoredCredentialReadOnlyAvailability({
			credential,
			cfg: params.cfg,
			env,
			now,
			canRefreshOAuth: provider === OPENAI_PROVIDER_ID || externalCliRefreshProfileIds.has(profileId)
		});
	};
	const profileInCooldown = (profileId, target) => {
		const cooldownModel = target.modelId ? splitTrailingAuthProfile(target.modelId).model : void 0;
		return isProfileInCooldown(store, profileId, now, cooldownModel);
	};
	const hasPermanentAuthFailure = (stats) => stats?.disabledReason === "auth_permanent" && isActiveUnusableWindow(stats.disabledUntil, now);
	const profileAvailability = (provider, profileId, target, allowCooldown = false) => {
		if (!allowCooldown && profileInCooldown(profileId, target)) return false;
		if (isConfiguredAwsSdkAuthProfileForProvider({
			cfg: params.cfg,
			provider,
			profileId
		})) return modeAllowed(provider, target, "aws-sdk");
		const credential = profileCredential(profileId);
		if (!credential || !profileEligibleForReadOnlyAvailability(provider, profileId, credential)) return false;
		return resolvedProfileAvailability(provider, profileId, credential, target);
	};
	const hasMatchingProfileEvidence = (provider, profileId) => {
		const reason = resolveAuthProfileEligibility({
			cfg: params.cfg,
			store,
			provider,
			profileId
		}).reasonCode;
		return reason !== "provider_mismatch" && reason !== "profile_missing";
	};
	const hasProfileEvidence = (provider) => {
		const normalized = normalizeProvider(provider);
		if (findNormalizedProviderValue(params.cfg.auth?.order, normalized) !== void 0) return true;
		if (Object.values(params.cfg.auth?.profiles ?? {}).some((profile) => normalizeProvider(profile.provider) === normalized)) return true;
		return Object.keys(store.profiles).some((profileId) => hasMatchingProfileEvidence(normalized, profileId));
	};
	const firstProfileEvidenceId = (provider) => {
		const normalized = normalizeProvider(provider);
		const configuredOrder = findNormalizedProviderValue(params.cfg.auth?.order, normalized);
		const storedOrder = findNormalizedProviderValue(store.order, normalized);
		return (configuredOrder ?? storedOrder ?? Object.keys(store.profiles)).find((profileId) => hasMatchingProfileEvidence(normalized, profileId));
	};
	const unprofiledEvaluation = (provider, target) => {
		const withMode = (selectedAuthMode, evidence, availability = modeAllowed(provider, target, selectedAuthMode)) => ({
			availability,
			selectedAuthMode,
			evidence
		});
		const { providerConfig: configured, ref: apiKeyRef } = providerInput(provider);
		const configuredAuth = target.pinnedProfileId ? void 0 : configured?.auth;
		if (configuredAuth === "aws-sdk") return withMode("aws-sdk", "aws-sdk");
		const apiKey = target.pinnedProfileId && !apiKeyRef ? void 0 : configured?.apiKey;
		const configuredBearerMode = configuredAuth === "api-key" || configuredAuth === "oauth" || configuredAuth === "token" ? configuredAuth : "api-key";
		if (!apiKeyRef && hasMalformedSecretInputSyntax(apiKey)) return {
			availability: false,
			evidence: "provider-config"
		};
		const binding = target.pinnedProfileId ? { kind: "none" } : providerBinding(provider);
		if (binding.kind === "profile") {
			const credential = profileCredential(binding.profileId, binding.credential);
			return {
				availability: credential && !profileInCooldown(binding.profileId, target) && profileEligibleForReadOnlyAvailability(binding.credential.provider, binding.profileId, credential) ? resolvedProfileAvailability(provider, binding.profileId, credential, target) : false,
				selectedProfileId: binding.profileId,
				selectedAuthMode: credential?.type ?? binding.credential.type,
				evidence: "profile"
			};
		}
		if (binding.kind === "profile-incompatible") return {
			availability: false,
			evidence: "profile"
		};
		const { stats: inlineUsageStats, unusableUntil: inlineKeyUnusableUntil } = readInlineProviderApiKeyUsage(store, provider);
		if (inlineKeyUnusableUntil != null && inlineKeyUnusableUntil > now) return {
			availability: false,
			evidence: "provider-config",
			...hasPermanentAuthFailure(inlineUsageStats) ? { unavailableReason: "auth-failed" } : {
				unavailableReason: "cooldown",
				unavailableUntil: inlineKeyUnusableUntil
			}
		};
		if (binding.kind === "literal") return withMode(configuredBearerMode, "provider-config");
		if (binding.kind === "marker") {
			if (binding.evidence === "environment" && typeof apiKey === "string") return {
				availability: modeAllowed(provider, target, configuredBearerMode) ? hasNonEmptyString(env[apiKey.trim()]) : false,
				selectedAuthMode: configuredBearerMode,
				evidence: "environment"
			};
			if (!modeAllowed(provider, target, configuredBearerMode)) return withMode(configuredBearerMode, binding.evidence, false);
			if (hasUsableCustomProviderApiKey(params.cfg, provider, env)) return withMode(configuredBearerMode, binding.evidence, true);
			const managed = typeof apiKey === "string" && isSecretRefHeaderValueMarker(apiKey);
			return {
				availability: managed ? Boolean(resolveManagedSecretRefRuntimeProviderAuth({
					provider,
					cfg: params.cfg
				})) || void 0 : void 0,
				selectedAuthMode: configuredBearerMode,
				evidence: managed ? "runtime" : binding.evidence
			};
		}
		if (apiKeyRef) {
			if (!isValidSecretRef(apiKeyRef) || !modeAllowed(provider, target, configuredBearerMode)) return {
				availability: false,
				selectedAuthMode: configuredBearerMode,
				evidence: "provider-config"
			};
			const available = resolveSecretRefReadOnlyAvailability(apiKeyRef, params.cfg, env);
			const runtimeAvailable = Boolean(resolveManagedSecretRefRuntimeProviderAuth({
				provider,
				cfg: params.cfg
			}));
			return {
				availability: runtimeAvailable ? true : available,
				selectedAuthMode: configuredBearerMode,
				evidence: runtimeAvailable ? "runtime" : "provider-config"
			};
		}
		if (apiKey !== void 0 && !(typeof apiKey === "string" && apiKey.trim() === "")) return {
			availability: false,
			evidence: "provider-config"
		};
		if (provider === "amazon-bedrock" && (target.api === void 0 || target.api === "bedrock-converse-stream") && configured?.auth === void 0 && apiKey === void 0) return withMode("aws-sdk", "aws-sdk");
		const preparedRuntimeAuthMode = params.preparedRuntimeAuthModes?.[normalizeProviderIdForAuth(provider)] ?? params.preparedRuntimeAuthModes?.[normalizeProvider(provider)];
		if (typeof preparedRuntimeAuthMode === "string") return withMode(preparedRuntimeAuthMode, "runtime");
		const environment = envAuth(provider);
		if (environment) {
			if (provider === "amazon-bedrock" && environment.mode === "aws-sdk") return withMode("aws-sdk", "aws-sdk");
			return withMode(configured?.auth ?? environment.mode, "environment");
		}
		const hasCompatibleCodexSyntheticAuth = provider === OPENAI_PROVIDER_ID && synthetic.has("codex") && (target.authRequirement === "subscription" || target.api === OPENAI_CODEX_RESPONSES_API);
		const hasDeclaredSyntheticAuth = synthetic.has(normalizeProviderIdForAuth(provider)) || synthetic.has(normalizeProvider(provider));
		if (hasSyntheticLocalProviderAuthConfig({
			cfg: params.cfg,
			provider,
			route: hasDeclaredSyntheticAuth ? target : void 0
		})) return {
			availability: true,
			evidence: "synthetic"
		};
		if (hasDeclaredSyntheticAuth || hasCompatibleCodexSyntheticAuth) return params.preparedSyntheticAuthComplete ? {
			availability: false,
			evidence: "synthetic",
			unavailableReason: "missing-auth"
		} : {
			availability: void 0,
			evidence: "synthetic"
		};
		const hasAuthEvidence = configured?.auth !== void 0 || apiKey !== void 0 && !(typeof apiKey === "string" && apiKey.trim() === "") || hasProfileEvidence(provider);
		return {
			availability: hasAuthEvidence ? false : void 0,
			unavailableReason: hasAuthEvidence ? "auth-failed" : "missing-auth",
			selectedAuthMode: configured?.auth
		};
	};
	const profileSource = (provider, profileId, target, ignoreCooldown = true, cooldown) => ({
		kind: "profile",
		profileId,
		mode: profileMode(profileId),
		...profilePolicyFacts(provider, profileId),
		readiness: toProviderModelAuthReadiness(profileAvailability(provider, profileId, target, ignoreCooldown)),
		cooldown: cooldown ?? (profileInCooldown(profileId, target) ? "active" : "clear")
	});
	const cooldownEvaluation = (profiles, target) => {
		const model = target.modelId ? splitTrailingAuthProfile(target.modelId).model : void 0;
		const retryTimes = profiles.flatMap((profile) => {
			if (profile.readiness === "unavailable" || profile.cooldown !== "active") return [];
			const stats = store.usageStats?.[profile.profileId];
			const until = stats && !hasPermanentAuthFailure(stats) ? resolveProfileUnusableUntil(stats, model) : null;
			return until !== null && until > now ? [until] : [];
		});
		return {
			availability: false,
			unavailableReason: retryTimes.length ? "cooldown" : "auth-failed",
			...retryTimes.length ? { unavailableUntil: Math.min(...retryTimes) } : {}
		};
	};
	const rejectedSourceEvaluation = (reason, plan, target) => reason === "all-cooldown" && plan.kind === "automatic" ? cooldownEvaluation(plan.orderedProfiles.filter((profile) => !target.authRequirement || resolveProviderModelRouteAuthRequirement(profile.mode, profile.authRequirement) === target.authRequirement), target) : {
		availability: false,
		unavailableReason: "auth-failed"
	};
	const sourceEvaluation = (selection, provider, target, directEvaluation) => {
		if (selection.kind === "none") return directEvaluation;
		const source = selection.source;
		if (source.kind === "profile") {
			const availability = selection.kind === "unavailable" ? false : fromProviderModelAuthReadiness(source.readiness);
			const profile = availability === false ? profileSource(provider, source.profileId, target) : void 0;
			return {
				...availability === false ? profile && profile.readiness !== "unavailable" && profile.cooldown === "active" ? cooldownEvaluation([profile], target) : {
					availability,
					unavailableReason: "auth-failed"
				} : { availability },
				selectedProfileId: source.profileId,
				selectedAuthMode: source.mode,
				evidence: "profile"
			};
		}
		const { unavailableReason, ...evaluation } = directEvaluation;
		return {
			...evaluation,
			...source.readiness === "unavailable" ? { unavailableReason: unavailableReason ?? "auth-failed" } : {},
			selectedAuthMode: source.mode
		};
	};
	const directPolicy = (provider, target) => {
		const { providerConfig: configured, ref: apiKeyRef } = providerInput(provider);
		const pinned = Boolean(target.pinnedProfileId);
		const configuredAuth = pinned ? void 0 : configured?.auth;
		const binding = pinned ? { kind: "none" } : providerBinding(provider);
		const markerUsable = binding.kind === "marker" && hasUsableCustomProviderApiKey(params.cfg, provider, env);
		const hasDirectMaterial = binding.kind === "literal" || markerUsable || apiKeyRef !== null;
		const required = configuredAuth === "aws-sdk" || markerUsable || apiKeyRef !== null || hasDirectMaterial && shouldPreferExplicitConfigApiKeyAuth(params.cfg, provider);
		const environment = envAuth(provider);
		const environmentMode = environment ? configuredAuth ?? environment.mode : void 0;
		const evaluation = !required && environmentMode ? {
			selectedAuthMode: environmentMode,
			availability: modeAllowed(provider, target, environmentMode),
			evidence: environmentMode === "aws-sdk" ? "aws-sdk" : "environment"
		} : unprofiledEvaluation(provider, target);
		const direct = buildProviderModelAuthDirectSource({
			mode: evaluation.selectedAuthMode,
			availability: evaluation.availability,
			evidence: evaluation.evidence ?? "none",
			authorization: evaluation.evidence === "environment" && !hasDirectMaterial ? "ambient" : "declared"
		});
		return {
			binding,
			direct,
			evaluation,
			hasDirectMaterial,
			hasDirectFallback: hasDirectMaterial || !pinned && direct.evidence !== "none",
			markerUsable,
			required
		};
	};
	const sourcePlanForTarget = (provider, ref, policy, order, targetForProfile, options = {}) => {
		const { profileLock, boundProfileId } = options;
		const ownedProfileId = profileLock || boundProfileId;
		const ownership = ownedProfileId ? {
			reason: profileLock ? "runtime-binding" : "provider-binding",
			source: profileSource(provider, ownedProfileId, targetForProfile(ownedProfileId), Boolean(profileLock), "clear")
		} : policy.required ? {
			reason: "configured-auth",
			source: policy.direct
		} : void 0;
		return buildProviderModelAuthSourcePlan({
			...ownership ? { ownership } : {},
			profiles: (options.profileIds ?? order.profileIds).map((profileId) => profileSource(provider, profileId, targetForProfile(profileId))),
			preferredProfileId: ref.pinnedProfileId ?? ref.preferredProfileId,
			explicitOrder: order.hasExplicitOrder,
			preserveProfilePriority: options.preserveProfilePriority,
			...policy.hasDirectFallback ? { fallback: policy.direct } : {}
		});
	};
	const automaticSourceRejection = (provider, ref, target) => {
		if (ref.requiredProfileId?.trim()) return;
		const policy = directPolicy(provider, target);
		if (policy.required || policy.binding.kind === "profile" || policy.binding.kind === "profile-incompatible") return;
		const orderResolution = profileOrder(provider, ref.modelId, ref.preferredProfileId, ref.pinnedProfileId);
		const plan = sourcePlanForTarget(provider, ref, policy, orderResolution, () => target);
		const decision = selectProviderModelAuthSources({
			provider,
			plan
		});
		return decision.kind === "rejected" ? {
			...rejectedSourceEvaluation(decision.reason, plan, target),
			evidence: "profile",
			...decision.source ? {
				selectedAuthMode: decision.source.mode,
				selectedProfileId: decision.source.profileId
			} : {}
		} : void 0;
	};
	const resolveProviderEvaluation = (rawProvider, ref = {}, preparedTarget) => {
		const provider = normalizeProviderIdForAuth(rawProvider);
		const target = preparedTarget ?? prepareAuthTarget(provider, ref);
		const profileLock = ref.requiredProfileId?.trim();
		if (invalidProfilePin(provider, ref)) return {
			availability: false,
			unavailableReason: "auth-failed",
			evidence: "profile"
		};
		const policy = directPolicy(provider, target);
		if (!profileLock && policy.binding.kind === "profile-incompatible") return {
			availability: false,
			unavailableReason: "auth-failed",
			evidence: "profile"
		};
		const orderResolution = profileOrder(provider, ref.modelId, ref.preferredProfileId, ref.pinnedProfileId);
		const boundProfileId = !profileLock && policy.binding.kind === "profile" ? policy.binding.profileId : void 0;
		const sourcePlan = sourcePlanForTarget(provider, ref, policy, orderResolution, () => target, {
			profileLock,
			boundProfileId
		});
		const decision = selectProviderModelAuthSources({
			provider,
			plan: sourcePlan
		});
		if (decision.kind === "rejected") return {
			...rejectedSourceEvaluation(decision.reason, sourcePlan, target),
			...decision.source ? {
				selectedProfileId: decision.source.profileId,
				selectedAuthMode: decision.source.mode
			} : {},
			evidence: "profile"
		};
		return sourceEvaluation(decision.selection, provider, target, policy.evaluation);
	};
	const resolveProviderAuthAvailability = (provider, ref = {}) => resolveProviderEvaluation(provider, ref).availability;
	const evaluateModelAuthSources = (rawProvider, ref = {}) => {
		const provider = normalizeProviderIdForAuth(rawProvider);
		if (provider !== OPENAI_PROVIDER_ID) return {
			...resolveProviderEvaluation(provider, ref),
			routeResolution: null
		};
		if (invalidProfilePin(provider, ref)) return {
			availability: false,
			unavailableReason: "auth-failed",
			routeResolution: null
		};
		const modelLock = ref.requiredProfileId?.trim();
		const configuredAuthMode = ref.pinnedProfileId ? void 0 : resolveConfiguredOpenAIAuthMode(params.cfg);
		const awsSdkTerminal = !modelLock && configuredAuthMode === "aws-sdk";
		const baseTarget = prepareAuthTarget(provider, ref);
		const basePolicy = directPolicy(provider, baseTarget);
		const bindingProfileId = !modelLock && !awsSdkTerminal && basePolicy.binding.kind === "profile" ? basePolicy.binding.profileId : void 0;
		const routeProfileId = modelLock || ref.pinnedProfileId || bindingProfileId;
		const routeResolution = resolveRoutes({
			...ref,
			pinnedAuthRequirement: routeProfileId ? profileRequirement(provider, routeProfileId) : resolveProviderModelRouteAuthRequirement(configuredAuthMode)
		});
		if (!routeResolution) return {
			availability: void 0,
			routeResolution: null
		};
		if (routeResolution.kind === "incompatible") return {
			availability: false,
			routeResolution
		};
		if (routeResolution.kind === "indeterminate") return {
			...automaticSourceRejection(provider, ref, prepareAuthTarget(provider, ref)) ?? { availability: void 0 },
			routeResolution
		};
		if (!modelLock && !awsSdkTerminal && basePolicy.binding.kind === "profile-incompatible") return {
			availability: false,
			unavailableReason: "auth-failed",
			routeResolution
		};
		const orderResolution = profileOrder(provider, ref.modelId, ref.preferredProfileId, ref.pinnedProfileId);
		const materializedModelId = normalizeModelIdForProvider(provider, ref.modelId ?? "");
		const materializationMatchesRoute = (fact, route) => route.runtimePolicy?.compatibleIds.some((runtimeId) => runtimeId.trim().toLowerCase() === fact.runtimeOwnerId) === true && route.api.toLowerCase() === fact.modelApi && route.requestTransportOverrides === fact.requestTransportOverrides && modelMatchesProviderModelRoute({
			provider,
			api: fact.modelApi,
			baseUrl: fact.modelBaseUrl,
			route
		});
		const materialized = !modelLock && !ref.pinnedProfileId && !bindingProfileId && !basePolicy.required && materializedModelId ? params.preparedRuntimeAuthMaterializations?.find((fact) => (!orderResolution.hasExplicitOrder || fact.authProfileId !== void 0 && orderResolution.profileIds.includes(fact.authProfileId)) && normalizeProvider(fact.provider) === provider && fact.modelId === materializedModelId && routeResolution.routes.some((route) => {
			const configuredRequirement = resolveProviderModelRouteAuthRequirement(configuredAuthMode);
			return (!configuredRequirement || configuredRequirement === route.authRequirement) && materializationMatchesRoute(fact, route) && modeAllowed(provider, {
				...ref,
				api: route.api,
				baseUrl: route.baseUrl,
				authRequirement: route.authRequirement
			}, fact.authMode, fact.authProfileId ? profilePolicyFacts(provider, fact.authProfileId).authFlow : void 0);
		})) : void 0;
		const selectedConfiguredMode = awsSdkTerminal ? "aws-sdk" : bindingProfileId ? void 0 : configuredAuthMode ?? (basePolicy.hasDirectMaterial ? "api-key" : void 0);
		const automaticRouteAuthMode = basePolicy.hasDirectFallback && !basePolicy.required && !configuredAuthMode ? void 0 : selectedConfiguredMode;
		const targetForMode = (mode, authRequirement) => {
			const requirement = resolveProviderModelRouteAuthRequirement(mode, authRequirement);
			const route = requirement ? routeResolution.routes.find((candidate) => candidate.authRequirement === requirement) : void 0;
			return route ? {
				...ref,
				api: route.api,
				baseUrl: route.baseUrl,
				authRequirement: route.authRequirement
			} : baseTarget;
		};
		const policy = directPolicy(provider, targetForMode(selectedConfiguredMode ?? basePolicy.direct.mode));
		let profileIds = orderResolution.profileIds;
		if (profileIds.length === 0 && !modelLock && !bindingProfileId && !policy.required) {
			const evidenceProfileId = firstProfileEvidenceId(provider);
			if (evidenceProfileId) profileIds = [evidenceProfileId];
		}
		const sourcePlan = sourcePlanForTarget(provider, ref, policy, orderResolution, (profileId) => targetForMode(profileMode(profileId), profilePolicyFacts(provider, profileId).authRequirement), {
			profileLock: modelLock,
			boundProfileId: bindingProfileId,
			profileIds,
			preserveProfilePriority: Boolean(ref.pinnedProfileId)
		});
		const syntheticCodexOwnsAuth = !modelLock && !ref.preferredProfileId && !ref.pinnedProfileId && !selectedConfiguredMode && (policy.binding.kind === "none" || policy.binding.kind === "marker" && !policy.markerUsable) && sourcePlan.kind === "automatic" && !sourcePlan.profiles.explicitOrder && (sourcePlan.profiles.kind === "empty" || sourcePlan.profiles.kind === "all-unavailable") && synthetic.has("codex") && routeResolution.routes.every((route) => route.runtimePolicy?.compatibleIds?.some((runtimeId) => runtimeId.trim().toLowerCase() === "codex"));
		const routeAuthDecision = selectOpenAIModelRouteAuth({
			resolution: routeResolution,
			sourcePlan,
			configuredAuthMode: automaticRouteAuthMode,
			...syntheticCodexOwnsAuth ? { runtimeAuthOwner: { id: "codex" } } : {},
			...syntheticCodexOwnsAuth && resolveMergedModelProviderConfig(params.cfg, provider) === void 0 ? { allowNativeAuthOnSingleRoute: true } : {}
		});
		const preferredSelection = routeAuthDecision.kind === "selected" && routeAuthDecision.selection.kind === "selected" && routeAuthDecision.selection.route.authRequirement === routeResolution.preferredAuthRequirement && routeAuthDecision.selection.route.authRequirement !== resolveProviderModelRouteAuthRequirement(materialized?.authMode, materialized?.authProfileId ? profilePolicyFacts(provider, materialized.authProfileId).authRequirement : void 0);
		if (materialized && !preferredSelection) {
			const selectedRoute = routeResolution.routes.find((route) => materializationMatchesRoute(materialized, route));
			if (selectedRoute) return {
				availability: true,
				routeResolution,
				selectedRoute,
				selectedAuthMode: materialized.authMode,
				...materialized.authProfileId ? { selectedProfileId: materialized.authProfileId } : {},
				evidence: "runtime"
			};
		}
		if (routeAuthDecision.kind === "deferred" && syntheticCodexOwnsAuth && ref.runtimeId === "codex" && !hasAuthoredProviderRequestParams({
			config: params.cfg,
			provider,
			modelId: ref.modelId ?? "",
			agentId: params.agentId
		})) {
			const native = params.preparedRuntimeAuthModes?.codex;
			const mode = typeof native === "object" && native.source === "native" ? native.mode : void 0;
			const requirement = resolveProviderModelRouteAuthRequirement(mode);
			const selectedRoute = requirement ? routeResolution.routes.find((route) => route.authRequirement === requirement) : void 0;
			return {
				availability: mode ? Boolean(selectedRoute) : params.preparedSyntheticAuthComplete ? false : void 0,
				availabilityAuthoritative: true,
				routeResolution,
				...selectedRoute ? {
					selectedRoute,
					selectedAuthMode: mode
				} : { unavailableReason: "missing-auth" },
				evidence: "runtime",
				runtimeAuth: {
					id: "codex",
					source: "native"
				}
			};
		}
		if (routeAuthDecision.kind === "deferred" && syntheticCodexOwnsAuth) return {
			availability: ref.runtimeId === "openclaw" || params.preparedSyntheticAuthComplete ? false : void 0,
			routeResolution,
			evidence: "synthetic"
		};
		if (routeAuthDecision.kind !== "selected") {
			const rejectedSource = routeAuthDecision.kind === "rejected" ? routeAuthDecision.source : void 0;
			const projectRejectedSource = routeAuthDecision.kind === "rejected" && rejectedSource && (routeAuthDecision.reason === "all-cooldown" || rejectedSource.readiness === "unavailable") ? rejectedSource : void 0;
			const rejectedRequirement = resolveProviderModelRouteAuthRequirement(rejectedSource?.mode, rejectedSource?.authRequirement);
			const rejectedRoute = routeAuthDecision.kind === "rejected" ? routeAuthDecision.route : void 0;
			const rejectedSourceRoute = rejectedRequirement ? routeResolution.routes.find((candidate) => candidate.authRequirement === rejectedRequirement) : void 0;
			const selectedRoute = rejectedRoute ?? rejectedSourceRoute ?? (routeResolution.routes.length === 1 ? routeResolution.routes[0] : void 0);
			return {
				...routeAuthDecision.kind === "rejected" ? rejectedSourceEvaluation(routeAuthDecision.reason, sourcePlan, {
					...ref,
					authRequirement: rejectedRoute?.authRequirement ?? (routeResolution.routes.length === 1 ? selectedRoute?.authRequirement : void 0)
				}) : { availability: false },
				...sourcePlan.kind === "automatic" && sourcePlan.profiles.kind === "empty" && !sourcePlan.profiles.explicitOrder && !policy.hasDirectFallback ? { unavailableReason: policy.evaluation.unavailableReason } : {},
				routeResolution,
				...routeAuthDecision.kind === "rejected" && routeAuthDecision.authModeIncompatible ? { availabilityAuthoritative: true } : {},
				...projectRejectedSource ? {
					selectedProfileId: projectRejectedSource.profileId,
					selectedAuthMode: projectRejectedSource.mode,
					evidence: "profile"
				} : {},
				...selectedRoute ? { selectedRoute } : {}
			};
		}
		const selectedRoute = routeAuthDecision.selection.route;
		const evaluation = sourceEvaluation(routeAuthDecision.selection, provider, {
			...ref,
			...selectedRoute
		}, policy.evaluation);
		const syntheticSubscriptionRoute = routeResolution.routes.find((route) => route.authRequirement === "subscription");
		if (syntheticCodexOwnsAuth && evaluation.availability !== true && synthetic.has("codex") && syntheticSubscriptionRoute) return {
			availability: void 0,
			routeResolution,
			evidence: "synthetic"
		};
		return {
			...evaluation,
			availability: evaluation.availability ?? (evaluation.evidence ? void 0 : false),
			routeResolution,
			selectedRoute
		};
	};
	const withSelectedCredential = (provider, evaluation) => ({
		...evaluation,
		selectedCredential: resolveSelectedModelCredential({
			provider,
			profileId: evaluation.selectedProfileId,
			mode: evaluation.selectedAuthMode,
			authRequirement: evaluation.selectedProfileId ? profilePolicyFacts(provider, evaluation.selectedProfileId).authRequirement : void 0,
			runtimeAuth: evaluation.runtimeAuth
		})
	});
	const evaluateModelAuth = (provider, ref) => withSelectedCredential(provider, evaluateModelAuthSources(provider, ref));
	const providerDiscoveryProviderIds = /* @__PURE__ */ new Set();
	const addProviderDiscoveryProviderId = (provider) => {
		if (!provider) return;
		const normalized = normalizeProvider(provider);
		if (normalized) providerDiscoveryProviderIds.add(normalized);
	};
	for (const credential of Object.values(store.profiles)) addProviderDiscoveryProviderId(credential.provider);
	for (const profile of Object.values(params.cfg.auth?.profiles ?? {})) addProviderDiscoveryProviderId(profile.provider);
	for (const provider of listProviderEnvAuthLookupKeys({
		envCandidateMap,
		authEvidenceMap
	})) if (envAuth(provider)) addProviderDiscoveryProviderId(provider);
	for (const plugin of params.metadataSnapshot?.index?.plugins ?? []) {
		if (!plugin.enabled || !(plugin.syntheticAuthRefs ?? []).some((ref) => synthetic.has(normalizeProviderIdForAuth(ref)))) continue;
		for (const provider of [...plugin.contributions?.providers ?? [], ...plugin.contributions?.modelCatalogProviders ?? []]) addProviderDiscoveryProviderId(provider);
	}
	if (synthetic.has("codex")) addProviderDiscoveryProviderId(OPENAI_PROVIDER_ID);
	return {
		providerDiscoveryProviderIds: [...providerDiscoveryProviderIds].toSorted((left, right) => left.localeCompare(right)),
		evaluateModelAuth,
		evaluateRuntimeModelAuth: (provider, ref = {}) => {
			const runtimeId = ref.runtimeId ?? resolveAgentHarnessPolicy({
				config: params.cfg,
				agentId: params.agentId,
				provider,
				modelId: ref.modelId,
				modelApi: ref.api,
				modelBaseUrl: ref.baseUrl,
				env: params.env
			}).runtime;
			const evaluation = evaluateModelAuth(provider, {
				...ref,
				runtimeId
			});
			if (ref.requiredProfileId?.trim()) return evaluation;
			const runtimeEvaluation = evaluateCliRuntimeModelAuthAvailability(params, provider, {
				...ref,
				runtimeId
			}, evaluation, evaluateModelAuth);
			return runtimeEvaluation ? withSelectedCredential(provider, {
				...runtimeEvaluation,
				availabilityAuthoritative: true
			}) : evaluation;
		},
		resolveProviderAuthAvailability
	};
}
//#endregion
export { createModelAuthAvailabilityResolver as t };
