import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { p as getPluginMetadataSnapshotCache, u as getPluginCacheRetirementSignal } from "./plugin-cache-BbahpD-b.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { o as registerPreparedModelRuntimeClose } from "./prepared-model-runtime.lifecycle-wUGazXvM.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import { o as resolveWorkerPoolSize } from "./worker-pool-sizing-9MNT4hxr.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as captureRemoteModelCatalogSnapshot } from "./remote-overlay-ClWDV070.mjs";
import { n as createPluginSourceCaptureRoot } from "./plugin-source-capture-directory-uZgzXzIf.mjs";
import { c as getConfigResolutionFacts, m as serializeConfigResolutionFacts } from "./resolution-facts-D_pto3MV.mjs";
import { l as cloneAuthProfileStore } from "./oauth-shared-CiaJlx_D.mjs";
import { r as overlayPluginNativeAdmissions } from "./plugin-native-admission-state-COqSwm4O.mjs";
import { n as beginAuthProfileCredentialBatch } from "./user-model-account-authority-DFFjC5J5.mjs";
import { n as getPreparedSharedAuthStoreOwnership } from "./path-resolve-21Orzn6B.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-DAkjzBhe.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { u as setPreparedModelFullCatalogAuth } from "./prepared-model-runtime-auth-xGBK6WuU.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-DCd9wajc.mjs";
import { n as PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS } from "./model-catalog-timeouts-CWTmGWX-.mjs";
import { r as PreparedModelCatalogGenerationMismatchError, t as PreparedModelCatalogAdmissionStalledError } from "./prepared-model-catalog.errors-CJ00VAGC.mjs";
import { o as captureProviderSyntheticAuthFacts } from "./provider-runtime-DZ8luukj.mjs";
import { t as listManifestSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { r as markPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog-CcPwbyRw.mjs";
import { n as captureClawInstallSchemaVersionFacts } from "./provenance-runtime-read-CG_KY8mE.mjs";
import { t as resolveCodexClientVersion } from "./codex-client-version-runtime-CxWk1oMx.mjs";
import { r as getActiveSkillEnvKeysCore } from "./env-overrides-BfZsWBmC.mjs";
import { a as scopeSyntheticAuthProviderRefs, n as listRegistrySyntheticAuthProviderRefs, o as fingerprintPreparedRuntimeFacts } from "./prepared-model-runtime.synthetic-auth-DP743ZrF.mjs";
import { r as fingerprintPreparedModelWorkerRequest, t as fingerprintPreparedModelCatalogGeneration } from "./prepared-model-catalog-fingerprints-CRgbrGfC.mjs";
//#region src/agents/prepared-model-catalog-worker.pool.ts
/** Builds model-catalog worker pools that report their first close to the pool owner. */
const GATEWAY_CATALOG_WORKERS = resolveWorkerPoolSize("singleton");
const CATALOG_WORKER_HEAP_LIMITS = {
	maxOldGenerationSizeMb: 512,
	maxYoungGenerationSizeMb: 32
};
/**
* Without crash restart, the pool closes itself when its worker fails, exits or times out, even
* while no task is waiting. It reports its first close so the owner can tell that from its own.
*/
var CatalogWorkerTaskPool = class extends WorkerTaskPool {
	constructor(env, validateResult, assertCurrent, onClose) {
		super({
			workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.preparedModelCatalog),
			workerOptions: { resourceLimits: CATALOG_WORKER_HEAP_LIMITS },
			workerClass: "singleton",
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
const log = createSubsystemLogger("agents/prepared-model-runtime");
const gatewayCatalog = resolveGlobalSingleton(Symbol.for("openclaw.gatewayModelCatalogPool"), () => ({}));
function getPreparedModelCatalogWorkerPoolSnapshot() {
	return {
		...gatewayCatalog.current?.pool.getSnapshot() ?? {
			maxWorkers: GATEWAY_CATALOG_WORKERS,
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
	const pending = gatewayCatalog.rotating ?? gatewayCatalog.current?.recovery;
	if (pending) {
		await pending;
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
				const { recoverPreparedModelRuntimeCatalogWorker } = await import("./prepared-model-runtime-Dd6wQg9H.mjs");
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
function createPreparedModelCatalogWorkerInput(params) {
	const source = params.agentFacts.input;
	const env = { ...params.agentFacts.env };
	if (source.allowGatewaySubagentBinding === true && source.env === void 0) for (const key of getActiveSkillEnvKeysCore()) delete env[key];
	const input = {
		...source.agentId ? { agentId: source.agentId } : {},
		agentDir: source.agentDir,
		...source.inheritedAuthDir ? { inheritedAuthDir: source.inheritedAuthDir } : {},
		...source.workspaceDir ? { workspaceDir: source.workspaceDir } : {},
		...source.readOnly ? { readOnly: true } : {},
		env,
		...source.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		config: source.config
	};
	const sourceConfigForSecrets = projectConfigOntoRuntimeSourceSnapshot(source.config);
	const configResolutionFacts = serializeConfigResolutionFacts(source.config);
	const sourceConfigResolutionFacts = getConfigResolutionFacts(source.config) === getConfigResolutionFacts(sourceConfigForSecrets) ? configResolutionFacts : serializeConfigResolutionFacts(sourceConfigForSecrets);
	const { normalizePluginId: _normalizePluginId, ...pluginMetadataSnapshot } = params.pluginMetadataSnapshot;
	const cache = getPluginMetadataSnapshotCache(params.pluginMetadataSnapshot);
	const index = overlayPluginNativeAdmissions(pluginMetadataSnapshot.index, cache);
	const sharedAuthStoreOwnership = getPreparedSharedAuthStoreOwnership(params.agentFacts.env);
	const value = {
		remoteCatalog: captureRemoteModelCatalogSnapshot(),
		input,
		sourceConfigForSecrets,
		configResolutionFacts,
		sourceConfigResolutionFacts,
		authStore: cloneAuthProfileStore(params.agentFacts.authStore),
		...sharedAuthStoreOwnership ? { sharedAuthStoreOwnership: { ...sharedAuthStoreOwnership } } : {},
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
	let receiveResult = validate;
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
		let credentials;
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
			}, () => Promise.all([captureProviderSyntheticAuthFacts({
				config: input.config,
				env: input.env,
				workspaceDir: input.workspaceDir,
				providerRefs: command.kind === "catalog" && !command.providerIds ? [
					...manifestRefs,
					...listRegistrySyntheticAuthProviderRefs(params.pluginRegistry),
					...workerInput.providerIds
				] : [...providerScope, ...scopeSyntheticAuthProviderRefs(manifestRefs, providerScope)],
				signal: controller.signal
			}), command.kind === "catalog" && (!command.providerIds || command.providerIds.includes("openai")) ? resolveCodexClientVersion({
				config: input.config,
				env: input.env,
				agentDir: input.agentDir
			}) : void 0]));
			captures.set(controller, capture);
			let syntheticAuth;
			let codexClientVersion;
			try {
				[syntheticAuth, codexClientVersion] = await capture;
			} finally {
				captures.delete(controller);
			}
			controller.signal.throwIfAborted();
			const value = {
				...command,
				syntheticAuth,
				...codexClientVersion ? { codexClientVersion } : {}
			};
			const shared = gatewayOwned ? await getGatewayCatalogPool(workerInput, metadataSnapshot, environmentFingerprint) : void 0;
			if (shared) {
				sharedOwner = shared;
				shared.borrowers.add(borrower);
			}
			requestPool = pool = shared?.pool ?? pool ?? new CatalogWorkerTaskPool(workerInput.input.env, (result) => receiveResult(result));
			pending = requestPool.run(() => {
				assertCurrent();
				expire = () => {
					const failure = new PreparedModelCatalogAdmissionStalledError(progress?.pluginId, PREPARED_MODEL_CATALOG_WORKER_TIMEOUT_MS);
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
				const publication = beginAuthProfileCredentialBatch(captureOpenClawStateWorkerContext({ env: input.env }));
				credentials = publication;
				receiveResult = (result) => {
					publication.committed(result.authCredentials);
					publication.finish(true);
					credentials = void 0;
					receiveResult = validate;
					validate(result);
				};
				if (shared) shared.validate = receiveResult;
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
			credentials?.finish(false);
			task.onRecovery = void 0;
			if (pending) tasks.delete(pending);
			clearTimeout(timeout);
		}
		if (message.status === "failed") throw new Error(message.error);
		if (message.status === "generation-mismatch") throw mismatch(message);
		return message;
	};
	return {
		loadCatalog: async (providerIds, onRecovery, refresh) => {
			const message = await request({
				kind: "catalog",
				providerIds,
				refresh
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
export { createPreparedModelCatalogWorkerInput as n, getPreparedModelCatalogWorkerPoolSnapshot as r, createPreparedModelCatalogWorker as t };
