import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { l as getActivePluginRegistry } from "./runtime-DfYPSUKC.mjs";
import { r as getPluginToolMeta, t as buildPluginToolMetadataKey } from "./tool-metadata-DEC0Rqn3.mjs";
import { p as getChannelAgentToolMeta } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import { o as resolveToolDisplay } from "./tool-display-B85JC1BH.mjs";
import "./channel-tools-BhIPLlm-.mjs";
import { n as filterRuntimeCompatibleTools } from "./tool-schema-projection-D9z9oa3w.mjs";
import { n as normalizeAgentRuntimeTools } from "./tools-Xj0amRUJ.mjs";
import { n as summarizeToolDescriptionText } from "./tool-description-summary-Rk6k7zPi.mjs";
//#region src/agents/tools-effective-inventory-shared.ts
function resolveEffectiveToolLabel(tool) {
	const rawLabel = normalizeOptionalString(tool.label) ?? "";
	if (rawLabel && normalizeLowercaseStringOrEmpty(rawLabel) !== normalizeLowercaseStringOrEmpty(tool.name)) return rawLabel;
	return resolveToolDisplay({ name: tool.name }).title;
}
function summarizeEffectiveToolDescription(tool) {
	return summarizeToolDescriptionText({
		rawDescription: normalizeOptionalString(tool.description),
		displaySummary: tool.displaySummary
	});
}
function buildEffectiveToolInventory(params, projection) {
	const diagnostics = [];
	const normalizedTools = normalizeAgentRuntimeTools({
		tools: params.tools,
		provider: params.modelProvider ?? "",
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		modelId: params.modelId,
		modelApi: params.modelApi ?? void 0,
		model: params.runtimeModel,
		allowProviderRuntimePluginLoad: projection.allowProviderRuntimePluginLoad,
		onPreNormalizationSchemaDiagnostics: (found) => diagnostics.push(...found)
	});
	const compatible = filterRuntimeCompatibleTools(normalizedTools);
	diagnostics.push(...compatible.diagnostics);
	const projectTool = projection.createToolProjection();
	const entries = [];
	for (const tool of compatible.tools) {
		const projected = projectTool(tool);
		const description = projected.description ?? summarizeEffectiveToolDescription(tool);
		entries.push({
			id: tool.name,
			...projected,
			label: projected.label ?? resolveEffectiveToolLabel(tool),
			description,
			rawDescription: projected.rawDescription ?? (normalizeOptionalString(tool.description) || (projection.rawDescriptionFallback === "summary" ? description : ""))
		});
	}
	entries.sort((a, b) => a.label.localeCompare(b.label));
	const counts = /* @__PURE__ */ new Map();
	for (const entry of entries) counts.set(entry.label, (counts.get(entry.label) ?? 0) + 1);
	for (const entry of entries) if ((counts.get(entry.label) ?? 0) > 1) entry.label = `${entry.label} (${entry.pluginId ?? entry.channelId ?? entry.id})`;
	return {
		entries,
		notices: diagnostics.map((diagnostic) => ({
			id: `unsupported-tool-schema:${diagnostic.toolName}`,
			severity: "warning",
			message: `Tool "${diagnostic.toolName}"${projection.diagnosticOwner(diagnostic, normalizedTools)} has an unsupported runtime input schema (${diagnostic.violations.join(", ")}) and was quarantined before model projection. Fix or disable the owner, or remove the tool from active allowlists.`
		}))
	};
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
	if (pluginMeta) return {
		source: pluginMeta.mcp || pluginMeta.pluginId === "bundle-mcp" ? "mcp" : "plugin",
		pluginId: pluginMeta.pluginId
	};
	const channelMeta = getChannelAgentToolMeta(tool) ?? (fallbackTool ? getChannelAgentToolMeta(fallbackTool) : void 0);
	if (channelMeta) return {
		source: "channel",
		channelId: channelMeta.channelId
	};
	return { source: "core" };
}
function readMatchingTool(tools, diagnostic) {
	try {
		const tool = tools[diagnostic.toolIndex];
		return tool?.name === diagnostic.toolName ? tool : void 0;
	} catch {
		return;
	}
}
function buildReadableToolsByName(tools) {
	const toolsByName = /* @__PURE__ */ new Map();
	let toolCount;
	try {
		toolCount = tools.length;
	} catch {
		return toolsByName;
	}
	for (let index = 0; index < toolCount; index += 1) try {
		const tool = tools.at(index);
		if (tool) toolsByName.set(tool.name, tool);
	} catch {}
	return toolsByName;
}
function buildRuntimeCompatibleToolInventory(params) {
	const rawToolsByName = buildReadableToolsByName(params.tools);
	return buildEffectiveToolInventory(params, {
		createToolProjection: () => {
			const pluginToolMetadata = new Map((getActivePluginRegistry()?.toolMetadata ?? []).map((entry) => [buildPluginToolMetadataKey(entry.pluginId, entry.metadata.toolName), entry.metadata]));
			return (tool) => {
				const source = resolveEffectiveToolSource(tool, rawToolsByName.get(tool.name));
				const metadata = source.pluginId ? pluginToolMetadata.get(buildPluginToolMetadataKey(source.pluginId, tool.name)) : void 0;
				const label = normalizeOptionalString(metadata?.displayName);
				const description = normalizeOptionalString(metadata?.description);
				return {
					...source,
					...label ? { label } : {},
					...description ? {
						description,
						rawDescription: description
					} : {},
					...metadata?.risk ? { risk: metadata.risk } : {},
					...metadata?.tags ? { tags: metadata.tags } : {}
				};
			};
		},
		diagnosticOwner: (diagnostic, tools) => {
			const fallbackTool = rawToolsByName.get(diagnostic.toolName);
			const tool = readMatchingTool(tools, diagnostic) ?? fallbackTool;
			const source = tool ? resolveEffectiveToolSource(tool, fallbackTool) : void 0;
			return source?.source === "plugin" && source.pluginId ? ` from plugin "${source.pluginId}"` : source?.source === "channel" && source.channelId ? ` from channel "${source.channelId}"` : "";
		}
	});
}
//#endregion
export { buildRuntimeCompatibleToolInventory as n, buildEffectiveToolInventory as r, buildReadableToolsByName as t };
