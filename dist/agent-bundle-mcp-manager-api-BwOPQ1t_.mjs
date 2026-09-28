import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { i as revokeMcpAppModelContext, o as getSessionMcpRequestSignal, t as allowMcpAppModelContext } from "./mcp-app-model-context-nV9u20zq.mjs";
import { n as recordAgentCleanupFailure } from "./run-cleanup-timeout-BlChlpzQ.mjs";
import { t as createRequesterMcpConnect } from "./agent-bundle-mcp-requester-connect-6RTPH5wa.mjs";
import { t as loadSessionMcpConfig } from "./agent-bundle-mcp-runtime-config-BGHKMcLd.mjs";
import { a as partitionMcpServersByConnectionScope, i as hashMcpResolvedConnections, r as buildMcpRequesterRuntimeCacheKey, s as resolveRequesterScopedMcpConnections } from "./mcp-connection-resolver-BWfIk8DO.mjs";
import { r as resolveSessionMcpRuntimeIdleTtlMs, t as SESSION_MCP_RUNTIME_MANAGER_KEY } from "./agent-bundle-mcp-runtime-shared-BFBNCZj0.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/agent-bundle-mcp-combined.ts
/** Combined session MCP runtime facade for server and requester partitions. */
function compareCatalogTools(left, right) {
	return left.safeServerName.localeCompare(right.safeServerName) || left.toolName.localeCompare(right.toolName) || left.serverName.localeCompare(right.serverName);
}
async function loadCurrentCatalog(part) {
	if (part.retiredCatalog) return part.retiredCatalog;
	try {
		const catalog = await part.getCatalog();
		return part.retiredCatalog ?? catalog;
	} catch (error) {
		if (part.retiredCatalog) return part.retiredCatalog;
		throw error;
	}
}
/**
* Merge catalogs from static + requester partitions.
* Safe names are precomputed from the full declared set, so no re-suffix is needed.
*/
function mergeMcpToolCatalogs(catalogs) {
	const servers = {};
	const tools = [];
	const policyTools = [];
	const sessionDeniedTools = [];
	const diagnostics = [];
	for (const catalog of catalogs) {
		for (const [serverName, server] of Object.entries(catalog.servers).toSorted(([a], [b]) => a.localeCompare(b))) servers[serverName] = server;
		tools.push(...catalog.tools);
		policyTools.push(...catalog.policyTools ?? [...catalog.tools, ...catalog.sessionDeniedTools ?? []]);
		if (catalog.sessionDeniedTools) sessionDeniedTools.push(...catalog.sessionDeniedTools);
		if (catalog.diagnostics) diagnostics.push(...catalog.diagnostics);
	}
	tools.sort(compareCatalogTools);
	policyTools.sort(compareCatalogTools);
	sessionDeniedTools.sort(compareCatalogTools);
	return {
		version: 1,
		generatedAt: Math.max(0, ...catalogs.map((catalog) => catalog.generatedAt)),
		servers,
		tools,
		...policyTools.length > 0 ? { policyTools } : {},
		...sessionDeniedTools.length > 0 ? { sessionDeniedTools } : {},
		...diagnostics.length > 0 ? { diagnostics } : {}
	};
}
function createCombinedSessionMcpRuntime(params) {
	if (params.parts.length === 1 && !params.serverOwners) return params.parts[0];
	const parts = params.parts;
	let activeLeases = 0;
	let disposal;
	let cleanupFailure;
	let lastUsedAt = Math.max(Date.now(), ...parts.map((part) => part.lastUsedAt));
	let cachedCatalog = null;
	let mergedSourceCatalogs = null;
	let catalogInFlight;
	const serverOwner = params.serverOwners ?? /* @__PURE__ */ new Map();
	const requesterConnect = parts.find((part) => part.requesterConnect)?.requesterConnect;
	const rememberServerOwners = (catalog, owner) => {
		for (const serverName of Object.keys(catalog.servers)) serverOwner.set(serverName, owner);
	};
	const cachedCatalogIsCurrent = () => cachedCatalog !== null && mergedSourceCatalogs !== null && parts.every((part, index) => (part.retiredCatalog ?? part.peekCatalog()) === mergedSourceCatalogs?.[index]);
	const loadCatalog = async () => {
		if (cachedCatalog && !cachedCatalog.diagnostics?.length && cachedCatalogIsCurrent()) return cachedCatalog;
		if (catalogInFlight) return catalogInFlight;
		const inFlight = (async () => {
			let loaded = [];
			for (let attempt = 0; attempt < 2; attempt++) {
				const { results, firstError, hasError } = await runTasksWithConcurrency({
					tasks: parts.map((part, index) => async () => {
						const previous = loaded[index];
						if (previous && (!previous.cached || part.retiredCatalog || part.peekCatalog())) return previous;
						return {
							catalog: await loadCurrentCatalog(part),
							cached: part.peekCatalog() !== null
						};
					}),
					limit: 6,
					errorMode: "continue"
				});
				if (hasError) throw firstError;
				loaded = results;
			}
			const catalogs = parts.map((part, index) => part.retiredCatalog ?? part.peekCatalog() ?? loaded[index].catalog);
			if (cachedCatalog && mergedSourceCatalogs?.every((source, index) => source === catalogs[index])) return cachedCatalog;
			if (!params.serverOwners) {
				serverOwner.clear();
				for (let index = 0; index < parts.length; index += 1) rememberServerOwners(catalogs[index], parts[index]);
			}
			mergedSourceCatalogs = catalogs;
			cachedCatalog = mergeMcpToolCatalogs(catalogs);
			return cachedCatalog;
		})();
		catalogInFlight = inFlight;
		try {
			return await inFlight;
		} finally {
			if (catalogInFlight === inFlight) catalogInFlight = void 0;
		}
	};
	const ownerForServer = async (serverName) => {
		const signal = getSessionMcpRequestSignal();
		signal?.throwIfAborted();
		if (serverOwner.size === 0) await racePromiseWithAbortSignal(loadCatalog(), signal);
		const owner = serverOwner.get(serverName);
		if (owner) return owner;
		throw new Error(`bundle-mcp server "${serverName}" is not connected`);
	};
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		configFingerprint: parts.map((part) => part.configFingerprint).join(":"),
		...requesterConnect ? { requesterConnect } : {},
		isRequesterScopedServer(serverName) {
			return serverOwner.get(serverName)?.requesterScope !== void 0;
		},
		mcpAppsEnabled: parts.some((part) => part.mcpAppsEnabled === true),
		createdAt: Math.min(Date.now(), ...parts.map((part) => part.createdAt)),
		get lastUsedAt() {
			return lastUsedAt;
		},
		get activeLeases() {
			return Math.max(activeLeases, parts.reduce((sum, part) => sum + (part.activeLeases ?? 0), 0));
		},
		acquireLease() {
			activeLeases += 1;
			const releases = parts.map((part) => part.acquireLease?.());
			let released = false;
			return () => {
				if (released) return;
				released = true;
				activeLeases -= 1;
				for (const release of releases) release?.();
			};
		},
		getCatalog: loadCatalog,
		peekCatalog() {
			if (cachedCatalog && cachedCatalogIsCurrent()) return cachedCatalog;
			const peeked = parts.map((part) => part.retiredCatalog ?? part.peekCatalog());
			if (peeked.some((catalog) => catalog === null)) return null;
			return mergeMcpToolCatalogs(peeked);
		},
		getServerRequestTimeoutMs(serverName) {
			return serverOwner.get(serverName)?.getServerRequestTimeoutMs?.(serverName);
		},
		markUsed() {
			lastUsedAt = Date.now();
			for (const part of parts) part.markUsed();
		},
		async callTool(serverName, toolName, input) {
			return await (await ownerForServer(serverName)).callTool(serverName, toolName, input);
		},
		async listTools(serverName, requestParams) {
			const owner = await ownerForServer(serverName);
			if (!owner.listTools) throw new Error(`bundle-mcp server "${serverName}" does not support listTools`);
			return await owner.listTools(serverName, requestParams);
		},
		async listResources(serverName, options) {
			const owner = await ownerForServer(serverName);
			if (!owner.listResources) throw new Error(`bundle-mcp server "${serverName}" does not support listResources`);
			return await owner.listResources(serverName, options);
		},
		async readResource(serverName, uri, options) {
			const owner = await ownerForServer(serverName);
			if (!owner.readResource) throw new Error(`bundle-mcp server "${serverName}" does not support readResource`);
			return await owner.readResource(serverName, uri, options);
		},
		async listResourceTemplates(serverName, requestParams) {
			const owner = await ownerForServer(serverName);
			if (!owner.listResourceTemplates) throw new Error(`bundle-mcp server "${serverName}" does not support listResourceTemplates`);
			return await owner.listResourceTemplates(serverName, requestParams);
		},
		async listPrompts(serverName) {
			const owner = await ownerForServer(serverName);
			if (!owner.listPrompts) throw new Error(`bundle-mcp server "${serverName}" does not support listPrompts`);
			return await owner.listPrompts(serverName);
		},
		async getPrompt(serverName, name, args) {
			const owner = await ownerForServer(serverName);
			if (!owner.getPrompt) throw new Error(`bundle-mcp server "${serverName}" does not support getPrompt`);
			return await owner.getPrompt(serverName, name, args);
		},
		async joinCleanup() {
			await disposal;
			const outcomes = await Promise.allSettled(parts.map(async (part) => {
				if (!part.joinCleanup) throw new Error("MCP runtime does not expose cleanup ownership");
				await part.joinCleanup();
			}));
			cleanupFailure ??= outcomes.find((outcome) => outcome.status === "rejected");
			if (cleanupFailure) {
				recordAgentCleanupFailure();
				throw cleanupFailure.reason;
			}
		},
		async dispose() {
			disposal ??= Promise.allSettled(parts.map(async (part) => await part.dispose())).then((outcomes) => {
				cleanupFailure ??= outcomes.find((outcome) => outcome.status === "rejected");
			});
			await disposal;
			if (cleanupFailure) recordAgentCleanupFailure();
		}
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-runtime-owner.ts
const sessionMcpRuntimeOwners = resolveGlobalSingleton(Symbol.for("openclaw.sessionMcpRuntimeOwners"), () => /* @__PURE__ */ new WeakMap());
//#endregion
//#region src/agents/agent-bundle-mcp-manager-install.ts
const matchesRuntime = (runtime, params, fingerprint) => sessionMcpRuntimeOwners.get(runtime)?.isCurrent() !== false && runtime.workspaceDir === params.workspaceDir && runtime.agentDir === params.agentDir && runtime.configFingerprint === fingerprint;
function requesterRuntimeFingerprint(configFingerprint, requesterConnect) {
	return requesterConnect ? `${configFingerprint}:${requesterConnect.configFingerprint}` : configFingerprint;
}
function createSessionMcpRuntimeManagerInstall(lifecycle) {
	const { store } = lifecycle;
	const reconcileReusableRetirement = (params, runtime) => {
		const { sessionId } = params;
		const slot = store.runtimeSlots.get(runtime);
		if (slot) slot.idleTtlMs = resolveSessionMcpRuntimeIdleTtlMs(store.configReload?.cfg ?? params.cfg);
		lifecycle.ensureIdleSweepTimer();
		if (store.requiredRetirementSessionIds.has(sessionId)) {
			store.deferredRetirementSessionIds.add(sessionId);
			revokeMcpAppModelContext(runtime);
			return;
		}
		store.deferredRetirementSessionIds.delete(sessionId);
		allowMcpAppModelContext(runtime);
	};
	/** Install under the runtime-key queue shared by acquisition and disposal. */
	const getOrCreateRuntimeEntry = async (params) => {
		const config = loadSessionMcpConfig({
			...params,
			logDiagnostics: false
		});
		const nextFingerprint = requesterRuntimeFingerprint(config.fingerprint, params.requesterConnect);
		const hasServers = Object.keys(config.loaded.mcpServers).length > 0;
		const { runtimeKey, configReloadAtAdmission, ...runtimeParams } = params;
		const existing = store.runtimesBySessionId.get(runtimeKey);
		const connectionMatches = !params.connectionOverrides || store.connectionMetaByRuntimeKey.get(runtimeKey)?.connectionHash === hashMcpResolvedConnections(params.connectionOverrides);
		if (existing && connectionMatches && matchesRuntime(existing, params, nextFingerprint)) {
			reconcileReusableRetirement(params, existing);
			existing.markUsed();
			return existing;
		}
		const slot = lifecycle.reserveRuntimeSlot(existing, hasServers);
		store.connectionMetaByRuntimeKey.delete(runtimeKey);
		let runtime;
		let previousCleanup;
		try {
			runtime = existing && sessionMcpRuntimeOwners.get(existing)?.replace({
				...runtimeParams,
				configFingerprint: nextFingerprint
			});
			store.runtimesBySessionId.delete(runtimeKey);
			if (runtime) store.runtimesBySessionId.set(runtimeKey, runtime);
			if (existing) {
				previousCleanup = lifecycle.disposeRuntime(existing, false);
				await previousCleanup;
			}
			runtime ??= await store.createRuntime({
				...runtimeParams,
				configFingerprint: nextFingerprint
			});
			store.runtimeSlots.set(runtime, slot);
			store.runtimesBySessionId.set(runtimeKey, runtime);
			let publication = configReloadAtAdmission;
			while (store.configReload && store.configReload !== publication) {
				const next = store.configReload;
				await sessionMcpRuntimeOwners.get(runtime)?.reload({
					...next,
					reloadPlugins: next.pluginGeneration !== (publication?.pluginGeneration ?? 0)
				});
				publication = next;
			}
			if (!(sessionMcpRuntimeOwners.get(runtime)?.hasServers() ?? hasServers)) await lifecycle.releaseEmptyRuntimeSlot(runtimeKey, runtime);
			reconcileReusableRetirement(params, runtime);
			runtime.markUsed();
			return runtime;
		} catch (error) {
			store.runtimesBySessionId.delete(runtimeKey);
			const failed = (await Promise.allSettled([previousCleanup ?? (existing && lifecycle.disposeRuntime(existing, false)), runtime && lifecycle.disposeRuntime(runtime, false)])).find((result) => result.status === "rejected");
			if (failed) throw failed.reason;
			store.liveRuntimeSlots.delete(slot);
			lifecycle.ensureIdleSweepTimer();
			throw error;
		}
	};
	/** Install or reuse one requester runtime. Must run under its runtime-key lock. */
	const installRequesterRuntime = async (params) => {
		const connectionHash = hashMcpResolvedConnections(params.connectionOverrides);
		const runtime = await getOrCreateRuntimeEntry(params);
		if (store.runtimesBySessionId.get(params.runtimeKey) === runtime) store.connectionMetaByRuntimeKey.set(params.runtimeKey, {
			connectionHash,
			resolvedAt: store.now()
		});
		return runtime;
	};
	/**
	* Full requester section for one runtimeKey: reuse / resolve / install / revoke.
	* Always invoked under runExclusiveOnRuntimeKey.
	*/
	const resolveAndInstallRequesterRuntime = async (params) => {
		const requesterConnect = await createRequesterMcpConnect({
			serverNames: params.oauthRequesterNameSet,
			mcpServers: params.mcpServers,
			safeServerNamesByServer: params.safeServerNamesByServer,
			requesterScope: params.requesterScope,
			cfg: params.cfg,
			configFingerprint: params.fullScopedFingerprint
		});
		const expectedLiveNameSet = /* @__PURE__ */ new Set([...requesterConnect?.authorizedServerNames ?? [], ...params.resolverRequesterServerNames]);
		const { fingerprint: expectedLiveFingerprint } = loadSessionMcpConfig({
			...params,
			logDiagnostics: false,
			includeServerNames: expectedLiveNameSet,
			redactConnectionServerNames: new Set(params.resolverRequesterServerNames)
		});
		const scopedFingerprint = requesterRuntimeFingerprint(expectedLiveFingerprint, requesterConnect);
		const existing = store.runtimesBySessionId.get(params.runtimeKey);
		const meta = store.connectionMetaByRuntimeKey.get(params.runtimeKey);
		if (meta !== void 0 && store.now() - meta.resolvedAt < 3e5 && existing && matchesRuntime(existing, params, scopedFingerprint)) {
			reconcileReusableRetirement(params, existing);
			existing.markUsed();
			return existing;
		}
		const connectionOverrides = await resolveRequesterScopedMcpConnections({
			serverNames: params.resolverRequesterServerNames,
			requesterSenderId: params.requesterSenderId,
			agentAccountId: params.agentAccountId,
			messageChannel: params.messageChannel
		});
		const activeNameSet = /* @__PURE__ */ new Set([...requesterConnect?.authorizedServerNames ?? [], ...connectionOverrides.keys()]);
		if (activeNameSet.size === 0 && !requesterConnect) {
			if (store.runtimesBySessionId.has(params.runtimeKey)) await lifecycle.disposeRuntimeKeyNow(params.runtimeKey);
			return;
		}
		return await installRequesterRuntime({
			runtimeKey: params.runtimeKey,
			configReloadAtAdmission: params.configReloadAtAdmission,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			workspaceDir: params.workspaceDir,
			agentDir: params.agentDir,
			cfg: params.cfg,
			manifestRegistry: params.manifestRegistry,
			safeServerNamesByServer: params.safeServerNamesByServer,
			includeServerNames: activeNameSet,
			requesterConnect,
			connectionOverrides,
			redactConnectionServerNames: new Set(params.resolverRequesterServerNames),
			requesterScope: params.requesterScope,
			toolOverrides: params.toolOverrides,
			toolDenylist: params.toolDenylist
		});
	};
	return {
		getOrCreateRuntimeEntry,
		resolveAndInstallRequesterRuntime
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-manager-lifecycle.ts
/** Session MCP runtime manager lifecycle: maps, idle sweep, dispose, advertised catalog. */
const runInMcpManagerContext = AsyncLocalStorage.snapshot();
function parseRuntimeCacheSessionId(runtimeKey) {
	if (!runtimeKey.startsWith("{")) return runtimeKey;
	try {
		const parsed = JSON.parse(runtimeKey);
		return typeof parsed.sessionId === "string" ? parsed.sessionId : runtimeKey;
	} catch {
		return runtimeKey;
	}
}
function createSessionMcpRuntimeManagerStore(opts, createSessionMcpRuntime) {
	return {
		runtimesBySessionId: /* @__PURE__ */ new Map(),
		sessionIdBySessionKey: /* @__PURE__ */ new Map(),
		deferredRetirementSessionIds: /* @__PURE__ */ new Set(),
		requiredRetirementSessionIds: /* @__PURE__ */ new Set(),
		connectionMetaByRuntimeKey: /* @__PURE__ */ new Map(),
		/**
		* Session-stable advertised catalogs for requester-scoped servers.
		* Keyed by sessionId → serverName. Specs must not vary per sender or shared
		* Codex threads rotate (dynamicToolsFingerprint churn).
		*/
		advertisedScopedCatalogBySessionId: /* @__PURE__ */ new Map(),
		/**
		* Per-runtimeKey serialization for acquisition and dispose.
		* Sections never overlap for one key, so a slow resolve cannot clobber a newer install.
		* Entries are removed when their chain drains.
		*/
		runtimeWorkChains: /* @__PURE__ */ new Map(),
		pendingDisposals: /* @__PURE__ */ new Map(),
		createRuntime: opts.createRuntime ?? createSessionMcpRuntime,
		now: opts.now ?? Date.now,
		idleSweepIntervalMs: opts.idleSweepIntervalMs ?? 6e4,
		runtimeSlots: /* @__PURE__ */ new WeakMap(),
		liveRuntimeSlots: /* @__PURE__ */ new Set(),
		enableIdleSweepTimer: opts.enableIdleSweepTimer !== false,
		idleSweepTimer: void 0,
		idleSweepInFlight: void 0
	};
}
function scopedCatalogToolsSignature(tools) {
	return JSON.stringify(tools.map((tool) => [
		tool.serverName,
		tool.safeServerName,
		tool.toolName,
		tool.title ?? "",
		tool.description ?? "",
		tool.fallbackDescription,
		tool.inputSchema,
		tool.uiResourceUri ?? "",
		tool.uiVisibility ?? null
	]));
}
function createSessionMcpRuntimeManagerLifecycle(store) {
	const reserveRuntimeSlot = (existing, hasServers) => {
		const slot = (existing && store.runtimeSlots.get(existing)) ?? { idleTtlMs: 0 };
		if (!hasServers || store.liveRuntimeSlots.has(slot)) return slot;
		if (store.liveRuntimeSlots.size >= 256) {
			const message = `bundle-mcp: live runtime limit (256) reached; stop or reset unused sessions before connecting another MCP runtime`;
			logWarn(message);
			throw new Error(message);
		}
		store.liveRuntimeSlots.add(slot);
		return slot;
	};
	const releaseEmptyRuntimeSlot = async (runtimeKey, runtime) => {
		const slot = store.runtimeSlots.get(runtime);
		if (!slot) return;
		if (!runtime.joinCleanup) throw new Error("MCP runtime does not expose cleanup ownership");
		await runtime.joinCleanup();
		const owner = sessionMcpRuntimeOwners.get(runtime);
		if (store.runtimesBySessionId.get(runtimeKey) === runtime && owner?.hasServers() !== true) {
			store.liveRuntimeSlots.delete(slot);
			if (owner?.hasServers() === false && (runtime.activeLeases ?? 0) === 0 && Object.keys(runtime.requesterConnect?.catalog.servers ?? {}).length === 0) {
				store.runtimesBySessionId.delete(runtimeKey);
				store.connectionMetaByRuntimeKey.delete(runtimeKey);
				store.runtimeSlots.delete(runtime);
				if (runtimeKeysForSessionId(runtime.sessionId).length === 0) forgetSessionKeysForSessionId(runtime.sessionId);
			}
		}
	};
	const disposeRuntime = async (runtime, releaseSlot = true) => {
		try {
			await runtime.dispose();
			if (!runtime.joinCleanup) throw new Error("MCP runtime does not expose cleanup ownership");
			await runtime.joinCleanup();
			const slot = store.runtimeSlots.get(runtime);
			if (releaseSlot && slot) {
				store.liveRuntimeSlots.delete(slot);
				store.runtimeSlots.delete(runtime);
			}
		} catch (error) {
			recordAgentCleanupFailure();
			throw error;
		}
	};
	const trackDisposal = (runtimeKeys, close) => {
		const disposal = Promise.resolve().then(close).catch((error) => {
			recordAgentCleanupFailure();
			throw error;
		}).finally(() => {
			for (const runtimeKey of runtimeKeys) {
				const pending = store.pendingDisposals.get(runtimeKey);
				pending?.delete(disposal);
				if (pending?.size === 0) store.pendingDisposals.delete(runtimeKey);
			}
		});
		for (const runtimeKey of runtimeKeys) {
			const pending = store.pendingDisposals.get(runtimeKey) ?? /* @__PURE__ */ new Set();
			store.pendingDisposals.set(runtimeKey, pending);
			pending.add(disposal);
		}
		return disposal;
	};
	const forgetSessionKeysForSessionId = (sessionId) => {
		for (const [sessionKey, mappedSessionId] of store.sessionIdBySessionKey.entries()) if (mappedSessionId === sessionId) store.sessionIdBySessionKey.delete(sessionKey);
	};
	const runtimeKeysForSessionId = (sessionId) => {
		const keys = /* @__PURE__ */ new Set();
		for (const [runtimeKey, runtime] of store.runtimesBySessionId.entries()) if (runtime.sessionId === sessionId) keys.add(runtimeKey);
		for (const runtimeKey of store.runtimeWorkChains.keys()) if (parseRuntimeCacheSessionId(runtimeKey) === sessionId) keys.add(runtimeKey);
		return [...keys];
	};
	const totalActiveLeasesForSessionId = (sessionId) => {
		let total = 0;
		for (const runtimeKey of runtimeKeysForSessionId(sessionId)) total += store.runtimesBySessionId.get(runtimeKey)?.activeLeases ?? 0;
		return total;
	};
	const runExclusiveOnRuntimeKeys = (runtimeKeys, work) => {
		const previous = runtimeKeys.map((key) => store.runtimeWorkChains.get(key)).filter((pending) => pending !== void 0);
		const run = Promise.allSettled(previous).then(work);
		const settled = run.then(() => void 0, () => void 0);
		for (const key of runtimeKeys) store.runtimeWorkChains.set(key, settled);
		settled.finally(() => {
			for (const key of runtimeKeys) if (store.runtimeWorkChains.get(key) === settled) store.runtimeWorkChains.delete(key);
			for (const sessionId of new Set(runtimeKeys.map(parseRuntimeCacheSessionId))) if (runtimeKeysForSessionId(sessionId).length === 0) forgetSessionKeysForSessionId(sessionId);
		});
		return run;
	};
	const sweepIdleRuntimes = async () => {
		const nowMs = store.now();
		const expired = [];
		for (const [runtimeKey, runtime] of store.runtimesBySessionId.entries()) {
			const idleTtlMs = store.runtimeSlots.get(runtime)?.idleTtlMs ?? 0;
			if (idleTtlMs === 0 || (runtime.activeLeases ?? 0) > 0) continue;
			if (nowMs - runtime.lastUsedAt < idleTtlMs) continue;
			if (store.runtimeWorkChains.has(runtimeKey)) continue;
			store.runtimesBySessionId.delete(runtimeKey);
			store.connectionMetaByRuntimeKey.delete(runtimeKey);
			expired.push({
				runtimeKey,
				runtime
			});
		}
		const touchedSessionIds = new Set(expired.map(({ runtime }) => runtime.sessionId));
		for (const sessionId of touchedSessionIds) if (runtimeKeysForSessionId(sessionId).length === 0) {
			store.deferredRetirementSessionIds.delete(sessionId);
			forgetSessionKeysForSessionId(sessionId);
		}
		await Promise.allSettled(expired.map(({ runtimeKey, runtime }) => trackDisposal([runtimeKey], () => disposeRuntime(runtime))));
		ensureIdleSweepTimer();
		return expired.length;
	};
	const queueIdleSweep = () => {
		if (store.idleSweepInFlight) return;
		store.idleSweepInFlight = sweepIdleRuntimes().then(() => void 0).catch((error) => {
			logWarn(`bundle-mcp: idle runtime sweep failed: ${String(error)}`);
		}).finally(() => {
			store.idleSweepInFlight = void 0;
		});
	};
	const ensureIdleSweepTimer = () => {
		if (![...store.runtimesBySessionId.values()].some((runtime) => (store.runtimeSlots.get(runtime)?.idleTtlMs ?? 0) > 0)) {
			clearIdleSweepTimer();
			return;
		}
		if (!store.enableIdleSweepTimer || store.idleSweepIntervalMs <= 0 || store.idleSweepTimer) return;
		store.idleSweepTimer = runInMcpManagerContext(() => setInterval(queueIdleSweep, store.idleSweepIntervalMs));
		store.idleSweepTimer.unref?.();
	};
	const clearIdleSweepTimer = () => {
		if (!store.idleSweepTimer) return;
		clearInterval(store.idleSweepTimer);
		store.idleSweepTimer = void 0;
	};
	const disposeRuntimeKeyNow = async (runtimeKey) => {
		const runtime = store.runtimesBySessionId.get(runtimeKey);
		store.runtimesBySessionId.delete(runtimeKey);
		store.connectionMetaByRuntimeKey.delete(runtimeKey);
		if (runtime) await disposeRuntime(runtime);
	};
	const disposeManagedRuntimes = (sessionId, opts) => {
		const runtimeKeys = [...new Set(sessionId === void 0 ? [
			...store.runtimesBySessionId.keys(),
			...store.runtimeWorkChains.keys(),
			...store.pendingDisposals.keys()
		] : [
			sessionId,
			...runtimeKeysForSessionId(sessionId),
			...[...store.pendingDisposals.keys()].filter((key) => parseRuntimeCacheSessionId(key) === sessionId)
		])];
		const previousDisposals = new Set(runtimeKeys.flatMap((key) => [...store.pendingDisposals.get(key) ?? []]));
		const priorDisposal = store.disposalInFlight;
		const queued = runExclusiveOnRuntimeKeys(runtimeKeys, async () => {
			await priorDisposal;
			if (sessionId === void 0) {
				clearIdleSweepTimer();
				store.configReload = void 0;
				store.sessionIdBySessionKey.clear();
				store.deferredRetirementSessionIds.clear();
				store.requiredRetirementSessionIds.clear();
				store.advertisedScopedCatalogBySessionId.clear();
			} else {
				store.deferredRetirementSessionIds.delete(sessionId);
				if (opts?.preserveRequiredRetirement !== true) store.requiredRetirementSessionIds.delete(sessionId);
				store.advertisedScopedCatalogBySessionId.delete(sessionId);
				forgetSessionKeysForSessionId(sessionId);
			}
			const failed = (await Promise.allSettled([...previousDisposals, ...runtimeKeys.map(disposeRuntimeKeyNow)])).find((outcome) => outcome.status === "rejected");
			ensureIdleSweepTimer();
			if (failed) throw failed.reason;
		});
		const disposal = trackDisposal(runtimeKeys, () => queued).catch(() => void 0);
		if (sessionId === void 0) store.disposalInFlight = disposal;
		return disposal.finally(() => {
			if (store.disposalInFlight === disposal) store.disposalInFlight = void 0;
		});
	};
	const rememberAdvertisedScopedCatalog = (handle, catalog) => {
		const { runtime, advertisedCatalogConfigFingerprint } = handle;
		const entry = store.advertisedScopedCatalogBySessionId.get(runtime.sessionId);
		if (entry?.configFingerprint !== advertisedCatalogConfigFingerprint || sessionMcpRuntimeOwners.get(runtime)?.isCurrent() === false || ![...store.runtimesBySessionId.values()].includes(runtime)) return;
		const toolsByServerName = /* @__PURE__ */ new Map();
		for (const tool of catalog.tools) {
			const list = toolsByServerName.get(tool.serverName) ?? [];
			list.push(tool);
			toolsByServerName.set(tool.serverName, list);
		}
		for (const [serverName, server] of Object.entries(catalog.servers)) {
			const tools = (toolsByServerName.get(serverName) ?? []).toSorted((a, b) => a.toolName.localeCompare(b.toolName));
			const signature = scopedCatalogToolsSignature(tools);
			if (entry.signaturesByServer.get(serverName) === signature) continue;
			entry.servers.set(serverName, server);
			entry.toolsByServer.set(serverName, tools);
			entry.signaturesByServer.set(serverName, signature);
		}
	};
	const getAdvertisedScopedCatalog = (sessionId) => {
		const entry = store.advertisedScopedCatalogBySessionId.get(sessionId);
		if (!entry || entry.servers.size === 0) return null;
		const servers = {};
		const tools = [];
		for (const serverName of [...entry.servers.keys()].toSorted((a, b) => a.localeCompare(b))) {
			servers[serverName] = entry.servers.get(serverName);
			tools.push(...entry.toolsByServer.get(serverName) ?? []);
		}
		tools.sort((a, b) => {
			const serverOrder = a.safeServerName.localeCompare(b.safeServerName);
			if (serverOrder !== 0) return serverOrder;
			return a.toolName.localeCompare(b.toolName);
		});
		return {
			version: 1,
			generatedAt: store.now(),
			servers,
			tools
		};
	};
	const reconcileAdvertisedScopedCatalogConfig = (sessionId, fingerprint, preparePublication) => {
		const current = store.advertisedScopedCatalogBySessionId.get(sessionId);
		if (current?.configFingerprint === fingerprint || !current && !preparePublication) return;
		store.advertisedScopedCatalogBySessionId.set(sessionId, {
			configFingerprint: fingerprint,
			servers: /* @__PURE__ */ new Map(),
			toolsByServer: /* @__PURE__ */ new Map(),
			signaturesByServer: /* @__PURE__ */ new Map()
		});
	};
	return {
		store,
		runtimeKeysForSessionId,
		totalActiveLeasesForSessionId,
		runExclusiveOnRuntimeKeys,
		sweepIdleRuntimes,
		reserveRuntimeSlot,
		releaseEmptyRuntimeSlot,
		disposeRuntime,
		ensureIdleSweepTimer,
		disposeRuntimeKeyNow,
		disposeManagedRuntimes,
		rememberAdvertisedScopedCatalog,
		getAdvertisedScopedCatalog,
		reconcileAdvertisedScopedCatalogConfig
	};
}
//#endregion
//#region src/agents/agent-bundle-mcp-manager.ts
/** Session MCP runtime manager: acquisition and requester-scoped install orchestration. */
const sessionMcpRuntimeLoader = createLazyImportLoader(() => import("./agents/agent-bundle-mcp-runtime.js"));
const createSessionMcpRuntimeLazy = async (params) => {
	return (await sessionMcpRuntimeLoader.load()).createSessionMcpRuntime(params);
};
function createSessionMcpRuntimeManager(opts = {}) {
	const store = createSessionMcpRuntimeManagerStore(opts, createSessionMcpRuntimeLazy);
	const lifecycle = createSessionMcpRuntimeManagerLifecycle(store);
	const install = createSessionMcpRuntimeManagerInstall(lifecycle);
	const leaseRuntime = (runtime, runtimeKey) => ({
		runtime,
		releaseLease: runtime.acquireLease?.() ?? (() => {}),
		async retireUnusedServers(retainedServerNames) {
			const owner = sessionMcpRuntimeOwners.get(runtime);
			if (store.runtimesBySessionId.get(runtimeKey) !== runtime || !owner?.isCurrent()) return;
			await owner.retireUnusedServers(retainedServerNames);
			if (!owner.hasServers()) await lifecycle.releaseEmptyRuntimeSlot(runtimeKey, runtime);
		}
	});
	const acquireCurrent = (scope, acquire) => async function current(params) {
		const senderId = normalizeOptionalString(params.requesterSenderId);
		const requester = senderId ? {
			senderId,
			runtimeKey: buildMcpRequesterRuntimeCacheKey({
				...params,
				requesterSenderId: senderId
			})
		} : void 0;
		const runtimeKeys = requester ? [requester.runtimeKey] : [];
		if (scope === "full" || !requester) runtimeKeys.push(params.sessionId);
		const priorDisposal = store.disposalInFlight;
		const priorSessionWork = store.runtimeWorkChains.get(params.sessionId);
		const input = {
			...params,
			requester
		};
		let publication = store.configReload;
		let acquired;
		try {
			return await lifecycle.runExclusiveOnRuntimeKeys(runtimeKeys, async () => {
				await Promise.all([priorDisposal, priorSessionWork].filter((work) => work !== void 0));
				for (;;) {
					const next = store.configReload;
					if (next && next !== publication) Object.assign(input, {
						cfg: next.cfg,
						manifestRegistry: next.manifestRegistry
					});
					publication = next;
					const previous = acquired;
					acquired = await acquire(input);
					previous?.releaseLease();
					if (!store.configReload || store.configReload === publication) return acquired;
				}
			});
		} catch (error) {
			acquired?.releaseLease();
			acquired = void 0;
			throw error;
		} finally {
			if (!acquired) await manager.completeDeferredRetirement(params.sessionId);
		}
	};
	const prepareAcquisition = (params) => {
		const fullConfig = loadSessionMcpConfig({
			...params,
			logDiagnostics: false
		});
		const partition = partitionMcpServersByConnectionScope(fullConfig.loaded.mcpServers);
		const { safeServerNamesByServer } = fullConfig;
		return {
			fullConfig,
			...partition,
			safeServerNamesByServer,
			requester: params.requester
		};
	};
	const materializeRequesterScopedRuntime = async (params) => {
		const oauthRequesterNameSet = new Set(params.oauthRequesterServerNames);
		const resolverRequesterNameSet = new Set(params.resolverRequesterServerNames);
		const agentAccountId = normalizeOptionalString(params.agentAccountId);
		const messageChannel = normalizeOptionalString(params.messageChannel);
		const fullScopedFingerprint = loadSessionMcpConfig({
			...params,
			logDiagnostics: false,
			includeServerNames: params.scopedNameSet,
			redactConnectionServerNames: resolverRequesterNameSet
		}).fingerprint;
		const runtime = await install.resolveAndInstallRequesterRuntime({
			...params,
			fullScopedFingerprint,
			oauthRequesterNameSet,
			agentAccountId,
			messageChannel,
			requesterScope: {
				requesterSenderId: params.requesterSenderId,
				...agentAccountId ? { agentAccountId } : {},
				...messageChannel ? { messageChannel } : {}
			}
		});
		return runtime ? leaseRuntime(runtime, params.runtimeKey) : void 0;
	};
	const manager = {
		acquire: acquireCurrent("full", async (params) => {
			const configReloadAtAdmission = store.configReload;
			if (params.sessionKey) store.sessionIdBySessionKey.set(params.sessionKey, params.sessionId);
			const { fullConfig, staticServers, requesterScopedServerNames, oauthRequesterServerNames, resolverRequesterServerNames, safeServerNamesByServer, requester } = prepareAcquisition(params);
			const leases = [];
			try {
				const staticLease = leaseRuntime(await install.getOrCreateRuntimeEntry({
					...params,
					runtimeKey: params.sessionId,
					configReloadAtAdmission,
					excludeServerNames: new Set(requesterScopedServerNames),
					safeServerNamesByServer
				}), params.sessionId);
				leases.push(staticLease);
				if (requesterScopedServerNames.length === 0) return staticLease;
				const parts = Object.keys(staticServers).length > 0 ? [staticLease.runtime] : [];
				const scopedNameSet = new Set(requesterScopedServerNames);
				if (requester) {
					const lease = await materializeRequesterScopedRuntime({
						...params,
						configReloadAtAdmission,
						mcpServers: fullConfig.loaded.mcpServers,
						oauthRequesterServerNames,
						resolverRequesterServerNames,
						scopedNameSet,
						safeServerNamesByServer,
						requesterSenderId: requester.senderId,
						runtimeKey: requester.runtimeKey
					});
					if (lease) {
						leases.push(lease);
						parts.push(lease.runtime);
					}
				}
				return {
					runtime: parts.length === 0 ? staticLease.runtime : createCombinedSessionMcpRuntime({
						sessionId: params.sessionId,
						sessionKey: params.sessionKey,
						workspaceDir: params.workspaceDir,
						agentDir: params.agentDir,
						parts
					}),
					releaseLease: () => leases.forEach((lease) => lease.releaseLease()),
					async retireUnusedServers(retainedServerNames) {
						const failed = (await Promise.allSettled(leases.map(async (lease) => await lease.retireUnusedServers?.(retainedServerNames)))).find((outcome) => outcome.status === "rejected");
						if (failed) throw failed.reason;
					}
				};
			} catch (error) {
				leases.forEach((lease) => lease.releaseLease());
				throw error;
			}
		}),
		acquireRequesterScoped: acquireCurrent("requester", async (params) => {
			const configReloadAtAdmission = store.configReload;
			const { fullConfig, requesterScopedServerNames, oauthRequesterServerNames, resolverRequesterServerNames, safeServerNamesByServer, requester } = prepareAcquisition(params);
			const advertisedCatalogConfigFingerprint = loadSessionMcpConfig({
				...params,
				loaded: fullConfig.loaded,
				logDiagnostics: false,
				redactConnectionServerNames: new Set(requesterScopedServerNames),
				safeServerNamesByServer
			}).fingerprint;
			lifecycle.reconcileAdvertisedScopedCatalogConfig(params.sessionId, advertisedCatalogConfigFingerprint, requester !== void 0 && requesterScopedServerNames.length > 0);
			if (!requester) return;
			if (params.sessionKey) store.sessionIdBySessionKey.set(params.sessionKey, params.sessionId);
			if (requesterScopedServerNames.length === 0) return;
			const scopedNameSet = new Set(requesterScopedServerNames);
			const lease = await materializeRequesterScopedRuntime({
				...params,
				configReloadAtAdmission,
				mcpServers: fullConfig.loaded.mcpServers,
				oauthRequesterServerNames,
				resolverRequesterServerNames,
				scopedNameSet,
				safeServerNamesByServer,
				requesterSenderId: requester.senderId,
				runtimeKey: requester.runtimeKey
			});
			if (!lease) return;
			return {
				...lease,
				advertisedCatalogConfigFingerprint
			};
		}),
		rememberAdvertisedScopedCatalog: lifecycle.rememberAdvertisedScopedCatalog,
		getAdvertisedScopedCatalog: lifecycle.getAdvertisedScopedCatalog,
		bindSessionKey(sessionKey, sessionId) {
			store.sessionIdBySessionKey.set(sessionKey, sessionId);
		},
		resolveSessionId(sessionKey) {
			return store.sessionIdBySessionKey.get(sessionKey);
		},
		peekSession(params) {
			const sessionId = params.sessionId ?? (params.sessionKey ? store.sessionIdBySessionKey.get(params.sessionKey) : void 0);
			return sessionId ? store.runtimesBySessionId.get(sessionId) : void 0;
		},
		disposeSession: lifecycle.disposeManagedRuntimes,
		deferRetirement(sessionId, retirementOpts) {
			if (retirementOpts?.retainAcrossReuse === true) {
				for (const runtimeKey of lifecycle.runtimeKeysForSessionId(sessionId)) {
					const runtime = store.runtimesBySessionId.get(runtimeKey);
					if (runtime) revokeMcpAppModelContext(runtime);
				}
				store.requiredRetirementSessionIds.add(sessionId);
			}
			if (lifecycle.runtimeKeysForSessionId(sessionId).length === 0 && !store.requiredRetirementSessionIds.has(sessionId)) return false;
			store.deferredRetirementSessionIds.add(sessionId);
			return true;
		},
		async completeDeferredRetirement(sessionId, runtime) {
			if (runtime !== void 0 && runtime.sessionId !== sessionId) return false;
			if (!store.deferredRetirementSessionIds.has(sessionId)) {
				for (const runtimeKey of lifecycle.runtimeKeysForSessionId(sessionId)) {
					const current = store.runtimesBySessionId.get(runtimeKey);
					if (current && sessionMcpRuntimeOwners.get(current)?.hasServers() === false) await lifecycle.releaseEmptyRuntimeSlot(runtimeKey, current);
				}
				return false;
			}
			if (lifecycle.totalActiveLeasesForSessionId(sessionId) > 0 || (runtime?.activeLeases ?? 0) > 0) return false;
			const runtimeKeys = lifecycle.runtimeKeysForSessionId(sessionId);
			if (runtimeKeys.length === 0) return false;
			const pendingWork = runtimeKeys.map((runtimeKey) => store.runtimeWorkChains.get(runtimeKey)).filter((work) => work !== void 0);
			if (pendingWork.length > 0) {
				await Promise.allSettled(pendingWork);
				return await manager.completeDeferredRetirement(sessionId, runtime);
			}
			await lifecycle.disposeManagedRuntimes(sessionId, { preserveRequiredRetirement: store.requiredRetirementSessionIds.has(sessionId) });
			return true;
		},
		async reloadConfig(reload) {
			store.configReload = {
				...reload,
				pluginGeneration: (store.configReload?.pluginGeneration ?? 0) + (reload.reloadPlugins ? 1 : 0)
			};
			store.advertisedScopedCatalogBySessionId.clear();
			for (const runtime of store.runtimesBySessionId.values()) {
				const slot = store.runtimeSlots.get(runtime);
				if (slot) slot.idleTtlMs = resolveSessionMcpRuntimeIdleTtlMs(reload.cfg);
			}
			lifecycle.ensureIdleSweepTimer();
			await Promise.all([...store.runtimesBySessionId].map(async ([runtimeKey, runtime]) => {
				const owner = sessionMcpRuntimeOwners.get(runtime);
				await owner?.reload(reload);
				if (owner?.hasServers() === false) await lifecycle.releaseEmptyRuntimeSlot(runtimeKey, runtime);
			}));
		},
		disposeAll: () => lifecycle.disposeManagedRuntimes(),
		sweepIdleRuntimes: lifecycle.sweepIdleRuntimes,
		listSessionIds() {
			return [...new Set(Array.from(store.runtimesBySessionId.values(), (runtime) => runtime.sessionId))].toSorted((a, b) => a.localeCompare(b));
		},
		listRuntimeKeys() {
			return Array.from(store.runtimesBySessionId.keys()).toSorted((a, b) => a.localeCompare(b));
		},
		totalActiveLeasesForSession(sessionId) {
			return lifecycle.totalActiveLeasesForSessionId(sessionId);
		}
	};
	Object.assign(manager, { bookkeepingSizesForTest: () => ({
		runtimes: store.runtimesBySessionId.size,
		connectionMeta: store.connectionMetaByRuntimeKey.size,
		runtimeWorkChains: store.runtimeWorkChains.size,
		sessionKeys: store.sessionIdBySessionKey.size,
		deferredRetirement: store.deferredRetirementSessionIds.size,
		advertisedScopedCatalogs: store.advertisedScopedCatalogBySessionId.size
	}) });
	return manager;
}
//#endregion
//#region src/agents/agent-bundle-mcp-manager-api.ts
/** Module-level session MCP runtime manager entry APIs. */
function getSessionMcpRuntimeManager() {
	return resolveGlobalSingleton(SESSION_MCP_RUNTIME_MANAGER_KEY, createSessionMcpRuntimeManager);
}
function peekSessionMcpRuntimeManager() {
	const globalStore = globalThis;
	return Object.hasOwn(globalStore, SESSION_MCP_RUNTIME_MANAGER_KEY) ? globalStore[SESSION_MCP_RUNTIME_MANAGER_KEY] : void 0;
}
async function acquireSessionMcpRuntime(params) {
	return await getSessionMcpRuntimeManager().acquire(params);
}
/**
* Requester-scoped MCP runtime only (no static partition).
* Shared-thread harnesses use this so static MCP stays harness-native.
*/
async function acquireRequesterScopedMcpRuntime(params) {
	return await getSessionMcpRuntimeManager().acquireRequesterScoped(params);
}
function rememberAdvertisedScopedMcpCatalog(handle, catalog) {
	getSessionMcpRuntimeManager().rememberAdvertisedScopedCatalog(handle, catalog);
}
function getAdvertisedScopedMcpCatalog(sessionId) {
	return getSessionMcpRuntimeManager().getAdvertisedScopedCatalog(sessionId);
}
/** Looks up an existing session MCP runtime without creating it or connecting transports. */
function peekSessionMcpRuntime(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	const sessionKey = normalizeOptionalString(params.sessionKey);
	return peekSessionMcpRuntimeManager()?.peekSession({
		...sessionId ? { sessionId } : {},
		...sessionKey ? { sessionKey } : {}
	});
}
async function retireSessionMcpRuntime(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	if (!sessionId) return false;
	const manager = getSessionMcpRuntimeManager();
	try {
		if (params.preserveActiveLeases === true && manager.deferRetirement(sessionId, { retainAcrossReuse: params.retainAcrossReuse })) await manager.completeDeferredRetirement(sessionId);
		else await manager.disposeSession(sessionId);
		return true;
	} catch (error) {
		params.onError?.(error, sessionId, params.reason);
		return false;
	}
}
/** Releases an acquisition after its consumer has taken ownership, or after failure. */
async function releaseSessionMcpRuntime(lease, retainedServerNames) {
	lease.releaseLease?.();
	try {
		if (retainedServerNames) await lease.retireUnusedServers?.(retainedServerNames);
	} catch (error) {
		logWarn(`bundle-mcp: unused server cleanup failed: ${String(error)}`);
	} finally {
		await completeDeferredSessionMcpRuntimeRetirement(lease.runtime).catch((error) => {
			logWarn(`bundle-mcp: deferred runtime cleanup failed: ${String(error)}`);
		});
	}
}
/** Completes deferred retirement after its final run, view, or request lease releases. */
async function completeDeferredSessionMcpRuntimeRetirement(runtime) {
	return await getSessionMcpRuntimeManager().completeDeferredRetirement(runtime.sessionId, runtime);
}
async function retireSessionMcpRuntimeForSessionKey(params) {
	const sessionKey = normalizeOptionalString(params.sessionKey);
	if (!sessionKey) return false;
	return await retireSessionMcpRuntime({
		sessionId: getSessionMcpRuntimeManager().resolveSessionId(sessionKey),
		reason: params.reason,
		preserveActiveLeases: params.preserveActiveLeases,
		onError: params.onError
	});
}
async function reloadSessionMcpRuntimes(params) {
	await peekSessionMcpRuntimeManager()?.reloadConfig(params);
}
async function disposeAllSessionMcpRuntimes() {
	await getSessionMcpRuntimeManager().disposeAll();
}
function getSessionMcpRuntimeManagerForTesting() {
	return getSessionMcpRuntimeManager();
}
//#endregion
export { getAdvertisedScopedMcpCatalog as a, releaseSessionMcpRuntime as c, retireSessionMcpRuntime as d, retireSessionMcpRuntimeForSessionKey as f, mergeMcpToolCatalogs as h, disposeAllSessionMcpRuntimes as i, reloadSessionMcpRuntimes as l, createCombinedSessionMcpRuntime as m, acquireSessionMcpRuntime as n, getSessionMcpRuntimeManagerForTesting as o, sessionMcpRuntimeOwners as p, completeDeferredSessionMcpRuntimeRetirement as r, peekSessionMcpRuntime as s, acquireRequesterScopedMcpRuntime as t, rememberAdvertisedScopedMcpCatalog as u };
