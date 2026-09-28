import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { b as applyConfigOverrides } from "./io.snapshot-BXLTgjrd.mjs";
import { b as resolveIsConfigReadOnly, l as isNixMode } from "./paths-DehQwyE0.mjs";
import { i as tryGetLegacyDefaultAgentId, r as retainLegacyDefaultAgentId, t as inheritLegacyDefaultAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { i as copyConfigResolutionFactsExcept, r as copyConfigResolutionFacts, u as hasUnresolvedConfigPath } from "./resolution-facts-CSuKIPux.mjs";
import { o as measureDiagnosticsTimelineSpan } from "./diagnostics-timeline-uuHa_36_.mjs";
import { i as materializeLegacyDefaultAgentRoles } from "./legacy.roster-zIYbDm7V.mjs";
import { t as createInvalidConfigError } from "./io.invalid-config-Deld-wtR.mjs";
import { r as isPluginPackagingRuntimeOutputInvalidConfigSnapshot } from "./recovery-policy-aFpXeB1n.mjs";
import { d as readConfigFileSnapshotWithPluginMetadata } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { n as evaluateGatewayAuthSurfaceStates, t as GATEWAY_AUTH_SURFACE_PATHS } from "./runtime-gateway-auth-surfaces-CyXklZD-.mjs";
import { a as isProviderScopedSecretResolutionError, n as describeSecretResolutionOperatorDiagnostic, o as isSecretResolutionError, r as describeSecretResolutionOperatorRecovery } from "./resolve-errors-DYenvPyo.mjs";
import { t as assertGatewayAuthNotKnownWeak } from "./known-weak-gateway-secrets-BzNXiOK5.mjs";
import { r as resolveGatewayAuthForConfig } from "./auth-resolve-BeCTtDNQ.mjs";
import { n as formatPluginPackagingRuntimeOutputRecoveryHint, t as formatInvalidConfigRecoveryHint } from "./config-recovery-hints-DZUkkFyc.mjs";
import { t as renderConfigValidationIssueLines } from "./issue-location-BWFXViLe.mjs";
import { t as resolveAuthProfileSecretOwnerId } from "./runtime-auth-profile-owner-B9HL0H0Z.mjs";
import { a as classifySecretResolutionErrorDegradations, h as redactSecretDegradationReason, l as isRetryableSecretDegradationReason, m as listSecretResolutionErrorOwners, t as SECRET_DEGRADATION_RETRY_HINT } from "./runtime-degraded-state-DVMYGogL.mjs";
import { c as hasLegacyAuthProfileSourcesForStartup } from "./legacy-source-diagnostic-_PHHNz0J.mjs";
import { _ as registerProviderAuthRuntimeSnapshotActivationOwner, f as graftActiveSecretsRuntimeAuthState, g as hasSameSecretReloadContract, l as getActiveSecretsRuntimeSnapshotRevisionState, m as hasCurrentAuthStoreCredentialsRevision, n as activateSecretsRuntimeSnapshotState, p as hasActiveSecretsRuntimeSnapshotLineage, u as getActiveSecretsRuntimeSnapshotState } from "./runtime-state-CtZtwiOt.mjs";
import { t as applyPluginAutoEnable } from "./plugin-auto-enable-CaqgRIEy.mjs";
import { n as mergeGatewayAuthConfig, r as mergeGatewayTailscaleConfig, t as ensureGatewayStartupAuth } from "./startup-auth-Cnh-psTn.mjs";
import { a as prepareSecretsRuntimeFastPathSnapshot, n as collectCandidateAgentDirs } from "./runtime-fast-path-bKp498g_.mjs";
import { t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-8zX3nnmq.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/secrets/runtime-provider-auth-scope.ts
/** Classifies degradation state owned by provider and auth-profile refreshes. */
function listProviderAuthDegradedOwners(snapshot) {
	const modelProviderOwnerIds = new Set(Object.keys(snapshot.sourceConfig.models?.providers ?? {}).map((providerId) => normalizeOptionalLowercaseString(providerId) ?? providerId));
	const authOwnerIds = new Set(snapshot.authStores.flatMap(({ agentDir, store }) => Object.keys(store.profiles).map((profileId) => resolveAuthProfileSecretOwnerId({
		agentDir,
		profileId
	}))));
	return (snapshot.degradedOwners ?? []).filter((owner) => owner.ownerKind === "provider" && modelProviderOwnerIds.has(owner.ownerId) || owner.ownerKind === "account" && authOwnerIds.has(owner.ownerId));
}
/** Whether a config-source repair may recover without replacing active auth-store state. */
function preparedDegradationSupportsSourceOnlyRecovery(snapshot) {
	const degradedOwners = snapshot.degradedOwners ?? [];
	const authOwnerIds = new Set(snapshot.authStores.flatMap(({ agentDir, store }) => Object.keys(store.profiles).map((profileId) => resolveAuthProfileSecretOwnerId({
		agentDir,
		profileId
	}))));
	return degradedOwners.length > 0 && degradedOwners.every((owner) => owner.degradationState === "cold" && !(owner.ownerKind === "account" && authOwnerIds.has(owner.ownerId)));
}
function resolvePreparedSecretsStateScope(snapshot) {
	const degradedOwners = snapshot.degradedOwners ?? [];
	return degradedOwners.length > 0 && listProviderAuthDegradedOwners(snapshot).length === degradedOwners.length ? "provider-auth" : "full";
}
//#endregion
//#region src/secrets/runtime-warning-log.ts
function logRuntimeSecretWarnings(params) {
	const providerFailurePaths = new Set((params.snapshot.degradedOwners ?? []).flatMap((owner) => owner.providerFailures?.length && !owner.refFailureReason ? owner.paths : []));
	const activeDegradedPaths = params.ownerUnavailable === "active-only" ? new Set((params.snapshot.degradedOwners ?? []).flatMap((owner) => owner.paths)) : null;
	for (const warning of params.snapshot.warnings) {
		if (warning.code === "SECRETS_OWNER_UNAVAILABLE") {
			if (params.ownerUnavailable === "exclude") continue;
			if (activeDegradedPaths && !activeDegradedPaths.has(warning.path)) continue;
			if (providerFailurePaths.has(warning.path)) continue;
		} else if (params.ownerUnavailable === "active-only") continue;
		params.log.warn(`[${warning.code}] ${warning.message}`);
	}
}
//#endregion
//#region src/gateway/server-startup-config-helpers.ts
/** Throw a formatted startup error when the loaded config snapshot is invalid. */
function assertValidGatewayStartupConfigSnapshot(snapshot, options = {}) {
	if (snapshot.valid) return;
	const issues = snapshot.issues.length > 0 ? renderConfigValidationIssueLines(snapshot, "").join("\n") : "Unknown validation issue.";
	const recoveryHint = options.includeDoctorHint && isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? `\n${formatPluginPackagingRuntimeOutputRecoveryHint()}` : options.includeDoctorHint ? `\n${formatInvalidConfigRecoveryHint()}` : "";
	throw createInvalidConfigError(snapshot.path, `${issues}${recoveryHint}`, { recovery: isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) ? "manual" : "doctor" });
}
function withRuntimeConfig(snapshot, runtimeConfig) {
	copyConfigResolutionFacts(snapshot.sourceConfig, runtimeConfig);
	return {
		...snapshot,
		runtimeConfig,
		config: runtimeConfig
	};
}
/** Load and validate the config snapshot, applying runtime-only plugin auto-enable changes. */
async function loadGatewayStartupConfigSnapshot(params) {
	const measure = params.measure ?? (async (_name, run) => await run());
	const snapshotRead = params.initialSnapshotRead ?? await measure("config.snapshot.read", () => readConfigFileSnapshotWithPluginMetadata({ measure }));
	const configSnapshot = snapshotRead.snapshot;
	const pluginMetadataSnapshot = snapshotRead.pluginMetadataSnapshot;
	if (configSnapshot.legacyIssues.length > 0 && resolveIsConfigReadOnly()) throw createInvalidConfigError(configSnapshot.path, isNixMode ? "Legacy config entries detected while running in Nix mode. Update your Nix config to the latest schema and restart." : "Legacy config entries detected in read-only config. Update your external config source to the latest schema and restart.", { recovery: "manual" });
	if (configSnapshot.exists) assertValidGatewayStartupConfigSnapshot(configSnapshot, { includeDoctorHint: true });
	const autoEnable = params.minimalTestGateway ? {
		config: configSnapshot.config,
		changes: []
	} : await measure("config.snapshot.auto-enable", () => applyPluginAutoEnable({
		config: configSnapshot.sourceConfig,
		env: process.env,
		...pluginMetadataSnapshot?.manifestRegistry ? { manifestRegistry: pluginMetadataSnapshot.manifestRegistry } : {},
		discovery: pluginMetadataSnapshot?.discovery
	}));
	if (autoEnable.changes.length === 0) return {
		snapshot: configSnapshot,
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
	};
	params.log.info(`gateway: auto-enabled plugins for this runtime without writing config:\n${autoEnable.changes.map((entry) => `- ${entry}`).join("\n")}`);
	const autoEnabledRuntimeConfig = mergeActivationSectionsIntoRuntimeConfig({
		runtimeConfig: configSnapshot.runtimeConfig,
		activationConfig: autoEnable.config
	});
	const legacyDefaultAgentId = tryGetLegacyDefaultAgentId(configSnapshot.sourceConfig);
	const runtimeConfig = legacyDefaultAgentId ? materializeLegacyDefaultAgentRoles(autoEnabledRuntimeConfig, legacyDefaultAgentId).config : autoEnabledRuntimeConfig;
	retainLegacyDefaultAgentId(runtimeConfig, legacyDefaultAgentId);
	return {
		snapshot: withRuntimeConfig(configSnapshot, runtimeConfig),
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {}
	};
}
function hasActiveGatewayAuthSecretRef(config) {
	const states = evaluateGatewayAuthSurfaceStates({
		config,
		defaults: config.secrets?.defaults,
		env: process.env
	});
	return GATEWAY_AUTH_SURFACE_PATHS.some((path) => {
		const state = states[path];
		return state.hasSecretRef && state.active;
	});
}
function assertRuntimeGatewayAuthNotKnownWeak(config) {
	assertGatewayAuthNotKnownWeak(resolveGatewayAuthForConfig({
		config,
		env: process.env,
		tailscaleMode: config.gateway?.tailscale?.mode ?? "off"
	}), config.gateway?.auth?.token, config.gateway?.auth?.password);
}
function logGatewayAuthSurfaceDiagnostics(prepared, logSecrets) {
	const states = evaluateGatewayAuthSurfaceStates({
		config: prepared.sourceConfig,
		defaults: prepared.sourceConfig.secrets?.defaults,
		env: process.env
	});
	const inactiveWarnings = /* @__PURE__ */ new Map();
	for (const warning of prepared.warnings) {
		if (warning.code !== "SECRETS_REF_IGNORED_INACTIVE_SURFACE") continue;
		inactiveWarnings.set(warning.path, warning.message);
	}
	for (const path of GATEWAY_AUTH_SURFACE_PATHS) {
		const state = states[path];
		if (!state.hasSecretRef) continue;
		const stateLabel = state.active ? "active" : "inactive";
		const details = (!state.active && inactiveWarnings.get(path) ? inactiveWarnings.get(path) : void 0) ?? state.reason;
		logSecrets.info(`[SECRETS_GATEWAY_AUTH_SURFACE] ${path} is ${stateLabel}. ${details}`);
	}
}
function applyGatewayAuthOverridesForStartupPreflight(config, overrides) {
	if (!overrides.auth && !overrides.tailscale) return config;
	const next = {
		...config,
		gateway: {
			...config.gateway,
			...overrides.auth ? { auth: mergeGatewayAuthConfig(config.gateway?.auth, overrides.auth) } : {},
			...overrides.tailscale ? { tailscale: mergeGatewayTailscaleConfig(config.gateway?.tailscale, overrides.tailscale) } : {}
		}
	};
	copyConfigResolutionFactsExcept(config, next, [...overrides.auth?.token !== void 0 ? ["gateway.auth.token"] : [], ...overrides.auth?.password !== void 0 ? ["gateway.auth.password"] : []]);
	return next;
}
//#endregion
//#region src/gateway/server-startup-secret-diagnostics.ts
/** Aggregates redacted SecretRef degradation diagnostics at the Gateway activation boundary. */
function logSecretDegradation(log, degradation) {
	const reason = redactSecretDegradationReason(degradation.reason);
	log.warn(`[SECRETS_DEGRADED] ${degradation.state} ${degradation.kind}:${degradation.id}: ${reason}. Retry: ${degradation.retryHint}.`, {
		event: "secrets.degraded",
		ownerKind: degradation.kind,
		ownerId: degradation.id,
		reason,
		state: degradation.state,
		retryHint: degradation.retryHint
	});
}
function logSecretProviderDegradation(log, providerFailure, degradations) {
	const reason = redactSecretDegradationReason(degradations[0]?.reason ?? "secret resolution failed");
	const affectedOwners = degradations.map(({ kind, id, state }) => ({
		ownerKind: kind,
		ownerId: id,
		state
	})).toSorted((left, right) => left.ownerKind.localeCompare(right.ownerKind) || left.ownerId.localeCompare(right.ownerId));
	const affectedOwnerSummary = affectedOwners.map((owner) => `${owner.state} ${owner.ownerKind}:${owner.ownerId}`).join(", ");
	log.warn(`[SECRETS_PROVIDER_DEGRADED] ${providerFailure.source}:${providerFailure.provider}: ${reason}. Affected owners: ${affectedOwnerSummary}. Retry: ${SECRET_DEGRADATION_RETRY_HINT}.`, {
		event: "secrets.provider_degraded",
		source: providerFailure.source,
		provider: providerFailure.provider,
		reason,
		affectedOwners,
		retryHint: SECRET_DEGRADATION_RETRY_HINT
	});
}
/** Logs one provider diagnostic per failed provider and owner diagnostics for ref failures. */
function logPreparedSecretDegradations(log, owners) {
	const providerDegradations = /* @__PURE__ */ new Map();
	for (const owner of owners) {
		const degradation = {
			kind: owner.ownerKind,
			id: owner.ownerId,
			reason: owner.reason,
			state: owner.degradationState ?? "cold",
			retryHint: SECRET_DEGRADATION_RETRY_HINT
		};
		if (!owner.providerFailures?.length) {
			logSecretDegradation(log, degradation);
			continue;
		}
		if (owner.refFailureReason) logSecretDegradation(log, {
			...degradation,
			reason: owner.refFailureReason
		});
		for (const providerFailure of owner.providerFailures) {
			const key = `${providerFailure.source}\0${providerFailure.provider}`;
			const group = providerDegradations.get(key);
			if (group) group.degradations.push({
				...degradation,
				reason: "secret provider failed"
			});
			else providerDegradations.set(key, {
				providerFailure,
				degradations: [{
					...degradation,
					reason: "secret provider failed"
				}]
			});
		}
	}
	for (const group of providerDegradations.values()) logSecretProviderDegradation(log, group.providerFailure, group.degradations);
}
/** Logs typed thrown failures with the same provider-level aggregation as prepared snapshots. */
function logThrownSecretDegradations(log, error, degradations) {
	if (isProviderScopedSecretResolutionError(error)) {
		logSecretProviderDegradation(log, {
			source: error.source,
			provider: error.provider
		}, degradations);
		return;
	}
	for (const degradation of degradations) logSecretDegradation(log, degradation);
}
//#endregion
//#region src/gateway/server-startup-secret-surfaces.ts
function resolveGatewayStartupSourceConfig(config, env) {
	if (!(isTruthyEnvValue(env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(env.OPENCLAW_SKIP_PROVIDERS)) || !config.channels) return config;
	return {
		...config,
		channels: void 0
	};
}
//#endregion
//#region src/gateway/server-startup-config.ts
/** Create the serialized secrets activation function used by startup and reload paths. */
function createRuntimeSecretsActivator(params) {
	let secretsDegraded = false;
	let degradationGeneration = 0;
	let activeDegradationGeneration = null;
	let activeDegradationConfig = null;
	let activeDegradationSupportsSourceOnlyRecovery = false;
	let activeDegradationScope = null;
	const deferredStateTransitions = /* @__PURE__ */ new WeakMap();
	let pendingDeferredLineageRevision = null;
	let secretsActivationTail = Promise.resolve();
	const loadSecretsRuntime = createLazyPromise(() => import("./runtime-BvcILptz.mjs"), { cacheRejections: true });
	const loadAuthProfiles = createLazyPromise(() => import("./auth-profiles-Cr7p59RG.mjs"), { cacheRejections: true });
	const startupManifestRegistry = params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
	const runWithSecretsActivationLock = async (operation) => {
		const run = secretsActivationTail.then(operation, operation);
		secretsActivationTail = run.then(() => void 0, () => void 0);
		return await run;
	};
	const loadActivateRuntimeSecretsSnapshot = async () => {
		if (params.activateRuntimeSecretsSnapshot) return params.activateRuntimeSecretsSnapshot;
		return (await loadSecretsRuntime()).activateSecretsRuntimeSnapshot;
	};
	const publishRecovery = (config, expectedGeneration, scope = "full") => {
		if (!secretsDegraded || expectedGeneration !== void 0 && activeDegradationGeneration !== expectedGeneration || scope === "provider-auth" && activeDegradationScope !== "provider-auth") return;
		const recoveredMessage = "Secret resolution recovered.";
		params.logSecrets.info(`[SECRETS_RELOADER_RECOVERED] ${recoveredMessage}`);
		params.emitStateEvent("SECRETS_RELOADER_RECOVERED", recoveredMessage, config);
		secretsDegraded = false;
		activeDegradationGeneration = null;
		activeDegradationConfig = null;
		activeDegradationSupportsSourceOnlyRecovery = false;
		activeDegradationScope = null;
	};
	const publishDegradation = (prepared, reason, scope = "full", activationScope = "full") => {
		logPreparedSecretDegradations(params.logSecrets, prepared.degradedOwners ?? []);
		if (reason === "startup") return;
		if (activationScope === "provider-auth" && activeDegradationScope === "full") return;
		if (!secretsDegraded) params.emitStateEvent("SECRETS_RELOADER_DEGRADED", "Secret resolution degraded one or more owners; healthy owners were refreshed.", prepared.config);
		const currentSupportsSourceOnlyRecovery = preparedDegradationSupportsSourceOnlyRecovery(prepared);
		activeDegradationSupportsSourceOnlyRecovery = secretsDegraded ? activeDegradationSupportsSourceOnlyRecovery && currentSupportsSourceOnlyRecovery : currentSupportsSourceOnlyRecovery;
		secretsDegraded = true;
		activeDegradationGeneration = ++degradationGeneration;
		activeDegradationConfig = structuredClone(prepared.sourceConfig);
		activeDegradationScope = scope;
	};
	const finishPreparedSnapshot = async (prepared, activationParams, options) => {
		assertRuntimeGatewayAuthNotKnownWeak(prepared.config);
		if (activationParams.activate && !options?.alreadyActivated) (options?.activateRuntimeSecretsSnapshot ?? await loadActivateRuntimeSecretsSnapshot())(prepared);
		if (activationParams.activate) {
			options?.onActivated?.();
			logGatewayAuthSurfaceDiagnostics(prepared, params.logSecrets);
		}
		logRuntimeSecretWarnings({
			snapshot: prepared,
			log: params.logSecrets,
			ownerUnavailable: activationParams.activate && activationParams.deferStatePublication !== true ? "include" : "exclude"
		});
		const statePrepared = options?.stateDegradedOwners ? {
			...prepared,
			degradedOwners: options.stateDegradedOwners
		} : prepared;
		const stateScope = options?.stateScope ?? resolvePreparedSecretsStateScope(statePrepared);
		const activationScope = options?.stateScope ?? "full";
		if (activationParams.activate && (statePrepared.degradedOwners?.length ?? 0) > 0) {
			if (activationParams.deferStatePublication === true) {
				const activationRevision = getActiveSecretsRuntimeSnapshotRevisionState();
				deferredStateTransitions.set(prepared, {
					kind: "degraded",
					activationRevision,
					reason: activationParams.reason,
					activationScope
				});
				pendingDeferredLineageRevision = activationRevision;
			} else publishDegradation(statePrepared, activationParams.reason, stateScope, activationScope);
		} else if (activationParams.activate && secretsDegraded) {
			if (activationParams.deferStatePublication === true) {
				if (activeDegradationGeneration !== null) {
					const activationRevision = getActiveSecretsRuntimeSnapshotRevisionState();
					deferredStateTransitions.set(prepared, {
						kind: "recovered",
						activationRevision,
						degradationGeneration: activeDegradationGeneration,
						reason: activationParams.reason,
						activationScope
					});
					pendingDeferredLineageRevision = activationRevision;
				}
			} else publishRecovery(prepared.config, void 0, stateScope);
		}
		return prepared;
	};
	const handleSecretsActivationError = (err, activationParams, eventConfig) => {
		const mayPublishReloadDegradation = (activationParams.activate || activationParams.publishFailureAsDegraded === true) && (activationParams.canPublishFailureAsDegraded?.() ?? true);
		const degradations = classifySecretResolutionErrorDegradations(err);
		const retryableDegradations = degradations.filter((degradation) => isRetryableSecretDegradationReason(degradation.reason));
		if (retryableDegradations.length > 0 && (activationParams.reason === "startup" || mayPublishReloadDegradation)) {
			logThrownSecretDegradations(params.logSecrets, err, retryableDegradations);
			if (activationParams.reason !== "startup") {
				if (!secretsDegraded) params.emitStateEvent("SECRETS_RELOADER_DEGRADED", "Secret resolution failed; runtime remains on the last-known-good snapshot.", eventConfig);
				const failedOwners = listSecretResolutionErrorOwners(err).filter((owner) => owner.failureMatched);
				const currentFailureSupportsSourceOnlyRecovery = failedOwners.length > 0 && failedOwners.every((owner) => owner.source === "config" && owner.degradationState === "cold");
				activeDegradationSupportsSourceOnlyRecovery = secretsDegraded ? activeDegradationSupportsSourceOnlyRecovery && currentFailureSupportsSourceOnlyRecovery : currentFailureSupportsSourceOnlyRecovery;
				secretsDegraded = true;
				activeDegradationGeneration = ++degradationGeneration;
				activeDegradationConfig = structuredClone(eventConfig);
				activeDegradationScope = "full";
			}
		}
		if (activationParams.reason === "startup") {
			if (isSecretResolutionError(err) && err.code === "SECRET_REF_REDACTED_VALUE") throw new Error(`Startup failed: ${describeSecretResolutionOperatorDiagnostic(err)}. ${describeSecretResolutionOperatorRecovery(err)}.`, { cause: err });
			if (degradations.length > 0) throw new Error("Startup failed: required secrets are unavailable.");
			throw new Error(`Startup failed: required secrets are unavailable. ${String(err)}`, { cause: err });
		}
		throw err;
	};
	const prepareRuntimeSecrets = async (config, activationParams) => await runWithSecretsActivationLock(async () => {
		let activationSourceConfig = config;
		try {
			const sourceConfig = resolveGatewayStartupSourceConfig(config, activationParams.env ?? process.env);
			activationSourceConfig = sourceConfig;
			const startupPreflight = activationParams.reason === "startup" || activationParams.reason === "restart-check";
			if (activationParams.reason === "startup" && activationParams.activate && !params.prepareRuntimeSecretsSnapshot && !params.activateRuntimeSecretsSnapshot) {
				const startupEnv = activationParams.env ?? process.env;
				const fastPath = hasLegacyAuthProfileSourcesForStartup({
					agentDirs: collectCandidateAgentDirs(sourceConfig, startupEnv),
					env: startupEnv
				}) ? null : prepareSecretsRuntimeFastPathSnapshot({
					config: sourceConfig,
					env: startupEnv,
					...startupManifestRegistry ? { manifestRegistry: startupManifestRegistry } : {}
				});
				if (fastPath) return await finishPreparedSnapshot(fastPath.snapshot, activationParams, { activateRuntimeSecretsSnapshot: (snapshot) => activateSecretsRuntimeSnapshotState({
					snapshot,
					refreshContext: fastPath.refreshContext,
					refreshHandler: {
						preflight: async (refreshParams) => await (await loadSecretsRuntime()).preflightActiveSecretsRuntimeSnapshotRefresh(refreshParams),
						refresh: async (refreshParams) => await (await loadSecretsRuntime()).refreshActiveSecretsRuntimeSnapshotForConfig(refreshParams)
					}
				}) });
			}
			const loadAuthStore = startupPreflight ? (await loadAuthProfiles()).loadAuthProfileStoreWithoutExternalProfiles : void 0;
			const secretsRuntime = params.prepareRuntimeSecretsSnapshot && params.activateRuntimeSecretsSnapshot ? null : await loadSecretsRuntime();
			const prepareRuntimeSecretsSnapshot = params.prepareRuntimeSecretsSnapshot ?? secretsRuntime.prepareSecretsRuntimeSnapshot;
			const allowUnavailableSecretOwners = activationParams.reason !== "startup" || getActiveSecretsRuntimeSnapshotState() === null;
			const prepared = await measureDiagnosticsTimelineSpan("secrets.prepare", () => prepareRuntimeSecretsSnapshot({
				config: sourceConfig,
				allowUnavailableSecretOwners,
				...activationParams.env ? { env: activationParams.env } : {},
				includeAuthStoreRefs: activationParams.includeAuthStoreRefs,
				forceColdRefKeys: activationParams.forceColdRefKeys,
				...startupManifestRegistry ? { manifestRegistry: startupManifestRegistry } : {},
				...params.pluginMetadataSnapshot ? { pluginMetadataSnapshot: params.pluginMetadataSnapshot } : {},
				...loadAuthStore ? { loadAuthStore } : {}
			}), {
				attributes: {
					activate: activationParams.activate,
					gatewayAuthSecretRef: hasActiveGatewayAuthSecretRef(config),
					reason: activationParams.reason
				},
				config,
				env: activationParams.env ?? process.env,
				omitErrorMessage: true,
				phase: activationParams.reason
			});
			if (activationParams.includeAuthStoreRefs === false) graftActiveSecretsRuntimeAuthState(prepared);
			return await finishPreparedSnapshot(prepared, activationParams);
		} catch (err) {
			return handleSecretsActivationError(err, activationParams, activationSourceConfig);
		}
	});
	const activatePreparedSnapshot = async (snapshot, activationParams) => await runWithSecretsActivationLock(async () => {
		try {
			return await finishPreparedSnapshot(snapshot, activationParams);
		} catch (err) {
			return handleSecretsActivationError(err, activationParams, snapshot.sourceConfig);
		}
	});
	const activatePreparedSnapshotIfCurrent = async (snapshot, expectedRevision, activationParams, onActivated, canActivate, checkpoint) => {
		const runtimeSourceConfig = activationParams.runtimeSourceConfig;
		const activateRuntimeSecretsSnapshot = activationParams.activate ? runtimeSourceConfig ? ((runtime) => (preparedSnapshot) => runtime.activateSecretsRuntimeSnapshotWithSource(preparedSnapshot, runtimeSourceConfig))(await loadSecretsRuntime()) : await loadActivateRuntimeSecretsSnapshot() : void 0;
		return await runWithSecretsActivationLock(async () => {
			await checkpoint?.();
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== expectedRevision || !hasCurrentAuthStoreCredentialsRevision(snapshot) || canActivate && !canActivate()) return null;
			let activated;
			let publication;
			try {
				activated = await finishPreparedSnapshot(snapshot, activationParams, activateRuntimeSecretsSnapshot ? {
					activateRuntimeSecretsSnapshot,
					...onActivated ? { onActivated: () => {
						publication = Promise.resolve(onActivated());
					} } : {}
				} : void 0);
			} catch (err) {
				return handleSecretsActivationError(err, activationParams, snapshot.sourceConfig);
			}
			await publication;
			return activated;
		});
	};
	const providerAuthActivationParams = {
		reason: "reload",
		activate: true
	};
	registerProviderAuthRuntimeSnapshotActivationOwner({
		runExclusive: runWithSecretsActivationLock,
		isCurrent: (snapshot, expectedRevision) => getActiveSecretsRuntimeSnapshotRevisionState() === expectedRevision && hasCurrentAuthStoreCredentialsRevision(snapshot),
		assertValid: (snapshot) => assertRuntimeGatewayAuthNotKnownWeak(snapshot.config),
		publish: async (snapshot) => {
			if (pendingDeferredLineageRevision !== null && hasActiveSecretsRuntimeSnapshotLineage(pendingDeferredLineageRevision)) return;
			await finishPreparedSnapshot(snapshot, providerAuthActivationParams, {
				alreadyActivated: true,
				stateScope: "provider-auth",
				stateDegradedOwners: listProviderAuthDegradedOwners(snapshot)
			});
		},
		onError: (error, snapshot) => handleSecretsActivationError(error, providerAuthActivationParams, snapshot.sourceConfig)
	});
	const publishStateTransition = (snapshot, options) => {
		const transition = deferredStateTransitions.get(snapshot);
		deferredStateTransitions.delete(snapshot);
		if (transition && pendingDeferredLineageRevision === transition.activationRevision) pendingDeferredLineageRevision = null;
		if (!transition) {
			const activeSnapshot = options?.sourceOnly === true && options.expectedRevision !== void 0 && hasActiveSecretsRuntimeSnapshotLineage(options.expectedRevision) ? getActiveSecretsRuntimeSnapshotState() : null;
			const sourceOnlyDegradationGeneration = activeDegradationGeneration;
			if (activeSnapshot !== null && sourceOnlyDegradationGeneration !== null && activeDegradationSupportsSourceOnlyRecovery && activeDegradationConfig !== null && !hasSameSecretReloadContract(activeDegradationConfig, activeSnapshot.sourceConfig)) {
				if ((activeSnapshot.degradedOwners?.length ?? 0) > 0) {
					const activeScope = resolvePreparedSecretsStateScope(activeSnapshot);
					publishDegradation(activeSnapshot, "reload", activeScope);
				} else publishRecovery(activeSnapshot.config, sourceOnlyDegradationGeneration);
			}
			return;
		}
		if (!hasActiveSecretsRuntimeSnapshotLineage(transition.activationRevision)) return;
		const activeSnapshot = getActiveSecretsRuntimeSnapshotState();
		if (!activeSnapshot) return;
		logRuntimeSecretWarnings({
			snapshot: activeSnapshot,
			log: params.logSecrets,
			ownerUnavailable: "active-only"
		});
		if ((activeSnapshot.degradedOwners?.length ?? 0) > 0) {
			const activeScope = resolvePreparedSecretsStateScope(activeSnapshot);
			const { reason, activationScope } = transition;
			publishDegradation(activeSnapshot, reason, activeScope, activationScope);
			return;
		}
		if (options?.sourceOnly === true && (!activeDegradationSupportsSourceOnlyRecovery || activeDegradationConfig === null || hasSameSecretReloadContract(activeDegradationConfig, activeSnapshot.sourceConfig))) return;
		const generation = transition.kind === "recovered" ? transition.degradationGeneration : void 0;
		publishRecovery(activeSnapshot.config, generation, transition.activationScope);
	};
	return Object.assign(prepareRuntimeSecrets, {
		activatePreparedSnapshot,
		activatePreparedSnapshotIfCurrent,
		publishStateTransition
	});
}
/** Prepare the effective Gateway startup config after auth, overrides, and secrets activation. */
async function prepareGatewayStartupConfig(params) {
	const measure = params.measure ?? (async (_name, run) => await run());
	await measure("config.auth.snapshot-validate", () => assertValidGatewayStartupConfigSnapshot(params.configSnapshot));
	const runtimeConfig = await measure("config.auth.runtime-overrides", () => applyConfigOverrides(params.configSnapshot.config));
	copyConfigResolutionFacts(params.configSnapshot.config, runtimeConfig);
	const startupPreflightConfig = await measure("config.auth.startup-overrides", () => applyGatewayAuthOverridesForStartupPreflight(runtimeConfig, {
		auth: params.authOverride,
		tailscale: params.tailscaleOverride
	}));
	const needsAuthSecretPreflight = await measure("config.auth.secret-surface", () => hasActiveGatewayAuthSecretRef(startupPreflightConfig));
	let preflightPrepared;
	const preflightConfig = await measure("config.auth.secret-preflight", async () => {
		if (!needsAuthSecretPreflight) return startupPreflightConfig;
		preflightPrepared = await params.activateRuntimeSecrets(startupPreflightConfig, {
			reason: "startup",
			activate: false
		});
		return preflightPrepared.config;
	}, { omitErrorMessage: true });
	const activateStartupSecrets = async (config) => {
		if (preflightPrepared && isDeepStrictEqual(resolveGatewayStartupSourceConfig(config, process.env), preflightPrepared.sourceConfig)) return await params.activateRuntimeSecrets.activatePreparedSnapshot(preflightPrepared, {
			reason: "startup",
			activate: true
		});
		return await params.activateRuntimeSecrets(config, {
			reason: "startup",
			activate: true
		});
	};
	const preflightAuthOverride = await measure("config.auth.preflight-override", () => {
		const token = preflightConfig.gateway?.auth?.token;
		const password = preflightConfig.gateway?.auth?.password;
		const resolvedToken = typeof token === "string" && !hasUnresolvedConfigPath(preflightConfig, "gateway.auth.token");
		const resolvedPassword = typeof password === "string" && !hasUnresolvedConfigPath(preflightConfig, "gateway.auth.password");
		return resolvedToken || resolvedPassword ? {
			...params.authOverride,
			...resolvedToken ? { token } : {},
			...resolvedPassword ? { password } : {}
		} : params.authOverride;
	});
	const authBootstrap = await measure("config.auth.ensure", () => ensureGatewayStartupAuth({
		cfg: runtimeConfig,
		env: process.env,
		authOverride: preflightAuthOverride,
		tailscaleOverride: params.tailscaleOverride,
		warn: params.log?.warn
	}));
	const runtimeStartupConfig = await measure("config.auth.runtime-startup-overrides", () => applyGatewayAuthOverridesForStartupPreflight(authBootstrap.cfg, {
		auth: params.authOverride,
		tailscale: params.tailscaleOverride
	}));
	const activatedConfig = (await measure("config.auth.secrets-activate", () => activateStartupSecrets(runtimeStartupConfig), { omitErrorMessage: true })).config;
	const config = inheritLegacyDefaultAgentId(params.configSnapshot.config, activatedConfig);
	copyConfigResolutionFacts(activatedConfig, config);
	return {
		...authBootstrap,
		cfg: config
	};
}
//#endregion
export { applyGatewayAuthOverridesForStartupPreflight, createRuntimeSecretsActivator, loadGatewayStartupConfigSnapshot, prepareGatewayStartupConfig };
