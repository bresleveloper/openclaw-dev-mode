import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { O as listAgentIds, a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import "./errors-DnjwnOju.mjs";
import { T as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-DbgWcCyV.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import "./config-Ciq2mxdN.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-Czo5mOSj.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Do as validateToolsEffectiveParams } from "./src-BRUl7oDv.mjs";
import { i as logWarn, t as logDebug } from "./logger-BHMMVs5C.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { s as peekSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-jXc1RW7-.mjs";
import { n as resolveSessionMcpConfigSummary } from "./agent-bundle-mcp-runtime-config-WTwiCoD-.mjs";
import { c as getActivePluginChannelRegistryVersion, d as getActivePluginRegistryVersion } from "./runtime-BvdPUus5.mjs";
import { n as getRegisteredAgentHarness } from "./registry-aYyey5ds.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DpaqT_qU.mjs";
import { o as resolveReplyToMode } from "./reply-threading-lgVuxEkY.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-Z1HiwFXK.mjs";
import { t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-Cvwg99KJ.mjs";
import "./agent-bundle-mcp-tools-sYSmxaoq.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-CET85wnK.mjs";
import { n as filterRuntimeCompatibleTools } from "./tool-schema-projection-D9z9oa3w.mjs";
import { n as normalizeAgentRuntimeTools } from "./tools-BDXkXw9E.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-DOxCMP7W.mjs";
import { n as getConnectedNodePluginToolsVersion } from "./node-plugin-tool-snapshot-CrUFRJIH.mjs";
import { a as resolveEffectiveToolRawDescription, i as resolveEffectiveToolLabel, o as summarizeEffectiveToolDescription, r as disambiguateEffectiveToolLabels } from "./tools-effective-inventory-build-9qyVnHeA.mjs";
import { i as buildEffectiveToolInventoryGroups, r as resolveEffectiveToolInventory, t as acquireEffectiveToolInventoryRuntimeModelContext } from "./tools-effective-inventory-C1TPpMKB.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
//#region src/agents/tools-effective-mcp-inventory.ts
const BUNDLE_MCP_PLUGIN_ID = "bundle-mcp";
function buildMcpUnsupportedToolSchemaNotice(diagnostic) {
	return {
		id: `unsupported-tool-schema:${diagnostic.toolName}`,
		severity: "warning",
		message: `Tool "${diagnostic.toolName}" from plugin "${BUNDLE_MCP_PLUGIN_ID}" has an unsupported runtime input schema (${diagnostic.violations.join(", ")}) and was quarantined before model projection. Fix or disable the owner, or remove the tool from active allowlists.`
	};
}
function buildMcpToolInventoryEntries(tools) {
	return disambiguateEffectiveToolLabels(tools.map((tool) => {
		const mcp = getPluginToolMeta(tool)?.mcp;
		return {
			id: tool.name,
			label: resolveEffectiveToolLabel(tool),
			description: summarizeEffectiveToolDescription(tool),
			rawDescription: resolveEffectiveToolRawDescription(tool) || summarizeEffectiveToolDescription(tool),
			source: "mcp",
			pluginId: BUNDLE_MCP_PLUGIN_ID,
			...mcp ? {
				mcpServer: mcp.serverName,
				mcpToolName: mcp.toolName,
				...mcp.deniedBySession ? { deniedBySession: true } : {}
			} : {}
		};
	}).toSorted((a, b) => a.label.localeCompare(b.label)), (entry) => entry.pluginId ?? entry.id);
}
/** Builds the runtime-compatible MCP tool inventory and quarantine notices. */
function buildRuntimeCompatibleMcpToolInventory(params) {
	const preNormalizationDiagnostics = [];
	const normalizedTools = normalizeAgentRuntimeTools({
		tools: params.tools,
		provider: params.modelProvider ?? "",
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		modelId: params.modelId,
		modelApi: params.modelApi ?? void 0,
		model: params.runtimeModel,
		allowProviderRuntimePluginLoad: false,
		onPreNormalizationSchemaDiagnostics: (diagnostics) => preNormalizationDiagnostics.push(...diagnostics)
	});
	const projection = filterRuntimeCompatibleTools(normalizedTools);
	const diagnostics = [...preNormalizationDiagnostics, ...projection.diagnostics];
	return {
		entries: buildMcpToolInventoryEntries(projection.tools),
		notices: diagnostics.map(buildMcpUnsupportedToolSchemaNotice)
	};
}
//#endregion
//#region src/gateway/server-methods/tools-effective.ts
const defaultToolsEffectiveDependencies = {
	applyFinalEffectiveToolPolicy,
	buildBundleMcpToolsFromCatalog,
	deliveryContextFromSession,
	getActivePluginChannelRegistryVersion,
	getActivePluginRegistryVersion,
	getConnectedNodePluginToolsVersion,
	getRegisteredAgentHarness,
	listAgentIds,
	loadGatewaySessionEntryReadOnly,
	peekSessionMcpRuntime,
	resolveAgentDir,
	resolveAgentWorkspaceDir,
	resolveEffectiveToolInventory,
	acquireEffectiveToolInventoryRuntimeModelContext,
	resolveReplyToMode,
	resolveRuntimeConfigCacheKey,
	resolveSessionAgentId,
	resolveSessionMcpConfigSummary,
	resolveSessionModelRef
};
const TOOLS_EFFECTIVE_FRESH_TTL_MS = 1e4;
const TOOLS_EFFECTIVE_STALE_TTL_MS = 12e4;
const TOOLS_EFFECTIVE_SLOW_LOG_MS = 250;
const TOOLS_EFFECTIVE_CACHE_LIMIT = 128;
const MCP_CONFIG_SUMMARY_CACHE_LIMIT = 128;
let nowForToolsEffectiveCache = () => Date.now();
const toolsEffectiveCache = /* @__PURE__ */ new Map();
const toolsEffectiveInflight = /* @__PURE__ */ new Map();
const mcpConfigSummaryCache = /* @__PURE__ */ new Map();
function optionalCacheString(value) {
	return value?.trim() ?? "";
}
function buildToolsEffectiveCacheKey(params) {
	const context = params.context;
	return JSON.stringify({
		v: 1,
		config: context.runtimeConfigCacheKey,
		pluginRegistry: context.pluginRegistryVersion,
		channelRegistry: context.channelRegistryVersion,
		nodePluginTools: context.nodePluginToolsVersion,
		sessionKey: params.sessionKey,
		sessionId: context.sessionId,
		workspaceDir: optionalCacheString(context.workspaceDir),
		agentId: context.agentId,
		modelProvider: optionalCacheString(context.modelProvider),
		modelId: optionalCacheString(context.modelId),
		messageProvider: optionalCacheString(context.messageProvider),
		accountId: optionalCacheString(context.accountId),
		currentChannelId: optionalCacheString(context.currentChannelId),
		currentThreadTs: optionalCacheString(context.currentThreadTs),
		groupId: optionalCacheString(context.groupId),
		groupChannel: optionalCacheString(context.groupChannel),
		groupSpace: optionalCacheString(context.groupSpace),
		replyToMode: optionalCacheString(context.replyToMode)
	});
}
function buildMcpConfigSummaryCacheKey(params) {
	return JSON.stringify({
		v: 1,
		config: params.context.runtimeConfigCacheKey,
		pluginRegistry: params.context.pluginRegistryVersion,
		workspaceDir: params.workspaceDir,
		toolOverrides: params.context.toolOverrides,
		toolDenylist: params.context.capabilityProfile.policy.explicitToolDenylist
	});
}
function resolveCachedSessionMcpConfigSummary(params) {
	const key = buildMcpConfigSummaryCacheKey(params);
	const cached = mcpConfigSummaryCache.get(key);
	if (cached) return cached;
	const summary = params.dependencies.resolveSessionMcpConfigSummary({
		workspaceDir: params.workspaceDir,
		cfg: params.context.cfg,
		...params.context.toolOverrides ? { toolOverrides: params.context.toolOverrides } : {},
		toolDenylist: params.context.capabilityProfile.policy.explicitToolDenylist
	});
	mcpConfigSummaryCache.set(key, summary);
	pruneMapToMaxSize(mcpConfigSummaryCache, MCP_CONFIG_SUMMARY_CACHE_LIMIT);
	return summary;
}
function cacheToolsEffectiveResult(key, value) {
	toolsEffectiveCache.delete(key);
	toolsEffectiveCache.set(key, {
		value,
		createdAtMs: nowForToolsEffectiveCache()
	});
	pruneMapToMaxSize(toolsEffectiveCache, TOOLS_EFFECTIVE_CACHE_LIMIT);
}
function scheduleBaseToolsEffectiveRefresh(key, context, dependencies) {
	const existing = toolsEffectiveInflight.get(key);
	if (existing) return existing;
	const startedAt = nowForToolsEffectiveCache();
	const task = new Promise((resolve, reject) => {
		setImmediate(() => {
			resolveBaseToolsEffectiveInventory(context, dependencies).then((value) => {
				cacheToolsEffectiveResult(key, value);
				const durationMs = nowForToolsEffectiveCache() - startedAt;
				if (durationMs >= TOOLS_EFFECTIVE_SLOW_LOG_MS) logDebug(`tools-effective: refresh durationMs=${durationMs} agent=${context.agentId} session=${context.sessionKey} tools=${value.groups.reduce((sum, group) => sum + group.tools.length, 0)}`);
				resolve(value);
			}).catch((err) => reject(toErrorObject(err, "Non-Error rejection"))).finally(() => toolsEffectiveInflight.delete(key));
		});
	});
	toolsEffectiveInflight.set(key, task);
	return task;
}
function refreshBaseToolsEffectiveInBackground(key, context, dependencies) {
	scheduleBaseToolsEffectiveRefresh(key, context, dependencies).catch((err) => {
		logWarn(`tools-effective: background refresh failed: ${String(err)}`);
	});
}
async function resolveCachedBaseToolsEffective(params) {
	const key = buildToolsEffectiveCacheKey(params);
	const now = nowForToolsEffectiveCache();
	const cached = toolsEffectiveCache.get(key);
	if (cached) {
		const ageMs = now - cached.createdAtMs;
		if (ageMs < TOOLS_EFFECTIVE_FRESH_TTL_MS) return cached.value;
		if (ageMs < TOOLS_EFFECTIVE_STALE_TTL_MS) {
			refreshBaseToolsEffectiveInBackground(key, params.context, params.dependencies);
			return cached.value;
		}
	}
	return scheduleBaseToolsEffectiveRefresh(key, params.context, params.dependencies);
}
function resolveRequestedAgentIdOrRespondError(params) {
	const knownAgents = params.dependencies.listAgentIds(params.cfg);
	const requestedAgentId = normalizeOptionalString(params.rawAgentId) ?? "";
	if (!requestedAgentId) return;
	if (!knownAgents.includes(requestedAgentId)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${requestedAgentId}"`));
		return null;
	}
	return requestedAgentId;
}
function appendToolInventoryNotice(base, notice) {
	return {
		...base,
		notices: [...base.notices ?? [], notice]
	};
}
function formatMcpServerNames(names) {
	if (names.length === 0) return "configured MCP servers";
	const visible = names.slice(0, 3).map((name) => `"${name}"`).join(", ");
	return names.length > 3 ? `${visible}, and ${names.length - 3} more MCP servers` : visible;
}
function mcpDiscoveryNotice(mcpServerNames, reason) {
	if (mcpServerNames.length === 0) return;
	const servers = mcpServerNames.toSorted((a, b) => a.localeCompare(b));
	const formattedServers = formatMcpServerNames(servers);
	switch (reason) {
		case "stale-config": return {
			id: "mcp-stale-catalog",
			severity: "info",
			message: `MCP servers ${formattedServers} changed since the current runtime catalog was discovered. MCP tools will appear here after the next agent run discovers them.`,
			servers
		};
		case "not-listed": return {
			id: "mcp-not-yet-listed",
			severity: "info",
			message: `MCP servers ${formattedServers} are connected but have not finished listing tools yet. MCP tools will appear here after the session discovers them.`,
			servers
		};
		case "not-connected": return {
			id: "mcp-not-yet-connected",
			severity: "info",
			message: `MCP servers ${formattedServers} are configured but not connected for this session yet. MCP tools will appear here after an agent run discovers them.`,
			servers
		};
		default: return;
	}
}
function maybeAppendMcpNotice(base, mcpServerNames, reason) {
	const notice = mcpDiscoveryNotice(mcpServerNames, reason);
	return notice ? appendToolInventoryNotice(base, notice) : base;
}
async function resolveBaseToolsEffectiveInventory(context, dependencies) {
	const agentDir = dependencies.resolveAgentDir(context.cfg, context.agentId);
	const acquired = await dependencies.acquireEffectiveToolInventoryRuntimeModelContext({
		cfg: context.cfg,
		agentId: context.agentId,
		agentDir,
		workspaceDir: context.workspaceDir,
		modelProvider: context.modelProvider,
		modelId: context.modelId
	});
	try {
		return acquired.run((runtimeModelContext) => dependencies.resolveEffectiveToolInventory({
			cfg: context.cfg,
			agentId: context.agentId,
			agentDir,
			sessionKey: context.sessionKey,
			sessionId: context.sessionId,
			workspaceDir: context.workspaceDir,
			messageProvider: context.messageProvider,
			modelProvider: context.modelProvider,
			modelId: context.modelId,
			modelApi: runtimeModelContext.modelApi,
			runtimeModel: runtimeModelContext.runtimeModel,
			currentChannelId: context.currentChannelId,
			currentThreadTs: context.currentThreadTs,
			accountId: context.accountId,
			groupId: context.groupId,
			groupChannel: context.groupChannel,
			groupSpace: context.groupSpace,
			replyToMode: context.replyToMode
		}));
	} finally {
		await acquired[Symbol.asyncDispose]();
	}
}
function filterMcpTools(params) {
	return params.dependencies.applyFinalEffectiveToolPolicy({
		bundledTools: params.mcpTools,
		config: params.context.cfg,
		conversationCapabilityProfile: params.context.capabilityProfile,
		warn: logWarn
	});
}
async function resolveReadOnlyToolsEffectiveInventory(context, dependencies) {
	const base = await resolveCachedBaseToolsEffective({
		sessionKey: context.sessionKey,
		context,
		dependencies
	});
	const harness = context.agentHarnessId ? dependencies.getRegisteredAgentHarness(context.agentHarnessId)?.harness : void 0;
	if (harness?.loadMcpToolCatalog) {
		const mcpConfig = resolveCachedSessionMcpConfigSummary({
			context,
			workspaceDir: context.workspaceDir,
			dependencies
		});
		if (mcpConfig.serverNames.length === 0) return base;
		try {
			const catalog = await harness.loadMcpToolCatalog({
				config: context.cfg,
				agentId: context.agentId,
				sessionId: context.sessionId,
				sessionKey: context.sessionKey,
				workspaceDir: context.workspaceDir,
				mcpServerNames: mcpConfig.serverNames,
				toolOverrides: context.toolOverrides
			});
			if (catalog) return await projectMcpCatalog({
				base,
				catalog,
				context,
				workspaceDir: context.workspaceDir,
				dependencies
			});
		} catch (error) {
			logWarn(`tools-effective: ${context.agentHarnessId} MCP catalog failed for session ${context.sessionKey}: ${String(error)}`);
		}
		return maybeAppendMcpNotice(base, mcpConfig.serverNames, "not-connected");
	}
	const runtime = dependencies.peekSessionMcpRuntime({
		sessionId: context.sessionId,
		sessionKey: context.sessionKey
	});
	const mcpConfig = resolveCachedSessionMcpConfigSummary({
		context,
		workspaceDir: runtime?.workspaceDir ?? context.workspaceDir,
		dependencies
	});
	if (mcpConfig.serverNames.length === 0) return base;
	if (!runtime) return maybeAppendMcpNotice(base, mcpConfig.serverNames, "not-connected");
	if (runtime.configFingerprint !== mcpConfig.fingerprint) return maybeAppendMcpNotice(base, mcpConfig.serverNames, "stale-config");
	const catalog = runtime.peekCatalog();
	if (!catalog) return maybeAppendMcpNotice(base, mcpConfig.serverNames, "not-listed");
	return await projectMcpCatalog({
		base,
		catalog,
		context,
		workspaceDir: runtime.workspaceDir,
		dependencies
	});
}
async function projectMcpCatalog(params) {
	const projectedMcpTools = params.dependencies.buildBundleMcpToolsFromCatalog({
		catalog: params.catalog,
		reservedToolNames: params.base.groups.flatMap((group) => group.tools.map((tool) => tool.id)),
		includeSessionDenied: true
	});
	const filteredMcpTools = filterMcpTools({
		context: params.context,
		mcpTools: projectedMcpTools,
		dependencies: params.dependencies
	});
	if (filteredMcpTools.length === 0) return params.base;
	const acquired = await params.dependencies.acquireEffectiveToolInventoryRuntimeModelContext({
		cfg: params.context.cfg,
		agentId: params.context.agentId,
		agentDir: params.dependencies.resolveAgentDir(params.context.cfg, params.context.agentId),
		workspaceDir: params.workspaceDir,
		modelProvider: params.context.modelProvider,
		modelId: params.context.modelId
	});
	try {
		return acquired.run((runtimeModelContext) => {
			const mcpInventory = buildRuntimeCompatibleMcpToolInventory({
				tools: filteredMcpTools,
				cfg: params.context.cfg,
				workspaceDir: params.workspaceDir,
				modelProvider: params.context.modelProvider,
				modelId: params.context.modelId,
				modelApi: runtimeModelContext.modelApi,
				runtimeModel: runtimeModelContext.runtimeModel
			});
			const notices = [...params.base.notices ?? [], ...mcpInventory.notices];
			if (mcpInventory.entries.length === 0) return notices.length > 0 ? {
				...params.base,
				notices
			} : params.base;
			return {
				...params.base,
				...notices.length > 0 ? { notices } : {},
				groups: [...params.base.groups, ...buildEffectiveToolInventoryGroups(mcpInventory.entries)]
			};
		});
	} finally {
		await acquired[Symbol.asyncDispose]();
	}
}
function resolveTrustedToolsEffectiveContext(params) {
	const loaded = params.dependencies.loadGatewaySessionEntryReadOnly(params.sessionKey, params.requestedAgentId ? { agentId: params.requestedAgentId } : void 0);
	if (!loaded.entry) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session key "${params.sessionKey}"`));
		return null;
	}
	const canonicalKey = loaded.canonicalKey ?? params.sessionKey;
	const sessionAgentId = params.dependencies.resolveSessionAgentId({
		sessionKey: canonicalKey,
		config: loaded.cfg,
		...params.requestedAgentId ? { agentId: params.requestedAgentId } : {}
	});
	if (params.requestedAgentId && params.requestedAgentId !== sessionAgentId) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent id "${params.requestedAgentId}" does not match session agent "${sessionAgentId}"`));
		return null;
	}
	const delivery = params.dependencies.deliveryContextFromSession(loaded.entry);
	const origin = sessionDeliveryOrigin(loaded.entry);
	const resolvedModel = params.dependencies.resolveSessionModelRef(loaded.cfg, loaded.entry, sessionAgentId);
	const workspaceDir = normalizeOptionalString(loaded.entry.spawnedWorkspaceDir) ?? params.dependencies.resolveAgentWorkspaceDir(loaded.cfg, sessionAgentId);
	const runtimeConfigCacheKey = params.dependencies.resolveRuntimeConfigCacheKey(loaded.cfg);
	const pluginRegistryVersion = params.dependencies.getActivePluginRegistryVersion();
	const channelRegistryVersion = params.dependencies.getActivePluginChannelRegistryVersion();
	const nodePluginToolsVersion = params.dependencies.getConnectedNodePluginToolsVersion();
	const context = {
		cfg: loaded.cfg,
		agentId: sessionAgentId,
		sessionKey: params.sessionKey,
		sessionId: loaded.entry.sessionId,
		workspaceDir,
		runtimeConfigCacheKey,
		pluginRegistryVersion,
		channelRegistryVersion,
		nodePluginToolsVersion,
		modelProvider: resolvedModel.provider,
		modelId: resolvedModel.model,
		messageProvider: delivery?.channel ?? origin?.provider,
		accountId: delivery?.accountId ?? origin?.accountId,
		currentChannelId: delivery?.to,
		currentThreadTs: delivery?.threadId != null ? stringifyRouteThreadId(delivery.threadId) : origin?.threadId != null ? stringifyRouteThreadId(origin.threadId) : void 0,
		groupId: loaded.entry.groupId,
		groupChannel: loaded.entry.groupChannel,
		groupSpace: loaded.entry.space,
		spawnedBy: normalizeOptionalString(loaded.entry.spawnedBy),
		agentHarnessId: normalizeOptionalString(loaded.entry.agentHarnessId),
		toolOverrides: loaded.entry.toolOverrides,
		replyToMode: params.dependencies.resolveReplyToMode(loaded.cfg, delivery?.channel ?? origin?.provider, delivery?.accountId ?? origin?.accountId, loaded.entry.chatType ?? origin?.chatType)
	};
	return {
		...context,
		capabilityProfile: resolveConversationCapabilityProfile({
			config: context.cfg,
			sessionKey: context.sessionKey,
			preparedSessionEntry: {
				sessionKey: canonicalKey,
				entry: loaded.entry
			},
			agentId: context.agentId,
			modelProvider: context.modelProvider,
			modelId: context.modelId,
			messageProvider: context.messageProvider,
			agentAccountId: context.accountId,
			groupId: context.groupId,
			groupChannel: context.groupChannel,
			groupSpace: context.groupSpace,
			spawnedBy: context.spawnedBy
		})
	};
}
async function handleToolsEffectiveRequest(params) {
	if (!assertValidParams(params.rawParams, validateToolsEffectiveParams, "tools.effective", params.respond)) return;
	const cfg = params.context.getRuntimeConfig();
	const requestedAgentId = resolveRequestedAgentIdOrRespondError({
		rawAgentId: params.rawParams.agentId,
		cfg,
		respond: params.respond,
		dependencies: params.dependencies
	});
	if (requestedAgentId === null) return;
	const sessionOwner = resolveRequestedSessionAgentId(cfg, params.rawParams.sessionKey, requestedAgentId);
	if (!sessionOwner.ok) {
		params.respond(false, void 0, sessionOwner.error);
		return;
	}
	const trustedContext = resolveTrustedToolsEffectiveContext({
		sessionKey: params.rawParams.sessionKey,
		requestedAgentId: sessionOwner.agentId,
		respond: params.respond,
		dependencies: params.dependencies
	});
	if (!trustedContext) return;
	try {
		params.respond(true, await resolveReadOnlyToolsEffectiveInventory(trustedContext, params.dependencies), void 0);
	} catch (err) {
		params.respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `tools.effective failed: ${String(err)}`));
	}
}
function createToolsEffectiveHandlers(dependencies = defaultToolsEffectiveDependencies) {
	return { "tools.effective": async ({ params, respond, context }) => {
		await handleToolsEffectiveRequest({
			rawParams: params,
			respond,
			context,
			dependencies
		});
	} };
}
const toolsEffectiveHandlers = createToolsEffectiveHandlers();
//#endregion
export { toolsEffectiveHandlers };
