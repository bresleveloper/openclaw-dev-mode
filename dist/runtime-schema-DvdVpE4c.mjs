import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-DkPagH0y.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DeOUS5WQ.mjs";
import { c as collectChannelSchemaMetadataCore, l as collectPluginSchemaMetadataCore, s as resolveChannelSchemaSelection } from "./validation-gzn6Bd6i.mjs";
import { s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { t as buildConfigSchemaCore } from "./schema-r6axo63S.mjs";
//#region src/config/runtime-schema.ts
/** Builds one config schema from an exact manifest registry. */
function buildRuntimeConfigSchemaFromRegistry(registry, config) {
	return buildConfigSchemaCore({
		plugins: collectPluginSchemaMetadataCore(registry),
		channels: collectChannelSchemaMetadataCore(registry, resolveChannelSchemaSelection(registry, config))
	});
}
let gatewaySchemaCache = null;
function invalidateGatewayRuntimeConfigSchema() {
	gatewaySchemaCache = null;
}
/** RPC and document readers share schema metadata for one prepared config and plugin generation. */
function loadGatewayRuntimeConfigSchema(config = readRuntimeConfig()) {
	const pluginRegistryVersion = getActivePluginRegistryVersion();
	if (gatewaySchemaCache?.config === config && gatewaySchemaCache.pluginRegistryVersion === pluginRegistryVersion) return gatewaySchemaCache.response;
	const response = buildRuntimeConfigSchemaFromRegistry(resolveConfigWidePluginManifestRegistry({
		config,
		env: process.env
	}), config);
	gatewaySchemaCache = {
		config,
		pluginRegistryVersion,
		response
	};
	return response;
}
async function readBestEffortRuntimeConfigSchema(prepared) {
	const snapshot = prepared?.snapshot ?? await readConfigFileSnapshot({ observe: false });
	const config = snapshot.valid ? snapshot.sourceConfig : {
		agents: { entries: { main: {} } },
		plugins: { enabled: true }
	};
	const registry = (snapshot.valid ? prepared?.pluginMetadataSnapshot?.manifestRegistry : void 0) ?? resolveConfigWidePluginManifestRegistry({
		config,
		env: process.env
	});
	if (snapshot.valid) return buildRuntimeConfigSchemaFromRegistry(registry, config);
	return buildConfigSchemaCore({
		plugins: [],
		channels: collectChannelSchemaMetadataCore(registry, resolveChannelSchemaSelection(registry, config))
	});
}
//#endregion
export { readBestEffortRuntimeConfigSchema as i, invalidateGatewayRuntimeConfigSchema as n, loadGatewayRuntimeConfigSchema as r, buildRuntimeConfigSchemaFromRegistry as t };
