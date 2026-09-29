import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { r as racePromiseWithAbortSignal } from "../abort-signal-Z3A36sLL.mjs";
import { i as logWarn } from "../logger-BHMMVs5C.mjs";
import { o as getSessionMcpRequestSignal } from "../mcp-app-model-context-nV9u20zq.mjs";
import { n as recordAgentCleanupFailure } from "../run-cleanup-timeout-BlChlpzQ.mjs";
import { h as mergeMcpToolCatalogs, i as disposeAllSessionMcpRuntimes, m as createCombinedSessionMcpRuntime, o as getSessionMcpRuntimeManagerForTesting, p as sessionMcpRuntimeOwners } from "../agent-bundle-mcp-manager-api-jXc1RW7-.mjs";
import { t as loadSessionMcpConfig } from "../agent-bundle-mcp-runtime-config-WTwiCoD-.mjs";
import { a as partitionMcpServersByConnectionScope, i as hashMcpResolvedConnections, n as applyMcpConnectionOverride } from "../mcp-connection-resolver-DZ9VYF6v.mjs";
import { i as isMcpHttpSessionExpired, l as redactMcpDiagnosticError, n as connectMcpClient, r as disposeMcpClient, t as McpClientConnectTimeoutError } from "../mcp-client-lifecycle-CNB8cS4y.mjs";
import { i as resolveProjectedMcpCodexToolApprovalMode, n as normalizeMcpCodexToolAnnotations } from "../mcp-codex-tool-approval-u1CcvKx0.mjs";
import { a as normalizeToolUiVisibility, c as createMcpJsonSchemaValidator, i as buildMcpClientCapabilities, n as normalizeMcpToolCatalog, o as sanitizeMcpMetadataText, r as collectMcpPaginatedItems, s as summarizeServerCapabilities, t as resolveMcpTransport } from "../mcp-transport-DoEl0EB8.mjs";
import { n as normalizeMcpToolFilter, t as isMcpToolAllowed } from "../mcp-tool-filter-BFjsm6Nl.mjs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { ErrorCode, ListToolsResultSchema, McpError } from "@modelcontextprotocol/sdk/types.js";
//#region src/agents/agent-bundle-mcp-runtime.ts
/** Session-scoped MCP runtime catalog loader and transport lifecycle. */
const BUNDLE_MCP_FAILURE_THRESHOLD = 3;
const BUNDLE_MCP_FAILURE_COOLDOWN_MS = 6e4;
const BUNDLE_MCP_CATALOG_FAILURE_RETRY_MS = 5e3;
const BUNDLE_MCP_CATALOG_LIST_TIMEOUT_MS = 1500;
const BUNDLE_MCP_DISPOSE_TIMEOUT_MS = 5e3;
const BUNDLE_MCP_MAX_LIST_PAGES = 128;
const BUNDLE_MCP_MAX_LIST_ITEMS = 16384;
const BUNDLE_MCP_MAX_LIST_BYTES = 10485760;
let bundleMcpCatalogListTimeoutMs;
const BUNDLE_MCP_TEST_STATE_KEY = Symbol.for("openclaw.bundleMcpTestState");
function getBundleMcpTestState() {
	const globalStore = globalThis;
	const existing = globalStore[BUNDLE_MCP_TEST_STATE_KEY];
	if (existing) return existing;
	const state = {};
	globalStore[BUNDLE_MCP_TEST_STATE_KEY] = state;
	return state;
}
async function listAllTools(client, timeoutMs, signal) {
	return await collectMcpPaginatedItems({
		label: "MCP tool listing",
		itemLabel: "tools",
		timeoutMs,
		maxPages: BUNDLE_MCP_MAX_LIST_PAGES,
		maxItems: BUNDLE_MCP_MAX_LIST_ITEMS,
		maxBytes: BUNDLE_MCP_MAX_LIST_BYTES,
		signal,
		loadPage: async ({ cursor, requestTimeoutMs, signal: requestSignal }) => {
			const requestController = new AbortController();
			const onAbort = () => requestController.abort(requestSignal.reason);
			requestSignal.addEventListener("abort", onAbort, { once: true });
			if (requestSignal.aborted) onAbort();
			try {
				const page = await client.request({
					method: "tools/list",
					params: cursor === void 0 ? void 0 : { cursor }
				}, ListToolsResultSchema, {
					timeout: requestTimeoutMs,
					maxTotalTimeout: requestTimeoutMs,
					signal: requestController.signal
				});
				return {
					items: page.tools,
					nextCursor: page.nextCursor,
					serializedValue: page
				};
			} finally {
				requestSignal.removeEventListener("abort", onAbort);
			}
		}
	});
}
function isMcpMethodNotFoundError(error) {
	if (isRecord(error) && error.code === ErrorCode.MethodNotFound) return true;
	const message = String(error);
	return message.includes("-32601") || /\b(?:method not found|unknown method)\b/i.test(message);
}
function hasConfiguredMcpRequestTimeout(rawServer) {
	if (!rawServer || typeof rawServer !== "object") return false;
	const record = rawServer;
	for (const key of ["requestTimeoutMs", "timeout"]) {
		const value = record[key];
		if (typeof value === "number" && Number.isFinite(value) && value > 0) return true;
	}
	return false;
}
function getCatalogListTimeoutMs(rawServer, requestTimeoutMs) {
	if (bundleMcpCatalogListTimeoutMs !== void 0) return bundleMcpCatalogListTimeoutMs;
	return hasConfiguredMcpRequestTimeout(rawServer) ? requestTimeoutMs : BUNDLE_MCP_CATALOG_LIST_TIMEOUT_MS;
}
function setBundleMcpCatalogListTimeoutMsForTest(timeoutMs) {
	bundleMcpCatalogListTimeoutMs = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
function setBundleMcpDisposeTimeoutMsForTest(timeoutMs) {
	getBundleMcpTestState().disposeTimeoutMs = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
function disposeBundleMcpSession(session) {
	return disposeMcpClient(session, getBundleMcpTestState().disposeTimeoutMs ?? BUNDLE_MCP_DISPOSE_TIMEOUT_MS);
}
function createDisposedError(sessionId) {
	return /* @__PURE__ */ new Error(`bundle-mcp runtime disposed for session ${sessionId}`);
}
function createSessionMcpRuntime(params, previous = /* @__PURE__ */ new Map()) {
	const declared = loadSessionMcpConfig({
		...params,
		includeServerNames: void 0,
		excludeServerNames: void 0,
		logDiagnostics: true
	});
	const config = loadSessionMcpConfig({
		...params,
		loaded: declared.loaded,
		safeServerNamesByServer: declared.safeServerNamesByServer,
		logDiagnostics: false
	});
	const safeNames = declared.safeServerNamesByServer;
	const configForServer = (serverName, nextParams = params, loaded = config.loaded) => {
		const connection = nextParams.connectionOverrides?.get(serverName);
		const serverConfig = loadSessionMcpConfig({
			...nextParams,
			loaded,
			logDiagnostics: false,
			includeServerNames: /* @__PURE__ */ new Set([serverName]),
			excludeServerNames: void 0,
			safeServerNamesByServer: /* @__PURE__ */ new Map([[serverName, safeNames.get(serverName)]]),
			toolOverrides: {
				...nextParams.toolOverrides,
				mcpToolsDeny: Object.fromEntries(Object.entries(nextParams.toolOverrides?.mcpToolsDeny ?? {}).filter(([name]) => name === serverName))
			}
		});
		if (connection) serverConfig.fingerprint += `:${hashMcpResolvedConnections(/* @__PURE__ */ new Map([[serverName, connection]]))}`;
		return serverConfig;
	};
	const owned = /* @__PURE__ */ new Map();
	for (const serverName of Object.keys(config.loaded.mcpServers)) {
		const serverConfig = configForServer(serverName);
		const fingerprint = serverConfig.fingerprint;
		const existing = previous.get(serverName);
		if (existing?.configFingerprint === fingerprint && existing.workspaceDir === params.workspaceDir && existing.agentDir === params.agentDir) {
			owned.set(serverName, existing);
			previous.delete(serverName);
		} else owned.set(serverName, createServerMcpRuntime({
			...params,
			serverName,
			serverConfig,
			safeServerNamesByServer: safeNames,
			configFingerprint: fingerprint
		}));
	}
	const requesterConnect = params.requesterConnect;
	const connectFingerprints = new Map(Object.keys(requesterConnect?.catalog.servers ?? {}).map((name) => [name, configForServer(name, params, declared.loaded).fingerprint]));
	let invalidated = false;
	let pendingDisposal = Promise.resolve();
	let cleanupFailure;
	const disposeParts = (parts) => {
		pendingDisposal = Promise.allSettled([pendingDisposal, ...parts.map(async (part) => {
			await part.dispose();
			if (!part.joinCleanup) throw new Error("MCP runtime does not expose cleanup ownership");
			await part.joinCleanup();
		})]).then((results) => {
			cleanupFailure ??= results.find((result) => result.status === "rejected");
		});
		return pendingDisposal;
	};
	const runtime = createCombinedSessionMcpRuntime({
		...params,
		parts: [...owned.values()],
		serverOwners: new Map(owned)
	});
	runtime.configFingerprint = params.configFingerprint ?? config.fingerprint;
	runtime.requesterScope = params.requesterScope;
	runtime.requesterConnect = requesterConnect && {
		...requesterConnect,
		get catalog() {
			const catalog = requesterConnect.catalog;
			return {
				...catalog,
				servers: Object.fromEntries(Object.entries(catalog.servers).filter(([name]) => connectFingerprints.has(name))),
				tools: catalog.tools.filter((tool) => connectFingerprints.has(tool.serverName))
			};
		},
		createExecute(serverName) {
			const execute = requesterConnect.createExecute(serverName);
			return execute && (async (...args) => {
				if (!connectFingerprints.has(serverName)) throw createDisposedError(params.sessionId);
				return await execute(...args);
			});
		}
	};
	runtime.mcpAppsEnabled = params.cfg?.mcp?.apps?.enabled === true;
	const joinParts = runtime.joinCleanup;
	runtime.joinCleanup = async () => {
		await pendingDisposal;
		try {
			await joinParts?.();
		} catch (error) {
			cleanupFailure ??= {
				status: "rejected",
				reason: error
			};
		}
		if (cleanupFailure) {
			recordAgentCleanupFailure();
			throw cleanupFailure.reason;
		}
	};
	runtime.dispose = async () => {
		connectFingerprints.clear();
		invalidated = true;
		const retired = [...owned.values()];
		owned.clear();
		sessionMcpRuntimeOwners.delete(runtime);
		await disposeParts(retired);
		if (cleanupFailure) recordAgentCleanupFailure();
	};
	sessionMcpRuntimeOwners.set(runtime, {
		hasServers: () => owned.size > 0,
		isCurrent: () => !invalidated,
		replace: (nextParams) => createSessionMcpRuntime(nextParams, owned),
		async retireUnusedServers(retainedServerNames) {
			if (invalidated) return;
			const retired = [];
			for (const [serverName, part] of owned) if (!retainedServerNames.has(serverName) && (part.activeLeases ?? 0) === 0) {
				owned.delete(serverName);
				retired.push(part);
			}
			if (retired.length === 0) return;
			invalidated = true;
			await disposeParts(retired);
			if (cleanupFailure) recordAgentCleanupFailure();
		},
		async reload({ cfg, manifestRegistry, reloadPlugins }) {
			const nextParams = {
				...params,
				cfg,
				manifestRegistry
			};
			const nextConfig = loadSessionMcpConfig({
				...nextParams,
				includeServerNames: void 0,
				excludeServerNames: void 0,
				safeServerNamesByServer: void 0,
				logDiagnostics: false
			});
			const nextSafeNames = nextConfig.safeServerNamesByServer;
			const { requesterScopedServerNames } = partitionMcpServersByConnectionScope(nextConfig.loaded.mcpServers);
			for (const [name, fingerprint] of connectFingerprints) if (reloadPlugins && !Object.hasOwn(params.cfg?.mcp?.servers ?? {}, name) || cfg.gateway?.publicOrigin !== params.cfg?.gateway?.publicOrigin || configForServer(name, nextParams, nextConfig.loaded).fingerprint !== fingerprint || nextSafeNames.get(name) !== safeNames.get(name)) {
				invalidated = true;
				connectFingerprints.delete(name);
			}
			const retired = [];
			for (const [serverName, part] of owned) if (reloadPlugins && part.pluginOwned || !Object.hasOwn(nextConfig.loaded.mcpServers, serverName) || requesterScopedServerNames.includes(serverName) !== Boolean(params.requesterScope) || nextSafeNames.get(serverName) !== safeNames.get(serverName) || configForServer(serverName, nextParams, nextConfig.loaded).fingerprint !== part.configFingerprint) {
				invalidated = true;
				owned.delete(serverName);
				retired.push(part);
			}
			await disposeParts(retired);
		}
	});
	return runtime;
}
function createServerMcpRuntime(params) {
	const { loaded, fingerprint: computedFingerprint } = params.serverConfig;
	const serverName = params.serverName;
	const configFingerprint = params.configFingerprint ?? computedFingerprint;
	const mcpAppsEnabled = params.cfg?.mcp?.apps?.enabled === true;
	const createdAt = Date.now();
	let lastUsedAt = createdAt;
	let activeLeases = 0;
	let retiredCatalog;
	const lifecycleAbortController = new AbortController();
	let catalog = null;
	let catalogRetryAfterMs;
	let catalogInFlight;
	let catalogInvalidationGeneration = 0;
	const invalidateCatalog = () => {
		catalogInvalidationGeneration += 1;
		catalog = null;
		catalogRetryAfterMs = void 0;
	};
	const scheduleCatalogServerRetry = (message) => {
		const currentCatalog = catalog;
		const server = currentCatalog?.servers[serverName];
		const existing = currentCatalog?.diagnostics?.[0];
		if (!currentCatalog) {
			invalidateCatalog();
			return;
		}
		let diagnostic;
		if (existing) diagnostic = {
			...existing,
			message
		};
		else if (server) diagnostic = {
			serverName,
			safeServerName: server.safeServerName ?? serverName,
			launchSummary: server.launchSummary,
			message
		};
		else {
			invalidateCatalog();
			return;
		}
		catalogInvalidationGeneration += 1;
		catalog = {
			...currentCatalog,
			diagnostics: [diagnostic]
		};
		catalogRetryAfterMs = Date.now();
	};
	const catalogRetryIsDue = () => catalogRetryAfterMs !== void 0 && Date.now() >= catalogRetryAfterMs;
	let currentSession;
	let disposal;
	let cleanupFailed = false;
	const pendingDisposals = /* @__PURE__ */ new Set();
	const disposeSession = (session) => {
		if (session.disposePromise) return session.disposePromise;
		const closing = disposeBundleMcpSession(session).then((outcome) => {
			if (outcome === "uncertain") {
				cleanupFailed = true;
				recordAgentCleanupFailure();
			}
		}).catch((error) => {
			cleanupFailed = true;
			recordAgentCleanupFailure();
			throw error;
		}).finally(() => pendingDisposals.delete(closing));
		session.disposePromise = closing;
		pendingDisposals.add(closing);
		return closing;
	};
	let serverBackoff;
	const recordServerToolFailure = (session, nowMs) => {
		if (currentSession !== session || session.retiring) return;
		const previous = serverBackoff;
		const failures = (previous?.session === session ? previous.failures : 0) + 1;
		const nextBackoff = {
			session,
			failures
		};
		if (failures >= BUNDLE_MCP_FAILURE_THRESHOLD) nextBackoff.retryAfterMs = nowMs + BUNDLE_MCP_FAILURE_COOLDOWN_MS;
		serverBackoff = nextBackoff;
		return failures;
	};
	const failIfDisposed = () => {
		if (retiredCatalog) throw createDisposedError(params.sessionId);
	};
	const requireConnectedSession = () => {
		const session = currentSession;
		if (!session || !session.connected) throw new Error(session?.disconnectReason ? `bundle-mcp server "${serverName}" is disconnected: ${session.disconnectReason}` : `bundle-mcp server "${serverName}" is not connected`);
		return session;
	};
	const ensureSessionConnected = async (session, connectionTimeoutMs) => {
		if (session.retiring) throw new Error(`bundle-mcp server "${session.serverName}" is retiring`);
		if (session.connected) return;
		session.connectPromise ??= connectMcpClient({
			client: session.client,
			transport: session.transport,
			timeoutMs: connectionTimeoutMs
		}).catch((error) => {
			if (error instanceof McpClientConnectTimeoutError) throw new Error(`MCP server "${session.serverName}" timed out: did not complete initialize within ${connectionTimeoutMs / 1e3}s`, { cause: error });
			throw error;
		}).then(() => {
			session.connected = true;
		}).finally(() => {
			session.connectPromise = void 0;
		});
		await session.connectPromise;
	};
	const retireSessionIfCurrent = async (session) => {
		if (currentSession !== session) return false;
		session.retiring = true;
		currentSession = void 0;
		await disposeSession(session);
		return true;
	};
	const localRequestTimeouts = /* @__PURE__ */ new WeakSet();
	const runMcpRequest = async (session, request, parentSignal) => {
		const requestSignal = parentSignal ?? getSessionMcpRequestSignal();
		const abortController = new AbortController();
		const onParentAbort = () => abortController.abort(requestSignal?.reason);
		if (requestSignal?.aborted) onParentAbort();
		else requestSignal?.addEventListener("abort", onParentAbort, { once: true });
		const timeoutError = new McpError(ErrorCode.RequestTimeout, "Request timed out", { timeout: session.requestTimeoutMs });
		const timeout = setTimeout(() => {
			localRequestTimeouts.add(timeoutError);
			abortController.abort(timeoutError);
		}, session.requestTimeoutMs);
		timeout.unref?.();
		try {
			const signal = abortController.signal;
			signal.throwIfAborted();
			const result = await request(signal);
			requestSignal?.throwIfAborted();
			return result;
		} catch (error) {
			requestSignal?.throwIfAborted();
			throw error;
		} finally {
			requestSignal?.removeEventListener("abort", onParentAbort);
			clearTimeout(timeout);
		}
	};
	const runGuardedServerRequest = async (session, request, options) => {
		const requestSignal = getSessionMcpRequestSignal();
		const tracksFailureBackoff = options?.failureBackoff !== "ignore";
		const nowMs = Date.now();
		const backoff = serverBackoff;
		if (tracksFailureBackoff && backoff?.session === session && backoff.retryAfterMs && nowMs < backoff.retryAfterMs) throw new Error(`bundle-mcp server "${serverName}" is paused after repeated tool failures; retry after ${new Date(backoff.retryAfterMs).toISOString()}`);
		if (backoff && backoff.session !== session) serverBackoff = void 0;
		try {
			const result = await request();
			if (tracksFailureBackoff && serverBackoff?.session === session) serverBackoff = void 0;
			return result;
		} catch (error) {
			const sessionExpired = isMcpHttpSessionExpired(session, error);
			let recycleReason;
			if (sessionExpired && !requestSignal?.aborted) recycleReason = "expired HTTP session";
			else if (tracksFailureBackoff && !requestSignal?.aborted) {
				const failures = recordServerToolFailure(session, nowMs);
				if (error !== null && typeof error === "object" && localRequestTimeouts.has(error) && failures && failures >= BUNDLE_MCP_FAILURE_THRESHOLD) recycleReason = "repeated request timeouts";
			}
			if (recycleReason) {
				serverBackoff = void 0;
				scheduleCatalogServerRetry(recycleReason);
				const timedOut = recycleReason === "repeated request timeouts";
				logWarn(`bundle-mcp: recycling server "${serverName}" after ${timedOut ? "repeated timeouts" : "an expired HTTP session"}`);
				retireSessionIfCurrent(session).catch((retireError) => {
					logWarn(`bundle-mcp: failed to retire ${timedOut ? "timed-out" : "expired-session"} server "${serverName}": ${redactMcpDiagnosticError(retireError)}`);
				});
			}
			throw error;
		}
	};
	const runGuardedMcpRequest = (session, request, options) => runGuardedServerRequest(session, () => runMcpRequest(session, request), options);
	const collectServerItems = (session, kind) => {
		const callerSignal = getSessionMcpRequestSignal();
		return collectMcpPaginatedItems({
			label: `MCP ${kind === "resources" ? "resource" : "prompt"} listing`,
			itemLabel: kind,
			timeoutMs: session.requestTimeoutMs,
			maxPages: BUNDLE_MCP_MAX_LIST_PAGES,
			maxItems: BUNDLE_MCP_MAX_LIST_ITEMS,
			maxBytes: BUNDLE_MCP_MAX_LIST_BYTES,
			signal: callerSignal ? AbortSignal.any([lifecycleAbortController.signal, callerSignal]) : lifecycleAbortController.signal,
			loadPage: ({ cursor, requestTimeoutMs: timeout, signal }) => runMcpRequest(session, async (requestSignal) => {
				const requestParams = cursor === void 0 ? void 0 : { cursor };
				const requestOptions = {
					timeout,
					maxTotalTimeout: timeout,
					signal: requestSignal
				};
				const page = kind === "resources" ? await session.client.listResources(requestParams, requestOptions) : await session.client.listPrompts(requestParams, requestOptions);
				return {
					items: page[kind],
					nextCursor: page.nextCursor,
					serializedValue: page
				};
			}, signal)
		});
	};
	const loadCatalog = async () => {
		failIfDisposed();
		if (catalogInFlight) return catalogInFlight;
		const catalogGeneration = catalogInvalidationGeneration;
		const inFlight = (async () => {
			const rawServer = loaded.mcpServers[serverName];
			const override = params.connectionOverrides?.get(serverName);
			const transportSource = override ? applyMcpConnectionOverride(rawServer, override) : rawServer;
			const resolved = resolveMcpTransport(serverName, transportSource, {
				cfg: params.cfg,
				agentDir: params.agentDir,
				prepareDataDir: loaded.prepareDataDirsByServer?.[serverName]?.dataDir,
				requesterScope: params.requesterScope
			});
			if (!resolved) return {
				version: 1,
				generatedAt: Date.now(),
				servers: {},
				tools: []
			};
			const safeServerName = params.safeServerNamesByServer?.get(serverName) ?? serverName;
			const launchDescription = override ? `${serverName}: requester-scoped connection` : resolved.description;
			failIfDisposed();
			let session = currentSession;
			while (session && !session.retiring && !session.connected && !session.connectPromise) {
				await retireSessionIfCurrent(session);
				session = currentSession;
			}
			if (session?.retiring) session = void 0;
			const reusedSession = Boolean(session);
			const schemaValidator = createMcpJsonSchemaValidator();
			if (!session) {
				const client = new Client({
					name: "openclaw-bundle-mcp",
					version: "0.0.0"
				}, {
					capabilities: buildMcpClientCapabilities(mcpAppsEnabled),
					jsonSchemaValidator: schemaValidator,
					listChanged: { tools: {
						autoRefresh: false,
						debounceMs: 0,
						onChanged: (error) => {
							if (error) logWarn(`bundle-mcp: failed to refresh changed tool list for server "${serverName}": ${redactMcpDiagnosticError(error)}`);
							invalidateCatalog();
						}
					} }
				});
				const createdSession = {
					serverName,
					client,
					transport: resolved.transport,
					transportType: resolved.transportType,
					requestTimeoutMs: resolved.requestTimeoutMs,
					connected: false,
					retiring: false,
					detachStderr: resolved.detachStderr
				};
				client.onclose = () => {
					const wasConnected = createdSession.connected;
					createdSession.connected = false;
					createdSession.disconnectReason = "mcp transport closed";
					if (wasConnected && !retiredCatalog && !createdSession.retiring && currentSession === createdSession) {
						scheduleCatalogServerRetry("mcp transport closed");
						logWarn(`bundle-mcp: server "${serverName}" closed; next request reconnects`);
					}
				};
				session = createdSession;
				currentSession = session;
			}
			try {
				failIfDisposed();
				await ensureSessionConnected(session, resolved.connectionTimeoutMs);
				failIfDisposed();
				const capabilities = summarizeServerCapabilities(session.client.getServerCapabilities());
				let listedTools;
				try {
					listedTools = await listAllTools(session.client, getCatalogListTimeoutMs(rawServer, resolved.requestTimeoutMs), lifecycleAbortController.signal);
				} catch (error) {
					if (!capabilities.tools && (capabilities.resources || capabilities.prompts) && isMcpMethodNotFoundError(error)) listedTools = [];
					else throw error;
				}
				failIfDisposed();
				const toolFilter = normalizeMcpToolFilter(isRecord(rawServer) ? rawServer.toolFilter : void 0);
				const denialMap = params.toolOverrides?.mcpToolsDeny;
				const deniedToolNames = new Set(denialMap && Object.hasOwn(denialMap, serverName) ? denialMap[serverName] : []);
				const normalizedTools = normalizeMcpToolCatalog(listedTools, schemaValidator, (toolName) => {
					if (!isMcpToolAllowed(toolFilter, toolName)) return "exclude";
					return deniedToolNames.has(toolName) ? "denied" : "include";
				});
				session.toolMetadata = normalizedTools.metadata;
				const exposedTools = normalizedTools.tools;
				const serverEntry = {
					serverName,
					safeServerName,
					launchSummary: launchDescription,
					toolCount: exposedTools.length,
					requestTimeoutMs: resolved.requestTimeoutMs,
					supportsParallelToolCalls: resolved.supportsParallelToolCalls,
					...capabilities.resources ? { resources: capabilities.resources } : {},
					...capabilities.prompts ? { prompts: capabilities.prompts } : {},
					...capabilities.tools ? { tools: {
						...capabilities.tools,
						...exposedTools.length !== listedTools.length ? { filteredCount: listedTools.length - exposedTools.length } : {}
					} } : {},
					...toolFilter ? { toolFilter } : {},
					...deniedToolNames.size > 0 ? { deniedToolNames: [...deniedToolNames].toSorted() } : {},
					codexApprovalMode: resolveProjectedMcpCodexToolApprovalMode(serverName, rawServer)
				};
				const toolEntries = [];
				const policyToolEntries = [];
				for (const [tool, excludedFromOpenClawCatalog, deniedBySession] of [
					...normalizedTools.tools.map((entry) => [
						entry,
						false,
						false
					]),
					...normalizedTools.deniedTools.map((entry) => [
						entry,
						false,
						true
					]),
					...normalizedTools.excludedTools.map((entry) => [
						entry,
						true,
						deniedToolNames.has(entry.name)
					])
				]) {
					const toolName = tool.name;
					const { _meta: metadata } = tool;
					const uiMeta = metadata?.ui && typeof metadata.ui === "object" && !Array.isArray(metadata.ui) ? metadata.ui : void 0;
					const rawResourceUri = uiMeta?.resourceUri ?? metadata?.["ui/resourceUri"];
					const uiResourceUri = typeof rawResourceUri === "string" && rawResourceUri.startsWith("ui://") ? rawResourceUri : void 0;
					const uiVisibility = normalizeToolUiVisibility(uiMeta?.visibility);
					const entry = {
						serverName,
						safeServerName,
						toolName,
						title: tool.title,
						description: sanitizeMcpMetadataText(tool.description),
						inputSchema: tool.inputSchema,
						fallbackDescription: `Provided by bundle MCP server "${serverName}" (${launchDescription}).`,
						...uiResourceUri ? { uiResourceUri } : {},
						...uiVisibility ? { uiVisibility } : {},
						...excludedFromOpenClawCatalog ? { excludedFromOpenClawCatalog: true } : {},
						...deniedBySession ? { deniedBySession: true } : {},
						codexAnnotations: normalizeMcpCodexToolAnnotations(tool.annotations)
					};
					policyToolEntries.push(entry);
					if (!entry.excludedFromOpenClawCatalog) toolEntries.push(entry);
				}
				return {
					version: 1,
					generatedAt: Date.now(),
					servers: { [serverName]: serverEntry },
					tools: toolEntries.filter((tool) => !tool.deniedBySession),
					policyTools: policyToolEntries,
					sessionDeniedTools: toolEntries.filter((tool) => tool.deniedBySession)
				};
			} catch (error) {
				const message = redactMcpDiagnosticError(error);
				if (!retiredCatalog) logWarn(`bundle-mcp: failed to ${reusedSession ? "refresh" : "start"} server "${serverName}" (${launchDescription}): ${message}`);
				const diags = [{
					serverName,
					safeServerName,
					launchSummary: launchDescription,
					message
				}];
				if (!session.connected || isMcpHttpSessionExpired(session, error)) await retireSessionIfCurrent(session);
				else if (!reusedSession && catalogInvalidationGeneration === catalogGeneration) await retireSessionIfCurrent(session);
				failIfDisposed();
				return {
					version: 1,
					generatedAt: Date.now(),
					servers: {},
					tools: [],
					diagnostics: diags
				};
			}
		})();
		catalogInFlight = inFlight;
		try {
			const nextCatalog = await inFlight;
			failIfDisposed();
			if (catalogInvalidationGeneration === catalogGeneration) {
				catalog = nextCatalog;
				catalogRetryAfterMs = nextCatalog.diagnostics?.length ? Date.now() + BUNDLE_MCP_CATALOG_FAILURE_RETRY_MS : void 0;
			}
			return nextCatalog;
		} finally {
			if (catalogInFlight === inFlight) catalogInFlight = void 0;
		}
	};
	const getCatalog = async () => {
		failIfDisposed();
		if (catalog && !catalogRetryIsDue()) return catalog;
		if (!catalog) {
			await loadCatalog();
			if (catalog) return catalog;
			const replayedCatalog = await loadCatalog();
			return catalog ?? replayedCatalog;
		}
		const staleCatalog = catalog;
		catalogRetryAfterMs = void 0;
		loadCatalog().catch(() => {
			if (!retiredCatalog && catalog === staleCatalog && catalogRetryAfterMs === void 0) catalogRetryAfterMs = Date.now() + BUNDLE_MCP_CATALOG_FAILURE_RETRY_MS;
		});
		return staleCatalog;
	};
	const getActiveSession = async (requestedServer) => {
		if (requestedServer !== serverName) throw new Error(`bundle-mcp server "${requestedServer}" is not connected`);
		const signal = getSessionMcpRequestSignal();
		signal?.throwIfAborted();
		await racePromiseWithAbortSignal(getCatalog(), signal);
		return requireConnectedSession();
	};
	return {
		pluginOwned: !Object.hasOwn(params.cfg?.mcp?.servers ?? {}, serverName) || params.connectionOverrides?.has(serverName) === true,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: params.workspaceDir,
		agentDir: params.agentDir,
		configFingerprint,
		...params.requesterScope ? { requesterScope: params.requesterScope } : {},
		...params.requesterConnect ? { requesterConnect: params.requesterConnect } : {},
		isRequesterScopedServer: () => params.requesterScope !== void 0,
		mcpAppsEnabled,
		createdAt,
		get lastUsedAt() {
			return lastUsedAt;
		},
		get activeLeases() {
			return activeLeases;
		},
		acquireLease() {
			activeLeases += 1;
			let released = false;
			return () => {
				if (released) return;
				released = true;
				activeLeases = Math.max(0, activeLeases - 1);
			};
		},
		getCatalog,
		get retiredCatalog() {
			return retiredCatalog;
		},
		/** Synchronous catalog snapshot only; must not connect transports or issue tools/list. */
		peekCatalog() {
			return catalog;
		},
		/** Session-owned timeout that survives catalog invalidation. */
		getServerRequestTimeoutMs(requestedServer) {
			return requestedServer === serverName ? currentSession?.requestTimeoutMs : void 0;
		},
		markUsed() {
			lastUsedAt = Date.now();
		},
		async callTool(requestedServer, toolName, input) {
			const session = await getActiveSession(requestedServer);
			const validateResult = session.toolMetadata?.validatorForCall(toolName);
			const result = await runGuardedMcpRequest(session, (signal) => session.client.callTool({
				name: toolName,
				arguments: isRecord(input) ? input : {}
			}, void 0, {
				timeout: session.requestTimeoutMs,
				signal
			}));
			validateResult?.(result);
			return result;
		},
		async listTools(requestedServer, requestParams) {
			const session = await getActiveSession(requestedServer);
			return await runGuardedMcpRequest(session, (signal) => session.client.request({
				method: "tools/list",
				params: requestParams
			}, ListToolsResultSchema, {
				timeout: session.requestTimeoutMs,
				signal
			}));
		},
		async listResources(requestedServer, options) {
			const session = await getActiveSession(requestedServer);
			return await runGuardedServerRequest(session, async () => collectServerItems(session, "resources"), options);
		},
		async readResource(requestedServer, uri, options) {
			const session = await getActiveSession(requestedServer);
			return await runGuardedMcpRequest(session, (signal) => session.client.readResource({ uri }, {
				timeout: session.requestTimeoutMs,
				signal
			}), options);
		},
		async listResourceTemplates(requestedServer, requestParams) {
			const session = await getActiveSession(requestedServer);
			return await runGuardedMcpRequest(session, (signal) => session.client.listResourceTemplates(requestParams, {
				timeout: session.requestTimeoutMs,
				signal
			}));
		},
		async listPrompts(requestedServer) {
			const session = await getActiveSession(requestedServer);
			return await runGuardedServerRequest(session, async () => collectServerItems(session, "prompts"));
		},
		async getPrompt(requestedServer, name, args) {
			const session = await getActiveSession(requestedServer);
			return await runGuardedMcpRequest(session, (signal) => session.client.getPrompt({
				name,
				...args ? { arguments: args } : {}
			}, {
				timeout: session.requestTimeoutMs,
				signal
			}));
		},
		async joinCleanup() {
			await disposal;
			await Promise.allSettled(pendingDisposals);
			if (cleanupFailed) {
				recordAgentCleanupFailure();
				throw new Error("MCP runtime cleanup could not confirm closure");
			}
		},
		dispose() {
			if (!disposal) {
				retiredCatalog = {
					version: 1,
					generatedAt: Date.now(),
					servers: {},
					tools: [],
					diagnostics: [{
						serverName,
						safeServerName: params.safeServerNamesByServer?.get(serverName) ?? serverName,
						launchSummary: serverName,
						message: "MCP server runtime retired; retry discovery on the next turn."
					}]
				};
				lifecycleAbortController.abort(createDisposedError(params.sessionId));
				catalog = null;
				catalogRetryAfterMs = void 0;
				const pendingCatalog = catalogInFlight;
				catalogInFlight = void 0;
				const session = currentSession;
				currentSession = void 0;
				disposal = (async () => {
					if (session) await disposeSession(session).catch(() => void 0);
					await pendingCatalog?.catch(() => void 0);
					await Promise.allSettled(pendingDisposals);
				})();
			}
			disposal.then(() => {
				if (cleanupFailed) recordAgentCleanupFailure();
			});
			return disposal;
		}
	};
}
const testing = {
	buildMcpClientCapabilities,
	async resetSessionMcpRuntimeManager() {
		await disposeAllSessionMcpRuntimes();
		setBundleMcpCatalogListTimeoutMsForTest();
		setBundleMcpDisposeTimeoutMsForTest();
	},
	getCachedSessionIds() {
		return getSessionMcpRuntimeManagerForTesting().listSessionIds();
	},
	getCachedRuntimeKeys() {
		return getSessionMcpRuntimeManagerForTesting().listRuntimeKeys();
	},
	getBookkeepingSizes(manager) {
		return manager.bookkeepingSizesForTest?.() ?? {};
	},
	setBundleMcpCatalogListTimeoutMsForTest,
	setBundleMcpDisposeTimeoutMsForTest,
	mergeMcpToolCatalogs
};
//#endregion
export { createMcpJsonSchemaValidator as createBundleMcpJsonSchemaValidator, createSessionMcpRuntime, testing };
