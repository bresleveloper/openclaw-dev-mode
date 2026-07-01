import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { i as normalizeProviderId, n as findNormalizedProviderValue } from "./provider-id-Dq06Bcx6.js";
import { v as resolveSessionAgentId } from "./agent-scope-CDZXADgT.js";
import { a as resolveAgentDir, o as resolveAgentWorkspaceDir } from "./agent-scope-config-C3ijpoNo.js";
import { s as getActivePluginRegistry } from "./runtime-wIYJz8NY.js";
import { _ as normalizeProviderTransportWithPlugin } from "./provider-runtime-D4NEMgBr.js";
import { r as normalizeStaticProviderModelId } from "./model-ref-shared-D4KabxN2.js";
import { m as normalizeToolName } from "./tool-policy-Cm3NCEHp.js";
import { r as resolveEffectiveToolPolicy } from "./agent-tools.policy-CPsCsTmX.js";
import { M as getChannelAgentToolMeta } from "./agent-tools.before-tool-call-CP6dTokt.js";
import { i as getPluginToolMeta, t as buildPluginToolMetadataKey } from "./tools-DG6VDQeD.js";
import { n as extractModelCompat } from "./provider-model-compat-DAJmt9jr.js";
import { t as createOpenClawCodingTools } from "./agent-tools-z6g2AIKP.js";
import { r as resolveToolDisplay } from "./tool-display-CmK4LCnT.js";
import { t as resolveModel } from "./model-Cc001htM.js";
import { c as resolveBundledStaticCatalogModel } from "./model.static-catalog-BxhHL979.js";
import { n as filterRuntimeCompatibleTools, t as filterProviderNormalizableTools } from "./tool-schema-projection-Bld_BaX8.js";
import { n as normalizeAgentRuntimeTools } from "./tools-Dhwc74Cy.js";
import { n as summarizeToolDescriptionText } from "./tool-description-summary-CkIuDnKl.js";
//#region src/agents/tools-effective-inventory-shared.ts
function resolveEffectiveToolLabel(tool) {
	const rawLabel = normalizeOptionalString(tool.label) ?? "";
	if (rawLabel && normalizeLowercaseStringOrEmpty(rawLabel) !== normalizeLowercaseStringOrEmpty(tool.name)) return rawLabel;
	return resolveToolDisplay({ name: tool.name }).title;
}
function resolveEffectiveToolRawDescription(tool) {
	return normalizeOptionalString(tool.description) ?? "";
}
function summarizeEffectiveToolDescription(tool) {
	return summarizeToolDescriptionText({
		rawDescription: resolveEffectiveToolRawDescription(tool),
		displaySummary: tool.displaySummary
	});
}
function disambiguateEffectiveToolLabels(entries, resolveSuffix) {
	const counts = /* @__PURE__ */ new Map();
	for (const entry of entries) counts.set(entry.label, (counts.get(entry.label) ?? 0) + 1);
	return entries.map((entry) => {
		if ((counts.get(entry.label) ?? 0) < 2) return entry;
		return {
			...entry,
			label: `${entry.label} (${resolveSuffix(entry)})`
		};
	});
}
//#endregion
//#region src/agents/tools-effective-inventory-build.ts
/**
* Builds the operator-facing effective inventory for the current tool surface:
* runtime-compatible tools plus warnings for tools quarantined by schema
* policy, with plugin/channel ownership preserved.
*/
function resolveEffectiveToolSource(tool, fallbackTool) {
	const pluginMeta = getPluginToolMeta(tool) ?? (fallbackTool ? getPluginToolMeta(fallbackTool) : void 0);
	if (pluginMeta) {
		if (pluginMeta.pluginId === "bundle-mcp") return {
			source: "mcp",
			pluginId: pluginMeta.pluginId
		};
		return {
			source: "plugin",
			pluginId: pluginMeta.pluginId
		};
	}
	const channelMeta = getChannelAgentToolMeta(tool) ?? (fallbackTool ? getChannelAgentToolMeta(fallbackTool) : void 0);
	if (channelMeta) return {
		source: "channel",
		channelId: channelMeta.channelId
	};
	return { source: "core" };
}
function buildUnsupportedToolSchemaNotice(params) {
	const sourceTool = params.tool ?? params.fallbackTool;
	const source = sourceTool ? resolveEffectiveToolSource(sourceTool, params.fallbackTool) : { source: "core" };
	const owner = source.source === "plugin" && source.pluginId ? ` from plugin "${source.pluginId}"` : source.source === "channel" && source.channelId ? ` from channel "${source.channelId}"` : "";
	return {
		id: `unsupported-tool-schema:${params.diagnostic.toolName}`,
		severity: "warning",
		message: `Tool "${params.diagnostic.toolName}"${owner} has an unsupported runtime input schema (${params.diagnostic.violations.join(", ")}) and was quarantined before model projection. Fix or disable the owner, or remove the tool from active allowlists.`
	};
}
function buildUnsupportedToolSchemaNotices(params) {
	return params.diagnostics.map((diagnostic) => buildUnsupportedToolSchemaNotice({
		diagnostic,
		tool: readMatchingTool(params.tools, diagnostic),
		fallbackTool: params.rawToolsByName.get(diagnostic.toolName)
	}));
}
function readMatchingTool(tools, diagnostic) {
	try {
		const tool = tools[diagnostic.toolIndex];
		return tool?.name === diagnostic.toolName ? tool : void 0;
	} catch {
		return;
	}
}
function buildReadableRawToolsByName(tools) {
	const toolsByName = /* @__PURE__ */ new Map();
	let toolCount;
	try {
		toolCount = tools.length;
	} catch {
		return toolsByName;
	}
	for (let index = 0; index < toolCount; index += 1) try {
		const tool = tools[index];
		toolsByName.set(tool.name, tool);
	} catch {}
	return toolsByName;
}
/** Builds effective inventory entries from already runtime-compatible tools. */
function buildEffectiveToolInventoryEntries(tools, rawToolsByName = /* @__PURE__ */ new Map()) {
	const pluginToolMetadata = new Map((getActivePluginRegistry()?.toolMetadata ?? []).map((entry) => [buildPluginToolMetadataKey(entry.pluginId, entry.metadata.toolName), entry.metadata]));
	return disambiguateEffectiveToolLabels(tools.map((tool) => {
		const source = resolveEffectiveToolSource(tool, rawToolsByName.get(tool.name));
		const metadata = source.pluginId ? pluginToolMetadata.get(buildPluginToolMetadataKey(source.pluginId, tool.name)) : void 0;
		return Object.assign({
			id: tool.name,
			label: normalizeOptionalString(metadata?.displayName) ?? resolveEffectiveToolLabel(tool),
			description: normalizeOptionalString(metadata?.description) ?? summarizeEffectiveToolDescription(tool),
			rawDescription: normalizeOptionalString(metadata?.description) ?? resolveEffectiveToolRawDescription(tool) ?? summarizeEffectiveToolDescription(tool),
			...metadata?.risk ? { risk: metadata.risk } : {},
			...metadata?.tags ? { tags: metadata.tags } : {}
		}, source);
	}).toSorted((a, b) => a.label.localeCompare(b.label)), (entry) => entry.pluginId ?? entry.channelId ?? entry.id);
}
/** Normalizes tools, quarantines incompatible schemas, and returns inventory output. */
function buildRuntimeCompatibleToolInventory(params) {
	const rawToolsByName = buildReadableRawToolsByName(params.tools);
	const preNormalizationProjection = filterProviderNormalizableTools(params.tools);
	const preNormalizationDiagnostics = [...preNormalizationProjection.diagnostics];
	const normalizedTools = normalizeAgentRuntimeTools({
		tools: [...preNormalizationProjection.tools],
		provider: params.modelProvider ?? "",
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		modelId: params.modelId,
		modelApi: params.modelApi ?? void 0,
		model: params.runtimeModel,
		onPreNormalizationSchemaDiagnostics: (diagnostics) => preNormalizationDiagnostics.push(...diagnostics)
	});
	const projection = filterRuntimeCompatibleTools(normalizedTools);
	const diagnostics = [...preNormalizationDiagnostics, ...projection.diagnostics];
	return {
		entries: buildEffectiveToolInventoryEntries(projection.tools, rawToolsByName),
		notices: buildUnsupportedToolSchemaNotices({
			diagnostics,
			tools: normalizedTools,
			rawToolsByName
		})
	};
}
//#endregion
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
	const normalizedToolName = normalizeToolName(toolName);
	return list.some((entry) => normalizeToolName(entry) === normalizedToolName);
}
function policyDeniesTool(policy, toolName) {
	return listIncludesTool(policy?.deny, toolName) || listIncludesTool(policy?.deny, "group:ui") || listIncludesTool(policy?.deny, "group:openclaw");
}
function hasExplicitBrowserIntent(cfg) {
	return cfg.browser?.enabled !== false && Boolean(cfg.browser || cfg.plugins?.entries?.browser);
}
function buildToolInventoryNotices(params) {
	if (params.entries.some((entry) => normalizeToolName(entry.id) === "browser") || !hasExplicitBrowserIntent(params.cfg)) return;
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
		message: "Browser is configured, but the current tool profile does not include the browser tool. Add tools.alsoAllow: [\"browser\"] or agents.list[].tools.alsoAllow: [\"browser\"]; tools.subagents.tools.allow alone cannot add it back after profile filtering."
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
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		context: {
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			provider: params.provider,
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
function resolveDynamicRuntimeModelContext(params) {
	const runtimeModel = resolveModel(params.provider, params.modelId, params.agentDir, params.cfg, { workspaceDir: params.workspaceDir }).model;
	if (!runtimeModel) return {};
	return {
		modelApi: runtimeModel.api,
		runtimeModel
	};
}
/** Resolves the runtime model metadata needed to filter model-compatible tools. */
function resolveEffectiveToolInventoryRuntimeModelContext(params) {
	const provider = normalizeProviderId(params.modelProvider ?? "");
	const modelId = params.modelId?.trim() ?? "";
	if (!provider || !modelId) return {};
	const agentId = params.agentId?.trim() || resolveSessionAgentId({ config: params.cfg });
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
	const providerConfig = findNormalizedProviderValue(params.cfg.models?.providers, provider);
	const configuredModels = Array.isArray(providerConfig?.models) ? providerConfig.models : [];
	const normalizedModelId = normalizeStaticProviderModelId(provider, modelId);
	const normalizedModelKey = normalizeLowercaseStringOrEmpty(normalizedModelId);
	const providerPrefixedModelKey = normalizeLowercaseStringOrEmpty(`${provider}/${normalizedModelId}`);
	const configuredModel = configuredModels.find((model) => {
		const key = normalizeLowercaseStringOrEmpty(normalizeStaticProviderModelId(provider, model.id));
		return key === normalizedModelKey || key === providerPrefixedModelKey;
	});
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
				id: configuredModel.id,
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
	if (!bundledStaticModel) return resolveDynamicRuntimeModelContext({
		cfg: params.cfg,
		agentDir: params.agentDir,
		workspaceDir,
		provider,
		modelId
	});
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
function resolveEffectiveModelCompat(params) {
	const provider = normalizeProviderId(params.modelProvider ?? "");
	const modelId = params.modelId?.trim() ?? "";
	if (!provider || !modelId) return;
	const providerConfig = findNormalizedProviderValue(params.cfg.models?.providers, provider);
	const models = Array.isArray(providerConfig?.models) ? providerConfig.models : [];
	if (models.length === 0) return;
	const normalizedModelId = normalizeStaticProviderModelId(provider, modelId);
	const normalizedModelKey = normalizeLowercaseStringOrEmpty(normalizedModelId);
	const providerPrefixedModelKey = normalizeLowercaseStringOrEmpty(`${provider}/${normalizedModelId}`);
	return extractModelCompat(models.find((model) => {
		const key = normalizeLowercaseStringOrEmpty(normalizeStaticProviderModelId(provider, model.id));
		return key === normalizedModelKey || key === providerPrefixedModelKey;
	}));
}
/** Resolves the grouped effective tool inventory and user-visible filtering notices. */
function resolveEffectiveToolInventory(params) {
	const agentId = params.agentId?.trim() || resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg
	});
	const workspaceDir = params.workspaceDir ?? resolveAgentWorkspaceDir(params.cfg, agentId);
	const agentDir = params.agentDir ?? resolveAgentDir(params.cfg, agentId);
	const runtimeModelContext = params.modelApi || params.runtimeModel ? {
		modelApi: params.modelApi ?? params.runtimeModel?.api,
		runtimeModel: params.runtimeModel
	} : resolveEffectiveToolInventoryRuntimeModelContext({
		cfg: params.cfg,
		agentId,
		agentDir,
		workspaceDir,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const modelCompat = resolveEffectiveModelCompat({
		cfg: params.cfg,
		modelProvider: params.modelProvider,
		modelId: params.modelId
	});
	const projectedInventory = buildRuntimeCompatibleToolInventory({
		tools: createOpenClawCodingTools({
			agentId,
			sessionKey: params.sessionKey,
			workspaceDir,
			agentDir,
			config: params.cfg,
			modelProvider: params.modelProvider,
			modelId: params.modelId,
			modelApi: runtimeModelContext.modelApi,
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
		}),
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
export { resolveEffectiveToolLabel as a, disambiguateEffectiveToolLabels as i, resolveEffectiveToolInventoryRuntimeModelContext as n, resolveEffectiveToolRawDescription as o, buildEffectiveToolInventoryGroups as r, summarizeEffectiveToolDescription as s, resolveEffectiveToolInventory as t };
