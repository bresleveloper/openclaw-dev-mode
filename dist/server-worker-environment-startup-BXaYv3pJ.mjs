import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CPodxfi3.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { s as resolveRuntimeServiceBuildId } from "./version-jg_14gWz.mjs";
import { t as sha256Base64Url } from "./crypto-digest-y6oZN-_F.mjs";
import { a as isSqliteLockError } from "./sqlite-error-diagnostics-BBfTUJBR.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { _ as resolveDefaultAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot, o as getActiveSecretsRuntimeEnvState } from "./runtime-state-DDDhACod.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { d as isLinkLocalIpAddress, g as isUnspecifiedIpAddress } from "./ip-Df-yvQzE.mjs";
import { s as isLoopbackHost } from "./net-CjQwRK-V.mjs";
import { n as emitSessionLifecycleEvent } from "./session-lifecycle-events-76OxWRqj.mjs";
import "./config-B3oiWDlr.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { r as resolveDefaultWorkerPlacementExecutionMode } from "./placement-session-runtime-CaRixRbi.mjs";
import { n as resolveGitHubHost } from "./github-host-runtime-D306-ub0.mjs";
import { r as WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { f as markDiagnosticRunProgress } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { n as CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE } from "./device-bootstrap-profile-DQKf7Vz1.mjs";
import { a as workerBootstrapOperationTimeoutMs, r as NODE_ENROLLMENT_TIMEOUT_MS } from "./bootstrap-timeouts-CDaMuZ4A.mjs";
import { i as loadOrCreateProcessDeviceIdentityAsync } from "./device-identity-async-BBs_AIYT.mjs";
import { l as removePairedDeviceRole, t as getPairedDevice } from "./device-pairing-_Xo0MHGf.mjs";
import { c as workerBundleArchiveRelativePath } from "./worker-bundle-hash-BynEVGqT.mjs";
import { t as DEVICE_WORKER_PROVIDER_ID } from "./device-provider-identity-v6nXqNq_.mjs";
import { f as revokeDeviceBootstrapToken, i as ensureDevicePairSetupBootstrapToken } from "./device-bootstrap-FJ4oQdcl.mjs";
import { a as resolvePairingGatewayUrl, i as resolveConfiguredPairingPublicUrl, o as resolvePairingSetupFromConfig, r as encodePairingSetupCode } from "./setup-code-CNtEQo_X.mjs";
import { n as createWorkerPlacementRuntimeInstallReader } from "./placement-projector-DKN6sMLO.mjs";
import { n as bindDeviceWorkerReconciliation, r as createDeviceWorkerRuntime, t as bindDeviceWorkerAvailability } from "./device-provider-3Bp59FhL.mjs";
import { t as configuredDefaultRepository } from "./configured-default-repository-CVheulgz.mjs";
import { t as DEFAULT_NODE_TOOLCHAIN_SETUP_SH } from "./node-toolchain-QwDDqGsb.mjs";
import { t as nodeWorkerGatewayNamespace } from "./node-worker-gateway-namespace-kRiA3LFq.mjs";
import { t as listRetainedWorkerBundleHashes } from "./worker-bundle-retention-gD9d5rT1.mjs";
import os from "node:os";
import { AsyncLocalStorage } from "node:async_hooks";
import { setTimeout } from "node:timers/promises";
//#region src/gateway/server-worker-runtime-install-progress.ts
function createWorkerRuntimeInstallProgressPublisher(params) {
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const pendingNodes = /* @__PURE__ */ new Set();
	const pendingEnvironments = /* @__PURE__ */ new Set();
	let publication;
	let stopped = false;
	const publishPending = () => {
		if (publication || stopped) return;
		publication = Promise.resolve().then(async () => {
			while (pendingNodes.size > 0) {
				if (stopped) return;
				const nodeIds = new Set(pendingNodes);
				const notifiedEnvironments = new Set(pendingEnvironments);
				pendingNodes.clear();
				pendingEnvironments.clear();
				try {
					const sessionIds = uniqueStrings(params.environments.listForReconcile().flatMap((environment) => environment.nodeDeviceId && nodeIds.has(environment.nodeDeviceId) || notifiedEnvironments.has(environment.environmentId) ? environment.attachedSessionIds : []));
					if (sessionIds.length === 0) continue;
					const { placements } = await inOwnerContext(() => params.placements.readProjection(sessionIds, { current: true }));
					if (stopped) return;
					const observations = [...nodeIds].map((nodeId) => params.readInstall(nodeId));
					for (const placement of placements.values()) {
						const environment = placement.environmentId ? params.environments.get(placement.environmentId) : void 0;
						if (!environment || environment.state === "destroyed" || environment.state === "failed" || environment.state === "orphaned" || !environment.attachedSessionIds.includes(placement.sessionId)) continue;
						if (!(environment.nodeDeviceId && nodeIds.has(environment.nodeDeviceId)) && !notifiedEnvironments.has(environment.environmentId)) continue;
						if (placement.state === "provisioning" && observations.some((observation) => observation?.environmentIds.includes(environment.environmentId))) markDiagnosticRunProgress({
							sessionId: placement.sessionId,
							sessionKey: placement.sessionKey,
							reason: "worker:runtime_install",
							onlyIfActive: true
						});
						emitSessionLifecycleEvent({
							sessionKey: placement.sessionKey,
							agentId: placement.agentId,
							reason: "worker-runtime-install",
							scope: "runtime"
						});
					}
				} catch (error) {
					params.warn(`Worker runtime install progress publication failed: ${String(error)}`);
				}
			}
		}).finally(() => {
			publication = void 0;
			if (pendingNodes.size > 0) publishPending();
		});
	};
	return {
		changed: (nodeId, environmentIds) => {
			if (!stopped) {
				pendingNodes.add(nodeId);
				for (const environmentId of environmentIds) pendingEnvironments.add(environmentId);
				publishPending();
			}
		},
		stop: async () => {
			stopped = true;
			pendingNodes.clear();
			pendingEnvironments.clear();
			await publication;
		}
	};
}
//#endregion
//#region src/gateway/server-worker-startup-recovery.ts
const WORKER_STARTUP_RECOVERY_ATTEMPTS = 5;
/** Retry settled database recovery operations, never filesystem reconciliation or all sidecars. */
async function retryGatewayWorkerStartupRecovery(params) {
	for (let attempt = 1;; attempt += 1) try {
		return await params.run();
	} catch (error) {
		if (!isSqliteLockError(error)) throw error;
		if (attempt === WORKER_STARTUP_RECOVERY_ATTEMPTS) throw new Error(`${params.operation} failed after ${attempt} attempts: the database is locked by another process or connection. Run openclaw doctor or openclaw gateway status --deep to diagnose the lock.`, { cause: error });
		const waitMs = Math.min(1e3 * 2 ** (attempt - 1), 5e3);
		params.warn(`${params.operation}: database is locked; retrying attempt ${attempt + 1}/${WORKER_STARTUP_RECOVERY_ATTEMPTS} in ${waitMs} ms.`);
		await setTimeout(waitMs);
	}
}
//#endregion
//#region src/gateway/worker-environments/node-enrollment.ts
const NODE_ENROLLMENT_POLL_MS = 250;
const log = createSubsystemLogger("gateway/worker-environments");
function isProvisioningOwner(current, owner) {
	return current?.state === "provisioning" && current.destroyRequestedAtMs === null && current.provisionOperationId === owner.provisionOperationId && current.ownerEpoch === owner.ownerEpoch;
}
function createWorkerNodeEnrollmentManager(options) {
	const now = options.now ?? Date.now;
	const controller = new AbortController();
	const { signal } = controller;
	const active = /* @__PURE__ */ new Map();
	const enrollmentClosers = /* @__PURE__ */ new WeakMap();
	const commandRunner = async (argv, runOptions) => await runCommandWithTimeout(argv, { timeoutMs: runOptions.timeoutMs });
	const prepare = async (record, enrollmentSignal) => {
		const preparationSignal = enrollmentSignal ?? signal;
		preparationSignal.throwIfAborted();
		const config = options.getConfig();
		const url = await resolvePairingGatewayUrl(config, {
			env: process.env,
			useLocalGateway: config.gateway?.mode === "remote",
			publicUrl: resolveConfiguredPairingPublicUrl(config),
			publicOriginPreference: "prefer",
			networkInterfaces: os.networkInterfaces,
			runCommandWithTimeout: commandRunner
		});
		if (!url.url) throw new Error(url.error ?? "Cloud node bootstrap cannot resolve the Gateway address");
		const host = new URL(url.url).hostname;
		if (isLoopbackHost(host) || isLinkLocalIpAddress(host) || isUnspecifiedIpAddress(host)) throw new Error(`Cloud node bootstrap resolved a Gateway address that a cloud worker cannot reach (${url.url}, from ${url.source ?? "unknown"}). Set gateway.publicOrigin (or plugins.entries.device-pair.config.publicUrl) to a URL reachable from the worker, such as a Tailscale Funnel or a reverse-proxied public origin with gateway.trustedProxies, then redispatch.`);
		preparationSignal.throwIfAborted();
		const artifact = await options.prepareArtifact(record, preparationSignal);
		preparationSignal.throwIfAborted();
		const tlsFingerprint = url.url.startsWith("wss://") ? url.source?.startsWith("gateway.bind=") ? options.getLocalTlsFingerprint?.() : url.source === "gateway.remote.url" ? config.gateway?.remote?.tlsFingerprint : void 0 : void 0;
		return {
			artifact,
			url: url.url,
			tlsFingerprint
		};
	};
	const reserve = (record, operationSignal) => {
		signal.throwIfAborted();
		operationSignal?.throwIfAborted();
		if (!isProvisioningOwner(options.store.get(record.environmentId), record)) throw new Error("Worker node enrollment is no longer provisioning");
		active.get(record.environmentId)?.close();
		const enrollmentAbort = new AbortController();
		const enrollmentSignal = AbortSignal.any([
			signal,
			enrollmentAbort.signal,
			...operationSignal ? [operationSignal] : []
		]);
		const binding = {
			record,
			signal: enrollmentSignal,
			close: () => {
				if (active.get(record.environmentId) === binding) active.delete(record.environmentId);
				enrollmentAbort.abort();
				const credential = binding.setupCredential;
				binding.setupCredential = void 0;
				if (!credential || signal.aborted) return;
				revokeDeviceBootstrapToken({ token: credential.token }).catch((error) => {
					log.warn(`Cloud node enrollment credential revocation failed: ${String(error)}`);
				});
			}
		};
		active.set(record.environmentId, binding);
		const current = () => {
			enrollmentSignal.throwIfAborted();
			const live = options.store.get(record.environmentId);
			if (active.get(record.environmentId) !== binding || !isProvisioningOwner(live, record)) throw new Error("Worker node enrollment is no longer provisioning");
			return live;
		};
		return {
			binding,
			enrollmentSignal,
			current
		};
	};
	const grantArtifact = (prepared, artifact, enrollmentSignal, isAuthorized, transferBytes = artifact.tarballBytes) => {
		const capability = options.transfer.prepare({
			artifact,
			transferBytes,
			isAuthorized,
			signal: enrollmentSignal
		});
		const url = new URL(prepared.url);
		url.protocol = url.protocol === "wss:" ? "https:" : "http:";
		url.pathname = `${WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH}/artifacts/${artifact.tarballSha256}`;
		url.search = "";
		url.hash = "";
		return {
			url: url.toString(),
			token: capability.token,
			sha256: artifact.tarballSha256,
			bytes: artifact.tarballBytes,
			...prepared.tlsFingerprint ? { tlsFingerprint: prepared.tlsFingerprint } : {}
		};
	};
	const grantRuntime = (prepared, enrollmentSignal, isAuthorized, transferBytes = prepared.artifact.tarballBytes) => ({
		bootstrapTimeoutMs: workerBootstrapOperationTimeoutMs({ tarballBytes: transferBytes }),
		nodeBootstrap: {
			...grantArtifact(prepared, prepared.artifact, enrollmentSignal, isAuthorized, transferBytes),
			openclawVersion: prepared.artifact.openclawVersion,
			enabledPluginIds: prepared.artifact.enabledPluginIds,
			linuxToolchainSetup: DEFAULT_NODE_TOOLCHAIN_SETUP_SH
		},
		signal: enrollmentSignal
	});
	const prepareRuntime = async (record, bundle, operationSignal) => {
		await options.store.ready();
		const { binding, enrollmentSignal, current } = reserve(record, operationSignal);
		try {
			const prepared = await prepare(record, enrollmentSignal);
			const owner = current();
			const isAuthorized = () => {
				const live = current();
				return live.nodeSetupId === owner.nodeSetupId && live.nodeDeviceId === owner.nodeDeviceId;
			};
			const transferBytes = prepared.artifact.tarballBytes + bundle.tarballBytes;
			const runtime = {
				...grantRuntime(prepared, enrollmentSignal, isAuthorized, transferBytes),
				workerBundle: {
					...grantArtifact(prepared, bundle, enrollmentSignal, isAuthorized, transferBytes),
					packageRelativePath: workerBundleArchiveRelativePath(bundle.tarballSha256)
				}
			};
			enrollmentClosers.set(runtime, binding.close);
			return runtime;
		} catch (error) {
			binding.close();
			throw error;
		}
	};
	const begin = async (record, operationSignal) => {
		await options.store.ready();
		const { binding, enrollmentSignal, current: requireCurrent } = reserve(record, operationSignal);
		try {
			const prepared = await prepare(record, enrollmentSignal);
			requireCurrent();
			await options.store.ensureNodeEnrollment(record.environmentId);
			let current = requireCurrent();
			let mode;
			let gatewayUrl = prepared.url;
			let tlsFingerprint = prepared.tlsFingerprint;
			if (current.nodeDeviceId) mode = {
				mode: "resume",
				deviceId: current.nodeDeviceId
			};
			else {
				if (!current.nodeSetupId) throw new Error("Worker node enrollment setup identity was not persisted");
				const issued = await ensureDevicePairSetupBootstrapToken({
					setupId: current.nodeSetupId,
					profile: CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE
				});
				requireCurrent();
				if (issued.status === "pending") binding.setupCredential = {
					setupId: issued.setupId,
					token: issued.token,
					digest: sha256Base64Url(issued.token)
				};
				if (issued.status === "completed") {
					await options.store.ensureNodeEnrollment(record.environmentId);
					current = requireCurrent();
					if (!current.nodeDeviceId || current.nodeDeviceId !== issued.deviceId) throw new Error("Worker node enrollment completion did not bind its environment");
					mode = {
						mode: "resume",
						deviceId: current.nodeDeviceId
					};
				} else {
					const config = options.getConfig();
					const resolved = await resolvePairingSetupFromConfig(config, {
						env: process.env,
						useLocalGateway: config.gateway?.mode === "remote",
						publicUrl: resolveConfiguredPairingPublicUrl(config),
						publicOriginPreference: "prefer",
						bootstrapProfile: CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE,
						issuedBootstrap: issued,
						localTlsFingerprint: options.getLocalTlsFingerprint?.(),
						runCommandWithTimeout: commandRunner
					});
					requireCurrent();
					if (!resolved.ok) throw new Error(resolved.error);
					if (resolved.setupId !== current.nodeSetupId) throw new Error("Worker node enrollment setup identity changed during preparation");
					gatewayUrl = resolved.payload.url;
					tlsFingerprint = resolved.payload.tlsFingerprint;
					mode = {
						mode: "connect",
						setupCode: encodePairingSetupCode(resolved.payload),
						setupId: current.nodeSetupId
					};
				}
			}
			const owner = current;
			const isAuthorized = () => {
				const live = options.store.get(owner.environmentId);
				return active.get(owner.environmentId) === binding && !enrollmentSignal.aborted && isProvisioningOwner(live, record) && live.nodeSetupId === owner.nodeSetupId && live.nodeDeviceId === owner.nodeDeviceId;
			};
			const enrollment = {
				...mode,
				...grantRuntime({
					...prepared,
					url: gatewayUrl,
					tlsFingerprint
				}, enrollmentSignal, isAuthorized),
				openclawVersion: prepared.artifact.openclawVersion,
				displayName: truncateUtf16Safe(`Cloud worker ${owner.profileId}`, 64),
				signal: enrollmentSignal,
				waitForDeviceId: async () => {
					const deadline = now() + NODE_ENROLLMENT_TIMEOUT_MS;
					while (now() < deadline) {
						enrollmentSignal.throwIfAborted();
						const live = options.store.get(owner.environmentId);
						if (!isProvisioningOwner(live, owner) || live.nodeSetupId !== owner.nodeSetupId || active.get(owner.environmentId) !== binding) throw new Error("Worker node enrollment is no longer current");
						if (live.nodeDeviceId) {
							const availability = await options.resolveAvailability(live.nodeDeviceId);
							enrollmentSignal.throwIfAborted();
							if (availability.available) return live.nodeDeviceId;
						}
						await setTimeout(NODE_ENROLLMENT_POLL_MS, void 0, { signal: enrollmentSignal });
					}
					throw new Error("Worker node did not connect before the enrollment deadline");
				}
			};
			enrollmentClosers.set(enrollment, binding.close);
			return enrollment;
		} catch (error) {
			binding.close();
			throw error;
		}
	};
	const retire = async (record) => {
		active.get(record.environmentId)?.close();
		const deviceId = record.nodeDeviceId;
		if (!deviceId) return;
		const sharedOwner = options.store.listForReconcile().find((candidate) => candidate.environmentId !== record.environmentId && candidate.nodeDeviceId === deviceId);
		if (sharedOwner) throw new Error(`Worker node ${deviceId} is still owned by environment ${sharedOwner.environmentId}`);
		await removePairedDeviceRole({
			deviceId,
			role: "node"
		});
	};
	return {
		prepare: async (record, operationSignal) => {
			return (await prepare(record, operationSignal ? AbortSignal.any([signal, operationSignal]) : signal)).artifact.tarballSha256;
		},
		prepareRuntime,
		begin,
		admitsNodeSetupCompletion: (setup) => {
			const binding = active.get(setup.environmentId);
			if (!binding?.setupCredential) return false;
			return binding.setupCredential.setupId === setup.setupId && binding.setupCredential.digest === setup.credentialDigest && binding.record.provisionOperationId === setup.provisionOperationId && binding.record.ownerEpoch === setup.ownerEpoch && !binding.signal.aborted;
		},
		retire,
		closeRuntime: (preparation) => enrollmentClosers.get(preparation)?.(),
		close: (enrollment) => enrollmentClosers.get(enrollment)?.(),
		stop: () => {
			controller.abort();
			for (const binding of active.values()) binding.close();
			options.transfer.closeAll();
		}
	};
}
//#endregion
//#region src/gateway/worker-environments/prepared-pool-presence-worker.ts
async function readPreparedPoolPresenceDemand() {
	const reply = await executeExistingOpenClawStateRead({}, { type: "preparedPoolPresence.read" });
	if (!reply) return;
	if (!reply.ok || reply.type !== "preparedPoolPresence.read") throw new Error("Unexpected prepared-pool presence demand read result");
	return reply.demand;
}
function writePreparedPoolPresenceDemand(value, assertCurrent) {
	const host = value ? resolveGitHubHost() : void 0;
	const assertSelected = () => {
		assertCurrent();
		if (value && (resolveGitHubHost() !== host || new URL(value.project.source.url).hostname !== host)) throw new Error("Prepared-pool presence demand is invalid");
	};
	const context = captureOpenClawStateWorkerContext();
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "preparedPoolPresence.write",
		input: value
	}), {
		assertCurrent: assertSelected,
		createAdmission: () => ({
			nativeLocations: [context.admission.databasePath],
			admission: createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Prepared-pool presence demand requires transaction admission");
				context.admission.assertCurrent();
				assertSelected();
				grant();
			})
		})
	});
}
//#endregion
//#region src/gateway/server-worker-environment-startup.ts
const loadWorkerEnvironmentRuntimeModule = createLazyRuntimeModule(() => import("./gateway/worker-environments/runtime.js"));
const loadWorkerSessionToolExecutorModule = createLazyRuntimeModule(() => import("./worker-session-tool-executor-BlsszIjp.mjs"));
async function loadGatewayWorkerEnvironmentStartupState() {
	const [{ createWorkerEnvironmentStore }, { createWorkerSessionPlacementStore }] = await Promise.all([import("./store-xwd_jBiw.mjs"), import("./placement-store-I_D41JNc.mjs")]);
	const store = await createWorkerEnvironmentStore();
	const placementStore = createWorkerSessionPlacementStore();
	const records = store.list();
	const durableProviderIds = uniqueStrings(records.flatMap((record) => record.state === "destroyed" || record.state === "failed" || record.state === "orphaned" ? [] : record.providerId === "device" ? [] : [record.providerId]));
	const listDurableProviderIds = () => uniqueStrings(store.listForReconcile().filter((record) => record.providerId !== DEVICE_WORKER_PROVIDER_ID).map((record) => record.providerId));
	return {
		durableProviderIds,
		listDurableProviderIds,
		store,
		placementStore
	};
}
async function createGatewayWorkerEnvironmentRuntime(params) {
	const deviceRuntime = createDeviceWorkerRuntime({ getPairedDevice });
	const [{ createWorkerEnvironmentService }, { createWorkerLiveEventReceiver }, { createWorkerSessionPlacementGate }, { createWorkerTranscriptCommitter }, { createWorkerTunnelManager }, { createNodeWorkerTunnelManager }, { createNodeWorkerPreparedWorkspaceTransport }, { createGatewayNodeWorkerBundleInstaller }, { createNodeWorkerBundleTransferService }, { createArtifactTransferHttpCallback }, { createNodeWorkspaceTransferService }, { createNodeWorkspaceTransferHttpCallback }, { createWorkerNodeDesktopCarrier }, { createWorkerNodePortalCarrier }, { createWorkerComputerService }, { resolveWorkerProvider }, { maintainConfiguredWorkerProviders }, { createWorkerBootstrapArtifactTransferService }] = await Promise.all([
		import("./service-u3Uol2Vu.mjs"),
		import("./live-events-Dd9hojnV.mjs"),
		import("./placement-worker-gate-Dj8gBfE0.mjs"),
		import("./transcript-commit-C_VmiuH5.mjs"),
		import("./tunnel-CGPmoWyn.mjs"),
		import("./node-worker-tunnel-DJmUvKLW.mjs"),
		import("./node-worker-prepared-workspace-transport-Rhx8XOQR.mjs"),
		import("./node-worker-bundle-installer-BU1ow3DG.mjs"),
		import("./node-worker-bundle-transfer-service-BdPWpV7d.mjs"),
		import("./artifact-transfer-http-XUX-rlI0.mjs"),
		import("./node-workspace-transfer-service-B4HqKo3Z.mjs"),
		import("./node-workspace-transfer-http-DeWiVm19.mjs"),
		import("./node-desktop-carrier-B89tOcGc.mjs"),
		import("./portal-node-carrier-C8UEdxkm.mjs"),
		import("./computer-service-BLuhkGDI.mjs"),
		import("./worker-provider-registry-CM2isKBB.mjs"),
		import("./worker-provider-maintenance-DpCvXtn0.mjs"),
		import("./worker-bootstrap-artifact-transfer-service-UQJ9Oq6J.mjs")
	]);
	await params.startup.placementStore.recoverWorkerSessionToolOperationsAfterRestart();
	const workerEnvironmentLog = params.log.child("worker-environments");
	await retryGatewayWorkerStartupRecovery({
		operation: "Worker startup local turn-claim recovery",
		run: () => params.startup.placementStore.clearLocalTurnClaimsAfterRestartAsync(),
		warn: (message) => workerEnvironmentLog.warn(message)
	});
	const placementGate = createWorkerSessionPlacementGate(params.startup.placementStore, { recoveryPlacements: await params.startup.placementStore.listAsync() });
	const listRetainedBundleHashes = async () => listRetainedWorkerBundleHashes({
		environments: params.startup.store.list(),
		placements: await params.startup.placementStore.listAsync()
	});
	let workerBundleProducer;
	let workerNpmArtifact;
	const prepareInstallation = async (install, signal) => {
		const [workerRuntime, { WORKER_PROTOCOL_FEATURES }] = await Promise.all([loadWorkerEnvironmentRuntimeModule(), import("./worker-admission-BbP9cXeM.mjs")]);
		signal?.throwIfAborted();
		const producer = workerBundleProducer ??= workerRuntime.createWorkerBundleProducer({
			protocolFeatures: WORKER_PROTOCOL_FEATURES,
			cacheOwnership: "exclusive",
			onCacheCleanupError: (error) => {
				workerEnvironmentLog.warn(`Worker bundle cache cleanup failed: ${String(error)}`);
			}
		});
		const bundle = await producer.prepare();
		await producer.prune(listRetainedBundleHashes);
		signal?.throwIfAborted();
		if (install === "bundle") return bundle;
		workerNpmArtifact ??= workerRuntime.resolveWorkerNpmInstallationArtifact({ bundle }).catch((error) => {
			workerNpmArtifact = void 0;
			throw error;
		});
		return await workerNpmArtifact;
	};
	const workerLiveEvents = createWorkerLiveEventReceiver();
	const workerTunnelManager = createWorkerTunnelManager({ desktopSessionRegistry: params.desktopSessionRegistry });
	const notifyPortalChange = () => {
		const runtime = params.getPortalRuntime();
		const service = runtime?.portalService;
		if (!service) return;
		runtime.broadcast("portal.changed", { portals: service.list().map(({ tokenQuery: _tokenQuery, url: _url, ...portal }) => portal) }, { dropIfSlow: true });
	};
	const workerNodeDesktopStreamBroker = params.nodeDesktopStreamBroker;
	const workerNodePortalCarrier = createWorkerNodePortalCarrier({ store: params.startup.store });
	const workerNodeDesktopCarrier = workerNodeDesktopStreamBroker ? createWorkerNodeDesktopCarrier({
		store: params.startup.store,
		desktopRegistry: params.desktopSessionRegistry
	}) : void 0;
	const nodeWorkerBundleTransfer = createNodeWorkerBundleTransferService();
	const nodeBootstrapTransfer = createWorkerBootstrapArtifactTransferService();
	const bootstrapProducers = /* @__PURE__ */ new Map();
	const retiringBootstrapProducers = /* @__PURE__ */ new Set();
	const retireBootstrapProducer = (producer) => {
		const retirement = producer.close().catch((error) => {
			workerEnvironmentLog.warn(`Cloud node artifact cleanup failed: ${String(error)}`);
		}).finally(() => retiringBootstrapProducers.delete(retirement));
		retiringBootstrapProducers.add(retirement);
	};
	const nodeWorkspaceTransfer = createNodeWorkspaceTransferService({ getOwner: (environmentId) => params.startup.store.getTransferOwner(environmentId) });
	await nodeWorkspaceTransfer.initialize();
	params.startup.store.onCredentialRevoked((environmentId) => {
		nodeWorkspaceTransfer.fenceEnvironment(environmentId);
	});
	const gatewayDeviceId = (await loadOrCreateProcessDeviceIdentityAsync()).deviceId;
	const nodeWorkerGatewayNamespace$1 = nodeWorkerGatewayNamespace(gatewayDeviceId);
	const nodeWorkerTunnelManager = createNodeWorkerTunnelManager({
		gatewayDeviceId,
		getEnvironment: (environmentId) => params.startup.store.get(environmentId),
		listEnvironments: () => params.startup.store.list(),
		getTransport: () => deviceRuntime.getNodeTransport(),
		launchNodeWorker: async (request) => await deviceRuntime.launchNodeWorker(request),
		validateWorkerTurn: (binding) => placementGate.validateWorkerTurn(binding),
		workspaceTransfer: nodeWorkspaceTransfer
	});
	const isEnvironmentOwnedNode = (nodeId) => params.startup.store.hasNodeEnrollmentOwner(nodeId);
	const installProgress = createWorkerRuntimeInstallProgressPublisher({
		environments: params.startup.store,
		placements: params.startup.placementStore,
		readInstall: (nodeId) => nodeWorkerBundleInstaller.readInstall(nodeId),
		warn: (message) => workerEnvironmentLog.warn(message)
	});
	const nodeWorkerBundleInstaller = createGatewayNodeWorkerBundleInstaller({
		gatewayNamespace: nodeWorkerGatewayNamespace$1,
		getTransport: () => deviceRuntime.getNodeTransport(),
		transfer: nodeWorkerBundleTransfer,
		log: workerEnvironmentLog,
		onObservationChange: installProgress.changed
	});
	const currentWorkerBundleArtifact = async () => {
		const artifact = await prepareInstallation("bundle");
		if (artifact.install !== "bundle") throw new Error("Node worker retention requires a bundle artifact");
		return artifact;
	};
	const prepareNodeArtifact = async (profileSnapshot, signal) => {
		const mode = profileSnapshot.executionMode === "remote-exec" ? "remote-exec" : "worker-turn";
		let registry = params.getPluginRegistry();
		let metadata = getGatewayPluginMetadataSnapshot();
		let generation = bootstrapProducers.get(mode);
		if (!generation || generation.registry !== registry || generation.metadata !== metadata) {
			const [{ createNodeBootstrapArtifactProvider }, { resolveNodeBootstrapPlugins }] = await Promise.all([import("./node-bootstrap-artifact-CtmSTXl5.mjs"), import("./node-bootstrap-plugins-DQKQCi2f.mjs")]);
			signal?.throwIfAborted();
			registry = params.getPluginRegistry();
			metadata = getGatewayPluginMetadataSnapshot();
			generation = bootstrapProducers.get(mode);
			if (!generation || generation.registry !== registry || generation.metadata !== metadata) {
				const packageRoot = resolveOpenClawPackageRootSync({
					moduleUrl: import.meta.url,
					argv1: process.argv[1],
					cwd: process.cwd()
				});
				const runningBuildId = resolveRuntimeServiceBuildId();
				if (!metadata || !packageRoot || !runningBuildId) throw new Error("Cloud node bootstrap requires the running build and plugin inventory; build OpenClaw and restart the Gateway");
				const producer = createNodeBootstrapArtifactProvider({
					packageRoot,
					runningBuildId,
					plugins: resolveNodeBootstrapPlugins({
						registry,
						metadata,
						executionMode: mode
					})
				});
				if (generation) retireBootstrapProducer(generation.producer);
				generation = {
					registry,
					metadata,
					producer
				};
				bootstrapProducers.set(mode, generation);
			}
		}
		return {
			artifact: await generation.producer.prepare(signal),
			assertCurrent: () => {
				if (bootstrapProducers.get(mode) !== generation || params.getPluginRegistry() !== generation.registry || getGatewayPluginMetadataSnapshot() !== generation.metadata) throw new Error("Worker preparation artifact generation changed");
			}
		};
	};
	const nodeWorkerBundleRetention = {
		isEnvironmentOwnedNode,
		currentBuild: currentWorkerBundleArtifact
	};
	const nodeEnrollment = createWorkerNodeEnrollmentManager({
		store: params.startup.store,
		getConfig: readRuntimeConfig,
		getLocalTlsFingerprint: () => params.resolveGatewayContext()?.gatewayTlsFingerprint,
		resolveAvailability: deviceRuntime.resolveAvailability,
		transfer: nodeBootstrapTransfer,
		prepareArtifact: async (record, signal) => (await prepareNodeArtifact(record.profileSnapshot, signal)).artifact
	});
	let createGatewayTools = async () => {
		throw new Error("Worker session tools are unavailable");
	};
	let dispatchChild = async () => {
		throw new Error("Worker session dispatch is unavailable");
	};
	const computers = createWorkerComputerService({
		store: params.startup.store,
		placements: params.startup.placementStore,
		resolveGatewayContext: params.resolveGatewayContext,
		getNodeTransport: () => deviceRuntime.getNodeTransport(),
		desktopRegistry: params.desktopSessionRegistry,
		warn: (message) => workerEnvironmentLog.warn(message)
	});
	const preparedWorkspaces = createNodeWorkerPreparedWorkspaceTransport({
		store: params.startup.store,
		placementStore: params.startup.placementStore,
		getNodeTransport: () => deviceRuntime.getNodeTransport(),
		gatewayNamespace: nodeWorkerGatewayNamespace$1
	});
	const workerEnvironmentService = createWorkerEnvironmentService({
		scheduler: params.scheduler,
		projectNamespace: nodeWorkerGatewayNamespace$1,
		prepareComputer: computers.prepare,
		prepareAttachedComputer: computers.prepareAttached,
		executeComputer: computers.execute,
		closeComputers: computers.close,
		closeEnvironmentComputers: computers.closeEnvironment,
		hasAttachedEnvironmentActivity: (environmentId, ownerEpoch) => params.desktopSessionRegistry.hasActivity(environmentId, ownerEpoch),
		store: params.startup.store,
		getConfig: readRuntimeConfig,
		resolveHumanPresenceDemand: () => {
			const config = readRuntimeConfig();
			const repository = configuredDefaultRepository(config);
			if (!repository?.profileId) return;
			const agentId = resolveDefaultAgentId(config);
			const executionMode = resolveDefaultWorkerPlacementExecutionMode({
				cfg: config,
				agentId
			});
			if (!executionMode) return;
			return {
				profileId: repository.profileId,
				executionMode,
				repository: {
					agentId,
					url: repository.url,
					...repository.ref ? { ref: repository.ref } : {}
				}
			};
		},
		presenceDemandStore: {
			read: readPreparedPoolPresenceDemand,
			write: writePreparedPoolPresenceDemand
		},
		maintainProviders: (signal) => maintainConfiguredWorkerProviders({
			getRegistry: params.getPluginRegistry,
			getConfig: readRuntimeConfig,
			signal,
			warn: (message) => workerEnvironmentLog.warn(message)
		}),
		resolveProvider: (providerId) => providerId === "device" ? deviceRuntime.provider : resolveWorkerProvider(params.getPluginRegistry(), providerId),
		prepareInstallation,
		ensureNodeWorkerBundle: nodeWorkerBundleInstaller,
		prepareNodeBootstrap: nodeEnrollment.prepare,
		prepareNodeArtifacts: async (profileSnapshot, signal) => {
			const pin = new AbortController();
			try {
				const preparationSignal = signal ? AbortSignal.any([signal, pin.signal]) : pin.signal;
				const [bootstrapResult, bundleResult] = await racePromiseWithAbortSignal(Promise.allSettled([prepareNodeArtifact(profileSnapshot, preparationSignal), prepareInstallation("bundle", preparationSignal)]), signal);
				signal?.throwIfAborted();
				if (bootstrapResult.status === "rejected") throw bootstrapResult.reason;
				if (bundleResult.status === "rejected") throw bundleResult.reason;
				const preparedBootstrap = bootstrapResult.value;
				const bootstrap = preparedBootstrap.artifact;
				const bundle = bundleResult.value;
				preparedBootstrap.assertCurrent();
				if (bundle.install !== "bundle") throw new Error("Worker preparation requires a bundle artifact");
				return {
					artifacts: {
						nodeBootstrapSha256: bootstrap.tarballSha256,
						enabledPluginIds: [...bootstrap.enabledPluginIds],
						workerBundleHash: bundle.bundleHash,
						workerArchiveSha256: bundle.tarballSha256,
						openclawVersion: bundle.openclawVersion,
						protocolFeatures: [...bundle.protocolFeatures]
					},
					assertCurrent: preparedBootstrap.assertCurrent
				};
			} finally {
				pin.abort();
			}
		},
		...preparedWorkspaces,
		prepareNodeEnrollment: nodeEnrollment.begin,
		admitsNodeSetupCompletion: nodeEnrollment.admitsNodeSetupCompletion,
		prepareNodeRuntime: nodeEnrollment.prepareRuntime,
		closeNodeRuntime: nodeEnrollment.closeRuntime,
		closeNodeEnrollment: nodeEnrollment.close,
		retireNodeEnrollment: nodeEnrollment.retire,
		stopNodeEnrollmentWaits: nodeEnrollment.stop,
		closeNodeBootstrapArtifacts: async () => {
			await Promise.all([...[...bootstrapProducers.values()].map(({ producer }) => producer.close()), ...retiringBootstrapProducers]);
			bootstrapProducers.clear();
		},
		tunnelManager: workerTunnelManager,
		nodeTunnelManager: nodeWorkerTunnelManager,
		runSessionEnvironmentCommand: (binding, command) => nodeWorkerTunnelManager.runSessionCommand(binding, command),
		nodeDesktopCarrier: workerNodeDesktopCarrier,
		nodePortalCarrier: workerNodePortalCarrier,
		closeWorkerPortals: async (environmentId, ownerEpoch) => {
			const service = params.getPortalRuntime()?.portalService;
			if (!service) return;
			await service.closeWorkerPortals(environmentId, ownerEpoch);
			notifyPortalChange();
		},
		stopNodeWorkerBundleTransfers: async () => {
			await installProgress.stop();
			nodeWorkerBundleTransfer.closeAll();
		},
		applyTranscriptCommit: createWorkerTranscriptCommitter({ getConfig: readRuntimeConfig }).commit,
		placementStore: placementGate,
		createGatewayTools: (request) => createGatewayTools(request),
		liveEvents: workerLiveEvents,
		resolveSshIdentity: async ({ provider, leaseId, profile, keyRef, assertAuthorized }) => {
			assertAuthorized();
			const workerRuntime = await loadWorkerEnvironmentRuntimeModule();
			assertAuthorized();
			return await workerRuntime.resolveWorkerSshIdentity({
				provider,
				leaseId,
				profile,
				keyRef,
				assertAuthorized,
				resolveGeneric: async (genericKeyRef, assertCurrent) => {
					assertCurrent();
					const contents = await workerRuntime.resolveSecretRefString(genericKeyRef, {
						config: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? readRuntimeConfig(),
						env: getActiveSecretsRuntimeEnvState()
					});
					assertCurrent();
					return {
						kind: "material",
						contents
					};
				}
			});
		},
		bootstrapWorker: async ({ operationId, sshEndpoint, installation, resolveIdentity, signal, assertCurrent }) => {
			return await (await loadWorkerEnvironmentRuntimeModule()).bootstrapWorker({
				operationId,
				ssh: sshEndpoint,
				artifact: installation,
				pinnedHostKey: sshEndpoint.hostKey
			}, {
				signal,
				resolveIdentity,
				assertCurrent
			});
		},
		logger: workerEnvironmentLog
	});
	try {
		await workerEnvironmentService.ready();
	} catch (error) {
		try {
			await workerEnvironmentService.stop();
		} catch (cleanupError) {
			if (cleanupError !== error) {
				if (cleanupError instanceof AggregateError && cleanupError.errors.includes(error)) throw cleanupError;
				throw new AggregateError([error, cleanupError], "Worker environment startup and cleanup failed", { cause: cleanupError });
			}
		}
		throw error;
	}
	bindDeviceWorkerAvailability(workerEnvironmentService, deviceRuntime.resolveAvailability);
	bindDeviceWorkerReconciliation(workerEnvironmentService, async (deviceId) => {
		const environmentIds = params.startup.store.listForReconcile().filter((record) => {
			const settings = record.profileSnapshot.settings;
			const profileDeviceId = isRecord(settings) ? settings.device : void 0;
			return record.providerId === "device" && typeof profileDeviceId === "string" && profileDeviceId.trim() === deviceId;
		}).map((record) => record.environmentId);
		for (const environmentId of environmentIds) await params.startup.store.revokeEnvironmentCredential(environmentId);
		await Promise.all(environmentIds.map((environmentId) => workerEnvironmentService.reconcileEnvironment(environmentId).catch(() => {
			workerEnvironmentLog.warn(`Device worker reconcile failed (${deviceId}, ${environmentId}); periodic cleanup will retry`);
		})));
		return environmentIds;
	});
	createGatewayTools = async (request) => {
		const { createWorkerGatewayTools } = await loadWorkerSessionToolExecutorModule();
		return createWorkerGatewayTools({
			...request,
			resolveGatewayContext: params.resolveGatewayContext,
			placements: params.startup.placementStore,
			environments: workerEnvironmentService,
			dispatchChild: (...args) => dispatchChild(...args),
			portals: {
				getService: () => params.getPortalRuntime()?.portalService,
				carrier: workerNodePortalCarrier,
				onChanged: notifyPortalChange
			}
		});
	};
	const bindWorkerNodeDesktopControl = workerNodeDesktopCarrier && workerNodeDesktopStreamBroker ? (transport) => workerNodeDesktopCarrier.bindRuntime({
		transport,
		streamBroker: workerNodeDesktopStreamBroker
	}) : void 0;
	return {
		workerEnvironmentService,
		workerLiveEvents,
		workerTunnelManager,
		nodeWorkerGatewayNamespace: nodeWorkerGatewayNamespace$1,
		nodeWorkerBundleRetention,
		runtimeInstall: createWorkerPlacementRuntimeInstallReader({
			environments: workerEnvironmentService,
			installer: nodeWorkerBundleInstaller
		}),
		bindWorkerSessionDispatch: (dispatch) => {
			dispatchChild = dispatch;
		},
		bindDeviceNodeControl: (transport) => {
			deviceRuntime.bindNodeTransport(transport);
			if (workerNodeDesktopStreamBroker) workerNodePortalCarrier.bindRuntime({
				transport,
				streamBroker: workerNodeDesktopStreamBroker
			});
		},
		...bindWorkerNodeDesktopControl ? { bindWorkerNodeDesktopControl } : {},
		bindNodeWorkspaceBindingResolver: (resolver) => nodeWorkerTunnelManager.bindWorkspaceBindingResolver(resolver),
		handleNodeWorkerBundleTransferRequest: createArtifactTransferHttpCallback(nodeWorkerBundleTransfer),
		handleWorkerBootstrapArtifactTransferRequest: createArtifactTransferHttpCallback(nodeBootstrapTransfer),
		handleNodeWorkspaceTransferRequest: createNodeWorkspaceTransferHttpCallback(nodeWorkspaceTransfer)
	};
}
//#endregion
export { createGatewayWorkerEnvironmentRuntime, loadGatewayWorkerEnvironmentStartupState };
