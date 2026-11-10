import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as captureAsyncWorkTracker, r as getAsyncWorkSignal, s as trackAsyncWork, t as AsyncWorkScope } from "./async-work-scope-BH2yUdBz.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as createAbortError } from "./src-Bzfi3cQM.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { r as getProcessStartTime } from "./pid-alive-dd7OR8F6.mjs";
import { C as defaultSlotIdForKey, _ as resolveSelectedContextEnginePluginIdFromConfig, c as normalizePluginId, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CjTFYNkp.mjs";
import { d as runPluginCleanup, o as getPluginValueInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { l as getActivePluginRegistry, v as requireActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { n as parseNonNegativeByteSize } from "./byte-size-H0Vvh27E.mjs";
import { i as collectRegistryInvocationInstances, n as getPluginRegistryInspectionResources, r as PluginInvocationScope } from "./registry-inspection-resources-COvkPmap.mjs";
import { n as normalizeContextEngineQuarantineRecord, t as hasValidRuntimeHealthEnvelope } from "./runtime-health-records-BfEYoX08.mjs";
import { n as clearRuntimeHealthInWorker } from "./plugin-state-worker-client-S8ldxtrq.mjs";
import { t as createCorePluginStateKeyedStore } from "./plugin-state-store-DY4rDlss.mjs";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/context-engine/context-engine-abort.ts
function contextEngineAbortSignal(methodParams) {
	const signal = methodParams?.abortSignal;
	if (!signal || typeof signal !== "object" || !("aborted" in signal)) return;
	const abortSignal = signal;
	if (!abortSignal.aborted) return abortSignal;
	const reason = abortSignal.reason;
	throw reason instanceof Error ? reason : createAbortError(String(reason || "Context engine operation aborted."));
}
function isContextEngineAbortRejection(error, signal) {
	if (!signal?.aborted) return false;
	if (error === signal.reason || isAbortError(error)) return true;
	const seen = /* @__PURE__ */ new Set();
	for (let current = error; current instanceof Error && !seen.has(current); current = current.cause) {
		seen.add(current);
		if (current.cause === signal.reason) return true;
	}
	return false;
}
//#endregion
//#region src/context-engine/registry-adoption.ts
/**
* Scoped production handles stay in discovery mode so full-only plugins cannot
* mutate process-global backends. Runtime context engines are adopted from the
* composition-root registry instead of re-running `registrationMode: "full"`.
*/
function adoptRuntimeContextEngineRegistrations(targetRegistry, runtimeRegistry) {
	let adopted;
	for (const [id, runtime] of runtimeRegistry.contextEngines) {
		if (runtime.lifecycle !== "runtime") continue;
		const target = targetRegistry.contextEngines.get(id);
		if (target?.lifecycle === "runtime") continue;
		if (target && target.owner !== runtime.owner) continue;
		const pluginId = pluginIdFromContextEngineOwner(runtime.owner);
		if (!pluginId) continue;
		const targetPlugin = targetRegistry.plugins.find((plugin) => plugin.id === pluginId);
		const runtimePlugin = runtimeRegistry.plugins.find((plugin) => plugin.id === pluginId);
		if (targetPlugin?.status === "loaded" && runtimePlugin?.status === "loaded" && targetPlugin.source === runtimePlugin.source) (adopted ??= new Map(targetRegistry.contextEngines)).set(id, runtime);
	}
	if (!adopted) return targetRegistry;
	return {
		...targetRegistry,
		contextEngines: adopted
	};
}
function pluginIdFromContextEngineOwner(owner) {
	if (!owner.startsWith("plugin:")) return;
	return owner.slice(7).trim() || void 0;
}
//#endregion
//#region src/context-engine/registry-contract.ts
const CONTEXT_ENGINE_HOST_PARAMS = new Set("sessionKey prompt runtimeSettings sessionTarget runtimeContext abortSignal".split(" "));
function projectContextEngineHostParams(engine, methodName, params) {
	const accepted = engine.info.acceptedHostParams;
	if (!accepted) return params;
	return Object.fromEntries(Object.entries(params).filter(([key]) => accepted.includes(key) || !CONTEXT_ENGINE_HOST_PARAMS.has(key) || methodName === "compact" && key === "abortSignal"));
}
function describeResolvedContextEngineContractError(engineId, engine) {
	const candidate = asOptionalObjectRecord(engine);
	if (!candidate) return `Context engine "${engineId}" factory returned ${JSON.stringify(engine)} instead of a ContextEngine object.`;
	const issues = [];
	const info = asOptionalObjectRecord(candidate.info);
	if (!info) issues.push("missing info");
	else for (const field of ["id", "name"]) {
		const value = info[field];
		if (typeof value !== "string" || !value.trim()) issues.push(`missing info.${field}`);
	}
	for (const method of [
		"ingest",
		"assemble",
		"compact"
	]) if (typeof candidate[method] !== "function") issues.push(`missing ${method}()`);
	return issues.length === 0 ? null : `Context engine "${engineId}" factory returned an invalid ContextEngine: ${issues.join(", ")}.`;
}
//#endregion
//#region src/plugin-state/runtime-health-store.ts
const currentProcessToken = randomUUID();
/** Builds the common health envelope for records owned by this process. */
function createRuntimeHealthRecordEnvelope(failedAt) {
	return {
		processId: process.pid,
		processToken: currentProcessToken,
		processStartTime: getProcessStartTime(process.pid),
		failedAtMs: failedAt.getTime()
	};
}
function processLooksLive(record) {
	if (record.processId === process.pid) return record.processToken === currentProcessToken;
	const currentStartTime = getProcessStartTime(record.processId);
	return currentStartTime !== null && currentStartTime === record.processStartTime;
}
/** Opens a SQLite-backed health record namespace shared across runtime processes. */
function createRuntimeHealthStore(options) {
	const storeOptions = () => ({
		ownerId: options.ownerId,
		namespace: options.namespace,
		maxEntries: options.maxEntries,
		...options.ttlMs != null ? { defaultTtlMs: options.ttlMs } : {}
	});
	const normalize = (value) => hasValidRuntimeHealthEnvelope(value) ? options.normalizeRecord(value) : void 0;
	return {
		async register(key, record, assertCurrent) {
			await createCorePluginStateKeyedStore(storeOptions()).register(key, record, { assertCurrent });
		},
		async list() {
			try {
				const byGroup = /* @__PURE__ */ new Map();
				for (const entry of await createCorePluginStateKeyedStore(storeOptions()).entries()) {
					const record = normalize(entry.value);
					if (!record || !processLooksLive(record)) continue;
					const groupKey = options.displayKey(record);
					const existing = byGroup.get(groupKey);
					if (!existing || (options.pick === "latest" ? record.failedAtMs > existing.failedAtMs : record.failedAtMs < existing.failedAtMs)) byGroup.set(groupKey, record);
				}
				return [...byGroup.values()];
			} catch {
				return [];
			}
		},
		async clearForProcess(processId, selection, assertCurrent) {
			try {
				await clearRuntimeHealthInWorker({
					pluginId: options.ownerId,
					namespace: options.namespace,
					processId,
					selection: selection.kind === "tool-schema" ? {
						...selection,
						keys: [...selection.keys]
					} : { ...selection },
					assertCurrent
				});
				return true;
			} catch {
				return false;
			}
		}
	};
}
//#endregion
//#region src/context-engine/quarantine-health.ts
const quarantineStore = createRuntimeHealthStore({
	ownerId: "core:context-engine-quarantine-health",
	namespace: "runtime-quarantines",
	maxEntries: 64,
	normalizeRecord: normalizeContextEngineQuarantineRecord,
	displayKey: (record) => record.engineId,
	pick: "earliest"
});
async function recordPersistedContextEngineQuarantine(quarantine, assertCurrent) {
	const record = {
		engineId: quarantine.engineId,
		operation: quarantine.operation,
		reason: quarantine.reason,
		...createRuntimeHealthRecordEnvelope(quarantine.failedAt),
		...quarantine.owner ? { owner: quarantine.owner } : {}
	};
	await quarantineStore.register(JSON.stringify([record.engineId, record.processId]), record, assertCurrent);
}
async function listPersistedContextEngineQuarantines() {
	return (await quarantineStore.list()).map(({ engineId, operation, reason, owner, failedAtMs }) => {
		const quarantine = {
			engineId,
			operation,
			reason,
			failedAt: new Date(failedAtMs)
		};
		if (owner) quarantine.owner = owner;
		return quarantine;
	});
}
async function clearPersistedContextEngineQuarantineForProcess(engineId, processId, assertCurrent) {
	await quarantineStore.clearForProcess(processId, {
		kind: "context-engine",
		engineId
	}, assertCurrent);
}
//#endregion
//#region src/context-engine/registry-quarantine.ts
const contextEngineRegistryState = resolveGlobalSingleton(Symbol.for("openclaw.contextEngineRegistryState"), () => ({ quarantinedEngines: /* @__PURE__ */ new Map() }));
async function recordContextEngineQuarantine(params) {
	const existing = contextEngineRegistryState.quarantinedEngines.get(params.engineId);
	if (existing) return existing;
	const quarantine = {
		engineId: params.engineId,
		operation: params.operation,
		reason: params.error instanceof Error ? params.error.message : String(params.error),
		failedAt: /* @__PURE__ */ new Date(),
		...params.owner ? { owner: params.owner } : {}
	};
	contextEngineRegistryState.quarantinedEngines.set(params.engineId, quarantine);
	try {
		await recordPersistedContextEngineQuarantine(quarantine, () => {
			if (contextEngineRegistryState.quarantinedEngines.get(quarantine.engineId) !== quarantine) throw new Error("Context engine quarantine was cleared");
		});
	} catch {}
	const ownerSuffix = params.owner ? ` owner=${sanitizeForLog(params.owner)}` : "";
	console.error(`[context-engine] Context engine "${sanitizeForLog(params.engineId)}"${ownerSuffix} failed during ${sanitizeForLog(params.operation)}: ${sanitizeForLog(quarantine.reason)}; quarantining it for this process and falling back to default engine "${params.defaultEngineId}".`);
	return quarantine;
}
function getContextEngineQuarantine(engineId) {
	return contextEngineRegistryState.quarantinedEngines.get(engineId);
}
async function listContextEngineQuarantines() {
	const persisted = await listPersistedContextEngineQuarantines();
	const quarantines = Array.from(contextEngineRegistryState.quarantinedEngines.values(), ({ failedAt, ...quarantine }) => ({
		...quarantine,
		failedAt: new Date(failedAt)
	}));
	const seenEngineIds = new Set(quarantines.map((entry) => entry.engineId));
	return quarantines.concat(persisted.filter(({ engineId }) => !seenEngineIds.has(engineId)));
}
async function clearContextEngineRuntimeQuarantine(engineId, assertCurrent) {
	contextEngineRegistryState.quarantinedEngines.delete(engineId);
	await clearPersistedContextEngineQuarantineForProcess(engineId, process.pid, () => {
		assertCurrent();
		if (contextEngineRegistryState.quarantinedEngines.has(engineId)) throw new Error("Context engine quarantine changed during recovery");
	});
}
//#endregion
//#region src/context-engine/registry-selection.ts
/** Applies canonical plugin policy to a registered engine without changing its engine ID. */
function resolveEffectiveContextEngineId(config, entries) {
	const plugins = normalizePluginsConfig(config?.plugins);
	const engineId = plugins.slots.contextEngine;
	const defaultEngineId = defaultSlotIdForKey("contextEngine");
	if (!engineId || engineId === defaultEngineId) return defaultEngineId;
	const entry = entries.get(engineId);
	const pluginId = (entry && pluginIdFromContextEngineOwner(entry.owner)) ?? engineId;
	return resolveSelectedContextEnginePluginIdFromConfig(plugins, normalizePluginId(pluginId)) ? engineId : defaultEngineId;
}
//#endregion
//#region src/context-engine/registry.resources.ts
const registrationSources = resolveGlobalSingleton(Symbol.for("openclaw.contextEngineRegistrationSources"), () => /* @__PURE__ */ new WeakMap());
function recordContextEngineRegistrationSource(registration, registry) {
	const resources = getPluginRegistryInspectionResources(registry);
	if (resources) registrationSources.set(registration, resources);
}
var ContextEngineFactoryResources = class {
	constructor(claims, invocations) {
		this.claims = claims;
		this.invocations = invocations;
		this.work = new AsyncWorkScope();
		this.context = this.work.run(() => AsyncLocalStorage.snapshot());
		this.cleanupWork = new AsyncWorkScope();
		this.cleanupContext = this.cleanupWork.run(() => AsyncLocalStorage.snapshot());
		this.parentSignal = getAsyncWorkSignal();
		this.abort = () => {
			this.context(() => this.work.beginClose(this.parentSignal?.reason));
			this.cleanupContext(() => this.cleanupWork.beginClose(this.parentSignal?.reason));
		};
		this.parentSignal?.addEventListener("abort", this.abort, { once: true });
		if (this.parentSignal?.aborted) this.abort();
	}
	run(operation) {
		return this.work.track(() => this.context(() => this.invocations ? this.invocations.run(operation) : operation()));
	}
	runCleanup(operation) {
		this.beginCleanup();
		try {
			return this.cleanupWork.run(() => this.cleanupContext(() => this.cleanupInvocations ? this.cleanupInvocations.scope.run(operation) : operation()));
		} finally {
			this.context(() => this.work.beginClose());
		}
	}
	beginCleanup() {
		this.cleanupInvocations ??= this.invocations?.beginCleanup();
	}
	wrap(value) {
		return this.invocations ? this.invocations.wrap(value) : value;
	}
	async release() {
		this.parentSignal?.removeEventListener("abort", this.abort);
		this.invocations?.release();
		let failure;
		try {
			await this.cleanupInvocations?.release();
		} catch (error) {
			failure = { error };
		}
		for (const claim of this.claims) try {
			await claim.release();
		} catch (error) {
			failure ??= { error };
		}
		if (failure) throw failure.error;
	}
};
function retainContextEngineFactorySource(registry, registration, primary, abandon) {
	const claims = [];
	try {
		if (primary) claims.push(primary.retain());
		const source = registration && registrationSources.get(registration);
		if (source && !primary?.coversSource(source)) claims.push(source.retain());
		const instances = collectRegistryInvocationInstances(registry);
		if (claims.length === 0 && instances.size === 0) return;
		return new ContextEngineFactoryResources(claims, primary ? primary.createInvocationScope(registry) : new PluginInvocationScope(registry, instances, { retained: registration !== void 0 && getPluginValueInstance(registration.factory) !== void 0 }));
	} catch (error) {
		if (claims.length > 0) abandon(new ContextEngineFactoryResources(claims));
		throw error;
	}
}
/** One instance may come from both factories; every source stays held through shared cleanup. */
async function disposeContextEngineSources(engine, sources, dispose = () => engine?.dispose?.()) {
	if (sources.length === 0) {
		await dispose();
		return;
	}
	for (const source of sources) source.beginCleanup();
	const cleanup = sources[0].cleanupWork.track(() => sources[0].runCleanup(dispose));
	for (const source of sources) source.context(() => source.work.beginClose());
	const [engineResult] = await Promise.allSettled([cleanup]);
	const scopes = sources.flatMap((source) => [source.work, source.cleanupWork]);
	await AsyncWorkScope.runWhenAllIdle(() => scopes, () => {
		for (const source of sources) source.cleanupContext(() => source.cleanupWork.beginClose());
	});
	await AsyncWorkScope.runWhenAllIdle(() => scopes, () => Promise.all(sources.flatMap((source) => [source.context(() => source.work.drain()), source.cleanupContext(() => source.cleanupWork.drain())])));
	const released = await Promise.allSettled(sources.map((source) => source.release()));
	if (engineResult.status === "rejected") throw engineResult.reason;
	for (const result of released) if (result.status === "rejected") throw result.reason;
}
/** Report selection separately while its admitted owner joins failed-factory cleanup. */
async function runContextEngineFactoryResolution(resolve, onCleanupFailure) {
	const reportCleanupFailure = onCleanupFailure ? AsyncLocalStorage.bind(onCleanupFailure) : void 0;
	const result = createDeferredCore();
	const failedSources = [];
	const abandon = (source) => {
		if (source) failedSources.push(disposeContextEngineSources(void 0, [source]).catch((error) => {
			reportCleanupFailure?.();
			console.warn(`[context-engine] Failed factory resource cleanup: ${sanitizeForLog(String(error))}`);
		}));
	};
	captureAsyncWorkTracker()(async () => {
		try {
			result.resolve(await resolve(abandon));
		} catch (error) {
			result.reject(error);
		} finally {
			await Promise.all(failedSources);
		}
	}).catch(result.reject);
	return await result.promise;
}
function retainLogicalTurnContextEngineSources(registry, fallback, configured, abandon) {
	const primary = getPluginRegistryInspectionResources(registry);
	const fallbackSource = retainContextEngineFactorySource(registry, fallback, primary, abandon);
	try {
		return {
			fallback: fallbackSource,
			configured: configured?.lifecycle === "runtime" ? retainContextEngineFactorySource(registry, configured, primary, abandon) : void 0
		};
	} catch (error) {
		return {
			fallback: fallbackSource,
			configuredFailure: { error }
		};
	}
}
async function resolveContextEngineFactory(source, owners, create) {
	const ref = await (source ? source.run(create) : create());
	if (source) {
		const retained = owners.get(ref.engine) ?? [];
		retained.push(source);
		owners.set(ref.engine, retained);
	}
	return ref;
}
/** Foreground engine resolution shares the same factory execution and physical resource owner. */
async function createContextEngineWithResources(registry, registration, create, preparation) {
	const completion = preparation?.completion;
	const assertCurrent = preparation?.assertCurrent;
	return await runContextEngineFactoryResolution(async (abandon) => {
		let source;
		try {
			source = retainContextEngineFactorySource(registry, registration, getPluginRegistryInspectionResources(registry), abandon);
			if (completion) {
				await completion;
				assertCurrent?.();
			}
			return await (source ? source.run(() => create(source)) : create(void 0));
		} catch (error) {
			abandon(source);
			throw error;
		} finally {
			await completion;
		}
	});
}
//#endregion
//#region src/context-engine/transcript-byte-limit.ts
function resolveMaxActiveTranscriptBytes(cfg) {
	const parsed = parseNonNegativeByteSize(cfg?.agents?.defaults?.compaction?.maxActiveTranscriptBytes);
	return typeof parsed === "number" && parsed > 0 ? parsed : void 0;
}
/** A failed/no-progress byte attempt rearms only after another threshold of growth. */
function refreshTranscriptByteCompactionLatch(latch, sessionId, maxBytes, activeBytes) {
	if (!latch || maxBytes === void 0 || latch.sessionId !== sessionId || latch.maxBytes !== maxBytes) return;
	if (activeBytes === void 0) return latch;
	if (activeBytes < maxBytes || activeBytes - latch.activeBytes >= maxBytes) return;
	return activeBytes < latch.activeBytes ? {
		...latch,
		activeBytes
	} : latch;
}
//#endregion
//#region src/context-engine/registry.ts
const GUARDED_CONTEXT_ENGINE_METHODS = new Set("bootstrap maintain ingest ingestBatch afterTurn commitTurn assemble compact prepareSubagentSpawn onSubagentEnded".split(" "));
const resolvedEngineMetadata = resolveGlobalSingleton(Symbol.for("openclaw.contextEngine.resolvedMetadata"), () => /* @__PURE__ */ new WeakMap());
function wrapResolvedContextEngine(rawEngine, metadata) {
	let disposal;
	const source = metadata.source;
	const engine = source?.wrap(rawEngine) ?? rawEngine;
	const fallback = metadata.defaultEngineId && metadata.engineId !== metadata.defaultEngineId ? {
		defaultEngineId: metadata.defaultEngineId,
		factoryCtx: metadata.factoryCtx
	} : void 0;
	let fallbackEnginePromise;
	let resolvedFallbackEngine;
	const getFallbackEngine = fallback ? async (beforeFactory) => {
		if (disposal) throw new Error("Context engine has been disposed");
		if (beforeFactory && fallbackEnginePromise) {
			await beforeFactory;
			if (disposal) throw new Error("Context engine has been disposed");
		}
		const resolve = () => resolveDefaultContextEngine(fallback.defaultEngineId, fallback.factoryCtx, beforeFactory ? { completion: beforeFactory } : void 0);
		return await (fallbackEnginePromise ??= (source ? source.run(resolve) : resolve()).then((resolved) => {
			resolvedFallbackEngine = resolved;
			return resolved;
		}));
	} : void 0;
	const disposeOwned = () => {
		if (disposal) return disposal;
		const completion = createDeferredCore();
		disposal = completion.promise;
		(async () => {
			const fallbackResult = fallbackEnginePromise && !resolvedFallbackEngine ? (await Promise.allSettled([fallbackEnginePromise]))[0] : {
				status: "fulfilled",
				value: resolvedFallbackEngine
			};
			const fallbackEngine = fallbackResult.status === "fulfilled" ? fallbackResult.value : void 0;
			const sources = metadata.ownsSource && source ? [source] : [];
			const shared = fallbackEngine && hasSameContextEngineInstance(wrapped, fallbackEngine);
			const fallbackSource = fallbackEngine && resolvedEngineMetadata.get(fallbackEngine)?.source;
			if (shared && fallbackSource) sources.push(fallbackSource);
			const fallbackCleanup = (async () => {
				if (!shared) await fallbackEngine?.dispose?.();
			})();
			const results = await Promise.allSettled([(async () => {
				if (source && !metadata.ownsSource) await source.runCleanup(() => rawEngine.dispose?.());
				else await disposeContextEngineSources(rawEngine, sources, () => source ? rawEngine.dispose?.() : runPluginCleanup(metadata.factory, () => rawEngine.dispose?.()));
			})(), fallbackCleanup]);
			for (const result of [...results, fallbackResult]) if (result.status === "rejected") throw result.reason;
		})().then(completion.resolve, completion.reject);
		return disposal;
	};
	const wrapped = new Proxy(Object.create(engine, { info: { get: () => engine.info } }), { get(_target, property) {
		if (property === "dispose" && (source || fallback)) return disposeOwned;
		if (property === "info") {
			if (!fallback || !getContextEngineQuarantine(metadata.engineId)) return engine.info;
			return resolvedFallbackEngine?.info ?? {
				id: fallback.defaultEngineId,
				name: fallback.defaultEngineId === "legacy" ? "Legacy Context Engine" : `${fallback.defaultEngineId} Context Engine`
			};
		}
		const invokeMember = (run) => property === "dispose" ? runPluginCleanup(metadata.factory, run) : run();
		const method = invokeMember(() => Reflect.get(engine, property, engine));
		if (typeof method !== "function") return method;
		if (!GUARDED_CONTEXT_ENGINE_METHODS.has(property)) return (...args) => invokeMember(() => Reflect.apply(method, engine, args));
		const methodName = property;
		if (!fallback || !getFallbackEngine) return (params) => method.call(engine, projectContextEngineHostParams(engine, methodName, params));
		const invokeFallback = async (methodParams, beforeFactory) => {
			contextEngineAbortSignal(methodParams);
			const fallbackEngine = await getFallbackEngine(beforeFactory);
			const fallbackMethod = fallbackEngine[methodName];
			if (typeof fallbackMethod === "function") return await fallbackMethod.call(fallbackEngine, methodParams);
			if (methodName === "assemble" || methodName === "compact") throw new Error(`No legacy fallback result for ${methodName}`);
			const result = CONTEXT_ENGINE_FALLBACK_RESULTS[methodName];
			return result ? { ...result } : void 0;
		};
		if (getContextEngineQuarantine(metadata.engineId)) return invokeFallback;
		return async (methodParams) => {
			const abortSignal = contextEngineAbortSignal(methodParams);
			if (getContextEngineQuarantine(metadata.engineId)) return await invokeFallback(methodParams);
			try {
				return await method.call(engine, projectContextEngineHostParams(engine, methodName, methodParams));
			} catch (error) {
				if (isContextEngineAbortRejection(error, abortSignal)) throw error;
				const recording = recordContextEngineQuarantine({
					engineId: metadata.engineId,
					owner: metadata.owner,
					operation: methodName,
					error,
					defaultEngineId: fallback.defaultEngineId
				});
				if (methodName === "compact" || methodName === "prepareSubagentSpawn") {
					await recording;
					throw error;
				}
				try {
					return await invokeFallback(methodParams, recording);
				} catch {
					throw error;
				} finally {
					await recording;
				}
			}
		};
	} });
	resolvedEngineMetadata.set(wrapped, {
		...metadata,
		maxActiveTranscriptBytes: resolveMaxActiveTranscriptBytes(metadata.factoryCtx.config),
		sourceEngine: resolvedEngineMetadata.get(rawEngine)?.sourceEngine ?? rawEngine
	});
	return wrapped;
}
const CORE_CONTEXT_ENGINE_OWNER = "core";
const getContextEngines = () => requireActivePluginRegistry().contextEngines;
/**
* Register a context engine implementation under an explicit trusted owner.
*/
async function registerContextEngineForOwner(id, factory, owner, opts) {
	const targetRegistry = requireActivePluginRegistry();
	const result = registerContextEngineInRegistry(targetRegistry, id, factory, owner, opts);
	if (result.ok && (opts?.lifecycle ?? "runtime") === "runtime" && getActivePluginRegistry() === targetRegistry) {
		const assertCurrent = () => {
			if (getActivePluginRegistry() !== targetRegistry) throw new Error("Context engine registration was superseded");
		};
		await clearContextEngineRuntimeQuarantine(id, assertCurrent);
	}
	return result;
}
/** Registers an engine in a registry value while that value is being assembled. */
function registerContextEngineInRegistry(pluginRegistry, id, factory, owner, opts) {
	const normalizedOwner = owner.trim();
	if (!normalizedOwner) throw new Error(`registerContextEngineForOwner: owner must be a non-empty string, got ${JSON.stringify(owner)}`);
	const lifecycle = opts?.lifecycle ?? "runtime";
	const registry = pluginRegistry.contextEngines;
	const existing = registry.get(id);
	if (id === defaultSlotIdForKey("contextEngine") && normalizedOwner !== CORE_CONTEXT_ENGINE_OWNER) return {
		ok: false,
		existingOwner: CORE_CONTEXT_ENGINE_OWNER
	};
	if (existing && existing.owner !== normalizedOwner) return {
		ok: false,
		existingOwner: existing.owner
	};
	if (existing?.lifecycle === "runtime" && lifecycle === "readOnlyDiscovery") return { ok: true };
	if (existing && opts?.allowSameOwnerRefresh !== true) return {
		ok: false,
		existingOwner: existing.owner
	};
	const registration = {
		factory,
		owner: normalizedOwner,
		lifecycle
	};
	recordContextEngineRegistrationSource(registration, pluginRegistry);
	registry.set(id, registration);
	return { ok: true };
}
/** Clear runtime quarantine only after a complete builder-local registry becomes active. */
function activateContextEngineRegistrations(pluginRegistry, activation) {
	const authority = activation ? void 0 : capturePluginLifecycleAuthority(pluginRegistry);
	const cleanup = [];
	for (const [id, registration] of pluginRegistry.contextEngines) if (registration.lifecycle === "runtime") {
		const completion = trackAsyncWork(() => clearContextEngineRuntimeQuarantine(id, () => {
			if (activation) activation.assertCurrent();
			else if (!authority?.()) throw new Error("Context engine activation was superseded");
			if (pluginRegistry.contextEngines.get(id) !== registration) throw new Error("Context engine registration changed during activation cleanup");
		}));
		cleanup.push(completion);
		activation?.trackCleanup(completion);
	}
	return Promise.allSettled(cleanup).then(() => {});
}
/** Returns registration metadata so callers can distinguish discovery snapshots from runtime entries. */
function getContextEngineRegistration(id) {
	return getContextEngines().get(id);
}
const listContextEngineIds = () => [...getContextEngines().keys()].toSorted();
/**
* Return the trusted plugin id that registered a resolved context engine.
* Downgraded engines intentionally report no plugin owner.
*/
function resolveContextEngineOwnerPluginId(engine) {
	const metadata = engine ? resolvedEngineMetadata.get(engine) : void 0;
	const owner = metadata && !getContextEngineQuarantine(metadata.engineId) ? metadata.owner : void 0;
	return owner ? pluginIdFromContextEngineOwner(owner) : void 0;
}
const hasSameContextEngineInstance = (left, right) => (resolvedEngineMetadata.get(left)?.sourceEngine ?? left) === (resolvedEngineMetadata.get(right)?.sourceEngine ?? right);
const resolveContextEngineTranscriptByteLimit = (engine) => engine ? resolvedEngineMetadata.get(engine)?.maxActiveTranscriptBytes : void 0;
const CONTEXT_ENGINE_FALLBACK_RESULTS = {
	bootstrap: {
		bootstrapped: false,
		reason: "context engine downgraded to legacy"
	},
	maintain: {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "context engine downgraded to legacy"
	},
	ingest: { ingested: false },
	ingestBatch: { ingestedCount: 0 }
};
async function createOwnedContextEngine(engineId, entry, factoryCtx, options = {}) {
	let engine;
	try {
		engine = await entry.factory(factoryCtx);
		options.onValidation?.();
		const contractError = describeResolvedContextEngineContractError(engineId, engine);
		if (contractError) throw new Error(`${options.contractErrorPrefix ?? ""}${contractError}`);
		return wrapResolvedContextEngine(engine, {
			source: options.source,
			ownsSource: options.ownsSource,
			engineId,
			owner: entry.owner,
			factory: entry.factory,
			defaultEngineId: options.defaultEngineId,
			factoryCtx
		});
	} catch (error) {
		const dispose = () => engine?.dispose?.();
		await Promise.resolve().then(() => options.source ? options.source.runCleanup(dispose) : runPluginCleanup(entry.factory, dispose)).catch(() => void 0);
		throw error;
	}
}
async function resolveRawContextEngineRef(engineId, factoryCtx, entry, source) {
	if (!entry) throw new Error(`Context engine "${engineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
	const engine = await createOwnedContextEngine(engineId, entry, factoryCtx, { source });
	const pluginId = pluginIdFromContextEngineOwner(entry.owner);
	return Object.freeze({
		engine,
		registeredId: engineId,
		...pluginId ? { ownerPluginId: pluginId } : {}
	});
}
/**
* Resolve fresh engines for one logical turn without consulting or mutating
* process quarantine. A failed configured engine is retried by the next turn.
*/
async function resolveLogicalTurnContextEngines(config, options) {
	const initialization = options?.initialize?.();
	try {
		return await runContextEngineFactoryResolution(async (abandon) => {
			const defaultEngineId = defaultSlotIdForKey("contextEngine");
			const configuredEngineId = resolveEffectiveContextEngineId(config, getContextEngines());
			const factoryCtx = {
				config,
				agentDir: options?.agentDir,
				workspaceDir: options?.workspaceDir
			};
			const registry = requireActivePluginRegistry();
			const entries = registry.contextEngines;
			const fallbackEntry = entries.get(defaultEngineId);
			const configuredEntry = entries.get(configuredEngineId);
			const sources = retainLogicalTurnContextEngineSources(registry, fallbackEntry, configuredEngineId === defaultEngineId ? void 0 : configuredEntry, abandon);
			const sourceResources = /* @__PURE__ */ new Map();
			let fallback;
			try {
				if (initialization) {
					await initialization;
					getAsyncWorkSignal()?.throwIfAborted();
				}
				if (configuredEngineId !== defaultEngineId && options?.beforeCustomEngine) {
					await options.beforeCustomEngine();
					getAsyncWorkSignal()?.throwIfAborted();
				}
				fallback = await resolveContextEngineFactory(sources.fallback, sourceResources, () => resolveRawContextEngineRef(defaultEngineId, factoryCtx, fallbackEntry, sources.fallback));
			} catch (error) {
				abandon(sources.fallback);
				abandon(sources.configured);
				throw error;
			}
			const resolution = {
				configured: fallback,
				configuredId: configuredEngineId,
				fallback,
				sourceResources
			};
			if (configuredEngineId === defaultEngineId) return resolution;
			if (!configuredEntry || configuredEntry.lifecycle === "readOnlyDiscovery") {
				resolution.configuredFailure = !configuredEntry ? `context engine "${configuredEngineId}" is not registered` : `context engine "${configuredEngineId}" is available for discovery only`;
				return resolution;
			}
			try {
				if (sources.configuredFailure) throw sources.configuredFailure.error;
				resolution.configured = await resolveContextEngineFactory(sources.configured, sourceResources, () => resolveRawContextEngineRef(configuredEngineId, factoryCtx, configuredEntry, sources.configured));
			} catch (error) {
				abandon(sources.configured);
				resolution.configuredFailure = error instanceof Error ? error.message : String(error);
			}
			return resolution;
		}, options?.onCleanupFailure);
	} finally {
		await initialization;
	}
}
/**
* Resolve which ContextEngine to use based on plugin slot configuration.
*
* Resolution order:
*   1. `config.plugins.slots.contextEngine` when its plugin policy permits it
*   2. Default slot value ("legacy")
*
* Non-default engines that fail (unregistered, factory throw, or contract
* violation) are logged and silently replaced by the default engine.
* Host admission/resource failures and owner cancellation propagate without quarantine.
* Default-engine failures also propagate.
*/
async function resolveContextEngine(config, options) {
	const abortSignal = getAsyncWorkSignal();
	const initialization = options?.initialize?.();
	const preparation = initialization ? {
		completion: initialization,
		assertCurrent: () => abortSignal?.throwIfAborted()
	} : void 0;
	try {
		const defaultEngineId = defaultSlotIdForKey("contextEngine");
		const engineId = resolveEffectiveContextEngineId(config, getContextEngines());
		const isDefaultEngine = engineId === defaultEngineId;
		const factoryCtx = {
			config,
			agentDir: options?.agentDir,
			workspaceDir: options?.workspaceDir
		};
		if (!isDefaultEngine ? getContextEngineQuarantine(engineId) : void 0) return await resolveDefaultContextEngine(defaultEngineId, factoryCtx, preparation);
		const entry = getContextEngines().get(engineId);
		if (!entry) {
			if (isDefaultEngine) throw new Error(`Context engine "${engineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
			const record = () => recordContextEngineQuarantine({
				engineId,
				operation: "resolve",
				error: "not registered",
				defaultEngineId
			});
			return await resolveDefaultContextEngine(defaultEngineId, factoryCtx, {
				completion: initialization ? initialization.then(record) : record(),
				assertCurrent: () => abortSignal?.throwIfAborted()
			});
		}
		if (!isDefaultEngine && entry.lifecycle === "readOnlyDiscovery") {
			console.warn(`[context-engine] Context engine "${engineId}" owner=${entry.owner} is registered for read-only discovery only; falling back to default engine "${defaultEngineId}" without quarantine until runtime activation registers it.`);
			return await resolveDefaultContextEngine(defaultEngineId, factoryCtx, preparation);
		}
		let operation;
		try {
			return await createContextEngineWithResources(requireActivePluginRegistry(), entry, (source) => {
				operation = "factory";
				return createOwnedContextEngine(engineId, entry, factoryCtx, {
					source,
					ownsSource: true,
					defaultEngineId,
					onValidation: () => {
						operation = "contract-validation";
					}
				});
			}, preparation);
		} catch (error) {
			if (isDefaultEngine || !operation || isContextEngineAbortRejection(error, abortSignal)) throw error;
			return await resolveDefaultContextEngine(defaultEngineId, factoryCtx, { completion: recordContextEngineQuarantine({
				engineId,
				owner: entry.owner,
				operation,
				error,
				defaultEngineId
			}) });
		}
	} finally {
		await initialization;
	}
}
/** Default-engine failures propagate; they cannot select another fallback. */
async function resolveDefaultContextEngine(defaultEngineId, factoryCtx, preparation) {
	try {
		const defaultEntry = getContextEngines().get(defaultEngineId);
		if (!defaultEntry) throw new Error(`[context-engine] fallback failed: default engine "${defaultEngineId}" is not registered. Available engines: ${listContextEngineIds().join(", ") || "(none)"}`);
		return await createContextEngineWithResources(requireActivePluginRegistry(), defaultEntry, (source) => createOwnedContextEngine(defaultEngineId, defaultEntry, factoryCtx, {
			source,
			ownsSource: true,
			contractErrorPrefix: "[context-engine] "
		}), preparation);
	} finally {
		await preparation?.completion;
	}
}
//#endregion
export { adoptRuntimeContextEngineRegistrations as _, registerContextEngineInRegistry as a, resolveContextEngineTranscriptByteLimit as c, resolveMaxActiveTranscriptBytes as d, disposeContextEngineSources as f, CONTEXT_ENGINE_HOST_PARAMS as g, createRuntimeHealthStore as h, registerContextEngineForOwner as i, resolveLogicalTurnContextEngines as l, createRuntimeHealthRecordEnvelope as m, getContextEngineRegistration as n, resolveContextEngine as o, listContextEngineQuarantines as p, hasSameContextEngineInstance as r, resolveContextEngineOwnerPluginId as s, activateContextEngineRegistrations as t, refreshTranscriptByteCompactionLatch as u, isContextEngineAbortRejection as v };
