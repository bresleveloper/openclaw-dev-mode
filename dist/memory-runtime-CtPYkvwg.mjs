import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { c as runPluginCleanup, i as getPluginValueInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { n as withPluginHostCleanupTimeout } from "./host-hook-cleanup-timeout-CuGfY1se.mjs";
import { r as loadPluginRegistryHandle } from "./loader-Vq3hhSQk.mjs";
import { _ as resolveMemoryCapabilityRegistration, b as setStandaloneMemoryManagerActive, o as getMemoryRuntime } from "./memory-state-D4zZpGOe.mjs";
//#region src/plugins/memory-runtime.ts
const enrolledStandaloneMemoryRuntimes = /* @__PURE__ */ new WeakSet();
let standaloneMemoryRegistrySlot;
const registeredMemoryManagerAdapters = /* @__PURE__ */ new WeakMap();
function normalizeRegisteredMemoryReadResult(result) {
	if (result.status === "ok" || result.status === "not_found") return result;
	return {
		...result,
		status: "ok"
	};
}
function normalizeRegisteredMemoryManager(manager) {
	const existing = registeredMemoryManagerAdapters.get(manager);
	if (existing) return existing;
	const readFile = async (params) => normalizeRegisteredMemoryReadResult(await manager.readFile(params));
	const adapter = new Proxy({ readFile }, { get(_target, property) {
		if (property === "readFile") return readFile;
		const value = Reflect.get(manager, property, manager);
		if (typeof value !== "function") return value;
		return value.bind(manager);
	} });
	registeredMemoryManagerAdapters.set(manager, adapter);
	return adapter;
}
/** Resolves the configured memory slot to the single runtime plugin that may load memory. */
function resolveMemoryRuntimePluginIds(config) {
	const plugins = normalizePluginsConfig(config.plugins);
	const memorySlot = plugins.slots.memory;
	if (!plugins.enabled || typeof memorySlot !== "string" || memorySlot.trim().length === 0) return [];
	const pluginId = memorySlot.trim();
	if (plugins.deny.includes(pluginId) || plugins.entries[pluginId]?.enabled === false) return [];
	return [pluginId];
}
function resolveMemoryRuntimeWorkspaceDir(cfg, agentId) {
	const dir = resolveAgentWorkspaceDir(cfg, agentId);
	if (typeof dir !== "string" || !dir.trim()) return;
	return resolveUserPath(dir);
}
function listCurrentMemoryRuntimes() {
	const runtimes = new Set(standaloneMemoryRegistrySlot?.retiredRuntimes);
	const current = getMemoryRuntime();
	if (current) runtimes.add(current);
	if (standaloneMemoryRegistrySlot?.runtime) runtimes.add(standaloneMemoryRegistrySlot.runtime);
	return [...runtimes];
}
function ensureMemoryRuntime(params) {
	const current = getMemoryRuntime();
	if (current || !params) return current ? {
		runtime: current,
		searchRuntimeRegistered: true
	} : void 0;
	const onlyPluginIds = resolveMemoryRuntimePluginIds(params.cfg);
	if (onlyPluginIds.length === 0) return;
	const workspaceDir = resolveMemoryRuntimeWorkspaceDir(params.cfg, params.agentId);
	const registry = loadPluginRegistryHandle({
		config: params.cfg,
		onlyPluginIds,
		workspaceDir,
		activate: false
	});
	const runtime = resolveMemoryCapabilityRegistration(registry.memoryCapabilities)?.capability.runtime;
	const record = runtime ? void 0 : registry.plugins.find((entry) => entry.id === onlyPluginIds[0]);
	const owner = runtime ? {
		runtime,
		standalone: true,
		searchRuntimeRegistered: true
	} : record?.status === "error" ? { error: record.error ?? `Memory plugin "${record.id}" failed to load` } : record?.status === "loaded" && record.memorySlotSelected === true ? { searchRuntimeRegistered: false } : void 0;
	const previousSlot = standaloneMemoryRegistrySlot;
	if (previousSlot?.runtime === runtime) return owner;
	const retiredRuntimes = new Set(previousSlot?.retiredRuntimes);
	if (previousSlot?.runtime) retiredRuntimes.add(previousSlot.runtime);
	standaloneMemoryRegistrySlot = {
		runtime,
		retiredRuntimes
	};
	if (runtime && !enrolledStandaloneMemoryRuntimes.has(runtime)) {
		const lifecycle = getPluginValueInstance(runtime)?.lifecycle;
		if (lifecycle) {
			lifecycle.onDispose(() => {
				const slot = standaloneMemoryRegistrySlot;
				slot?.retiredRuntimes.delete(runtime);
				if (slot?.runtime === runtime) delete slot.runtime;
			});
			enrolledStandaloneMemoryRuntimes.add(runtime);
		}
	}
	return owner;
}
/** Returns the active plugin-backed memory search manager for an agent. */
async function getActiveMemorySearchManagerCore(params) {
	const owner = ensureMemoryRuntime(params);
	if (!owner?.runtime) return {
		manager: null,
		error: owner?.error ?? "memory plugin unavailable",
		searchRuntimeRegistered: owner?.searchRuntimeRegistered
	};
	if (owner.standalone) setStandaloneMemoryManagerActive(true);
	const result = await owner.runtime.getMemorySearchManager(params);
	return {
		...result,
		manager: result.manager ? normalizeRegisteredMemoryManager(result.manager) : null,
		searchRuntimeRegistered: true
	};
}
/** Applies the selected memory plugin's authorization policy to raw search hits. */
async function authorizeActiveMemorySearchHits(params) {
	const owner = ensureMemoryRuntime(params);
	if (!owner?.runtime) return params.hits.filter((hit) => hit.source !== "sessions");
	return owner.runtime.authorizeSearchHits ? await owner.runtime.authorizeSearchHits(params) : params.hits.filter((hit) => hit.source !== "sessions");
}
/** Classifies workspace memory paths through the selected memory plugin's provenance owner. */
async function classifyActiveMemoryWorkspacePaths(params) {
	const owner = ensureMemoryRuntime(params);
	if (!owner?.runtime) return { status: "unavailable" };
	if (!owner.runtime.classifyWorkspaceMemoryPaths || params.readSources !== void 0 && !owner.runtime.supportsWorkspaceMemoryReadSources) return { status: "unsupported" };
	return {
		status: "classified",
		classifications: await owner.runtime.classifyWorkspaceMemoryPaths(params)
	};
}
/** Resolves current memory backend config without constructing a manager. */
function resolveActiveMemoryBackendConfig(params) {
	const owner = ensureMemoryRuntime(params);
	return owner?.runtime ? owner.runtime.resolveMemoryBackendConfig(params) : null;
}
/** Closes all active plugin-backed memory search managers. */
async function closeActiveMemorySearchManagersCore(cfg) {
	await Promise.all(listCurrentMemoryRuntimes().map(async (runtime) => runPluginCleanup(runtime, () => runtime.closeAllMemorySearchManagers?.())));
	standaloneMemoryRegistrySlot?.retiredRuntimes.clear();
	setStandaloneMemoryManagerActive(false);
}
/** Closes the plugin-backed memory search manager for one agent. */
async function closeActiveMemorySearchManagerCore(params) {
	await Promise.all(listCurrentMemoryRuntimes().map(async (runtime) => runPluginCleanup(runtime, () => runtime.closeMemorySearchManager?.(params))));
}
function resetStandaloneMemoryRegistrySlot() {
	standaloneMemoryRegistrySlot = void 0;
	setStandaloneMemoryManagerActive(false);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.memoryRuntimeTestApi")] = { resetStandaloneMemoryRegistrySlot };
/** Prepare memory consumers before any changed plugin loses ordinary call admission. */
function prepareMemoryRuntimeReload(previousRegistry, nextRegistry) {
	const runtimes = (registry) => new Set(registry.memoryCapabilities.flatMap(({ capability }) => capability.runtime ? [capability.runtime] : []));
	const nextRuntimes = runtimes(nextRegistry);
	const nextAdapters = new Set(nextRegistry.embeddingProviders.map(({ provider }) => provider));
	const retiringEmbeddingProviders = previousRegistry.embeddingProviders.map(({ provider }) => provider).filter((provider) => !nextAdapters.has(provider));
	const prepared = [];
	let cleanup;
	const resume = (committed, retained = nextRegistry) => {
		const failures = [];
		const retainedRuntimes = runtimes(retained);
		for (const { runtime, handle } of prepared) if (!committed || retainedRuntimes.has(runtime)) try {
			runPluginCleanup(runtime, () => handle.resume());
		} catch (error) {
			failures.push(error);
		}
		if (failures.length) throw new AggregateError(failures, "Memory reload admission recovery failed");
	};
	try {
		for (const runtime of runtimes(previousRegistry)) {
			const retireRuntime = !nextRuntimes.has(runtime);
			if (!retireRuntime && retiringEmbeddingProviders.length === 0) continue;
			const handle = runPluginCleanup(runtime, () => {
				if (runtime.prepareReload) return runtime.prepareReload({
					retireRuntime,
					retiringEmbeddingProviders
				});
				if (runtime.closeAllMemorySearchManagers) return {
					drain: () => runtime.closeAllMemorySearchManagers(),
					resume() {}
				};
			});
			if (handle) prepared.push({
				runtime,
				handle
			});
		}
	} catch (error) {
		try {
			resume(false);
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "Memory reload preparation failed", { cause: cleanupError });
		}
		throw error;
	}
	const close = () => {
		if (!cleanup) cleanup = Promise.allSettled(prepared.map(({ runtime, handle }) => Promise.resolve().then(() => runPluginCleanup(runtime, async () => {
			try {
				return await handle.drain();
			} catch (error) {
				return { errors: [error] };
			}
		})))).then((results) => {
			const failures = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (failures.length) throw new AggregateError(failures, failures.map(formatErrorMessage).join("; "));
			return { errors: results.flatMap((result) => result.status === "fulfilled" ? result.value?.errors ?? [] : []) };
		});
		return cleanup;
	};
	return {
		drain: () => withPluginHostCleanupTimeout("memory managers", close),
		close,
		commit: (retained = nextRegistry) => resume(true, retained),
		rollback: () => resume(false)
	};
}
//#endregion
export { getActiveMemorySearchManagerCore as a, closeActiveMemorySearchManagersCore as i, classifyActiveMemoryWorkspacePaths as n, prepareMemoryRuntimeReload as o, closeActiveMemorySearchManagerCore as r, resolveActiveMemoryBackendConfig as s, authorizeActiveMemorySearchHits as t };
