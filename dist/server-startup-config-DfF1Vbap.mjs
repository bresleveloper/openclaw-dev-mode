import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { o as measureDiagnosticsTimelineSpan } from "./diagnostics-timeline-BgymzmGj.mjs";
import { o as prepareSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import { c as hasLegacyAuthProfileSourcesForStartup } from "./legacy-source-diagnostic-CLlkIevG.mjs";
import { m as getRuntimeAuthProfileStoreSnapshotsRevision } from "./runtime-snapshots-HRosak4u.mjs";
import { a as isProviderScopedSecretResolutionError, n as describeSecretResolutionOperatorDiagnostic, o as isSecretResolutionError, r as describeSecretResolutionOperatorRecovery } from "./resolve-errors-DYenvPyo.mjs";
import { a as classifySecretResolutionErrorDegradations, g as redactSecretDegradationReason, h as listSecretResolutionErrorOwners, l as formatSecretDegradationRetryHint, u as isRetryableSecretDegradationReason } from "./runtime-degraded-state-SptB0g_t.mjs";
import { c as getActiveSecretsRuntimeSnapshotRevisionState, d as graftActiveSecretsRuntimeAuthState, i as clearSecretsRuntimeSnapshotState, l as getActiveSecretsRuntimeSnapshotState, m as hasCurrentAuthStoreCredentialsRevision, n as activateSecretsRuntimeSnapshotState, p as hasActiveSecretsRuntimeSnapshotLineage, v as registerProviderAuthRuntimeSnapshotActivationOwner, w as hasSameSecretReloadContract } from "./runtime-state-DDDhACod.mjs";
import { t as resolveGatewayStartupSourceConfig } from "./server-startup-secret-surfaces-B3NAu0Tn.mjs";
import { t as listAuthProfileSecretOwnerIds } from "./runtime-auth-profile-owner-VtWriAt2.mjs";
import { a as prepareSecretsRuntimeFastPathSnapshot, n as collectCandidateAgentDirs } from "./runtime-fast-path-CARcjjAr.mjs";
import { a as logGatewayAuthSurfaceDiagnostics, i as loadGatewayStartupConfigSnapshot, n as assertRuntimeGatewayAuthNotKnownWeak, r as hasActiveGatewayAuthSecretRef, t as applyGatewayAuthOverridesForStartupPreflight } from "./server-startup-config-helpers-DQ2opCnD.mjs";
//#region src/secrets/runtime-provider-auth-scope.ts
/** Classifies degradation state owned by provider and auth-profile refreshes. */
function listProviderAuthDegradedOwners(snapshot) {
	const modelProviderOwnerIds = new Set(Object.keys(snapshot.sourceConfig.models?.providers ?? {}).map((providerId) => normalizeOptionalLowercaseString(providerId) ?? providerId));
	const authOwnerIds = listAuthProfileSecretOwnerIds(snapshot.authStores);
	return (snapshot.degradedOwners ?? []).filter((owner) => owner.ownerKind === "provider" && modelProviderOwnerIds.has(owner.ownerId) || owner.ownerKind === "account" && authOwnerIds.has(owner.ownerId));
}
/** Whether a config-source repair may recover without replacing active auth-store state. */
function preparedDegradationSupportsSourceOnlyRecovery(snapshot) {
	const degradedOwners = snapshot.degradedOwners ?? [];
	const authOwnerIds = listAuthProfileSecretOwnerIds(snapshot.authStores);
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
//#region src/gateway/server-startup-secret-diagnostics.ts
/** Aggregates redacted SecretRef degradation diagnostics at the Gateway activation boundary. */
function logSecretDegradation(log, degradation) {
	const reason = redactSecretDegradationReason(degradation.reason);
	const retryHint = formatSecretDegradationRetryHint(reason);
	log.warn(`[SECRETS_DEGRADED] ${degradation.state} ${degradation.kind}:${degradation.id}: ${reason}. Retry: ${retryHint}.`, {
		event: "secrets.degraded",
		ownerKind: degradation.kind,
		ownerId: degradation.id,
		reason,
		state: degradation.state,
		retryHint
	});
}
function logSecretProviderDegradation(log, providerFailure, degradations) {
	const reason = redactSecretDegradationReason(degradations[0]?.reason ?? "secret resolution failed");
	const retryHint = formatSecretDegradationRetryHint(reason);
	const affectedOwners = degradations.map(({ kind, id, state }) => ({
		ownerKind: kind,
		ownerId: id,
		state
	})).toSorted((left, right) => left.ownerKind.localeCompare(right.ownerKind) || left.ownerId.localeCompare(right.ownerId));
	const affectedOwnerSummary = affectedOwners.map((owner) => `${owner.state} ${owner.ownerKind}:${owner.ownerId}`).join(", ");
	log.warn(`[SECRETS_PROVIDER_DEGRADED] ${providerFailure.source}:${providerFailure.provider}: ${reason}. Affected owners: ${affectedOwnerSummary}. Retry: ${retryHint}.`, {
		event: "secrets.provider_degraded",
		source: providerFailure.source,
		provider: providerFailure.provider,
		reason,
		affectedOwners,
		retryHint
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
			retryHint: formatSecretDegradationRetryHint(owner.reason)
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
			let group = providerDegradations.get(key);
			if (!group) {
				group = {
					providerFailure,
					degradations: []
				};
				providerDegradations.set(key, group);
			}
			group.degradations.push({
				...degradation,
				reason: "secret provider failed"
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
//#region src/gateway/server-startup-config.ts
/** Create the serialized secrets activation function used by startup and reload paths. */
function createRuntimeSecretsActivator(params) {
	let degradationGeneration = 0;
	let degradation;
	const deferredStateTransitions = /* @__PURE__ */ new WeakMap();
	let pendingDeferredLineageRevision = null;
	let secretsActivationTail = Promise.resolve();
	const startupManifestRegistry = params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
	const runWithSecretsActivationLock = async (operation) => {
		const run = secretsActivationTail.then(operation, operation);
		secretsActivationTail = run.then(() => void 0, () => void 0);
		return await run;
	};
	const loadActivateRuntimeSecretsSnapshot = async (source) => {
		if (source) {
			const runtime = await import("./runtime-B_N0bpgX.mjs");
			return (snapshot) => runtime.activateSecretsRuntimeSnapshotWithSource(snapshot, source);
		}
		if (params.activateRuntimeSecretsSnapshot) return params.activateRuntimeSecretsSnapshot;
		return (await import("./runtime-B_N0bpgX.mjs")).activateSecretsRuntimeSnapshot;
	};
	const supersededActivation = /* @__PURE__ */ new Error("Secrets runtime publication was superseded.");
	const publishSnapshot = async (config, isCurrent, publish, checkpoint) => {
		await checkpoint?.();
		if (!isCurrent()) return false;
		let published = false;
		try {
			await params.beforeSnapshotPublication?.(config);
			await checkpoint?.();
			if (!isCurrent()) return false;
			publish();
			published = true;
			return true;
		} finally {
			if (!published) await params.beforeSnapshotPublication?.(getActiveSecretsRuntimeSnapshotState()?.config ?? null);
		}
	};
	const restoreSnapshot = async (isOwned, ...[snapshot, expectedRevision, ownedSnapshot, options]) => {
		const restoration = snapshot ? (await import("./runtime-B_N0bpgX.mjs")).prepareSecretsRuntimeSnapshotRestore(snapshot, expectedRevision, ownedSnapshot, options) : null;
		if (snapshot && !restoration) return false;
		return await publishSnapshot(restoration?.snapshot.config ?? null, () => isOwned() && getActiveSecretsRuntimeSnapshotRevisionState() === (restoration?.expectedRevision ?? expectedRevision) && (!restoration || hasCurrentAuthStoreCredentialsRevision(restoration.snapshot) && getRuntimeAuthProfileStoreSnapshotsRevision() === restoration.snapshot.authStoreSnapshotsRevision), () => {
			if (restoration) activateSecretsRuntimeSnapshotState(restoration);
			else clearSecretsRuntimeSnapshotState();
			options?.onActivated?.();
		});
	};
	const publishRecovery = (config, expectedGeneration, scope = "full") => {
		if (!degradation || expectedGeneration !== void 0 && degradation.generation !== expectedGeneration || scope === "provider-auth" && degradation.scope !== "provider-auth") return;
		const recoveredMessage = "Secret resolution recovered.";
		params.logSecrets.info(`[SECRETS_RELOADER_RECOVERED] ${recoveredMessage}`);
		params.emitStateEvent("SECRETS_RELOADER_RECOVERED", recoveredMessage, config);
		degradation = void 0;
	};
	const recordDegradation = (config, supportsSourceOnlyRecovery, scope) => {
		degradation = {
			generation: ++degradationGeneration,
			config: structuredClone(config),
			supportsSourceOnlyRecovery: (degradation?.supportsSourceOnlyRecovery ?? true) && supportsSourceOnlyRecovery,
			scope
		};
	};
	const publishDegradation = (prepared, reason, scope = "full", activationScope = "full") => {
		logPreparedSecretDegradations(params.logSecrets, prepared.degradedOwners ?? []);
		if (reason === "startup") return;
		if (activationScope === "provider-auth" && degradation?.scope === "full") return;
		if (!degradation) params.emitStateEvent("SECRETS_RELOADER_DEGRADED", "Secret resolution degraded one or more owners; healthy owners were refreshed.", prepared.config);
		recordDegradation(prepared.sourceConfig, preparedDegradationSupportsSourceOnlyRecovery(prepared), scope);
	};
	const finishPreparedSnapshot = async (prepared, activationParams, options) => {
		assertRuntimeGatewayAuthNotKnownWeak(prepared.config);
		if (activationParams.activate && !options?.alreadyActivated) {
			const activateRuntimeSecretsSnapshot = options?.activateRuntimeSecretsSnapshot ?? await loadActivateRuntimeSecretsSnapshot(activationParams.runtimeSourceConfig);
			const revision = getActiveSecretsRuntimeSnapshotRevisionState();
			if (!await publishSnapshot(prepared.config, () => getActiveSecretsRuntimeSnapshotRevisionState() === revision && hasCurrentAuthStoreCredentialsRevision(prepared) && (options?.canActivate?.() ?? true), () => {
				activateRuntimeSecretsSnapshot(prepared);
				options?.onActivated?.();
			}, options?.checkpoint)) throw supersededActivation;
		}
		if (activationParams.activate) logGatewayAuthSurfaceDiagnostics(prepared, params.logSecrets);
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
		if (activationParams.activate) {
			const transition = (statePrepared.degradedOwners?.length ?? 0) > 0 ? { kind: "degraded" } : degradation ? {
				kind: "recovered",
				degradationGeneration: degradation.generation
			} : void 0;
			if (transition && activationParams.deferStatePublication === true) {
				const activationRevision = getActiveSecretsRuntimeSnapshotRevisionState();
				deferredStateTransitions.set(prepared, {
					...transition,
					activationRevision,
					reason: activationParams.reason,
					activationScope
				});
				pendingDeferredLineageRevision = activationRevision;
			} else if (transition?.kind === "degraded") publishDegradation(statePrepared, activationParams.reason, stateScope, activationScope);
			else if (transition) publishRecovery(prepared.config, void 0, stateScope);
		}
		return prepared;
	};
	const handleSecretsActivationError = (err, activationParams, eventConfig) => {
		const mayPublishReloadDegradation = (activationParams.activate || activationParams.publishFailureAsDegraded === true) && (activationParams.canPublishFailureAsDegraded?.() ?? true);
		const degradations = classifySecretResolutionErrorDegradations(err);
		const retryableDegradations = degradations.filter((entry) => isRetryableSecretDegradationReason(entry.reason));
		if (retryableDegradations.length > 0 && (activationParams.reason === "startup" || mayPublishReloadDegradation)) {
			logThrownSecretDegradations(params.logSecrets, err, retryableDegradations);
			if (activationParams.reason !== "startup") {
				if (!degradation) params.emitStateEvent("SECRETS_RELOADER_DEGRADED", "Secret resolution failed; runtime remains on the last-known-good snapshot.", eventConfig);
				const failedOwners = listSecretResolutionErrorOwners(err).filter((owner) => owner.failureMatched);
				const currentFailureSupportsSourceOnlyRecovery = failedOwners.length > 0 && failedOwners.every((owner) => owner.source === "config" && owner.degradationState === "cold");
				recordDegradation(eventConfig, currentFailureSupportsSourceOnlyRecovery, "full");
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
			await prepareSharedAuthStoreOwnership(activationParams.env);
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
					runtimeSourceConfig: activationParams.runtimeSourceConfig,
					refreshContext: fastPath.refreshContext,
					refreshHandler: {
						preflight: async (refreshParams) => await (await import("./runtime-B_N0bpgX.mjs")).preflightActiveSecretsRuntimeSnapshotRefresh(refreshParams),
						refresh: async (refreshParams) => await (await import("./runtime-B_N0bpgX.mjs")).refreshActiveSecretsRuntimeSnapshotForConfig(refreshParams)
					}
				}) });
			}
			const loadAuthStore = startupPreflight ? (await import("./auth-profiles-Ci7Cc0l7.mjs")).loadAuthProfileStoreWithoutExternalProfilesAsync : void 0;
			const secretsRuntime = params.prepareRuntimeSecretsSnapshot && params.activateRuntimeSecretsSnapshot ? null : await import("./runtime-B_N0bpgX.mjs");
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
		return await runWithSecretsActivationLock(async () => {
			await checkpoint?.();
			if (getActiveSecretsRuntimeSnapshotRevisionState() !== expectedRevision || !hasCurrentAuthStoreCredentialsRevision(snapshot) || canActivate && !canActivate()) return null;
			let activated;
			let publication;
			let callbackOpen = true;
			try {
				activated = await finishPreparedSnapshot(snapshot, activationParams, {
					checkpoint,
					canActivate: () => getActiveSecretsRuntimeSnapshotRevisionState() === expectedRevision && (canActivate?.() ?? true),
					onActivated: onActivated ? () => {
						publication = Promise.resolve(onActivated((...args) => restoreSnapshot(() => callbackOpen, ...args)));
					} : void 0
				});
			} catch (err) {
				callbackOpen = false;
				if (err === supersededActivation) return null;
				return handleSecretsActivationError(err, activationParams, snapshot.sourceConfig);
			}
			try {
				await publication;
				return activated;
			} finally {
				callbackOpen = false;
			}
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
			const currentDegradation = degradation;
			if (activeSnapshot !== null && currentDegradation?.supportsSourceOnlyRecovery && !hasSameSecretReloadContract(currentDegradation.config, activeSnapshot.sourceConfig)) {
				if ((activeSnapshot.degradedOwners?.length ?? 0) > 0) {
					const activeScope = resolvePreparedSecretsStateScope(activeSnapshot);
					publishDegradation(activeSnapshot, "reload", activeScope);
				} else publishRecovery(activeSnapshot.config, currentDegradation.generation);
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
		if (options?.sourceOnly === true && (!degradation?.supportsSourceOnlyRecovery || hasSameSecretReloadContract(degradation.config, activeSnapshot.sourceConfig))) return;
		const generation = transition.kind === "recovered" ? transition.degradationGeneration : void 0;
		publishRecovery(activeSnapshot.config, generation, transition.activationScope);
	};
	return Object.assign(prepareRuntimeSecrets, {
		activatePreparedSnapshot,
		activatePreparedSnapshotIfCurrent,
		restoreSnapshotIfCurrent: (...args) => runWithSecretsActivationLock(() => restoreSnapshot(() => true, ...args)),
		publishStateTransition
	});
}
//#endregion
export { applyGatewayAuthOverridesForStartupPreflight, createRuntimeSecretsActivator, loadGatewayStartupConfigSnapshot };
