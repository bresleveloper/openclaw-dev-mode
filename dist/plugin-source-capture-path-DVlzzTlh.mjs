//#region src/plugins/plugin-source-capture-path.ts
const PLUGIN_SOURCE_CAPTURE_PREFIX = "openclaw-plugin-build-";
function isLegacyPluginSourceCaptureName(name) {
	return name.startsWith("openclaw-plugin-build-") || name.startsWith("openclaw-model-catalog-");
}
//#endregion
export { isLegacyPluginSourceCaptureName as n, PLUGIN_SOURCE_CAPTURE_PREFIX as t };
