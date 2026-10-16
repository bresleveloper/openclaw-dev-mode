import { r as parseCodexPluginMarketplaceId } from "./plugin-marketplace-discovery-SQPhSuic.mjs";
import { asOptionalRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { normalizeMcpCodexToolAnnotations, readMcpAppIcons, readMcpAppSettingsCapability, readMcpAppToolExtensions } from "openclaw/plugin-sdk/codex-mcp-projection";
//#region extensions/codex/src/app-server/mcp-tool-metadata.ts
function projectCodexMcpServerMetadata(status) {
	const plugin = status.pluginId ? parseCodexPluginMarketplaceId(status.pluginId) : void 0;
	return {
		serverName: status.name,
		launchSummary: "Codex native MCP connection",
		...status.pluginId ? {
			pluginId: plugin?.pluginName ?? status.pluginId,
			marketplace: plugin?.marketplaceName
		} : {},
		title: status.serverInfo?.title ?? void 0,
		icons: readMcpAppIcons(status.serverInfo?.icons),
		settings: readMcpAppSettingsCapability(status.serverCapabilities),
		toolCount: Object.keys(status.tools).length
	};
}
function projectCodexMcpToolMetadata(toolName, raw) {
	const tool = asOptionalRecord(raw);
	return {
		title: normalizeOptionalString(tool?.title) ?? normalizeOptionalString(asOptionalRecord(tool?.annotations)?.title),
		fallbackDescription: normalizeOptionalString(tool?.description) ?? toolName,
		appExtensions: readMcpAppToolExtensions(tool ?? {}),
		codexAnnotations: normalizeMcpCodexToolAnnotations(tool?.annotations),
		uiResourceUri: normalizeOptionalString(asOptionalRecord(asOptionalRecord(tool?._meta)?.ui)?.resourceUri)
	};
}
/** Hosted app ownership is authoritative only on metadata supplied by Codex. */
function readCodexMcpToolConnectorId(tool) {
	const metadata = asOptionalRecord(asOptionalRecord(tool)?.["_meta"]);
	return normalizeOptionalString(metadata?.connector_id) ?? normalizeOptionalString(metadata?.connectorId);
}
/** Preserve MCP App visibility so model-only tools cannot become widget authority. */
function readCodexMcpToolUiVisibility(tool) {
	const metadata = asOptionalRecord(asOptionalRecord(tool)?.["_meta"]);
	const visibility = asOptionalRecord(metadata?.ui)?.visibility;
	if (!Array.isArray(visibility)) return;
	return [...new Set(visibility.filter((value) => value === "app" || value === "model"))].toSorted();
}
//#endregion
export { readCodexMcpToolUiVisibility as i, projectCodexMcpToolMetadata as n, readCodexMcpToolConnectorId as r, projectCodexMcpServerMetadata as t };
