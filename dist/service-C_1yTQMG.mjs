import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CZ2wJvNB.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { o as WorkerSessionAlreadyAttachedError } from "./openclaw-state-worker-error-DLFiBmPG.mjs";
import { t as parseDurationMs } from "./parse-duration-DBWI377R.mjs";
import { c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { i as validateCloudWorkerProfileSettings } from "./zod-schema.cloud-workers-Bwo2REFq.mjs";
import { B as WorkerSessionsSendParamsSchema, F as WorkerPortalParamsSchema, H as WorkerSessionsSpawnParamsSchema, tt as WorkerComputerResultSchema } from "./worker-admission-BB3C4gz4.mjs";
import "./worker-protocol-primitives-vA8IesMt.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { vn as WorkerMachineOptionsSchema, yn as WorkerOperatingSystemSchema } from "./agents-models-skills-ChHh3UoN.mjs";
import { _ as validateWorkerInferenceTerminalOutcome, a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, g as validateWorkerInferenceTerminalFrame, m as validateWorkerInferenceEventFrame } from "./worker-inference-m2fwUhbe.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-CHv_0noy.mjs";
import { m as listAgentRunsForSession, p as hasLiveAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-DdRNB2jf.mjs";
import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-CGngP_UC.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-CtZtwiOt.mjs";
import { t as WorkerProviderError } from "./capability-provider.types-BsBg4rOj.mjs";
import { l as ScreenSnapshotParamsSchema, o as ComputerActParamsSchema } from "./computer-use-contract-DzawlQtp.mjs";
import { o as matchesAgentLifecycleBinding, r as captureAgentLifecycleBinding } from "./agent-lifecycle-registry-D47RUurT.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-DiXxneBV.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-BFzDgQIL.mjs";
import { t as FORCED_WORKER_ABANDONMENT_ERROR, v as sameWorkerSessionTurnClaim, y as serializeWorkerSessionTurnClaim } from "./placement-record-CB6gcJKw.mjs";
import { u as resolveGitRepositoryPaths } from "./git-DSwuA7YL.mjs";
import { r as formatWorkerInferenceError, t as boundedWorkerError } from "./worker-error-Bd42UcqN.mjs";
import { t as acknowledgeWorkerTurnFinishing } from "./placement-turn-claim-events-D2oaSWT4.mjs";
import { p as normalizeWorkerSshEndpoint } from "./store-native-publication-DNMm5oc5.mjs";
import { n as workerBootstrapOperationTimeoutMs } from "./bootstrap-DH_A9h5r.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { N as GitHubIdentityError, c as prepareGitHubReadIdentity, p as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-BOF32-1s.mjs";
import { i as WorkerSkillWorkshopParamsSchema } from "./worker-skill-workshop-CtIZXAKM.mjs";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-BhQVI4mm.mjs";
import { t as NodeWorkerComputerCloseParamsSchema } from "./node-computer-protocol-DyPyYkCS.mjs";
import { n as gitHubPublicApi } from "./github-public-api-GYcLjPMx.mjs";
import { r as workerLocalProjectKey, t as prepareWorkerProjectSnapshot } from "./workspace-git-base-DcOK2Mxs.mjs";
import { i as registerWorkerInferenceSessionControl, t as WorkerInferenceSessionDrainBusyError } from "./inference-control-internal-Dk-ZtYoJ.mjs";
import { t as parseProjectGitUrl } from "./project-git-url-D2byNTeD.mjs";
import { i as joinWorkerTunnelStops, r as WorkerTunnelOwnerDisconnectedError } from "./tunnel-contract-C4XjTxW-.mjs";
import { a as validateWorkerConnectionIdentity, c as createWorkerCredentialMaterial, l as hashWorkerCredential, n as StaleWorkerBuildError, o as verifyWorkerAdmissionHandshake, r as admitWorkerConnection } from "./admission-BzZXJ5YD.mjs";
import { n as readWorkerProjectPreparation, t as createWorkerProjectPreparationIdentity } from "./preparation-identity-B9ncl7Bw.mjs";
import { a as WorkerRuntimeRefreshPendingError, c as deriveEnvironmentIntent, i as readRepositoryWorkerProjectSnapshot, n as readWorkerProjectSetupRecipe, o as createWorkerRuntimeRefresher, r as readWorkerProjectSnapshot, t as createWorkerProjectPreparation } from "./project-preparation-BjFR8zqw.mjs";
import { t as normalizeWorkerDesktopEndpoint } from "./desktop-endpoint-B88FUkSW.mjs";
import "./store-7NDKEHL0.mjs";
import { n as serializeWorkerSessionToolResult, r as workerSessionToolErrorResult } from "./worker-session-tool-result-D8qI5EJp.mjs";
import { isDeepStrictEqual } from "node:util";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { Value } from "typebox/value";
//#region src/gateway/worker-environments/service-validation.ts
function requireWorkerProfile(value, serviceError) {
	const error = validateCloudWorkerProfileSettings(value);
	if (error) throw serviceError("invalid_profile", error);
	return value;
}
function requireInheritedWorkerProfileAuthorization(profileId, providerId, settings, configuredProviderId, serviceError) {
	if (providerId === "device" && isRecord(settings) && typeof settings.device === "string" && profileId === `device:${settings.device}`) return;
	if (!configuredProviderId) throw serviceError("profile_not_found", `Unknown worker profile: ${profileId}`);
	if (normalizeCapabilityProviderId(configuredProviderId) !== providerId) throw serviceError("invalid_profile", "Inherited worker provider identity changed");
}
function requireProviderOperationTimeoutMs(operation, timeoutMs) {
	if (timeoutMs === void 0) return;
	if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2147e6) throw new Error(`Worker provider ${operation} timeout must be an integer from 1 through ${MAX_TIMER_TIMEOUT_MS}ms`);
	return timeoutMs;
}
function isWorkerMachineOptions(value) {
	return Value.Check(WorkerMachineOptionsSchema, value);
}
function normalizeWorkerMachineOptions(value) {
	if (!isWorkerMachineOptions(value)) return;
	const ids = /* @__PURE__ */ new Set();
	const defaultSystems = /* @__PURE__ */ new Set();
	for (const option of value) {
		const key = JSON.stringify([option.os, option.id]);
		if (option.id.trim() !== option.id || option.label.trim() !== option.label || option.os !== void 0 && option.os.trim() !== option.os || ids.has(key) || option.default === true && defaultSystems.has(option.os)) return;
		ids.add(key);
		if (option.default === true) defaultSystems.add(option.os);
	}
	return value.map((option) => ({
		id: option.id,
		label: option.label,
		...option.os === void 0 ? {} : { os: option.os },
		...option.cpu === void 0 ? {} : { cpu: option.cpu },
		...option.memoryGb === void 0 ? {} : { memoryGb: option.memoryGb },
		...option.default === void 0 ? {} : { default: option.default }
	}));
}
function normalizeWorkerOperatingSystems(value) {
	if (!Array.isArray(value) || value.length < 1 || value.length > 8) return;
	const systems = [];
	const ids = /* @__PURE__ */ new Set();
	let hasDefault = false;
	for (const option of value) {
		if (!Value.Check(WorkerOperatingSystemSchema, option) || option.id.trim() !== option.id || option.label.trim() !== option.label || option.disabledReason !== void 0 && option.disabledReason.trim() !== option.disabledReason || ids.has(option.id) || option.default === true && hasDefault) return;
		ids.add(option.id);
		hasDefault ||= option.default === true;
		systems.push({
			id: option.id,
			label: option.label,
			...option.default === void 0 ? {} : { default: option.default },
			...option.disabledReason === void 0 ? {} : { disabledReason: option.disabledReason }
		});
	}
	return systems;
}
function requireWorkerLeaseStatus(value) {
	if (!isRecord(value)) throw new Error("Worker provider returned an invalid inspection result");
	const status = value.status;
	if (status !== "active" && status !== "dormant" && status !== "destroyed" && status !== "unknown") throw new Error("Worker provider returned an invalid inspection status");
	if (status === "active") {
		if (value.sharedHost !== void 0 && typeof value.sharedHost !== "boolean") throw new Error("Worker provider returned an invalid inspection result");
		return {
			status,
			sharedHost: value.sharedHost === true
		};
	}
	if (value.sharedHost !== void 0) throw new Error("Worker provider returned an invalid inspection result");
	return { status };
}
function resolveWorkerLeaseTransportError(provider, transport, executionMode) {
	const modes = provider.supportedExecutionModes;
	if (executionMode !== void 0 && executionMode !== "worker-turn" && executionMode !== "remote-exec") return new WorkerProviderError("Worker environment has an invalid placement execution mode");
	if (transport === "ssh" && (executionMode === "worker-turn" || modes !== void 0 && !modes.includes("remote-exec"))) return new WorkerProviderError("worker-turn providers must return a node lease");
	if (executionMode !== void 0 && !modes?.includes(executionMode)) return new WorkerProviderError(`Worker provider ${provider.id} does not advertise ${executionMode} for its ${transport} lease`);
}
function requireWorkerAllocation(value) {
	if (!isRecord(value) || typeof value.leaseId !== "string" || !value.leaseId.trim() || typeof value.sharedHost !== "boolean") throw new Error("Worker provider returned an invalid allocation identity");
	return {
		leaseId: value.leaseId.trim(),
		sharedHost: value.sharedHost
	};
}
function requireWorkerLease(value) {
	const hasSsh = isRecord(value) && Object.hasOwn(value, "ssh");
	const hasNode = isRecord(value) && Object.hasOwn(value, "node");
	if (!isRecord(value) || typeof value.leaseId !== "string" || !value.leaseId.trim() || hasSsh === hasNode || hasSsh && !isRecord(value.ssh) || hasNode && !isRecord(value.node) || value.sharedHost !== void 0 && typeof value.sharedHost !== "boolean") throw new Error("Worker provider returned an invalid provision result");
	const common = {
		leaseId: value.leaseId.trim(),
		...value.sharedHost === void 0 ? {} : { sharedHost: value.sharedHost },
		...value.desktop === void 0 ? {} : { desktop: normalizeWorkerDesktopEndpoint(value.desktop) }
	};
	if (hasSsh) return {
		...common,
		ssh: normalizeWorkerSshEndpoint(value.ssh)
	};
	const deviceId = value.node.deviceId;
	if (typeof deviceId !== "string" || !deviceId.trim()) throw new Error("Worker provider returned an invalid node device id");
	return {
		...common,
		node: { deviceId: deviceId.trim() }
	};
}
//#endregion
//#region src/gateway/worker-environments/build-preparation.ts
function createWorkerEnvironmentBuildPreparation(options) {
	return async (request, authorize) => {
		const { signal, providerLifecycle, now, store, serviceError, configuredProfileProviderId, requireProviderExecutionMode, schedulePreparedRefill } = options;
		signal.throwIfAborted();
		authorize?.();
		const { profileId, projectPath } = request;
		const providerId = configuredProfileProviderId(profileId);
		const provider = options.resolveProvider(normalizeCapabilityProviderId(providerId) ?? providerId);
		const profile = options.getConfig().cloudWorkers.profiles[profileId];
		if (!provider?.supportsProjectPreparation?.(requireWorkerProfile(profile.settings ?? {}, serviceError))) throw serviceError("invalid_profile", "Worker profile does not support project preparation");
		const namespace = options.projectNamespace;
		if (!namespace) throw serviceError("invalid_state", "Worker project preparation namespace is unavailable");
		let project;
		try {
			if (!projectPath.trim()) throw new Error("Empty project path");
			project = await prepareWorkerProjectSnapshot({
				localPath: projectPath,
				namespace,
				signal
			});
		} catch {
			signal.throwIfAborted();
		}
		if (!project) throw serviceError("invalid_project", "Project must be an accessible local Git checkout root with a HEAD commit");
		authorize?.();
		const executionMode = provider.supportedExecutionModes?.includes("worker-turn") ? "worker-turn" : "remote-exec";
		const intent = await providerLifecycle.prepareIntent(profileId, {
			projectPath: project.root,
			projectCommit: project.baseCommit,
			executionMode,
			setupAuthorized: true,
			signal
		});
		signal.throwIfAborted();
		authorize?.();
		providerLifecycle.assertPreparedIntentCurrent(profileId, intent);
		requireProviderExecutionMode(intent.providerId, executionMode);
		const timeout = providerLifecycle.providerFor(intent.providerId).resolvePreparedIdleTimeoutMs?.(requireWorkerProfile(intent.profileSnapshot.settings, serviceError));
		if (!intent.preparationKey || !Number.isSafeInteger(timeout) || !timeout || timeout <= 0) throw serviceError("invalid_profile", "Worker profile does not support prepared workers with an idle timeout");
		const demandAtMs = now();
		const identity = deriveEnvironmentIntent(`prepared:${randomUUID()}`);
		const record = await store.ensurePreparedIntent({
			intent: {
				...identity,
				providerId: intent.providerId,
				profileId,
				profileSnapshot: intent.profileSnapshot,
				preparation: {
					purpose: "build",
					key: intent.preparationKey,
					demandAtMs,
					expiresAtMs: demandAtMs + timeout
				}
			},
			projectKey: project.key,
			target: profile.readyWorkers ?? 1,
			maxTotal: options.getConfig().cloudWorkers?.preparedPool?.maxTotal ?? 4,
			assertCurrent: () => {
				signal.throwIfAborted();
				authorize?.();
				providerLifecycle.assertPreparedIntentCurrent(profileId, intent);
			}
		});
		if (!record) throw serviceError("capacity", "Prepared worker pool is full; destroy an unused worker or wait for cleanup, then retry");
		schedulePreparedRefill();
		return {
			environmentId: record.environmentId,
			preparationKey: intent.preparationKey,
			reused: record.environmentId !== identity.environmentId
		};
	};
}
//#endregion
//#region src/gateway/worker-environments/credential-broker.ts
function createWorkerCredentialBroker(options) {
	const { store } = options;
	const tunnels = options.tunnelManager;
	const now = options.now;
	const inference = { cancelEnvironment: options.cancelInferenceEnvironment };
	const inState = options.inState;
	const move = options.move;
	const serviceError = options.serviceError;
	const withLock = options.withLock;
	const pendingCredentials = /* @__PURE__ */ new Map();
	const credentialExpiry = () => {
		const ttlMs = options.workerCredentialTtlMs ?? 6e5;
		if (!Number.isSafeInteger(ttlMs) || ttlMs < 1) throw serviceError("invalid_state", "Worker credential lifetime is invalid");
		const expiresAtMs = now() + ttlMs;
		if (!Number.isSafeInteger(expiresAtMs)) throw serviceError("invalid_state", "Worker credential expiry is out of range");
		return expiresAtMs;
	};
	const credentialMaterial = (claim) => createWorkerCredentialMaterial(options.generateWorkerCredential, claim);
	const grantFrom = (params) => {
		const record = params.record;
		if (!record) throw serviceError("invalid_state", "Worker credential persistence failed");
		return {
			credential: params.credential,
			deliveryId: record.credentialHash,
			environmentId: record.environmentId,
			bundleHash: record.bundleHash,
			sessionId: record.sessionId,
			rpcSetVersion: record.rpcSetVersion,
			ownerEpoch: record.ownerEpoch,
			expiresAtMs: record.expiresAtMs,
			...params.claim ? { turnClaim: params.claim } : {}
		};
	};
	const mintCredentialLocked = async (request, claim) => {
		if (store.getCredential(request.environmentId)) inference.cancelEnvironment(request.environmentId);
		const material = credentialMaterial(claim);
		const credential = {
			environmentId: request.environmentId,
			expectedOwnerEpoch: request.ownerEpoch,
			credentialHash: material.credentialHash,
			sessionId: request.sessionId,
			rpcSetVersion: 1,
			expiresAtMs: credentialExpiry(),
			...claim ? { assertCurrent: () => {
				if (!validateTurnClaim(claim)) throw serviceError("invalid_state", "Worker turn credential claim is not authoritative");
			} } : {}
		};
		const record = await store.renewCredential(credential);
		credential.assertCurrent?.();
		return {
			credentialHash: material.credentialHash,
			grant: grantFrom({
				credential: material.credential,
				record,
				claim
			})
		};
	};
	const stageCredential = (grant) => {
		pendingCredentials.set(grant.environmentId, grant);
		return grant;
	};
	const commitReady = async (record, receipt, patch = {}, assertCurrent) => {
		const material = credentialMaterial();
		const ready = await move(record, "ready", {
			...patch,
			bootstrapReceipt: receipt,
			credential: {
				credentialHash: material.credentialHash,
				sessionId: null,
				rpcSetVersion: 1,
				expiresAtMs: credentialExpiry()
			}
		}, assertCurrent);
		stageCredential(grantFrom({
			credential: material.credential,
			record: store.getCredential(record.environmentId)
		}));
		return ready;
	};
	const ensurePendingCredential = async (record, sessionId) => {
		await store.ready();
		const credential = store.getCredential(record.environmentId);
		const pending = pendingCredentials.get(record.environmentId);
		const turnClaim = sessionId === null ? void 0 : options.placementStore?.readWorkerTurnClaim({
			sessionId,
			environmentId: record.environmentId,
			ownerEpoch: record.ownerEpoch
		});
		const credentialHasDurableTurn = credential?.deliveredAtMs !== null && credential?.ownerEpoch === record.ownerEpoch && credential.sessionId === sessionId && sessionId !== null && turnClaim !== void 0 && options.placementStore?.validateWorkerTurn(turnClaim) === true;
		const credentialIsCurrent = credential?.ownerEpoch === record.ownerEpoch && credential.sessionId === sessionId && (credential.expiresAtMs > now() || credentialHasDurableTurn);
		const pendingIsCurrent = credentialIsCurrent && pending?.deliveryId === credential.credentialHash && pending.ownerEpoch === record.ownerEpoch && pending.sessionId === sessionId;
		if (credentialIsCurrent && credential.deliveredAtMs !== null) {
			pendingCredentials.delete(record.environmentId);
			return;
		}
		if (pendingIsCurrent) return;
		pendingCredentials.delete(record.environmentId);
		const minted = await mintCredentialLocked({
			environmentId: record.environmentId,
			ownerEpoch: record.ownerEpoch,
			sessionId
		});
		stageCredential(minted.grant);
		if (sessionId && credential?.ownerEpoch === record.ownerEpoch) options.liveEvents?.rotateCredential({
			credentialHash: minted.credentialHash,
			environmentId: record.environmentId,
			previousCredentialHash: credential.credentialHash,
			runEpoch: record.ownerEpoch,
			sessionId
		});
	};
	const attachSession = async (request) => {
		let stopping = options.isStopping();
		if (stopping) throw serviceError("invalid_state", "Worker environment service is stopping");
		return withLock(request.environmentId, async () => {
			await store.ready();
			stopping = options.isStopping();
			if (stopping) throw serviceError("invalid_state", "Worker environment service is stopping");
			const current = store.get(request.environmentId);
			if (!current) throw serviceError("environment_not_found", `Unknown worker environment: ${request.environmentId}`);
			if (current.state !== "ready" && current.state !== "idle") throw serviceError("invalid_state", `Cannot attach worker in state: ${current.state}`);
			let currentBuild;
			try {
				currentBuild = await options.prepareInstallation("bundle");
			} catch {
				throw serviceError("invalid_state", "Current worker build identity is unavailable");
			}
			if (!current.bootstrapReceipt || !verifyWorkerAdmissionHandshake(current.bootstrapReceipt, currentBuild)) throw new StaleWorkerBuildError();
			const material = credentialMaterial();
			let attached;
			try {
				attached = await store.transition({
					environmentId: request.environmentId,
					from: current.state,
					to: "attached",
					expectedOwnerEpoch: request.ownerEpoch,
					placementBinding: request.placementBinding,
					patch: {
						attachedSessionIds: [request.sessionId],
						credential: {
							credentialHash: material.credentialHash,
							sessionId: request.sessionId,
							rpcSetVersion: 1,
							expiresAtMs: credentialExpiry()
						}
					}
				});
			} catch (error) {
				if (error instanceof WorkerSessionAlreadyAttachedError) throw serviceError("invalid_state", error.message);
				throw error;
			}
			if (options.liveEvents) {
				let liveSessionBound;
				try {
					liveSessionBound = options.liveEvents.bindSession({
						environmentId: attached.environmentId,
						runEpoch: attached.ownerEpoch,
						sessionId: request.sessionId
					});
				} catch {
					liveSessionBound = false;
				}
				if (!liveSessionBound) {
					await move(attached, "idle");
					await tunnels?.stop(request.environmentId, current.ownerEpoch).catch(() => void 0);
					throw serviceError("invalid_state", "Attached session target is unavailable");
				}
			}
			pendingCredentials.delete(request.environmentId);
			await tunnels?.stop(request.environmentId, current.ownerEpoch);
			return stageCredential(grantFrom({
				credential: material.credential,
				record: store.getCredential(request.environmentId)
			}));
		});
	};
	const readPendingCredential = (binding, claim) => {
		if (options.isStopping()) return;
		const grant = pendingCredentials.get(binding.environmentId);
		if (!grant || grant.ownerEpoch !== binding.ownerEpoch || grant.sessionId !== binding.sessionId) return;
		const environment = store.get(binding.environmentId);
		const credential = store.getCredential(binding.environmentId);
		const credentialHash = grant.deliveryId;
		const checkedAtMs = now();
		if (!environment || !inState(environment, "ready", "idle", "attached") || environment.destroyRequestedAtMs !== null || environment.ownerEpoch !== binding.ownerEpoch || !credential || credential.credentialHash !== credentialHash || credential.ownerEpoch !== binding.ownerEpoch || credential.sessionId !== binding.sessionId || credential.deliveredAtMs !== null || credential.expiresAtMs <= checkedAtMs || grant.turnClaim === void 0 !== (claim === void 0) || claim !== void 0 && hashWorkerCredential(grant.credential, claim) !== credentialHash) return;
		return {
			checkedAtMs,
			credentialHash,
			grant
		};
	};
	const bindingForClaim = (claim) => {
		if (claim.owner.kind !== "worker") throw serviceError("invalid_state", "Worker turn credential claim is not worker-owned");
		return {
			environmentId: claim.owner.environmentId,
			ownerEpoch: claim.owner.ownerEpoch,
			sessionId: claim.sessionId
		};
	};
	const validateTurnClaim = (claim) => claim.owner.kind === "worker" && options.placementStore?.validateWorkerTurn(claim) === true;
	const acquireTurnCredential = (claim) => {
		const binding = bindingForClaim(claim);
		return withLock(binding.environmentId, async () => {
			await store.ready();
			const placementStore = options.placementStore;
			if (!placementStore || !validateTurnClaim(claim)) throw serviceError("invalid_state", "Worker turn credential claim is not authoritative");
			const pending = readPendingCredential(binding, claim)?.grant;
			if (pending) return pending;
			const environment = store.get(binding.environmentId);
			if (!environment || environment.state !== "attached" || environment.ownerEpoch !== binding.ownerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== binding.sessionId) throw serviceError("invalid_state", "Worker session credential owner is not attached");
			const previous = store.getCredential(binding.environmentId);
			const ackedSeq = previous?.sessionId === binding.sessionId ? placementStore.readWorkerTurnLiveAckCursor(claim) : void 0;
			const minted = await mintCredentialLocked(binding, claim);
			const grant = stageCredential(minted.grant);
			if (previous && ackedSeq !== void 0) options.liveEvents?.rotateCredential({
				ackedSeq,
				credentialHash: minted.credentialHash,
				environmentId: binding.environmentId,
				newProcessTurn: true,
				previousCredentialHash: previous.credentialHash,
				runEpoch: binding.ownerEpoch,
				sessionId: binding.sessionId
			});
			return grant;
		});
	};
	const acknowledgeCredentialDelivery = async (grant) => {
		await store.ready();
		if (grant.turnClaim && !validateTurnClaim(grant.turnClaim)) return false;
		const pending = readPendingCredential(grant, grant.turnClaim);
		if (!pending || pending.grant.deliveryId !== grant.deliveryId) return false;
		await store.markCredentialDelivered({
			environmentId: grant.environmentId,
			ownerEpoch: grant.ownerEpoch,
			sessionId: grant.sessionId,
			credentialHash: pending.credentialHash,
			deliveredAtMs: pending.checkedAtMs,
			...grant.turnClaim ? { assertCurrent: () => {
				if (!validateTurnClaim(grant.turnClaim)) throw serviceError("invalid_state", "Worker turn credential claim is not authoritative");
			} } : {}
		});
		if (pendingCredentials.get(grant.environmentId)?.deliveryId === grant.deliveryId) pendingCredentials.delete(grant.environmentId);
		return !grant.turnClaim || validateTurnClaim(grant.turnClaim);
	};
	return {
		acknowledgeCredentialDelivery,
		acquireTurnCredential,
		attachSession,
		clear: () => pendingCredentials.clear(),
		clearEnvironment: (environmentId) => pendingCredentials.delete(environmentId),
		commitReady,
		ensurePendingCredential,
		takeMintedCredential: (binding) => readPendingCredential(binding)?.grant
	};
}
//#endregion
//#region src/gateway/worker-environments/repository-project-admission.ts
const GitObject = /^[a-f0-9]{40}$/u;
const METADATA_MAX_BYTES = 1048576;
const PINNED_REPOSITORY_QUERY = `query PinnedRepository($repositoryId: ID!, $commit: GitObjectID!) {
  node(id: $repositoryId) {
    __typename
    ... on Repository {
      node_id: id
      clone_url: url
      private: isPrivate
      object(oid: $commit) {
        __typename
        ... on Commit { sha: oid tree { sha: oid } }
      }
    }
  }
}`;
function objectSha(value) {
	if (!isRecord(value) || typeof value.sha !== "string" || !GitObject.test(value.sha)) throw new Error("GitHub returned invalid repository object metadata; retry preparation.");
	return value.sha;
}
function sourceChanged() {
	throw new Error("Prepared repository identity changed; retry with the current source and account.");
}
/** Admit source before capacity selection; credentials remain with this Gateway owner. */
async function prepareRepositoryWorkerProjectSource(params) {
	const expected = params.expected && readRepositoryWorkerProjectSnapshot(params.expected);
	const request = expected ? {
		agentId: expected.source.owner.agent.agentId,
		url: expected.source.url,
		baseCommit: expected.baseCommit,
		ref: void 0
	} : params.repository;
	if (!request || !/^[A-Za-z0-9_-]{1,128}$/u.test(params.namespace)) throw new Error("Repository preparation request is invalid");
	const url = parseProjectGitUrl(request.url)?.url;
	if (!url || request.baseCommit !== void 0 && !GitObject.test(request.baseCommit)) throw new Error("Repository preparation requires a GitHub URL and a valid pinned commit");
	const agent = expected?.source.owner.agent ?? captureAgentLifecycleBinding(params.getConfig(), request.agentId);
	if (!agent) throw new Error("Repository preparation requires an existing agent that is not being deleted");
	const getConfig = params.getConfig;
	const assertAgent = () => {
		if (!matchesAgentLifecycleBinding(getConfig(), agent)) sourceChanged();
	};
	const assertAdmission = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent();
		assertAgent();
	};
	const prepareIdentity = async () => {
		assertAgent();
		const config = getConfig();
		const identity = await prepareGitHubReadIdentity({
			config,
			sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? config,
			agentId: agent.agentId,
			getCurrentConfig: getConfig,
			assertActive: assertAgent,
			refresh: () => requestCurrentGitHubOAuthRefresh(agent.agentId),
			allowAnonymous: true
		}).catch((error) => {
			assertAgent();
			throw error instanceof GitHubIdentityError ? error : new GitHubIdentityError("unverified");
		});
		assertAgent();
		return identity;
	};
	assertAdmission();
	let identity = await prepareIdentity();
	assertAdmission();
	const owner = {
		agent,
		identity: identity.selection
	};
	if (expected && !isDeepStrictEqual(owner, expected.source.owner)) sourceChanged();
	const assertCurrent = () => {
		assertAgent();
		identity.assertSelected();
	};
	const repositoryPath = new URL(url).pathname.replace(/\.git$/u, "");
	const endpoint = `${gitHubPublicApi.GITHUB_API_ORIGIN}/repos${repositoryPath}`;
	const read = async (suffix, readIdentity, assertOwner, signal, graphql) => {
		assertOwner();
		const response = await gitHubPublicApi.fetchGitHubApi(graphql ? `${gitHubPublicApi.GITHUB_API_ORIGIN}/graphql` : endpoint + suffix, fetch, readIdentity.token, async () => sourceChanged(), readIdentity, void 0, signal, graphql);
		let value;
		try {
			assertOwner();
			value = graphql && readIdentity.token ? await gitHubPublicApi.readGitHubGraphQLResponse(response, fetch, readIdentity.token, METADATA_MAX_BYTES) : await gitHubPublicApi.readGitHubJsonResponse(response, METADATA_MAX_BYTES);
		} finally {
			await gitHubPublicApi.discardResponse(response);
		}
		await readIdentity.revalidate();
		assertOwner();
		return value;
	};
	const repositoryMetadata = (value, readIdentity) => {
		if (!isRecord(value) || typeof value.node_id !== "string" || !/^[A-Za-z0-9_+/=-]{1,256}$/u.test(value.node_id) || typeof value.clone_url !== "string" || parseProjectGitUrl(value.clone_url)?.url !== url || typeof value.private !== "boolean" || value.private && (readIdentity.selection.source === "anonymous" || !readIdentity.token)) sourceChanged();
		return {
			repositoryId: value.node_id,
			defaultBranch: value.default_branch,
			private: value.private
		};
	};
	const readRepository = async (readIdentity, assertOwner, signal) => repositoryMetadata(await read("", readIdentity, assertOwner, signal), readIdentity);
	const readPinnedRepository = async (repositoryId, baseCommit, readIdentity, assertOwner, signal) => {
		if (!readIdentity.token) return;
		let value;
		try {
			value = await read("", readIdentity, assertOwner, signal, {
				query: PINNED_REPOSITORY_QUERY,
				variables: {
					repositoryId,
					commit: baseCommit
				}
			});
		} catch (error) {
			if (!(error instanceof gitHubPublicApi.GitHubGraphQLUnavailableError)) throw error;
			await readIdentity.revalidate();
			assertOwner();
			return;
		}
		const node = isRecord(value) && isRecord(value.data) ? value.data.node : void 0;
		if (!isRecord(node) || node.__typename !== "Repository" || node.node_id !== repositoryId) sourceChanged();
		const metadata = repositoryMetadata(node, readIdentity);
		const commit = node.object;
		if (!isRecord(commit) || commit.__typename !== "Commit" || objectSha(commit) !== baseCommit) sourceChanged();
		objectSha(commit.tree);
		return {
			metadata,
			commit
		};
	};
	const pinnedRepository = expected ? await readPinnedRepository(expected.source.repositoryId, expected.baseCommit, identity, assertAdmission, params.signal) : void 0;
	const metadata = pinnedRepository?.metadata ?? await readRepository(identity, assertAdmission, params.signal);
	const repositoryId = metadata.repositoryId;
	if (expected && repositoryId !== expected.source.repositoryId) sourceChanged();
	const requestedRef = request.ref === void 0 || request.ref === "HEAD" ? typeof metadata.defaultBranch === "string" ? `heads/${metadata.defaultBranch}` : "" : request.ref.replace(/^refs\/(?=heads\/|tags\/)/u, "");
	if (!request.baseCommit && (!requestedRef || requestedRef.length > 1024 || /\p{Cc}/u.test(requestedRef))) throw new Error("GitHub repository has no valid source reference; select a branch or commit.");
	const pinned = request.baseCommit ?? (GitObject.test(requestedRef) ? requestedRef : void 0);
	const commit = pinnedRepository?.commit ?? await read(pinned ? `/git/commits/${pinned}` : `/commits/${encodeURIComponent(requestedRef)}?per_page=1`, identity, assertAdmission, params.signal);
	const baseCommit = objectSha(commit);
	if (pinned && baseCommit !== pinned) sourceChanged();
	const source = {
		kind: "repository",
		url,
		repositoryId,
		owner
	};
	const project = readRepositoryWorkerProjectSnapshot({
		key: createHash("sha256").update(stableStringify(metadata.private ? [
			"private-repository",
			params.namespace,
			source
		] : [params.namespace, source])).digest("hex"),
		baseCommit,
		source
	});
	if (!project || expected && !isDeepStrictEqual(project, expected)) sourceChanged();
	const tree = objectSha(pinned ? isRecord(commit) ? commit.tree : void 0 : isRecord(commit) && isRecord(commit.commit) ? commit.commit.tree : void 0);
	const treeEntry = async (sha, name) => {
		const value = await read(`/git/trees/${sha}`, identity, assertAdmission, params.signal);
		if (!isRecord(value) || objectSha(value) !== sha || value.truncated !== false || !Array.isArray(value.tree)) throw new Error("GitHub tree metadata is incomplete; retry preparation with a complete source.");
		const entries = value.tree.filter((entry) => isRecord(entry) && entry.path === name);
		if (entries.length > 1) sourceChanged();
		return entries[0];
	};
	const knownRecipe = params.knownRecipe?.(structuredClone(project));
	assertAdmission();
	let setupRecipe;
	if (knownRecipe !== void 0) {
		if (!isRecord(knownRecipe) || !isDeepStrictEqual(knownRecipe.project, project) || knownRecipe.setupRecipe !== void 0 && (typeof knownRecipe.setupRecipe !== "string" || !GitObject.test(knownRecipe.setupRecipe))) sourceChanged();
		setupRecipe = knownRecipe.setupRecipe;
	} else {
		const directory = await treeEntry(tree, ".openclaw");
		if (isRecord(directory) && directory.type === "tree" && directory.mode === "040000") {
			const recipe = await treeEntry(objectSha(directory), "worktree-setup.sh");
			if (isRecord(recipe) && recipe.type === "blob" && recipe.mode === "100755") setupRecipe = objectSha(recipe);
		}
	}
	const confirmed = await readRepository(identity, assertAdmission, params.signal);
	if (confirmed.private !== metadata.private || confirmed.repositoryId !== repositoryId) sourceChanged();
	assertAdmission();
	const revalidate = async (signal) => {
		const assertSource = () => {
			signal?.throwIfAborted();
			assertCurrent();
		};
		assertSource();
		const current = await prepareIdentity();
		assertSource();
		if (!isDeepStrictEqual(current.selection, owner.identity)) sourceChanged();
		const currentPinnedRepository = await readPinnedRepository(repositoryId, baseCommit, current, assertSource, signal);
		const before = currentPinnedRepository?.metadata ?? await readRepository(current, assertSource, signal);
		if (before.private !== metadata.private || before.repositoryId !== repositoryId) sourceChanged();
		if (objectSha(currentPinnedRepository?.commit ?? await read(`/git/commits/${baseCommit}`, current, assertSource, signal)) !== baseCommit || currentPinnedRepository && objectSha(currentPinnedRepository.commit.tree) !== tree) sourceChanged();
		const after = await readRepository(current, assertSource, signal);
		if (after.private !== metadata.private || after.repositoryId !== repositoryId) sourceChanged();
		assertSource();
		identity = current;
	};
	return {
		project,
		setupRecipe,
		assertCurrent,
		revalidate,
		...metadata.private ? { prepareGitPack: async (input) => {
			assertAdmission();
			await revalidate(input.signal);
			const readIdentity = identity;
			const assertFetchCurrent = () => {
				input.signal.throwIfAborted();
				assertAdmission();
				readIdentity.assertSelected();
			};
			const token = readIdentity.token;
			if (!token) throw new GitHubIdentityError("unavailable");
			const { prepareRepositoryWorkerGitPack } = await import("./repository-git-pack-Dpu8T8lY.mjs");
			assertFetchCurrent();
			const pack = await prepareRepositoryWorkerGitPack({
				...input,
				url,
				baseCommit,
				token,
				assertCurrent: assertFetchCurrent
			});
			assertFetchCurrent();
			await revalidate(input.signal);
			assertAdmission();
			return pack;
		} } : {}
	};
}
//#endregion
//#region src/gateway/worker-environments/environment-access.ts
const TUNNEL_START_TIMEOUT_MS = 18e4;
/** Lease teardown joins every transport sharing that environment owner. */
function createWorkerEnvironmentTransportLifecycle(options) {
	if (!options.tunnelManager && !options.nodeTunnelManager && !options.nodeDesktopCarrier && !options.nodePortalCarrier) return;
	return { stop: async (environmentId, ownerEpoch, reason) => {
		await joinWorkerTunnelStops([
			options.tunnelManager?.stop(environmentId, ownerEpoch),
			options.nodeTunnelManager?.stop(environmentId, ownerEpoch, reason),
			options.nodeDesktopCarrier?.stop(environmentId, ownerEpoch),
			options.nodePortalCarrier?.stop(environmentId, ownerEpoch),
			options.closeWorkerPortals?.(environmentId, ownerEpoch),
			options.closeEnvironmentComputers?.(environmentId, ownerEpoch)
		]);
	} };
}
function createWorkerEnvironmentAccess(options) {
	const { store } = options;
	const tunnels = options.tunnelManager;
	const nodeTunnels = options.nodeTunnelManager;
	const nodeDesktop = options.nodeDesktopCarrier;
	const now = options.now;
	const inState = options.inState;
	const providerFor = options.providerFor;
	const identityResolverFor = options.identityResolverFor;
	const serviceError = options.serviceError;
	const withLock = options.withLock;
	let desktopEnabled = options.getConfig().cloudWorkers?.desktop === true;
	let desktopPolicy = new AbortController();
	const requireDesktopPolicy = (operation, policy) => {
		if (options.getConfig().cloudWorkers?.desktop !== true) throw serviceError("invalid_state", `worker desktop ${operation} is disabled; enable the Desktop lab in Control UI Settings -> Labs (config: cloudWorkers.desktop)`);
		if (policy.signal.aborted) throw serviceError("invalid_state", "Worker desktop policy changed; retry the request");
	};
	const requireCurrentRecord = (environmentId) => {
		if (options.isStopping()) throw serviceError("invalid_state", "Worker environment service is stopping");
		const record = store.get(environmentId);
		if (!record) throw serviceError("environment_not_found", `Unknown worker environment: ${environmentId}`);
		return record;
	};
	const requireDesktopRecord = (environmentId) => {
		const record = requireCurrentRecord(environmentId);
		if (!inState(record, "ready", "idle", "attached") || record.destroyRequestedAtMs !== null || !record.leaseId || !record.desktop) throw serviceError("invalid_state", "environment has no desktop; desktop is a warm-time capability of the profile");
		return {
			record,
			desktop: record.desktop,
			leaseId: record.leaseId
		};
	};
	const project = (record) => {
		const desktopAvailable = options.getConfig().cloudWorkers?.desktop === true && inState(record, "ready", "idle", "attached") && record.desktop !== null;
		const nodeTunnelStatus = nodeTunnels?.status(record.environmentId);
		return {
			...record,
			...(record.state === "failed" || record.state === "orphaned") && record.lastError ? { error: boundedWorkerError(record.lastError) } : {},
			desktopAvailable,
			desktopApps: desktopAvailable ? record.desktop?.apps?.map((app) => app.id).toSorted() ?? [] : [],
			tunnelStatus: nodeTunnelStatus && nodeTunnelStatus !== "stopped" ? nodeTunnelStatus : tunnels?.status(record.environmentId) ?? nodeTunnelStatus ?? "stopped"
		};
	};
	const resolveSshIdentity = async (environmentId) => {
		const record = store.get(environmentId);
		if (!record) throw serviceError("environment_not_found", `Unknown worker environment: ${environmentId}`);
		if (!record.leaseId || !record.sshEndpoint) throw serviceError("invalid_state", `Worker environment ${environmentId} has no active SSH endpoint`);
		const provider = providerFor(record.providerId);
		return await identityResolverFor(record, provider, record.leaseId)(record.sshEndpoint.keyRef);
	};
	const bindPreparedWorkspace = async (request) => {
		const bind = options.bindPreparedWorkspace;
		const assertCurrent = () => {
			request.signal?.throwIfAborted();
			request.assertCurrent();
			const record = requireCurrentRecord(request.environmentId);
			const preparation = readWorkerProjectPreparation(record.profileSnapshot.project);
			if (record.state !== "attached" || record.ownerEpoch !== request.ownerEpoch || record.attachedSessionIds.length !== 1 || record.attachedSessionIds[0] !== request.sessionId || record.destroyRequestedAtMs !== null || record.sharedHost !== false || preparation?.key !== request.preparationKey || preparation.cacheKey !== request.cacheKey) throw new Error("Prepared workspace lost its exact attached environment owner");
		};
		assertCurrent();
		if (!bind) throw new Error("Prepared workspace node transport is unavailable");
		const projectSnapshot = readWorkerProjectSnapshot(store.get(request.environmentId).profileSnapshot.project);
		let repository;
		if (projectSnapshot && "source" in projectSnapshot) {
			if (!options.projectNamespace) throw new Error("Prepared repository namespace is unavailable");
			const preparedIdentity = readWorkerProjectPreparation(store.get(request.environmentId).profileSnapshot.project);
			repository = await prepareRepositoryWorkerProjectSource({
				expected: projectSnapshot,
				namespace: options.projectNamespace,
				getConfig: options.getConfig,
				assertCurrent,
				signal: request.signal,
				knownRecipe: preparedIdentity ? () => ({
					project: projectSnapshot,
					setupRecipe: preparedIdentity.setupRecipe
				}) : void 0
			});
		}
		const assertBindingCurrent = () => {
			assertCurrent();
			repository?.assertCurrent();
		};
		assertBindingCurrent();
		const prepared = await bind({
			...request,
			assertCurrent: assertBindingCurrent
		});
		assertBindingCurrent();
		await repository?.revalidate(request.signal);
		assertCurrent();
		return prepared;
	};
	const startTunnel = async (request) => {
		if (options.isStopping()) throw serviceError("invalid_state", "Worker environment service is stopping");
		if (!tunnels && !nodeTunnels) throw serviceError("invalid_state", "Worker tunnel runtime is unavailable");
		let currentBundle;
		try {
			currentBundle = await options.prepareCurrentBundle();
		} catch {
			throw serviceError("invalid_state", "Current worker build identity is unavailable");
		}
		let startup;
		let stopStartup;
		await withLock(request.environmentId, async () => {
			const record = requireCurrentRecord(request.environmentId);
			if (!inState(record, "ready", "idle", "attached") || record.destroyRequestedAtMs !== null || !record.leaseId) throw serviceError("invalid_state", `Cannot start tunnel in state: ${record.state}`);
			if (!record.bootstrapReceipt) throw serviceError("invalid_state", `Cannot start tunnel in state: ${record.state}`);
			if (record.sharedHost === null) throw serviceError("provider_failure", "Worker lease isolation is not reconciled; retry after provider inspection");
			if (record.ownerEpoch === request.ownerEpoch && record.lastError && !verifyWorkerAdmissionHandshake(record.bootstrapReceipt, currentBundle)) throw new WorkerRuntimeRefreshPendingError(boundedWorkerError(record.lastError));
			const credential = store.getCredential(request.environmentId);
			if (record.ownerEpoch !== request.ownerEpoch || !credential || credential.ownerEpoch !== request.ownerEpoch) throw serviceError("invalid_state", "Worker tunnel owner credential is not current");
			if (!verifyWorkerAdmissionHandshake(record.bootstrapReceipt, currentBundle)) throw new StaleWorkerBuildError();
			const nodeDeviceId = record.nodeDeviceId;
			if (typeof nodeDeviceId === "string" && !record.sshEndpoint && record.bootstrapReceipt.installKind === "bundle") {
				const sessionId = record.attachedSessionIds[0];
				if (!nodeTunnels || !sessionId || record.attachedSessionIds.length !== 1 || credential.sessionId !== sessionId) throw serviceError("invalid_state", "Node worker tunnel runtime is unavailable");
				startup = nodeTunnels.start({
					executionMode: record.profileSnapshot.executionMode === "remote-exec" ? "remote-exec" : "worker-turn",
					environmentId: record.environmentId,
					ownerEpoch: record.ownerEpoch,
					deviceId: nodeDeviceId,
					sessionId,
					expectedBuild: {
						bundleHash: currentBundle.bundleHash,
						openclawVersion: currentBundle.openclawVersion,
						protocolFeatures: [...currentBundle.protocolFeatures]
					}
				});
				stopStartup = async () => await nodeTunnels.stop(record.environmentId, record.ownerEpoch);
				return;
			}
			if (!record.sshEndpoint) throw serviceError("invalid_state", "Worker environment has no supported tunnel transport");
			if (!tunnels) throw serviceError("invalid_state", "Worker SSH tunnel runtime is unavailable");
			const provider = providerFor(record.providerId);
			startup = tunnels.start({
				...request,
				bundleHash: currentBundle.bundleHash,
				ssh: record.sshEndpoint,
				sharedHost: record.sharedHost,
				resolveIdentity: identityResolverFor(record, provider, record.leaseId)
			});
			stopStartup = async () => await tunnels.stop(record.environmentId, record.ownerEpoch);
		});
		if (!startup) throw serviceError("invalid_state", "Worker tunnel failed to start");
		const timeoutError = serviceError("provider_failure", "Worker tunnel did not connect within 3 minutes; check that the worker is online and reachable, then retry");
		try {
			return await withTimeout(startup, TUNNEL_START_TIMEOUT_MS, { createError: () => timeoutError });
		} catch (error) {
			if (error !== timeoutError) throw error;
			stopStartup?.().catch(() => void 0);
			throw timeoutError;
		}
	};
	const observeDesktop = async (request) => {
		const stopping = options.isStopping();
		const policy = desktopPolicy;
		const assertPolicy = () => requireDesktopPolicy("observe", policy);
		assertPolicy();
		if (stopping) throw serviceError("invalid_state", "Worker environment service is stopping");
		const requester = {
			...request.requester,
			signal: request.requester?.signal ? AbortSignal.any([policy.signal, request.requester.signal]) : policy.signal,
			isCurrent: () => !policy.signal.aborted && !options.isStopping() && options.getConfig().cloudWorkers?.desktop === true && request.requester?.isCurrent() !== false
		};
		let startup;
		let nodeStartup;
		let ownerEpoch;
		let canResize = false;
		await withLock(request.environmentId, async () => {
			assertPolicy();
			const { record, desktop, leaseId } = requireDesktopRecord(request.environmentId);
			ownerEpoch = record.ownerEpoch;
			canResize = options.resolveProvider(record.providerId)?.allowsDesktopResize === true && desktop.allowsResize !== false;
			if (record.sshEndpoint) {
				if (!tunnels) throw serviceError("invalid_state", "Worker SSH desktop runtime is unavailable");
				startup = tunnels.desktop.acquire({
					environmentId: record.environmentId,
					ownerEpoch: record.ownerEpoch,
					ssh: record.sshEndpoint,
					desktop,
					resolveIdentity: identityResolverFor(record, providerFor(record.providerId), leaseId)
				});
				return;
			}
			if (record.nodeDeviceId) {
				if (!nodeDesktop) throw serviceError("invalid_state", "Worker node desktop runtime is unavailable");
				nodeStartup = nodeDesktop.observe({
					record,
					control: request.control,
					requester
				});
				return;
			}
			throw serviceError("invalid_state", "Worker environment has no desktop transport");
		});
		if (nodeStartup) {
			const observed = await nodeStartup;
			assertPolicy();
			return {
				...observed,
				...canResize ? { canResize } : {}
			};
		}
		if (!startup || ownerEpoch === void 0) throw serviceError("invalid_state", "Worker desktop tunnel failed to start");
		const acquired = await startup;
		const { DESKTOP_OBSERVE_PATH, mintDesktopObserverToken } = await import("./observe-bridge-CSkgehV0.mjs");
		assertPolicy();
		const minted = mintDesktopObserverToken({
			sourceKey: request.environmentId,
			ownerEpoch,
			control: request.control,
			requester,
			attachment: acquired.attachment,
			nowMs: now()
		});
		return {
			transport: "rfb",
			wsPath: `${DESKTOP_OBSERVE_PATH}?token=${minted.token}`,
			expiresAtMs: minted.expiresAtMs,
			control: request.control,
			...canResize ? { canResize } : {},
			...acquired.vncPassword ? { vncPassword: acquired.vncPassword } : {}
		};
	};
	const launchDesktopApp = async (request) => {
		const stopping = options.isStopping();
		const policy = desktopPolicy;
		const assertPolicy = () => requireDesktopPolicy("launch", policy);
		assertPolicy();
		if (stopping) throw serviceError("invalid_state", "Worker environment service is stopping");
		const requireLaunchable = () => {
			assertPolicy();
			const { record, desktop, leaseId } = requireDesktopRecord(request.environmentId);
			const app = desktop.apps?.find((candidate) => candidate.id === request.app);
			if (!app) throw serviceError("desktop_app_not_found", `environment does not advertise desktop app: ${request.app}`);
			return {
				app,
				record,
				leaseId
			};
		};
		let startup;
		let launchEpoch;
		await withLock(request.environmentId, async () => {
			const { app, record, leaseId } = requireLaunchable();
			launchEpoch = record.ownerEpoch;
			if (record.sshEndpoint) {
				if (!tunnels) throw serviceError("invalid_state", "Worker SSH desktop runtime is unavailable");
				const provider = providerFor(record.providerId);
				startup = tunnels.desktop.launchApp({
					environmentId: record.environmentId,
					ownerEpoch: record.ownerEpoch,
					ssh: record.sshEndpoint,
					app,
					resolveIdentity: identityResolverFor(record, provider, leaseId)
				});
				return;
			}
			if (record.nodeDeviceId) {
				if (!nodeDesktop) throw serviceError("invalid_state", "Worker node desktop runtime is unavailable");
				startup = nodeDesktop.launchApp({
					record,
					app
				});
				return;
			}
			throw serviceError("invalid_state", "Worker environment has no desktop transport");
		});
		if (!startup || launchEpoch === void 0) throw serviceError("launcher_failure", "Worker desktop app launcher failed to start");
		try {
			await startup;
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === "unsupported_platform") throw serviceError("unsupported_platform", "desktop app launch is not supported on Windows gateway hosts");
			await withLock(request.environmentId, async () => {
				const { record } = requireLaunchable();
				if (record.ownerEpoch !== launchEpoch) throw serviceError("invalid_state", "Worker desktop app launch owner changed");
			});
			throw serviceError("launcher_failure", `worker desktop ${request.app} launcher failed; verify the app is installed and retry`);
		}
		await withLock(request.environmentId, async () => {
			const { record } = requireLaunchable();
			if (record.ownerEpoch !== launchEpoch) throw serviceError("invalid_state", "Worker desktop app launch owner changed");
		});
		return {
			app: request.app,
			status: "ready"
		};
	};
	const stopTunnel = async (environmentId, ownerEpoch) => {
		await withLock(environmentId, async () => joinWorkerTunnelStops([
			tunnels?.stop(environmentId, ownerEpoch),
			nodeTunnels?.stop(environmentId, ownerEpoch),
			nodeDesktop?.stop(environmentId, ownerEpoch)
		]));
	};
	const reconcileDesktopPolicy = async () => {
		const enabled = options.getConfig().cloudWorkers?.desktop === true;
		if (enabled && desktopEnabled) return;
		if (enabled !== desktopEnabled) {
			desktopEnabled = enabled;
			if (enabled) {
				desktopPolicy.abort();
				desktopPolicy = new AbortController();
			}
		}
		if (!enabled) {
			desktopPolicy.abort();
			await joinWorkerTunnelStops([...store.list().map((record) => tunnels?.desktop.stop(record.environmentId)), nodeDesktop?.stopAll()]);
		}
	};
	return {
		bindPreparedWorkspace,
		get: (environmentId) => {
			const record = store.get(environmentId);
			return record ? project(record) : void 0;
		},
		launchDesktopApp,
		list: () => store.list().map(project),
		observeDesktop,
		project,
		reconcileDesktopPolicy,
		resolveSshIdentity,
		startTunnel,
		stopAllTunnels: () => joinWorkerTunnelStops([
			tunnels?.stopAll(),
			nodeTunnels?.stopAll(),
			nodeDesktop?.stopAll()
		]),
		stopTunnel
	};
}
//#endregion
//#region src/gateway/worker-environments/inference-frames.ts
function terminalError(reason, outcome, errorMessage) {
	const usage = outcome?.type === "done" ? outcome.message.usage : outcome?.type === "error" ? outcome.usage : void 0;
	return {
		type: "error",
		reason,
		message: errorMessage ?? (() => {
			switch (reason) {
				case "model-not-approved": return "Model is not approved";
				case "invalid-context": return "Inference context is invalid";
				case "epoch-mismatch": return "Inference ownership changed";
				case "session-not-attached": return "Session is not attached";
				case "provider-error": return "Provider request failed";
				case "cancelled": return "Inference cancelled";
			}
			return "Provider request failed";
		})(),
		...usage ? { usage } : {}
	};
}
function validFrameBytes(frame, validate) {
	const measured = boundedJsonUtf8Bytes(frame, WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES);
	if (measured.complete && measured.bytes <= WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES && validate(frame)) return measured.bytes;
	return null;
}
function terminalFrame(entry, outcome, seq = entry.seq + 1) {
	return {
		type: "event",
		event: "worker.inference.terminal",
		payload: {
			runEpoch: entry.request.runEpoch,
			sessionId: entry.request.sessionId,
			runId: entry.request.runId,
			turnId: entry.request.turnId,
			seq,
			outcome
		}
	};
}
function normalizeTerminalOutcome(entry, outcome) {
	if (!validateWorkerInferenceTerminalOutcome(outcome) || validFrameBytes(terminalFrame(entry, outcome), validateWorkerInferenceTerminalFrame) === null) return terminalError("provider-error");
	return outcome;
}
//#endregion
//#region src/gateway/worker-environments/inference-store.ts
const REQUEST_HASH_PATTERN = /^[a-f0-9]{64}$/u;
const DEFAULT_RETENTION = {
	maxAgeMs: 864e5,
	maxRows: 256,
	maxBytes: 67108864
};
function required(value, field) {
	if (typeof value !== "string" || !value.trim()) throw new Error(`Worker inference turn ${field} must be a non-empty string`);
	return value.trim();
}
function nonNegativeInteger(value, field) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new Error(`Worker inference turn ${field} must be a non-negative integer`);
	return value;
}
function normalizeRequestHash(value) {
	if (typeof value !== "string" || !REQUEST_HASH_PATTERN.test(value)) throw new Error("Worker inference turn request hash must be lowercase SHA-256 hex");
	return value;
}
function normalizeInput(input, nowMs) {
	return {
		environmentId: required(input.environmentId, "environment id"),
		sessionId: required(input.sessionId, "session id"),
		runEpoch: nonNegativeInteger(input.runEpoch, "run epoch"),
		runId: required(input.runId, "run id"),
		turnId: required(input.turnId, "turn id"),
		requestHash: normalizeRequestHash(input.requestHash),
		nowMs: nonNegativeInteger(nowMs, "timestamp")
	};
}
function parseTerminalJson(value) {
	let parsed;
	try {
		parsed = JSON.parse(value);
	} catch (error) {
		throw new Error("Worker inference cached terminal outcome is invalid", { cause: error });
	}
	if (!validateWorkerInferenceTerminalOutcome(parsed)) throw new Error("Worker inference cached terminal outcome is invalid");
	return parsed;
}
function serializeTerminalOutcome(outcome) {
	if (!validateWorkerInferenceTerminalOutcome(outcome)) throw new Error("Worker inference terminal outcome is invalid");
	const serialized = JSON.stringify(outcome);
	if (!serialized) throw new Error("Worker inference terminal outcome is not serializable");
	return serialized;
}
const query = (db) => getNodeSqliteKysely(db);
function findTurn(db, input) {
	return executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_inference_turns").selectAll().where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("run_id", "=", input.runId).where("turn_id", "=", input.turnId));
}
function findPendingTurn(db, input) {
	return executeSqliteQueryTakeFirstSync(db, query(db).selectFrom("worker_inference_turns").selectAll().where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("run_id", "=", input.runId).where("state", "=", "pending"));
}
function classifyExistingTurn(row, input) {
	if (!row) return;
	if (row.environment_id !== input.environmentId || row.request_hash !== input.requestHash) return {
		kind: "rejected",
		reason: "conflict"
	};
	if (row.state === "pending" && row.terminal_json === null) return { kind: "recover" };
	if (row.state === "terminal" && row.terminal_json !== null) return {
		kind: "replay",
		outcome: parseTerminalJson(row.terminal_json)
	};
	throw new Error("Worker inference turn row has invalid terminal state");
}
function insertPendingTurn(db, input) {
	const turn = {
		session_id: input.sessionId,
		run_epoch: input.runEpoch,
		run_id: input.runId,
		turn_id: input.turnId,
		environment_id: input.environmentId,
		request_hash: input.requestHash,
		state: "pending",
		terminal_json: null,
		created_at_ms: input.nowMs,
		updated_at_ms: input.nowMs
	};
	executeSqliteQuerySync(db, query(db).insertInto("worker_inference_turns").values(turn));
}
function deleteTurn(db, row) {
	executeSqliteQuerySync(db, query(db).deleteFrom("worker_inference_turns").where("session_id", "=", row.session_id).where("run_epoch", "=", row.run_epoch).where("run_id", "=", row.run_id).where("turn_id", "=", row.turn_id).where("state", "=", "terminal"));
}
function pruneTerminalTurns(params) {
	const db = query(params.db);
	const utf8 = executeSqliteQueryTakeFirstSync(params.db, db.selectFrom("pragma_encoding").select("encoding"))?.encoding === "UTF-8";
	const retained = db.selectFrom("worker_inference_turns").select([
		"session_id",
		"run_epoch",
		"run_id",
		"turn_id",
		"updated_at_ms"
	]).where("state", "=", "terminal").orderBy("updated_at_ms", "desc").orderBy("session_id", "asc").orderBy("run_epoch", "desc").orderBy("run_id", "asc").orderBy("turn_id", "asc");
	const rows = utf8 ? executeSqliteQuerySync(params.db, retained.select((eb) => eb.fn("octet_length", ["terminal_json"]).as("terminal_bytes"))).rows : executeSqliteQuerySync(params.db, retained.select("terminal_json")).rows.map((row) => ({
		session_id: row.session_id,
		run_epoch: row.run_epoch,
		run_id: row.run_id,
		turn_id: row.turn_id,
		updated_at_ms: row.updated_at_ms,
		terminal_bytes: Buffer.byteLength(row.terminal_json ?? "", "utf8")
	}));
	const isPreserved = (row) => params.preserve !== void 0 && row.session_id === params.preserve.sessionId && row.run_epoch === params.preserve.runEpoch && row.run_id === params.preserve.runId && row.turn_id === params.preserve.turnId;
	rows.sort((left, right) => Number(isPreserved(right)) - Number(isPreserved(left)));
	const cutoffMs = Math.max(0, params.nowMs - params.policy.maxAgeMs);
	let retainedRows = 0;
	let retainedBytes = 0;
	for (const row of rows) {
		const terminalBytes = row.terminal_bytes;
		const preserve = isPreserved(row);
		const expired = row.updated_at_ms < cutoffMs;
		const exceedsRows = retainedRows >= params.policy.maxRows;
		const exceedsBytes = retainedRows > 0 && retainedBytes + terminalBytes > params.policy.maxBytes;
		if (!preserve && (expired || exceedsRows || exceedsBytes)) {
			deleteTurn(params.db, row);
			continue;
		}
		retainedRows += 1;
		retainedBytes += terminalBytes;
	}
}
function createWorkerInferenceStore(options = {}) {
	const path = (options.database ?? openOpenClawStateDatabase()).path;
	const now = options.now ?? Date.now;
	const retention = {
		...DEFAULT_RETENTION,
		...options.retention
	};
	const write = (operation) => runOpenClawStateWriteTransaction(({ db }) => operation(db), { path });
	const begin = (rawInput) => {
		const input = normalizeInput(rawInput, now());
		return write((db) => {
			pruneTerminalTurns({
				db,
				nowMs: input.nowMs,
				policy: retention
			});
			const existing = classifyExistingTurn(findTurn(db, input), input);
			if (existing) return existing;
			if (findPendingTurn(db, input)) return {
				kind: "rejected",
				reason: "conflict"
			};
			insertPendingTurn(db, input);
			return { kind: "claimed" };
		});
	};
	const complete = (rawInput) => {
		const input = normalizeInput(rawInput, now());
		const terminalJson = serializeTerminalOutcome(rawInput.outcome);
		return write((db) => {
			const existing = classifyExistingTurn(findTurn(db, input), input);
			if (!existing) throw new Error("Worker inference turn must begin before terminal completion");
			if (existing.kind === "rejected") throw new Error(`Worker inference terminal completion rejected: ${existing.reason}`);
			if (existing.kind === "replay") return existing.outcome;
			if (executeSqliteQuerySync(db, query(db).updateTable("worker_inference_turns").set({
				state: "terminal",
				terminal_json: terminalJson,
				updated_at_ms: input.nowMs
			}).where("session_id", "=", input.sessionId).where("run_epoch", "=", input.runEpoch).where("run_id", "=", input.runId).where("turn_id", "=", input.turnId).where("environment_id", "=", input.environmentId).where("request_hash", "=", input.requestHash).where("state", "=", "pending")).numAffectedRows !== 1n) throw new Error("Worker inference turn changed during terminal completion");
			pruneTerminalTurns({
				db,
				nowMs: input.nowMs,
				policy: retention,
				preserve: input
			});
			return rawInput.outcome;
		});
	};
	const cancelPending = (params) => {
		const nowMs = nonNegativeInteger(now(), "timestamp");
		const terminalJson = serializeTerminalOutcome(params.outcome);
		const identity = {
			environmentId: required(params.environmentId, "environment id"),
			sessionId: required(params.sessionId, "session id"),
			runEpoch: nonNegativeInteger(params.runEpoch, "run epoch"),
			runId: required(params.runId, "run id"),
			turnId: required(params.turnId, "turn id")
		};
		write((db) => {
			executeSqliteQuerySync(db, query(db).updateTable("worker_inference_turns").set({
				state: "terminal",
				terminal_json: terminalJson,
				updated_at_ms: nowMs
			}).where("session_id", "=", identity.sessionId).where("run_epoch", "=", identity.runEpoch).where("run_id", "=", identity.runId).where("turn_id", "=", identity.turnId).where("environment_id", "=", identity.environmentId).where("state", "=", "pending"));
			pruneTerminalTurns({
				db,
				nowMs,
				policy: retention,
				preserve: identity
			});
		});
	};
	const recoverPending = (outcome) => {
		const nowMs = nonNegativeInteger(now(), "timestamp");
		const terminalJson = serializeTerminalOutcome(outcome);
		write((db) => {
			executeSqliteQuerySync(db, query(db).updateTable("worker_inference_turns").set({
				state: "terminal",
				terminal_json: terminalJson,
				updated_at_ms: nowMs
			}).where("state", "=", "pending"));
			pruneTerminalTurns({
				db,
				nowMs,
				policy: retention
			});
		});
	};
	return {
		begin,
		cancelPending,
		complete,
		recoverPending
	};
}
//#endregion
//#region src/gateway/worker-environments/inference.ts
const DEFAULT_REQUEST_MAX_BYTES = WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES;
const MAX_PROVIDER_OPERATIONS_PER_SESSION = 2;
function safeRevalidate(revalidate) {
	try {
		return revalidate?.() ?? null;
	} catch {
		return "provider-error";
	}
}
function trySend(sink, frame) {
	try {
		sink.send(frame);
		return true;
	} catch {
		return false;
	}
}
function matchesIdentity(identity, request) {
	const claim = identity.turnClaim;
	if (!claim || identity.sessionId !== request.sessionId || identity.runId !== request.runId || claim.sessionId !== request.sessionId || claim.runId !== request.runId) return "session-not-attached";
	if (identity.ownerEpoch !== request.runEpoch) return "epoch-mismatch";
	return null;
}
function createWorkerInferenceManager(options) {
	const store = options.store ?? createWorkerInferenceStore();
	const requestMaxBytes = options.requestMaxBytes ?? DEFAULT_REQUEST_MAX_BYTES;
	const streamMaxBytes = options.streamMaxBytes ?? WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES;
	const active = /* @__PURE__ */ new Map();
	const operations = /* @__PURE__ */ new Map();
	const drainingSessionIds = /* @__PURE__ */ new Set();
	let stopping = false;
	store.recoverPending(terminalError("provider-error"));
	const processFence = (entry) => {
		if (entry.abortReason) return entry.abortReason;
		const bindingError = matchesIdentity(entry.identity, entry.request);
		if (bindingError) return bindingError;
		if (active.get(entry.claimKey) !== entry) return "cancelled";
		return null;
	};
	const durableFence = (entry) => {
		const currentError = processFence(entry);
		if (currentError) return currentError;
		const revalidationError = safeRevalidate(entry.revalidate);
		if (revalidationError) {
			entry.abortReason = revalidationError;
			entry.controller.abort();
			return revalidationError;
		}
		return null;
	};
	const abortEntry = (entry, reason) => {
		if (!entry.abortReason) entry.abortReason = reason;
		if (!entry.controller.signal.aborted) entry.controller.abort();
	};
	const sendTerminal = (entry, outcome) => {
		entry.seq += 1;
		trySend(entry.sink, terminalFrame(entry, outcome, entry.seq));
	};
	const settleAbort = (entry, reason) => {
		if (entry.settled) return true;
		abortEntry(entry, reason);
		let outcome;
		try {
			outcome = store.complete({
				...entry.storeInput,
				outcome: terminalError(entry.abortReason ?? reason)
			});
		} catch {
			return false;
		}
		entry.settled = true;
		if (active.get(entry.claimKey) === entry) {
			active.delete(entry.claimKey);
			sendTerminal(entry, outcome);
		}
		return true;
	};
	const finish = (entry, rawOutcome) => {
		if (entry.settled) return;
		const fence = durableFence(entry);
		const outcome = normalizeTerminalOutcome(entry, fence ? terminalError(fence, rawOutcome) : rawOutcome);
		let storedOutcome;
		try {
			storedOutcome = store.complete({
				...entry.storeInput,
				outcome
			});
		} catch {
			entry.settled = true;
			if (active.get(entry.claimKey) === entry) active.delete(entry.claimKey);
			return;
		}
		entry.settled = true;
		if (active.get(entry.claimKey) === entry) {
			active.delete(entry.claimKey);
			sendTerminal(entry, storedOutcome);
		}
	};
	const executeEntry = async (entry) => {
		const initialFence = durableFence(entry);
		if (initialFence) {
			finish(entry, terminalError(initialFence));
			return;
		}
		let outcome;
		try {
			const config = options.getConfig?.();
			outcome = await options.execute({
				identity: entry.identity,
				request: entry.request,
				signal: entry.controller.signal,
				emit: (event) => {
					const fence = durableFence(entry);
					if (fence) {
						abortEntry(entry, fence);
						return;
					}
					const nextSeq = entry.seq + 1;
					const frame = {
						type: "event",
						event: "worker.inference.event",
						payload: {
							runEpoch: entry.request.runEpoch,
							sessionId: entry.request.sessionId,
							runId: entry.request.runId,
							turnId: entry.request.turnId,
							seq: nextSeq,
							event
						}
					};
					const frameBytes = validFrameBytes(frame, validateWorkerInferenceEventFrame);
					if (frameBytes === null || entry.streamedBytes + frameBytes > streamMaxBytes) {
						settleAbort(entry, "provider-error");
						return;
					}
					if (!trySend(entry.sink, frame)) {
						settleAbort(entry, "provider-error");
						return;
					}
					entry.streamedBytes += frameBytes;
					entry.seq = nextSeq;
				},
				isCurrent: () => durableFence(entry) === null,
				...config ? { config } : {}
			});
		} catch (error) {
			outcome = terminalError(entry.abortReason ?? "provider-error", void 0, entry.abortReason ? void 0 : formatWorkerInferenceError(error));
		}
		finish(entry, outcome);
	};
	const launchEntry = (entry) => {
		if (entry.launched || entry.settled) return;
		entry.launched = true;
		const operation = runWithGatewayIndependentRootWorkContinuation(() => executeEntry(entry), "worker:dispatch").catch((error) => {
			finish(entry, terminalError(entry.abortReason ?? "provider-error", void 0, entry.abortReason ? void 0 : formatWorkerInferenceError(error)));
		});
		operations.set(operation, entry.request.sessionId);
		operation.then(() => operations.delete(operation), () => operations.delete(operation));
	};
	const start = (params) => {
		if (stopping || drainingSessionIds.has(params.request.sessionId)) return {
			ok: false,
			reason: "cancelled"
		};
		const identityError = matchesIdentity(params.identity, params.request);
		if (identityError) return {
			ok: false,
			reason: identityError
		};
		const revalidationError = safeRevalidate(params.revalidate);
		if (revalidationError) return {
			ok: false,
			reason: revalidationError
		};
		const measured = boundedJsonUtf8Bytes(params.request, requestMaxBytes);
		if (!measured.complete || measured.bytes > requestMaxBytes) return {
			ok: false,
			reason: "invalid-context"
		};
		const serialized = stableStringify(params.request);
		const claim = params.identity.turnClaim;
		const claimKey = serializeWorkerSessionTurnClaim(claim);
		const hash = createHash("sha256").update(`${claimKey}\0${serialized}`).digest("hex");
		const existing = active.get(claimKey);
		if (existing) {
			if (existing.request.turnId === params.request.turnId && existing.requestHash === hash && !existing.settled) {
				const retryEntry = existing;
				retryEntry.identity = params.identity;
				retryEntry.sink = params.sink;
				if (params.revalidate) retryEntry.revalidate = params.revalidate;
				else delete retryEntry.revalidate;
				return {
					ok: true,
					result: { status: "accepted" },
					launch: () => launchEntry(retryEntry)
				};
			}
			const staleFence = durableFence(existing);
			if (!staleFence) return {
				ok: false,
				reason: "invalid-context"
			};
			settleAbort(existing, staleFence);
			return {
				ok: false,
				reason: "invalid-context"
			};
		}
		for (const concurrent of active.values()) {
			if (concurrent.request.sessionId !== params.request.sessionId) continue;
			const staleFence = durableFence(concurrent);
			if (!staleFence) return {
				ok: false,
				reason: "invalid-context"
			};
			settleAbort(concurrent, staleFence);
			return {
				ok: false,
				reason: "invalid-context"
			};
		}
		const storeInput = {
			environmentId: params.identity.environmentId,
			sessionId: params.request.sessionId,
			runEpoch: params.request.runEpoch,
			runId: params.request.runId,
			turnId: params.request.turnId,
			requestHash: hash
		};
		let begin;
		try {
			begin = store.begin(storeInput);
		} catch {
			return {
				ok: false,
				reason: "provider-error"
			};
		}
		if (begin.kind === "rejected") return {
			ok: false,
			reason: "invalid-context"
		};
		const replayResult = (cachedOutcome) => {
			let launched = false;
			return {
				ok: true,
				result: { status: "replayed" },
				launch: () => {
					if (launched) return;
					launched = true;
					const fence = safeRevalidate(params.revalidate);
					const frame = {
						type: "event",
						event: "worker.inference.terminal",
						payload: {
							runEpoch: params.request.runEpoch,
							sessionId: params.request.sessionId,
							runId: params.request.runId,
							turnId: params.request.turnId,
							seq: 1,
							outcome: fence ? terminalError(fence) : cachedOutcome
						}
					};
					trySend(params.sink, frame);
				}
			};
		};
		if (begin.kind === "replay") return replayResult(begin.outcome);
		if (begin.kind === "recover") {
			const outcome = terminalError("provider-error");
			let storedOutcome;
			try {
				storedOutcome = store.complete({
					...storeInput,
					outcome
				});
			} catch {
				return {
					ok: false,
					reason: "provider-error"
				};
			}
			return replayResult(storedOutcome);
		}
		let runningForSession = 0;
		for (const sessionId of operations.values()) if (sessionId === params.request.sessionId) runningForSession += 1;
		if (runningForSession >= MAX_PROVIDER_OPERATIONS_PER_SESSION) try {
			return replayResult(store.complete({
				...storeInput,
				outcome: terminalError("provider-error")
			}));
		} catch {
			return {
				ok: false,
				reason: "provider-error"
			};
		}
		const entry = {
			claimKey,
			identity: params.identity,
			request: params.request,
			requestHash: hash,
			storeInput,
			sink: params.sink,
			...params.revalidate ? { revalidate: params.revalidate } : {},
			controller: new AbortController(),
			seq: 0,
			streamedBytes: 0,
			launched: false,
			settled: false
		};
		active.set(claimKey, entry);
		return {
			ok: true,
			result: { status: "accepted" },
			launch: () => launchEntry(entry)
		};
	};
	const cancel = (params) => {
		const identityError = matchesIdentity(params.identity, params.request);
		if (identityError) return {
			ok: false,
			reason: identityError
		};
		const revalidationError = safeRevalidate(params.revalidate);
		if (revalidationError) return {
			ok: false,
			reason: revalidationError
		};
		const claimKey = serializeWorkerSessionTurnClaim(params.identity.turnClaim);
		const entry = active.get(claimKey);
		if (entry?.request.turnId === params.request.turnId) {
			if (!settleAbort(entry, "cancelled")) return {
				ok: false,
				reason: "provider-error"
			};
		} else try {
			store.cancelPending({
				environmentId: params.identity.environmentId,
				sessionId: params.request.sessionId,
				runEpoch: params.request.runEpoch,
				runId: params.request.runId,
				turnId: params.request.turnId,
				outcome: terminalError("cancelled")
			});
		} catch {
			return {
				ok: false,
				reason: "provider-error"
			};
		}
		return {
			ok: true,
			result: { status: "cancelled" }
		};
	};
	const captureCancellationEntries = (predicate) => [...active.values()].filter(predicate).map((entry) => ({
		entry,
		claimKey: entry.claimKey,
		sessionId: entry.request.sessionId,
		runId: entry.request.runId,
		turnId: entry.request.turnId
	}));
	const cancelCaptured = (captured, reason, control) => {
		let terminalPersistenceFailed = false;
		for (const { entry, claimKey, sessionId, runId, turnId } of captured) {
			control?.assertCurrent?.();
			if (active.get(claimKey) !== entry || entry.claimKey !== claimKey || entry.request.sessionId !== sessionId || entry.request.runId !== runId || entry.request.turnId !== turnId) continue;
			terminalPersistenceFailed = !settleAbort(entry, reason) || terminalPersistenceFailed;
			control?.onCancelled?.(runId);
		}
		return terminalPersistenceFailed;
	};
	const cancelWhere = (predicate, reason) => cancelCaptured(captureCancellationEntries(predicate), reason);
	const cancelEnvironment = (environmentId, reason = "session-not-attached") => {
		cancelWhere((entry) => entry.identity.environmentId === environmentId, reason);
	};
	const cancelClaim = (claim) => {
		const claimKey = serializeWorkerSessionTurnClaim(claim);
		cancelWhere((entry) => entry.claimKey === claimKey, "session-not-attached");
	};
	const captureSessionCancellation = (sessionId, runId) => {
		const captured = captureCancellationEntries((entry) => entry.request.sessionId === sessionId && (runId === void 0 || entry.request.runId === runId));
		return {
			runIds: [...new Set(captured.map((entry) => entry.runId))].toSorted(),
			cancel: (control) => {
				const cancelledRunIds = /* @__PURE__ */ new Set();
				cancelCaptured(captured, "cancelled", {
					assertCurrent: control?.assertCurrent,
					onCancelled: (cancelledRunId) => {
						cancelledRunIds.add(cancelledRunId);
						control?.onCancelled?.(cancelledRunId);
					}
				});
				return [...cancelledRunIds].toSorted();
			}
		};
	};
	const cancelSession = (sessionId, runId) => captureSessionCancellation(sessionId, runId).cancel();
	const hasSession = (sessionId, runId) => {
		for (const entry of active.values()) if (entry.request.sessionId === sessionId && (runId === void 0 || entry.request.runId === runId)) return true;
		return false;
	};
	const hasSessionOperation = (sessionId) => {
		for (const operationSessionId of operations.values()) if (operationSessionId === sessionId) return true;
		return false;
	};
	const beginSessionDrain = (sessionId) => {
		if (drainingSessionIds.has(sessionId)) throw new WorkerInferenceSessionDrainBusyError(sessionId);
		drainingSessionIds.add(sessionId);
		const terminalPersistenceFailed = cancelWhere((entry) => entry.request.sessionId === sessionId, "cancelled");
		const providerOperations = [];
		for (const [operation, operationSessionId] of operations) if (operationSessionId === sessionId) providerOperations.push(operation);
		let released = false;
		return {
			drained: Promise.allSettled(providerOperations).then(() => {
				if (terminalPersistenceFailed) throw new Error(`Worker inference terminal persistence failed for session ${sessionId}`);
			}),
			hasWork: () => hasSession(sessionId) || hasSessionOperation(sessionId),
			release: () => {
				if (released) return;
				released = true;
				drainingSessionIds.delete(sessionId);
			}
		};
	};
	const resolveSessionIdForRunId = (runId) => {
		const sessionIds = /* @__PURE__ */ new Set();
		for (const entry of active.values()) if (entry.request.runId === runId) sessionIds.add(entry.request.sessionId);
		return sessionIds.size === 1 ? sessionIds.values().next().value : void 0;
	};
	const stop = async () => {
		stopping = true;
		cancelWhere(() => true, "provider-error");
		await withTimeout(Promise.allSettled(operations.keys()), options.stopDrainMs ?? 5e3, "Worker inference shutdown").catch(() => void 0);
	};
	return {
		start,
		cancel,
		cancelEnvironment,
		cancelClaim,
		cancelSession,
		captureSessionCancellation,
		beginSessionDrain,
		hasSession,
		resolveSessionIdForRunId,
		stop
	};
}
//#endregion
//#region src/gateway/worker-environments/prepared-pool.ts
const DEFAULT_READY_WORKERS = 1;
const DEFAULT_MAX_TOTAL = 4;
const PREPARATION_CONCURRENCY = 2;
/** Environment rows own inventory; placement activation and explicit builds establish demand. */
function createPreparedWorkerPool(options) {
	const { store, signal, now } = options;
	let inFlight;
	let requested = false;
	const preparations = /* @__PURE__ */ new Map();
	const current = () => signal.throwIfAborted();
	const policy = (record) => {
		const config = options.getConfig().cloudWorkers;
		const profile = config?.profiles?.[record.profileId];
		const configured = profile && normalizeCapabilityProviderId(profile.provider) === record.providerId;
		return {
			configured: Boolean(configured),
			target: configured ? profile.readyWorkers ?? DEFAULT_READY_WORKERS : 0,
			maxTotal: config?.preparedPool?.maxTotal ?? DEFAULT_MAX_TOTAL
		};
	};
	const groupKey = (record) => {
		const project = readWorkerProjectSnapshot(record.profileSnapshot.project);
		return project ? JSON.stringify([
			record.providerId,
			record.profileId,
			project.key
		]) : void 0;
	};
	const demandAt = (record) => record.lastActivatedAtMs ?? record.preparation?.demandAtMs;
	const retire = (record, reason) => {
		if (!record.preparation) return;
		return store.requestPreparedDestroy({
			environmentId: record.environmentId,
			ownerEpoch: record.ownerEpoch,
			preparationKey: record.preparation.key,
			reason,
			assertCurrent: current
		});
	};
	const snapshotSettings = (record) => {
		const settings = record.profileSnapshot.settings;
		if (!settings || typeof settings !== "object" || Array.isArray(settings)) throw new Error("Prepared worker profile settings are unavailable");
		return settings;
	};
	const runPass = async () => {
		await store.ready();
		current();
		const inventory = store.list();
		const sources = /* @__PURE__ */ new Map();
		const buildingKeys = /* @__PURE__ */ new Set();
		for (const record of inventory) {
			const demandAtMs = demandAt(record);
			const key = groupKey(record);
			const build = record.preparation?.purpose === "build" && record.preparation.consumedAtMs === null && record.destroyRequestedAtMs === null && record.state !== "failed" && record.state !== "destroyed";
			if (key && build && record.state !== "ready") buildingKeys.add(key);
			if (key && demandAtMs !== void 0 && readWorkerProjectPreparation(record.profileSnapshot.project)) {
				const previous = sources.get(key);
				if (!previous || demandAtMs > previous.demandAtMs || demandAtMs === previous.demandAtMs && build) sources.set(key, {
					record,
					demandAtMs
				});
			}
		}
		const eligible = /* @__PURE__ */ new Map();
		for (const [key, { record, demandAtMs }] of sources) {
			const limits = policy(record);
			if (!limits.configured || limits.target === 0 && !buildingKeys.has(key) || limits.maxTotal === 0) continue;
			try {
				const timeout = options.resolveProvider(record.providerId)?.resolvePreparedIdleTimeoutMs?.(snapshotSettings(record));
				if (Number.isSafeInteger(timeout) && timeout && timeout > 0 && demandAtMs + timeout > now()) eligible.set(key, {
					source: record,
					preparationKey: readWorkerProjectPreparation(record.profileSnapshot.project).key,
					demandAtMs,
					expiresAtMs: demandAtMs + timeout
				});
			} catch {
				current();
				options.warn(`Prepared worker policy is unavailable (${record.profileId}); unused workers will retire`);
			}
		}
		const assertGenerationCurrent = (generation) => {
			current();
			generation.retention.assertCurrent();
			if (generation.intent) options.assertIntentCurrent(generation.source.profileId, generation.intent);
			if (!isDeepStrictEqual(store.get(generation.source.environmentId)?.profileSnapshot, generation.source.profileSnapshot)) throw new Error("Prepared worker source changed during maintenance");
		};
		const reconcile = async (record) => {
			current();
			let retirementReason;
			let retirement;
			const beforeReconcile = () => {
				current();
				const owned = store.get(record.environmentId);
				if (!owned || owned.preparation?.consumedAtMs !== null || owned.destroyRequestedAtMs !== null) return;
				const key = groupKey(owned);
				const generation = key ? eligible.get(key) : void 0;
				if (owned.preparation.expiresAtMs <= now()) retirementReason = "expired";
				else if (!generation?.retention || generation.preparationKey !== owned.preparation.key || !store.isPreparedIntentWithinCapacity({
					environmentId: owned.environmentId,
					...policy(owned)
				})) retirementReason = "invalidated";
				else try {
					assertGenerationCurrent(generation);
				} catch {
					current();
					retirementReason = "invalidated";
				}
				if (retirementReason) {
					retirement ??= retire(owned, retirementReason);
					retirement?.catch(() => {});
					throw new Error("Prepared worker no longer satisfies its maintenance policy");
				}
			};
			try {
				beforeReconcile();
			} catch (error) {
				if (!retirementReason) throw error;
				await retirement;
				retirement = void 0;
				retirementReason = void 0;
			}
			const latest = store.get(record.environmentId);
			if (latest?.preparation?.consumedAtMs === null) {
				const controller = new AbortController();
				preparations.set(record.environmentId, controller);
				try {
					await options.reconcile(latest, AbortSignal.any([signal, controller.signal]), beforeReconcile);
				} catch (error) {
					if (retirement) {
						const retiring = await retirement;
						if (retiring) await options.reconcile(retiring, signal, current);
					}
					throw error;
				} finally {
					preparations.delete(record.environmentId);
					await retirement;
				}
			}
		};
		const reconcileAll = (records) => runTasksWithConcurrency({
			tasks: records.map((record) => () => reconcile(record)),
			limit: PREPARATION_CONCURRENCY,
			onTaskError: () => {
				if (!signal.aborted) options.warn("Prepared worker maintenance failed; inspect the recorded environment failure and cleanup state");
			}
		});
		const cleaned = /* @__PURE__ */ new Set();
		const retain = async (requireRetention) => {
			const kept = /* @__PURE__ */ new Map();
			let totalKept = 0;
			const cleanup = [];
			const work = [];
			for (const snapshot of inventory.toSorted((a, b) => a.createdAtMs - b.createdAtMs)) {
				const record = store.get(snapshot.environmentId);
				if (!record || record.preparation?.consumedAtMs !== null || record.state === "destroyed" || record.state === "failed") continue;
				current();
				const key = groupKey(record);
				const generation = key ? eligible.get(key) : void 0;
				const limits = policy(record);
				const count = key ? kept.get(key) ?? 0 : 0;
				const expired = record.preparation.expiresAtMs <= now();
				const valid = !expired && generation?.preparationKey === record.preparation.key && (!requireRetention || generation.retention !== void 0) && (record.preparation.purpose === "build" && record.state !== "ready" || count < limits.target) && totalKept < limits.maxTotal;
				if (record.destroyRequestedAtMs === null && !valid) await retire(record, expired ? "expired" : "invalidated");
				else if (record.destroyRequestedAtMs === null && key) {
					kept.set(key, count + 1);
					totalKept += 1;
				}
				const latest = store.get(record.environmentId);
				if (latest.destroyRequestedAtMs !== null) {
					if (!cleaned.has(record.environmentId)) {
						cleaned.add(record.environmentId);
						cleanup.push(latest);
					}
				} else work.push(latest);
			}
			return {
				cleanup,
				work
			};
		};
		await reconcileAll((await retain(false)).cleanup);
		for (const [key, generation] of eligible) try {
			generation.retention = await options.prepareRetention(generation.source, signal);
			current();
			if (!generation.retention) eligible.delete(key);
		} catch {
			current();
			eligible.delete(key);
			options.warn(`Prepared worker contents are no longer compatible (${generation.source.profileId}); unused workers will retire`);
		}
		await reconcileAll((await retain(true)).cleanup);
		let plannedTotal = 0;
		for (const [key, generation] of eligible) {
			current();
			const { source } = generation;
			const limits = policy(source);
			const project = readWorkerProjectSnapshot(source.profileSnapshot.project);
			const slots = store.preparedCapacity({
				profileId: source.profileId,
				projectKey: project.key,
				...limits,
				maxTotal: Math.max(0, limits.maxTotal - plannedTotal)
			});
			if (slots === 0 || generation.expiresAtMs <= now()) continue;
			try {
				const preparation = readWorkerProjectPreparation(source.profileSnapshot.project);
				const intent = await options.prepareIntent(source.profileId, {
					..."source" in project ? { projectRepository: project } : {
						projectPath: project.root,
						projectCommit: project.baseCommit
					},
					...typeof source.profileSnapshot.machineClass === "string" ? { machineClass: source.profileSnapshot.machineClass } : {},
					...typeof source.profileSnapshot.os === "string" ? { os: source.profileSnapshot.os } : {},
					...source.profileSnapshot.executionMode === "worker-turn" || source.profileSnapshot.executionMode === "remote-exec" ? { executionMode: source.profileSnapshot.executionMode } : {},
					setupAuthorized: preparation.setupRecipe !== void 0 && preparation.runSetupScript !== false,
					runSetupScript: preparation.runSetupScript,
					signal
				});
				current();
				if (intent.providerId !== source.providerId || intent.preparationKey !== preparation.key) {
					eligible.delete(key);
					continue;
				}
				generation.intent = intent;
				generation.slots = slots;
				plannedTotal += slots;
			} catch {
				current();
				eligible.delete(key);
				options.warn(`Prepared worker source is unavailable (${source.profileId}); unused workers will retire`);
			}
		}
		const retained = await retain(true);
		await reconcileAll(retained.cleanup);
		const work = retained.work;
		for (const generation of eligible.values()) {
			const { source, intent, demandAtMs, expiresAtMs } = generation;
			if (!intent) continue;
			const limits = policy(source);
			const project = readWorkerProjectSnapshot(intent.profileSnapshot.project);
			for (let index = 0; index < generation.slots; index += 1) {
				current();
				const admitted = await store.ensurePreparedIntent({
					intent: {
						...deriveEnvironmentIntent(`prepared:${randomUUID()}`),
						providerId: intent.providerId,
						profileId: source.profileId,
						profileSnapshot: intent.profileSnapshot,
						preparation: {
							purpose: "reserve",
							key: intent.preparationKey,
							demandAtMs,
							expiresAtMs
						}
					},
					projectKey: project.key,
					...limits,
					assertCurrent: () => {
						assertGenerationCurrent(generation);
						if (!isDeepStrictEqual(policy(source), limits)) throw new Error("Prepared worker admission policy changed");
					}
				});
				if (!admitted) break;
				work.push(admitted);
			}
		}
		await reconcileAll(work);
	};
	const schedule = () => {
		if (signal.aborted) return Promise.resolve();
		requested = true;
		return inFlight ??= (async () => {
			try {
				while (requested && !signal.aborted) {
					requested = false;
					await runPass();
				}
			} finally {
				inFlight = void 0;
			}
		})();
	};
	const noteDemand = async (environmentId) => {
		current();
		const record = store.get(environmentId);
		const preparation = record && readWorkerProjectPreparation(record.profileSnapshot.project);
		if (record?.state !== "attached" || !record.leaseId || !preparation) return;
		const demandAtMs = record.lastActivatedAtMs;
		if (demandAtMs === null) return;
		await options.resolveProvider(record.providerId)?.notePreparedDemand?.({
			leaseId: record.leaseId,
			profile: snapshotSettings(record)
		}, {
			preparationKey: preparation.key,
			demandAtMs
		});
	};
	const candidates = (intent) => intent.preparationKey ? store.list().filter((record) => {
		const limits = policy(record);
		return limits.target > 0 && limits.maxTotal > 0 && record.state === "ready" && record.providerId === intent.providerId && record.preparation !== null && record.preparation.key === intent.preparationKey && record.preparation.consumedAtMs === null && record.preparation.expiresAtMs > now() && record.destroyRequestedAtMs === null && record.sharedHost === false && record.nodeDeviceId !== null && record.leaseId !== null;
	}) : [];
	const maintain = async (environmentId) => {
		if (signal.aborted) return;
		if (environmentId) await noteDemand(environmentId).catch(() => {
			if (!signal.aborted) options.warn("Prepared snapshot demand could not be recorded");
		});
		await schedule().catch(() => {
			if (!signal.aborted) options.warn("Prepared worker maintenance failed; cleanup will retry");
		});
	};
	const canPruneDemand = (record, nowMs) => {
		const demandAtMs = demandAt(record);
		if (demandAtMs === void 0 || !readWorkerProjectPreparation(record.profileSnapshot.project)) return true;
		try {
			const timeout = options.resolveProvider(record.providerId)?.resolvePreparedIdleTimeoutMs?.(snapshotSettings(record));
			return timeout !== void 0 && Number.isSafeInteger(timeout) && timeout > 0 && demandAtMs + timeout <= nowMs;
		} catch {
			return false;
		}
	};
	const cancelPreparation = async (environmentId) => {
		await store.ready();
		const record = store.get(environmentId);
		const controller = preparations.get(environmentId);
		if (record?.preparation && await retire(record, "invalidated")) controller?.abort();
	};
	return {
		schedule,
		noteDemand,
		candidates,
		maintain,
		canPruneDemand,
		cancelPreparation
	};
}
//#endregion
//#region src/gateway/worker-environments/provider-intent.ts
function allocationSnapshot(profile, { machineClass, os, executionMode }) {
	const { project: _project, ...snapshot } = profile;
	return {
		...snapshot,
		...machineClass === void 0 ? {} : { machineClass },
		...os === void 0 ? {} : { os },
		...executionMode === void 0 ? {} : { executionMode }
	};
}
function projectReplayIdentity(project) {
	if (!isRecord(project)) return project;
	const identity = { ...project };
	delete identity.label;
	if (!Object.hasOwn(identity, "source")) delete identity.root;
	return identity;
}
/** Admits one immutable allocation intent before the provider lifecycle can allocate a lease. */
function createWorkerProviderIntent(options) {
	const preparedIntents = /* @__PURE__ */ new WeakMap();
	const assertPreparedIntentCurrent = (profileId, intent) => {
		const prepared = preparedIntents.get(intent);
		if (!prepared || prepared.profileId !== profileId) throw options.serviceError("invalid_state", "Worker preparation is not owned by this lifecycle");
		prepared.assertCurrent();
	};
	const { store, inState, serviceError, withLock, providerFor, requireWorkerProfile, resumeProvision } = options;
	const resolveProfile = (profileId, createOptions) => {
		createOptions.signal?.throwIfAborted();
		if (options.isStopping()) throw serviceError("invalid_state", "Worker environment service is stopping");
		const normalizedProfileId = profileId.trim();
		if (!normalizedProfileId || normalizedProfileId !== profileId) throw serviceError("invalid_profile", "Worker profile id must be non-empty and trimmed");
		const { inherited } = createOptions;
		let provider;
		let providerId;
		let profileSnapshot;
		const profiles = options.getConfig().cloudWorkers?.profiles;
		const configuredProfile = profiles && Object.hasOwn(profiles, normalizedProfileId) ? profiles[normalizedProfileId] : void 0;
		if (inherited) {
			providerId = normalizeCapabilityProviderId(inherited.providerId) ?? inherited.providerId;
			if (providerId !== inherited.providerId) throw serviceError("invalid_profile", "Inherited worker provider id is not canonical");
			requireInheritedWorkerProfileAuthorization(normalizedProfileId, providerId, inherited.profileSnapshot.settings, configuredProfile?.provider, serviceError);
			provider = providerFor(providerId);
			if ((normalizeCapabilityProviderId(provider.id) ?? provider.id) !== providerId) throw serviceError("invalid_profile", "Inherited worker provider identity changed");
			profileSnapshot = inherited.profileSnapshot;
		} else {
			if (!configuredProfile) throw serviceError("profile_not_found", `Unknown worker profile: ${normalizedProfileId}`);
			provider = providerFor(configuredProfile.provider);
			providerId = normalizeCapabilityProviderId(provider.id) ?? provider.id;
			const settings = requireWorkerProfile(configuredProfile.settings ?? {});
			profileSnapshot = {
				install: configuredProfile.install ?? "bundle",
				settings
			};
		}
		return {
			provider,
			providerId,
			profileSnapshot: structuredClone(requireWorkerProfile(allocationSnapshot(profileSnapshot, createOptions)))
		};
	};
	const prepareIntent = async (profileId, createOptions = {}) => {
		const resolved = resolveProfile(profileId, createOptions);
		const { provider, providerId } = resolved;
		const { signal, projectPath } = createOptions;
		let profileSnapshot = resolved.profileSnapshot;
		const machineClass = typeof profileSnapshot.machineClass === "string" ? profileSnapshot.machineClass : void 0;
		const os = typeof profileSnapshot.os === "string" ? profileSnapshot.os : void 0;
		let assertArtifactsCurrent;
		let repositoryAdmission;
		const profile = requireWorkerProfile(profileSnapshot.settings);
		const profileOptions = {
			inherited: createOptions.inherited ? structuredClone(createOptions.inherited) : void 0,
			machineClass: createOptions.machineClass,
			os: createOptions.os,
			executionMode: createOptions.executionMode
		};
		const assertProfileCurrent = () => {
			const current = resolveProfile(profileId, profileOptions);
			if (current.provider !== provider || !isDeepStrictEqual(current.profileSnapshot, resolved.profileSnapshot)) throw serviceError("invalid_profile", "Worker profile changed during preparation");
		};
		if ([
			projectPath,
			createOptions.repository,
			createOptions.projectRepository
		].filter(Boolean).length > 1) throw serviceError("invalid_profile", "Worker preparation must have exactly one project source");
		if ((projectPath || createOptions.repository || createOptions.projectRepository) && provider.supportsProjectPreparation?.(profile, machineClass, os)) {
			if (!options.projectNamespace) throw serviceError("invalid_state", "Worker project preparation namespace is unavailable");
			if (createOptions.repository || createOptions.projectRepository) repositoryAdmission = await prepareRepositoryWorkerProjectSource({
				...createOptions.projectRepository ? { expected: createOptions.projectRepository } : { repository: createOptions.repository },
				namespace: options.projectNamespace,
				getConfig: options.getConfig,
				assertCurrent: assertProfileCurrent,
				signal,
				knownRecipe: (admittedProject) => {
					for (const record of store.list()) {
						const value = record.profileSnapshot.project;
						if (!isRecord(value) || value.key !== admittedProject.key || value.baseCommit !== admittedProject.baseCommit) continue;
						const cached = readWorkerProjectSnapshot(value);
						const preparation = readWorkerProjectPreparation(value);
						if (cached && "source" in cached && preparation && isDeepStrictEqual(cached, admittedProject)) return {
							project: cached,
							setupRecipe: preparation.setupRecipe
						};
					}
				}
			});
			const project = repositoryAdmission?.project ?? (projectPath ? await prepareWorkerProjectSnapshot({
				localPath: projectPath,
				namespace: options.projectNamespace,
				baseCommit: createOptions.projectCommit,
				signal
			}) : void 0);
			signal?.throwIfAborted();
			if (project) {
				const target = provider.resolvePreparationTarget?.(profile, machineClass, os);
				const setupRecipe = target ? "source" in project ? repositoryAdmission?.setupRecipe : await readWorkerProjectSetupRecipe(project, signal) : void 0;
				signal?.throwIfAborted();
				if (target && provider.requiresNodeEnrollment && options.prepareNodeArtifacts && (!setupRecipe || createOptions.runSetupScript === false || createOptions.setupAuthorized === true)) {
					const prepared = await options.prepareNodeArtifacts(profileSnapshot, signal);
					signal?.throwIfAborted();
					prepared.assertCurrent();
					assertArtifactsCurrent = prepared.assertCurrent;
					const preparation = createWorkerProjectPreparationIdentity({
						namespace: options.projectNamespace,
						providerId,
						profileId,
						profileSnapshot,
						project,
						target,
						artifacts: prepared.artifacts,
						setupRecipe,
						runSetupScript: createOptions.runSetupScript
					});
					profileSnapshot = {
						...profileSnapshot,
						project: {
							...project,
							preparation
						}
					};
				} else profileSnapshot = {
					...profileSnapshot,
					project
				};
			}
		}
		const assertCurrent = () => {
			assertProfileCurrent();
			assertArtifactsCurrent?.();
			repositoryAdmission?.assertCurrent();
		};
		assertCurrent();
		const preparation = readWorkerProjectPreparation(profileSnapshot.project);
		const intent = {
			providerId,
			profileSnapshot,
			...preparation ? { preparationKey: preparation.key } : {}
		};
		const admittedSnapshot = structuredClone(intent);
		preparedIntents.set(intent, {
			profileId,
			assertCurrent: () => {
				assertCurrent();
				if (!isDeepStrictEqual(intent, admittedSnapshot)) throw serviceError("invalid_state", "Prepared worker intent was changed after preparation");
			}
		});
		return intent;
	};
	const prepareRetention = async (record, signal) => {
		const project = readWorkerProjectSnapshot(record.profileSnapshot.project);
		const preparation = readWorkerProjectPreparation(record.profileSnapshot.project);
		if (!project || !preparation || !options.prepareNodeArtifacts || !options.projectNamespace) return;
		const createOptions = {
			machineClass: typeof record.profileSnapshot.machineClass === "string" ? record.profileSnapshot.machineClass : void 0,
			os: typeof record.profileSnapshot.os === "string" ? record.profileSnapshot.os : void 0,
			executionMode: record.profileSnapshot.executionMode === "worker-turn" || record.profileSnapshot.executionMode === "remote-exec" ? record.profileSnapshot.executionMode : void 0,
			signal
		};
		const { provider, providerId, profileSnapshot } = resolveProfile(record.profileId, createOptions);
		const profile = requireWorkerProfile(profileSnapshot.settings);
		const target = provider.resolvePreparationTarget?.(profile, createOptions.machineClass, createOptions.os);
		if (providerId !== record.providerId || !target || !provider.requiresNodeEnrollment || !provider.supportsProjectPreparation?.(profile, createOptions.machineClass, createOptions.os)) return;
		const assertProfileCurrent = () => {
			const current = resolveProfile(record.profileId, createOptions);
			if (current.provider !== provider || !isDeepStrictEqual(current.profileSnapshot, profileSnapshot) || !isDeepStrictEqual(provider.resolvePreparationTarget?.(profile, createOptions.machineClass, createOptions.os), target) || !provider.requiresNodeEnrollment || !provider.supportsProjectPreparation?.(profile, createOptions.machineClass, createOptions.os)) throw serviceError("invalid_profile", "Prepared worker retention policy changed");
			if ("source" in project) {
				const config = options.getConfig();
				const { agent, identity } = project.source.owner;
				const agentIdentity = resolveConfiguredGitHubToolIdentity({
					config,
					agentId: agent.agentId,
					scope: "agent"
				});
				const systemIdentity = resolveConfiguredGitHubToolIdentity({
					config,
					agentId: agent.agentId,
					scope: "system"
				});
				const selected = agentIdentity ?? systemIdentity;
				const selectedSource = agentIdentity ? "agent-override" : "system-configured";
				if (!matchesAgentLifecycleBinding(config, agent) || (selected ? identity.source !== selectedSource || !("profileId" in identity) || identity.profileId !== selected.profileId : identity.source !== "anonymous" && identity.source !== "system-detected")) throw serviceError("invalid_profile", "Prepared repository owner selection changed");
			}
		};
		assertProfileCurrent();
		const prepared = await options.prepareNodeArtifacts(profileSnapshot, signal);
		const assertCurrent = () => {
			assertProfileCurrent();
			prepared.assertCurrent();
		};
		assertCurrent();
		const observed = createWorkerProjectPreparationIdentity({
			namespace: options.projectNamespace,
			providerId,
			profileId: record.profileId,
			profileSnapshot,
			project,
			target,
			artifacts: prepared.artifacts,
			setupRecipe: preparation.setupRecipe,
			runSetupScript: preparation.runSetupScript
		});
		return isDeepStrictEqual(observed, preparation) ? { assertCurrent } : void 0;
	};
	const createWithProfile = async (profileId, idempotencyKey, createOptions = {}, admittedIntent) => {
		const { machineClass, os, executionMode, projectPath, signal } = createOptions;
		const inherited = createOptions.inherited ? {
			providerId: createOptions.inherited.providerId,
			profileSnapshot: allocationSnapshot(createOptions.inherited.profileSnapshot, createOptions)
		} : void 0;
		signal?.throwIfAborted();
		if (options.isStopping()) throw serviceError("invalid_state", "Worker environment service is stopping");
		const normalizedProfileId = profileId.trim();
		if (!normalizedProfileId || normalizedProfileId !== profileId) throw serviceError("invalid_profile", "Worker profile id must be non-empty and trimmed");
		const { environmentId, provisionOperationId } = deriveEnvironmentIntent(idempotencyKey);
		return withLock(environmentId, async () => {
			await store.ready();
			signal?.throwIfAborted();
			if (options.isStopping()) throw serviceError("invalid_state", "Worker environment service is stopping");
			const existing = store.get(environmentId);
			if (existing) {
				const existingProject = readWorkerProjectSnapshot(existing.profileSnapshot.project);
				if (existingProject && projectPath) {
					if ("source" in existingProject) throw serviceError("invalid_profile", "Idempotency key belongs to another project");
					if (!options.projectNamespace) throw serviceError("invalid_state", "Worker project preparation namespace is unavailable");
					const { commonDir } = await resolveGitRepositoryPaths(await fs.realpath(projectPath), { signal });
					signal?.throwIfAborted();
					if (workerLocalProjectKey(options.projectNamespace, commonDir) !== existingProject.key) throw serviceError("invalid_profile", "Idempotency key belongs to another project");
					if (createOptions.projectCommit !== void 0 && createOptions.projectCommit !== existingProject.baseCommit) throw serviceError("invalid_profile", "Idempotency key belongs to another project preparation");
				}
				const requested = admittedIntent ?? (createOptions.repository || createOptions.projectRepository ? await prepareIntent(profileId, createOptions) : void 0);
				if (requested) {
					signal?.throwIfAborted();
					assertPreparedIntentCurrent(profileId, requested);
					if (!isDeepStrictEqual(projectReplayIdentity(existing.profileSnapshot.project), projectReplayIdentity(requested.profileSnapshot.project))) throw serviceError("invalid_profile", "Idempotency key belongs to another project preparation");
				}
				if (existing.profileId !== normalizedProfileId || inherited !== void 0 && (existing.providerId !== inherited.providerId || !isDeepStrictEqual(existing.profileSnapshot, {
					...inherited.profileSnapshot,
					...existingProject ? { project: existing.profileSnapshot.project } : {}
				})) || inherited === void 0 && (existing.profileSnapshot.machineClass !== machineClass || existing.profileSnapshot.os !== os || existing.profileSnapshot.executionMode !== executionMode)) throw serviceError("invalid_profile", "Idempotency key belongs to another profile");
				if (existing.destroyRequestedAtMs !== null) return existing;
				if (!existing.leaseId && inState(existing, "requested", "provisioning")) return resumeProvision(existing, void 0, signal);
				return existing;
			}
			const admitted = admittedIntent ?? await prepareIntent(profileId, {
				...createOptions,
				setupAuthorized: createOptions.setupAuthorized ?? createOptions.runSetupScript !== void 0
			});
			signal?.throwIfAborted();
			assertPreparedIntentCurrent(profileId, admitted);
			const current = resolveProfile(profileId, createOptions);
			const { project: _project, ...admittedProfile } = admitted.profileSnapshot;
			if (admitted.providerId !== current.providerId || !isDeepStrictEqual(admittedProfile, current.profileSnapshot) || admitted.preparationKey !== readWorkerProjectPreparation(admitted.profileSnapshot.project)?.key) throw serviceError("invalid_profile", "Prepared worker intent no longer matches its profile");
			const { provider } = current;
			const { providerId, profileSnapshot } = admitted;
			const intent = await store.createIntent({
				environmentId,
				providerId,
				profileId: normalizedProfileId,
				profileSnapshot,
				provisionOperationId
			}, () => {
				signal?.throwIfAborted();
				assertPreparedIntentCurrent(profileId, admitted);
			});
			return resumeProvision(intent, provider, signal);
		});
	};
	return {
		prepareIntent,
		prepareRetention,
		assertPreparedIntentCurrent,
		createWithProfile
	};
}
//#endregion
//#region src/gateway/worker-environments/provider-machine-catalog.ts
function createWorkerMachineCatalog(options) {
	const { requireWorkerProfile } = options;
	const machineCatalogs = /* @__PURE__ */ new Map();
	const machineShapeListeners = /* @__PURE__ */ new Set();
	let machineShapeVersion = 0;
	const machineCatalogChanged = (profileId, catalog) => {
		if (machineCatalogs.get(profileId) === catalog) {
			machineShapeVersion += 1;
			for (const listener of machineShapeListeners) try {
				listener(profileId);
			} catch {
				options.warn("Worker machine metadata change reporting failed");
			}
		}
	};
	const machineCatalogFor = (profileId) => {
		const profile = options.getConfig().cloudWorkers?.profiles?.[profileId];
		if (!profile) return;
		const settings = requireWorkerProfile(profile.settings ?? {});
		const provider = options.resolveProvider(profile.provider);
		let catalog = machineCatalogs.get(profileId);
		if (!catalog || catalog.providerId !== profile.provider || catalog.provider !== provider || !isDeepStrictEqual(catalog.settings, settings)) {
			catalog = {
				providerId: profile.provider,
				provider,
				settings: structuredClone(settings)
			};
			try {
				const displayId = provider?.resolveDisplayId?.(structuredClone(settings));
				if (typeof displayId === "string" && /^[a-z][a-z0-9-]{0,63}$/.test(displayId) && displayId.trim() === displayId) catalog.providerDisplayId = displayId;
			} catch {}
			machineCatalogs.set(profileId, catalog);
			machineCatalogChanged(profileId, catalog);
		}
		return catalog;
	};
	const listMachineOptions = async (profileId) => {
		const catalog = machineCatalogFor(profileId);
		if (!catalog) return;
		const machines = normalizeWorkerMachineOptions(await options.resolveProvider(catalog.providerId)?.listMachineOptions?.(catalog.settings));
		if (!isDeepStrictEqual(catalog.machines, machines)) {
			catalog.machines = machines;
			machineCatalogChanged(profileId, catalog);
		}
		return machines;
	};
	const listOperatingSystems = async (profileId) => {
		const catalog = machineCatalogFor(profileId);
		if (!catalog) return;
		const systems = normalizeWorkerOperatingSystems(await options.resolveProvider(catalog.providerId)?.listOperatingSystems?.(catalog.settings));
		if (!isDeepStrictEqual(catalog.systems, systems)) {
			catalog.systems = systems;
			machineCatalogChanged(profileId, catalog);
		}
		return systems;
	};
	const loadMachineShape = async (profileId) => {
		const catalog = machineCatalogFor(profileId);
		if (!catalog || catalog.warmup) return catalog?.warmup;
		const warmup = Promise.allSettled([catalog.machines === void 0 ? listMachineOptions(profileId) : void 0, catalog.systems === void 0 ? listOperatingSystems(profileId) : void 0]).then((results) => {
			const failure = results.find((result) => result.status === "rejected");
			if (failure) throw failure.reason;
		}).finally(() => {
			catalog.warmup = void 0;
		});
		catalog.warmup = warmup;
		return warmup;
	};
	const readMachineShape = (record) => {
		if (!record) return;
		const snapshot = record.profileSnapshot;
		const machineClass = typeof snapshot.machineClass === "string" ? snapshot.machineClass : void 0;
		const requestedOs = typeof snapshot.os === "string" ? snapshot.os : void 0;
		const cached = machineCatalogs.get(record.profileId);
		const catalog = cached?.providerId === record.providerId && isDeepStrictEqual(cached.settings, snapshot.settings) ? cached : void 0;
		const os = requestedOs ?? catalog?.systems?.find((system) => system.default)?.id;
		const eligible = catalog?.machines?.filter((option) => (!os || !option.os || option.os === os) && (machineClass ? option.id === machineClass : option.default));
		const machine = os ? eligible?.find((option) => option.os === os) ?? eligible?.find((option) => !option.os) : eligible?.length === 1 ? eligible[0] : void 0;
		const resolvedClass = machineClass ?? machine?.id;
		const osLabel = catalog?.systems?.find((system) => system.id === os)?.label;
		const shape = {
			...resolvedClass ? { class: resolvedClass } : {},
			...os ? { os } : {},
			...osLabel ? { osLabel } : {},
			...machine?.cpu !== void 0 ? { cpu: machine.cpu } : {},
			...machine?.memoryGb !== void 0 ? { memoryGb: machine.memoryGb } : {}
		};
		return Object.keys(shape).length ? shape : void 0;
	};
	return {
		readProviderDisplayId: (profileId) => {
			try {
				return machineCatalogFor(profileId)?.providerDisplayId;
			} catch {
				return;
			}
		},
		listMachineOptions,
		listOperatingSystems,
		readMachineShape,
		warmMachineShape: (profileId) => {
			loadMachineShape(profileId).catch(() => options.warn(`Worker machine catalog warmup failed for profile ${profileId}`));
		},
		subscribeMachineShapeChanged: (listener) => {
			machineShapeListeners.add(listener);
			return () => {
				machineShapeListeners.delete(listener);
			};
		},
		clearMachineShapeListeners: () => machineShapeListeners.clear(),
		machineShapeVersion: () => machineShapeVersion
	};
}
//#endregion
//#region src/gateway/worker-environments/provider-node-provisioning.ts
function createWorkerNodeProvisioning(options) {
	const now = options.now ?? Date.now;
	const prepareBundle = async (preparedInstallation, signal) => {
		const artifact = preparedInstallation?.install === "bundle" ? preparedInstallation : await options.prepareInstallation("bundle", signal);
		signal?.throwIfAborted();
		if (artifact.install !== "bundle") throw new Error("Worker bundle preparation returned the wrong install channel");
		return artifact;
	};
	const prepare = async (record, provider, signal, beforeProvision) => {
		if (!provider.requiresNodeEnrollment || !options.prepareNodeBootstrap) return;
		let identity;
		let installation;
		try {
			const nodeBootstrapSha256 = await options.prepareNodeBootstrap(record, signal);
			if (record.profileSnapshot.project) installation = await prepareBundle(void 0, signal);
			const preparation = readWorkerProjectPreparation(record.profileSnapshot.project);
			if (preparation && (preparation.artifacts.nodeBootstrapSha256 !== nodeBootstrapSha256 || installation?.install !== "bundle" || preparation.artifacts.workerArchiveSha256 !== installation.tarballSha256)) throw new Error("Prepared project runtime artifacts changed after admission");
			identity = {
				nodeBootstrapSha256,
				executionMode: record.profileSnapshot.executionMode === "remote-exec" ? "remote-exec" : "worker-turn",
				...installation?.install === "bundle" ? { workerBundleSha256: installation.tarballSha256 } : {}
			};
		} catch (error) {
			signal?.throwIfAborted();
			const current = options.store.get(record.environmentId);
			if (current?.provisionOperationId === record.provisionOperationId && current.ownerEpoch === record.ownerEpoch && current.destroyRequestedAtMs === null) {
				if (current.state === "requested") await options.move(current, "failed", { lastError: boundedWorkerError(error) });
				else if (current.state === "provisioning") await options.saveError(current, error);
			}
			throw options.serviceError("bootstrap_failure", `Worker node bootstrap preparation failed: ${boundedWorkerError(error)}`);
		}
		beforeProvision?.();
		const current = options.store.get(record.environmentId);
		if (options.isStopping() || !current || current.state !== record.state || current.provisionOperationId !== record.provisionOperationId || current.ownerEpoch !== record.ownerEpoch || current.destroyRequestedAtMs !== null) throw options.serviceError("invalid_state", "Worker provisioning changed during bootstrap preparation");
		return {
			identity,
			installation
		};
	};
	const createEnrollmentOperation = (record, provider, signal, preparedInstallation, identity, beforeProvision) => {
		if (provider.requiresNodeEnrollment !== true) return;
		const prepareNodeEnrollment = options.prepareNodeEnrollment;
		const prepareNodeRuntime = options.prepareNodeRuntime;
		if (!prepareNodeEnrollment) throw new Error("Worker node enrollment runtime is unavailable");
		let open = true;
		const controller = new AbortController();
		let runtime;
		let pendingRuntime;
		let pendingInstallation;
		const prepareInstallation = () => pendingInstallation ??= prepareBundle(preparedInstallation, signal);
		let enrollment;
		let pending;
		const close = () => {
			if (!open) return;
			open = false;
			signal?.removeEventListener("abort", close);
			controller.abort();
			if (runtime) {
				options.closeNodeRuntime?.(runtime);
				runtime = void 0;
			}
			if (enrollment) {
				options.closeNodeEnrollment?.(enrollment);
				enrollment = void 0;
			}
		};
		signal?.addEventListener("abort", close, { once: true });
		if (signal?.aborted) close();
		const assertCurrent = () => {
			beforeProvision?.();
			const current = options.store.get(record.environmentId);
			if (!open || options.isStopping() || current?.state !== "provisioning" || current.destroyRequestedAtMs !== null || current.provisionOperationId !== record.provisionOperationId || current.ownerEpoch !== record.ownerEpoch || current.preparation?.consumedAtMs === null && current.preparation.expiresAtMs <= now()) {
				controller.abort();
				throw new DOMException("Worker provisioning operation is closed", "AbortError");
			}
		};
		const assertRuntimeCurrent = () => {
			assertCurrent();
			if (pending) throw new Error("Worker node enrollment has already begun");
		};
		const assertRuntimeIdentity = (prepared) => {
			if (identity && (prepared.nodeBootstrap.sha256 !== identity.nodeBootstrapSha256 || "workerBundle" in prepared && identity.workerBundleSha256 !== void 0 && prepared.workerBundle.sha256 !== identity.workerBundleSha256)) throw new Error("Worker node runtime changed after provisioning preparation");
		};
		return {
			get installation() {
				return pendingInstallation ?? preparedInstallation;
			},
			prepareRuntime: prepareNodeRuntime ? async () => {
				assertRuntimeCurrent();
				pendingRuntime ??= (async () => {
					const artifact = await racePromiseWithAbortSignal(prepareInstallation(), controller.signal);
					assertRuntimeCurrent();
					const prepared = await prepareNodeRuntime(record, artifact, controller.signal);
					try {
						assertRuntimeCurrent();
						assertRuntimeIdentity(prepared);
					} catch (error) {
						options.closeNodeRuntime?.(prepared);
						throw error;
					}
					runtime = prepared;
					return prepared;
				})();
				return await pendingRuntime;
			} : void 0,
			begin: async () => {
				assertCurrent();
				if (runtime) {
					options.closeNodeRuntime?.(runtime);
					runtime = void 0;
				}
				pending ??= prepareNodeEnrollment(record, controller.signal).then((prepared) => {
					try {
						assertCurrent();
						assertRuntimeIdentity(prepared);
					} catch (error) {
						options.closeNodeEnrollment?.(prepared);
						throw error;
					}
					enrollment = prepared;
					return prepared;
				});
				const prepared = await pending;
				assertCurrent();
				prepareInstallation().catch(() => void 0);
				return prepared;
			},
			close
		};
	};
	const finish = async (record, lease, provider, patch, preparedInstallation, cancellation, preparedWorkspace, beforeProvision) => {
		const nodePatch = {
			...patch,
			nodeDeviceId: lease.node.deviceId,
			sshEndpoint: null
		};
		const preparation = readWorkerProjectPreparation(record.profileSnapshot.project);
		const enrollmentOwner = options.store.get(record.environmentId);
		const assertCurrent = () => {
			cancellation?.assertActive();
			beforeProvision?.();
			const current = options.store.get(record.environmentId);
			if (options.isStopping() || !current || current.state !== record.state || current.provisionOperationId !== record.provisionOperationId || current.ownerEpoch !== record.ownerEpoch || current.preparation?.consumedAtMs === null && current.preparation.expiresAtMs <= now() || current.preparation !== null && current.preparation.consumedAtMs !== null || preparation !== void 0 && (!enrollmentOwner?.nodeSetupId || current.nodeSetupId !== enrollmentOwner.nodeSetupId || current.nodeDeviceId !== lease.node.deviceId) || options.store.get(record.environmentId)?.destroyRequestedAtMs !== null) throw new Error("Prepared worker provisioning owner is no longer current");
		};
		let nodeBuild;
		try {
			assertCurrent();
			if (!options.ensureNodeWorkerBundle) throw new Error("Device worker bundle installer is unavailable");
			const artifact = await prepareBundle(await preparedInstallation, cancellation?.signal);
			assertCurrent();
			if (preparation && artifact.tarballSha256 !== preparation.artifacts.workerArchiveSha256) throw new Error("Worker bundle differs from its admitted preparation");
			const prewarm = record.profileSnapshot.executionMode !== "remote-exec" && !await options.store.hasSessionAttachment(record.environmentId);
			assertCurrent();
			nodeBuild = await options.ensureNodeWorkerBundle({
				deviceId: lease.node.deviceId,
				artifact,
				prewarm,
				signal: cancellation?.signal,
				assertCurrent
			});
			assertCurrent();
			if (preparation) {
				if (lease.sharedHost !== false || !preparedWorkspace || preparedWorkspace.preparationKey !== preparation.key || preparedWorkspace.cacheKey !== preparation.cacheKey || !options.registerPreparedWorkspace) throw new Error("Prepared worker requires its dedicated registered workspace");
				await options.registerPreparedWorkspace({
					record: options.store.get(record.environmentId),
					deviceId: lease.node.deviceId,
					workspace: preparedWorkspace,
					assertCurrent,
					signal: cancellation?.signal
				});
				assertCurrent();
			}
		} catch (error) {
			await cancellation?.settleStopIntent();
			return await options.failBootstrap(record, lease.leaseId, provider, error, nodePatch);
		}
		return options.commitReady(record, {
			...nodeBuild,
			installKind: "bundle"
		}, nodePatch, assertCurrent);
	};
	return {
		prepare,
		createEnrollmentOperation,
		finish
	};
}
//#endregion
//#region src/gateway/worker-environments/provider-owner-lifecycle.ts
function createWorkerProviderOwnerLifecycle(options) {
	const { store, serviceError, move, inState, callProvider, saveError, withLock, providerFor, requireWorkerProfile } = options;
	const tunnels = options.tunnelManager;
	const lifecycleLease = (record, leaseId) => ({
		leaseId,
		profile: requireWorkerProfile(record.profileSnapshot.settings)
	});
	const identityResolverFor = (record, provider, leaseId) => {
		const profile = requireWorkerProfile(record.profileSnapshot.settings);
		const resolveSshIdentity = options.resolveSshIdentity;
		return async (keyRef) => {
			if (!resolveSshIdentity) throw new Error("Worker SSH identity resolution is unavailable");
			return await callProvider(record.environmentId, () => resolveSshIdentity({
				provider,
				leaseId,
				profile,
				keyRef
			}));
		};
	};
	const requireCurrentOwner = (record) => {
		const current = store.get(record.environmentId);
		if (!current || current.ownerEpoch !== record.ownerEpoch || current.state !== record.state || current.leaseId !== record.leaseId || current.nodeDeviceId !== record.nodeDeviceId || current.sharedHost !== record.sharedHost || !isDeepStrictEqual(current.attachedSessionIds, record.attachedSessionIds)) throw serviceError("invalid_state", "Worker environment owner changed during teardown");
		return current;
	};
	const stopOwner = async (record, reason) => {
		requireCurrentOwner(record);
		const sessionId = record.attachedSessionIds.length === 1 ? record.attachedSessionIds[0] : null;
		if (sessionId) options.placementStore?.prepareWorkspaceResultOwnerRevocation({
			sessionId,
			environmentId: record.environmentId,
			ownerEpoch: record.ownerEpoch
		}, new Error(record.lastError ?? "Cloud worker owner revoked before workspace recovery"));
		await store.revokeEnvironmentCredential(record.environmentId, {
			fenceWorkspaceTransfers: true,
			expectedOwnerEpoch: record.ownerEpoch,
			assertCurrent: () => {
				requireCurrentOwner(record);
			}
		});
		requireCurrentOwner(record);
		await tunnels?.stop(record.environmentId, record.ownerEpoch, record.nodeDeviceId !== null && record.sharedHost === false ? reason : void 0);
		return requireCurrentOwner(record);
	};
	const destroyLease = async (record, provider, lease) => {
		requireCurrentOwner(record);
		const timeoutMs = options.providerCallTimeoutMs === void 0 ? requireProviderOperationTimeoutMs("destroy", provider.resolveDestroyTimeoutMs?.(lease.profile)) : void 0;
		await options.callProvider(record.environmentId, () => {
			requireCurrentOwner(record);
			return provider.destroy(lease);
		}, timeoutMs);
	};
	const beginDrain = async (record) => {
		const failurePatch = record.teardownTerminalState === "failed" ? { lastError: record.lastError } : void 0;
		return inState(record, "bootstrapping", "ready", "attached", "idle") ? move(record, "draining", failurePatch) : record;
	};
	const beginDestroy = async (record) => {
		const failurePatch = record.teardownTerminalState === "failed" ? { lastError: record.lastError } : void 0;
		const draining = await beginDrain(record);
		if (draining.state === "draining") return move(draining, "destroying", failurePatch);
		if (draining.state === "destroying") return draining;
		throw serviceError("invalid_state", `Cannot destroy worker in state: ${record.state}`);
	};
	const finishProvenDestroy = async (record) => {
		const destroying = await beginDestroy(requireCurrentOwner(record));
		if (destroying.nodeSetupId) await options.retireNodeEnrollment?.(destroying);
		requireCurrentOwner(destroying);
		if (destroying.teardownTerminalState !== "failed") return move(destroying, "destroyed");
		return move(destroying, "failed", {
			leaseId: null,
			nodeDeviceId: null,
			sshEndpoint: null,
			sharedHost: false,
			lastError: destroying.lastError ?? "Worker bootstrap failed after provider teardown"
		});
	};
	const failBootstrap = async (record, leaseId, provider, error, failureCode = "bootstrap_failure", leasePatch) => {
		const detail = boundedWorkerError(error);
		const failureLabel = failureCode === "invalid_profile" ? "Worker provider returned an incompatible lease" : leasePatch?.nodeDeviceId ? "Worker node bootstrap failed" : "Worker bootstrap failed";
		const requested = await store.requestDestroy({
			environmentId: record.environmentId,
			state: record.state,
			terminalState: "failed",
			lastError: detail
		});
		const stopped = await stopOwner(requested);
		const draining = await move(stopped, "draining", {
			...leasePatch,
			lastError: detail
		});
		const destroying = await beginDestroy(draining);
		try {
			await destroyLease(destroying, provider, lifecycleLease(destroying, leaseId));
		} catch (cleanupError) {
			await saveError(destroying, /* @__PURE__ */ new Error(`${detail}; provider teardown pending: ${boundedWorkerError(cleanupError)}`));
			throw serviceError(failureCode, `${failureLabel}; teardown is pending: ${detail}`);
		}
		await finishProvenDestroy(destroying);
		throw serviceError(failureCode, `${failureLabel}: ${detail}`);
	};
	const finishConfirmedProvisionCleanup = async (record, error) => {
		const current = store.get(record.environmentId);
		if (!current || current.provisionOperationId !== record.provisionOperationId || current.ownerEpoch !== record.ownerEpoch) throw serviceError("invalid_state", "Worker provisioning owner changed during cleanup");
		const detail = boundedWorkerError(error.provisionError);
		const destroying = await store.adoptProvisionCleanupFailure({
			environmentId: record.environmentId,
			leaseId: error.leaseId,
			lastError: detail
		});
		await finishProvenDestroy(await stopOwner(destroying, "provider-destroyed"));
		throw serviceError("provider_failure", `Worker provider operation failed: ${detail}`);
	};
	const preserveIndeterminateProvisionCleanup = async (record, error) => {
		const detail = `${boundedWorkerError(error.provisionError, 480)}; provider teardown pending: ${boundedWorkerError(error.cleanupError, 480)}`;
		await store.adoptProvisionCleanupFailure({
			environmentId: record.environmentId,
			leaseId: error.leaseId,
			lastError: detail
		});
		throw serviceError("provider_failure", `Worker provider operation failed; teardown is pending: ${detail}`);
	};
	const cancelRequested = (record) => move(record, "failed", { lastError: "Provisioning canceled before provider allocation" });
	const finishDestroy = async (record, provider) => {
		let r = record;
		if (r.state === "requested") return cancelRequested(requireCurrentOwner(r));
		r = await stopOwner(r, "provider-destroying");
		r = r.nodeDeviceId !== null && r.sharedHost === false ? r : await beginDrain(r);
		const owningProvider = provider ?? providerFor(r.providerId);
		let leaseId = r.leaseId;
		if (!leaseId) {
			let allocation;
			try {
				allocation = requireWorkerAllocation(await callProvider(r.environmentId, () => {
					requireCurrentOwner(r);
					return owningProvider.resolveAllocation(requireWorkerProfile(r.profileSnapshot.settings), r.provisionOperationId);
				}));
			} catch (error) {
				await saveError(requireCurrentOwner(r), error);
				throw serviceError("provider_failure", boundedWorkerError(error));
			}
			r = await move(requireCurrentOwner(r), "draining", {
				...allocation,
				lastError: r.lastError
			});
			leaseId = allocation.leaseId;
		}
		const providerOwnsMachine = r.nodeDeviceId !== null && r.sharedHost === false;
		const destroying = providerOwnsMachine ? r : await beginDestroy(r);
		try {
			await destroyLease(destroying, owningProvider, lifecycleLease(destroying, leaseId));
		} catch (error) {
			await saveError(requireCurrentOwner(destroying), error);
			throw serviceError("provider_failure", boundedWorkerError(error));
		}
		return await finishProvenDestroy(providerOwnsMachine ? await stopOwner(destroying, "provider-destroyed") : destroying);
	};
	const destroy = async (environmentId, destroyOptions = {}) => {
		if (options.isStopping()) throw serviceError("invalid_state", "Worker environment service is stopping");
		return withLock(environmentId, async () => {
			await store.ready();
			const abandonment = destroyOptions.abandonment;
			abandonment?.authorize?.();
			let record = store.get(environmentId);
			if (!record) throw serviceError("environment_not_found", `Unknown worker environment: ${environmentId}`);
			if (inState(record, "destroyed", "failed", "orphaned") && (!abandonment || record.state === "destroyed" || record.state === "failed" && !record.leaseId)) return record;
			if (abandonment && (record.providerId !== "device" || record.ownerEpoch !== abandonment.ownerEpoch || !record.nodeDeviceId || record.sharedHost === false || record.attachedSessionIds.length !== 1 || record.attachedSessionIds[0] !== abandonment.sessionId)) throw serviceError("invalid_state", "Abandoned device worker owner changed before retirement");
			if (destroyOptions.requireUnattached && record.attachedSessionIds.length > 0) throw serviceError("invalid_state", "Attached cloud workers must be stopped through sessions.reclaim");
			if (destroyOptions.retryRequested === false && record.destroyRequestedAtMs !== null) throw serviceError("invalid_state", `Worker environment cleanup is still pending: ${record.lastError ?? record.state}`);
			const destroyOwner = record;
			record = await store.requestDestroy({
				environmentId,
				state: record.state,
				assertCurrent: () => {
					abandonment?.authorize?.();
					const current = requireCurrentOwner(destroyOwner);
					if (destroyOptions.requireUnattached && current.attachedSessionIds.length > 0) throw serviceError("invalid_state", "Attached cloud workers must be stopped through sessions.reclaim");
				},
				...abandonment ? {
					terminalState: "failed",
					lastError: FORCED_WORKER_ABANDONMENT_ERROR
				} : {}
			});
			try {
				const destroyed = await finishDestroy(record);
				abandonment?.authorize?.();
				return destroyed;
			} catch (error) {
				if (!abandonment || !(error instanceof WorkerTunnelOwnerDisconnectedError)) throw error;
				abandonment.authorize?.();
				const current = requireCurrentOwner(record);
				if (current.destroyRequestedAtMs === null || store.getCredential(environmentId)) throw serviceError("invalid_state", "Abandoned device worker authority is not fenced");
				return saveError(current, error);
			}
		});
	};
	return {
		identityResolverFor,
		requireCurrentOwner,
		stopOwner,
		destroyLease,
		beginDrain,
		finishProvenDestroy,
		lifecycleLease,
		finishDestroy,
		failBootstrap,
		finishConfirmedProvisionCleanup,
		preserveIndeterminateProvisionCleanup,
		destroy
	};
}
//#endregion
//#region src/gateway/worker-environments/provider-persisted-lease.ts
async function retireMismatchedWorkerLease(record, provider, store, finishDestroy) {
	const transport = record.nodeDeviceId ? "node" : record.sshEndpoint ? "ssh" : void 0;
	const modeError = transport ? resolveWorkerLeaseTransportError(provider, transport, record.profileSnapshot.executionMode) : void 0;
	if (!modeError || record.destroyRequestedAtMs !== null) return false;
	await finishDestroy(await store.requestDestroy({
		environmentId: record.environmentId,
		state: record.state,
		terminalState: "failed",
		lastError: modeError.message
	}), provider).catch(() => void 0);
	return true;
}
//#endregion
//#region src/gateway/worker-environments/provider-project-preparation.ts
async function prepareWorkerProviderProject(params) {
	const { project, preparation, record } = params;
	const repository = "source" in project ? await prepareRepositoryWorkerProjectSource({
		expected: project,
		namespace: params.namespace,
		getConfig: params.getConfig,
		assertCurrent: params.requireCurrent,
		signal: params.signal,
		knownRecipe: preparation ? () => ({
			project,
			setupRecipe: preparation.setupRecipe
		}) : void 0
	}) : void 0;
	params.requireCurrent();
	if (repository && preparation && repository.setupRecipe !== preparation.setupRecipe) throw new Error("Prepared repository recipe no longer matches its admission");
	return createWorkerProjectPreparation({
		project,
		namespace: params.namespace,
		...repository ? {
			revalidateRepositorySource: repository.revalidate,
			prepareRepositoryGitPack: repository.prepareGitPack
		} : {},
		preparation: preparation ? {
			...preparation,
			purpose: record.preparation ? "reserve" : "session",
			demandAtMs: record.preparation?.demandAtMs ?? record.createdAtMs
		} : void 0,
		setupAuthorized: true,
		signal: params.signal,
		requireCurrent: () => {
			params.requireCurrent();
			repository?.assertCurrent();
		}
	});
}
//#endregion
//#region src/gateway/worker-environments/provider-provisioning-cancellation.ts
function createWorkerProvisionCancellation(store, record, signal) {
	let owners = 1;
	const settled = createDeferredCore();
	let intentError;
	let stopIntent;
	const persistStop = async () => {
		try {
			await store.ready();
			const current = store.get(record.environmentId);
			if (current?.provisionOperationId === record.provisionOperationId && current.ownerEpoch === record.ownerEpoch && (current.state === "requested" || current.state === "provisioning" || current.state === "bootstrapping")) await store.requestDestroy({
				environmentId: current.environmentId,
				state: current.state,
				assertCurrent: () => {
					const owner = store.get(record.environmentId);
					if (owner?.provisionOperationId !== record.provisionOperationId || owner.ownerEpoch !== record.ownerEpoch) throw new Error("Worker cancellation owner changed before recording intent");
				}
			});
		} catch (error) {
			intentError = toErrorObject(error, "Worker cancellation intent failed");
		}
	};
	const requestStop = () => {
		stopIntent ??= persistStop();
	};
	signal.addEventListener("abort", requestStop, { once: true });
	if (signal.aborted) requestStop();
	const close = async () => {
		if (--owners === 0) {
			signal.removeEventListener("abort", requestStop);
			await stopIntent;
			settled.resolve();
		} else await stopIntent;
	};
	const settleStopIntent = async () => {
		await stopIntent;
		if (intentError !== void 0) throw intentError;
	};
	return {
		signal,
		settled: settled.promise,
		close,
		settleStopIntent,
		assertActive: () => {
			if (intentError !== void 0) throw intentError;
			signal.throwIfAborted();
		},
		retainProvider: (run) => {
			owners += 1;
			return async () => {
				try {
					signal.throwIfAborted();
					return await run();
				} finally {
					await close();
				}
			};
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/provider-lifecycle.ts
const ORPHANED_LEASE_ERROR = "Worker provider no longer recognizes the lease";
function createWorkerProviderLifecycle(options) {
	const { store, callBootstrap, callProvider, inState, move, saveError, serviceError } = options;
	const now = options.now ?? Date.now;
	const { commitReady, ensurePendingCredential } = options.credentialBroker;
	const requireWorkerProfile$1 = (value) => requireWorkerProfile(value, serviceError);
	const providerFor = (providerId) => {
		const provider = options.resolveProvider(providerId);
		if (provider) return provider;
		throw serviceError("provider_not_found", `Worker provider is unavailable: ${providerId}`);
	};
	const { identityResolverFor, requireCurrentOwner, stopOwner, beginDrain, finishProvenDestroy, lifecycleLease, finishDestroy, failBootstrap, finishConfirmedProvisionCleanup, preserveIndeterminateProvisionCleanup, destroy } = createWorkerProviderOwnerLifecycle({
		...options,
		providerFor,
		requireWorkerProfile: requireWorkerProfile$1
	});
	const machineCatalog = createWorkerMachineCatalog({
		getConfig: options.getConfig,
		resolveProvider: options.resolveProvider,
		warn: options.warn,
		requireWorkerProfile: requireWorkerProfile$1
	});
	const expirePrepared = async (record) => record.preparation?.consumedAtMs === null && record.preparation.expiresAtMs <= now() ? store.requestDestroy({
		environmentId: record.environmentId,
		state: record.state,
		lastError: "Unused prepared worker expired",
		assertCurrent: () => {
			requireCurrentOwner(record);
		}
	}) : record;
	const installFor = (record) => {
		const install = record.profileSnapshot.install;
		if (install === void 0 || install === "bundle") return "bundle";
		if (install === "npm") return "npm";
		throw serviceError("invalid_profile", "Worker profile has an invalid install method");
	};
	const nodeProvisioning = createWorkerNodeProvisioning({
		...options,
		commitReady,
		failBootstrap: async (record, leaseId, provider, error, patch) => await failBootstrap(record, leaseId, provider, error, "bootstrap_failure", patch)
	});
	const refreshRuntime = createWorkerRuntimeRefresher({
		...options,
		requireCurrentOwner,
		stopOwner,
		identityResolverFor
	});
	const finishBootstrap = async (record, provider, installation, cancellation) => {
		if (record.state !== "bootstrapping" || !record.leaseId || !record.sshEndpoint) throw serviceError("invalid_state", "Worker bootstrap requires a provisioned SSH lease");
		const leaseId = record.leaseId;
		const sshEndpoint = record.sshEndpoint;
		let receipt;
		try {
			receipt = await callBootstrap(installation, (signal) => options.bootstrapWorker({
				operationId: record.provisionOperationId,
				sshEndpoint,
				installation,
				resolveIdentity: identityResolverFor(record, provider, leaseId),
				signal: cancellation ? AbortSignal.any([signal, cancellation.signal]) : signal
			}));
			cancellation?.assertActive();
			if (!verifyWorkerAdmissionHandshake(receipt, installation)) throw new Error("Worker bootstrap receipt does not match the expected build identity");
		} catch (error) {
			await cancellation?.settleStopIntent();
			return await failBootstrap(record, leaseId, provider, error);
		}
		return commitReady(record, {
			...receipt,
			installKind: "bundle"
		}, {}, () => {
			cancellation?.assertActive();
			if (requireCurrentOwner(record).destroyRequestedAtMs !== null) throw serviceError("invalid_state", "Worker bootstrap owner is stopping");
		});
	};
	const finishProvision = async (initialRecord, provider, preparedInstallation, cancellation, nodeRuntimeIdentity, beforeProvision) => {
		let record = initialRecord;
		let lease;
		let attemptOpen = true;
		const closedAttempt = /* @__PURE__ */ new Error("Worker provisioning operation is closed");
		let preparationComplete = false;
		let provisioningTransition;
		let executionMode;
		let enrollmentOperation;
		let projectOperation;
		let expiredDuringProvision;
		try {
			const profile = requireWorkerProfile$1(record.profileSnapshot.settings);
			const requestedExecutionMode = record.profileSnapshot.executionMode;
			if (requestedExecutionMode !== void 0 && requestedExecutionMode !== "worker-turn" && requestedExecutionMode !== "remote-exec") throw new WorkerProviderError("Worker environment has an invalid placement execution mode");
			executionMode = requestedExecutionMode;
			if (executionMode && !provider.supportedExecutionModes?.includes(executionMode)) throw new Error(`Worker provider ${provider.id} does not support ${executionMode} placement`);
			const providerTimeoutMs = options.providerCallTimeoutMs === void 0 ? requireProviderOperationTimeoutMs("provision", provider.resolveProvisionTimeoutMs?.(profile)) : void 0;
			const preparation = readWorkerProjectPreparation(record.profileSnapshot.project);
			const machineClass = preparation?.target.machineClass ?? (typeof record.profileSnapshot.machineClass === "string" ? record.profileSnapshot.machineClass : void 0);
			const os = typeof record.profileSnapshot.os === "string" ? record.profileSnapshot.os : void 0;
			if (preparation && !isDeepStrictEqual(provider.resolvePreparationTarget?.(profile, machineClass, os), preparation.target)) throw new Error("Worker preparation allocation target changed");
			enrollmentOperation = nodeProvisioning.createEnrollmentOperation(record, provider, cancellation?.signal, preparedInstallation, nodeRuntimeIdentity, beforeProvision);
			const project = readWorkerProjectSnapshot(record.profileSnapshot.project);
			if (project) {
				if (!provider.supportsProjectPreparation?.(profile, machineClass, os) || !options.projectNamespace) throw new Error("Worker provider cannot resume its prepared project contract");
				const requireProjectOwner = () => {
					cancellation?.assertActive();
					beforeProvision?.();
					const current = requireCurrentOwner(record);
					if (options.isStopping() || current.destroyRequestedAtMs !== null || current.provisionOperationId !== record.provisionOperationId || !isDeepStrictEqual(current.profileSnapshot.project, record.profileSnapshot.project) || current.preparation?.consumedAtMs === null && current.preparation.expiresAtMs <= now()) throw new Error("Worker project preparation owner is no longer current");
				};
				projectOperation = await prepareWorkerProviderProject({
					project,
					preparation,
					record,
					namespace: options.projectNamespace,
					getConfig: options.getConfig,
					requireCurrent: requireProjectOwner,
					signal: cancellation?.signal
				});
			}
			const assertCurrent = () => {
				cancellation?.assertActive();
				if (!attemptOpen || options.isStopping()) throw closedAttempt;
				beforeProvision?.();
				const current = requireCurrentOwner(record);
				if (current.preparation?.consumedAtMs === null && current.preparation.expiresAtMs <= now()) {
					expiredDuringProvision = current;
					throw new Error("Worker provisioning operation is closed");
				}
				if (current.destroyRequestedAtMs !== null) throw new Error("Worker provisioning operation is closed");
				return current;
			};
			const provisionOptions = {
				profileId: record.profileId,
				assertCurrent,
				...machineClass ? { machineClass } : {},
				...os ? { os } : {},
				...executionMode ? { executionMode } : {},
				...enrollmentOperation ? {
					beginNodeEnrollment: enrollmentOperation.begin,
					prepareNodeRuntime: enrollmentOperation.prepareRuntime,
					nodeRuntimeIdentity
				} : {},
				...cancellation ? { signal: cancellation.signal } : {},
				...projectOperation ? { project: projectOperation.project } : {}
			};
			cancellation?.assertActive();
			const provision = async () => {
				assertCurrent();
				const preparedProvision = await provider.prepareProvision?.(profile, record.provisionOperationId, provisionOptions);
				const current = assertCurrent();
				if (provider.prepareProvision && typeof preparedProvision !== "function") throw new Error("Worker provider preparation must return an allocation operation");
				record = current.state === "requested" ? await (provisioningTransition = move(current, "provisioning", void 0, assertCurrent)) : current;
				assertCurrent();
				preparationComplete = true;
				return preparedProvision ? preparedProvision() : provider.provision(profile, record.provisionOperationId, provisionOptions);
			};
			lease = requireWorkerLease(await callProvider(record.environmentId, cancellation ? cancellation.retainProvider(provision) : provision, providerTimeoutMs));
		} catch (error) {
			attemptOpen = false;
			if (provisioningTransition) try {
				record = await provisioningTransition;
			} catch (transitionError) {
				if (transitionError !== closedAttempt) throw transitionError;
			}
			await cancellation?.settleStopIntent();
			if (expiredDuringProvision) record = await expirePrepared(expiredDuringProvision);
			if (WorkerProviderError.isCleanupIndeterminate(error)) return preserveIndeterminateProvisionCleanup(record, error);
			cancellation?.assertActive();
			if (WorkerProviderError.isCleanupComplete(error)) return await finishConfirmedProvisionCleanup(record, error);
			const detail = boundedWorkerError(error);
			const permanent = error instanceof WorkerProviderError || options.isServiceError(error, "invalid_profile");
			if (record.state === "requested" || preparationComplete && permanent) {
				await move(record, "failed", { lastError: detail });
				throw serviceError(permanent ? "invalid_profile" : "provider_failure", permanent ? `Worker provider rejected profile: ${detail}` : `Worker provider preparation failed: ${detail}`);
			}
			await saveError(record, error);
			throw serviceError("provider_failure", `Worker provider operation failed: ${detail}`);
		} finally {
			attemptOpen = false;
			projectOperation?.close();
			enrollmentOperation?.close();
		}
		const patch = {
			leaseId: lease.leaseId,
			sharedHost: lease.sharedHost === true,
			desktop: lease.desktop ?? null,
			...lease.node ? {
				nodeDeviceId: lease.node.deviceId,
				sshEndpoint: null
			} : {
				nodeDeviceId: null,
				sshEndpoint: lease.ssh
			}
		};
		if (cancellation?.signal.aborted) {
			await cancellation.settleStopIntent();
			await move(requireCurrentOwner(record), "draining", patch);
			cancellation.assertActive();
		}
		const leaseModeError = resolveWorkerLeaseTransportError(provider, lease.node ? "node" : "ssh", executionMode);
		if (leaseModeError) return await failBootstrap(record, lease.leaseId, provider, leaseModeError, "invalid_profile", patch);
		if (lease.node) return await nodeProvisioning.finish(record, lease, provider, patch, enrollmentOperation?.installation ?? preparedInstallation, cancellation, projectOperation?.getPreparedWorkspace(), beforeProvision);
		const bootstrapping = await move(record, "bootstrapping", patch);
		let installation = preparedInstallation;
		if (!installation) try {
			installation = await options.prepareInstallation(installFor(bootstrapping), cancellation?.signal);
			cancellation?.assertActive();
		} catch (error) {
			return await failBootstrap(bootstrapping, lease.leaseId, provider, error);
		}
		return finishBootstrap(bootstrapping, provider, installation, cancellation);
	};
	const resumeProvision = async (record, provider = providerFor(record.providerId), signal, retainProviderSettlement, beforeProvision) => {
		const pending = await expirePrepared(requireCurrentOwner(record));
		if (pending.destroyRequestedAtMs !== null) return finishDestroy(pending, provider);
		const cancellation = signal ? createWorkerProvisionCancellation(store, record, signal) : void 0;
		if (cancellation) retainProviderSettlement?.(cancellation.settled);
		try {
			let installation;
			beforeProvision?.();
			const preparedNode = await nodeProvisioning.prepare(record, provider, signal, beforeProvision);
			installation = preparedNode?.installation;
			cancellation?.assertActive();
			if (record.state === "requested" && record.destroyRequestedAtMs === null && !installation && provider.provisionBeforeInstallation !== true) {
				try {
					installation = await options.prepareInstallation(installFor(record), signal);
				} catch (error) {
					cancellation?.assertActive();
					const detail = boundedWorkerError(error);
					await move(record, "failed", { lastError: detail });
					throw serviceError("bootstrap_failure", `Worker installation preparation failed: ${detail}`);
				}
				cancellation?.assertActive();
			}
			beforeProvision?.();
			const current = await expirePrepared(requireCurrentOwner(record));
			if (current.destroyRequestedAtMs !== null) return finishDestroy(current, provider);
			return await finishProvision(current, provider, installation, cancellation, preparedNode?.identity, beforeProvision);
		} finally {
			await cancellation?.close();
		}
	};
	const reconcileRecord = async (initialRecord, signal, retainProviderSettlement, beforeProvision) => {
		let record = initialRecord;
		if (record.state === "requested" && record.destroyRequestedAtMs !== null) {
			await finishDestroy(record);
			return;
		}
		let currentBundle;
		if (record.destroyRequestedAtMs === null && inState(record, "ready", "idle", "attached")) try {
			currentBundle = await options.prepareInstallation("bundle", signal);
			if (record.bootstrapReceipt) {
				if (verifyWorkerAdmissionHandshake(record.bootstrapReceipt, currentBundle)) {
					const sessionId = record.state === "attached" ? record.attachedSessionIds[0] : null;
					if (record.state !== "attached" || sessionId) {
						await ensurePendingCredential(record, sessionId ?? null);
						record = store.get(record.environmentId) ?? record;
					}
				}
			}
		} catch {
			signal?.throwIfAborted();
		}
		let provider;
		try {
			provider = providerFor(record.providerId);
		} catch (error) {
			await saveError(record, error);
			return;
		}
		const leaseId = record.leaseId;
		if (!leaseId) {
			await (record.destroyRequestedAtMs !== null ? finishDestroy(record, provider) : resumeProvision(record, provider, signal, retainProviderSettlement, beforeProvision)).catch(() => void 0);
			return;
		}
		if (await retireMismatchedWorkerLease(record, provider, store, finishDestroy)) return;
		const inspection = await callProvider(record.environmentId, () => provider.inspect(lifecycleLease(record, leaseId))).then(requireWorkerLeaseStatus).catch(async (error) => {
			await saveError(record, error);
		});
		if (!inspection) return;
		const { status } = inspection;
		const teardownExpected = record.destroyRequestedAtMs !== null || record.state === "destroying";
		if (status === "destroyed") {
			requireCurrentOwner(record);
			const requested = record.destroyRequestedAtMs === null ? await store.requestDestroy({
				environmentId: record.environmentId,
				state: record.state,
				...!teardownExpected ? {
					terminalState: "failed",
					lastError: "Worker environment disappeared before teardown was requested"
				} : {}
			}) : record;
			const stopped = await stopOwner(requested, "provider-destroyed");
			const draining = await beginDrain(stopped);
			await finishProvenDestroy(draining).catch(async (error) => {
				await saveError(draining, error);
			});
			return;
		}
		if (status === "unknown") {
			requireCurrentOwner(record);
			const requested = teardownExpected ? record : await store.requestDestroy({
				environmentId: record.environmentId,
				state: record.state,
				terminalState: "failed",
				lastError: ORPHANED_LEASE_ERROR
			});
			await finishDestroy(requested, provider).catch(() => void 0);
			return;
		}
		if (status === "dormant") {
			if (teardownExpected) await finishDestroy(record, provider).catch(() => void 0);
			return;
		}
		const inspectedSharedHost = inspection.sharedHost === true;
		if (record.sharedHost !== null && record.sharedHost !== inspectedSharedHost) record = await stopOwner(record);
		record = await store.reconcileSharedHost({
			environmentId: record.environmentId,
			state: record.state,
			leaseId,
			sharedHost: inspectedSharedHost
		});
		if (record.destroyRequestedAtMs !== null) {
			await finishDestroy(record, provider).catch(() => void 0);
			return;
		}
		if (!record.sshEndpoint || record.state === "attached") {
			await refreshRuntime(record, provider, currentBundle, signal).catch(async (error) => {
				await saveError(requireCurrentOwner(record), error);
			});
			return;
		}
		if (record.state === "draining" && record.destroyRequestedAtMs === null) {
			record = await stopOwner(record);
			await move(record, "orphaned", { lastError: record.lastError ?? ORPHANED_LEASE_ERROR });
			return;
		}
		if (inState(record, "bootstrapping", "ready", "idle")) {
			let cancellation = signal ? createWorkerProvisionCancellation(store, record, signal) : void 0;
			if (cancellation) retainProviderSettlement?.(cancellation.settled);
			try {
				cancellation?.assertActive();
				let installation = currentBundle;
				try {
					installation ??= await options.prepareInstallation("bundle", signal);
				} catch (error) {
					if (record.bootstrapReceipt && inState(record, "ready", "idle")) {
						await saveError(record, error);
						return;
					}
					await failBootstrap(record, leaseId, provider, error).catch(() => void 0);
					return;
				}
				if (record.bootstrapReceipt && verifyWorkerAdmissionHandshake(record.bootstrapReceipt, installation)) {
					await ensurePendingCredential(record, null);
					return;
				}
				if (installFor(record) === "npm") try {
					installation = await options.prepareInstallation("npm", signal);
				} catch (error) {
					await failBootstrap(record, leaseId, provider, error).catch(() => void 0);
					return;
				}
				record = await stopOwner(record);
				cancellation?.assertActive();
				const bootstrapping = record.state === "bootstrapping" ? record : await move(record, "bootstrapping");
				if (cancellation && bootstrapping.ownerEpoch !== record.ownerEpoch) {
					await cancellation.close();
					cancellation = createWorkerProvisionCancellation(store, bootstrapping, cancellation.signal);
					retainProviderSettlement?.(cancellation.settled);
					cancellation.assertActive();
				}
				await finishBootstrap(bootstrapping, provider, installation, cancellation).catch(() => void 0);
				return;
			} finally {
				await cancellation?.close();
			}
		}
		if (inState(record, "draining", "destroying")) await finishDestroy(record, provider).catch(() => void 0);
	};
	const { createWithProfile, prepareIntent, prepareRetention, assertPreparedIntentCurrent } = createWorkerProviderIntent({
		...options,
		providerFor,
		requireWorkerProfile: requireWorkerProfile$1,
		resumeProvision
	});
	return {
		createWithProfile,
		prepareIntent,
		prepareRetention,
		assertPreparedIntentCurrent,
		resumePrepared: (record, signal, beforeReconcile) => options.withLock(record.environmentId, async () => {
			signal?.throwIfAborted();
			beforeReconcile?.();
			let current = store.get(record.environmentId);
			if (!current || !current.preparation || current.preparation.consumedAtMs !== null) return current;
			current = await expirePrepared(current);
			if (current.destroyRequestedAtMs !== null) return finishDestroy(current);
			const providerSettlements = [];
			try {
				await reconcileRecord(current, signal ?? new AbortController().signal, (settled) => providerSettlements.push(settled), beforeReconcile);
			} finally {
				await Promise.all(providerSettlements);
			}
			return store.get(record.environmentId);
		}),
		destroy,
		identityResolverFor,
		...machineCatalog,
		providerFor,
		reconcileRecord
	};
}
//#endregion
//#region src/gateway/worker-environments/session-attachment-service.ts
/** Owns conversation attachment authority; provider lifecycle continues to own every lease. */
function createWorkerEnvironmentSessionAttachments(options) {
	const { store, providerLifecycle } = options;
	const operations = new KeyedAsyncQueue();
	const creations = /* @__PURE__ */ new Map();
	const closingAttachments = /* @__PURE__ */ new Map();
	const currentSession = (identity) => {
		const target = resolveSessionEntryAccessTarget({
			cfg: options.getConfig(),
			agentId: identity.agentId,
			sessionKey: identity.sessionKey
		});
		return target.entry?.sessionId === identity.sessionId && target.entry.incognito !== true && target.entry.lifecycleRevision === identity.sessionLifecycleRevision;
	};
	const project = (record) => {
		if (!record || record.closedAtMs !== null || closingAttachments.has(record.sessionId) || options.isStopping() || !currentSession(record)) return;
		const environment = store.get(record.environmentId);
		if (!environment || environment.state !== "ready" && environment.state !== "idle" || environment.destroyRequestedAtMs !== null) return;
		return {
			sessionId: record.sessionId,
			sessionKey: record.sessionKey,
			agentId: record.agentId,
			...record.sessionLifecycleRevision ? { sessionLifecycleRevision: record.sessionLifecycleRevision } : {},
			environmentId: record.environmentId,
			generation: record.generation,
			ownerEpoch: environment.ownerEpoch
		};
	};
	const assertSessionAttachment = (binding) => {
		const current = project(store.getSessionAttachmentRecord(binding.sessionId));
		if (!current || current.environmentId !== binding.environmentId || current.ownerEpoch !== binding.ownerEpoch || current.generation !== binding.generation || current.agentId !== binding.agentId || current.sessionKey !== binding.sessionKey || current.sessionLifecycleRevision !== binding.sessionLifecycleRevision) throw new Error("Conversation environment attachment is no longer current");
	};
	const close = async (sessionId, authorize, environmentId, keepCreation) => {
		authorize();
		closingAttachments.set(sessionId, (closingAttachments.get(sessionId) ?? 0) + 1);
		try {
			await store.ready();
			const closed = await store.closeSessionAttachment(sessionId, () => {
				authorize();
				const current = store.getSessionAttachmentRecord(sessionId);
				if (environmentId && current?.environmentId !== environmentId) throw new Error("Conversation environment target changed");
			});
			for (const creation of creations.get(sessionId) ?? []) if (creation !== keepCreation) creation.abort(/* @__PURE__ */ new Error("Conversation environment was stopped"));
			if (!closed) return;
			const stopped = await providerLifecycle.destroy(closed.environmentId, { requireUnattached: true });
			if (stopped.state !== "destroyed" && !(stopped.state === "failed" && stopped.leaseId === null)) throw new Error(`Conversation environment cleanup is not confirmed (${stopped.state}); the existing lease remains owned`);
			return stopped;
		} finally {
			const remaining = closingAttachments.get(sessionId) - 1;
			if (remaining === 0) closingAttachments.delete(sessionId);
			else closingAttachments.set(sessionId, remaining);
		}
	};
	const attachments = {
		cancelSessionAttachmentCreations() {
			for (const pending of creations.values()) for (const creation of pending) creation.abort(/* @__PURE__ */ new Error("Worker environment service is stopping"));
		},
		getSessionAttachment: (sessionId) => closingAttachments.has(sessionId) ? void 0 : project(store.getSessionAttachmentRecord(sessionId)),
		findSessionAttachment: (identity) => project(store.findSessionAttachmentRecord(identity)),
		getSessionAttachmentStatus(sessionId) {
			const record = store.getSessionAttachmentRecord(sessionId);
			if (!record) return;
			const environment = store.get(record.environmentId);
			return environment ? {
				attachment: {
					...record,
					ownerEpoch: environment.ownerEpoch
				},
				environment
			} : void 0;
		},
		assertSessionAttachment,
		async touchSessionAttachment(binding) {
			await store.ready();
			assertSessionAttachment(binding);
			const record = store.getSessionAttachmentRecord(binding.sessionId);
			await store.touchSessionAttachment(record, () => assertSessionAttachment(binding));
			assertSessionAttachment(binding);
		},
		createSessionAttachment(input, authorize, callerSignal, onReserved) {
			const sessionId = input.sessionId;
			const creation = new AbortController();
			const pending = creations.get(sessionId) ?? /* @__PURE__ */ new Set();
			pending.add(creation);
			creations.set(sessionId, pending);
			return operations.enqueue(sessionId, async () => {
				await store.ready();
				const signal = callerSignal ? AbortSignal.any([callerSignal, creation.signal]) : creation.signal;
				try {
					const session = resolveSessionEntryAccessTarget({
						cfg: options.getConfig(),
						...input
					});
					const request = {
						...input,
						sessionLifecycleRevision: input.sessionLifecycleRevision ?? session.entry?.lifecycleRevision
					};
					const assertCurrent = () => {
						signal?.throwIfAborted();
						authorize();
						if (options.isStopping() || !currentSession(request)) throw new Error("Conversation environment requester is no longer current");
					};
					assertCurrent();
					let attachment = store.getSessionAttachmentRecord(request.sessionId);
					let environment = attachment && store.get(attachment.environmentId);
					if (attachment && attachment.closedAtMs === null && !currentSession(attachment)) {
						await close(request.sessionId, assertCurrent, attachment.environmentId, creation);
						assertCurrent();
						attachment = store.getSessionAttachmentRecord(request.sessionId);
						environment = attachment && store.get(attachment.environmentId);
					}
					const reused = Boolean(attachment && environment && attachment.closedAtMs === null && ![
						"destroyed",
						"failed",
						"orphaned"
					].includes(environment.state));
					let allocationKey;
					if (reused && attachment && environment) {
						if (environment.profileId !== request.profileId || request.machineClass !== void 0 && environment.profileSnapshot.machineClass !== request.machineClass || request.os !== void 0 && environment.profileSnapshot.os !== request.os) throw new Error("Conversation already owns a different environment; stop it before selecting another profile or machine");
						if (environment.destroyRequestedAtMs !== null) throw new Error("Conversation environment is stopping");
						await store.touchSessionAttachment(attachment, assertCurrent);
						const environmentId = environment.environmentId;
						await options.withLock(environmentId, async () => {
							assertCurrent();
							await onReserved?.({
								environmentId,
								reused: true
							});
							assertCurrent();
							const current = store.get(environmentId);
							if (current) await providerLifecycle.reconcileRecord(current, signal, void 0, assertCurrent);
						});
					} else {
						allocationKey = JSON.stringify([
							"conversation",
							request.agentId,
							request.sessionId,
							request.idempotencyKey
						]);
						const intent = await providerLifecycle.prepareIntent(request.profileId, {
							machineClass: request.machineClass,
							os: request.os,
							signal
						});
						assertCurrent();
						providerLifecycle.assertPreparedIntentCurrent(request.profileId, intent);
						const environmentIntent = deriveEnvironmentIntent(allocationKey);
						let reservationCreated = false;
						attachment = (await options.withLock(environmentIntent.environmentId, async () => {
							const reservation = await store.createSessionAttachmentIntent({
								...request,
								...environmentIntent,
								providerId: intent.providerId,
								profileSnapshot: intent.profileSnapshot
							}, assertCurrent);
							reservationCreated = true;
							const cancelReservation = async () => {
								if (store.get(reservation.environment.environmentId)?.state === "requested") await store.cancelSessionAttachmentReservation(reservation.attachment);
								else await store.closeSessionAttachment(request.sessionId, () => {
									const currentAttachment = store.getSessionAttachmentRecord(request.sessionId);
									if (currentAttachment?.environmentId !== reservation.attachment.environmentId || currentAttachment.generation !== reservation.attachment.generation) throw new Error("Conversation environment reservation changed before cleanup");
								});
							};
							let authorityFailure;
							const assertProvisionCurrent = () => {
								try {
									assertCurrent();
									providerLifecycle.assertPreparedIntentCurrent(request.profileId, intent);
								} catch (error) {
									authorityFailure ??= { error };
									throw error;
								}
							};
							try {
								assertProvisionCurrent();
								await onReserved?.({
									environmentId: reservation.environment.environmentId,
									reused: false
								});
								assertProvisionCurrent();
								await providerLifecycle.reconcileRecord(reservation.environment, signal, void 0, assertProvisionCurrent);
								if (authorityFailure) throw authorityFailure.error;
								assertProvisionCurrent();
								return reservation;
							} catch (error) {
								await cancelReservation();
								throw authorityFailure ? authorityFailure.error : error;
							}
						}).catch(async (error) => {
							if (reservationCreated) await providerLifecycle.destroy(environmentIntent.environmentId, { requireUnattached: true }).catch((cleanupError) => options.warn(`Cancelled conversation environment reservation cleanup will retry: ${boundedWorkerError(cleanupError)}`));
							throw error;
						})).attachment;
					}
					assertCurrent();
					const current = store.getSessionAttachmentRecord(request.sessionId);
					if (!attachment || current?.environmentId !== attachment.environmentId || current.generation !== attachment.generation || current.closedAtMs !== null) throw new Error("Conversation environment attachment changed during allocation");
					const result = store.get(attachment.environmentId);
					if (result.state !== "ready" && result.state !== "idle") throw new Error(result.lastError || `Conversation environment is ${result.state}`);
					return {
						attachment: {
							...current,
							ownerEpoch: result.ownerEpoch
						},
						environment: result,
						reused
					};
				} finally {
					pending.delete(creation);
					if (pending.size === 0 && creations.get(sessionId) === pending) creations.delete(sessionId);
				}
			});
		},
		destroySessionAttachment(request, authorize) {
			return close(request.sessionId, authorize, request.environmentId);
		},
		retireSessionAttachment(sessionId) {
			return close(sessionId, () => {});
		},
		async reconcileSessionAttachments() {
			await store.ready();
			for (const record of store.listSessionAttachmentRecords()) {
				if (options.isStopping()) return;
				const environment = store.get(record.environmentId);
				if (!environment || environment.state === "destroyed" || environment.state === "failed") continue;
				const sessionCurrent = currentSession(record);
				if (record.closedAtMs === null && sessionCurrent && (options.hasAttachedEnvironmentActivity?.(record.environmentId, environment.ownerEpoch) || listAgentRunsForSession(record).some((run) => hasLiveAgentRunContext(run.runId)))) {
					await store.touchSessionAttachment(record, () => {});
					continue;
				}
				const suspendAfter = options.getConfig().cloudWorkers?.profiles?.[environment.profileId]?.suspendAfter;
				const expired = suspendAfter && options.now() - record.lastUsedAtMs >= parseDurationMs(suspendAfter);
				if (record.closedAtMs !== null || !sessionCurrent || expired) await close(record.sessionId, () => {
					const current = store.getSessionAttachmentRecord(record.sessionId);
					if (!current || current.environmentId !== record.environmentId || current.generation !== record.generation || current.lastUsedAtMs !== record.lastUsedAtMs) throw new Error("Conversation environment changed before cleanup");
				}, record.environmentId).catch((error) => options.warn(`Conversation environment cleanup will retry (${record.environmentId}): ${boundedWorkerError(error)}`));
			}
		}
	};
	return {
		...attachments,
		retireSessionIdentityMutation(mutation) {
			const currentSessionId = "current" in mutation ? mutation.current.sessionId : void 0;
			if (mutation.previous.sessionId && (mutation.previous.sessionId !== currentSessionId || mutation.kind === "reset")) options.trackOperation(attachments.retireSessionAttachment(mutation.previous.sessionId)).catch((error) => options.warn(`Conversation environment cleanup will retry during reconciliation: ${boundedWorkerError(error)}`));
		},
		getSessionAttachmentStatus: (sessionId) => {
			const result = attachments.getSessionAttachmentStatus(sessionId);
			return result ? {
				...result,
				environment: options.environmentAccess.project(result.environment)
			} : void 0;
		},
		createSessionAttachment: (...args) => options.trackOperation(attachments.createSessionAttachment(...args).then((result) => ({
			...result,
			environment: options.environmentAccess.project(result.environment)
		}))),
		destroySessionAttachment: (...args) => options.trackOperation(attachments.destroySessionAttachment(...args).then((record) => record ? options.environmentAccess.project(record) : void 0)),
		prepareAttachedComputer: options.prepareAttachedComputer,
		execSessionAttachment: async (binding, command) => {
			attachments.assertSessionAttachment(binding);
			if (!options.runSessionEnvironmentCommand) throw new Error("Worker node execution transport is unavailable");
			await attachments.touchSessionAttachment(binding);
			command.assertCurrent?.();
			const result = await options.runSessionEnvironmentCommand(binding, {
				...command,
				assertCurrent: () => {
					attachments.assertSessionAttachment(binding);
					command.assertCurrent?.();
				}
			});
			attachments.assertSessionAttachment(binding);
			await attachments.touchSessionAttachment(binding);
			command.assertCurrent?.();
			return result;
		},
		openNodePortal: (request) => {
			if (!options.nodePortalCarrier) throw new Error("Worker node portal transport is unavailable");
			return options.nodePortalCarrier.open(request);
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-computer-rpc.ts
function createWorkerComputerRpc(params) {
	return async (identity, request, signal) => {
		const admitted = params.validate(identity);
		if (!admitted.ok) return admitted;
		if (!params.execute) return {
			ok: false,
			reason: "gateway-unavailable"
		};
		const assertCurrent = () => {
			signal?.throwIfAborted();
			const current = params.validate(identity);
			if (!current.ok) throw new Error(`Worker computer authority closed: ${current.closeReason}`);
		};
		let commandParams;
		try {
			commandParams = JSON.parse(request.paramsJson);
		} catch {
			return {
				ok: false,
				closeReason: "invalid-frame"
			};
		}
		try {
			const schema = request.command === "screen.snapshot" ? ScreenSnapshotParamsSchema : ComputerActParamsSchema;
			if (!(request.command === "computer.act" && Value.Check(NodeWorkerComputerCloseParamsSchema, commandParams)) && !Value.Check(schema, commandParams)) return {
				ok: false,
				closeReason: "invalid-frame"
			};
			assertCurrent();
			const result = await params.execute({
				identity,
				request,
				signal,
				assertCurrent
			});
			const current = params.validate(identity);
			if (!current.ok) return current;
			signal?.throwIfAborted();
			const response = {
				type: "res",
				id: "x".repeat(128),
				ok: true,
				payload: result
			};
			if (!Value.Check(WorkerComputerResultSchema, result) || Buffer.byteLength(JSON.stringify(response), "utf8") > 26214400) throw new Error("Computer result exceeds the worker image transport limit.");
			return {
				ok: true,
				result
			};
		} catch (error) {
			const current = params.validate(identity);
			if (!current.ok) return current;
			const message = error instanceof Error ? formatErrorMessage(error) : "Worker computer operation failed";
			return {
				ok: false,
				reason: "gateway-unavailable",
				message: truncateUtf16Safe(redactSensitiveText(message, { mode: "tools" }), 256)
			};
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-rpc.ts
var WorkerTranscriptAuthorityError = class extends Error {
	constructor(outcome) {
		super("Worker transcript authority closed");
		this.outcome = outcome;
	}
};
function createWorkerTurnRpc(options) {
	const { store } = options;
	const inference = options.inference;
	const now = options.now;
	const withLock = options.withLock;
	const observedAckCursors = /* @__PURE__ */ new Map();
	const pendingTerminalTurnFences = /* @__PURE__ */ new Map();
	const terminalTurnFences = /* @__PURE__ */ new Map();
	const workerAdmissionReceiptScope = randomUUID();
	let workerAdmissionOrdinal = 0;
	const placementClaim = (identity) => identity.turnClaim ?? void 0;
	const processTurnBinding = (identity) => {
		const turnClaim = placementClaim(identity);
		return turnClaim ? {
			turnClaim,
			credentialHash: identity.credentialHash
		} : void 0;
	};
	const admitWorkerAt = (admission, expectedBuild, nowMs) => {
		const claim = admission.sessionId !== null ? options.placementStore?.readWorkerTurnClaim({
			sessionId: admission.sessionId,
			environmentId: admission.environmentId,
			ownerEpoch: admission.ownerEpoch
		}) : void 0;
		return admitWorkerConnection({
			store,
			admission,
			expectedBuild,
			nowMs,
			...claim ? { turnClaim: claim } : {},
			allowExpiredCredential: true
		});
	};
	const finishWorkerAdmission = (admission, result, capability) => {
		if (!capability) return result;
		const reasonCode = result.ok ? "worker_admission_gate_allowed" : `worker_admission_${result.reason ?? "failed"}`.replaceAll("-", "_");
		workerAdmissionOrdinal += 1;
		capability.run((identity) => recordRuntimeActionDecision({
			token: identity.executionIdentityToken,
			family: "worker",
			operation: "admit",
			outcome: result.ok ? "allowed" : "denied",
			coverageState: "enforced",
			reasonCode,
			owner: "worker-runtime",
			decisionBoundary: "gateway.worker-admission",
			policyRefs: [
				"worker:credential",
				"worker:build",
				"worker:owner-epoch",
				"worker:turn-claim"
			],
			summary: result.ok ? "The current worker credential, build, owner epoch, and turn claim passed admission." : "Worker admission was denied by the current credential, build, owner, or claim gate.",
			remediation: result.ok ? [] : [{
				code: "reprovision_worker",
				text: "Redispatch the session so the worker receives the current build and credential binding."
			}],
			discriminator: JSON.stringify([
				admission.sessionId,
				admission.runId,
				admission.environmentId,
				admission.ownerEpoch,
				workerAdmissionReceiptScope,
				workerAdmissionOrdinal
			])
		})).catch(() => void 0);
		return result;
	};
	const matchesTurnBinding = (left, right) => sameWorkerSessionTurnClaim(left.turnClaim, right.turnClaim) && safeEqualSecret(left.credentialHash, right.credentialHash);
	const recordAckCursor = (binding, cursor) => {
		const current = observedAckCursors.get(binding.turnClaim.sessionId);
		const currentTurn = current && matchesTurnBinding(current, binding) ? current : void 0;
		const next = {
			...binding,
			transcriptSeq: "transcriptSeq" in cursor ? Math.max(currentTurn?.transcriptSeq ?? 0, cursor.transcriptSeq) : currentTurn?.transcriptSeq ?? 0,
			liveSeq: "liveSeq" in cursor ? Math.max(currentTurn?.liveSeq ?? 0, cursor.liveSeq) : currentTurn?.liveSeq ?? 0
		};
		observedAckCursors.set(binding.turnClaim.sessionId, next);
		return next;
	};
	const observedAckCursorFor = (binding) => {
		const observed = observedAckCursors.get(binding.turnClaim.sessionId);
		return observed && matchesTurnBinding(observed, binding) ? observed : void 0;
	};
	const validateWorkerPlacement = (identity) => {
		if (identity.sessionId === null && identity.runId === null) return "sessionless";
		if (!options.placementStore) return "invalid";
		const claim = placementClaim(identity);
		return claim && options.placementStore.validateWorkerTurn(claim) ? "durable" : "invalid";
	};
	const isTerminalLiveEvent = (request) => request.event.kind === "lifecycle" && (request.event.payload.phase === "finishing" || request.event.payload.phase === "end" || request.event.payload.phase === "error" && (request.event.payload.aborted === true || request.event.payload.fallbackExhaustedFailure === true));
	const validateAttachedWorkerRequest = (identity, runEpoch, request) => {
		if (options.isStopping()) return {
			ok: false,
			closeReason: "environment-unavailable"
		};
		const placement = validateWorkerPlacement(identity);
		if (placement === "invalid") return {
			ok: false,
			closeReason: "placement-mismatch"
		};
		const turnBinding = processTurnBinding(identity);
		const terminalFence = identity.sessionId ? terminalTurnFences.get(identity.sessionId) : void 0;
		if (turnBinding && terminalFence && matchesTurnBinding(terminalFence, turnBinding)) {
			if (!(request.kind === "transcript" && request.seq <= terminalFence.transcriptSeq || request.kind === "live" && request.seq <= terminalFence.liveSeq)) return {
				ok: false,
				closeReason: "placement-mismatch"
			};
		}
		const credential = store.getCredential(identity.environmentId);
		if (!credential || !safeEqualSecret(credential.credentialHash, identity.credentialHash)) return {
			ok: false,
			closeReason: "credential-replaced"
		};
		if (now() >= credential.expiresAtMs && placement !== "durable") return {
			ok: false,
			closeReason: "credential-expired"
		};
		const environment = store.get(identity.environmentId);
		if (!environment || environment.destroyRequestedAtMs !== null) return {
			ok: false,
			closeReason: "environment-unavailable"
		};
		if (runEpoch !== identity.ownerEpoch || runEpoch !== credential.ownerEpoch || runEpoch !== environment.ownerEpoch) return {
			ok: false,
			reason: "epoch-mismatch"
		};
		if (environment.state !== "attached" || !identity.sessionId || credential.sessionId !== identity.sessionId || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== identity.sessionId) return {
			ok: false,
			reason: "session-not-attached"
		};
		if (turnBinding && terminalFence && !matchesTurnBinding(terminalFence, turnBinding)) terminalTurnFences.delete(turnBinding.turnClaim.sessionId);
		return { ok: true };
	};
	const commitTranscript = (identity, request) => withLock(identity.environmentId, async () => {
		const assertCurrent = () => {
			const binding = validateAttachedWorkerRequest(identity, request.runEpoch, {
				kind: "transcript",
				seq: request.seq
			});
			if (!binding.ok) throw new WorkerTranscriptAuthorityError(binding);
		};
		try {
			assertCurrent();
			if (!options.applyTranscriptCommit) return {
				ok: false,
				closeReason: "gateway-unavailable"
			};
			const result = await options.applyTranscriptCommit({
				identity,
				request,
				assertCurrent
			});
			assertCurrent();
			if (result.ok || result.reason === "stale-base-leaf") {
				const placement = placementClaim(identity);
				const processTurn = processTurnBinding(identity);
				if (!placement || !processTurn) return {
					ok: false,
					closeReason: "placement-mismatch"
				};
				options.placementStore?.updateAckCursors({
					claim: placement,
					transcriptSeq: request.seq
				});
				recordAckCursor(processTurn, { transcriptSeq: request.seq });
			}
			return result;
		} catch (error) {
			if (error instanceof WorkerTranscriptAuthorityError) return error.outcome;
			throw error;
		}
	});
	const validateTool = (identity, toolName) => {
		const requestAdmission = validateAttachedWorkerRequest(identity, identity.ownerEpoch, { kind: "session-tool" });
		if (!requestAdmission.ok) return "closeReason" in requestAdmission ? requestAdmission : {
			ok: false,
			closeReason: "placement-mismatch"
		};
		const binding = placementClaim(identity);
		if (!binding || !options.placementStore?.isWorkerTurnToolAuthorized(binding, toolName)) return {
			ok: false,
			closeReason: "method-not-allowed"
		};
		return { ok: true };
	};
	const executeComputer = createWorkerComputerRpc({
		execute: options.executeComputer,
		validate: (identity) => validateTool(identity, "computer")
	});
	const executeSessionTool = async (identity, toolName, request, signal) => {
		const validate = () => validateTool(identity, toolName);
		const admitted = validate();
		if (!admitted.ok) return admitted;
		if (!options.executeSessionTool) return {
			ok: false,
			reason: "gateway-unavailable"
		};
		const operation = toolName === "skill_workshop" && Value.Check(WorkerSkillWorkshopParamsSchema, request) ? {
			toolName,
			request
		} : toolName === "sessions_spawn" && Value.Check(WorkerSessionsSpawnParamsSchema, request) ? {
			toolName,
			request
		} : toolName === "sessions_send" && Value.Check(WorkerSessionsSendParamsSchema, request) ? {
			toolName,
			request
		} : toolName === "portal" && Value.Check(WorkerPortalParamsSchema, request) ? {
			toolName,
			request
		} : void 0;
		if (!operation) return {
			ok: false,
			closeReason: "invalid-frame"
		};
		let result;
		try {
			result = await options.executeSessionTool({
				identity,
				...operation,
				...signal ? { signal } : {}
			});
		} catch (error) {
			result = { resultJson: serializeWorkerSessionToolResult(workerSessionToolErrorResult(error)) };
		}
		const current = validate();
		return current.ok ? {
			ok: true,
			result
		} : current;
	};
	const validateLiveEvent = (identity, request) => {
		const binding = validateAttachedWorkerRequest(identity, request.runEpoch, {
			kind: "live",
			seq: request.seq
		});
		if (!binding.ok) {
			if ("closeReason" in binding) return binding;
			return {
				ok: false,
				details: { reason: binding.reason }
			};
		}
		if (request.runId !== identity.runId) return {
			ok: false,
			closeReason: "placement-mismatch"
		};
	};
	const pushLiveEvent = async (identity, request) => {
		return await withLock(identity.environmentId, async () => {
			const invalid = validateLiveEvent(identity, request);
			if (invalid) return invalid;
			if (!options.liveEvents) return {
				ok: false,
				closeReason: "gateway-unavailable"
			};
			const placement = placementClaim(identity);
			const processTurn = processTurnBinding(identity);
			if (!placement || !processTurn) return {
				ok: false,
				closeReason: "placement-mismatch"
			};
			const observed = observedAckCursorFor(processTurn);
			const wasNewSequence = request.seq > (observed?.liveSeq ?? 0);
			const result = await options.liveEvents.apply({
				identity,
				request
			});
			const stale = validateLiveEvent(identity, request);
			if (stale) return stale;
			if (!result.ok) return result;
			recordAckCursor(processTurn, { liveSeq: result.result.ackedSeq });
			const pending = pendingTerminalTurnFences.get(placement.sessionId);
			if (pending && !matchesTurnBinding(pending, processTurn)) pendingTerminalTurnFences.delete(placement.sessionId);
			if (isTerminalLiveEvent(request) && wasNewSequence) pendingTerminalTurnFences.set(placement.sessionId, {
				...processTurn,
				terminalLiveSeq: request.seq
			});
			const terminal = pendingTerminalTurnFences.get(placement.sessionId);
			if (terminal && matchesTurnBinding(terminal, processTurn) && result.result.ackedSeq >= terminal.terminalLiveSeq) {
				options.placementStore?.updateAckCursors({
					claim: placement,
					liveSeq: result.result.ackedSeq
				});
				acknowledgeWorkerTurnFinishing(identity, result.result.ackedSeq, () => validateLiveEvent(identity, request) === void 0);
				terminalTurnFences.set(placement.sessionId, observedAckCursorFor(processTurn) ?? recordAckCursor(processTurn, { liveSeq: result.result.ackedSeq }));
				pendingTerminalTurnFences.delete(placement.sessionId);
			}
			return result;
		});
	};
	const revalidateInference = (identity, request) => {
		if (request.sessionId !== identity.sessionId) return "session-not-attached";
		const binding = validateAttachedWorkerRequest(identity, request.runEpoch, { kind: "inference" });
		return binding.ok ? null : "reason" in binding ? binding.reason : "session-not-attached";
	};
	const startInference = (identity, request, sink) => {
		if (request.sessionId !== identity.sessionId || request.runId !== identity.runId) return {
			ok: false,
			reason: "session-not-attached"
		};
		const binding = validateAttachedWorkerRequest(identity, request.runEpoch, { kind: "inference" });
		if (!binding.ok) return binding;
		return inference.start({
			identity,
			request,
			sink,
			revalidate: () => revalidateInference(identity, request)
		});
	};
	const cancelInference = (identity, request) => {
		if (request.sessionId !== identity.sessionId || request.runId !== identity.runId) return {
			ok: false,
			reason: "session-not-attached"
		};
		const binding = validateAttachedWorkerRequest(identity, request.runEpoch, { kind: "inference" });
		if (!binding.ok) return binding;
		return inference.cancel({
			identity,
			request,
			revalidate: () => revalidateInference(identity, request)
		});
	};
	return {
		admitWorker: async (admission) => {
			const claim = admission.sessionId === null || admission.runId === null ? void 0 : options.placementStore?.readWorkerTurnClaim({
				sessionId: admission.sessionId,
				environmentId: admission.environmentId,
				ownerEpoch: admission.ownerEpoch
			});
			const capability = claim?.runId === admission.runId ? options.placementStore?.getExecutionIdentityCapability?.(claim) : void 0;
			const finish = (result) => finishWorkerAdmission(admission, result, capability);
			if (options.isStopping()) return finish({
				ok: false,
				reason: "environment-unavailable"
			});
			const preflightAtMs = now();
			const preflight = admitWorkerAt(admission, admission.handshake, preflightAtMs);
			if (!preflight.ok) return finish(preflight);
			if (preflightAtMs >= preflight.identity.credentialExpiresAtMs) {
				const placement = placementClaim(preflight.identity);
				if (!placement || !options.placementStore?.validateWorkerTurn(placement)) return finish({
					ok: false,
					reason: "credential-expired"
				});
			}
			let expectedBuild;
			try {
				expectedBuild = await options.prepareInstallation("bundle");
			} catch {
				return finish({
					ok: false,
					reason: "environment-unavailable"
				});
			}
			if (options.isStopping()) return finish({
				ok: false,
				reason: "environment-unavailable"
			});
			const admittedAtMs = now();
			const admitted = admitWorkerAt(admission, expectedBuild, admittedAtMs);
			if (!admitted.ok) return finish(admitted);
			const expired = admittedAtMs >= admitted.identity.credentialExpiresAtMs;
			if (!options.placementStore || admitted.identity.sessionId === null && admitted.identity.runId === null) return finish(expired ? {
				ok: false,
				reason: "credential-expired"
			} : admitted);
			const placement = placementClaim(admitted.identity);
			if (!placement || !options.placementStore.validateWorkerTurn(placement)) return finish({
				ok: false,
				reason: expired ? "credential-expired" : "placement-mismatch"
			});
			return finish(admitted);
		},
		validateWorkerConnection: (identity) => {
			if (options.isStopping()) return "environment-unavailable";
			const placement = validateWorkerPlacement(identity);
			if (placement === "invalid") return "placement-mismatch";
			const environmentFailure = validateWorkerConnectionIdentity({
				store,
				identity,
				nowMs: now()
			});
			if (environmentFailure && !(environmentFailure === "credential-expired" && placement === "durable")) return environmentFailure;
			return null;
		},
		commitTranscript,
		pushLiveEvent,
		executeSessionTool,
		executeComputer,
		startInference,
		cancelInference,
		cancelInferenceForSession: (params) => inference.cancelSession(params.sessionId, params.runId),
		hasInferenceForSession: (sessionId, runId) => inference.hasSession(sessionId, runId),
		resolveInferenceSessionForRunId: (runId) => inference.resolveSessionIdForRunId(runId),
		clear: () => {
			observedAckCursors.clear();
			pendingTerminalTurnFences.clear();
			terminalTurnFences.clear();
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/service.ts
var WorkerEnvironmentServiceError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
const serviceError = (code, message) => new WorkerEnvironmentServiceError(code, message);
function createWorkerEnvironmentService(options) {
	const { store } = options;
	const warn = (message) => options.logger?.warn(message);
	const operations = new KeyedAsyncQueue();
	const providerOperations = new KeyedAsyncQueue();
	const activeOperations = /* @__PURE__ */ new Set();
	const now = options.now ?? Date.now;
	const tunnelLifecycle = createWorkerEnvironmentTransportLifecycle(options);
	const inference = createWorkerInferenceManager({
		execute: options.executeInference,
		getConfig: options.getConfig,
		...options.inferenceStore ? { store: options.inferenceStore } : {}
	});
	let reconcileInFlight;
	let interval;
	let unsubscribeSessionIdentityMutation;
	let unsubscribeTurnClaimClosed = options.placementStore?.registerTurnClaimClosedHandler((claim) => inference.cancelClaim(claim));
	let reconcileEnvironmentGuard;
	let reconcileEnvironmentGuardClosing = false;
	const guardedReconcileInFlight = /* @__PURE__ */ new Map();
	let stopping = false;
	const maintenanceAbort = new AbortController();
	let maintenanceInFlight;
	const inState = (record, ...states) => states.includes(record.state);
	const trackOperation = (operation) => {
		activeOperations.add(operation);
		const release = () => activeOperations.delete(operation);
		operation.then(release, release);
		return operation;
	};
	const withLock = (environmentId, task) => trackOperation(operations.enqueue(environmentId, task));
	const prepareInstallation = (install, signal) => {
		signal?.throwIfAborted();
		const preparation = trackOperation(Promise.resolve().then(() => options.prepareInstallation(install)));
		return racePromiseWithAbortSignal(preparation, signal);
	};
	const callProvider = async (environmentId, run, timeoutMs) => {
		let signalStarted;
		const started = new Promise((resolve) => {
			signalStarted = resolve;
		});
		const operation = trackOperation(providerOperations.enqueue(environmentId, async () => {
			signalStarted();
			return await run();
		}));
		await started;
		return await withTimeout(operation, options.providerCallTimeoutMs ?? timeoutMs ?? 3e5, "Worker provider operation");
	};
	const callBootstrap = async (installation, run) => {
		const controller = new AbortController();
		const operation = Promise.resolve().then(() => run(controller.signal));
		try {
			return await withTimeout(operation, options.bootstrapCallTimeoutMs ?? workerBootstrapOperationTimeoutMs(installation), "Worker bootstrap operation");
		} catch (error) {
			controller.abort();
			await operation.catch(() => void 0);
			throw error;
		}
	};
	const move = async (record, to, patch, assertCurrent) => {
		const next = await store.transition({
			environmentId: record.environmentId,
			from: record.state,
			expectedOwnerEpoch: record.ownerEpoch,
			to,
			patch,
			assertCurrent
		});
		if (to !== "ready" && to !== "idle" && to !== "attached") credentialBroker.clearEnvironment(record.environmentId);
		if (to !== "attached") {
			inference.cancelEnvironment(record.environmentId);
			options.liveEvents?.clearEnvironment(record.environmentId);
		}
		return next;
	};
	const saveError = async (record, error, assertCurrent) => {
		assertCurrent?.();
		if (record.teardownTerminalState === "failed" && record.lastError) return record;
		return store.recordError({
			environmentId: record.environmentId,
			state: record.state,
			error: boundedWorkerError(error),
			assertCurrent
		});
	};
	const credentialBroker = createWorkerCredentialBroker({
		...options,
		store,
		prepareInstallation,
		tunnelManager: tunnelLifecycle,
		now,
		isStopping: () => stopping,
		cancelInferenceEnvironment: (environmentId) => inference.cancelEnvironment(environmentId),
		inState,
		move,
		serviceError,
		withLock
	});
	const providerLifecycle = createWorkerProviderLifecycle({
		...options,
		now,
		store,
		prepareInstallation,
		tunnelManager: tunnelLifecycle,
		credentialBroker,
		warn,
		callBootstrap,
		callProvider,
		inState,
		isServiceError: (error, code) => error instanceof WorkerEnvironmentServiceError && error.code === code,
		isStopping: () => stopping,
		move,
		saveError,
		serviceError,
		withLock
	});
	const environmentAccess = createWorkerEnvironmentAccess({
		...options,
		store,
		prepareCurrentBundle: async () => await prepareInstallation("bundle"),
		now,
		identityResolverFor: providerLifecycle.identityResolverFor,
		inState,
		isStopping: () => stopping,
		providerFor: providerLifecycle.providerFor,
		serviceError,
		withLock
	});
	const sessionAttachments = createWorkerEnvironmentSessionAttachments({
		...options,
		providerLifecycle,
		environmentAccess,
		isStopping: () => stopping,
		now,
		warn,
		withLock,
		trackOperation
	});
	const preparedPool = createPreparedWorkerPool({
		store,
		getConfig: options.getConfig,
		resolveProvider: options.resolveProvider,
		prepareIntent: providerLifecycle.prepareIntent,
		prepareRetention: providerLifecycle.prepareRetention,
		assertIntentCurrent: providerLifecycle.assertPreparedIntentCurrent,
		reconcile: async (record, signal, beforeReconcile) => {
			await providerLifecycle.resumePrepared(record, signal, beforeReconcile);
		},
		now,
		signal: maintenanceAbort.signal,
		warn
	});
	const schedulePreparedRefill = (environmentId) => void trackOperation(preparedPool.maintain(environmentId));
	const turnRpc = createWorkerTurnRpc({
		...options,
		store,
		prepareInstallation,
		inference,
		isStopping: () => stopping,
		now,
		withLock
	});
	const reconcileEnvironmentCore = async (environmentId, signal, retainProviderSettlement) => {
		if (stopping) return;
		await withLock(environmentId, async () => {
			await store.ready();
			const current = store.get(environmentId);
			if (!current || inState(current, "destroyed", "failed", "orphaned")) return;
			await providerLifecycle.reconcileRecord(current, signal, retainProviderSettlement);
		});
	};
	const reconcileEnvironment = async (environmentId) => {
		if (stopping) return;
		const guard = reconcileEnvironmentGuard;
		if (!guard) {
			await reconcileEnvironmentCore(environmentId);
			return;
		}
		if (reconcileEnvironmentGuardClosing) return;
		const active = guardedReconcileInFlight.get(environmentId);
		if (active) {
			await active;
			return;
		}
		const operation = guard(environmentId, async (signal, retainProviderSettlement) => {
			await reconcileEnvironmentCore(environmentId, signal, retainProviderSettlement);
		});
		guardedReconcileInFlight.set(environmentId, operation);
		try {
			await operation;
		} finally {
			if (guardedReconcileInFlight.get(environmentId) === operation) guardedReconcileInFlight.delete(environmentId);
		}
	};
	const closeReconcileEnvironmentGuard = async (expected) => {
		const guard = reconcileEnvironmentGuard;
		if (!guard || expected && guard !== expected) return;
		reconcileEnvironmentGuardClosing = true;
		while (guardedReconcileInFlight.size > 0) await Promise.allSettled(guardedReconcileInFlight.values());
		if (reconcileEnvironmentGuard === guard) {
			reconcileEnvironmentGuard = void 0;
			reconcileEnvironmentGuardClosing = false;
		}
	};
	const installReconcileEnvironmentGuard = (guard) => {
		if (reconcileEnvironmentGuard) throw new Error("Worker environment reconciliation guard is already installed");
		reconcileEnvironmentGuard = guard;
		reconcileEnvironmentGuardClosing = false;
		return async () => await closeReconcileEnvironmentGuard(guard);
	};
	const reconcilePass = async (environmentId) => {
		await store.ready();
		if (environmentId === void 0) await sessionAttachments.reconcileSessionAttachments();
		const tasks = (environmentId === void 0 ? store.listForReconcile().filter((record) => record.preparation?.consumedAtMs !== null) : [store.get(environmentId)].filter((candidate) => candidate !== void 0)).map((candidate) => () => reconcileEnvironment(candidate.environmentId).catch(() => warn(`Worker environment reconcile failed (${candidate.environmentId}, ${candidate.providerId})`)));
		await runTasksWithConcurrency({
			tasks,
			limit: 8
		});
		if (environmentId !== void 0) return;
		try {
			await store.pruneTerminalEnvironments({ canPruneDemand: preparedPool.canPruneDemand });
		} catch (error) {
			if (!isSqliteLockError(error)) throw error;
		}
	};
	const reconcileOnce = (environmentId) => {
		if (stopping) return Promise.resolve();
		if (environmentId !== void 0) return trackOperation(reconcilePass(environmentId));
		schedulePreparedRefill();
		if (options.maintainProviders && !maintenanceInFlight) maintenanceInFlight = trackOperation(Promise.resolve().then(() => {
			maintenanceAbort.signal.throwIfAborted();
			return options.maintainProviders(maintenanceAbort.signal);
		}).catch(() => {
			if (!stopping) warn("Worker provider maintenance sweep failed; cleanup will retry");
		}).finally(() => {
			maintenanceInFlight = void 0;
		}));
		return reconcileInFlight ??= reconcilePass().finally(() => {
			reconcileInFlight = void 0;
		});
	};
	const start = () => {
		if (interval || stopping) return;
		unsubscribeSessionIdentityMutation = onSessionIdentityMutation((mutation) => {
			const currentSessionId = "current" in mutation ? mutation.current.sessionId : void 0;
			if (mutation.previous.sessionId && mutation.previous.sessionId !== currentSessionId) inference.cancelSession(mutation.previous.sessionId);
			sessionAttachments.retireSessionIdentityMutation(mutation);
		});
		for (const profileId of new Set(store.listForReconcile().map((record) => record.profileId))) providerLifecycle.warmMachineShape(profileId);
		options.liveEvents?.start();
		interval = setInterval(() => void reconcileOnce().catch(() => warn("Worker environment reconcile sweep failed")), options.reconcileIntervalMs ?? 6e4);
		interval.unref?.();
		reconcileOnce().catch(() => warn("Worker environment startup reconcile failed"));
	};
	const stop = async () => {
		stopping = true;
		sessionAttachments.cancelSessionAttachmentCreations();
		providerLifecycle.clearMachineShapeListeners();
		maintenanceAbort.abort();
		options.stopNodeEnrollmentWaits?.();
		clearInterval(interval);
		interval = void 0;
		unsubscribeSessionIdentityMutation?.();
		unsubscribeSessionIdentityMutation = void 0;
		unsubscribeTurnClaimClosed?.();
		unsubscribeTurnClaimClosed = void 0;
		await closeReconcileEnvironmentGuard();
		await options.closeComputers?.().catch(() => warn("Session computer cleanup failed during Gateway shutdown"));
		await inference.stop();
		credentialBroker.clear();
		options.liveEvents?.clear();
		options.stopNodeWorkerBundleTransfers?.();
		try {
			await joinWorkerTunnelStops([environmentAccess.stopAllTunnels(), options.nodePortalCarrier?.stopAll()]);
		} finally {
			const reconciliation = reconcileInFlight;
			if (reconciliation) await Promise.allSettled([reconciliation]);
			while (activeOperations.size > 0) await Promise.allSettled(activeOperations);
			credentialBroker.clear();
			turnRpc.clear();
			options.liveEvents?.clear();
			await options.closeNodeBootstrapArtifacts?.();
		}
	};
	const providerSupportsExecutionMode = (providerId, mode) => options.resolveProvider(providerId)?.supportedExecutionModes?.includes(mode) === true;
	const requireProviderExecutionMode = (providerId, mode) => {
		if (!mode) return;
		const provider = options.resolveProvider(providerId);
		if (!provider) throw serviceError("provider_not_found", `Unknown worker provider: ${providerId}`);
		if (!provider.supportedExecutionModes?.includes(mode)) throw serviceError("invalid_profile", `Worker provider ${providerId} does not support ${mode} placement`);
	};
	const configuredProfileProviderId = (profileId) => {
		const profiles = options.getConfig().cloudWorkers?.profiles;
		const profile = profiles && Object.hasOwn(profiles, profileId) ? profiles[profileId] : void 0;
		if (!profile) throw serviceError("profile_not_found", `Unknown worker profile: ${profileId}`);
		return profile.provider;
	};
	const prepareBuild = createWorkerEnvironmentBuildPreparation({
		store,
		getConfig: options.getConfig,
		resolveProvider: options.resolveProvider,
		projectNamespace: options.projectNamespace,
		providerLifecycle,
		signal: maintenanceAbort.signal,
		now,
		serviceError,
		configuredProfileProviderId,
		requireProviderExecutionMode,
		schedulePreparedRefill
	});
	const createEnvironment = async ({ profileId, idempotencyKey, inheritedProfile, admittedIntent, machineClass, executionMode, projectPath, signal, os, runSetupScript }) => {
		providerLifecycle.warmMachineShape(profileId);
		if (executionMode) requireProviderExecutionMode(inheritedProfile ? inheritedProfile.providerId : configuredProfileProviderId(profileId), executionMode);
		return environmentAccess.project(await providerLifecycle.createWithProfile(profileId, idempotencyKey, {
			...inheritedProfile ? { inherited: {
				providerId: inheritedProfile.providerId,
				profileSnapshot: inheritedProfile.profileSnapshot
			} } : {},
			machineClass,
			os,
			executionMode,
			projectPath,
			runSetupScript,
			signal
		}, admittedIntent));
	};
	const service = {
		...sessionAttachments,
		prepare: (request, authorize) => trackOperation(prepareBuild(request, authorize)),
		isStopping: () => stopping,
		recordError: saveError,
		list: environmentAccess.list,
		supportsProviderExecutionMode: providerSupportsExecutionMode,
		supportsExecutionMode: (profileId, mode) => {
			const profile = options.getConfig().cloudWorkers?.profiles?.[profileId];
			return profile ? providerSupportsExecutionMode(profile.provider, mode) : false;
		},
		requiresNodeEnrollment: (profileId, providerId) => {
			const id = providerId ?? options.getConfig().cloudWorkers?.profiles?.[profileId]?.provider;
			return id ? options.resolveProvider(id)?.requiresNodeEnrollment === true : false;
		},
		get: environmentAccess.get,
		prepareProjectIntent: (...args) => {
			providerLifecycle.warmMachineShape(args[0]);
			return providerLifecycle.prepareIntent(...args);
		},
		assertPreparedIntentCurrent: providerLifecycle.assertPreparedIntentCurrent,
		getPreparedCandidates: (intent) => preparedPool.candidates(intent).map(environmentAccess.project),
		schedulePreparedRefill,
		inventoryVersion: store.inventoryVersion,
		machineShapeVersion: providerLifecycle.machineShapeVersion,
		subscribeMachineShapeChanged: providerLifecycle.subscribeMachineShapeChanged,
		readMachineShape: (environmentId, prepared) => providerLifecycle.readMachineShape(prepared ?? store.get(environmentId)),
		supportsNodePortal: async (environmentId, ownerEpoch) => await options.nodePortalCarrier?.supports(environmentId, ownerEpoch) === true,
		hasPendingNodeEnrollmentSetup: store.hasPendingNodeEnrollmentSetup.bind(store),
		readProviderDisplayId: providerLifecycle.readProviderDisplayId,
		listMachineOptions: providerLifecycle.listMachineOptions,
		listOperatingSystems: providerLifecycle.listOperatingSystems,
		bindPreparedWorkspace: environmentAccess.bindPreparedWorkspace,
		createWithRequest: createEnvironment,
		create: (...args) => createEnvironment({
			profileId: args[0],
			idempotencyKey: args[1],
			machineClass: args[2],
			executionMode: args[3],
			projectPath: args[4],
			signal: args[5],
			os: args[6],
			runSetupScript: args[7]
		}),
		destroy: async (environmentId, abandonment) => environmentAccess.project(await providerLifecycle.destroy(environmentId, { abandonment })),
		requestDestroy: async (environmentId) => environmentAccess.project(await providerLifecycle.destroy(environmentId, { retryRequested: false })),
		destroyUnattached: async (environmentId) => {
			await preparedPool.cancelPreparation(environmentId);
			return environmentAccess.project(await providerLifecycle.destroy(environmentId, { requireUnattached: true }));
		},
		observeDesktop: environmentAccess.observeDesktop,
		launchDesktopApp: environmentAccess.launchDesktopApp,
		reconcileDesktopPolicy: environmentAccess.reconcileDesktopPolicy,
		admitWorker: turnRpc.admitWorker,
		validateWorkerConnection: turnRpc.validateWorkerConnection,
		commitTranscript: turnRpc.commitTranscript,
		pushLiveEvent: turnRpc.pushLiveEvent,
		executeSessionTool: turnRpc.executeSessionTool,
		executeComputer: turnRpc.executeComputer,
		prepareComputer: options.prepareComputer,
		startInference: turnRpc.startInference,
		cancelInference: turnRpc.cancelInference,
		cancelInferenceForSession: turnRpc.cancelInferenceForSession,
		hasInferenceForSession: turnRpc.hasInferenceForSession,
		resolveInferenceSessionForRunId: turnRpc.resolveInferenceSessionForRunId,
		resolveSshIdentity: environmentAccess.resolveSshIdentity,
		attachSession: credentialBroker.attachSession,
		takeMintedCredential: credentialBroker.takeMintedCredential,
		acquireTurnCredential: credentialBroker.acquireTurnCredential,
		acknowledgeCredentialDelivery: credentialBroker.acknowledgeCredentialDelivery,
		startTunnel: environmentAccess.startTunnel,
		stopTunnel: async (environmentId, ownerEpoch) => {
			await Promise.all([
				environmentAccess.stopTunnel(environmentId, ownerEpoch),
				options.nodePortalCarrier?.stop(environmentId, ownerEpoch),
				options.closeWorkerPortals?.(environmentId, ownerEpoch)
			]);
		},
		stopNodeEnrollmentWaits: options.stopNodeEnrollmentWaits,
		installReconcileEnvironmentGuard,
		reconcileEnvironment,
		reconcileOnce,
		start,
		stop
	};
	registerWorkerInferenceSessionControl(service, {
		beginDrain: inference.beginSessionDrain,
		captureCancel: inference.captureSessionCancellation
	});
	return service;
}
//#endregion
export { createWorkerEnvironmentService };
