import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as getPluginCacheRetirementSignal, d as getPluginMetadataSnapshotCache } from "./plugin-cache-BABafcXD.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import { n as isDeeplyFrozenPlainData } from "./immutable-data-MyNs7ITg.mjs";
import { c as getConfigResolutionFacts, m as serializeConfigResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { n as createPluginSourceCaptureRoot } from "./plugin-source-capture-directory-suikpgfR.mjs";
import { a as resolveInstalledManifestRegistryIndexFingerprint } from "./plugin-control-plane-context-DPS9EUx6.mjs";
import { r as overlayPluginNativeAdmissions } from "./plugin-native-admission-state-D3dxXEX2.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-rvQFgz1Z.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-BNE7YdYW.mjs";
import { t as captureRemoteModelCatalogSnapshot } from "./remote-overlay-C3A-3o4_.mjs";
import { _ as cloneAuthProfileStore } from "./oauth-shared-CFtD6sCU.mjs";
import { u as setPreparedModelFullCatalogAuth } from "./prepared-model-runtime-auth-Dn7HF9Vu.mjs";
import { i as createPreparedModelCatalogPreparationTimeout, r as PreparedModelCatalogGenerationMismatchError, t as PreparedModelCatalogAdmissionStalledError } from "./prepared-model-catalog.errors-CPinmjLF.mjs";
import { o as captureProviderSyntheticAuthFacts } from "./provider-runtime-Ck_Cecr1.mjs";
import { t as listManifestSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-5KDV2tDJ.mjs";
import { o as registerPreparedModelRuntimeClose } from "./prepared-model-runtime.lifecycle-ADHVLWEn.mjs";
import { a as markPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-DdS97WBs.mjs";
import { n as captureClawInstallSchemaVersionFacts } from "./provenance-runtime-read-DLNIVZio.mjs";
import { l as scopeSyntheticAuthProviderRefs, n as fingerprintPreparedRuntimeFacts, s as listRegistrySyntheticAuthProviderRefs } from "./prepared-model-runtime.facts-Uvb82TTa.mjs";
const CATALOG_WORKER_HEAP_LIMIT_MB = 512;
/**
* Without crash restart, the pool closes itself when its worker fails, exits or times out, even
* while no task is waiting. It reports its first close so the owner can tell that from its own.
*/
var CatalogWorkerTaskPool = class extends WorkerTaskPool {
	constructor(env, validateResult, assertCurrent, onClose) {
		super({
			workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.preparedModelCatalog),
			workerOptions: { resourceLimits: {
				maxOldGenerationSizeMb: CATALOG_WORKER_HEAP_LIMIT_MB,
				maxYoungGenerationSizeMb: 32
			} },
			maxWorkers: 1,
			idleTimeoutMs: 0,
			restartOnError: false,
			prepareWorker: () => {
				assertCurrent?.();
				const capture = createPluginSourceCaptureRoot(resolveStateDir(env), "openclaw-model-catalog-");
				return {
					releaseResources: capture.release,
					options: {
						workerData: {
							sourceCaptureDirectory: capture.directory,
							sourceCaptureManagedRoot: capture.managedRoot
						},
						env
					}
				};
			},
			validateResult
		});
		this.onClose = onClose;
	}
	close(error) {
		const first = !this.isClosed;
		const closed = super.close(error);
		if (first) this.onClose?.(error);
		return closed;
	}
};
//#endregion
//#region src/agents/prepared-model-catalog-worker.ts
/** Runs complete model-catalog discovery outside the Gateway event loop. */
const PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS = 18e4;
const log = createSubsystemLogger("agents/prepared-model-runtime");
const gatewayCatalog = resolveGlobalSingleton(Symbol.for("openclaw.gatewayModelCatalogPool"), () => ({}));
function getPreparedModelCatalogWorkerPoolSnapshot() {
	return {
		...gatewayCatalog.current?.pool.getSnapshot() ?? {
			maxWorkers: 1,
			workers: 0,
			workersCreated: 0,
			activeTasks: 0,
			pendingTasks: 0
		},
		workerFailures: gatewayCatalog.workerFailures ?? 0
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
		let admissionStalled = false;
		const current = {
			cache,
			envFingerprint: environmentFingerprint,
			borrowers: /* @__PURE__ */ new Set(),
			recover: (error) => admissionStalled ? Promise.resolve() : current.recovery ??= (async () => {
				const borrowers = [...current.borrowers];
				if (!signal.aborted) for (const borrower of borrowers) borrower.notifyRecovery(error);
				const stopping = borrowers.map((borrower) => borrower.stop(error));
				await current.close(error);
				await Promise.all(stopping);
				if (gatewayCatalog.current === current) gatewayCatalog.current = void 0;
				const { recoverPreparedModelRuntimeCatalogWorker } = await import("./prepared-model-runtime-D44W8DOl.mjs");
				await recoverPreparedModelRuntimeCatalogWorker(borrowers);
			})(),
			close: async (error) => {
				current.closing = true;
				signal.removeEventListener("abort", retire);
				await current.pool.close(error);
				current.validate = void 0;
				release();
			},
			validate: void 0,
			pool: new CatalogWorkerTaskPool(input.input.env, (result) => {
				const validate = current.validate;
				current.validate = void 0;
				validate?.(result);
			}, () => signal.throwIfAborted(), (error) => {
				if (!current.closing && !signal.aborted) {
					admissionStalled = error instanceof PreparedModelCatalogAdmissionStalledError;
					gatewayCatalog.workerFailures = (gatewayCatalog.workerFailures ?? 0) + 1;
					log.warn(`model catalog worker failed; ${admissionStalled ? "native admission will not be retried automatically" : `${[...current.borrowers].filter((borrower) => borrower.isCurrent()).length} agent catalog(s) will be republished on a new worker`} (failure ${gatewayCatalog.workerFailures} since start): ${formatErrorMessage(error)}`);
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
		remoteCatalogSource: params.remoteCatalog?.sourceUrl,
		remoteCatalogRevision: params.remoteCatalog?.revision,
		input: {
			...params.input,
			config: fingerprintPreparedModelCatalogConfig(params.input.config)
		},
		sourceConfigForSecrets: fingerprintPreparedModelCatalogConfig(params.sourceConfigForSecrets),
		configResolutionFacts: params.configResolutionFacts,
		sourceConfigResolutionFacts: params.sourceConfigResolutionFacts,
		authStore: params.authStore,
		providerIds: params.providerIds,
		catalogFacts: params.catalogFacts,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts,
		pluginFingerprint: fingerprintPreparedModelCatalogPlugins(params.pluginMetadataSnapshot)
	});
}
/** Registrations follow their loader context; agent credentials remain request-local. */
function fingerprintPreparedModelCatalogPluginContext(value) {
	return fingerprintPreparedRuntimeFacts({
		remoteCatalogSource: value.remoteCatalog?.sourceUrl,
		remoteCatalogRevision: value.remoteCatalog?.revision,
		config: fingerprintPreparedModelCatalogConfig(value.input.config),
		sourceConfigForSecrets: fingerprintPreparedModelCatalogConfig(value.sourceConfigForSecrets),
		configResolutionFacts: value.configResolutionFacts,
		sourceConfigResolutionFacts: value.sourceConfigResolutionFacts,
		env: value.input.env,
		workspaceDir: value.pluginMetadataSnapshot.workspaceDir ?? value.input.workspaceDir,
		allowGatewaySubagentBinding: value.input.allowGatewaySubagentBinding === true,
		preferBuiltPluginArtifacts: value.preferBuiltPluginArtifacts,
		pluginFingerprint: fingerprintPreparedModelCatalogPlugins(value.pluginMetadataSnapshot)
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
		env: { ...params.agentFacts.env },
		...source.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		config: source.config
	};
	const sourceConfigForSecrets = projectConfigOntoRuntimeSourceSnapshot(source.config);
	const configResolutionFacts = serializeConfigResolutionFacts(source.config);
	const sourceConfigResolutionFacts = getConfigResolutionFacts(source.config) === getConfigResolutionFacts(sourceConfigForSecrets) ? configResolutionFacts : serializeConfigResolutionFacts(sourceConfigForSecrets);
	const { normalizePluginId: _normalizePluginId, ...pluginMetadataSnapshot } = params.pluginMetadataSnapshot;
	const cache = getPluginMetadataSnapshotCache(params.pluginMetadataSnapshot);
	const index = overlayPluginNativeAdmissions(pluginMetadataSnapshot.index, cache);
	const value = {
		remoteCatalog: captureRemoteModelCatalogSnapshot(),
		input,
		sourceConfigForSecrets,
		configResolutionFacts,
		sourceConfigResolutionFacts,
		authStore: cloneAuthProfileStore(params.agentFacts.authStore),
		providerIds: [...params.agentFacts.providerIds],
		catalogFacts: {
			configuredModelRefs: params.agentFacts.configuredModelRefs,
			configuredRuntimeModels: params.agentFacts.configuredRuntimeModels
		},
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts === true,
		pluginMetadataSnapshot: {
			...pluginMetadataSnapshot,
			index,
			registryIndex: pluginMetadataSnapshot.registryIndex === pluginMetadataSnapshot.index ? index : overlayPluginNativeAdmissions(pluginMetadataSnapshot.registryIndex, cache)
		}
	};
	return {
		...value,
		generationFingerprint: fingerprintPreparedModelCatalogGeneration(value)
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
	let pendingAuth;
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
		let progress;
		let expire = () => controller.abort(new WorkerTaskError("worker task timed out", "timeout"));
		const timeout = setTimeout(() => expire(), PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS);
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
			const manifestRefs = listManifestSyntheticAuthProviderRefs(metadataSnapshot.index);
			const capture = withPluginRuntimeGenerationScope({
				metadataSnapshot,
				pluginRegistry: params.pluginRegistry
			}, () => captureProviderSyntheticAuthFacts({
				config: input.config,
				env: input.env,
				workspaceDir: input.workspaceDir,
				providerRefs: command.kind === "catalog" && !command.providerIds ? [
					...manifestRefs,
					...listRegistrySyntheticAuthProviderRefs(params.pluginRegistry),
					...workerInput.providerIds
				] : [...providerScope, ...scopeSyntheticAuthProviderRefs(manifestRefs, providerScope)],
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
			requestPool = pool = shared?.pool ?? pool ?? new CatalogWorkerTaskPool(workerInput.input.env, validate);
			pending = requestPool.run(() => {
				assertCurrent();
				expire = () => {
					const failure = createPreparedModelCatalogPreparationTimeout(progress?.active ? progress.pluginId : void 0, PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS);
					borrower.notifyRecovery(failure);
					requestPool.close(failure).catch((error) => process.emitWarning(String(error)));
				};
				timeout.refresh();
				task.onRecovery = onRecovery;
				const workerRequest = {
					...value,
					clawInstallSchemaVersions: captureClawInstallSchemaVersionFacts({ env: input.env })
				};
				expectedFingerprint = fingerprintPreparedModelWorkerRequest(workerInput, workerRequest);
				if (shared) shared.validate = validate;
				return {
					value: workerInput,
					request: workerRequest
				};
			}, {
				signal: controller.signal,
				onNotification: (notification) => {
					const next = notification;
					if (!progress || next.completed > progress.completed) timeout.refresh();
					progress = next;
				},
				onRequest: async () => {
					clearTimeout(timeout);
					return {
						input: !stoppedError && params.isCurrent(),
						timeoutMs: PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS
					};
				}
			});
			tasks.set(pending, task);
			message = await pending;
			assertCurrent();
		} catch (error) {
			const failure = error instanceof Error ? error : new Error(String(error));
			if (failure instanceof PreparedModelCatalogAdmissionStalledError) throw failure;
			if (failure instanceof WorkerTaskError && failure.code === "overloaded") throw failure;
			if (gatewayOwned && requestPool && !requestPool.isClosed && params.isCurrent()) {
				controller.abort(error);
				throw error;
			}
			if (gatewayOwned && sharedOwner && sharedOwner.pool.isClosed && !(failure instanceof PreparedModelRuntimePublicationSupersededError)) await sharedOwner.recover(failure).catch((recoveryError) => {
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
				providerExpiries: message.providerExpiries,
				hookRows: message.hookRows
			};
		},
		loadAuth: async ({ providerIds, profileIds }) => {
			const normalizedProviderIds = [...new Set(providerIds)].toSorted((left, right) => left.localeCompare(right));
			const normalizedProfileIds = profileIds && [...new Set(profileIds)].toSorted((left, right) => left.localeCompare(right));
			const key = JSON.stringify([normalizedProviderIds, normalizedProfileIds]);
			if (pendingAuth?.key === key) return pendingAuth.promise;
			const promise = request({
				kind: "auth-refresh",
				providerIds: normalizedProviderIds,
				...normalizedProfileIds ? { profileIds: normalizedProfileIds } : {}
			}).then((message) => {
				if (message.kind !== "auth-refresh") throw new Error("prepared model auth refresh worker returned a catalog result");
				return {
					authStore: message.authStore,
					authModes: message.authModes,
					credentials: message.credentials
				};
			}).finally(() => {
				if (pendingAuth?.promise === promise) pendingAuth = void 0;
			});
			pendingAuth = {
				key,
				promise
			};
			return promise;
		}
	};
}
//#endregion
export { fingerprintPreparedModelCatalogPluginContext as a, fingerprintPreparedModelCatalogGeneration as i, createPreparedModelCatalogWorker as n, fingerprintPreparedModelWorkerRequest as o, createPreparedModelCatalogWorkerInput as r, getPreparedModelCatalogWorkerPoolSnapshot as s, PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS as t };
