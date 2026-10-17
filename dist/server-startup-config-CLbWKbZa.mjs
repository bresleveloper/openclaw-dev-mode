import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { o as measureDiagnosticsTimelineSpan } from "./diagnostics-timeline-DxQ8TaVy.mjs";
import { t as listAuthProfileSecretOwnerIds } from "./runtime-auth-profile-owner-lkATIqd6.mjs";
import { a as isProviderScopedSecretResolutionError, n as describeSecretResolutionOperatorDiagnostic, o as isSecretResolutionError, r as describeSecretResolutionOperatorRecovery } from "./resolve-errors-DYenvPyo.mjs";
import { a as classifySecretResolutionErrorDegradations, h as redactSecretDegradationReason, l as isRetryableSecretDegradationReason, m as listSecretResolutionErrorOwners, t as SECRET_DEGRADATION_RETRY_HINT } from "./runtime-degraded-state-oevwKU3u.mjs";
import { m as getRuntimeAuthProfileStoreSnapshotsRevision } from "./runtime-snapshots-CSLjByUx.mjs";
import { c as hasLegacyAuthProfileSourcesForStartup } from "./legacy-source-diagnostic-Bj7ByR_x.mjs";
import { f as graftActiveSecretsRuntimeAuthState, g as hasSameSecretReloadContract, i as clearSecretsRuntimeSnapshotState, l as getActiveSecretsRuntimeSnapshotRevisionState, m as hasCurrentAuthStoreCredentialsRevision, n as activateSecretsRuntimeSnapshotState, p as hasActiveSecretsRuntimeSnapshotLineage, u as getActiveSecretsRuntimeSnapshotState, v as registerProviderAuthRuntimeSnapshotActivationOwner } from "./runtime-state-D5wZ6Dom.mjs";
import { a as prepareSecretsRuntimeFastPathSnapshot, n as collectCandidateAgentDirs } from "./runtime-fast-path-D9Z1k-Pw.mjs";
import { a as logGatewayAuthSurfaceDiagnostics, i as loadGatewayStartupConfigSnapshot, n as assertRuntimeGatewayAuthNotKnownWeak, r as hasActiveGatewayAuthSecretRef, s as resolveGatewayStartupSourceConfig, t as applyGatewayAuthOverridesForStartupPreflight } from "./server-startup-config-helpers-BNJcXPlK.mjs";
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
	const loadSecretsRuntime = createLazyPromise(() => import("./runtime-Bhd5Dlbh.mjs"), { cacheRejections: true });
	const loadAuthProfiles = createLazyPromise(() => import("./auth-profiles-Dmn1qebk.mjs"), { cacheRejections: true });
	const startupManifestRegistry = params.manifestRegistry ?? params.pluginMetadataSnapshot?.manifestRegistry;
	const runWithSecretsActivationLock = async (operation) => {
		const run = secretsActivationTail.then(operation, operation);
		secretsActivationTail = run.then(() => void 0, () => void 0);
		return await run;
	};
	const loadActivateRuntimeSecretsSnapshot = async (source) => {
		if (source) {
			const runtime = await loadSecretsRuntime();
			return (snapshot) => runtime.activateSecretsRuntimeSnapshotWithSource(snapshot, source);
		}
		if (params.activateRuntimeSecretsSnapshot) return params.activateRuntimeSecretsSnapshot;
		return (await loadSecretsRuntime()).activateSecretsRuntimeSnapshot;
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
		const restoration = snapshot ? (await loadSecretsRuntime()).prepareSecretsRuntimeSnapshotRestore(snapshot, expectedRevision, ownedSnapshot, options) : null;
		if (snapshot && !restoration) return false;
		return await publishSnapshot(restoration?.snapshot.config ?? null, () => isOwned() && getActiveSecretsRuntimeSnapshotRevisionState() === (restoration?.expectedRevision ?? expectedRevision) && (!restoration || hasCurrentAuthStoreCredentialsRevision(restoration.snapshot) && getRuntimeAuthProfileStoreSnapshotsRevision() === restoration.snapshot.authStoreSnapshotsRevision), () => {
			if (restoration) activateSecretsRuntimeSnapshotState(restoration);
			else clearSecretsRuntimeSnapshotState();
			options?.onActivated?.();
		});
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
		restoreSnapshotIfCurrent: (...args) => runWithSecretsActivationLock(() => restoreSnapshot(() => true, ...args)),
		publishStateTransition
	});
}
//#endregion
export { applyGatewayAuthOverridesForStartupPreflight, createRuntimeSecretsActivator, loadGatewayStartupConfigSnapshot };
