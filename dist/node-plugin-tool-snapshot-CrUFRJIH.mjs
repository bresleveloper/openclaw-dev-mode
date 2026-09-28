import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./node-commands-BLhGKTZa.mjs";
//#region src/gateway/node-plugin-tool-snapshot.ts
/** Connected node-hosted plugin tools available to agent tool resolution. */
const toolsByNodeId = /* @__PURE__ */ new Map();
const NODE_PLUGIN_TOOL_NAME_RE = /^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
const NODE_PLUGIN_TOOL_DESCRIPTION_MAX_LENGTH = 1024;
const NODE_PLUGIN_TOOL_MAX_DESCRIPTORS = 128;
const log = createSubsystemLogger("gateway/node-plugin-tools");
let snapshotVersion = 0;
function bumpSnapshotVersion() {
	snapshotVersion += 1;
}
function defaultParameters() {
	return {
		type: "object",
		properties: {},
		additionalProperties: true
	};
}
function isProviderSafeToolName(value) {
	return NODE_PLUGIN_TOOL_NAME_RE.test(value);
}
function createRegisteredNodePluginToolDescriptorMap(commands) {
	const descriptors = /* @__PURE__ */ new Map();
	for (const entry of commands ?? []) {
		const agentTool = entry.command.agentTool;
		const name = normalizeOptionalString(agentTool?.name) ?? "";
		const description = normalizeOptionalString(agentTool?.description) ?? "";
		const command = normalizeOptionalString(entry.command.command) ?? "";
		if (!isProviderSafeToolName(name) || !description || !command) continue;
		const mcpServer = normalizeOptionalString(agentTool?.mcp?.server) ?? "";
		const mcpTool = normalizeOptionalString(agentTool?.mcp?.tool) ?? "";
		descriptors.set(`${entry.pluginId}\0${name}\0${command}`, {
			pluginId: entry.pluginId,
			name,
			description,
			parameters: asOptionalRecord(agentTool?.parameters) ?? defaultParameters(),
			command,
			...mcpServer && mcpTool ? { mcp: {
				server: mcpServer,
				tool: mcpTool
			} } : {}
		});
	}
	return descriptors;
}
function normalizeNodePluginToolDescriptors(params) {
	if (params.enabled === false) return [];
	const allowedCommands = new Set(params.allowedCommands);
	const normalized = [];
	for (const tool of params.tools ?? []) {
		const pluginId = normalizeOptionalString(tool.pluginId) ?? "";
		const name = normalizeOptionalString(tool.name) ?? "";
		const description = (normalizeOptionalString(tool.description) ?? "").slice(0, NODE_PLUGIN_TOOL_DESCRIPTION_MAX_LENGTH);
		const command = normalizeOptionalString(tool.command) ?? "";
		if (!pluginId || !isProviderSafeToolName(name) || !description || !command || !allowedCommands.has(command)) continue;
		if (pluginId === "node-mcp" && (command !== "mcp.tools.call.v1" || !tool.mcp?.server || !tool.mcp?.tool)) {
			log.warn(`node ${params.nodeId} published non-MCP descriptor under reserved node-mcp id`);
			continue;
		}
		const registeredDescriptor = params.registeredDescriptors.get(`${pluginId}\0${name}\0${command}`);
		const descriptor = registeredDescriptor ?? tool;
		const descriptorDescription = (normalizeOptionalString(descriptor.description) ?? "").slice(0, NODE_PLUGIN_TOOL_DESCRIPTION_MAX_LENGTH);
		const mcpServer = normalizeOptionalString(descriptor.mcp?.server) ?? "";
		const mcpTool = normalizeOptionalString(descriptor.mcp?.tool) ?? "";
		normalized.push({
			descriptor: {
				pluginId,
				name,
				description: descriptorDescription,
				parameters: asOptionalRecord(descriptor.parameters) ?? defaultParameters(),
				command,
				...mcpServer && mcpTool ? { mcp: {
					server: mcpServer,
					tool: mcpTool
				} } : {}
			},
			registered: Boolean(registeredDescriptor)
		});
	}
	normalized.sort((left, right) => left.descriptor.pluginId.localeCompare(right.descriptor.pluginId) || left.descriptor.name.localeCompare(right.descriptor.name) || (left.descriptor.command ?? "").localeCompare(right.descriptor.command ?? ""));
	const byKey = /* @__PURE__ */ new Map();
	for (const entry of normalized) {
		const key = `${entry.descriptor.pluginId}\0${entry.descriptor.name}`;
		if (!byKey.has(key)) byKey.set(key, entry);
	}
	const entries = [...byKey.values()];
	const droppedCount = entries.length - NODE_PLUGIN_TOOL_MAX_DESCRIPTORS;
	if (droppedCount > 0) log.warn(`node ${params.nodeId} published ${entries.length} plugin tool descriptors; dropped ${droppedCount} beyond the ${NODE_PLUGIN_TOOL_MAX_DESCRIPTORS} descriptor limit`);
	return entries.slice(0, NODE_PLUGIN_TOOL_MAX_DESCRIPTORS);
}
function replaceConnectedNodePluginTools(params) {
	if (params.tools.length === 0) {
		if (toolsByNodeId.delete(params.nodeId)) bumpSnapshotVersion();
		return;
	}
	toolsByNodeId.set(params.nodeId, params.tools.map((entry) => ({
		nodeId: params.nodeId,
		displayName: params.displayName,
		platform: params.platform,
		remoteIp: params.remoteIp,
		descriptor: entry.descriptor,
		registered: entry.registered
	})));
	bumpSnapshotVersion();
}
function removeConnectedNodePluginTools(nodeId) {
	if (toolsByNodeId.delete(nodeId)) bumpSnapshotVersion();
}
function listConnectedNodePluginTools() {
	return [...toolsByNodeId.values()].flat().toSorted((left, right) => left.descriptor.pluginId.localeCompare(right.descriptor.pluginId) || left.descriptor.name.localeCompare(right.descriptor.name) || left.nodeId.localeCompare(right.nodeId));
}
function getConnectedNodePluginToolsVersion() {
	return snapshotVersion;
}
//#endregion
export { removeConnectedNodePluginTools as a, normalizeNodePluginToolDescriptors as i, getConnectedNodePluginToolsVersion as n, replaceConnectedNodePluginTools as o, listConnectedNodePluginTools as r, createRegisteredNodePluginToolDescriptorMap as t };
