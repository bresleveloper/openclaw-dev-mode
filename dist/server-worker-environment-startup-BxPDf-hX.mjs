import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { s as resolveRuntimeServiceBuildId } from "./version-BkM1aB4w.mjs";
import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { d as isLinkLocalIpAddress, g as isUnspecifiedIpAddress } from "./ip-CDH5BTTD.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BN-rPaec.mjs";
import "./config-Ciq2mxdN.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot, s as getActiveSecretsRuntimeEnvState } from "./runtime-state-CtZtwiOt.mjs";
import { r as WORKER_BOOTSTRAP_ARTIFACT_TRANSFER_PATH } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { r as loadOrCreateProcessDeviceIdentityAsync } from "./device-identity-async-CB1i57hb.mjs";
import { s as workerBundleArchiveRelativePath } from "./worker-bundle-hash-6Zw7Auqb.mjs";
import { t as DEVICE_WORKER_PROVIDER_ID } from "./device-provider-identity-v6nXqNq_.mjs";
import { n as CLOUD_WORKER_PAIRING_SETUP_BOOTSTRAP_PROFILE } from "./device-bootstrap-profile-CLBYuPAv.mjs";
import { l as removePairedDeviceRole, t as getPairedDevice } from "./device-pairing-DbLfxuuq.mjs";
import { i as ensureDevicePairSetupBootstrapToken } from "./device-bootstrap-BtrqJlcg.mjs";
import { a as resolvePairingSetupFromConfig, i as resolvePairingGatewayUrl, n as encodePairingSetupCode, r as resolveConfiguredPairingPublicUrl } from "./setup-code-BNyr2Ilv.mjs";
import { n as bindDeviceWorkerReconciliation, r as createDeviceWorkerRuntime, t as bindDeviceWorkerAvailability } from "./device-provider-meDSQEul.mjs";
import { t as nodeWorkerGatewayNamespace } from "./node-worker-gateway-namespace-kRiA3LFq.mjs";
import { t as listRetainedWorkerBundleHashes } from "./worker-bundle-retention-CjTcc8Ny.mjs";
import os from "node:os";
import { setTimeout } from "node:timers/promises";
//#region src/gateway/worker-environments/node-enrollment.ts
const NODE_ENROLLMENT_TIMEOUT_MS = 6e5;
const NODE_ENROLLMENT_POLL_MS = 250;
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
			publicUrl: resolveConfiguredPairingPublicUrl(config) ?? resolveGatewayPublicOrigin(config),
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
		const admission = options.store.get(record.environmentId);
		if (admission?.state !== "provisioning" || admission.destroyRequestedAtMs !== null || admission.provisionOperationId !== record.provisionOperationId || admission.ownerEpoch !== record.ownerEpoch) throw new Error("Worker node enrollment is no longer provisioning");
		active.get(record.environmentId)?.close();
		const enrollmentAbort = new AbortController();
		const enrollmentSignal = AbortSignal.any([
			signal,
			enrollmentAbort.signal,
			...operationSignal ? [operationSignal] : []
		]);
		const binding = { close: () => {
			if (active.get(record.environmentId) === binding) active.delete(record.environmentId);
			enrollmentAbort.abort();
		} };
		active.set(record.environmentId, binding);
		const current = () => {
			enrollmentSignal.throwIfAborted();
			const live = options.store.get(record.environmentId);
			if (active.get(record.environmentId) !== binding || live?.state !== "provisioning" || live.destroyRequestedAtMs !== null || live.provisionOperationId !== record.provisionOperationId || live.ownerEpoch !== record.ownerEpoch) throw new Error("Worker node enrollment is no longer provisioning");
			return live;
		};
		return {
			binding,
			enrollmentSignal,
			current
		};
	};
	const grantArtifact = (prepared, artifact, enrollmentSignal, isAuthorized) => {
		const capability = options.transfer.prepare({
			artifact,
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
	const grantRuntime = (prepared, enrollmentSignal, isAuthorized) => ({
		nodeBootstrap: {
			...grantArtifact(prepared, prepared.artifact, enrollmentSignal, isAuthorized),
			openclawVersion: prepared.artifact.openclawVersion,
			enabledPluginIds: prepared.artifact.enabledPluginIds
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
			const runtime = {
				...grantRuntime(prepared, enrollmentSignal, isAuthorized),
				workerBundle: {
					...grantArtifact(prepared, bundle, enrollmentSignal, isAuthorized),
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
			let current = await options.store.ensureNodeEnrollment(record.environmentId);
			requireCurrent();
			if (current.state !== "provisioning" || current.destroyRequestedAtMs !== null || current.provisionOperationId !== record.provisionOperationId || current.ownerEpoch !== record.ownerEpoch) throw new Error("Worker node enrollment is no longer provisioning");
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
				if (issued.status === "completed") {
					current = await options.store.ensureNodeEnrollment(record.environmentId);
					requireCurrent();
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
						publicUrl: resolveConfiguredPairingPublicUrl(config) ?? resolveGatewayPublicOrigin(config),
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
				return active.get(owner.environmentId) === binding && !enrollmentSignal.aborted && live?.state === "provisioning" && live.destroyRequestedAtMs === null && live.provisionOperationId === record.provisionOperationId && live.ownerEpoch === record.ownerEpoch && live.nodeSetupId === owner.nodeSetupId && live.nodeDeviceId === owner.nodeDeviceId;
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
						if (!live || live.destroyRequestedAtMs !== null || live.state !== "provisioning" || live.provisionOperationId !== owner.provisionOperationId || live.nodeSetupId !== owner.nodeSetupId || live.ownerEpoch !== owner.ownerEpoch || active.get(owner.environmentId) !== binding) throw new Error("Worker node enrollment is no longer current");
						if (live.nodeDeviceId) {
							const availability = await options.resolveAvailability(live.nodeDeviceId);
							enrollmentSignal.throwIfAborted();
							const latest = options.store.get(owner.environmentId);
							if (!latest || latest.state !== "provisioning" || latest.destroyRequestedAtMs !== null || latest.provisionOperationId !== owner.provisionOperationId || latest.ownerEpoch !== owner.ownerEpoch || latest.nodeSetupId !== owner.nodeSetupId || latest.nodeDeviceId !== live.nodeDeviceId || active.get(owner.environmentId) !== binding) throw new Error("Worker node enrollment is no longer current");
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
			const preflight = new AbortController();
			try {
				return (await prepare(record, AbortSignal.any([
					signal,
					preflight.signal,
					...operationSignal ? [operationSignal] : []
				]))).artifact.tarballSha256;
			} finally {
				preflight.abort();
			}
		},
		prepareRuntime,
		begin,
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
//#region src/gateway/server-worker-environment-startup.ts
const loadWorkerEnvironmentRuntimeModule = createLazyRuntimeModule(() => import("./gateway/worker-environments/runtime.js"));
const loadWorkerInferenceRuntimeModule = createLazyRuntimeModule(() => import("./inference-runtime-BcHEwHmx.mjs"));
const loadWorkerSessionToolExecutorModule = createLazyRuntimeModule(() => import("./worker-session-tool-executor-DPZNAT2u.mjs"));
async function loadGatewayWorkerEnvironmentStartupState() {
	const [{ createWorkerEnvironmentStore }, { createWorkerSessionPlacementStore }] = await Promise.all([import("./store-Baij5Z6o.mjs"), import("./placement-store-Cbhdw0Eh.mjs")]);
	const store = await createWorkerEnvironmentStore();
	const placementStore = createWorkerSessionPlacementStore();
	const records = store.list();
	const durableProviderIds = uniqueStrings(records.flatMap((record) => record.state === "destroyed" || record.state === "failed" || record.state === "orphaned" ? [] : record.providerId === "device" ? [] : [record.providerId]));
	const listDurableProviderIds = () => uniqueStrings(store.listForReconcile().filter((record) => record.providerId !== DEVICE_WORKER_PROVIDER_ID).map((record) => record.providerId));
	return {
		durableProviderIds,
		listDurableProviderIds,
		records,
		store,
		placementStore
	};
}
async function createGatewayWorkerEnvironmentRuntime(params) {
	const deviceRuntime = createDeviceWorkerRuntime({ getPairedDevice });
	const [{ createWorkerEnvironmentService }, { createWorkerLiveEventReceiver }, { createWorkerSessionPlacementGate }, { createWorkerTranscriptCommitter }, { createWorkerTunnelManager }, { createNodeWorkerTunnelManager }, { createNodeWorkerPreparedWorkspaceTransport }, { createGatewayNodeWorkerBundleInstaller }, { createNodeWorkerBundleTransferService }, { createNodeWorkerBundleTransferHttpCallback }, { createNodeWorkspaceTransferService }, { createNodeWorkspaceTransferHttpCallback }, { createWorkerNodeDesktopCarrier }, { createWorkerNodePortalCarrier }, { createWorkerComputerService }, { resolveWorkerProvider }, { maintainConfiguredWorkerProviders }, { createWorkerBootstrapArtifactTransferService }, { createWorkerBootstrapArtifactTransferHttpCallback }] = await Promise.all([
		import("./service-PcmhkfIC.mjs"),
		import("./live-events-DuWSkQy6.mjs"),
		import("./placement-worker-gate-BIpcTxft.mjs"),
		import("./transcript-commit-CE2hRsLk.mjs"),
		import("./tunnel-clZzvwoj.mjs"),
		import("./node-worker-tunnel-BowwSKhA.mjs"),
		import("./node-worker-prepared-workspace-transport-DMV3Zcms.mjs"),
		import("./node-worker-bundle-installer-BKlc_T3y.mjs"),
		import("./node-worker-bundle-transfer-service-D-HrBakC.mjs"),
		import("./node-worker-bundle-transfer-http-_dhZ-the.mjs"),
		import("./node-workspace-transfer-service-dv6ZAfcR.mjs"),
		import("./node-workspace-transfer-http-B3g4zXt5.mjs"),
		import("./node-desktop-carrier-D-SUj4iv.mjs"),
		import("./portal-node-carrier-BuDOeAKq.mjs"),
		import("./computer-service-Cy6EI5TF.mjs"),
		import("./worker-provider-registry-BcVBb38k.mjs"),
		import("./worker-provider-maintenance-W3MbRDxU.mjs"),
		import("./worker-bootstrap-artifact-transfer-service-B5MlV5Dx.mjs"),
		import("./worker-bootstrap-artifact-transfer-http-X1AcLY3r.mjs")
	]);
	params.startup.placementStore.recoverWorkerSessionToolOperationsAfterRestart();
	params.startup.placementStore.clearLocalTurnClaimsAfterRestart();
	const placementGate = createWorkerSessionPlacementGate(params.startup.placementStore, { rejectExistingWorkerClaims: true });
	const workerEnvironmentLog = params.log.child("worker-environments");
	const listRetainedBundleHashes = () => listRetainedWorkerBundleHashes({
		environments: params.startup.store.list(),
		placements: params.startup.placementStore.list()
	});
	let workerBundleProducer;
	let workerNpmArtifact;
	const prepareInstallation = async (install) => {
		const [workerRuntime, { WORKER_PROTOCOL_FEATURES }] = await Promise.all([loadWorkerEnvironmentRuntimeModule(), import("./worker-admission-B59EvBXS.mjs")]);
		const producer = workerBundleProducer ??= workerRuntime.createWorkerBundleProducer({
			protocolFeatures: WORKER_PROTOCOL_FEATURES,
			cacheOwnership: "exclusive",
			onCacheCleanupError: (error) => {
				workerEnvironmentLog.warn(`Worker bundle cache cleanup failed: ${String(error)}`);
			}
		});
		const bundle = await producer.prepare();
		await producer.prune(listRetainedBundleHashes);
		if (install === "bundle") return bundle;
		workerNpmArtifact ??= workerRuntime.resolveWorkerNpmInstallationArtifact({ bundle }).catch((error) => {
			workerNpmArtifact = void 0;
			throw error;
		});
		return await workerNpmArtifact;
	};
	const startupBindings = params.startup.records.flatMap((record) => record.state === "attached" && record.attachedSessionIds.length === 1 ? [{
		environmentId: record.environmentId,
		runEpoch: record.ownerEpoch,
		sessionId: record.attachedSessionIds[0]
	}] : []);
	const workerLiveEvents = createWorkerLiveEventReceiver({
		getConfig: getRuntimeConfig,
		startupBindings,
		startupOwners: new Map(startupBindings.map((binding) => [binding.environmentId, binding.runEpoch]))
	});
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
	const nodeWorkerBundleInstaller = createGatewayNodeWorkerBundleInstaller({
		gatewayNamespace: nodeWorkerGatewayNamespace$1,
		getTransport: () => deviceRuntime.getNodeTransport(),
		transfer: nodeWorkerBundleTransfer
	});
	const prepareNodeArtifact = async (profileSnapshot, signal) => {
		const mode = profileSnapshot.executionMode === "remote-exec" ? "remote-exec" : "worker-turn";
		let registry = params.getPluginRegistry();
		let metadata = getGatewayPluginMetadataSnapshot();
		let generation = bootstrapProducers.get(mode);
		if (!generation || generation.registry !== registry || generation.metadata !== metadata) {
			const [{ createNodeBootstrapArtifactProvider }, { resolveNodeBootstrapPlugins }] = await Promise.all([import("./node-bootstrap-artifact-CnmLayBv.mjs"), import("./node-bootstrap-plugins-DjMS5UBR.mjs")]);
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
		currentBuild: async () => {
			const artifact = await prepareInstallation("bundle");
			if (artifact.install !== "bundle") throw new Error("Node worker retention requires a bundle artifact");
			return artifact;
		}
	};
	const nodeEnrollment = createWorkerNodeEnrollmentManager({
		store: params.startup.store,
		getConfig: getRuntimeConfig,
		getLocalTlsFingerprint: () => params.resolveGatewayContext()?.gatewayTlsFingerprint,
		resolveAvailability: deviceRuntime.resolveAvailability,
		transfer: nodeBootstrapTransfer,
		prepareArtifact: async (record, signal) => (await prepareNodeArtifact(record.profileSnapshot, signal)).artifact
	});
	let executeSessionTool = async () => {
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
		projectNamespace: nodeWorkerGatewayNamespace$1,
		prepareComputer: computers.prepare,
		prepareAttachedComputer: computers.prepareAttached,
		executeComputer: computers.execute,
		closeComputers: computers.close,
		closeEnvironmentComputers: computers.closeEnvironment,
		hasAttachedEnvironmentActivity: (environmentId, ownerEpoch) => params.desktopSessionRegistry.hasActivity(environmentId, ownerEpoch),
		store: params.startup.store,
		getConfig: getRuntimeConfig,
		maintainProviders: (signal) => maintainConfiguredWorkerProviders({
			getRegistry: params.getPluginRegistry,
			getConfig: getRuntimeConfig,
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
				const preparedBootstrap = await prepareNodeArtifact(profileSnapshot, signal ? AbortSignal.any([signal, pin.signal]) : pin.signal);
				signal?.throwIfAborted();
				const bootstrap = preparedBootstrap.artifact;
				preparedBootstrap.assertCurrent();
				const bundle = await racePromiseWithAbortSignal(prepareInstallation("bundle"), signal);
				signal?.throwIfAborted();
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
		stopNodeWorkerBundleTransfers: () => nodeWorkerBundleTransfer.closeAll(),
		applyTranscriptCommit: createWorkerTranscriptCommitter({ getConfig: getRuntimeConfig }).commit,
		executeInference: async (inferenceParams) => {
			return await (await loadWorkerInferenceRuntimeModule()).executeWorkerInference(inferenceParams);
		},
		placementStore: placementGate,
		executeSessionTool: (request) => executeSessionTool(request),
		liveEvents: workerLiveEvents,
		resolveSshIdentity: async ({ provider, leaseId, profile, keyRef }) => {
			const workerRuntime = await loadWorkerEnvironmentRuntimeModule();
			return await workerRuntime.resolveWorkerSshIdentity({
				provider,
				leaseId,
				profile,
				keyRef,
				resolveGeneric: async (genericKeyRef) => ({
					kind: "material",
					contents: await workerRuntime.resolveSecretRefString(genericKeyRef, {
						config: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? getRuntimeConfig(),
						env: getActiveSecretsRuntimeEnvState()
					})
				})
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
	bindDeviceWorkerAvailability(workerEnvironmentService, deviceRuntime.resolveAvailability);
	bindDeviceWorkerReconciliation(workerEnvironmentService, async (deviceId) => {
		const environmentIds = params.startup.store.listForReconcile().filter((record) => {
			const settings = record.profileSnapshot.settings;
			const profileDeviceId = isRecord(settings) ? settings.device : void 0;
			return record.providerId === "device" && typeof profileDeviceId === "string" && profileDeviceId.trim() === deviceId;
		}).map((record) => record.environmentId);
		for (const environmentId of environmentIds) await params.startup.store.revokeEnvironmentCredential(environmentId);
		await Promise.all(environmentIds.map(async (environmentId) => {
			await workerEnvironmentService.reconcileEnvironment(environmentId).catch(() => {
				workerEnvironmentLog.warn(`Device worker reconcile failed (${deviceId}, ${environmentId}); periodic cleanup will retry`);
			});
		}));
		return environmentIds;
	});
	let workerSessionToolExecutor;
	executeSessionTool = async (request) => {
		return await (await (workerSessionToolExecutor ??= loadWorkerSessionToolExecutorModule().then(({ createWorkerSessionToolExecutor }) => createWorkerSessionToolExecutor({
			resolveGatewayContext: params.resolveGatewayContext,
			placements: params.startup.placementStore,
			environments: workerEnvironmentService,
			dispatchChild: (...args) => dispatchChild(...args),
			portals: {
				getService: () => params.getPortalRuntime()?.portalService,
				carrier: workerNodePortalCarrier,
				onChanged: notifyPortalChange
			}
		}))))(request);
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
		handleNodeWorkerBundleTransferRequest: createNodeWorkerBundleTransferHttpCallback(nodeWorkerBundleTransfer),
		handleWorkerBootstrapArtifactTransferRequest: createWorkerBootstrapArtifactTransferHttpCallback(nodeBootstrapTransfer),
		handleNodeWorkspaceTransferRequest: createNodeWorkspaceTransferHttpCallback(nodeWorkspaceTransfer)
	};
}
//#endregion
export { createGatewayWorkerEnvironmentRuntime, loadGatewayWorkerEnvironmentStartupState };
