import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { d as runPluginCleanup, o as getPluginValueInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
import { $ as withPluginHostCleanupTimeout } from "./runtime-DfYPSUKC.mjs";
import { a as runPluginCleanupScope } from "./registry-inspection-resources-sGFtXeo5.mjs";
import { n as loadPluginRegistryHandle } from "./loader-D4eOiGg6.mjs";
import { C as setStandaloneMemoryOwner, S as setStandaloneMemoryManagerActive, a as getMemoryCapabilityRegistration, o as getMemoryProviderRuntime, s as getMemoryRuntime, y as resolveMemoryCapabilityRegistration } from "./memory-state-Cx8Kzhx0.mjs";
import { a as stripMemoryAnnotationCarriers } from "./curated-annotations-DM9mz8Th.mjs";
import { n as isAutomaticMemoryEntryEligible } from "./types-DTVBdCzw.mjs";
import { a as isHostMemoryAudience, r as assertMemoryCallerCurrent } from "./memory-audience-1w812bVn.mjs";
//#region src/plugins/memory-provider-adapter.ts
/** Recheck both caller and provider lifetime after every asynchronous boundary. */
function bindMemoryProvider(provider, providerId, context, runtimeOwner) {
	let closed = false;
	const instance = getPluginValueInstance(provider) ?? (runtimeOwner ? getPluginValueInstance(runtimeOwner) : void 0);
	const assertCurrent = () => {
		if (closed) throw new Error("memory provider handle is closed");
		assertMemoryCallerCurrent(context);
		if (instance && (!instance.acceptingCalls || instance.owner?.revoked || instance.lifecycle.signal.aborted)) throw new Error("memory provider instance is no longer current");
	};
	const invoke = async (run) => {
		assertCurrent();
		const result = await run();
		assertCurrent();
		return result;
	};
	const assertReference = (reference) => {
		if (reference.providerId !== providerId) throw new Error("memory reference belongs to a different provider");
	};
	const assertCitations = (citations) => {
		for (const citation of citations ?? []) if (citation.reference) assertReference(citation.reference);
	};
	const validatePage = (page) => {
		for (const hit of page.hits) {
			assertReference(hit.reference);
			assertCitations(hit.citations);
		}
		return page;
	};
	const capabilities = Object.freeze({
		...provider.capabilities,
		sources: Object.freeze([...provider.capabilities.sources]),
		candidates: Object.freeze([...provider.capabilities.candidates])
	});
	const assertSearchCapabilities = (request) => {
		const unsupportedSource = request.sources?.find((source) => !capabilities.sources.includes(source));
		if (unsupportedSource) throw new Error(`memory provider does not support the ${unsupportedSource} source capability`);
		if (request.cursor !== void 0 && !capabilities.pagination) throw new Error("memory provider does not support the pagination capability");
		if (request.activeProjectKeys?.length && !capabilities.projectFilter) throw new Error("memory provider does not support the project filter capability");
	};
	return {
		capabilities,
		search: (request) => invoke(async () => {
			assertSearchCapabilities(request);
			return validatePage(await provider.search(request));
		}),
		get: (request) => invoke(async () => {
			assertReference(request.reference);
			const result = await provider.get(request);
			if (result.status === "ok") {
				assertReference(result.reference);
				assertCitations(result.citations);
			}
			return result;
		}),
		health: () => invoke(() => provider.health()),
		...provider.candidates ? { candidates: (request) => {
			return invoke(async () => {
				if (!capabilities.candidates.includes(request.kind)) throw new Error(`memory provider does not support the ${request.kind} candidates capability`);
				if (request.activeProjectKeys?.length && !capabilities.projectFilter) throw new Error("memory provider does not support the project filter capability");
				return validatePage(await provider.candidates(request));
			});
		} } : {},
		...provider.refresh ? { refresh: () => invoke(() => provider.refresh()) } : {},
		async close() {
			if (closed) return;
			closed = true;
			await runPluginCleanup(provider, () => provider.close());
		}
	};
}
function redactLegacyHealthDetails(status) {
	const { workspaceDir: _workspaceDir, dbPath: _dbPath, extraPaths: _extraPaths, ...rest } = status;
	if (!rest.vector) return rest;
	const { extensionPath: _extensionPath, ...vector } = rest.vector;
	return {
		...rest,
		vector
	};
}
/** Translate the legacy contract without mutating managers or changing their receiver. */
async function adaptLegacyMemoryProvider(runtime, providerId, params) {
	const result = await runtime.getMemorySearchManager({
		cfg: params.cfg,
		agentId: params.agentId,
		purpose: params.purpose
	});
	const manager = result.manager;
	if (!manager) return {
		provider: null,
		error: result.error
	};
	const { context } = params;
	const session = context.authority.kind === "session" ? context.authority : void 0;
	const assertCurrent = () => {
		context.assertCurrent();
		context.signal?.throwIfAborted();
	};
	const authorize = async (hits) => {
		assertCurrent();
		const authorized = runtime.authorizeSearchHits ? await runtime.authorizeSearchHits({
			cfg: params.cfg,
			agentId: params.agentId,
			requesterSessionKey: session?.sessionKey,
			sandboxed: session?.sandboxed ?? false,
			trustedAgentScope: !session,
			conversationRecall: session?.conversationRecall,
			hits
		}) : hits.filter((hit) => hit.source !== "sessions");
		assertCurrent();
		return authorized;
	};
	const convert = (hit) => {
		const reference = {
			providerId,
			id: hit.path,
			fragment: `L${hit.startLine}-L${hit.endLine}`
		};
		const projectKeys = hit.projectKey?.split(";").map((key) => key.trim()).filter(Boolean);
		return {
			reference,
			excerpt: stripMemoryAnnotationCarriers(hit.snippet),
			score: hit.score,
			source: hit.source,
			citations: [{
				label: hit.citation ?? `${hit.path}#L${hit.startLine}-L${hit.endLine}`,
				reference,
				startLine: hit.startLine,
				endLine: hit.endLine
			}],
			automaticRecall: {
				eligible: hit.source === "memory" && isAutomaticMemoryEntryEligible(hit) && projectKeys?.length !== 0,
				projectKeys,
				triggers: hit.triggers,
				importance: hit.importance
			}
		};
	};
	return { provider: {
		capabilities: {
			sources: ["memory", "sessions"],
			pagination: false,
			candidates: [],
			projectFilter: true
		},
		async search(request) {
			if (request.cursor !== void 0) throw new Error("legacy memory search does not support cursors");
			if (typeof manager.search !== "function") throw new Error("memory runtime manager must implement search");
			const { query, cursor: _cursor, activeProjectKeys, ...options } = request;
			const hits = await manager.search(query, {
				...options,
				activeProjectKeys: activeProjectKeys ? [...activeProjectKeys] : void 0,
				sessionKey: session?.sessionKey,
				signal: context.signal
			});
			return {
				hits: (await authorize(hits)).map(convert),
				coverage: "complete"
			};
		},
		async get(request) {
			if (typeof manager.readFile !== "function") throw new Error("memory runtime manager must implement readFile");
			const read = await manager.readFile({
				relPath: request.reference.id,
				from: request.from,
				lines: request.lines
			});
			if (read.status === "not_found") return { status: "not_found" };
			return {
				status: "ok",
				reference: {
					providerId,
					id: read.path
				},
				text: read.text,
				truncated: read.truncated,
				from: read.from,
				lines: read.lines,
				nextFrom: read.nextFrom
			};
		},
		async health() {
			const status = manager.status();
			return {
				status: status.lastSyncError ? "degraded" : "ready",
				message: status.lastSyncError,
				details: { legacy: redactLegacyHealthDetails(status) }
			};
		},
		...manager.sync ? { refresh: () => manager.sync({ reason: "provider-refresh" }) } : {},
		async close() {
			if (params.purpose === "cli" || params.purpose === "status") await runPluginCleanup(manager, () => manager.close?.());
		}
	} };
}
//#endregion
//#region src/plugins/memory-runtime.ts
const enrolledStandaloneMemoryRuntimes = /* @__PURE__ */ new WeakSet();
let standaloneMemoryRegistrySlot;
const registeredMemoryManagerAdapters = /* @__PURE__ */ new WeakMap();
function normalizeRegisteredMemoryManager(manager) {
	const existing = registeredMemoryManagerAdapters.get(manager);
	if (existing) return existing;
	const readFile = async (params) => {
		const result = await manager.readFile(params);
		return result.status === "ok" || result.status === "not_found" ? result : {
			...result,
			status: "ok"
		};
	};
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
	const pluginId = plugins.slots.memory;
	if (!plugins.enabled || !pluginId) return [];
	if (plugins.deny.includes(pluginId) || plugins.entries[pluginId]?.enabled === false) return [];
	return [pluginId];
}
function listCurrentMemoryRuntimes() {
	const runtimes = new Set(standaloneMemoryRegistrySlot?.retiredRuntimes);
	const current = getMemoryRuntime();
	if (current) runtimes.add(current);
	const providerRuntime = getMemoryProviderRuntime();
	if (providerRuntime) runtimes.add(providerRuntime);
	if (standaloneMemoryRegistrySlot?.providerRuntime) runtimes.add(standaloneMemoryRegistrySlot.providerRuntime);
	if (standaloneMemoryRegistrySlot?.runtime) runtimes.add(standaloneMemoryRegistrySlot.runtime);
	return [...runtimes];
}
function assertMemoryProviderRuntime(runtime) {
	if (runtime !== void 0 && (!runtime || typeof runtime.open !== "function")) throw new Error("memory providerRuntime must implement open");
}
function isValidMemoryProviderCapabilities(capabilities) {
	return Array.isArray(capabilities?.sources) && capabilities.sources.length > 0 && capabilities.sources.every((source) => source === "memory" || source === "sessions") && typeof capabilities.pagination === "boolean" && Array.isArray(capabilities.candidates) && capabilities.candidates.every((kind) => kind === "trigger" || kind === "project") && typeof capabilities.projectFilter === "boolean";
}
function ensureMemoryRuntime(params) {
	const current = getMemoryRuntime();
	const currentProviderRuntime = getMemoryProviderRuntime();
	assertMemoryProviderRuntime(currentProviderRuntime);
	if (current || currentProviderRuntime || !params) return current || currentProviderRuntime ? {
		runtime: current,
		providerRuntime: currentProviderRuntime,
		providerId: getMemoryCapabilityRegistration()?.pluginId,
		searchRuntimeRegistered: true
	} : void 0;
	const onlyPluginIds = resolveMemoryRuntimePluginIds(params.cfg);
	if (onlyPluginIds.length === 0) return;
	const dir = resolveAgentWorkspaceDir(params.cfg, params.agentId);
	const workspaceDir = typeof dir === "string" && dir.trim() ? resolveUserPath(dir) : void 0;
	const registry = loadPluginRegistryHandle({
		config: params.cfg,
		onlyPluginIds,
		workspaceDir,
		activate: false
	});
	const registration = resolveMemoryCapabilityRegistration(registry.memoryCapabilities);
	const runtime = registration?.capability.runtime;
	const registeredProviderRuntime = registration?.capability.providerRuntime;
	assertMemoryProviderRuntime(registeredProviderRuntime);
	const record = runtime || registeredProviderRuntime ? void 0 : registry.plugins.find((entry) => entry.id === onlyPluginIds[0]);
	const owner = runtime || registeredProviderRuntime ? {
		runtime,
		providerRuntime: registeredProviderRuntime,
		providerId: registration?.pluginId,
		standalone: true,
		searchRuntimeRegistered: true
	} : record?.status === "error" ? { error: record.error ?? `Memory plugin "${record.id}" failed to load` } : record?.status === "loaded" && record.memorySlotSelected === true ? { searchRuntimeRegistered: false } : void 0;
	const previousSlot = standaloneMemoryRegistrySlot;
	if (previousSlot?.runtime === runtime && previousSlot?.providerRuntime === registeredProviderRuntime) return owner;
	const retiredRuntimes = new Set(previousSlot?.retiredRuntimes);
	if (previousSlot?.runtime) retiredRuntimes.add(previousSlot.runtime);
	if (previousSlot?.providerRuntime) retiredRuntimes.add(previousSlot.providerRuntime);
	standaloneMemoryRegistrySlot = {
		runtime,
		providerRuntime: registeredProviderRuntime,
		retiredRuntimes
	};
	setStandaloneMemoryOwner(registration && (runtime || registeredProviderRuntime) ? {
		pluginId: registration.pluginId,
		native: registeredProviderRuntime !== void 0
	} : void 0);
	for (const ownedRuntime of [owner?.runtime, owner?.providerRuntime]) if (ownedRuntime && !enrolledStandaloneMemoryRuntimes.has(ownedRuntime)) {
		const lifecycle = getPluginValueInstance(ownedRuntime)?.lifecycle;
		if (lifecycle) {
			lifecycle.onDispose(() => {
				const slot = standaloneMemoryRegistrySlot;
				slot?.retiredRuntimes.delete(ownedRuntime);
				if (slot?.runtime === ownedRuntime) delete slot.runtime;
				if (slot?.providerRuntime === ownedRuntime) delete slot.providerRuntime;
			});
			enrolledStandaloneMemoryRuntimes.add(ownedRuntime);
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
	return owner?.runtime?.authorizeSearchHits ? await owner.runtime.authorizeSearchHits(params) : params.hits.filter((hit) => hit.source !== "sessions");
}
/**
* Reports whether the selected slot owner registers the provider-neutral runtime.
* Consumers keep their legacy manager path for every other owner, so this resolves
* the owner the same way that path would without opening a manager.
*/
function isActiveMemoryProviderNative(params) {
	return ensureMemoryRuntime(params)?.providerRuntime !== void 0;
}
/** Resolves one selected provider; native provider failures never retry through legacy storage. */
async function getActiveMemoryProviderCore(params) {
	if (typeof params.context.assertCurrent !== "function") throw new Error("memory provider requires caller authority with assertCurrent");
	if (params.context.authority.kind === "session" && params.context.authority.audience !== void 0 && !isHostMemoryAudience(params.context.authority.audience)) throw new Error("memory provider requires a host-minted memory audience");
	const context = {
		...params.context,
		assertCurrent: () => assertMemoryCallerCurrent(params.context)
	};
	const openParams = {
		...params,
		context
	};
	context.assertCurrent();
	const owner = ensureMemoryRuntime(params);
	if (!owner?.runtime && !owner?.providerRuntime) return {
		provider: null,
		error: owner?.error ?? "memory plugin unavailable"
	};
	if (owner.standalone) setStandaloneMemoryManagerActive(true);
	const providerId = owner.providerId ?? normalizePluginsConfig(params.cfg.plugins).slots.memory;
	if (typeof providerId !== "string" || !providerId) return {
		provider: null,
		error: "memory provider identity unavailable"
	};
	const adapter = owner.providerRuntime ? "native" : "legacy";
	const result = owner.providerRuntime ? await owner.providerRuntime.open(openParams) : await adaptLegacyMemoryProvider(owner.runtime, providerId, openParams);
	try {
		context.assertCurrent();
		if (result.provider && (typeof result.provider.search !== "function" || typeof result.provider.get !== "function" || typeof result.provider.health !== "function" || typeof result.provider.close !== "function" || !isValidMemoryProviderCapabilities(result.provider.capabilities) || result.provider.capabilities.candidates.length > 0 !== (typeof result.provider.candidates === "function"))) throw new Error("memory provider must implement search, get, health, close, and valid capabilities with matching candidates");
	} catch (error) {
		if (result.provider && typeof result.provider.close === "function") await runPluginCleanup(result.provider, () => result.provider.close());
		throw error;
	}
	return {
		...result,
		providerId,
		adapter,
		provider: result.provider ? bindMemoryProvider(result.provider, providerId, params.context, owner.providerRuntime ?? owner.runtime) : null
	};
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
	if (owner?.providerRuntime) {
		const providerId = owner.providerId ?? normalizePluginsConfig(params.cfg.plugins).slots.memory?.trim();
		return providerId ? {
			backend: "provider-runtime",
			providerId
		} : null;
	}
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
	setStandaloneMemoryOwner(void 0);
	setStandaloneMemoryManagerActive(false);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.memoryRuntimeTestApi")] = { resetStandaloneMemoryRegistrySlot };
/** Prepare memory consumers before any changed plugin loses ordinary call admission. */
function prepareMemoryRuntimeReload(previousRegistry, nextRegistry) {
	const runtimes = (registry) => new Set(registry.memoryCapabilities.flatMap(({ capability }) => [capability.runtime, capability.providerRuntime].filter((runtime) => runtime !== void 0)));
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
		if (!cleanup) cleanup = runPluginCleanupScope([...prepared.map(({ runtime }) => runtime), ...retiringEmbeddingProviders], () => Promise.allSettled(prepared.map(({ runtime, handle }) => Promise.resolve().then(() => runPluginCleanup(runtime, async () => {
			try {
				return await handle.drain();
			} catch (error) {
				return { errors: [error] };
			}
		}))))).then((results) => {
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
export { getActiveMemoryProviderCore as a, prepareMemoryRuntimeReload as c, closeActiveMemorySearchManagersCore as i, resolveActiveMemoryBackendConfig as l, classifyActiveMemoryWorkspacePaths as n, getActiveMemorySearchManagerCore as o, closeActiveMemorySearchManagerCore as r, isActiveMemoryProviderNative as s, authorizeActiveMemorySearchHits as t };
