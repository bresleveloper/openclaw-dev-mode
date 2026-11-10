import { o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-1VuiLaaR.mjs";
import { p as isValidSecretRef } from "./ref-contract-Bfd9_-Lp.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { i as normalizeProviderIdForAuth, n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { D as isProfileInCooldown, M as resolveProfileUnusableUntil, O as readAuthProfileUsageStats, S as isActiveUnusableWindow, k as readInlineProviderApiKeyUsage } from "./user-model-account-authority-DFFjC5J5.mjs";
import { r as hasUsableOAuthCredential } from "./credential-state-NmgqOc1o.mjs";
import { d as getRuntimeAuthProfileStoreSnapshotCore } from "./runtime-snapshots-HRosak4u.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-CeM8o97s.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { s as resolveProviderAuthLookupMaps } from "./provider-env-vars-D43Pu6eG.mjs";
import { i as passesManifestOwnerBasePolicy } from "./manifest-owner-policy-Dq1F0Dcx.mjs";
import { a as selectProviderModelAuthSources, c as buildProviderModelAuthSourcePlan, f as toProviderModelAuthReadiness, r as resolveProviderModelRouteAuthRequirement, s as buildProviderModelAuthDirectSource, u as fromProviderModelAuthReadiness } from "./provider-model-route-auth-C7odu5x8.mjs";
import { o as resolveProviderModelAuthPolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { i as modelMatchesProviderModelRoute } from "./provider-model-route-D2MOzv0r.mjs";
import { i as resolveConfiguredOpenAIAuthMode, n as createOpenAIModelRoutesResolver, s as selectOpenAIModelRouteAuth } from "./openai-model-routes-BJEokkWC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { t as hasAuthoredProviderRequestParams } from "./model-extra-params-HwiZgNCH.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { i as resolveAuthProfileEligibility, o as resolveAuthProfileOrderWithMetadata, r as prependAuthProfilePin, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-CElLtwMu.mjs";
import { c as resolveCliRuntimeModelBackendBinding, s as resolveCliRuntimeCanonicalProvider } from "./cli-backends-BzVT3JSM.mjs";
import { c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { t as resolveSelectedModelCredential } from "./model-auth-selected-credential-DtR_jW21.mjs";
import { f as listProviderEnvAuthLookupKeys, l as isSecretRefHeaderValueMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { a as resolveExternalCliAuthProfiles, r as listExternalCliSyncProviderIds } from "./external-cli-sync-Bmw7gpgm.mjs";
import { _ as resolveStoredCredentialReadOnlyAvailability, g as resolveSecretRefReadOnlyAvailability, m as hasMalformedSecretInputSyntax, p as resolveManagedSecretRefRuntimeProviderAuth } from "./loader-runtime-load-DzFljQbT.mjs";
import { r as resolveProviderEnvAuthEvidence } from "./model-auth-env-CPdn6zH8.mjs";
import { S as shouldPreferExplicitConfigApiKeyAuth, a as hasUsableCustomProviderApiKey, g as resolveProviderConfigSecretInput, i as hasSyntheticLocalProviderAuthConfig, v as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { n as collectPreparedModelRuntimeConfiguredRefs, r as collectPreparedModelRuntimeProviderIds } from "./prepared-model-runtime.configured-B8Q2qHyF.mjs";
import { t as resolveBundledCliBackendAuthPolicy } from "./cli-backend-auth-policy-BJQR9lNK.mjs";
import { r as selectCliExecutionAuthProfile } from "./cli-execution-auth-Db8iWS1_.mjs";
//#region src/agents/model-auth-availability.cli-runtime.ts
/** CLI-runtime availability follows execution's forwarded account or native login. */
/** Builds one resolver's CLI-runtime evaluator; undefined leaves provider auth in charge. */
function createCliRuntimeModelAuthEvaluator(params, evaluateProviderAuth) {
	let configuredRuntimes;
	return (provider, ref, evaluation) => {
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
		if (!selectedProfileId && authPolicy?.strictSelectedProfile) {
			const profile = selectCliExecutionAuthProfile({
				cliExecutionProvider: runtimeProvider,
				authProfileProvider: provider,
				config: params.cfg,
				store: params.authStore,
				readinessMode: "read-only",
				metadataSnapshot: params.metadataSnapshot
			});
			if (profile) return evaluateProviderAuth(profile.provider, {
				modelId: ref.modelId,
				requiredProfileId: profile.profileId
			});
		}
		const runtimeAuth = {
			id: runtimeProvider,
			source: "native"
		};
		if (normalizeProviderId(runtimeProvider) === normalizeProviderId(provider)) return runtimeOwners?.length ? {
			...evaluation,
			runtimeAuth
		} : void 0;
		const runtimeAuthMode = params.preparedRuntimeAuthModes?.[normalizeProviderIdForAuth(runtimeProvider)];
		const selectedAuthMode = typeof runtimeAuthMode === "object" ? runtimeAuthMode.mode : runtimeAuthMode;
		if (selectedAuthMode) return {
			availability: true,
			routeResolution: null,
			selectedAuthMode,
			evidence: "runtime",
			runtimeAuth
		};
		configuredRuntimes ??= new Set(collectPreparedModelRuntimeProviderIds(params.cfg, {}, false, collectPreparedModelRuntimeConfiguredRefs(params.cfg, params.agentId), params.agentId));
		return params.preparedSyntheticAuthComplete || configuredRuntimes.has(normalizeProviderId(runtimeProvider)) ? {
			availability: false,
			routeResolution: null,
			unavailableReason: "missing-auth",
			runtimeAuth
		} : {
			availability: void 0,
			routeResolution: null,
			runtimeAuth
		};
	};
}
//#endregion
//#region src/agents/model-auth-availability.runtime-overlay.ts
/** Runtime-snapshot credential overlay for read-only auth availability. */
/** Overlays prepared runtime secrets onto persisted profiles with the same secret ref. */
function createRuntimeCredentialOverlay(params) {
	const hydratedProfileIds = /* @__PURE__ */ new Set();
	const overlay = (profileId, credential) => {
		const runtime = params.runtimeStore?.profiles[profileId];
		if (!runtime || credential.type !== runtime.type || credential.provider !== runtime.provider) return credential;
		if (credential.type === "oauth" && runtime.type === "oauth" && credential.oauthRef && !hasNonEmptyString(credential.access) && !hasNonEmptyString(credential.refresh) && hasUsableOAuthCredential(runtime, { now: params.now })) return runtime;
		if (credential.type === "oauth" || runtime.type === "oauth") return credential;
		const configuredRef = parseSecretRef(credential.type === "api_key" ? credential.keyRef ?? credential.key : credential.tokenRef ?? credential.token, params.cfg.secrets?.defaults);
		const runtimeRef = parseSecretRef(runtime.type === "api_key" ? runtime.keyRef : runtime.tokenRef, params.cfg.secrets?.defaults);
		const value = runtime.type === "api_key" ? runtime.key : runtime.token;
		if (configuredRef === null || runtimeRef === null || configuredRef.source !== runtimeRef.source || configuredRef.provider !== runtimeRef.provider || configuredRef.id !== runtimeRef.id || !hasNonEmptyString(value)) return credential;
		hydratedProfileIds.add(profileId);
		return credential.type === "api_key" ? {
			...credential,
			key: value
		} : {
			...credential,
			token: value
		};
	};
	return {
		overlay,
		hydratedProfileIds
	};
}
//#endregion
//#region src/agents/model-auth-availability.target.ts
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
	const trimmed = splitTrailingAuthProfile(modelId).model;
	if (!trimmed) return;
	const slash = trimmed.indexOf("/");
	if (slash <= 0) return trimmed;
	return normalizeProviderIdForAuth(trimmed.slice(0, slash)) === provider ? trimmed.slice(slash + 1).trim() || void 0 : void 0;
}
//#endregion
//#region src/agents/model-auth-availability.ts
/** Read-only provider/model auth availability with provider-route selection. */
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_RESPONSES_API = "openai-chatgpt-responses";
const EXTERNAL_CLI_REFRESH_PROVIDER_IDS = new Set(listExternalCliSyncProviderIds().map(normalizeProviderIdForAuth));
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
	const runtimeStore = params.preparedRuntimeAuthStore ?? getRuntimeAuthProfileStoreSnapshotCore(params.agentDir);
	const { overlay: runtimeCredentialOverlay, hydratedProfileIds } = createRuntimeCredentialOverlay({
		cfg: params.cfg,
		runtimeStore,
		now
	});
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
	const externalCliRefreshProfileIds = new Set(external.map((profile) => profile.profileId));
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
	const profileOrder = (provider, ref) => {
		const { modelId: forModel, preferredProfileId, pinnedProfileId } = ref;
		const normalized = normalizeProvider(provider);
		const cacheKey = `${normalized}\u0000${forModel ?? ""}\u0000${preferredProfileId ?? ""}\u0000${pinnedProfileId ?? ""}`;
		const cached = orderCache.get(cacheKey);
		if (cached) return cached;
		const resolution = prependAuthProfilePin(resolveAuthProfileOrderWithMetadata({
			cfg: params.cfg,
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
	const profileEligibleForReadOnlyAvailability = (provider, profileId, credential) => {
		const effectiveStore = store.profiles[profileId] === credential ? store : {
			...store,
			profiles: {
				...store.profiles,
				[profileId]: credential
			}
		};
		const eligibility = resolveAuthProfileEligibility({
			cfg: params.cfg,
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
			cfg: params.cfg,
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
		const storedCredential = store.profiles[profileId];
		if (!storedCredential) return false;
		const credential = runtimeCredentialOverlay(profileId, storedCredential);
		if (!profileEligibleForReadOnlyAvailability(provider, profileId, credential)) return false;
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
		return findNormalizedProviderValue(params.cfg.auth?.order, normalized) !== void 0 || Object.values(params.cfg.auth?.profiles ?? {}).some((profile) => normalizeProvider(profile.provider) === normalized) || Object.keys(store.profiles).some((profileId) => hasMatchingProfileEvidence(normalized, profileId));
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
			const credential = runtimeCredentialOverlay(binding.profileId, binding.credential);
			return {
				availability: !profileInCooldown(binding.profileId, target) && profileEligibleForReadOnlyAvailability(binding.credential.provider, binding.profileId, credential) ? resolvedProfileAvailability(provider, binding.profileId, credential, target) : false,
				selectedProfileId: binding.profileId,
				selectedAuthMode: credential.type,
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
			if (binding.evidence === "environment" && typeof apiKey === "string") return withMode(configuredBearerMode, "environment", modeAllowed(provider, target, configuredBearerMode) && hasNonEmptyString(env[apiKey.trim()]));
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
			if (!isValidSecretRef(apiKeyRef) || !modeAllowed(provider, target, configuredBearerMode)) return withMode(configuredBearerMode, "provider-config", false);
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
		const hasAuthEvidence = configured?.auth !== void 0 || hasProfileEvidence(provider);
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
			const stats = readAuthProfileUsageStats(store, profile.profileId);
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
	const rejectedProfileEvaluation = (decision, plan, target) => ({
		...rejectedSourceEvaluation(decision.reason, plan, target),
		...decision.source ? {
			selectedProfileId: decision.source.profileId,
			selectedAuthMode: decision.source.mode
		} : {},
		evidence: "profile"
	});
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
		const orderResolution = profileOrder(provider, ref);
		const plan = sourcePlanForTarget(provider, ref, policy, orderResolution, () => target);
		const decision = selectProviderModelAuthSources({
			provider,
			plan
		});
		return decision.kind === "rejected" ? rejectedProfileEvaluation(decision, plan, target) : void 0;
	};
	const resolveProviderEvaluation = (rawProvider, ref = {}) => {
		const provider = normalizeProviderIdForAuth(rawProvider);
		const target = prepareAuthTarget(provider, ref);
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
		const orderResolution = profileOrder(provider, ref);
		const boundProfileId = !profileLock && policy.binding.kind === "profile" ? policy.binding.profileId : void 0;
		const sourcePlan = sourcePlanForTarget(provider, ref, policy, orderResolution, () => target, {
			profileLock,
			boundProfileId
		});
		const decision = selectProviderModelAuthSources({
			provider,
			plan: sourcePlan
		});
		if (decision.kind === "rejected") return rejectedProfileEvaluation(decision, sourcePlan, target);
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
			...automaticSourceRejection(provider, ref, baseTarget) ?? { availability: void 0 },
			routeResolution
		};
		if (!modelLock && !awsSdkTerminal && basePolicy.binding.kind === "profile-incompatible") return {
			availability: false,
			unavailableReason: "auth-failed",
			routeResolution
		};
		const orderResolution = profileOrder(provider, ref);
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
		const subscriptionSelection = routeResolution.routes.length > 1 && routeAuthDecision.kind === "selected" && routeAuthDecision.selection.kind === "selected" && routeAuthDecision.selection.route.authRequirement === "subscription" ? routeAuthDecision.selection : void 0;
		const accountListedModelIds = subscriptionSelection && params.accountListedModelIds?.(provider, subscriptionSelection.source.kind === "profile" ? subscriptionSelection.source.profileId : void 0);
		if (subscriptionSelection && accountListedModelIds && !accountListedModelIds.has(normalizeLowercaseStringOrEmpty(ref.modelId))) {
			const [firstPlatformRoute, ...restPlatformRoutes] = routeResolution.routes.filter((route) => route.authRequirement !== "subscription");
			const platform = firstPlatformRoute ? selectOpenAIModelRouteAuth({
				resolution: {
					...routeResolution,
					routes: [firstPlatformRoute, ...restPlatformRoutes]
				},
				sourcePlan,
				configuredAuthMode: automaticRouteAuthMode
			}) : void 0;
			if (platform?.kind !== "selected" || platform.selection.kind !== "selected") return {
				availability: false,
				routeResolution,
				selectedRoute: subscriptionSelection.route
			};
		}
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
		if (syntheticCodexOwnsAuth && evaluation.availability !== true && syntheticSubscriptionRoute) return {
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
	const evaluateCliRuntimeAuth = createCliRuntimeModelAuthEvaluator({
		...params,
		authStore: orderStore
	}, evaluateModelAuth);
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
			const runtimeEvaluation = evaluateCliRuntimeAuth(provider, {
				...ref,
				runtimeId
			}, evaluation);
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
