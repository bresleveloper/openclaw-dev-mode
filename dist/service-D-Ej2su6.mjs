import { n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CuVhdCBs.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as runOutsideAsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import "./src-CdRlGRnW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import { _ as redactSensitiveText } from "./redact-DJ8j6ADa.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-DCvjvszg.mjs";
import { c as WorkerSessionAlreadyAttachedError } from "./openclaw-state-worker-error-Cmtk9G4_.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { l as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-C51cJHzg.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { m as listAgentRunsForSession, p as hasLiveAgentRunContext } from "./agent-run-registry-BaxMDLZF.mjs";
import { t as parseDurationMs } from "./parse-duration-C4JaJvt9.mjs";
import { t as normalizeCloudRepo } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
import { t as validateProviderSettings } from "./provider-settings-CR-jdYHV.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as boundedJsonUtf8Bytes } from "./json-utf8-bytes-fm9i4b7G.mjs";
import { dn as WorkerOperatingSystemSchema, un as WorkerMachineOptionsSchema } from "./agents-models-skills-C5tzwL7k.mjs";
import { n as recordRuntimeActionDecision } from "./runtime-action-decision-B2u479yP.mjs";
import { C as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { i as normalizeCapabilityProviderId } from "./provider-registry-shared-Cov0065J.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-D5wZ6Dom.mjs";
import { t as WorkerProviderError } from "./capability-provider.types-BsBg4rOj.mjs";
import "./worker-protocol-primitives-BajTgPT4.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, g as validateWorkerInferenceTerminalFrame, m as validateWorkerInferenceEventFrame } from "./worker-inference-B7U4TRc2.mjs";
import { dt as WorkerComputerResultSchema } from "./worker-admission-CNeLWzVQ.mjs";
import { f as ScreenSnapshotParamsSchema, l as ComputerActParamsSchema } from "./computer-use-contract-g23cJXOi.mjs";
import { i as captureAgentLifecycleBinding, s as matchesAgentLifecycleBinding } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { r as onSessionIdentityMutation } from "./session-lifecycle-events-qdejgRzS.mjs";
import { a as resolveSessionEntryAccessTarget } from "./session-accessor.entry-8r2jOQkD.mjs";
import "./session-accessor-CQ-g9yb2.mjs";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import "./device-provider-identity-v6nXqNq_.mjs";
import { _ as sameWorkerSessionTurnClaim, t as FORCED_WORKER_ABANDONMENT_ERROR, v as serializeWorkerSessionTurnClaim } from "./placement-record-BfcBeilz.mjs";
import { l as normalizeWorkerSshEndpoint } from "./store-validation-BhdOaJpU.mjs";
import { d as resolveGitRepositoryPaths } from "./git-DK_u9XbK.mjs";
import { r as formatWorkerInferenceError, t as boundedWorkerError } from "./worker-error-DmRBUSui.mjs";
import { d as getWorkerTurnToolSurface, t as acknowledgeWorkerTurnFinishing } from "./placement-turn-claim-events-BCSz3C5d.mjs";
import { a as workerBootstrapOperationTimeoutMs, n as MAX_NODE_BOOTSTRAP_TIMEOUT_MS } from "./bootstrap-timeouts-CDaMuZ4A.mjs";
import { n as GitHubIdentityError } from "./github-read-identity-DR7T7KI1.mjs";
import { c as prepareGitHubReadIdentity, p as resolveConfiguredGitHubToolIdentity } from "./github-tool-identity-2S4ost1l.mjs";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-CxoSdLOZ.mjs";
import { t as NodeWorkerComputerCloseParamsSchema } from "./node-computer-protocol-CNUgA_nx.mjs";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.mjs";
import { r as workerLocalProjectKey, t as prepareWorkerProjectSnapshot } from "./workspace-git-base-4x9Itm3z.mjs";
import { n as gitHubPublicApi } from "./github-public-api-COOMiXSo.mjs";
import { a as joinInferenceOperations, c as registerWorkerInferenceSessionControl, l as safeRevalidate, o as matchesIdentity, r as createWorkerInferenceSessionControls, s as preserveInferenceAuthorityFailure, t as WorkerInferenceAuthorityError } from "./inference-control-internal-h8yXQYae.mjs";
import { t as parseConfiguredProjectGitUrl } from "./project-git-url.runtime.js";
import { i as joinWorkerTunnelStops, r as WorkerTunnelOwnerDisconnectedError } from "./tunnel-contract-C4XjTxW-.mjs";
import { c as createWorkerCredentialMaterial, l as hashWorkerCredential, n as StaleWorkerBuildError, o as validateWorkerConnectionIdentity, r as admitWorkerConnection } from "./admission-CC4bcfcY.mjs";
import { n as readWorkerProjectPreparation, t as createWorkerProjectPreparationIdentity } from "./preparation-identity-E2cX74EF.mjs";
import { a as createWorkerRuntimeRefresher, c as hasForcedWorkerEnvironmentAbandonment, d as deriveEnvironmentIntent, i as WorkerRuntimeRefreshPendingError, l as workerEnvironmentServiceError, n as readWorkerProjectSetupRecipe, o as WorkerEnvironmentServiceError, r as readWorkerProjectSnapshot, s as createWorkerEnvironmentErrorRecorder, t as createWorkerProjectPreparation } from "./project-preparation-BUPA5OH4.mjs";
import { t as readRepositoryWorkerProjectSnapshot } from "./repository-project-source-BDUCsCdT.mjs";
import { t as captureWorkerTurnLiveEventOwner } from "./worker-turn-run-owner-DA4GaoKM.mjs";
import { t as ComputerTakeControlParamsSchema } from "./computer-tool-control-ZF49NJn1.mjs";
import { t as isWorkerNodeCarrierBindingCurrent } from "./node-carrier-binding-Ghb74wmp.mjs";
import { t as normalizeWorkerDesktopEndpoint } from "./desktop-endpoint-DLa3iAO9.mjs";
import { s as workerSessionToolErrorResult } from "./worker-session-tool-result-BlCTJkat.mjs";
import fs from "node:fs/promises";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { Value } from "typebox/value";
//#region src/gateway/worker-environments/service-validation.ts
function requireWorkerProfile(value) {
	const error = validateProviderSettings(value, "Worker profile");
	if (error) throw workerEnvironmentServiceError("invalid_profile", error);
	return value;
}
function requireInheritedWorkerProfileAuthorization(profileId, providerId, settings, configuredProviderId) {
	if (providerId === "device" && isRecord(settings) && typeof settings.device === "string" && profileId === `device:${settings.device}`) return;
	if (!configuredProviderId) throw workerEnvironmentServiceError("profile_not_found", `Unknown worker profile: ${profileId}`);
	if (normalizeCapabilityProviderId(configuredProviderId) !== providerId) throw workerEnvironmentServiceError("invalid_profile", "Inherited worker provider identity changed");
}
function requireProviderOperationTimeoutMs(operation, timeoutMs) {
	if (timeoutMs === void 0) return;
	if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2147e6) throw new Error(`Worker provider ${operation} timeout must be an integer from 1 through ${MAX_TIMER_TIMEOUT_MS}ms`);
	return timeoutMs;
}
function normalizeWorkerMachineOptions(value) {
	if (!Value.Check(WorkerMachineOptionsSchema, value)) return;
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
		const { signal, providerLifecycle, now, store, configuredProfileProviderId, requireProviderExecutionMode, schedulePreparedRefill } = options;
		signal.throwIfAborted();
		authorize?.();
		const { profileId, projectPath } = request;
		const providerId = configuredProfileProviderId(profileId);
		const provider = options.resolveProvider(normalizeCapabilityProviderId(providerId) ?? providerId);
		const profile = options.getConfig().cloudWorkers.profiles[profileId];
		if (!provider?.supportsProjectPreparation?.(requireWorkerProfile(profile.settings ?? {}))) throw workerEnvironmentServiceError("invalid_profile", "Worker profile does not support project preparation");
		const namespace = options.projectNamespace;
		if (!namespace) throw workerEnvironmentServiceError("invalid_state", "Worker project preparation namespace is unavailable");
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
		if (!project) throw workerEnvironmentServiceError("invalid_project", "Project must be an accessible local Git checkout root with a HEAD commit");
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
		const timeout = providerLifecycle.providerFor(intent.providerId).resolvePreparedIdleTimeoutMs?.(requireWorkerProfile(intent.profileSnapshot.settings));
		if (!intent.preparationKey || !Number.isSafeInteger(timeout) || !timeout || timeout <= 0) throw workerEnvironmentServiceError("invalid_profile", "Worker profile does not support prepared workers with an idle timeout");
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
		if (!record) throw workerEnvironmentServiceError("capacity", "Prepared worker pool is full; destroy an unused worker or wait for cleanup, then retry");
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
	const { store, now, move, withLock } = options;
	const tunnels = options.tunnelManager;
	const pendingCredentials = /* @__PURE__ */ new Map();
	const credentialExpiry = () => {
		const ttlMs = options.workerCredentialTtlMs ?? 6e5;
		if (!Number.isSafeInteger(ttlMs) || ttlMs < 1) throw workerEnvironmentServiceError("invalid_state", "Worker credential lifetime is invalid");
		const expiresAtMs = now() + ttlMs;
		if (!Number.isSafeInteger(expiresAtMs)) throw workerEnvironmentServiceError("invalid_state", "Worker credential expiry is out of range");
		return expiresAtMs;
	};
	const credentialMaterial = (claim) => createWorkerCredentialMaterial(options.generateWorkerCredential, claim);
	const validateTurnClaim = (claim) => claim.owner.kind === "worker" && options.placementStore?.validateWorkerTurn(claim) === true;
	const assertTurnClaim = (claim) => {
		if (!validateTurnClaim(claim)) throw workerEnvironmentServiceError("invalid_state", "Worker turn credential claim is not authoritative");
	};
	const grantFrom = (params) => {
		const record = params.record;
		if (!record) throw workerEnvironmentServiceError("invalid_state", "Worker credential persistence failed");
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
		if (store.getCredential(request.environmentId)) await options.cancelInferenceEnvironment(request.environmentId);
		const material = credentialMaterial(claim);
		const credential = {
			environmentId: request.environmentId,
			expectedOwnerEpoch: request.ownerEpoch,
			credentialHash: material.credentialHash,
			sessionId: request.sessionId,
			rpcSetVersion: 1,
			expiresAtMs: credentialExpiry(),
			...claim ? { assertCurrent: () => assertTurnClaim(claim) } : {}
		};
		const record = await store.renewCredential(credential);
		credential.assertCurrent?.();
		return grantFrom({
			credential: material.credential,
			record,
			claim
		});
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
		const grant = stageCredential(await mintCredentialLocked({
			environmentId: record.environmentId,
			ownerEpoch: record.ownerEpoch,
			sessionId
		}));
		if (sessionId && credential?.ownerEpoch === record.ownerEpoch) options.liveEvents?.rotateCredential({
			credentialHash: grant.deliveryId,
			environmentId: record.environmentId,
			previousCredentialHash: credential.credentialHash,
			runEpoch: record.ownerEpoch,
			sessionId
		});
	};
	const attachSession = async (request) => {
		if (options.isStopping()) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
		return withLock(request.environmentId, async () => {
			await store.ready();
			if (options.isStopping()) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
			const current = store.get(request.environmentId);
			if (!current) throw workerEnvironmentServiceError("environment_not_found", `Unknown worker environment: ${request.environmentId}`);
			if (current.state !== "ready" && current.state !== "idle") throw workerEnvironmentServiceError("invalid_state", `Cannot attach worker in state: ${current.state}`);
			let currentBuild;
			try {
				currentBuild = await options.prepareInstallation("bundle");
			} catch {
				throw workerEnvironmentServiceError("invalid_state", "Current worker build identity is unavailable");
			}
			if (!current.bootstrapReceipt || !sameWorkerBuild(current.bootstrapReceipt, currentBuild)) throw new StaleWorkerBuildError();
			const material = credentialMaterial();
			try {
				await store.transition({
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
				if (error instanceof WorkerSessionAlreadyAttachedError) throw workerEnvironmentServiceError("invalid_state", error.message);
				throw error;
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
		if (!environment || ![
			"ready",
			"idle",
			"attached"
		].includes(environment.state) || environment.destroyRequestedAtMs !== null || environment.ownerEpoch !== binding.ownerEpoch || !credential || credential.credentialHash !== credentialHash || credential.ownerEpoch !== binding.ownerEpoch || credential.sessionId !== binding.sessionId || credential.deliveredAtMs !== null || credential.expiresAtMs <= checkedAtMs || grant.turnClaim === void 0 !== (claim === void 0) || claim !== void 0 && hashWorkerCredential(grant.credential, claim) !== credentialHash) return;
		return {
			checkedAtMs,
			credentialHash,
			grant
		};
	};
	const bindingForClaim = (claim) => {
		if (claim.owner.kind !== "worker") throw workerEnvironmentServiceError("invalid_state", "Worker turn credential claim is not worker-owned");
		return {
			environmentId: claim.owner.environmentId,
			ownerEpoch: claim.owner.ownerEpoch,
			sessionId: claim.sessionId
		};
	};
	const acquireTurnCredential = (claim) => {
		const binding = bindingForClaim(claim);
		return withLock(binding.environmentId, async () => {
			await store.ready();
			const placementStore = options.placementStore;
			if (!placementStore || !validateTurnClaim(claim)) throw workerEnvironmentServiceError("invalid_state", "Worker turn credential claim is not authoritative");
			const pending = readPendingCredential(binding, claim)?.grant;
			if (pending) return pending;
			const environment = store.get(binding.environmentId);
			if (!environment || environment.state !== "attached" || environment.ownerEpoch !== binding.ownerEpoch || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== binding.sessionId) throw workerEnvironmentServiceError("invalid_state", "Worker session credential owner is not attached");
			const previous = store.getCredential(binding.environmentId);
			const ackedSeq = previous?.sessionId === binding.sessionId ? placementStore.readWorkerTurnLiveAckCursor(claim) : void 0;
			const grant = stageCredential(await mintCredentialLocked(binding, claim));
			if (previous && ackedSeq !== void 0) options.liveEvents?.rotateCredential({
				ackedSeq,
				credentialHash: grant.deliveryId,
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
			...grant.turnClaim ? { assertCurrent: () => assertTurnClaim(grant.turnClaim) } : {}
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
	const url = parseConfiguredProjectGitUrl(request.url)?.url;
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
	const endpoint = `${gitHubPublicApi.GITHUB_API_BASE_URL}/repos${repositoryPath}`;
	const read = async (suffix, readIdentity, assertOwner, signal, graphql) => {
		assertOwner();
		const response = await gitHubPublicApi.fetchGitHubApi(graphql ? gitHubPublicApi.GITHUB_GRAPHQL_URL : endpoint + suffix, fetch, readIdentity.token, async () => sourceChanged(), readIdentity, void 0, signal, graphql);
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
		if (!isRecord(value) || typeof value.node_id !== "string" || !/^[A-Za-z0-9_+/=-]{1,256}$/u.test(value.node_id) || typeof value.clone_url !== "string" || parseConfiguredProjectGitUrl(value.clone_url)?.url !== url || typeof value.private !== "boolean" || value.private && (readIdentity.selection.source === "anonymous" || !readIdentity.token)) sourceChanged();
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
	const requiresGitPack = metadata.private || new URL(url).hostname !== "github.com";
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
		...requiresGitPack ? { prepareGitPack: async (input) => {
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
			const { prepareRepositoryWorkerGitPack } = await import("./repository-git-pack-CvLXiyCd.mjs");
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
	const { store, now, providerFor, identityResolverFor, withLock } = options;
	const tunnels = options.tunnelManager;
	const nodeTunnels = options.nodeTunnelManager;
	const nodeDesktop = options.nodeDesktopCarrier;
	let desktopEnabled = options.getConfig().cloudWorkers?.desktop === true;
	let desktopPolicy = new AbortController();
	const requireDesktopPolicy = (operation, policy) => {
		if (options.getConfig().cloudWorkers?.desktop !== true) throw workerEnvironmentServiceError("invalid_state", `worker desktop ${operation} is disabled; enable the Desktop lab in Control UI Settings -> Labs (config: cloudWorkers.desktop)`);
		if (policy.signal.aborted) throw workerEnvironmentServiceError("invalid_state", "Worker desktop policy changed; retry the request");
	};
	const requireCurrentRecord = (environmentId) => {
		if (options.isStopping()) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
		const record = store.get(environmentId);
		if (!record) throw workerEnvironmentServiceError("environment_not_found", `Unknown worker environment: ${environmentId}`);
		return record;
	};
	const requireDesktopRecord = (environmentId) => {
		const record = requireCurrentRecord(environmentId);
		if (![
			"ready",
			"idle",
			"attached"
		].includes(record.state) || record.destroyRequestedAtMs !== null || !record.leaseId || !record.desktop) throw workerEnvironmentServiceError("invalid_state", "environment has no desktop; desktop is a warm-time capability of the profile");
		return {
			record,
			desktop: record.desktop,
			leaseId: record.leaseId
		};
	};
	const project = (record) => {
		const cleanupError = options.getCleanupError(record);
		const desktopAvailable = options.getConfig().cloudWorkers?.desktop === true && [
			"ready",
			"idle",
			"attached"
		].includes(record.state) && record.desktop !== null;
		const nodeTunnelStatus = nodeTunnels?.status(record.environmentId);
		const preparedProject = record.preparation ? readWorkerProjectSnapshot(record.profileSnapshot.project) : void 0;
		const projectLabel = preparedProject ? "source" in preparedProject ? normalizeCloudRepo(preparedProject.source.url) : preparedProject.label : void 0;
		return {
			...record,
			...record.preparation && preparedProject ? { preparation: {
				...record.preparation,
				project: {
					...projectLabel ? { label: projectLabel } : {},
					baseCommit: preparedProject.baseCommit
				}
			} } : {},
			...(record.state === "failed" || record.state === "orphaned" || record.destroyRequestedAtMs !== null && record.state !== "destroyed") && record.lastError ? { error: boundedWorkerError(record.lastError) } : {},
			...cleanupError ? { error: cleanupError } : {},
			desktopAvailable,
			desktopApps: desktopAvailable ? record.desktop?.apps?.map((app) => app.id).toSorted() ?? [] : [],
			tunnelStatus: nodeTunnelStatus && nodeTunnelStatus !== "stopped" ? nodeTunnelStatus : tunnels?.status(record.environmentId) ?? nodeTunnelStatus ?? "stopped"
		};
	};
	const resolveSshIdentity = async (environmentId) => {
		const record = store.get(environmentId);
		if (!record) throw workerEnvironmentServiceError("environment_not_found", `Unknown worker environment: ${environmentId}`);
		if (!record.leaseId || !record.sshEndpoint) throw workerEnvironmentServiceError("invalid_state", `Worker environment ${environmentId} has no active SSH endpoint`);
		const provider = providerFor(record.providerId);
		return await identityResolverFor(record, provider, record.leaseId)(record.sshEndpoint.keyRef, { assertCurrent: () => {
			if (options.isStopping()) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
		} });
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
		if (options.isStopping()) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
		if (!tunnels && !nodeTunnels) throw workerEnvironmentServiceError("invalid_state", "Worker tunnel runtime is unavailable");
		let currentBundle;
		try {
			currentBundle = await options.prepareCurrentBundle();
		} catch {
			throw workerEnvironmentServiceError("invalid_state", "Current worker build identity is unavailable");
		}
		const { startup, stopStartup } = await withLock(request.environmentId, async () => {
			const record = requireCurrentRecord(request.environmentId);
			if (![
				"ready",
				"idle",
				"attached"
			].includes(record.state) || record.destroyRequestedAtMs !== null || !record.leaseId || !record.bootstrapReceipt) throw workerEnvironmentServiceError("invalid_state", `Cannot start tunnel in state: ${record.state}`);
			if (record.sharedHost === null) throw workerEnvironmentServiceError("provider_failure", "Worker lease isolation is not reconciled; retry after provider inspection");
			if (record.ownerEpoch === request.ownerEpoch && record.lastError && !sameWorkerBuild(record.bootstrapReceipt, currentBundle)) throw new WorkerRuntimeRefreshPendingError(boundedWorkerError(record.lastError));
			const credential = store.getCredential(request.environmentId);
			if (record.ownerEpoch !== request.ownerEpoch || !credential || credential.ownerEpoch !== request.ownerEpoch) throw workerEnvironmentServiceError("invalid_state", "Worker tunnel owner credential is not current");
			if (!sameWorkerBuild(record.bootstrapReceipt, currentBundle)) throw new StaleWorkerBuildError();
			request.authorize?.();
			const nodeDeviceId = record.nodeDeviceId;
			if (typeof nodeDeviceId === "string" && !record.sshEndpoint && record.bootstrapReceipt.installKind === "bundle") {
				const sessionId = record.attachedSessionIds[0];
				if (!nodeTunnels || !sessionId || record.attachedSessionIds.length !== 1 || credential.sessionId !== sessionId) throw workerEnvironmentServiceError("invalid_state", "Node worker tunnel runtime is unavailable");
				return {
					startup: nodeTunnels.start({
						executionMode: record.profileSnapshot.executionMode === "remote-exec" ? "remote-exec" : "worker-turn",
						environmentId: record.environmentId,
						ownerEpoch: record.ownerEpoch,
						deviceId: nodeDeviceId,
						sessionId,
						expectedBuild: {
							bundleHash: currentBundle.bundleHash,
							openclawVersion: currentBundle.openclawVersion,
							protocolFeatures: [...currentBundle.protocolFeatures]
						},
						authorize: request.authorize
					}),
					stopStartup: () => nodeTunnels.stop(record.environmentId, record.ownerEpoch)
				};
			}
			if (!record.sshEndpoint) throw workerEnvironmentServiceError("invalid_state", "Worker environment has no supported tunnel transport");
			if (!tunnels) throw workerEnvironmentServiceError("invalid_state", "Worker SSH tunnel runtime is unavailable");
			const provider = providerFor(record.providerId);
			return {
				startup: tunnels.start({
					...request,
					bundleHash: currentBundle.bundleHash,
					ssh: record.sshEndpoint,
					sharedHost: record.sharedHost,
					resolveIdentity: identityResolverFor(record, provider, record.leaseId)
				}),
				stopStartup: () => tunnels.stop(record.environmentId, record.ownerEpoch)
			};
		});
		const timeoutError = workerEnvironmentServiceError("provider_failure", "Worker tunnel did not connect within 3 minutes; check that the worker is online and reachable, then retry");
		try {
			return await withTimeout(startup, TUNNEL_START_TIMEOUT_MS, { createError: () => timeoutError });
		} catch (error) {
			if (error !== timeoutError) throw error;
			stopStartup().catch(() => void 0);
			throw timeoutError;
		}
	};
	const observeDesktop = async (request) => {
		const stopping = options.isStopping();
		const policy = desktopPolicy;
		const assertPolicy = () => requireDesktopPolicy("observe", policy);
		assertPolicy();
		if (stopping) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
		const requester = {
			...request.requester,
			signal: request.requester?.signal ? AbortSignal.any([policy.signal, request.requester.signal]) : policy.signal,
			isCurrent: () => !policy.signal.aborted && !options.isStopping() && options.getConfig().cloudWorkers?.desktop === true && request.requester?.isCurrent() !== false
		};
		const prepared = await withLock(request.environmentId, async () => {
			assertPolicy();
			const { record, desktop, leaseId } = requireDesktopRecord(request.environmentId);
			const canResize = options.resolveProvider(record.providerId)?.allowsDesktopResize === true && desktop.allowsResize !== false;
			if (record.sshEndpoint) {
				if (!tunnels) throw workerEnvironmentServiceError("invalid_state", "Worker SSH desktop runtime is unavailable");
				return {
					canResize,
					ownerEpoch: record.ownerEpoch,
					startup: tunnels.desktop.acquire({
						environmentId: record.environmentId,
						ownerEpoch: record.ownerEpoch,
						ssh: record.sshEndpoint,
						desktop,
						resolveIdentity: identityResolverFor(record, providerFor(record.providerId), leaseId)
					})
				};
			}
			if (record.nodeDeviceId) {
				if (!nodeDesktop) throw workerEnvironmentServiceError("invalid_state", "Worker node desktop runtime is unavailable");
				return {
					canResize,
					nodeStartup: nodeDesktop.observe({
						record,
						control: request.control,
						requester
					})
				};
			}
			throw workerEnvironmentServiceError("invalid_state", "Worker environment has no desktop transport");
		});
		const { canResize } = prepared;
		if (prepared.nodeStartup) {
			const observed = await prepared.nodeStartup;
			assertPolicy();
			return {
				...observed,
				...canResize ? { canResize } : {}
			};
		}
		const acquired = await prepared.startup;
		const { DESKTOP_OBSERVE_PATH, mintDesktopObserverToken } = await import("./observe-bridge-BLWwOQAC.mjs");
		assertPolicy();
		const minted = mintDesktopObserverToken({
			sourceKey: request.environmentId,
			ownerEpoch: prepared.ownerEpoch,
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
		if (stopping) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
		const requireLaunchable = () => {
			assertPolicy();
			const { record, desktop, leaseId } = requireDesktopRecord(request.environmentId);
			const app = desktop.apps?.find((candidate) => candidate.id === request.app);
			if (!app) throw workerEnvironmentServiceError("desktop_app_not_found", `environment does not advertise desktop app: ${request.app}`);
			return {
				app,
				record,
				leaseId
			};
		};
		const { startup, launchEpoch } = await withLock(request.environmentId, async () => {
			const { app, record, leaseId } = requireLaunchable();
			if (record.sshEndpoint) {
				if (!tunnels) throw workerEnvironmentServiceError("invalid_state", "Worker SSH desktop runtime is unavailable");
				const provider = providerFor(record.providerId);
				return {
					launchEpoch: record.ownerEpoch,
					startup: tunnels.desktop.launchApp({
						environmentId: record.environmentId,
						ownerEpoch: record.ownerEpoch,
						ssh: record.sshEndpoint,
						app,
						resolveIdentity: identityResolverFor(record, provider, leaseId)
					})
				};
			}
			if (record.nodeDeviceId) {
				if (!nodeDesktop) throw workerEnvironmentServiceError("invalid_state", "Worker node desktop runtime is unavailable");
				return {
					launchEpoch: record.ownerEpoch,
					startup: nodeDesktop.launchApp({
						record,
						app
					})
				};
			}
			throw workerEnvironmentServiceError("invalid_state", "Worker environment has no desktop transport");
		});
		const assertLaunchOwner = async () => {
			const { record } = requireLaunchable();
			if (record.ownerEpoch !== launchEpoch) throw workerEnvironmentServiceError("invalid_state", "Worker desktop app launch owner changed");
		};
		try {
			await startup;
		} catch (error) {
			if (error && typeof error === "object" && "code" in error && error.code === "unsupported_platform") throw workerEnvironmentServiceError("unsupported_platform", "desktop app launch is not supported on Windows gateway hosts");
			await withLock(request.environmentId, assertLaunchOwner);
			throw workerEnvironmentServiceError("launcher_failure", `worker desktop ${request.app} launcher failed; verify the app is installed and retry`);
		}
		await withLock(request.environmentId, assertLaunchOwner);
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
const TERMINAL_ERROR_MESSAGES = /* @__PURE__ */ new Map([
	["model-not-approved", "Model is not approved"],
	["invalid-context", "Inference context is invalid"],
	["epoch-mismatch", "Inference ownership changed"],
	["session-not-attached", "Session is not attached"],
	["provider-error", "Provider request failed"],
	["cancelled", "Inference cancelled"]
]);
function terminalError(reason, outcome, errorMessage) {
	const usage = outcome?.type === "done" ? outcome.message.usage : outcome?.type === "error" ? outcome.usage : void 0;
	return {
		type: "error",
		reason,
		message: errorMessage ?? TERMINAL_ERROR_MESSAGES.get(reason) ?? "Provider request failed",
		...usage ? { usage } : {}
	};
}
function validFrameBytes(frame, validate) {
	const measured = boundedJsonUtf8Bytes(frame, WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES);
	if (measured.complete && validate(frame)) return measured.bytes;
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
	if (validFrameBytes(terminalFrame(entry, outcome), validateWorkerInferenceTerminalFrame) === null) return terminalError("provider-error");
	return outcome;
}
//#endregion
//#region src/gateway/worker-environments/inference-store.ts
function createWorkerInferenceStore(options = {}) {
	const context = captureOpenClawStateWorkerContext(options);
	const now = options.now ?? Date.now;
	const retention = { ...options.retention };
	const execute = (command, assertCurrent) => {
		const captured = structuredClone(command);
		const check = () => {
			context.admission.assertCurrent();
			assertCurrent?.();
		};
		return runOpenClawStateWorkerOperation(context, (scope) => scope.execute(captured), {
			assertCurrent: check,
			createAdmission: createSqliteWorkerWriteAdmission(check, [context.admission.databasePath])
		});
	};
	const prepare = (input) => ({
		input,
		nowMs: now(),
		retention
	});
	return {
		begin: (input, assertCurrent) => execute({
			type: "workerInference.begin",
			input: prepare(input)
		}, assertCurrent),
		complete: (input, assertCurrent) => execute({
			type: "workerInference.complete",
			input: prepare(input)
		}, assertCurrent),
		cancelPending: (input, assertCurrent) => execute({
			type: "workerInference.cancelPending",
			input: prepare(input)
		}, assertCurrent),
		recoverPending: (input, assertCurrent) => execute({
			type: "workerInference.recoverPending",
			input: prepare(input)
		}, assertCurrent)
	};
}
//#endregion
//#region src/gateway/worker-environments/inference.ts
const MAX_PROVIDER_OPERATIONS_PER_SESSION = 2;
function inferenceTurnKey(input) {
	return JSON.stringify([
		input.sessionId,
		input.runEpoch,
		input.runId,
		input.turnId
	]);
}
function trySend(sink, frame) {
	try {
		sink.send(frame);
		return true;
	} catch {
		return false;
	}
}
function createWorkerInferenceManager(options) {
	const store = options.store ?? createWorkerInferenceStore();
	const requestMaxBytes = options.requestMaxBytes ?? WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES;
	const streamMaxBytes = options.streamMaxBytes ?? WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES;
	const active = /* @__PURE__ */ new Map();
	const operations = /* @__PURE__ */ new Map();
	const providers = /* @__PURE__ */ new Map();
	const unknownSettlements = /* @__PURE__ */ new Map();
	const retainUnknown = (storeKey, error) => {
		if (!hasSqliteWorkerOutcomeUnknown(error)) return;
		let failures = unknownSettlements.get(storeKey);
		if (!failures) {
			failures = /* @__PURE__ */ new Set();
			unknownSettlements.set(storeKey, failures);
		}
		failures.add(error);
	};
	const unknownFailureFor = (storeKey) => {
		const errors = [...unknownSettlements.get(storeKey) ?? []];
		return errors.length > 1 ? new AggregateError(errors, "Worker inference settlement failed") : errors[0];
	};
	const assertKnownTurn = (storeKey) => {
		if (unknownSettlements.has(storeKey)) throw unknownFailureFor(storeKey);
	};
	const recovered = store.recoverPending(terminalError("provider-error"));
	recovered.catch(() => void 0);
	const track = (operation, input) => {
		const storeKey = inferenceTurnKey(input);
		operations.set(operation, {
			sessionId: input.sessionId,
			storeKey
		});
		operation.then(() => operations.delete(operation), (error) => {
			operations.delete(operation);
			retainUnknown(storeKey, error);
		});
		return operation;
	};
	const processFence = (entry) => {
		if (entry.abortReason) return entry.abortReason;
		if (unknownSettlements.has(entry.storeKey)) return "provider-error";
		const bindingError = matchesIdentity(entry.identity, entry.request);
		if (bindingError) return bindingError;
		return active.get(entry.claimKey) === entry ? null : "cancelled";
	};
	const abortEntry = (entry, reason) => {
		entry.abortReason ??= reason;
		if (!entry.controller.signal.aborted) entry.controller.abort();
	};
	const durableFence = (entry) => {
		const processError = processFence(entry);
		if (processError) return processError;
		const revalidationError = safeRevalidate(entry.revalidate, (error) => {
			entry.authorityFailure ??= { error };
		}, entry.assertSourceCurrent);
		if (revalidationError) abortEntry(entry, revalidationError);
		return revalidationError;
	};
	const assertEntry = (entry) => {
		assertKnownTurn(entry.storeKey);
		if (active.get(entry.claimKey) !== entry) throw new WorkerInferenceAuthorityError("cancelled");
	};
	const assertLiveEntry = (entry) => {
		assertKnownTurn(entry.storeKey);
		const reason = durableFence(entry);
		if (entry.authorityFailure && hasSqliteWorkerOutcomeUnknown(entry.authorityFailure.error)) throw entry.authorityFailure.error;
		if (reason) throw new WorkerInferenceAuthorityError(reason, entry.authorityFailure?.error);
	};
	const forget = (entry) => {
		if (active.get(entry.claimKey) === entry) active.delete(entry.claimKey);
	};
	const sendFrame = (entry, frame) => {
		if (!entry.sinkReady) {
			entry.pendingFrames.push(frame);
			return true;
		}
		return trySend(entry.sink, frame);
	};
	const sendTerminal = (entry, outcome) => {
		entry.seq += 1;
		sendFrame(entry, terminalFrame(entry, outcome, entry.seq));
	};
	const retainFailure = (entry, error) => {
		entry.failure ??= { error };
		retainUnknown(entry.storeKey, error);
		entry.settled = true;
		abortEntry(entry, "provider-error");
	};
	const finish = (entry, rawOutcome) => {
		if (entry.terminal) return entry.terminal;
		if (unknownSettlements.has(entry.storeKey)) return joinInferenceOperations([], [unknownFailureFor(entry.storeKey)]);
		if (entry.failure) return joinInferenceOperations([], [entry.failure.error]);
		if (entry.settled) return Promise.resolve();
		entry.terminal = track((async () => {
			try {
				const begin = await entry.begun;
				assertKnownTurn(entry.storeKey);
				if (!begin || begin.kind === "rejected" || begin.kind === "replay") {
					entry.settled = true;
					forget(entry);
					return;
				}
				const fence = durableFence(entry);
				if (entry.authorityFailure && hasSqliteWorkerOutcomeUnknown(entry.authorityFailure.error)) throw entry.authorityFailure.error;
				const outcome = normalizeTerminalOutcome(entry, fence ? terminalError(fence, rawOutcome) : rawOutcome);
				let storedOutcome;
				try {
					storedOutcome = await store.complete({
						...entry.storeInput,
						outcome
					}, fence ? () => assertEntry(entry) : () => assertLiveEntry(entry));
				} catch (error) {
					if (!(error instanceof WorkerInferenceAuthorityError) || hasSqliteWorkerOutcomeUnknown(error)) throw error;
					storedOutcome = await store.complete({
						...entry.storeInput,
						outcome: terminalError(error.reason, rawOutcome)
					}, () => assertEntry(entry));
				}
				entry.settled = true;
				entry.terminalOutcome = storedOutcome;
				if (active.get(entry.claimKey) === entry) {
					forget(entry);
					if (!entry.replay) sendTerminal(entry, storedOutcome);
				}
				if (entry.authorityFailure) throw entry.authorityFailure.error;
			} catch (error) {
				const failure = preserveInferenceAuthorityFailure(error, entry.authorityFailure);
				retainFailure(entry, failure);
				throw failure;
			}
		})(), entry.storeInput);
		return entry.terminal;
	};
	const settleAbort = (entry, reason) => {
		abortEntry(entry, reason);
		return finish(entry, terminalError(entry.abortReason ?? reason));
	};
	const controls = createWorkerInferenceSessionControls({
		active,
		operations,
		unknownSettlements,
		recovered,
		settleAbort
	});
	const executeEntry = async (entry) => {
		const initialFence = durableFence(entry);
		if (initialFence) {
			if (entry.authorityFailure && hasSqliteWorkerOutcomeUnknown(entry.authorityFailure.error)) {
				retainFailure(entry, entry.authorityFailure.error);
				throw entry.authorityFailure.error;
			}
			await joinInferenceOperations([finish(entry, terminalError(initialFence))], entry.authorityFailure ? [entry.authorityFailure.error] : []);
			return;
		}
		let outcome;
		let failure;
		try {
			const config = options.getConfig?.();
			outcome = await options.execute({
				identity: entry.identity,
				request: entry.request,
				sessionTarget: entry.sessionTarget,
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
					if (frameBytes === null || entry.streamedBytes + frameBytes > streamMaxBytes || !sendFrame(entry, frame)) {
						settleAbort(entry, "provider-error").catch(() => void 0);
						return;
					}
					entry.streamedBytes += frameBytes;
					entry.seq = nextSeq;
				},
				isCurrent: () => durableFence(entry) === null,
				...config ? { config } : {}
			});
		} catch (caught) {
			const error = preserveInferenceAuthorityFailure(caught, entry.authorityFailure);
			failure = { error };
			outcome = terminalError(entry.abortReason ?? "provider-error", void 0, entry.abortReason ? void 0 : formatWorkerInferenceError(error));
			if (hasSqliteWorkerOutcomeUnknown(error)) {
				retainFailure(entry, error);
				if (entry.terminal) await joinInferenceOperations([entry.terminal], [error]);
				throw error;
			}
		}
		failure ??= entry.authorityFailure;
		await joinInferenceOperations([finish(entry, outcome)], failure ? [failure.error] : []);
	};
	const launchEntry = (entry) => {
		if (entry.launched || entry.settled || entry.abortReason || controls.isStopping() || controls.isDraining(entry.request.sessionId)) return;
		entry.launched = true;
		const operation = track(runWithGatewayIndependentRootWorkContinuation(() => Promise.resolve().then(() => executeEntry(entry)), "worker:dispatch"), entry.storeInput);
		providers.set(operation, entry.request.sessionId);
		operation.then(() => providers.delete(operation), (error) => {
			providers.delete(operation);
			if (!entry.settled || hasSqliteWorkerOutcomeUnknown(error)) retainFailure(entry, error);
		});
	};
	const acceptedResult = (entry, sink) => ({
		ok: true,
		result: { status: "accepted" },
		launch() {
			if (entry.sink !== sink) return;
			entry.sinkReady = true;
			for (const frame of entry.pendingFrames.splice(0)) if (!trySend(sink, frame)) {
				settleAbort(entry, "provider-error").catch(() => void 0);
				return;
			}
			launchEntry(entry);
		}
	});
	const replayResult = (entry, outcome, sink) => {
		let launched = false;
		entry.settled = true;
		entry.terminalOutcome = outcome;
		forget(entry);
		return {
			ok: true,
			result: { status: "replayed" },
			launch() {
				if (launched || entry.sink !== sink) return;
				launched = true;
				entry.sinkReady = true;
				const fence = entry.abortReason ?? safeRevalidate(entry.revalidate, (error) => retainUnknown(entry.storeKey, error), entry.assertSourceCurrent);
				if (!unknownSettlements.has(entry.storeKey)) sendTerminal(entry, fence ? terminalError(fence) : outcome);
			}
		};
	};
	const start = async (params) => {
		const assertSourceCurrent = params.assertSourceCurrent;
		if (controls.isStopping() || controls.isDraining(params.request.sessionId)) return {
			ok: false,
			reason: "cancelled"
		};
		if (unknownSettlements.has(inferenceTurnKey(params.request))) return {
			ok: false,
			reason: "provider-error"
		};
		const identityError = matchesIdentity(params.identity, params.request);
		if (identityError) return {
			ok: false,
			reason: identityError
		};
		assertSourceCurrent?.();
		const revalidationError = params.revalidate?.() ?? null;
		if (revalidationError) return {
			ok: false,
			reason: revalidationError
		};
		if ([...operations.values()].some((owner) => owner.sessionId === params.request.sessionId && unknownSettlements.has(owner.storeKey))) return {
			ok: false,
			reason: "provider-error"
		};
		if (!boundedJsonUtf8Bytes(params.request, requestMaxBytes).complete) return {
			ok: false,
			reason: "invalid-context"
		};
		const serialized = stableStringify(params.request);
		const claimKey = serializeWorkerSessionTurnClaim(params.identity.turnClaim);
		const hash = createHash("sha256").update(`${claimKey}\0${serialized}`).digest("hex");
		for (const previous of active.values()) if (previous.request.sessionId === params.request.sessionId && previous.failure) forget(previous);
		const existing = active.get(claimKey);
		if (existing && existing.request.turnId === params.request.turnId && existing.requestHash === hash && !existing.settled) {
			existing.identity = params.identity;
			existing.sink = params.sink;
			existing.sinkReady = false;
			existing.revalidate = params.revalidate;
			const result = await existing.admission;
			if (!result.ok) return result;
			return result.result.status === "accepted" ? acceptedResult(existing, params.sink) : replayResult(existing, existing.terminalOutcome, params.sink);
		}
		for (const concurrent of active.values()) {
			if (concurrent.request.sessionId !== params.request.sessionId) continue;
			const fence = durableFence(concurrent);
			if (fence) try {
				await settleAbort(concurrent, fence);
			} catch {
				return {
					ok: false,
					reason: "provider-error"
				};
			}
			return {
				ok: false,
				reason: "invalid-context"
			};
		}
		const entry = {
			claimKey,
			storeKey: inferenceTurnKey(params.request),
			identity: params.identity,
			request: structuredClone(params.request),
			sessionTarget: params.sessionTarget,
			requestHash: hash,
			storeInput: {
				environmentId: params.identity.environmentId,
				sessionId: params.request.sessionId,
				runEpoch: params.request.runEpoch,
				runId: params.request.runId,
				turnId: params.request.turnId,
				requestHash: hash
			},
			sink: params.sink,
			sinkReady: false,
			pendingFrames: [],
			...assertSourceCurrent ? { assertSourceCurrent } : {},
			...params.revalidate ? { revalidate: params.revalidate } : {},
			controller: new AbortController(),
			seq: 0,
			streamedBytes: 0,
			launched: false,
			settled: false
		};
		active.set(claimKey, entry);
		entry.begun = track((async () => {
			await recovered;
			if (entry.abortReason) return;
			try {
				return await store.begin(entry.storeInput, () => assertLiveEntry(entry));
			} catch (error) {
				if (error instanceof WorkerInferenceAuthorityError && !hasSqliteWorkerOutcomeUnknown(error) && !entry.authorityFailure) {
					abortEntry(entry, error.reason);
					return;
				}
				const failure = preserveInferenceAuthorityFailure(error, entry.authorityFailure);
				retainFailure(entry, failure);
				throw failure;
			}
		})(), entry.storeInput);
		entry.admission = track((async () => {
			const begin = await entry.begun;
			assertKnownTurn(entry.storeKey);
			if (!begin || begin.kind === "rejected") {
				forget(entry);
				return {
					ok: false,
					reason: entry.abortReason ?? "invalid-context"
				};
			}
			if (begin.kind === "replay") return replayResult(entry, begin.outcome, params.sink);
			if (begin.kind === "recover") {
				entry.replay = true;
				await finish(entry, terminalError("provider-error"));
				return replayResult(entry, entry.terminalOutcome, params.sink);
			}
			const fence = durableFence(entry);
			if (fence || controls.isStopping() && !controls.isDraining(entry.request.sessionId)) {
				await settleAbort(entry, fence ?? "cancelled");
				return acceptedResult(entry, params.sink);
			}
			if ([...providers.values()].filter((sessionId) => sessionId === entry.request.sessionId).length >= MAX_PROVIDER_OPERATIONS_PER_SESSION) {
				entry.replay = true;
				await finish(entry, terminalError("provider-error"));
				return replayResult(entry, entry.terminalOutcome, params.sink);
			}
			return acceptedResult(entry, params.sink);
		})(), entry.storeInput).catch((error) => {
			retainFailure(entry, error);
			return {
				ok: false,
				reason: "provider-error"
			};
		});
		return await entry.admission;
	};
	const cancelOperation = async (params) => {
		if (unknownSettlements.has(inferenceTurnKey(params.request))) await joinInferenceOperations([], unknownSettlements.get(inferenceTurnKey(params.request)));
		const claimKey = serializeWorkerSessionTurnClaim(params.identity.turnClaim);
		const failed = active.get(claimKey);
		if (failed?.failure && !hasSqliteWorkerOutcomeUnknown(failed.failure.error)) forget(failed);
		const entry = active.get(claimKey);
		if (entry?.request.turnId === params.request.turnId) await settleAbort(entry, "cancelled");
		else await track((async () => {
			await recovered;
			assertKnownTurn(inferenceTurnKey(params.request));
			let authorityFailure;
			try {
				await store.cancelPending({
					environmentId: params.identity.environmentId,
					sessionId: params.request.sessionId,
					runEpoch: params.request.runEpoch,
					runId: params.request.runId,
					turnId: params.request.turnId,
					outcome: terminalError("cancelled")
				}, () => {
					assertKnownTurn(inferenceTurnKey(params.request));
					const failure = safeRevalidate(params.revalidate, (error) => {
						authorityFailure ??= { error };
						retainUnknown(inferenceTurnKey(params.request), error);
					});
					if (failure) throw authorityFailure ? authorityFailure.error : new WorkerInferenceAuthorityError(failure);
				});
			} catch (error) {
				throw preserveInferenceAuthorityFailure(error, authorityFailure);
			}
		})(), params.request);
		return {
			ok: true,
			result: { status: "cancelled" }
		};
	};
	const cancel = async (params) => {
		const reason = matchesIdentity(params.identity, params.request) ?? params.revalidate?.() ?? null;
		if (reason) return {
			ok: false,
			reason
		};
		if (unknownSettlements.has(inferenceTurnKey(params.request))) return {
			ok: false,
			reason: "provider-error"
		};
		const closing = controls.getClosing(params.request.sessionId);
		if (closing) return closing.then(() => ({
			ok: true,
			result: { status: "cancelled" }
		}), () => ({
			ok: false,
			reason: "provider-error"
		}));
		return track(cancelOperation(params), params.request).catch(() => ({
			ok: false,
			reason: "provider-error"
		}));
	};
	return {
		ready: () => recovered,
		start,
		cancel,
		cancelEnvironment: controls.cancelEnvironment,
		cancelClaim: (claim) => controls.cancelClaim(serializeWorkerSessionTurnClaim(claim)),
		cancelSession: controls.cancelSession,
		captureSessionCancellation: controls.captureSessionCancellation,
		reserveSessionDrain: controls.reserveSessionDrain,
		hasSession: controls.hasSession,
		resolveSessionTargetForRunId: controls.resolveSessionTargetForRunId,
		stop: controls.stop
	};
}
//#endregion
//#region src/gateway/worker-environments/prepared-pool-presence.ts
const HUMAN_PRESENCE_RETIRE_AFTER_MS = 9e5;
const REPOSITORY_REF_REFRESH_INTERVAL_MS = 6e4;
const PRESENCE_RESERVE_EXPIRY_MS = Number.MAX_SAFE_INTEGER;
function isSupersededPresenceReserve(record, demand) {
	if (record.preparation?.purpose !== "reserve" || record.preparation.expiresAtMs !== PRESENCE_RESERVE_EXPIRY_MS) return false;
	return !demand || record.profileId !== demand.profileId || record.preparation.key !== demand.preparationKey || readWorkerProjectSnapshot(record.profileSnapshot.project)?.key !== demand.project.key;
}
function createPreparedPoolPresence(options) {
	const { store, signal, now } = options;
	let humanPresent = false;
	let humanPresenceObserved = false;
	let humanPresenceChangedAtMs = now();
	let version = 0;
	let loaded = false;
	let loading;
	let demand;
	let refResolvedAtMs;
	const current = () => signal.throwIfAborted();
	const policy = () => {
		const source = options.resolveHumanPresenceDemand?.();
		if (!source || !options.presenceDemandStore) return;
		return {
			...source,
			retireAfterMs: HUMAN_PRESENCE_RETIRE_AFTER_MS
		};
	};
	const read = async () => {
		if (!loaded) await (loading ??= (async () => {
			try {
				demand = await options.presenceDemandStore?.read();
				loaded = true;
			} finally {
				loading = void 0;
			}
		})());
		return demand;
	};
	const write = async (value, expectedVersion, assertPolicyCurrent) => {
		const assertCurrent = () => {
			current();
			assertPolicyCurrent?.();
			if (version !== expectedVersion) throw new Error("Authenticated human presence changed during prepared-pool maintenance");
		};
		assertCurrent();
		demand = await options.presenceDemandStore.write(value, assertCurrent);
		loaded = true;
		assertCurrent();
	};
	const matches = (state, source) => state.profileId === source.profileId && state.project.source.url === source.repository.url && state.project.source.owner.agent.agentId === source.repository.agentId && state.requestedRef === (source.repository.ref ?? null);
	const maintain = async () => {
		const expectedVersion = version;
		let state = await read();
		current();
		if (expectedVersion !== version) throw new Error("Authenticated human presence changed during prepared-pool maintenance");
		const source = policy();
		if (!source) {
			if (state) await write(null, expectedVersion);
			return;
		}
		const assertPolicyCurrent = () => {
			current();
			if (!isDeepStrictEqual(policy(), source)) throw new Error("Human-presence repository policy changed during preparation");
		};
		if (state && !matches(state, source)) {
			await write(null, expectedVersion);
			state = void 0;
			refResolvedAtMs = void 0;
		}
		if (!humanPresent) {
			if (state?.retireAtMs === null) {
				const absentAtMs = humanPresenceObserved ? humanPresenceChangedAtMs : state.lastPresentAtMs;
				state = {
					...state,
					revision: state.revision + 1,
					retireAtMs: absentAtMs + source.retireAfterMs
				};
				await write(state, expectedVersion, assertPolicyCurrent);
			}
			return state;
		}
		const previous = state;
		const retained = previous && matches(previous, source) && refResolvedAtMs !== void 0 && now() - refResolvedAtMs < REPOSITORY_REF_REFRESH_INTERVAL_MS;
		const resolutionStartedAtMs = now();
		const intent = await options.prepareIntent(source.profileId, {
			...retained && previous ? { projectRepository: previous.project } : { repository: source.repository },
			executionMode: source.executionMode,
			signal
		});
		current();
		if (expectedVersion !== version) throw new Error("Authenticated human presence changed during repository preparation");
		assertPolicyCurrent();
		const project = readWorkerProjectSnapshot(intent.profileSnapshot.project);
		const preparation = readWorkerProjectPreparation(intent.profileSnapshot.project);
		if (!project || !("source" in project) || !preparation) throw new Error("Human-presence demand requires an admitted repository preparation");
		state = {
			revision: (state?.revision ?? 0) + 1,
			profileId: source.profileId,
			requestedRef: source.repository.ref ?? null,
			preparationKey: preparation.key,
			project,
			lastPresentAtMs: now(),
			retireAtMs: null
		};
		await write(state, expectedVersion, assertPolicyCurrent);
		if (!retained) refResolvedAtMs = resolutionStartedAtMs;
		const config = options.getConfig().cloudWorkers;
		const profile = config?.profiles?.[source.profileId];
		const providerId = profile && normalizeCapabilityProviderId(profile.provider);
		if (!profile || !providerId || providerId !== intent.providerId) throw new Error("Human-presence worker profile changed during preparation");
		const limits = {
			target: profile.readyWorkers ?? 1,
			maxTotal: config?.preparedPool?.maxTotal ?? 4
		};
		const slots = store.preparedCapacity({
			profileId: source.profileId,
			projectKey: project.key,
			...limits
		});
		for (let index = 0; index < slots; index += 1) if (!await store.ensurePreparedIntent({
			intent: {
				...deriveEnvironmentIntent(`prepared:${randomUUID()}`),
				providerId,
				profileId: source.profileId,
				profileSnapshot: intent.profileSnapshot,
				preparation: {
					purpose: "reserve",
					key: preparation.key,
					demandAtMs: state.lastPresentAtMs,
					expiresAtMs: PRESENCE_RESERVE_EXPIRY_MS
				}
			},
			projectKey: project.key,
			...limits,
			assertCurrent: () => {
				current();
				assertPolicyCurrent();
				if (expectedVersion !== version || !humanPresent) throw new Error("Authenticated human presence changed before reserve admission");
				options.assertIntentCurrent(source.profileId, intent);
			}
		})) break;
		return state;
	};
	return {
		maintain,
		ready: read,
		current: () => {
			if (demand?.retireAtMs === null && !humanPresent) {
				const absentAtMs = humanPresenceObserved ? humanPresenceChangedAtMs : demand.lastPresentAtMs;
				return {
					...demand,
					retireAtMs: absentAtMs + HUMAN_PRESENCE_RETIRE_AFTER_MS
				};
			}
			return demand;
		},
		matchesCurrentPolicy: (state) => {
			const source = policy();
			return Boolean(source && matches(state, source));
		},
		set: (present) => {
			humanPresenceObserved = true;
			if (humanPresent !== present) {
				humanPresent = present;
				humanPresenceChangedAtMs = now();
				refResolvedAtMs = void 0;
				version += 1;
			}
			return options.schedule();
		},
		isPresent: () => humanPresent
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
	let presenceInFlight;
	let presenceAdmitted = false;
	const preparations = /* @__PURE__ */ new Map();
	const current = () => signal.throwIfAborted();
	const configuredPolicy = (profileId) => {
		const config = options.getConfig().cloudWorkers;
		const profile = config?.profiles?.[profileId];
		return {
			providerId: profile ? normalizeCapabilityProviderId(profile.provider) : void 0,
			target: profile ? profile.readyWorkers ?? DEFAULT_READY_WORKERS : 0,
			maxTotal: config?.preparedPool?.maxTotal ?? DEFAULT_MAX_TOTAL
		};
	};
	const policy = (record) => {
		const config = configuredPolicy(record.profileId);
		const configured = config.providerId === record.providerId;
		return {
			configured,
			target: configured ? config.target : 0,
			maxTotal: config.maxTotal
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
	const presence = createPreparedPoolPresence({
		...options,
		schedule: () => schedule()
	});
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
		const activePresenceDemand = presence.current();
		const presenceDeferred = !presenceAdmitted;
		const inventory = store.list();
		const sources = /* @__PURE__ */ new Map();
		const activationByGeneration = /* @__PURE__ */ new Map();
		const buildingKeys = /* @__PURE__ */ new Set();
		for (const record of inventory) {
			const demandAtMs = demandAt(record);
			const key = groupKey(record);
			const build = record.preparation?.purpose === "build" && record.preparation.consumedAtMs === null && record.destroyRequestedAtMs === null && record.state !== "failed" && record.state !== "destroyed";
			if (key && build && record.state !== "ready") buildingKeys.add(key);
			if (activePresenceDemand && (activePresenceDemand.retireAtMs ?? Infinity) > now() && activePresenceDemand.profileId === record.profileId && activePresenceDemand.project.key === readWorkerProjectSnapshot(record.profileSnapshot.project)?.key && activePresenceDemand.preparationKey !== record.preparation?.key) continue;
			if (isSupersededPresenceReserve(record, activePresenceDemand)) continue;
			const preparation = readWorkerProjectPreparation(record.profileSnapshot.project);
			if (key && demandAtMs !== void 0 && preparation) {
				if (record.lastActivatedAtMs !== null) {
					const generationKey = JSON.stringify([key, preparation.key]);
					activationByGeneration.set(generationKey, Math.max(activationByGeneration.get(generationKey) ?? record.lastActivatedAtMs, record.lastActivatedAtMs));
				}
				const previous = sources.get(key);
				if (!previous || demandAtMs > previous.demandAtMs || demandAtMs === previous.demandAtMs && build) sources.set(key, {
					record,
					demandAtMs
				});
			}
		}
		const eligible = /* @__PURE__ */ new Map();
		const defer = (generation, error) => {
			generation.deferred = true;
			options.warn(`Prepared worker maintenance deferred (${generation.source.profileId}); retaining unused capacity until its original expiry: ${boundedWorkerError(error)}`);
		};
		for (const [key, { record, demandAtMs }] of sources) {
			const limits = policy(record);
			if (!limits.configured || limits.target === 0 && !buildingKeys.has(key) || limits.maxTotal === 0) continue;
			const preparationKey = readWorkerProjectPreparation(record.profileSnapshot.project).key;
			try {
				const provider = options.resolveProvider(record.providerId);
				if (!provider) throw new Error(`Worker provider is unavailable (${record.providerId})`);
				const timeout = provider.resolvePreparedIdleTimeoutMs?.(snapshotSettings(record));
				const presenceOwned = activePresenceDemand && activePresenceDemand.profileId === record.profileId && activePresenceDemand.preparationKey === record.preparation?.key && activePresenceDemand.project.key === readWorkerProjectSnapshot(record.profileSnapshot.project)?.key;
				const presenceExpiresAtMs = activePresenceDemand?.retireAtMs ?? Number.MAX_SAFE_INTEGER;
				const activationDemandAtMs = presenceOwned ? activationByGeneration.get(JSON.stringify([key, preparationKey])) : demandAtMs;
				const activationExpiresAtMs = activationDemandAtMs !== void 0 && Number.isSafeInteger(timeout) && timeout && timeout > 0 ? activationDemandAtMs + timeout : void 0;
				const activationEligible = activationExpiresAtMs !== void 0 && activationExpiresAtMs > now();
				if (presenceOwned && presenceExpiresAtMs > now() || activationEligible) eligible.set(key, {
					source: record,
					preparationKey,
					demandAtMs: presenceOwned ? Math.max(activePresenceDemand.lastPresentAtMs, demandAtMs) : demandAtMs,
					expiresAtMs: Math.max(presenceOwned ? presenceExpiresAtMs : 0, activationExpiresAtMs ?? 0),
					presenceOwned: Boolean(presenceOwned),
					deferred: Boolean(presenceOwned && presenceDeferred && !activationEligible),
					activationEligible
				});
			} catch (error) {
				current();
				const expiresAtMs = inventory.reduce((latest, reserved) => {
					const preparation = reserved.preparation;
					return preparation?.consumedAtMs === null && preparation.key === preparationKey && groupKey(reserved) === key && reserved.destroyRequestedAtMs === null && !["failed", "destroyed"].includes(reserved.state) ? Math.max(latest, preparation.expiresAtMs) : latest;
				}, 0);
				const generation = {
					source: record,
					preparationKey,
					demandAtMs,
					expiresAtMs
				};
				defer(generation, error);
				if (expiresAtMs > now()) eligible.set(key, generation);
			}
		}
		const isGenerationCurrent = (generation) => {
			current();
			if (generation.presenceOwned && !generation.activationEligible && (!activePresenceDemand || !presence.matchesCurrentPolicy(activePresenceDemand))) return false;
			if (generation.presenceOwned && !generation.activationEligible && (!presenceAdmitted || !presence.isPresent())) throw new Error("Authenticated human presence is unavailable for preparation");
			if (!isDeepStrictEqual(store.get(generation.source.environmentId)?.profileSnapshot, generation.source.profileSnapshot)) return false;
			if (!generation.retention?.isCurrent()) return false;
			if (generation.intent) options.assertIntentCurrent(generation.source.profileId, generation.intent);
			return true;
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
				else if (!generation || generation.preparationKey !== owned.preparation.key || !store.isPreparedIntentWithinCapacity({
					environmentId: owned.environmentId,
					...policy(owned)
				})) retirementReason = "invalidated";
				else if (generation.deferred) throw new Error("Prepared worker maintenance is deferred");
				else try {
					if (!isGenerationCurrent(generation)) retirementReason = "invalidated";
				} catch (error) {
					current();
					defer(generation, error);
					throw error;
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
				const expired = (generation?.expiresAtMs ?? record.preparation.expiresAtMs) <= now();
				const valid = !isSupersededPresenceReserve(record, activePresenceDemand) && !expired && generation?.preparationKey === record.preparation.key && (!requireRetention || generation.retention !== void 0 || generation.deferred) && (record.preparation.purpose === "build" && record.state !== "ready" || count < limits.target) && totalKept < limits.maxTotal;
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
				} else if (!generation?.deferred && (!generation?.presenceOwned || generation.activationEligible || presence.isPresent())) work.push(latest);
			}
			return {
				cleanup,
				work
			};
		};
		await reconcileAll((await retain(false)).cleanup);
		for (const [key, generation] of eligible) {
			if (presenceDeferred && generation.presenceOwned && !generation.activationEligible) continue;
			try {
				generation.retention = await options.prepareRetention(generation.source, signal);
				current();
				if (!generation.retention) eligible.delete(key);
			} catch (error) {
				current();
				defer(generation, error);
			}
		}
		await reconcileAll((await retain(true)).cleanup);
		let plannedTotal = 0;
		for (const [key, generation] of eligible) {
			current();
			if (generation.deferred) continue;
			const { source } = generation;
			const limits = policy(source);
			const project = readWorkerProjectSnapshot(source.profileSnapshot.project);
			const slots = store.preparedCapacity({
				profileId: source.profileId,
				projectKey: project.key,
				...limits,
				maxTotal: Math.max(0, limits.maxTotal - plannedTotal)
			});
			if (slots === 0 || generation.expiresAtMs <= now() || !presence.isPresent() && activePresenceDemand && generation.preparationKey === activePresenceDemand.preparationKey && !generation.activationEligible) continue;
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
			} catch (error) {
				current();
				options.warn(`Prepared worker refill deferred (${source.profileId}): ${boundedWorkerError(error)}`);
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
						if (!isGenerationCurrent(generation)) throw new Error("Prepared worker contents changed before allocation");
						if (!isDeepStrictEqual(policy(source), limits)) throw new Error("Prepared worker admission policy changed");
					}
				});
				if (!admitted) break;
				work.push(admitted);
			}
		}
		await reconcileAll(work);
	};
	const scheduleInventory = () => {
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
	const schedule = async () => {
		if (signal.aborted) return;
		await store.ready();
		await presence.ready();
		current();
		const admission = presenceInFlight ??= (async () => {
			presenceAdmitted = false;
			const previousDemand = presence.current();
			try {
				await presence.maintain();
				presenceAdmitted = true;
			} finally {
				presenceInFlight = void 0;
				if (previousDemand || presence.current()) await scheduleInventory();
			}
		})();
		const results = await Promise.allSettled([admission, scheduleInventory()]);
		for (const result of results) if (result.status === "rejected") throw result.reason;
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
		const presenceDemand = presence.current();
		return limits.target > 0 && limits.maxTotal > 0 && record.state === "ready" && record.providerId === intent.providerId && record.preparation !== null && record.preparation.key === intent.preparationKey && record.preparation.consumedAtMs === null && (presenceDemand?.project.key === readWorkerProjectSnapshot(record.profileSnapshot.project)?.key && (presenceDemand.retireAtMs ?? Number.MAX_SAFE_INTEGER) > now() || record.preparation.expiresAtMs > now()) && record.destroyRequestedAtMs === null && record.sharedHost === false && record.nodeDeviceId !== null && record.leaseId !== null;
	}) : [];
	const maintain = async (environmentId) => {
		if (signal.aborted) return;
		if (environmentId) await noteDemand(environmentId).catch(() => {
			if (!signal.aborted) options.warn("Prepared snapshot demand could not be recorded");
		});
		await schedule().catch((error) => {
			if (!signal.aborted) options.warn(`Prepared worker maintenance will retry: ${boundedWorkerError(error)}`);
		});
	};
	const canPruneDemand = (record, nowMs) => {
		const demandAtMs = demandAt(record);
		if (demandAtMs === void 0 || !readWorkerProjectPreparation(record.profileSnapshot.project)) return true;
		const presenceDemand = presence.current();
		if (presenceDemand?.profileId === record.profileId && presenceDemand.preparationKey === record.preparation?.key && presenceDemand.project.key === readWorkerProjectSnapshot(record.profileSnapshot.project)?.key) return presenceDemand.retireAtMs !== null && presenceDemand.retireAtMs <= nowMs;
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
		cancelPreparation,
		summary: () => ({
			maxTotal: options.getConfig().cloudWorkers?.preparedPool?.maxTotal ?? DEFAULT_MAX_TOTAL,
			reservedEnvironmentIds: store.preparedReservationEnvironmentIds()
		}),
		target: (profileId) => configuredPolicy(profileId).target,
		setHumanPresence: presence.set
	};
}
//#endregion
//#region src/gateway/worker-environments/dedicated-node-lease-attestations.ts
function createDedicatedNodeLeaseAttestations(options, assertCurrent) {
	const { store } = options;
	const dedicatedNodeLeases = /* @__PURE__ */ new Map();
	const retireDedicatedNodeLease = (environmentId) => {
		const proof = dedicatedNodeLeases.get(environmentId);
		dedicatedNodeLeases.delete(environmentId);
		proof?.controller.abort(/* @__PURE__ */ new Error("Dedicated worker lease qualification ended"));
	};
	const noteDedicatedNodeLease = (record, explicitDedicated) => {
		assertCurrent(record);
		const prior = dedicatedNodeLeases.get(record.environmentId);
		if (explicitDedicated && record.sharedHost === false && prior && isWorkerNodeCarrierBindingCurrent(record, prior.binding)) return;
		retireDedicatedNodeLease(record.environmentId);
		if (explicitDedicated && record.leaseId && record.nodeDeviceId && record.sharedHost === false) dedicatedNodeLeases.set(record.environmentId, {
			binding: {
				environmentId: record.environmentId,
				leaseId: record.leaseId,
				nodeDeviceId: record.nodeDeviceId,
				ownerEpoch: record.ownerEpoch
			},
			controller: new AbortController()
		});
	};
	const getDedicatedNodeLeaseSignal = (environmentId) => {
		const proof = dedicatedNodeLeases.get(environmentId);
		const current = store.get(environmentId);
		return !options.isStopping() && proof && current?.sharedHost === false && isWorkerNodeCarrierBindingCurrent(current, proof.binding) ? proof.controller.signal : void 0;
	};
	const unsubscribeDedicatedLeaseRevocation = store.onCredentialRevoked((environmentId) => {
		const proof = dedicatedNodeLeases.get(environmentId);
		if (proof && (!store.getCredential(environmentId) || getDedicatedNodeLeaseSignal(environmentId) !== proof.controller.signal)) retireDedicatedNodeLease(environmentId);
	});
	return {
		async reconcileSharedHost(initialRecord, leaseId, inspection, stopOwner) {
			let record = initialRecord;
			const sharedHost = inspection.sharedHost === true;
			if (record.sharedHost !== null && record.sharedHost !== sharedHost) record = await stopOwner(record);
			record = await store.reconcileSharedHost({
				environmentId: record.environmentId,
				state: record.state,
				leaseId,
				sharedHost
			});
			noteDedicatedNodeLease(record, inspection.explicitlyDedicated);
			return record;
		},
		async inspect(record, provider, lease) {
			const inspection = await options.callProvider(record.environmentId, () => provider.inspect(lease)).then((result) => ({
				...requireWorkerLeaseStatus(result),
				explicitlyDedicated: result.status === "active" && result.sharedHost === false
			})).catch(async (error) => {
				await options.saveError(record, error);
			});
			if (inspection) {
				assertCurrent(record);
				if (!inspection.explicitlyDedicated) retireDedicatedNodeLease(record.environmentId);
			}
			return inspection;
		},
		note: noteDedicatedNodeLease,
		retire: retireDedicatedNodeLease,
		signal: getDedicatedNodeLeaseSignal,
		clear() {
			unsubscribeDedicatedLeaseRevocation();
			for (const environmentId of dedicatedNodeLeases.keys()) retireDedicatedNodeLease(environmentId);
		}
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
		if (!prepared || prepared.profileId !== profileId) throw workerEnvironmentServiceError("invalid_state", "Worker preparation is not owned by this lifecycle");
		prepared.assertCurrent();
	};
	const { store, withLock, providerFor, resumeProvision } = options;
	const requireProfileId = (profileId, signal) => {
		signal?.throwIfAborted();
		if (options.isStopping()) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
		const normalizedProfileId = profileId.trim();
		if (!normalizedProfileId || normalizedProfileId !== profileId) throw workerEnvironmentServiceError("invalid_profile", "Worker profile id must be non-empty and trimmed");
		return normalizedProfileId;
	};
	const resolveProfile = (profileId, createOptions) => {
		const normalizedProfileId = requireProfileId(profileId, createOptions.signal);
		const { inherited } = createOptions;
		let provider;
		let providerId;
		let profileSnapshot;
		const profiles = options.getConfig().cloudWorkers?.profiles;
		const configuredProfile = profiles && Object.hasOwn(profiles, normalizedProfileId) ? profiles[normalizedProfileId] : void 0;
		if (inherited) {
			providerId = normalizeCapabilityProviderId(inherited.providerId) ?? inherited.providerId;
			if (providerId !== inherited.providerId) throw workerEnvironmentServiceError("invalid_profile", "Inherited worker provider id is not canonical");
			requireInheritedWorkerProfileAuthorization(normalizedProfileId, providerId, inherited.profileSnapshot.settings, configuredProfile?.provider);
			provider = providerFor(providerId);
			if ((normalizeCapabilityProviderId(provider.id) ?? provider.id) !== providerId) throw workerEnvironmentServiceError("invalid_profile", "Inherited worker provider identity changed");
			profileSnapshot = inherited.profileSnapshot;
		} else {
			if (!configuredProfile) throw workerEnvironmentServiceError("profile_not_found", `Unknown worker profile: ${normalizedProfileId}`);
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
			if (current.provider !== provider || !isDeepStrictEqual(current.profileSnapshot, resolved.profileSnapshot)) throw workerEnvironmentServiceError("invalid_profile", "Worker profile changed during preparation");
		};
		if ([
			projectPath,
			createOptions.repository,
			createOptions.projectRepository
		].filter(Boolean).length > 1) throw workerEnvironmentServiceError("invalid_profile", "Worker preparation must have exactly one project source");
		if ((projectPath || createOptions.repository || createOptions.projectRepository) && provider.supportsProjectPreparation?.(profile, machineClass, os)) {
			if (!options.projectNamespace) throw workerEnvironmentServiceError("invalid_state", "Worker project preparation namespace is unavailable");
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
				if (!isDeepStrictEqual(intent, admittedSnapshot)) throw workerEnvironmentServiceError("invalid_state", "Prepared worker intent was changed after preparation");
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
		const isConfiguredOwnerCurrent = () => {
			signal?.throwIfAborted();
			const config = options.getConfig();
			const configured = config.cloudWorkers?.profiles?.[record.profileId];
			if (!configured || normalizeCapabilityProviderId(configured.provider) !== record.providerId || !isDeepStrictEqual(allocationSnapshot({
				install: configured.install ?? "bundle",
				settings: requireWorkerProfile(configured.settings ?? {})
			}, createOptions), allocationSnapshot(record.profileSnapshot, createOptions))) return false;
			if ("source" in project) {
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
				if (!matchesAgentLifecycleBinding(config, agent) || (selected ? identity.source !== selectedSource || !("profileId" in identity) || identity.profileId !== selected.profileId : identity.source !== "anonymous" && identity.source !== "system-detected")) return false;
			}
			return true;
		};
		if (!isConfiguredOwnerCurrent()) return;
		const { provider, providerId, profileSnapshot } = resolveProfile(record.profileId, createOptions);
		const profile = requireWorkerProfile(profileSnapshot.settings);
		const target = provider.resolvePreparationTarget?.(profile, createOptions.machineClass, createOptions.os);
		if (providerId !== record.providerId || !target || !isDeepStrictEqual(target, preparation.target) || !provider.requiresNodeEnrollment || !provider.supportsProjectPreparation?.(profile, createOptions.machineClass, createOptions.os)) return;
		const isProfileCurrent = () => {
			if (!isConfiguredOwnerCurrent()) return false;
			const current = resolveProfile(record.profileId, createOptions);
			return Boolean(current.provider === provider && isDeepStrictEqual(current.profileSnapshot, profileSnapshot) && isDeepStrictEqual(provider.resolvePreparationTarget?.(profile, createOptions.machineClass, createOptions.os), target) && provider.requiresNodeEnrollment && provider.supportsProjectPreparation?.(profile, createOptions.machineClass, createOptions.os));
		};
		if (!isProfileCurrent()) return;
		const prepared = await options.prepareNodeArtifacts(profileSnapshot, signal);
		const isCurrent = () => {
			if (!isProfileCurrent()) return false;
			prepared.assertCurrent();
			return true;
		};
		if (!isCurrent()) return;
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
		return isDeepStrictEqual(observed, preparation) ? { isCurrent } : void 0;
	};
	const createWithProfile = async (profileId, idempotencyKey, createOptions = {}, admittedIntent) => {
		const { machineClass, os, executionMode, projectPath, signal } = createOptions;
		const inherited = createOptions.inherited ? {
			providerId: createOptions.inherited.providerId,
			profileSnapshot: allocationSnapshot(createOptions.inherited.profileSnapshot, createOptions)
		} : void 0;
		const normalizedProfileId = requireProfileId(profileId, signal);
		const { environmentId, provisionOperationId } = deriveEnvironmentIntent(idempotencyKey);
		return withLock(environmentId, async () => {
			await store.ready();
			signal?.throwIfAborted();
			if (options.isStopping()) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
			const existing = store.get(environmentId);
			if (existing) {
				const existingProject = readWorkerProjectSnapshot(existing.profileSnapshot.project);
				if (existingProject && projectPath) {
					if ("source" in existingProject) throw workerEnvironmentServiceError("invalid_profile", "Idempotency key belongs to another project");
					if (!options.projectNamespace) throw workerEnvironmentServiceError("invalid_state", "Worker project preparation namespace is unavailable");
					const { commonDir } = await resolveGitRepositoryPaths(await fs.realpath(projectPath), { signal });
					signal?.throwIfAborted();
					if (workerLocalProjectKey(options.projectNamespace, commonDir) !== existingProject.key) throw workerEnvironmentServiceError("invalid_profile", "Idempotency key belongs to another project");
					if (createOptions.projectCommit !== void 0 && createOptions.projectCommit !== existingProject.baseCommit) throw workerEnvironmentServiceError("invalid_profile", "Idempotency key belongs to another project preparation");
				}
				const requested = admittedIntent ?? (createOptions.repository || createOptions.projectRepository ? await prepareIntent(profileId, createOptions) : void 0);
				if (requested) {
					signal?.throwIfAborted();
					assertPreparedIntentCurrent(profileId, requested);
					if (!isDeepStrictEqual(projectReplayIdentity(existing.profileSnapshot.project), projectReplayIdentity(requested.profileSnapshot.project))) throw workerEnvironmentServiceError("invalid_profile", "Idempotency key belongs to another project preparation");
				}
				if (existing.profileId !== normalizedProfileId || inherited !== void 0 && (existing.providerId !== inherited.providerId || !isDeepStrictEqual(existing.profileSnapshot, {
					...inherited.profileSnapshot,
					...existingProject ? { project: existing.profileSnapshot.project } : {}
				})) || inherited === void 0 && (existing.profileSnapshot.machineClass !== machineClass || existing.profileSnapshot.os !== os || existing.profileSnapshot.executionMode !== executionMode)) throw workerEnvironmentServiceError("invalid_profile", "Idempotency key belongs to another profile");
				if (existing.destroyRequestedAtMs !== null) return existing;
				if (!existing.leaseId && ["requested", "provisioning"].includes(existing.state)) return resumeProvision(existing, void 0, signal);
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
			if (admitted.providerId !== current.providerId || !isDeepStrictEqual(admittedProfile, current.profileSnapshot) || admitted.preparationKey !== readWorkerProjectPreparation(admitted.profileSnapshot.project)?.key) throw workerEnvironmentServiceError("invalid_profile", "Prepared worker intent no longer matches its profile");
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
	const machineCatalogs = /* @__PURE__ */ new Map();
	const machineShapeListeners = /* @__PURE__ */ new Set();
	let machineShapeVersion = 0;
	const machineCatalogChanged = (profileId, catalog) => {
		if (machineCatalogs.get(profileId) === catalog) {
			machineShapeVersion += 1;
			notifyListeners(machineShapeListeners, profileId, () => {
				options.warn("Worker machine metadata change reporting failed");
			});
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
		subscribeMachineShapeChanged: (listener) => registerListener(machineShapeListeners, listener),
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
		const prepareNodeBootstrap = options.prepareNodeBootstrap;
		if (!provider.requiresNodeEnrollment || !prepareNodeBootstrap) return;
		let identity;
		let installation;
		try {
			const [bootstrapResult, installationResult] = await racePromiseWithAbortSignal(Promise.allSettled([Promise.resolve().then(() => prepareNodeBootstrap(record, signal)), prepareBundle(void 0, signal)]), signal);
			signal?.throwIfAborted();
			if (bootstrapResult.status === "rejected") throw bootstrapResult.reason;
			if (installationResult.status === "rejected") throw installationResult.reason;
			const nodeBootstrapSha256 = bootstrapResult.value;
			installation = installationResult.value;
			const preparation = readWorkerProjectPreparation(record.profileSnapshot.project);
			if (preparation && (preparation.artifacts.nodeBootstrapSha256 !== nodeBootstrapSha256 || preparation.artifacts.workerArchiveSha256 !== installation.tarballSha256)) throw new Error("Prepared project runtime artifacts changed after admission");
			identity = {
				nodeBootstrapSha256,
				executionMode: record.profileSnapshot.executionMode === "remote-exec" ? "remote-exec" : "worker-turn",
				workerBundleSha256: installation.tarballSha256
			};
		} catch (error) {
			signal?.throwIfAborted();
			const current = options.store.get(record.environmentId);
			if (current?.provisionOperationId === record.provisionOperationId && current.ownerEpoch === record.ownerEpoch && current.destroyRequestedAtMs === null) {
				if (current.state === "requested") await options.move(current, "failed", { lastError: boundedWorkerError(error) });
				else if (current.state === "provisioning") await options.saveError(current, error);
			}
			throw workerEnvironmentServiceError("bootstrap_failure", `Worker node bootstrap preparation failed: ${boundedWorkerError(error)}`);
		}
		beforeProvision?.();
		const current = options.store.get(record.environmentId);
		if (options.isStopping() || !current || current.state !== record.state || current.provisionOperationId !== record.provisionOperationId || current.ownerEpoch !== record.ownerEpoch || current.destroyRequestedAtMs !== null) throw workerEnvironmentServiceError("invalid_state", "Worker provisioning changed during bootstrap preparation");
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
			if (options.isStopping() || !current || current.state !== record.state || current.provisionOperationId !== record.provisionOperationId || current.ownerEpoch !== record.ownerEpoch || current.preparation?.consumedAtMs === null && current.preparation.expiresAtMs <= now() || current.preparation !== null && current.preparation.consumedAtMs !== null || preparation !== void 0 && (!enrollmentOwner?.nodeSetupId || current.nodeSetupId !== enrollmentOwner.nodeSetupId || current.nodeDeviceId !== lease.node.deviceId) || current.destroyRequestedAtMs !== null) throw new Error("Prepared worker provisioning owner is no longer current");
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
				reason: "provision",
				environmentId: record.environmentId,
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
	const { store, move, callProvider, saveError, withLock, providerFor } = options;
	const tunnels = options.tunnelManager;
	const lifecycleLease = (record, leaseId) => ({
		leaseId,
		profile: requireWorkerProfile(record.profileSnapshot.settings)
	});
	const requireCurrentOwner = (record) => {
		const current = store.get(record.environmentId);
		if (!current || current.ownerEpoch !== record.ownerEpoch || current.state !== record.state || current.leaseId !== record.leaseId || current.nodeDeviceId !== record.nodeDeviceId || current.sharedHost !== record.sharedHost || !isDeepStrictEqual(current.attachedSessionIds, record.attachedSessionIds)) throw workerEnvironmentServiceError("invalid_state", "Worker environment owner changed during teardown");
		return current;
	};
	const identityResolverFor = (record, provider, leaseId) => {
		const profile = requireWorkerProfile(record.profileSnapshot.settings);
		return async (keyRef, context) => {
			const resolveSshIdentity = options.resolveSshIdentity;
			if (!resolveSshIdentity) throw new Error("Worker SSH identity resolution is unavailable");
			let open = true;
			const assertAuthorized = () => {
				if (!open) throw new Error("Worker SSH identity invocation is closed");
				context.assertCurrent();
				const current = requireCurrentOwner(record);
				if (options.isStopping() || current.destroyRequestedAtMs !== null) throw new Error("Worker identity owner is closed");
			};
			try {
				return await callProvider(record.environmentId, async () => {
					assertAuthorized();
					const identity = await resolveSshIdentity({
						provider,
						leaseId,
						profile,
						keyRef,
						assertAuthorized
					});
					assertAuthorized();
					return identity;
				});
			} finally {
				open = false;
			}
		};
	};
	const stopOwner = async (record, reason, runtimeRefresh) => {
		requireCurrentOwner(record);
		runtimeRefresh?.assertCurrent();
		options.onOwnerStopped?.(record.environmentId);
		const sessionId = record.attachedSessionIds.length === 1 ? record.attachedSessionIds[0] : null;
		if (sessionId && !runtimeRefresh) {
			await options.placementStore?.prepareWorkspaceResultOwnerRevocation({
				sessionId,
				environmentId: record.environmentId,
				ownerEpoch: record.ownerEpoch
			}, new Error(record.lastError ?? "Cloud worker owner revoked before workspace recovery"), () => {
				requireCurrentOwner(record);
			});
			requireCurrentOwner(record);
		}
		await store.revokeEnvironmentCredential(record.environmentId, {
			fenceWorkspaceTransfers: true,
			expectedOwnerEpoch: record.ownerEpoch,
			assertCurrent: () => {
				requireCurrentOwner(record);
				runtimeRefresh?.assertCurrent();
			}
		});
		requireCurrentOwner(record);
		runtimeRefresh?.assertCurrent();
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
		return [
			"bootstrapping",
			"ready",
			"attached",
			"idle"
		].includes(record.state) ? move(record, "draining", failurePatch) : record;
	};
	const beginDestroy = async (record) => {
		const failurePatch = record.teardownTerminalState === "failed" ? { lastError: record.lastError } : void 0;
		const draining = await beginDrain(record);
		if (draining.state === "draining") return move(draining, "destroying", failurePatch);
		if (draining.state === "destroying") return draining;
		throw workerEnvironmentServiceError("invalid_state", `Cannot destroy worker in state: ${record.state}`);
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
			throw workerEnvironmentServiceError(failureCode, `${failureLabel}; teardown is pending: ${detail}`);
		}
		await finishProvenDestroy(destroying);
		throw workerEnvironmentServiceError(failureCode, `${failureLabel}: ${detail}`);
	};
	const finishConfirmedProvisionCleanup = async (record, error) => {
		const current = store.get(record.environmentId);
		if (!current || current.provisionOperationId !== record.provisionOperationId || current.ownerEpoch !== record.ownerEpoch) throw workerEnvironmentServiceError("invalid_state", "Worker provisioning owner changed during cleanup");
		const detail = boundedWorkerError(error.provisionError);
		const destroying = await store.adoptProvisionCleanupFailure({
			environmentId: record.environmentId,
			leaseId: error.leaseId,
			lastError: detail
		});
		await finishProvenDestroy(await stopOwner(destroying, "provider-destroyed"));
		throw workerEnvironmentServiceError("provider_failure", `Worker provider operation failed: ${detail}`);
	};
	const preserveIndeterminateProvisionCleanup = async (record, error) => {
		const detail = `${boundedWorkerError(error.provisionError, 480)}; provider teardown pending: ${boundedWorkerError(error.cleanupError, 480)}`;
		await store.adoptProvisionCleanupFailure({
			environmentId: record.environmentId,
			leaseId: error.leaseId,
			lastError: detail
		});
		throw workerEnvironmentServiceError("provider_failure", `Worker provider operation failed; teardown is pending: ${detail}`);
	};
	const finishDestroy = async (record, provider) => {
		let r = record;
		if (r.state === "requested") return move(requireCurrentOwner(r), "failed", { lastError: "Provisioning canceled before provider allocation" });
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
				throw workerEnvironmentServiceError("provider_failure", boundedWorkerError(error));
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
			throw workerEnvironmentServiceError("provider_failure", boundedWorkerError(error));
		}
		return await finishProvenDestroy(providerOwnsMachine ? await stopOwner(destroying, "provider-destroyed") : destroying);
	};
	const destroy = async (environmentId, destroyOptions = {}) => {
		if (options.isStopping()) throw workerEnvironmentServiceError("invalid_state", "Worker environment service is stopping");
		return withLock(environmentId, async () => {
			await store.ready();
			const abandonment = destroyOptions.abandonment;
			abandonment?.authorize?.();
			let record = store.get(environmentId);
			if (!record) {
				await destroyOptions.forceAbandon?.();
				throw workerEnvironmentServiceError("environment_not_found", `Unknown worker environment: ${environmentId}`);
			}
			if ([
				"destroyed",
				"failed",
				"orphaned"
			].includes(record.state) && (!abandonment || record.state === "destroyed" || record.state === "failed" && !record.leaseId)) {
				await destroyOptions.forceAbandon?.();
				return record;
			}
			if (abandonment && (record.providerId !== "device" || record.ownerEpoch !== abandonment.ownerEpoch || !record.nodeDeviceId || record.sharedHost === false || record.attachedSessionIds.length !== 1 || record.attachedSessionIds[0] !== abandonment.sessionId)) throw workerEnvironmentServiceError("invalid_state", "Abandoned device worker owner changed before retirement");
			if (destroyOptions.requireUnattached && record.attachedSessionIds.length > 0) throw workerEnvironmentServiceError("invalid_state", "Attached cloud workers must be stopped through sessions.reclaim");
			if (destroyOptions.retryRequested === false && record.destroyRequestedAtMs !== null) throw workerEnvironmentServiceError("invalid_state", `Worker environment cleanup is still pending: ${record.lastError ?? record.state}`);
			const destroyOwner = record;
			const assertDestroyOwner = () => {
				abandonment?.authorize?.();
				const current = requireCurrentOwner(destroyOwner);
				if (destroyOptions.requireUnattached && current.attachedSessionIds.length > 0) throw workerEnvironmentServiceError("invalid_state", "Attached cloud workers must be stopped through sessions.reclaim");
			};
			record = await store.requestDestroy({
				environmentId,
				state: record.state,
				assertCurrent: assertDestroyOwner,
				...abandonment ? { terminalState: "failed" } : {},
				...abandonment || destroyOptions.forceAbandon ? { lastError: FORCED_WORKER_ABANDONMENT_ERROR } : {}
			});
			if (destroyOptions.forceAbandon && !hasForcedWorkerEnvironmentAbandonment(record)) record = await store.recordError({
				environmentId,
				state: record.state,
				error: FORCED_WORKER_ABANDONMENT_ERROR,
				assertCurrent: assertDestroyOwner
			});
			await destroyOptions.forceAbandon?.();
			try {
				const destroyed = await finishDestroy(record);
				abandonment?.authorize?.();
				return destroyed;
			} catch (error) {
				if (!abandonment || !(error instanceof WorkerTunnelOwnerDisconnectedError)) throw error;
				abandonment.authorize?.();
				const current = requireCurrentOwner(record);
				if (current.destroyRequestedAtMs === null || store.getCredential(environmentId)) throw workerEnvironmentServiceError("invalid_state", "Abandoned device worker authority is not fenced");
				return saveError(current, error);
			}
		});
	};
	const retireMismatchedLease = async (record, provider) => {
		const transport = record.nodeDeviceId ? "node" : record.sshEndpoint ? "ssh" : void 0;
		const modeError = transport ? resolveWorkerLeaseTransportError(provider, transport, record.profileSnapshot.executionMode) : void 0;
		if (!modeError || record.destroyRequestedAtMs !== null) return false;
		const requested = await store.requestDestroy({
			environmentId: record.environmentId,
			state: record.state,
			terminalState: "failed",
			lastError: modeError.message
		});
		await finishDestroy(requested, provider).catch(() => void 0);
		return true;
	};
	return {
		identityResolverFor,
		requireCurrentOwner,
		stopOwner,
		beginDrain,
		finishProvenDestroy,
		lifecycleLease,
		finishDestroy,
		failBootstrap,
		finishConfirmedProvisionCleanup,
		preserveIndeterminateProvisionCleanup,
		destroy,
		retireMismatchedLease
	};
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
	const { store, callBootstrap, callProvider, move, saveError } = options;
	const now = options.now ?? Date.now;
	const { commitReady, ensurePendingCredential } = options.credentialBroker;
	const dedicatedLeases = createDedicatedNodeLeaseAttestations(options, (record) => requireCurrentOwner(record));
	const providerFor = (providerId) => {
		const provider = options.resolveProvider(providerId);
		if (provider) return provider;
		throw workerEnvironmentServiceError("provider_not_found", `Worker provider is unavailable: ${providerId}`);
	};
	const { identityResolverFor, requireCurrentOwner, stopOwner, beginDrain, finishProvenDestroy, lifecycleLease, finishDestroy, failBootstrap, finishConfirmedProvisionCleanup, preserveIndeterminateProvisionCleanup, destroy, retireMismatchedLease } = createWorkerProviderOwnerLifecycle({
		...options,
		providerFor,
		onOwnerStopped: dedicatedLeases.retire
	});
	const machineCatalog = createWorkerMachineCatalog({
		getConfig: options.getConfig,
		resolveProvider: options.resolveProvider,
		warn: options.warn
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
		if (install !== void 0 && install !== "bundle" && install !== "npm") throw workerEnvironmentServiceError("invalid_profile", "Worker profile has an invalid install method");
		return install ?? "bundle";
	};
	const nodeProvisioning = createWorkerNodeProvisioning({
		...options,
		commitReady,
		failBootstrap: async (record, leaseId, provider, error, patch) => await failBootstrap(record, leaseId, provider, error, "bootstrap_failure", patch)
	});
	const runtimeRefresher = createWorkerRuntimeRefresher({
		...options,
		requireCurrentOwner,
		stopOwner,
		identityResolverFor
	});
	const finishBootstrap = async (record, provider, installation, cancellation) => {
		if (record.state !== "bootstrapping" || !record.leaseId || !record.sshEndpoint) throw workerEnvironmentServiceError("invalid_state", "Worker bootstrap requires a provisioned SSH lease");
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
			if (!sameWorkerBuild(receipt, installation)) throw new Error("Worker bootstrap receipt does not match the expected build identity");
		} catch (error) {
			await cancellation?.settleStopIntent();
			return await failBootstrap(record, leaseId, provider, error);
		}
		return commitReady(record, {
			...receipt,
			installKind: "bundle"
		}, {}, () => {
			cancellation?.assertActive();
			if (requireCurrentOwner(record).destroyRequestedAtMs !== null) throw workerEnvironmentServiceError("invalid_state", "Worker bootstrap owner is stopping");
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
			const profile = requireWorkerProfile(record.profileSnapshot.settings);
			const requestedExecutionMode = record.profileSnapshot.executionMode;
			if (requestedExecutionMode !== void 0 && requestedExecutionMode !== "worker-turn" && requestedExecutionMode !== "remote-exec") throw new WorkerProviderError("Worker environment has an invalid placement execution mode");
			executionMode = requestedExecutionMode;
			if (executionMode && !provider.supportedExecutionModes?.includes(executionMode)) throw new Error(`Worker provider ${provider.id} does not support ${executionMode} placement`);
			const nodeBootstrapTimeoutMs = provider.requiresNodeEnrollment ? MAX_NODE_BOOTSTRAP_TIMEOUT_MS : void 0;
			const providerTimeoutMs = options.providerCallTimeoutMs === void 0 ? requireProviderOperationTimeoutMs("provision", provider.resolveProvisionTimeoutMs?.(profile, { nodeBootstrapTimeoutMs })) : void 0;
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
				nodeBootstrapTimeoutMs,
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
			const permanent = error instanceof WorkerProviderError || error instanceof WorkerEnvironmentServiceError && error.code === "invalid_profile";
			if (record.state === "requested" || provisioningTransition !== void 0 && preparationComplete && permanent) {
				await move(record, "failed", { lastError: detail });
				throw workerEnvironmentServiceError(permanent ? "invalid_profile" : "provider_failure", permanent ? `Worker provider rejected profile: ${detail}` : `Worker provider preparation failed: ${detail}`);
			}
			await saveError(record, error);
			throw workerEnvironmentServiceError("provider_failure", `Worker provider operation failed: ${detail}`);
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
		if (lease.node) {
			const ready = await nodeProvisioning.finish(record, lease, provider, patch, enrollmentOperation?.installation ?? preparedInstallation, cancellation, projectOperation?.getPreparedWorkspace(), beforeProvision);
			dedicatedLeases.note(ready, lease.sharedHost === false);
			return ready;
		}
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
			beforeProvision?.();
			const preparedNode = await nodeProvisioning.prepare(record, provider, signal, beforeProvision);
			let installation = preparedNode?.installation;
			cancellation?.assertActive();
			if (record.state === "requested" && record.destroyRequestedAtMs === null && !installation && provider.provisionBeforeInstallation !== true) {
				try {
					installation = await options.prepareInstallation(installFor(record), signal);
				} catch (error) {
					cancellation?.assertActive();
					const detail = boundedWorkerError(error);
					await move(record, "failed", { lastError: detail });
					throw workerEnvironmentServiceError("bootstrap_failure", `Worker installation preparation failed: ${detail}`);
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
		if (record.destroyRequestedAtMs === null && [
			"ready",
			"idle",
			"attached"
		].includes(record.state)) try {
			currentBundle = await options.prepareInstallation("bundle", signal);
			if (record.bootstrapReceipt && sameWorkerBuild(record.bootstrapReceipt, currentBundle)) {
				const sessionId = record.state === "attached" ? record.attachedSessionIds[0] : null;
				if (record.state !== "attached" || sessionId) {
					await ensurePendingCredential(record, sessionId ?? null);
					record = store.get(record.environmentId) ?? record;
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
		if (await retireMismatchedLease(record, provider)) return;
		const lease = lifecycleLease(record, leaseId);
		const inspection = await dedicatedLeases.inspect(record, provider, lease);
		if (!inspection) return;
		requireCurrentOwner(record);
		const { status } = inspection;
		const teardownExpected = record.destroyRequestedAtMs !== null || record.state === "destroying";
		if (status === "destroyed") {
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
		record = await dedicatedLeases.reconcileSharedHost(record, leaseId, inspection, stopOwner);
		requireCurrentOwner(record);
		if (record.destroyRequestedAtMs !== null) {
			await finishDestroy(record, provider).catch(() => void 0);
			return;
		}
		if (!record.sshEndpoint || record.state === "attached") {
			await runtimeRefresher.refresh(record, provider, currentBundle, signal).catch(async (error) => {
				await saveError(requireCurrentOwner(record), error);
			});
			return;
		}
		if (record.state === "draining") {
			record = await stopOwner(record);
			await move(record, "orphaned", { lastError: record.lastError ?? ORPHANED_LEASE_ERROR });
			return;
		}
		if ([
			"bootstrapping",
			"ready",
			"idle"
		].includes(record.state)) {
			let cancellation = signal ? createWorkerProvisionCancellation(store, record, signal) : void 0;
			if (cancellation) retainProviderSettlement?.(cancellation.settled);
			try {
				cancellation?.assertActive();
				let installation = currentBundle;
				try {
					installation ??= await options.prepareInstallation("bundle", signal);
				} catch (error) {
					if (record.bootstrapReceipt && ["ready", "idle"].includes(record.state)) {
						await saveError(record, error);
						return;
					}
					await failBootstrap(record, leaseId, provider, error).catch(() => void 0);
					return;
				}
				if (record.bootstrapReceipt && sameWorkerBuild(record.bootstrapReceipt, installation)) {
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
		if (["draining", "destroying"].includes(record.state)) await finishDestroy(record, provider).catch(() => void 0);
	};
	const { createWithProfile, prepareIntent, prepareRetention, assertPreparedIntentCurrent } = createWorkerProviderIntent({
		...options,
		providerFor,
		resumeProvision
	});
	return {
		getDedicatedNodeLeaseSignal: dedicatedLeases.signal,
		clearDedicatedNodeLeases: () => dedicatedLeases.clear(),
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
		reconcileRecord,
		readRuntimeRefresh: runtimeRefresher.read
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
	const cleanups = new KeyedAsyncQueue();
	const cleanupRetries = /* @__PURE__ */ new Map();
	const cleanupRetry = (record) => {
		const retry = cleanupRetries.get(record.environmentId);
		if (retry && (retry.ownerEpoch !== record.ownerEpoch || retry.leaseId !== record.leaseId || ["destroyed", "failed"].includes(record.state))) {
			cleanupRetries.delete(record.environmentId);
			return;
		}
		return retry;
	};
	const parkCleanup = (record, retry) => {
		if (!retry.parked) {
			const nextStep = record.providerId === "crabbox" ? `Run crabbox stop ${record.leaseId ?? "<lease>"} or crabbox leases list, then retry Stop.` : "Check the provider lease, then retry Stop.";
			retry.parked = `Conversation environment cleanup parked (${record.leaseId ?? record.environmentId}) after ${retry.attempts} attempts: ${retry.lastError}. ${nextStep}`;
			options.warn(retry.parked);
		}
	};
	const destroyEnvironment = (environmentId, explicit = false) => cleanups.enqueue(environmentId, async () => {
		await store.ready();
		const record = store.get(environmentId);
		if (!record) {
			cleanupRetries.delete(environmentId);
			return;
		}
		const previous = cleanupRetry(record);
		if (explicit) cleanupRetries.delete(environmentId);
		else if (previous) {
			if (options.now() - previous.startedAtMs >= 36e5) parkCleanup(record, previous);
			if (previous.parked || options.now() < previous.nextAttemptAtMs) return;
		}
		const retry = !explicit && previous || {
			ownerEpoch: record.ownerEpoch,
			leaseId: record.leaseId,
			startedAtMs: options.now(),
			attempts: 0,
			nextAttemptAtMs: 0,
			lastError: ""
		};
		retry.attempts += 1;
		try {
			const stopped = await providerLifecycle.destroy(environmentId, { requireUnattached: true });
			if (stopped.state !== "destroyed" && !(stopped.state === "failed" && stopped.leaseId === null)) throw new Error(`Conversation environment cleanup is not confirmed (${stopped.state}); the existing lease remains owned`);
			cleanupRetries.delete(environmentId);
			return stopped;
		} catch (error) {
			const current = store.get(environmentId);
			retry.ownerEpoch = current.ownerEpoch;
			retry.leaseId = current.leaseId;
			retry.lastError = boundedWorkerError(error);
			retry.nextAttemptAtMs = options.now() + Math.min(3e4 * 2 ** (retry.attempts - 1), 3e5);
			cleanupRetries.set(environmentId, retry);
			if (retry.attempts >= 10 || options.now() - retry.startedAtMs >= 36e5) parkCleanup(current, retry);
			else if (!explicit) options.warn(`Conversation environment cleanup will retry (${environmentId}): ${retry.lastError}`);
			if (explicit) throw error;
			return;
		}
	});
	const currentSession = (identity) => {
		const target = resolveSessionEntryAccessTarget({
			cfg: options.getConfig(),
			agentId: identity.agentId,
			sessionKey: identity.sessionKey
		});
		return target.entry?.sessionId === identity.sessionId && target.entry.incognito !== true && target.entry.lifecycleRevision === identity.sessionLifecycleRevision;
	};
	const project = (record, prepared) => {
		if (!record || record.closedAtMs !== null || closingAttachments.has(record.sessionId) || options.isStopping() || !(prepared ? record.sessionId === prepared.sessionId && record.sessionKey === prepared.sessionKey && record.agentId === prepared.agentId && record.sessionLifecycleRevision === prepared.sessionLifecycleRevision : currentSession(record))) return;
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
	const assertSessionAttachment = (binding, prepared) => {
		const current = project(store.getSessionAttachmentRecord(binding.sessionId), prepared);
		if (!current || current.environmentId !== binding.environmentId || current.ownerEpoch !== binding.ownerEpoch || current.generation !== binding.generation || current.agentId !== binding.agentId || current.sessionKey !== binding.sessionKey || current.sessionLifecycleRevision !== binding.sessionLifecycleRevision) throw new Error("Conversation environment attachment is no longer current");
	};
	const touchSessionAttachment = async (binding, assertCurrent = () => assertSessionAttachment(binding)) => {
		await store.ready();
		assertCurrent();
		await store.touchSessionAttachment(store.getSessionAttachmentRecord(binding.sessionId), assertCurrent);
		assertCurrent();
	};
	const close = async (sessionId, authorize, environmentId, keepCreation, explicit = false) => {
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
			return await destroyEnvironment(closed.environmentId, explicit);
		} finally {
			const remaining = closingAttachments.get(sessionId) - 1;
			if (remaining === 0) closingAttachments.delete(sessionId);
			else closingAttachments.set(sessionId, remaining);
		}
	};
	const attachments = {
		getCleanupError: (record) => cleanupRetry(record)?.parked,
		captureSessionAttachment(identity) {
			const binding = project(store.getSessionAttachmentRecord(identity.sessionId), identity);
			if (!binding) throw new Error("No current environment is attached to this conversation");
			const assertCurrent = () => assertSessionAttachment(binding, identity);
			return {
				binding,
				assertCurrent,
				touch: () => touchSessionAttachment(binding, assertCurrent)
			};
		},
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
				environment: options.environmentAccess.project(environment)
			} : void 0;
		},
		assertSessionAttachment,
		touchSessionAttachment: (binding) => touchSessionAttachment(binding),
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
						const allocationKey = JSON.stringify([
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
							if (reservationCreated) await destroyEnvironment(environmentIntent.environmentId).catch((cleanupError) => options.warn(`Cancelled conversation environment reservation cleanup will retry: ${boundedWorkerError(cleanupError)}`));
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
			return options.trackOperation(close(request.sessionId, authorize, request.environmentId, void 0, true).then((record) => record ? options.environmentAccess.project(record) : void 0));
		},
		async reconcileSessionAttachments() {
			await store.ready();
			for (const environmentId of cleanupRetries.keys()) {
				const record = store.get(environmentId);
				if (record) cleanupRetry(record);
				else cleanupRetries.delete(environmentId);
			}
			for (const record of store.listSessionAttachmentRecords()) {
				if (options.isStopping()) return;
				const environment = store.get(record.environmentId);
				if (!environment || environment.state === "destroyed" || environment.state === "failed") continue;
				const sessionCurrent = currentSession(record);
				if (record.closedAtMs === null && environment.destroyRequestedAtMs === null && sessionCurrent && (options.hasAttachedEnvironmentActivity?.(record.environmentId, environment.ownerEpoch) || listAgentRunsForSession(record).some((run) => hasLiveAgentRunContext(run.runId)))) {
					await store.touchSessionAttachment(record, () => {});
					continue;
				}
				const suspendAfter = options.getConfig().cloudWorkers?.profiles?.[environment.profileId]?.suspendAfter;
				const expired = suspendAfter && options.now() - record.lastUsedAtMs >= parseDurationMs(suspendAfter);
				if (record.closedAtMs !== null || environment.destroyRequestedAtMs !== null || !sessionCurrent || expired) await close(record.sessionId, () => {
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
			if (mutation.previous.sessionId && (mutation.previous.sessionId !== currentSessionId || mutation.kind === "reset")) options.trackOperation(close(mutation.previous.sessionId, () => {})).catch((error) => options.warn(`Conversation environment cleanup will retry during reconciliation: ${boundedWorkerError(error)}`));
		},
		createSessionAttachment: (...args) => options.trackOperation(attachments.createSessionAttachment(...args).then((result) => ({
			...result,
			environment: options.environmentAccess.project(result.environment)
		}))),
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
			const closing = request.command === "computer.act" && Value.Check(NodeWorkerComputerCloseParamsSchema, commandParams);
			const takingControl = request.command === "computer.act" && Value.Check(ComputerTakeControlParamsSchema, commandParams);
			if (!closing && !takingControl && !Value.Check(schema, commandParams)) return {
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
	const sourceFor = (identity) => {
		const claim = placementClaim(identity);
		return claim ? options.placementStore?.getExecutionIdentityCapability?.(claim) : void 0;
	};
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
			liveSeq: "liveSeq" in cursor ? Math.max(currentTurn?.liveSeq ?? 0, cursor.liveSeq) : currentTurn?.liveSeq ?? options.placementStore?.readWorkerTurnLiveAckCursor(binding.turnClaim) ?? 0
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
	const validateAttachedWorkerRequest = (identity, runEpoch, request, preparedPlacement) => {
		if (options.isStopping()) return {
			ok: false,
			closeReason: "environment-unavailable"
		};
		const placement = request.kind === "tool-surface" ? request.surface && getWorkerTurnToolSurface(identity) === request.surface ? "durable" : "invalid" : preparedPlacement ?? validateWorkerPlacement(identity);
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
		const source = sourceFor(identity);
		if (!source) return {
			ok: false,
			closeReason: "placement-mismatch"
		};
		const assertCurrent = (preparedPlacement) => {
			const binding = validateAttachedWorkerRequest(identity, request.runEpoch, {
				kind: "transcript",
				seq: request.seq
			}, preparedPlacement);
			if (!binding.ok) throw new WorkerTranscriptAuthorityError(binding);
			source.receiptAuthority();
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
				sessionTarget: source.sessionTarget,
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
				await options.placementStore?.updateAckCursors({
					claim: placement,
					transcriptSeq: request.seq,
					assertCurrent: () => assertCurrent("durable")
				});
				assertCurrent();
				recordAckCursor(processTurn, { transcriptSeq: request.seq });
			}
			return result;
		} catch (error) {
			if (error instanceof WorkerTranscriptAuthorityError) return error.outcome;
			throw error;
		}
	});
	const executeComputer = createWorkerComputerRpc({
		execute: options.executeComputer,
		validate: (identity) => {
			const requestAdmission = validateAttachedWorkerRequest(identity, identity.ownerEpoch, { kind: "session-tool" });
			if (!requestAdmission.ok) return "closeReason" in requestAdmission ? requestAdmission : {
				ok: false,
				closeReason: "placement-mismatch"
			};
			const binding = placementClaim(identity);
			if (!binding || !options.placementStore?.isWorkerTurnToolAuthorized(binding, "computer")) return {
				ok: false,
				closeReason: "method-not-allowed"
			};
			return { ok: true };
		}
	});
	const withToolSurface = async (identity, run) => {
		const runtime = getWorkerTurnToolSurface(identity);
		const validate = () => validateAttachedWorkerRequest(identity, identity.ownerEpoch, {
			kind: "tool-surface",
			surface: runtime
		});
		const admitted = validate();
		if (!admitted.ok) return "closeReason" in admitted ? admitted : {
			ok: false,
			closeReason: "placement-mismatch"
		};
		if (!runtime) return {
			ok: false,
			closeReason: "method-not-allowed"
		};
		const result = await run(runtime);
		const current = validate();
		return current.ok ? {
			ok: true,
			result
		} : "closeReason" in current ? current : {
			ok: false,
			closeReason: "placement-mismatch"
		};
	};
	const getToolSurface = (identity) => withToolSurface(identity, (runtime) => runtime.getSurface(identity));
	const invokeGatewayTool = (identity, request, sink, signal) => withToolSurface(identity, (runtime) => runtime.invoke(identity, request, sink, signal).catch(workerSessionToolErrorResult));
	const cancelGatewayTool = (identity, request) => withToolSurface(identity, (runtime) => runtime.cancel(request));
	const validateLiveEvent = (identity, request, preparedPlacement) => {
		const binding = validateAttachedWorkerRequest(identity, request.runEpoch, {
			kind: "live",
			seq: request.seq
		}, preparedPlacement);
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
			const source = sourceFor(identity);
			if (!source) return {
				ok: false,
				closeReason: "placement-mismatch"
			};
			const placement = placementClaim(identity);
			const processTurn = processTurnBinding(identity);
			const placementStore = options.placementStore;
			if (!placement || !processTurn || !placementStore) return {
				ok: false,
				closeReason: "placement-mismatch"
			};
			let durableAckedSeq;
			const readAckedSeq = () => durableAckedSeq ??= placementStore.readWorkerTurnLiveAckCursor(placement);
			const observed = observedAckCursorFor(processTurn);
			const wasNewSequence = request.seq > (observed?.liveSeq ?? readAckedSeq());
			const runOwner = captureWorkerTurnLiveEventOwner(identity);
			const result = await options.liveEvents.apply({
				identity,
				request,
				source,
				readAckedSeq
			});
			const stale = validateLiveEvent(identity, request);
			if (stale) return stale;
			if (!result.ok) {
				if (result.details.reason === "resync-required") {
					observedAckCursors.set(placement.sessionId, {
						...processTurn,
						transcriptSeq: observed?.transcriptSeq ?? 0,
						liveSeq: result.details.ackedSeq
					});
					pendingTerminalTurnFences.delete(placement.sessionId);
				}
				return result;
			}
			recordAckCursor(processTurn, { liveSeq: result.result.ackedSeq });
			const pending = pendingTerminalTurnFences.get(placement.sessionId);
			if (pending && !matchesTurnBinding(pending, processTurn)) pendingTerminalTurnFences.delete(placement.sessionId);
			if (isTerminalLiveEvent(request) && wasNewSequence) pendingTerminalTurnFences.set(placement.sessionId, {
				...processTurn,
				terminalLiveSeq: request.seq
			});
			const terminal = pendingTerminalTurnFences.get(placement.sessionId);
			if (terminal && matchesTurnBinding(terminal, processTurn) && result.result.ackedSeq >= terminal.terminalLiveSeq) {
				await placementStore.updateAckCursors({
					claim: placement,
					liveSeq: result.result.ackedSeq,
					assertCurrent: () => {
						if (validateLiveEvent(identity, request, "durable")) throw new Error("Worker live event authority closed during ACK");
						if (!runOwner?.isCancelledFinishing(request)) source.receiptAuthority();
					}
				});
				const staleAfterAck = validateLiveEvent(identity, request);
				if (staleAfterAck) return staleAfterAck;
				if (!runOwner?.isCancelledFinishing(request)) source.receiptAuthority();
				acknowledgeWorkerTurnFinishing(identity, result.result.ackedSeq, () => validateLiveEvent(identity, request) === void 0);
				terminalTurnFences.set(placement.sessionId, observedAckCursorFor(processTurn) ?? recordAckCursor(processTurn, { liveSeq: result.result.ackedSeq }));
				pendingTerminalTurnFences.delete(placement.sessionId);
			}
			return result;
		});
	};
	const validateInference = (identity, request) => {
		if (request.sessionId !== identity.sessionId || request.runId !== identity.runId) return {
			ok: false,
			reason: "session-not-attached"
		};
		return validateAttachedWorkerRequest(identity, request.runEpoch, { kind: "inference" });
	};
	const revalidateInference = (identity, request) => {
		const binding = validateInference(identity, request);
		return binding.ok ? null : "reason" in binding ? binding.reason : "session-not-attached";
	};
	const startInference = async (identity, request, sink) => {
		const binding = validateInference(identity, request);
		if (!binding.ok) return binding;
		const source = sourceFor(identity);
		if (!source) return {
			ok: false,
			reason: "session-not-attached"
		};
		if (request.context.tools?.length) {
			const runtime = getWorkerTurnToolSurface(identity);
			if (!runtime) return {
				ok: false,
				reason: "invalid-context"
			};
			const tools = await runtime.getModelTools(identity);
			source.receiptAuthority();
			if (JSON.stringify(request.context.tools) !== JSON.stringify(tools)) return {
				ok: false,
				reason: "invalid-context"
			};
		}
		return inference.start({
			identity,
			request,
			sink,
			sessionTarget: source.sessionTarget,
			assertSourceCurrent: source.receiptAuthority,
			revalidate: () => revalidateInference(identity, request)
		});
	};
	const cancelInference = async (identity, request) => {
		const binding = validateInference(identity, request);
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
		validateWorkerConnection: (identity, request) => {
			if (options.isStopping()) return "environment-unavailable";
			const placement = request?.toolSurface ? getWorkerTurnToolSurface(identity) ? "durable" : "invalid" : validateWorkerPlacement(identity);
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
		getToolSurface,
		invokeGatewayTool,
		cancelGatewayTool,
		executeComputer,
		startInference,
		cancelInference,
		clear: () => {
			observedAckCursors.clear();
			pendingTerminalTurnFences.clear();
			terminalTurnFences.clear();
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/service.ts
function createWorkerEnvironmentService(options) {
	const { store, scheduler } = options;
	const scope = scheduler.scope();
	const warn = (message) => options.logger?.warn(message);
	const operations = new KeyedAsyncQueue();
	const providerOperations = new KeyedAsyncQueue();
	const activeOperations = /* @__PURE__ */ new Set();
	const inferenceCancellations = /* @__PURE__ */ new Set();
	const retainInferenceCancellation = (operation) => {
		inferenceCancellations.add(operation);
		operation.then(() => inferenceCancellations.delete(operation), () => warn("Worker inference cancellation persistence failed; shutdown will report the failure"));
	};
	const now = options.now ?? Date.now;
	const tunnelLifecycle = createWorkerEnvironmentTransportLifecycle(options);
	const inference = createWorkerInferenceManager({
		execute: options.executeInference,
		getConfig: options.getConfig,
		...options.inferenceStore ? { store: options.inferenceStore } : {}
	});
	let reconcileInFlight;
	let serviceStarted = false;
	let unsubscribeSessionIdentityMutation;
	let unsubscribeTurnClaimClosed = options.placementStore?.registerTurnClaimClosedHandler((claim) => {
		retainInferenceCancellation(inference.cancelClaim(claim));
	});
	let reconcileEnvironmentGuard;
	let reconcileEnvironmentGuardClosing = false;
	const guardedReconcileInFlight = /* @__PURE__ */ new Map();
	let stopping = false;
	let maintenanceInFlight;
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
		const { promise: started, resolve: signalStarted } = createDeferredCore();
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
			const cancellation = inference.cancelEnvironment(record.environmentId);
			options.liveEvents?.clearEnvironment(record.environmentId, record.ownerEpoch);
			await cancellation;
		}
		return next;
	};
	const saveError = createWorkerEnvironmentErrorRecorder(store);
	const credentialBroker = createWorkerCredentialBroker({
		...options,
		store,
		prepareInstallation,
		tunnelManager: tunnelLifecycle,
		now,
		isStopping: () => stopping,
		cancelInferenceEnvironment: (environmentId) => inference.cancelEnvironment(environmentId),
		move,
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
		isStopping: () => stopping,
		move,
		saveError,
		withLock
	});
	const environmentAccess = createWorkerEnvironmentAccess({
		...options,
		store,
		getCleanupError: (record) => sessionAttachments.getCleanupError(record),
		prepareCurrentBundle: async () => await prepareInstallation("bundle"),
		now,
		identityResolverFor: providerLifecycle.identityResolverFor,
		isStopping: () => stopping,
		providerFor: providerLifecycle.providerFor,
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
		signal: scope.signal,
		warn,
		resolveHumanPresenceDemand: options.resolveHumanPresenceDemand,
		presenceDemandStore: options.presenceDemandStore
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
			if (!current || [
				"destroyed",
				"failed",
				"orphaned"
			].includes(current.state)) return;
			if (current.destroyRequestedAtMs !== null && await store.hasSessionAttachment(environmentId)) return;
			await providerLifecycle.reconcileRecord(current, signal, retainProviderSettlement);
		});
	};
	const reconcileEnvironment = async (environmentId) => {
		if (stopping) return;
		const guard = reconcileEnvironmentGuard;
		if (!guard) return await reconcileEnvironmentCore(environmentId);
		if (reconcileEnvironmentGuardClosing) return;
		const active = guardedReconcileInFlight.get(environmentId);
		if (active) return await active;
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
			scope.signal.throwIfAborted();
			return options.maintainProviders(scope.signal);
		}).catch(() => {
			if (!scope.signal.aborted) warn("Worker provider maintenance sweep failed; cleanup will retry");
		}).finally(() => {
			maintenanceInFlight = void 0;
		}));
		return reconcileInFlight ??= reconcilePass().finally(() => {
			reconcileInFlight = void 0;
		});
	};
	const start = () => {
		if (serviceStarted || stopping) return;
		unsubscribeSessionIdentityMutation = onSessionIdentityMutation((mutation) => {
			const currentSessionId = "current" in mutation ? mutation.current.sessionId : void 0;
			if (mutation.previous.sessionId && mutation.previous.sessionId !== currentSessionId) retainInferenceCancellation(inference.cancelSession(mutation.previous.sessionId));
			sessionAttachments.retireSessionIdentityMutation(mutation);
		});
		for (const profileId of new Set(store.listForReconcile().map((record) => record.profileId))) providerLifecycle.warmMachineShape(profileId);
		const everyMs = options.reconcileIntervalMs ?? 6e4;
		scope.schedule({
			id: "worker-environments:reconcile",
			atMs: scope.now() + everyMs,
			everyMs,
			run: () => {
				runOutsideAsyncWorkScope(() => {
					reconcileOnce().catch(() => warn("Worker environment reconcile sweep failed"));
				});
			}
		});
		serviceStarted = true;
		reconcileOnce().catch(() => warn("Worker environment startup reconcile failed"));
	};
	const stop = async () => {
		const failures = [];
		stopping = true;
		providerLifecycle.clearDedicatedNodeLeases();
		sessionAttachments.cancelSessionAttachmentCreations();
		providerLifecycle.clearMachineShapeListeners();
		scope.beginClose();
		options.stopNodeEnrollmentWaits?.();
		unsubscribeSessionIdentityMutation?.();
		unsubscribeSessionIdentityMutation = void 0;
		unsubscribeTurnClaimClosed?.();
		unsubscribeTurnClaimClosed = void 0;
		await scope.stop();
		await closeReconcileEnvironmentGuard();
		await options.closeComputers?.().catch(() => warn("Session computer cleanup failed during Gateway shutdown"));
		try {
			await inference.stop();
		} catch (error) {
			failures.push(error);
		}
		credentialBroker.clear();
		options.liveEvents?.clear();
		await options.stopNodeWorkerBundleTransfers?.();
		try {
			await joinWorkerTunnelStops([environmentAccess.stopAllTunnels(), options.nodePortalCarrier?.stopAll()]);
		} catch (error) {
			if (error instanceof WorkerTunnelOwnerDisconnectedError) warn(`Worker environment stop deferred during Gateway shutdown: ${error.message}`);
			else failures.push(error);
		} finally {
			const reconciliation = reconcileInFlight;
			if (reconciliation) await Promise.allSettled([reconciliation]);
			while (activeOperations.size > 0) await Promise.allSettled(activeOperations);
			const cancellations = await Promise.allSettled(inferenceCancellations);
			for (const outcome of cancellations) if (outcome.status === "rejected" && !failures.includes(outcome.reason)) failures.push(outcome.reason);
			inferenceCancellations.clear();
			credentialBroker.clear();
			turnRpc.clear();
			options.liveEvents?.clear();
			try {
				await options.closeNodeBootstrapArtifacts?.();
			} catch (error) {
				failures.push(error);
			}
		}
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, "Worker environment shutdown failed");
	};
	const providerSupportsExecutionMode = (providerId, mode) => options.resolveProvider(providerId)?.supportedExecutionModes?.includes(mode) === true;
	const requireProviderExecutionMode = (providerId, mode) => {
		if (!mode) return;
		const provider = options.resolveProvider(providerId);
		if (!provider) throw workerEnvironmentServiceError("provider_not_found", `Unknown worker provider: ${providerId}`);
		if (!provider.supportedExecutionModes?.includes(mode)) throw workerEnvironmentServiceError("invalid_profile", `Worker provider ${providerId} does not support ${mode} placement`);
	};
	const configuredProfileProviderId = (profileId) => {
		const profiles = options.getConfig().cloudWorkers?.profiles;
		const profile = profiles && Object.hasOwn(profiles, profileId) ? profiles[profileId] : void 0;
		if (!profile) throw workerEnvironmentServiceError("profile_not_found", `Unknown worker profile: ${profileId}`);
		return profile.provider;
	};
	const prepareBuild = createWorkerEnvironmentBuildPreparation({
		store,
		getConfig: options.getConfig,
		resolveProvider: options.resolveProvider,
		projectNamespace: options.projectNamespace,
		providerLifecycle,
		signal: scope.signal,
		now,
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
		readPreparedPoolSummary: preparedPool.summary,
		readReadyWorkerTarget: preparedPool.target,
		readRuntimeRefresh: providerLifecycle.readRuntimeRefresh,
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
		getDedicatedNodeLeaseSignal: providerLifecycle.getDedicatedNodeLeaseSignal,
		prepareProjectIntent: (...args) => {
			providerLifecycle.warmMachineShape(args[0]);
			return providerLifecycle.prepareIntent(...args);
		},
		assertPreparedIntentCurrent: providerLifecycle.assertPreparedIntentCurrent,
		getPreparedCandidates: (intent) => preparedPool.candidates(intent).map(environmentAccess.project),
		schedulePreparedRefill,
		setHumanPresence: preparedPool.setHumanPresence,
		inventoryVersion: store.inventoryVersion,
		machineShapeVersion: providerLifecycle.machineShapeVersion,
		subscribeMachineShapeChanged: providerLifecycle.subscribeMachineShapeChanged,
		readMachineShape: (environmentId, prepared) => providerLifecycle.readMachineShape(prepared ?? store.get(environmentId)),
		supportsNodePortal: async (environmentId, ownerEpoch) => await options.nodePortalCarrier?.supports(environmentId, ownerEpoch) === true,
		hasPendingNodeEnrollmentSetup: store.hasPendingNodeEnrollmentSetup.bind(store),
		admitsNodeSetupCompletion: options.admitsNodeSetupCompletion,
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
		destroy: async (environmentId, abandonment, forceAbandon) => environmentAccess.project(await providerLifecycle.destroy(environmentId, {
			abandonment,
			forceAbandon
		})),
		requestDestroy: async (environmentId) => environmentAccess.project(await providerLifecycle.destroy(environmentId, { retryRequested: false })),
		destroyUnattached: async (environmentId) => {
			await preparedPool.cancelPreparation(environmentId);
			return environmentAccess.project(await providerLifecycle.destroy(environmentId, { requireUnattached: true }));
		},
		observeDesktop: environmentAccess.observeDesktop,
		launchDesktopApp: environmentAccess.launchDesktopApp,
		reconcileDesktopPolicy: environmentAccess.reconcileDesktopPolicy,
		admitWorker: turnRpc.admitWorker,
		fenceWorkerTurnForRecovery: (claim) => {
			if (!options.placementStore) throw workerEnvironmentServiceError("invalid_state", "Worker recovery requires its placement gate");
			options.placementStore.fenceWorkerTurnForRecovery(claim);
		},
		validateWorkerConnection: turnRpc.validateWorkerConnection,
		commitTranscript: turnRpc.commitTranscript,
		pushLiveEvent: turnRpc.pushLiveEvent,
		getToolSurface: turnRpc.getToolSurface,
		invokeGatewayTool: turnRpc.invokeGatewayTool,
		cancelGatewayTool: turnRpc.cancelGatewayTool,
		createGatewayTools: options.createGatewayTools,
		executeComputer: turnRpc.executeComputer,
		prepareComputer: options.prepareComputer,
		startInference: turnRpc.startInference,
		cancelInference: turnRpc.cancelInference,
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
		ready: async () => await joinInferenceOperations([store.ready(), inference.ready()], [], "Worker environment readiness failed"),
		start,
		stop
	};
	registerWorkerInferenceSessionControl(service, inference);
	return service;
}
//#endregion
export { createWorkerEnvironmentService };
