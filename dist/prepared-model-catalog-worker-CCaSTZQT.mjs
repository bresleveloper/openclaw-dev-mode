import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as getPluginCacheRetirementSignal, d as getPluginMetadataSnapshotCache } from "./plugin-cache-A1nT2dqa.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-MyNs7ITg.mjs";
import { c as getConfigResolutionFacts, m as serializeConfigResolutionFacts } from "./resolution-facts-CSuKIPux.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { r as WorkerTaskError, t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import { t as createPluginSourceCaptureRoot } from "./plugin-source-capture-directory-DMhuTSdY.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-CNov0ojO.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-D2uZ1zpS.mjs";
import { d as cloneAuthProfileStore } from "./oauth-shared-CVbJLd-k.mjs";
import { l as setPreparedModelFullCatalogAuth } from "./prepared-model-runtime-auth-Bd3e65L_.mjs";
import { o as captureProviderSyntheticAuthFacts } from "./provider-runtime-BofzCM_V.mjs";
import { t as listManifestSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { a as registerPreparedModelRuntimeClose } from "./prepared-model-runtime.lifecycle-348wygR7.mjs";
import { o as markPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-4oGnFFN5.mjs";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
import { n as captureClawInstallSchemaVersionFacts } from "./provenance-runtime-read-Di4oRDaq.mjs";
import { n as fingerprintPreparedRuntimeFacts, s as scopeSyntheticAuthProviderRefs } from "./prepared-model-runtime.facts-X8iUOGNf.mjs";
//#region src/agents/prepared-model-catalog-worker.ts
/** Runs complete model-catalog discovery outside the Gateway event loop. */
const PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS = 18e4;
const GATEWAY_CATALOG_WORKERS = 1;
const CATALOG_WORKER_HEAP_LIMIT_MB = 512;
const gatewayCatalog = resolveGlobalSingleton(Symbol.for("openclaw.gatewayModelCatalogPool"), () => ({}));
function getPreparedModelCatalogWorkerPoolSnapshot() {
	return gatewayCatalog.current?.pool.getSnapshot() ?? {
		maxWorkers: GATEWAY_CATALOG_WORKERS,
		workers: 0,
		workersCreated: 0,
		activeTasks: 0,
		pendingTasks: 0
	};
}
async function getGatewayCatalogPool(input, metadata, environmentFingerprint) {
	const cache = getPluginMetadataSnapshotCache(metadata);
	getPluginCacheRetirementSignal(cache).throwIfAborted();
	if (gatewayCatalog.rotating) {
		await gatewayCatalog.rotating;
		return getGatewayCatalogPool(input, metadata, environmentFingerprint);
	}
	if (gatewayCatalog.current?.recovery) {
		await gatewayCatalog.current.recovery;
		return getGatewayCatalogPool(input, metadata, environmentFingerprint);
	}
	if (gatewayCatalog.current?.cache === cache) {
		if (gatewayCatalog.current.envFingerprint === environmentFingerprint) return gatewayCatalog.current;
		if ([...gatewayCatalog.current.borrowers].some((borrower) => borrower.isCurrent())) throw new Error("Gateway catalog environment changed without retiring its plugin generation");
	}
	if (gatewayCatalog.current && [...gatewayCatalog.current.borrowers].some((borrower) => borrower.isCurrent())) throw new Error("Gateway catalog source generation changed before its previous owners retired");
	gatewayCatalog.rotating = (async () => {
		await gatewayCatalog.current?.close();
		const signal = getPluginCacheRetirementSignal(cache);
		signal.throwIfAborted();
		const env = input.input.env;
		const current = {
			cache,
			envFingerprint: environmentFingerprint,
			borrowers: /* @__PURE__ */ new Set(),
			recover: (error) => current.recovery ??= (async () => {
				const borrowers = [...current.borrowers];
				if (!signal.aborted) for (const borrower of borrowers) borrower.notifyRecovery(error);
				const stopping = borrowers.map((borrower) => borrower.stop(error));
				await current.close(error);
				await Promise.all(stopping);
				if (gatewayCatalog.current === current) gatewayCatalog.current = void 0;
				const { recoverPreparedModelRuntimeCatalogWorker } = await import("./prepared-model-runtime-DcL1zc7k.mjs");
				await recoverPreparedModelRuntimeCatalogWorker(borrowers);
			})(),
			close: async (error) => {
				signal.removeEventListener("abort", retire);
				await current.pool.close(error);
				current.validate = void 0;
				release();
			},
			validate: void 0,
			pool: new WorkerTaskPool({
				workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.preparedModelCatalog),
				workerOptions: { resourceLimits: { maxOldGenerationSizeMb: CATALOG_WORKER_HEAP_LIMIT_MB } },
				maxWorkers: GATEWAY_CATALOG_WORKERS,
				idleTimeoutMs: 0,
				restartOnError: false,
				prepareWorker: () => {
					signal.throwIfAborted();
					const capture = createPluginSourceCaptureRoot(resolveStateDir(env), "openclaw-model-catalog-");
					return {
						releaseResources: capture.release,
						options: {
							workerData: {
								kind: "gateway",
								sourceCaptureDirectory: capture.directory,
								sourceCaptureManagedRoot: capture.managedRoot
							},
							env
						}
					};
				},
				validateResult: (result) => {
					const validate = current.validate;
					current.validate = void 0;
					validate?.(result);
				}
			})
		};
		const retire = () => {
			current.close(signal.reason).catch((error) => {
				process.emitWarning(`Gateway catalog worker failed to retire: ${String(error)}`);
			});
		};
		const release = registerPreparedModelRuntimeClose(async (error) => {
			await current.close(error);
			if (gatewayCatalog.current === current) gatewayCatalog.current = void 0;
		});
		signal.addEventListener("abort", retire, { once: true });
		gatewayCatalog.current = current;
	})();
	try {
		await gatewayCatalog.rotating;
	} finally {
		gatewayCatalog.rotating = void 0;
	}
	return getGatewayCatalogPool(input, metadata, environmentFingerprint);
}
var PreparedModelCatalogGenerationMismatchError = class extends Error {
	constructor(agentDir, generationFingerprint, reconstructedFingerprint) {
		super(`prepared model catalog worker reconstructed a different runtime generation for ${agentDir} (owner=${generationFingerprint} worker=${reconstructedFingerprint})`);
		this.agentDir = agentDir;
		this.generationFingerprint = generationFingerprint;
		this.reconstructedFingerprint = reconstructedFingerprint;
		this.name = "PreparedModelCatalogGenerationMismatchError";
	}
};
function fingerprintPreparedModelWorkerRequest(input, request) {
	return fingerprintPreparedRuntimeFacts([input.generationFingerprint, request]);
}
function fingerprintPreparedModelCatalogPlugins(snapshot) {
	return fingerprintPreparedRuntimeFacts({
		config: snapshot.configFingerprint ?? null,
		index: resolveInstalledManifestRegistryIndexFingerprint(snapshot.index),
		pluginIds: snapshot.pluginIds ?? null,
		policy: snapshot.policyHash,
		workspaceDir: snapshot.workspaceDir ?? null
	});
}
const immutableGenerationConfigFingerprints = /* @__PURE__ */ new WeakMap();
function fingerprintPreparedModelCatalogConfig(config) {
	const immutable = isDeeplyFrozenPlainData(config);
	const cached = immutable ? immutableGenerationConfigFingerprints.get(config) : void 0;
	if (cached !== void 0) return cached;
	const fingerprint = fingerprintPreparedRuntimeFacts(config);
	if (immutable) immutableGenerationConfigFingerprints.set(config, fingerprint);
	return fingerprint;
}
function fingerprintPreparedModelCatalogGeneration(params) {
	return fingerprintPreparedRuntimeFacts({
		input: {
			...params.input,
			config: fingerprintPreparedModelCatalogConfig(params.input.config)
		},
		sourceConfigForSecrets: fingerprintPreparedModelCatalogConfig(params.sourceConfigForSecrets),
		configResolutionFacts: params.configResolutionFacts,
		sourceConfigResolutionFacts: params.sourceConfigResolutionFacts,
		authStore: params.authStore,
		providerIds: params.providerIds,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts === true,
		pluginFingerprint: fingerprintPreparedModelCatalogPlugins(params.pluginMetadataSnapshot)
	});
}
function createPreparedModelCatalogWorkerInput(params) {
	const source = params.agentFacts.input;
	const input = {
		...source.agentId ? { agentId: source.agentId } : {},
		agentDir: source.agentDir,
		...source.inheritedAuthDir ? { inheritedAuthDir: source.inheritedAuthDir } : {},
		...source.workspaceDir ? { workspaceDir: source.workspaceDir } : {},
		...source.readOnly ? { readOnly: true } : {},
		skipCredentials: true,
		env: { ...params.agentFacts.env },
		...source.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		...source.runtimePluginSelections ? { runtimePluginSelections: source.runtimePluginSelections } : {},
		config: source.config
	};
	const sourceConfigForSecrets = projectConfigOntoRuntimeSourceSnapshot(source.config);
	const configResolutionFacts = serializeConfigResolutionFacts(source.config);
	const sourceConfigResolutionFacts = getConfigResolutionFacts(source.config) === getConfigResolutionFacts(sourceConfigForSecrets) ? configResolutionFacts : serializeConfigResolutionFacts(sourceConfigForSecrets);
	const authStore = cloneAuthProfileStore(params.agentFacts.authStore);
	const providerIds = [...params.agentFacts.providerIds];
	const { normalizePluginId: _normalizePluginId, ...pluginMetadataSnapshot } = params.pluginMetadataSnapshot;
	return {
		kind: "catalog",
		generationFingerprint: fingerprintPreparedModelCatalogGeneration({
			input,
			sourceConfigForSecrets,
			configResolutionFacts,
			sourceConfigResolutionFacts,
			authStore,
			providerIds,
			preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		}),
		input,
		sourceConfigForSecrets,
		configResolutionFacts,
		sourceConfigResolutionFacts,
		authStore,
		providerIds,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts === true,
		pluginMetadataSnapshot
	};
}
function createPreparedModelCatalogWorker(params) {
	const workerInput = createPreparedModelCatalogWorkerInput(params);
	const metadataSnapshot = params.pluginMetadataSnapshot;
	const superseded = () => new PreparedModelRuntimePublicationSupersededError(`prepared model runtime catalog generation was superseded for ${workerInput.input.agentDir}`);
	let observingRetirement = false;
	let stoppedError;
	let releaseProcessLifetime;
	let expectedFingerprint;
	const captures = /* @__PURE__ */ new Map();
	const tasks = /* @__PURE__ */ new Map();
	const assertCurrent = () => {
		if (stoppedError) throw stoppedError;
		if (!params.isCurrent()) throw superseded();
	};
	const gatewayOwned = params.agentFacts.input.allowGatewaySubagentBinding === true && params.agentFacts.input.env === void 0;
	const environmentFingerprint = fingerprintPreparedRuntimeFacts(workerInput.input.env);
	let pool;
	let sharedOwner;
	const mismatch = (message) => new PreparedModelCatalogGenerationMismatchError(workerInput.input.agentDir, message.generationFingerprint, message.reconstructedFingerprint);
	const validate = (message) => {
		if (!gatewayOwned) assertCurrent();
		if (message.status === "generation-mismatch") throw mismatch(message);
		if (message.status === "ok" && message.generationFingerprint !== expectedFingerprint) throw new Error("prepared model catalog worker returned a stale generation");
	};
	const createPool = () => new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.preparedModelCatalog),
		workerOptions: { resourceLimits: { maxOldGenerationSizeMb: CATALOG_WORKER_HEAP_LIMIT_MB } },
		maxWorkers: 1,
		idleTimeoutMs: 0,
		restartOnError: false,
		prepareWorker: () => {
			const capture = createPluginSourceCaptureRoot(resolveStateDir(workerInput.input.env), "openclaw-model-catalog-");
			return {
				releaseResources: capture.release,
				options: {
					workerData: {
						...workerInput,
						sourceCaptureDirectory: capture.directory,
						sourceCaptureManagedRoot: capture.managedRoot
					},
					env: workerInput.input.env
				}
			};
		},
		validateResult: validate
	});
	const stop = async (error) => {
		stoppedError ??= error;
		params.retirementSignal.removeEventListener("abort", retire);
		for (const controller of captures.keys()) controller.abort(stoppedError);
		await Promise.allSettled(captures.values());
		if (gatewayOwned) await Promise.allSettled(tasks.keys());
		else await pool?.close(stoppedError);
		sharedOwner?.borrowers.delete(borrower);
		releaseProcessLifetime?.();
		releaseProcessLifetime = void 0;
	};
	const retire = () => {
		queueMicrotask(() => {
			stop(superseded()).catch((error) => {
				process.emitWarning(`Prepared model catalog worker failed to retire: ${String(error)}`);
			});
		});
	};
	const borrower = {
		agentDir: workerInput.input.agentDir,
		isCurrent: params.isCurrent,
		notifyRecovery: (error) => {
			if (stoppedError || !params.isCurrent()) return;
			for (const task of tasks.values()) task.onRecovery?.(error);
		},
		stop
	};
	const request = async (command, onRecovery) => {
		let message;
		let requestPool;
		let pending;
		const task = {};
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(new WorkerTaskError("worker task timed out", "timeout")), PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS);
		try {
			assertCurrent();
			releaseProcessLifetime ??= registerPreparedModelRuntimeClose(stop);
			if (!observingRetirement) {
				observingRetirement = true;
				params.retirementSignal.addEventListener("abort", retire, { once: true });
				if (params.retirementSignal.aborted) retire();
			}
			const { input } = workerInput;
			const providerScope = [...workerInput.providerIds, ...command.providerIds ?? []];
			const capture = withPluginRuntimeGenerationScope({
				metadataSnapshot,
				pluginRegistry: params.pluginRegistry
			}, () => captureProviderSyntheticAuthFacts({
				config: input.config,
				env: input.env,
				workspaceDir: input.workspaceDir,
				providerRefs: command.kind === "catalog" && !command.providerIds ? [...listManifestSyntheticAuthProviderRefs(metadataSnapshot.index), ...workerInput.providerIds] : [...providerScope, ...scopeSyntheticAuthProviderRefs(listManifestSyntheticAuthProviderRefs(metadataSnapshot.index), providerScope)],
				signal: controller.signal
			}));
			captures.set(controller, capture);
			let syntheticAuth;
			try {
				syntheticAuth = await capture;
			} finally {
				captures.delete(controller);
			}
			controller.signal.throwIfAborted();
			const value = {
				...command,
				syntheticAuth
			};
			const shared = gatewayOwned ? await getGatewayCatalogPool(workerInput, metadataSnapshot, environmentFingerprint) : void 0;
			if (shared) {
				sharedOwner = shared;
				shared.borrowers.add(borrower);
			}
			requestPool = pool = shared?.pool ?? pool ?? createPool();
			pending = requestPool.run(() => {
				assertCurrent();
				task.onRecovery = onRecovery;
				const workerRequest = {
					...value,
					clawInstallSchemaVersions: captureClawInstallSchemaVersionFacts({ env: input.env })
				};
				expectedFingerprint = fingerprintPreparedModelWorkerRequest(workerInput, workerRequest);
				if (shared) shared.validate = validate;
				return shared ? {
					value: workerInput,
					request: workerRequest
				} : workerRequest;
			}, {
				timeoutMs: PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS,
				signal: controller.signal
			});
			tasks.set(pending, task);
			message = await pending;
			assertCurrent();
		} catch (error) {
			const failure = error instanceof Error ? error : new Error(String(error));
			if (failure instanceof WorkerTaskError && failure.code === "overloaded") throw failure;
			if (gatewayOwned && requestPool && !requestPool.isClosed && params.isCurrent()) {
				controller.abort(error);
				throw error;
			}
			if (gatewayOwned && sharedOwner && requestPool?.isClosed && !(failure instanceof PreparedModelRuntimePublicationSupersededError)) await sharedOwner.recover(failure).catch((recoveryError) => {
				process.emitWarning(`Gateway catalog recovery failed: ${String(recoveryError)}`);
			});
			if (!gatewayOwned && failure instanceof PreparedModelCatalogGenerationMismatchError) {
				if (pool === requestPool) pool = void 0;
				await requestPool?.close(failure);
				throw failure;
			}
			controller.abort(error);
			await stop(failure);
			throw error;
		} finally {
			task.onRecovery = void 0;
			if (pending) tasks.delete(pending);
			clearTimeout(timeout);
		}
		if (message.status === "failed") throw new Error(message.error);
		if (message.status === "generation-mismatch") throw mismatch(message);
		return message;
	};
	return {
		loadCatalog: async (providerIds, onRecovery) => {
			const message = await request({
				kind: "catalog",
				...providerIds ? { providerIds } : {}
			}, onRecovery);
			if (message.kind !== "catalog") throw new Error("prepared model catalog worker returned an auth refresh result");
			const modelCatalog = markPreparedModelCatalogFull(message.snapshot);
			setPreparedModelFullCatalogAuth(modelCatalog, {
				authStore: message.authStore,
				authModes: message.authModes,
				credentials: message.credentials,
				providerAuthLabels: message.providerAuthLabels
			});
			return {
				modelCatalog,
				configuredRuntimeModels: message.configuredRuntimeModels,
				runtimeModels: message.runtimeModels,
				providerExpiries: message.providerExpiries
			};
		},
		loadAuth: async ({ providerIds, profileIds }) => {
			const normalizedProviderIds = [...new Set(providerIds)].toSorted((left, right) => left.localeCompare(right));
			const normalizedProfileIds = profileIds ? [...new Set(profileIds)].toSorted((left, right) => left.localeCompare(right)) : void 0;
			const message = await request({
				kind: "auth-refresh",
				providerIds: normalizedProviderIds,
				...normalizedProfileIds ? { profileIds: normalizedProfileIds } : {}
			});
			if (message.kind !== "auth-refresh") throw new Error("prepared model auth refresh worker returned a catalog result");
			return {
				authStore: message.authStore,
				authModes: message.authModes,
				credentials: message.credentials
			};
		}
	};
}
//#endregion
export { fingerprintPreparedModelWorkerRequest as a, fingerprintPreparedModelCatalogGeneration as i, createPreparedModelCatalogWorker as n, getPreparedModelCatalogWorkerPoolSnapshot as o, createPreparedModelCatalogWorkerInput as r, PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS as t };
