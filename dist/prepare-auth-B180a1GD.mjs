import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { D as isProfileInCooldown, P as resolveProfilesUnavailableReason } from "./user-model-account-authority-DFFjC5J5.mjs";
import { i as isPendingOAuthRefreshFence } from "./oauth-refresh-marker-Dio1lCzm.mjs";
import { a as selectProviderModelAuthSources, c as buildProviderModelAuthSourcePlan, l as classifyProviderModelAuthSource, r as resolveProviderModelRouteAuthRequirement, s as buildProviderModelAuthDirectSource } from "./provider-model-route-auth-C7odu5x8.mjs";
import { o as resolveProviderModelAuthPolicy } from "./model-runtime-policy-DSkspt0X.mjs";
import { o as resolveOpenAIModelRoutes, s as selectOpenAIModelRouteAuth } from "./openai-model-routes-BJEokkWC.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-CrboVKXT.mjs";
import { n as FailoverError } from "./error-Bcp4ZyOv.mjs";
import { i as resolveAuthProfileEligibility, o as resolveAuthProfileOrderWithMetadata, r as prependAuthProfilePin } from "./order-CElLtwMu.mjs";
import { _ as resolveStoredCredentialReadOnlyAvailability } from "./loader-runtime-load-DzFljQbT.mjs";
import { n as resolveProviderDirectAuthPlanningEvidence } from "./model-auth-env-CPdn6zH8.mjs";
import { S as shouldPreferExplicitConfigApiKeyAuth, a as hasUsableCustomProviderApiKey, g as resolveProviderConfigSecretInput, v as resolveProviderEntryApiKeyProfileReference } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { m as resolveFailoverStatus } from "./failover-error-Bjf0VdY2.mjs";
import { t as createSelectedAuthProfileUnavailableError } from "./selection-error-AB1aZh_J.mjs";
import { t as resolveModelProviderAuthConfig } from "./model-auth-provider-route-BGgWpgXk.mjs";
import { t as buildAgentRuntimeAuthPlan } from "./auth-Cszei1X7.mjs";
//#region src/agents/runtime-plan/prepare-auth.ts
/**
* Prepares route-aware auth forwarding for auxiliary agent-runtime calls.
* Callers supply an already loaded credential snapshot; this module never
* resolves secrets or loads a provider runtime.
*/
function createAuthProfileCooldownError(params, profileId) {
	const reason = (params.authProfileStore && resolveProfilesUnavailableReason({
		store: params.authProfileStore,
		profileIds: [profileId]
	})) ?? "unknown";
	return new FailoverError(`Auth profile "${profileId}" is temporarily unavailable for ${params.provider}/${params.modelId}.`, {
		reason,
		status: resolveFailoverStatus(reason),
		provider: params.provider,
		model: params.modelId,
		profileId
	});
}
function prepareAuthAttempts(attempts, buildPlan) {
	const prepared = attempts.map((attempt, index) => {
		const plan = buildPlan(attempt, index);
		return attempt.kind === "profile" ? {
			kind: "profile",
			plan,
			profileId: attempt.source.profileId
		} : {
			kind: "direct",
			plan,
			allowAuthProfileFallback: attempt.allowAuthProfileFallback,
			requiresPriorProfileAttempt: attempts.slice(0, index).some((candidate) => candidate.kind === "profile")
		};
	});
	const plan = prepared[0]?.plan ?? buildPlan(void 0, 0);
	return {
		plan,
		attempts: prepared.length > 0 ? prepared : [{
			kind: "implicit",
			plan
		}]
	};
}
/** Prevents a direct fallback from bypassing a prepared profile tier. */
function canRunPreparedAgentRuntimeAuthAttempt(params) {
	return params.attempt.kind !== "direct" || !params.attempt.requiresPriorProfileAttempt || params.priorProfileAttempted;
}
/** Rechecks automatic cooldowns immediately before a prepared profile attempt. */
function preparedAgentRuntimeProfileAttemptHasCandidate(params) {
	if (params.attempt.kind !== "profile") return false;
	return (params.attempt.plan.forwardedAuthProfileCandidateIds ?? [params.attempt.profileId]).some((profileId) => !isProfileInCooldown(params.store, profileId, void 0, params.modelId));
}
/** True when a prepared auth tuple can be reused for this exact compaction target. */
function agentRuntimeAuthPlanMatchesTarget(plan, target) {
	const route = plan.modelRoute;
	const provider = route?.provider ?? plan.providerForAuth;
	const modelId = route?.modelId ?? plan.modelId;
	return modelId !== void 0 && provider.trim().toLowerCase() === target.provider.trim().toLowerCase() && modelId === target.modelId;
}
function resolveProfile(params, profileId, options = {}) {
	const credential = params.authProfileStore?.profiles[profileId];
	const configured = params.config?.auth?.profiles?.[profileId];
	const availability = credential ? resolveStoredCredentialReadOnlyAvailability({
		credential,
		cfg: params.config ?? {},
		env: params.env ?? process.env
	}) : void 0;
	const authFlow = credential?.type === "oauth" ? credential.authFlow : void 0;
	const policy = credential?.type === "oauth" && authFlow ? resolveProviderModelAuthPolicy({
		provider: credential.provider,
		mode: credential.type,
		authFlow
	}) : void 0;
	const pendingOAuthRefresh = credential?.type === "oauth" && isPendingOAuthRefreshFence(credential);
	return {
		kind: "profile",
		profileId,
		provider: credential?.provider ?? configured?.provider,
		mode: credential?.type ?? configured?.mode,
		...authFlow ? {
			authFlow,
			authRequirement: policy?.authRequirement
		} : {},
		readiness: policy?.compatible === false || availability === false && !pendingOAuthRefresh ? "unavailable" : "unknown",
		cooldown: !options.ignoreCooldown && params.authProfileStore && isProfileInCooldown(params.authProfileStore, profileId, void 0, params.modelId) ? "active" : "clear"
	};
}
/** Applies terminal provider-entry credential policy before route selection. */
function resolvePreparedProviderEntryApiKeyProfileReference(params) {
	const reference = resolveProviderEntryApiKeyProfileReference({
		cfg: params.config,
		authAliasLookupParams: params,
		provider: params.provider,
		store: params.store
	});
	if (reference.kind !== "profile") return reference;
	if (!resolveAuthProfileEligibility({
		cfg: params.config,
		authAliasLookupParams: params,
		store: params.store,
		provider: params.provider,
		profileId: reference.profileId
	}).eligible) throw new Error(`Per-entry apiKey profile "${reference.profileId}" has no usable credentials for ${params.provider}.`);
	if (isProfileInCooldown(params.store, reference.profileId, void 0, params.modelId)) throw createAuthProfileCooldownError({
		...params,
		authProfileStore: params.store
	}, reference.profileId);
	return reference;
}
/** Selects concrete provider routes and ordered credentials as one immutable preparation. */
function prepareAgentRuntimeAuth(input) {
	const params = {
		...input,
		config: resolveModelProviderAuthConfig(input)
	};
	const requestedProfileId = params.sessionAuthProfileId?.trim() || void 0;
	const lockedProfileId = params.requiredAuthProfileId ?? (params.sessionAuthProfileSource === "user" || params.sessionAuthProfileSource === "user-link" ? requestedProfileId : void 0);
	const harnessOwnsOpenAIAuth = params.harnessId?.trim().toLowerCase() === "codex" || params.harnessRuntime?.trim().toLowerCase() === "codex";
	const harnessAuthOwnerId = params.harnessId?.trim() || params.harnessRuntime?.trim();
	const runtimeAuthOwner = harnessOwnsOpenAIAuth && params.harnessAuthBootstrap === "harness" && harnessAuthOwnerId ? { id: harnessAuthOwnerId } : void 0;
	const harnessAllowsAuthProfileForwarding = params.allowHarnessAuthProfileForwarding !== false;
	if (lockedProfileId && !harnessAllowsAuthProfileForwarding) throw new Error(`Auth profile "${lockedProfileId}" cannot be forwarded to the selected agent harness. Configure that harness's native account instead.`);
	const store = params.authProfileStore;
	const authProfileSelectionProvider = harnessOwnsOpenAIAuth ? "openai" : params.provider;
	if (lockedProfileId) {
		if (!(store ? resolveAuthProfileEligibility({
			cfg: params.config,
			authAliasLookupParams: params,
			store,
			provider: authProfileSelectionProvider,
			profileId: lockedProfileId,
			includePendingOAuthRefresh: true
		}) : { eligible: false }).eligible) {
			if (!store?.profiles[lockedProfileId] && params.config?.auth?.profiles?.[lockedProfileId]?.mode !== "aws-sdk") throw createSelectedAuthProfileUnavailableError({
				profileId: lockedProfileId,
				provider: authProfileSelectionProvider,
				modelId: params.modelId
			});
			throw new Error(`Auth profile "${lockedProfileId}" is not configured for ${authProfileSelectionProvider}.`);
		}
	}
	const configuredProvider = resolveMergedModelProviderConfig(params.config, params.provider);
	const configuredAuthMode = lockedProfileId || !harnessAllowsAuthProfileForwarding ? void 0 : configuredProvider?.auth;
	const configuredAwsSdkAuth = configuredAuthMode === "aws-sdk";
	const providerApiKeySecretRef = harnessAllowsAuthProfileForwarding ? resolveProviderConfigSecretInput(params.config, params.provider).ref : void 0;
	const providerHasApiKeySecretRef = Boolean(providerApiKeySecretRef);
	const providerBinding = harnessAllowsAuthProfileForwarding && !lockedProfileId && store && !configuredAwsSdkAuth ? resolvePreparedProviderEntryApiKeyProfileReference({
		...params,
		store
	}) : { kind: "none" };
	if (providerBinding.kind === "profile-incompatible") throw new Error(`Per-entry apiKey "${providerBinding.profileId}" is not a compatible bearer profile for ${params.provider}.`);
	const boundProfileId = providerBinding.kind === "profile" ? providerBinding.profileId : void 0;
	const providerHasUsableMarker = providerBinding.kind === "marker" && hasUsableCustomProviderApiKey(params.config, params.provider, params.env);
	const providerHasDirectMaterial = !configuredAwsSdkAuth && (providerBinding.kind === "literal" || providerHasUsableMarker || providerHasApiKeySecretRef);
	const explicitConfigApiKeyAuth = shouldPreferExplicitConfigApiKeyAuth(params.config, params.provider);
	const providerBindingSuppressesProfiles = providerBinding.kind === "literal" && explicitConfigApiKeyAuth || providerHasUsableMarker || providerHasApiKeySecretRef;
	const providerBindingNeedsNonProfileFallback = providerHasDirectMaterial && !providerBindingSuppressesProfiles;
	const selectedConfiguredAuthMode = configuredAuthMode ?? (providerHasDirectMaterial ? "api-key" : void 0);
	const selectedProfileId = params.requiredAuthProfileId ?? boundProfileId ?? (params.allowAuthProfileFallback === false ? lockedProfileId : void 0);
	const resolvedAutomaticOrder = !harnessAllowsAuthProfileForwarding || selectedProfileId || providerBindingSuppressesProfiles || configuredAwsSdkAuth || !store ? {
		profileIds: selectedProfileId ? [selectedProfileId] : [],
		hasExplicitOrder: false
	} : resolveAuthProfileOrderWithMetadata({
		cfg: params.config,
		authAliasLookupParams: params,
		store,
		provider: authProfileSelectionProvider,
		preferredProfile: requestedProfileId,
		forModel: params.modelId,
		readinessMode: "read-only",
		includePendingOAuthRefresh: true
	});
	const automaticOrderResolution = prependAuthProfilePin(resolvedAutomaticOrder, lockedProfileId);
	const providerPreferredProfileId = harnessAllowsAuthProfileForwarding && !selectedProfileId && !lockedProfileId && !providerBindingSuppressesProfiles && !configuredAwsSdkAuth && store ? params.resolveProviderPreferredProfileId?.({
		config: params.config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		provider: params.provider,
		modelId: params.modelId,
		preferredProfileId: requestedProfileId,
		lockedProfileId: void 0,
		profileOrder: automaticOrderResolution.profileIds,
		authStore: store
	}) : void 0;
	const resolvedOrderedProfileIds = providerPreferredProfileId && automaticOrderResolution.profileIds.includes(providerPreferredProfileId) ? [providerPreferredProfileId, ...automaticOrderResolution.profileIds.filter((profileId) => profileId !== providerPreferredProfileId)] : automaticOrderResolution.profileIds;
	const directSource = (mode, evidence = providerBinding.kind === "marker" && providerHasUsableMarker ? providerBinding.evidence : providerApiKeySecretRef?.source === "env" ? "environment" : "provider-config", availability, authorization = "declared") => buildProviderModelAuthDirectSource({
		mode,
		evidence,
		availability,
		authorization
	});
	const directPlanningCandidate = harnessAllowsAuthProfileForwarding ? resolveProviderDirectAuthPlanningEvidence(authProfileSelectionProvider, params.env ?? process.env, {
		config: params.config,
		workspaceDir: params.workspaceDir,
		metadataSnapshot: params.metadataSnapshot
	}) : null;
	const directPlanningEvidence = directPlanningCandidate?.kind === "setup-provider" && (params.harnessAuthBootstrap === "harness" || authProfileSelectionProvider.trim().toLowerCase() === "openai") ? null : directPlanningCandidate;
	const directPlanningMode = directPlanningEvidence ? configuredAuthMode ?? directPlanningEvidence.mode : void 0;
	const fallbackIsAmbientCredential = directPlanningEvidence?.kind === "environment" && !providerHasDirectMaterial;
	const fallbackDirectSource = directPlanningMode ? directSource(directPlanningMode, directPlanningEvidence?.kind === "environment" ? "environment" : "runtime", directPlanningEvidence?.kind === "environment" ? true : void 0, fallbackIsAmbientCredential ? "ambient" : "declared") : providerBindingNeedsNonProfileFallback ? directSource(selectedConfiguredAuthMode) : void 0;
	const automaticRouteAuthMode = fallbackDirectSource && !providerBindingSuppressesProfiles && !configuredAuthMode ? void 0 : selectedConfiguredAuthMode;
	const ownership = selectedProfileId ? {
		reason: selectedProfileId === lockedProfileId ? "runtime-binding" : "provider-binding",
		source: resolveProfile(params, selectedProfileId, { ignoreCooldown: true })
	} : configuredAwsSdkAuth ? {
		reason: "configured-auth",
		source: directSource("aws-sdk", "aws-sdk")
	} : providerBindingSuppressesProfiles ? {
		reason: "configured-auth",
		source: directSource(selectedConfiguredAuthMode)
	} : void 0;
	const sourcePlan = buildProviderModelAuthSourcePlan({
		...ownership ? { ownership } : {},
		profiles: resolvedOrderedProfileIds.map((profileId) => resolveProfile(params, profileId)),
		...lockedProfileId || providerPreferredProfileId ? { preferredProfileId: lockedProfileId ?? providerPreferredProfileId } : {},
		explicitOrder: automaticOrderResolution.hasExplicitOrder,
		preserveProfilePriority: Boolean(lockedProfileId),
		...fallbackDirectSource ? { fallback: fallbackDirectSource } : {},
		allowCooldown: params.allowTransientCooldownProbe
	});
	const pinnedSource = sourcePlan.kind === "required" ? sourcePlan.source : sourcePlan.orderedProfiles.find((source) => source.profileId === lockedProfileId);
	const resolution = resolveOpenAIModelRoutes({
		provider: params.provider,
		modelId: params.modelId,
		api: params.modelApi,
		baseUrl: params.modelBaseUrl,
		observedRoutes: params.observedRoutes,
		config: params.config,
		agentId: params.agentId,
		primaryModel: !params.routeIntent && params.config ? resolveDefaultModelForAgent({
			cfg: params.config,
			agentId: params.agentId,
			allowManifestNormalization: false,
			allowPluginNormalization: false
		}) : void 0,
		resolveProfileAuthMode: (profileId) => params.authProfileStore?.profiles[profileId]?.type,
		resolveProfileAuthFlow: (profileId) => {
			const credential = params.authProfileStore?.profiles[profileId];
			return credential?.type === "oauth" ? credential.authFlow : void 0;
		},
		routeIntent: params.routeIntent,
		pinnedAuthRequirement: resolveProviderModelRouteAuthRequirement(sourcePlan.kind === "required" ? sourcePlan.source.mode : pinnedSource?.mode ?? configuredAuthMode, pinnedSource?.kind === "profile" ? pinnedSource.authRequirement : void 0),
		env: params.env,
		requestTransportOverrides: params.requestTransportOverrides
	});
	const authPlanParams = {
		provider: params.provider,
		modelId: params.modelId,
		config: params.config,
		env: params.env,
		workspaceDir: params.workspaceDir,
		metadataSnapshot: params.metadataSnapshot,
		harnessId: params.harnessId,
		harnessRuntime: params.harnessRuntime,
		allowHarnessAuthProfileForwarding: harnessAllowsAuthProfileForwarding
	};
	const buildAttemptPlan = (source, candidateIds, modelRoute) => {
		const profile = source?.kind === "profile" ? source : void 0;
		return buildAgentRuntimeAuthPlan({
			...authPlanParams,
			authProfileProvider: profile?.provider,
			authProfileFlow: profile?.authFlow,
			authProfileMode: profile?.mode ?? (source?.kind === "direct" ? source.mode : selectedConfiguredAuthMode),
			sessionAuthProfileId: profile?.profileId,
			sessionAuthProfileSource: profile ? profile.profileId === lockedProfileId ? params.requiredAuthProfileId ? params.sessionAuthProfileSource ?? "auto" : "user" : "auto" : void 0,
			sessionAuthProfileCandidateIds: candidateIds,
			credentialSource: source ? classifyProviderModelAuthSource(source) : { kind: "none" },
			modelRoute
		});
	};
	const rejectionError = (decision) => decision.reason === "all-cooldown" && decision.source ? createAuthProfileCooldownError(params, decision.source.profileId) : new Error(decision.message);
	const assertForwardedProfile = (profileId, plan) => {
		if (profileId && harnessOwnsOpenAIAuth && plan.forwardedAuthProfileId !== profileId) throw new Error(`Auth profile "${profileId}" cannot be forwarded to the codex runtime.`);
	};
	if (!resolution || resolution.kind === "indeterminate") {
		const sourceDecision = selectProviderModelAuthSources({
			provider: authProfileSelectionProvider,
			plan: sourcePlan
		});
		if (sourceDecision.kind === "rejected") throw rejectionError(sourceDecision);
		const buildGenericPlan = (attempt, candidateIndex) => {
			const candidateIds = sourceDecision.attempts.slice(candidateIndex).flatMap((candidate) => candidate.kind === "profile" ? [candidate.source.profileId] : []);
			return buildAttemptPlan(attempt?.source, candidateIds.length > 0 ? candidateIds : void 0);
		};
		const prepared = prepareAuthAttempts(sourceDecision.attempts, buildGenericPlan);
		assertForwardedProfile(selectedProfileId, prepared.plan);
		return prepared;
	}
	if (resolution.kind === "incompatible") throw new Error(resolution.message);
	const toPreparedRoute = (route) => ({
		provider: params.provider,
		modelId: params.modelId,
		api: route.api,
		baseUrl: route.baseUrl,
		authRequirement: route.authRequirement,
		requestTransportOverrides: route.requestTransportOverrides,
		runtimePolicy: route.runtimePolicy
	});
	const routeAuthDecision = selectOpenAIModelRouteAuth({
		resolution,
		sourcePlan,
		configuredAuthMode: automaticRouteAuthMode,
		...runtimeAuthOwner ? { runtimeAuthOwner } : {},
		...runtimeAuthOwner && configuredProvider === void 0 ? { allowNativeAuthOnSingleRoute: true } : {}
	});
	if (routeAuthDecision.kind === "deferred") {
		const plan = buildAgentRuntimeAuthPlan({
			...authPlanParams,
			deferredRouteSupport: routeAuthDecision.routeSupport
		});
		return {
			plan,
			attempts: [{
				kind: "implicit",
				plan
			}]
		};
	}
	if (routeAuthDecision.kind !== "selected") throw rejectionError(routeAuthDecision);
	const buildRoutedPlan = (attempt) => {
		const route = attempt?.route ?? routeAuthDecision.selection.route;
		return buildAttemptPlan(attempt?.source, attempt?.kind === "profile" ? [...attempt.sameRouteProfileIds] : void 0, toPreparedRoute(route));
	};
	const prepared = prepareAuthAttempts(routeAuthDecision.attempts, buildRoutedPlan);
	for (const attempt of prepared.attempts) if (attempt.kind !== "implicit") assertForwardedProfile(attempt.profileId, attempt.plan);
	return prepared;
}
//#endregion
export { preparedAgentRuntimeProfileAttemptHasCandidate as i, canRunPreparedAgentRuntimeAuthAttempt as n, prepareAgentRuntimeAuth as r, agentRuntimeAuthPlanMatchesTarget as t };
