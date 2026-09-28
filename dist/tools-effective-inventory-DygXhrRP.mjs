import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { a as resolveAgentDir, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-DkeaMJw8.mjs";
import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
import "./tool-policy-YDdaK0oX.mjs";
import { s as normalizeStaticProviderModelId } from "./model-ref-shared-BgRrSHjn.mjs";
import { a as resolveMergedModelProviderConfig, r as findConfiguredProviderModel } from "./model-provider-config-BbSyhfVf.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { m as normalizeProviderTransportWithPlugin } from "./provider-runtime-DTb_RnE4.mjs";
import { n as extractModelCompat } from "./provider-model-compat-D1iLDbYW.mjs";
import { a as resolveBundledStaticCatalogModel } from "./model.static-catalog-Cuxwwngw.mjs";
import { a as acquireReadOnlyPreparedModelRuntime } from "./prepared-model-runtime-DwKkPNoF.mjs";
import { n as resolveEffectiveToolPolicy } from "./agent-tools.policy-L6QuLbuq.mjs";
import { n as resolveModelAsync } from "./model-4g7Pq9YZ.mjs";
import { t as createOpenClawCodingTools } from "./agent-tools-Dp5LthCP.mjs";
import { n as buildRuntimeCompatibleToolInventory } from "./tools-effective-inventory-build-wL3uOe54.mjs";
//#region src/agents/tools-effective-inventory-groups.ts
function groupLabel(source) {
	switch (source) {
		case "plugin": return "Connected tools";
		case "channel": return "Channel tools";
		case "mcp": return "MCP server tools";
		default: return "Built-in tools";
	}
}
/** Groups effective tool inventory entries by source in UI/report order. */
function buildEffectiveToolInventoryGroups(entries) {
	const groupsBySource = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const tools = groupsBySource.get(entry.source) ?? [];
		tools.push(entry);
		groupsBySource.set(entry.source, tools);
	}
	return [
		"core",
		"plugin",
		"channel",
		"mcp"
	].map((source) => {
		const tools = groupsBySource.get(source);
		if (!tools || tools.length === 0) return null;
		return {
			id: source,
			label: groupLabel(source),
			source,
			tools
		};
	}).filter((group) => group !== null);
}
//#endregion
//#region src/agents/tools-effective-inventory.ts
/**
* Effective tool inventory resolver.
*
* Builds model-visible tool lists after profile, provider, plugin, policy, and compatibility filters.
*/
function listIncludesTool(list, toolName) {
	if (!Array.isArray(list)) return false;
	const normalizedToolName = normalizeToolPolicyName(toolName);
	return list.some((entry) => normalizeToolPolicyName(entry) === normalizedToolName);
}
function policyDeniesTool(policy, toolName) {
	return listIncludesTool(policy?.deny, toolName) || listIncludesTool(policy?.deny, "group:ui") || listIncludesTool(policy?.deny, "group:openclaw");
}
function hasExplicitBrowserIntent(cfg) {
	return cfg.browser?.enabled !== false && Boolean(cfg.browser || cfg.plugins?.entries?.browser);
}
function buildToolInventoryNotices(params) {
	if (params.entries.some((entry) => normalizeToolPolicyName(entry.id) === "browser") || !hasExplicitBrowserIntent(params.cfg)) return;
	if ([
		params.effectivePolicy.globalPolicy,
		params.effectivePolicy.globalProviderPolicy,
		params.effectivePolicy.agentPolicy,
		params.effectivePolicy.agentProviderPolicy
	].some((policy) => policyDeniesTool(policy, "browser"))) return [{
		id: "browser-denied-by-policy",
		severity: "info",
		message: "Browser is configured, but this session does not expose the browser tool because tool policy denies it. Remove the browser deny entry to use browser automation."
	}];
	if (params.profile !== "full") return [{
		id: "browser-filtered-by-profile",
		severity: "info",
		message: "Browser is configured, but the current tool profile does not include the browser tool. Add tools.alsoAllow: [\"browser\"] or agents.entries.*.tools.alsoAllow: [\"browser\"]; tools.subagents.tools.allow alone cannot add it back after profile filtering."
	}];
	if (Array.isArray(params.cfg.plugins?.allow) && !listIncludesTool(params.cfg.plugins.allow, "browser")) return [{
		id: "browser-plugin-not-allowed",
		severity: "warning",
		message: "Browser is configured, but plugins.allow does not include browser. Add \"browser\" to plugins.allow or remove the restrictive plugin allowlist."
	}];
}
function applyProviderTransportNormalization(params) {
	const normalized = normalizeProviderTransportWithPlugin({
		provider: params.provider,
		modelId: params.runtimeModel.id,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
			modelId: params.runtimeModel.id,
			api: params.runtimeModel.api,
			baseUrl: params.runtimeModel.baseUrl
		}
	});
	if (!normalized) return params.runtimeModel;
	return {
		...params.runtimeModel,
		api: normalized.api ?? params.runtimeModel.api,
		baseUrl: normalized.baseUrl ?? params.runtimeModel.baseUrl
	};
}
function resolveConfiguredFallbackApi(providerConfig) {
	const explicitApi = normalizeOptionalString(providerConfig?.api);
	if (explicitApi) return explicitApi;
	return normalizeOptionalString(providerConfig?.baseUrl) ? "openai-completions" : "openai-responses";
}
/** Resolves configured or bundled metadata without starting provider discovery. */
function resolveStaticToolInventoryRuntimeModelContext(params) {
	const provider = normalizeProviderId(params.modelProvider ?? "");
	const modelId = params.modelId?.trim() ?? "";
	if (!provider || !modelId) return {};
	const agentId = params.agentId?.trim() || resolveSessionAgentId({ config: params.cfg });
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
	const providerConfig = resolveMergedModelProviderConfig(params.cfg, provider);
	const configuredModel = findConfiguredProviderModel(providerConfig, provider, modelId, (id) => normalizeLowercaseStringOrEmpty(normalizeStaticProviderModelId(provider, id)));
	const bundledStaticModel = resolveBundledStaticCatalogModel({
		provider,
		modelId,
		cfg: params.cfg,
		workspaceDir
	});
	if (configuredModel) {
		const configuredApi = normalizeOptionalString(configuredModel.api) ?? normalizeOptionalString(providerConfig?.api) ?? normalizeOptionalString(bundledStaticModel?.api) ?? resolveConfiguredFallbackApi(providerConfig);
		const runtimeModel = applyProviderTransportNormalization({
			cfg: params.cfg,
			provider,
			workspaceDir,
			runtimeModel: {
				...bundledStaticModel,
				...configuredModel,
				id: modelId,
				name: configuredModel.name ?? bundledStaticModel?.name ?? configuredModel.id,
				provider,
				api: configuredApi,
				baseUrl: normalizeOptionalString(configuredModel.baseUrl) ?? normalizeOptionalString(providerConfig?.baseUrl) ?? normalizeOptionalString(bundledStaticModel?.baseUrl)
			}
		});
		return {
			modelApi: runtimeModel.api,
			runtimeModel
		};
	}
	if (!bundledStaticModel) return {};
	const runtimeModel = applyProviderTransportNormalization({
		cfg: params.cfg,
		provider,
		workspaceDir,
		runtimeModel: {
			...bundledStaticModel,
			api: normalizeOptionalString(providerConfig?.api) ?? bundledStaticModel.api,
			baseUrl: normalizeOptionalString(providerConfig?.baseUrl) ?? bundledStaticModel.baseUrl
		}
	});
	return {
		modelApi: runtimeModel.api,
		runtimeModel
	};
}
/** Keeps dynamic model hooks owned and scoped until inventory projection finishes. */
async function acquireEffectiveToolInventoryRuntimeModelContext(params) {
	const staticContext = resolveStaticToolInventoryRuntimeModelContext(params);
	if (staticContext.runtimeModel) return {
		run: (project) => project(staticContext),
		[Symbol.asyncDispose]: async () => {}
	};
	const provider = normalizeProviderId(params.modelProvider ?? "");
	const modelId = params.modelId?.trim() ?? "";
	if (!provider || !modelId) return {
		run: (project) => project({}),
		[Symbol.asyncDispose]: async () => {}
	};
	const agentId = params.agentId?.trim() || resolveSessionAgentId({ config: params.cfg });
	const agentDir = params.agentDir ?? resolveAgentDir(params.cfg, agentId);
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
	const lease = await acquireReadOnlyPreparedModelRuntime({
		agentId,
		agentDir,
		config: params.cfg,
		workspaceDir,
		loadRuntimePlugins: true,
		runtimePluginSelections: [{
			provider,
			modelId,
			agentId
		}]
	}, { catalogMode: "static" });
	let transferred = false;
	try {
		const stores = lease.snapshot.createStores();
		const runtimeModel = (await resolveModelAsync(provider, modelId, agentDir, params.cfg, {
			agentId,
			workspaceDir,
			authStorage: stores.authStorage,
			modelRegistry: stores.modelRegistry,
			preparedModelRuntime: lease.snapshot
		})).model;
		if (!runtimeModel) return {
			run: (project) => project({}),
			[Symbol.asyncDispose]: async () => {}
		};
		const context = {
			modelApi: runtimeModel.api,
			runtimeModel
		};
		let released = false;
		let disposal;
		const acquired = {
			run: (project) => {
				if (released) throw new Error("Tool inventory model context has been released");
				return withPluginRuntimeGenerationScope(lease.snapshot, () => project(context));
			},
			[Symbol.asyncDispose]() {
				released = true;
				return disposal ??= lease[Symbol.asyncDispose]();
			}
		};
		transferred = true;
		return acquired;
	} finally {
		if (!transferred) await lease[Symbol.asyncDispose]();
	}
}
/** Resolves compatibility metadata explicitly configured for a provider/model pair. */
function resolveConfiguredModelCompat(params) {
	const provider = normalizeProviderId(params.modelProvider ?? "");
	const modelId = params.modelId?.trim() ?? "";
	if (!provider || !modelId) return;
	const providerConfig = resolveMergedModelProviderConfig(params.cfg, provider);
	const match = findConfiguredProviderModel(providerConfig, provider, modelId, (id) => normalizeLowercaseStringOrEmpty(normalizeStaticProviderModelId(provider, id)));
	return extractModelCompat(match);
}
/** Resolves the grouped effective tool inventory and user-visible filtering notices. */
function resolveEffectiveToolInventory(params) {
	const agentId = params.agentId?.trim() || resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
	const agentDir = params.agentDir ?? resolveAgentDir(params.cfg, agentId);
	const runtimeModelContext = Object.hasOwn(params, "modelApi") || Object.hasOwn(params, "runtimeModel") ? {
		modelApi: params.modelApi ?? params.runtimeModel?.api,
		runtimeModel: params.runtimeModel
	} : resolveStaticToolInventoryRuntimeModelContext({
		cfg: params.cfg,
		agentId,
		agentDir,
		workspaceDir,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const modelCompat = resolveConfiguredModelCompat({
		cfg: params.cfg,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const effectiveTools = createOpenClawCodingTools({
		agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		workspaceDir,
		agentDir,
		config: params.cfg,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		modelApi: runtimeModelContext.modelApi,
		modelBaseUrl: runtimeModelContext.runtimeModel?.baseUrl,
		modelCompat,
		messageProvider: params.messageProvider,
		senderId: params.senderId,
		senderName: params.senderName ?? void 0,
		senderUsername: params.senderUsername ?? void 0,
		senderE164: params.senderE164 ?? void 0,
		agentAccountId: params.accountId ?? void 0,
		currentChannelId: params.currentChannelId,
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		groupId: params.groupId ?? void 0,
		groupChannel: params.groupChannel ?? void 0,
		groupSpace: params.groupSpace ?? void 0,
		replyToMode: params.replyToMode,
		allowGatewaySubagentBinding: true,
		modelHasVision: params.modelHasVision,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
		disableMessageTool: params.disableMessageTool
	});
	const projectedInventory = buildRuntimeCompatibleToolInventory({
		tools: effectiveTools,
		cfg: params.cfg,
		workspaceDir,
		modelProvider: params.modelProvider,
		modelId: params.modelId,
		modelApi: runtimeModelContext.modelApi,
		runtimeModel: runtimeModelContext.runtimeModel
	});
	const effectivePolicy = resolveEffectiveToolPolicy({
		config: params.cfg,
		agentId,
		sessionKey: params.sessionKey,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const profile = effectivePolicy.providerProfile ?? effectivePolicy.profile ?? "full";
	const entries = projectedInventory.entries;
	const notices = [...projectedInventory.notices, ...buildToolInventoryNotices({
		cfg: params.cfg,
		profile,
		entries,
		effectivePolicy
	}) ?? []];
	return {
		agentId,
		profile,
		groups: buildEffectiveToolInventoryGroups(entries),
		...notices.length > 0 ? { notices } : {}
	};
}
//#endregion
export { buildEffectiveToolInventoryGroups as i, resolveConfiguredModelCompat as n, resolveEffectiveToolInventory as r, acquireEffectiveToolInventoryRuntimeModelContext as t };
