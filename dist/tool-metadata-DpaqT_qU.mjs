import { l as normalizeToolPolicyName } from "./tool-policy-shared-auQCQEhM.mjs";
//#region src/plugins/tool-metadata.ts
const pluginToolMeta = /* @__PURE__ */ new WeakMap();
/** Attaches plugin ownership metadata to a concrete agent tool instance. */
function setPluginToolMeta(tool, meta) {
	pluginToolMeta.set(tool, meta);
}
/** Reads plugin ownership metadata for a concrete agent tool instance. */
function getPluginToolMeta(tool) {
	return pluginToolMeta.get(tool);
}
/** Copies plugin ownership metadata when wrappers replace a tool object. */
function copyPluginToolMeta(source, target) {
	const meta = pluginToolMeta.get(source);
	if (meta) pluginToolMeta.set(target, meta);
}
/** Builds a collision-proof key for plugin-owned tool metadata lookups. */
function buildPluginToolMetadataKey(pluginId, toolName) {
	return JSON.stringify([pluginId, toolName]);
}
/** Binds a side-effect declaration to the concrete plugin tool that owns it. */
function getPluginToolSideEffectOwnerKey(tool) {
	const meta = getPluginToolMeta(tool);
	const toolName = normalizeToolPolicyName(tool.name);
	return meta?.sideEffecting && toolName ? buildPluginToolMetadataKey(meta.pluginId, toolName) : void 0;
}
//#endregion
export { setPluginToolMeta as a, getPluginToolSideEffectOwnerKey as i, copyPluginToolMeta as n, getPluginToolMeta as r, buildPluginToolMetadataKey as t };
