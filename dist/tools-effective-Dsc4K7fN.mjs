import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import "./errors-O33D01XW.mjs";
import { a as resolveAgentDir, d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { u as readToolAllowlistIntersection } from "./tool-policy-shared-DWHChhWM.mjs";
import { C as resolveRuntimeConfigCacheKey } from "./runtime-snapshot-DYptB0Cf.mjs";
import { c as getActivePluginChannelRegistryVersion, d as getActivePluginRegistryVersion } from "./runtime-DfYPSUKC.mjs";
import "./config-9720xhC5.mjs";
import { i as logWarn, t as logDebug } from "./logger-DskmrSVa.mjs";
import { o as peekSessionMcpRuntime } from "./agent-bundle-mcp-manager-api-DMR2FD5c.mjs";
import { n as resolveSessionMcpConfigSummary } from "./agent-bundle-mcp-runtime-config-DoFuixnX.mjs";
import { Io as validateToolsEffectiveParams } from "./src-l2dWvEsN.mjs";
import { f as stringifyRouteThreadId } from "./channel-route-BIxMkFzo.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { n as getRegisteredAgentHarness } from "./registry-BrXrewXj.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { o as resolveReplyToMode } from "./reply-threading-C2UGRrlc.mjs";
import { n as resolveSessionModelRef } from "./session-model-ref-xnA7gN4_.mjs";
import { t as buildBundleMcpToolsFromCatalog } from "./agent-bundle-mcp-materialize-XNkPQvAz.mjs";
import "./agent-bundle-mcp-tools-BAc-juSa.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-l7Gq7Nji.mjs";
import { i as resolveConversationToolPolicies, t as buildConversationToolPolicyPipelineSteps } from "./conversation-tool-policy-pipeline-PqUansOZ.mjs";
import { n as getConnectedNodePluginToolsVersion } from "./node-plugin-tool-snapshot-CNNyj5Eu.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DrLraxiU.mjs";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-BYInoSdz.mjs";
import "./session-utils-N4Q5NAko.mjs";
import { r as buildEffectiveToolInventory } from "./tools-effective-inventory-build-BhvA39tn.mjs";
import { i as buildEffectiveToolInventoryGroups, r as resolveEffectiveToolInventory, t as acquireEffectiveToolInventoryRuntimeModelContext } from "./tools-effective-inventory-Bup6LJdi.mjs";
import { n as defineValidatedGatewayHandler } from "./validation-Bu27N0nv.mjs";
//#region src/agents/tools-effective-mcp-inventory.ts
/**
* Builds the operator-facing effective inventory for bundle MCP tools. Runtime
* schema policy quarantines incompatible tools and emits notices instead of
* silently hiding them.
*/
const BUNDLE_MCP_PLUGIN_ID = "bundle-mcp";
function buildMcpCatalogNotices(catalog) {
	return (catalog.diagnostics ?? []).map((diagnostic) => ({
		id: `mcp-server-diagnostic:${diagnostic.serverName}`,
		severity: "warning",
		message: `MCP server "${diagnostic.serverName}": ${diagnostic.message}`,
		servers: [diagnostic.serverName]
	}));
}
/** Builds the runtime-compatible MCP tool inventory and quarantine notices. */
function buildRuntimeCompatibleMcpToolInventory(params) {
	return buildEffectiveToolInventory(params, {
		allowProviderRuntimePluginLoad: false,
		rawDescriptionFallback: "summary",
		diagnosticOwner: () => ` from plugin "${BUNDLE_MCP_PLUGIN_ID}"`,
		createToolProjection: () => (tool) => {
			const mcp = getPluginToolMeta(tool)?.mcp;
			return {
				source: "mcp",
				pluginId: BUNDLE_MCP_PLUGIN_ID,
				...mcp ? {
					mcpServer: mcp.serverName,
					mcpToolName: mcp.toolName,
					...mcp.deniedBySession ? { deniedBySession: true } : {}
				} : {}
			};
		}
	});
}
//#endregion
//#region src/gateway/server-methods/tools-effective.ts
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
function buildToolsEffectiveCacheKey(context) {
	return JSON.stringify({
		v: 1,
		config: context.runtimeConfigCacheKey,
		pluginRegistry: context.pluginRegistryVersion,
		channelRegistry: context.channelRegistryVersion,
		nodePluginTools: context.nodePluginToolsVersion,
		sessionKey: context.sessionKey,
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
		replyToMode: optionalCacheString(context.replyToMode),
		policy: buildConversationToolPolicyPipelineSteps({
			capabilityProfile: context.capabilityProfile,
			policies: resolveConversationToolPolicies({ capabilityProfile: context.capabilityProfile }),
			includeRuntimeToolPolicy: true
		}).map(({ policy }) => policy && {
			allow: policy.allow && (readToolAllowlistIntersection(policy.allow) ?? policy.allow),
			deny: policy.deny
		})
	});
}
function resolveCachedSessionMcpConfigSummary(params) {
	const key = JSON.stringify({
		v: 1,
		config: params.context.runtimeConfigCacheKey,
		pluginRegistry: params.context.pluginRegistryVersion,
		workspaceDir: params.workspaceDir,
		toolOverrides: params.context.toolOverrides,
		toolDenylist: params.context.capabilityProfile.policy.explicitToolDenylist
	});
	const cached = mcpConfigSummaryCache.get(key);
	if (cached) return cached;
	const summary = resolveSessionMcpConfigSummary({
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
function scheduleBaseToolsEffectiveRefresh(key, context) {
	const existing = toolsEffectiveInflight.get(key);
	if (existing) return existing;
	const startedAt = nowForToolsEffectiveCache();
	const task = new Promise((resolve, reject) => {
		setImmediate(() => {
			resolveBaseToolsEffectiveInventory(context).then((value) => {
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
async function resolveCachedBaseToolsEffective(context) {
	const key = buildToolsEffectiveCacheKey(context);
	const now = nowForToolsEffectiveCache();
	const cached = toolsEffectiveCache.get(key);
	if (cached) {
		const ageMs = now - cached.createdAtMs;
		if (ageMs < TOOLS_EFFECTIVE_FRESH_TTL_MS) return cached.value;
		if (ageMs < TOOLS_EFFECTIVE_STALE_TTL_MS) {
			scheduleBaseToolsEffectiveRefresh(key, context).catch((err) => {
				logWarn(`tools-effective: background refresh failed: ${String(err)}`);
			});
			return cached.value;
		}
	}
	return scheduleBaseToolsEffectiveRefresh(key, context);
}
function resolveRequestedAgentIdOrRespondError(params) {
	const knownAgents = listAgentIds(params.cfg);
	const requestedAgentId = normalizeOptionalString(params.rawAgentId) ?? "";
	if (!requestedAgentId) return;
	if (!knownAgents.includes(requestedAgentId)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown agent id "${requestedAgentId}"`));
		return null;
	}
	return requestedAgentId;
}
function formatMcpServerNames(names) {
	const visible = names.slice(0, 3).map((name) => `"${name}"`).join(", ");
	return names.length > 3 ? `${visible}, and ${names.length - 3} more MCP servers` : visible;
}
const MCP_DISCOVERY_NOTICES = {
	"stale-config": {
		id: "mcp-stale-catalog",
		message: (servers) => `MCP servers ${servers} changed since the current runtime catalog was discovered. MCP tools will appear here after the next agent run discovers them.`
	},
	"not-listed": {
		id: "mcp-not-yet-listed",
		message: (servers) => `MCP servers ${servers} are connected but have not finished listing tools yet. MCP tools will appear here after the session discovers them.`
	},
	"not-connected": {
		id: "mcp-not-yet-connected",
		message: (servers) => `MCP servers ${servers} are configured but not connected for this session yet. MCP tools will appear here after an agent run discovers them.`
	}
};
function maybeAppendMcpNotice(base, mcpServerNames, reason) {
	if (mcpServerNames.length === 0) return base;
	const servers = mcpServerNames.toSorted((a, b) => a.localeCompare(b));
	const notice = MCP_DISCOVERY_NOTICES[reason];
	return {
		...base,
		notices: [...base.notices ?? [], {
			id: notice.id,
			severity: "info",
			message: notice.message(formatMcpServerNames(servers)),
			servers
		}]
	};
}
async function resolveBaseToolsEffectiveInventory(context) {
	const agentDir = resolveAgentDir(context.cfg, context.agentId);
	const acquired = await acquireEffectiveToolInventoryRuntimeModelContext({
		cfg: context.cfg,
		agentId: context.agentId,
		agentDir,
		workspaceDir: context.workspaceDir,
		modelProvider: context.modelProvider,
		modelId: context.modelId
	});
	try {
		return acquired.run((runtimeModelContext) => resolveEffectiveToolInventory({
			conversationCapabilityProfile: context.capabilityProfile,
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
async function resolveReadOnlyToolsEffectiveInventory(context) {
	const base = await resolveCachedBaseToolsEffective(context);
	const harness = context.agentHarnessId ? getRegisteredAgentHarness(context.agentHarnessId)?.harness : void 0;
	if (harness?.loadMcpToolCatalog) {
		const mcpConfig = resolveCachedSessionMcpConfigSummary({
			context,
			workspaceDir: context.workspaceDir
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
				workspaceDir: context.workspaceDir
			});
		} catch (error) {
			logWarn(`tools-effective: ${context.agentHarnessId} MCP catalog failed for session ${context.sessionKey}: ${String(error)}`);
		}
		return maybeAppendMcpNotice(base, mcpConfig.serverNames, "not-connected");
	}
	const runtime = peekSessionMcpRuntime({
		sessionId: context.sessionId,
		sessionKey: context.sessionKey
	});
	const mcpConfig = resolveCachedSessionMcpConfigSummary({
		context,
		workspaceDir: runtime?.workspaceDir ?? context.workspaceDir
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
		workspaceDir: runtime.workspaceDir
	});
}
async function projectMcpCatalog(params) {
	const catalogNotices = buildMcpCatalogNotices(params.catalog);
	const base = catalogNotices.length > 0 ? {
		...params.base,
		notices: [...params.base.notices ?? [], ...catalogNotices]
	} : params.base;
	const projectedMcpTools = buildBundleMcpToolsFromCatalog({
		catalog: params.catalog,
		reservedToolNames: params.base.groups.flatMap((group) => group.tools.map((tool) => tool.id)),
		includeSessionDenied: true
	});
	const filteredMcpTools = applyFinalEffectiveToolPolicy({
		bundledTools: projectedMcpTools,
		config: params.context.cfg,
		conversationCapabilityProfile: params.context.capabilityProfile,
		warn: logWarn
	});
	if (filteredMcpTools.length === 0) return base;
	const acquired = await acquireEffectiveToolInventoryRuntimeModelContext({
		cfg: params.context.cfg,
		agentId: params.context.agentId,
		agentDir: resolveAgentDir(params.context.cfg, params.context.agentId),
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
			const notices = [...base.notices ?? [], ...mcpInventory.notices];
			if (mcpInventory.entries.length === 0) return notices.length > 0 ? {
				...base,
				notices
			} : base;
			return {
				...base,
				...notices.length > 0 ? { notices } : {},
				groups: [...params.base.groups, ...buildEffectiveToolInventoryGroups(mcpInventory.entries)]
			};
		});
	} finally {
		await acquired[Symbol.asyncDispose]();
	}
}
function resolveTrustedToolsEffectiveContext(params) {
	const loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, params.requestedAgentId ? { agentId: params.requestedAgentId } : void 0);
	if (!loaded.entry) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session key "${params.sessionKey}"`));
		return null;
	}
	const canonicalKey = loaded.canonicalKey ?? params.sessionKey;
	const sessionAgentId = resolveSessionAgentId({
		sessionKey: canonicalKey,
		config: loaded.cfg,
		...params.requestedAgentId ? { agentId: params.requestedAgentId } : {}
	});
	if (params.requestedAgentId && params.requestedAgentId !== sessionAgentId) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent id "${params.requestedAgentId}" does not match session agent "${sessionAgentId}"`));
		return null;
	}
	const delivery = deliveryContextFromSession(loaded.entry);
	const origin = sessionDeliveryOrigin(loaded.entry);
	const resolvedModel = resolveSessionModelRef(loaded.cfg, loaded.entry, sessionAgentId);
	const workspaceDir = normalizeOptionalString(loaded.entry.spawnedWorkspaceDir) ?? resolveAgentWorkspaceDir(loaded.cfg, sessionAgentId);
	const runtimeConfigCacheKey = resolveRuntimeConfigCacheKey(loaded.cfg);
	const pluginRegistryVersion = getActivePluginRegistryVersion();
	const channelRegistryVersion = getActivePluginChannelRegistryVersion();
	const nodePluginToolsVersion = getConnectedNodePluginToolsVersion();
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
		replyToMode: resolveReplyToMode(loaded.cfg, delivery?.channel ?? origin?.provider, delivery?.accountId ?? origin?.accountId, loaded.entry.chatType ?? origin?.chatType)
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
const toolsEffectiveHandlers = { "tools.effective": defineValidatedGatewayHandler("tools.effective", validateToolsEffectiveParams, async ({ params, respond, context }) => {
	const cfg = context.getRuntimeConfig();
	const requestedAgentId = resolveRequestedAgentIdOrRespondError({
		rawAgentId: params.agentId,
		cfg,
		respond
	});
	if (requestedAgentId === null) return;
	const sessionOwner = resolveRequestedSessionAgentId(cfg, params.sessionKey, requestedAgentId);
	if (!sessionOwner.ok) {
		respond(false, void 0, sessionOwner.error);
		return;
	}
	const trustedContext = resolveTrustedToolsEffectiveContext({
		sessionKey: params.sessionKey,
		requestedAgentId: sessionOwner.agentId,
		respond
	});
	if (!trustedContext) return;
	try {
		respond(true, await resolveReadOnlyToolsEffectiveInventory(trustedContext), void 0);
	} catch (err) {
		respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, `tools.effective failed: ${String(err)}`));
	}
}) };
//#endregion
export { toolsEffectiveHandlers };
