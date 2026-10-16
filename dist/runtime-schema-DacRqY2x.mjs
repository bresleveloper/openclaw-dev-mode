import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DdBZxRt7.mjs";
import { c as collectPluginSchemaMetadataCore, o as resolveChannelSchemaSelection, s as collectChannelSchemaMetadataCore } from "./validation-R7HXbC_L.mjs";
import { c as readConfigFileSnapshot, r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import { t as buildConfigSchemaCore } from "./schema-BBhEexxB.mjs";
//#region src/config/runtime-schema.ts
/** Builds one config schema from an exact manifest registry. */
function buildRuntimeConfigSchemaFromRegistry(registry, config) {
	return buildConfigSchemaCore({
		plugins: collectPluginSchemaMetadataCore(registry),
		channels: collectChannelSchemaMetadataCore(registry, resolveChannelSchemaSelection(registry, config))
	});
}
/** Builds the config schema from the active runtime config and plugin metadata. */
function loadGatewayRuntimeConfigSchema() {
	const config = getRuntimeConfig();
	return buildRuntimeConfigSchemaFromRegistry(resolveConfigWidePluginManifestRegistry({
		config,
		env: process.env
	}), config);
}
async function readBestEffortRuntimeConfigSchema() {
	const snapshot = await readConfigFileSnapshot({ observe: false });
	const config = snapshot.valid ? snapshot.sourceConfig : {
		agents: { entries: { main: {} } },
		plugins: { enabled: true }
	};
	const registry = resolveConfigWidePluginManifestRegistry({
		config,
		env: process.env
	});
	return buildConfigSchemaCore({
		plugins: snapshot.valid ? collectPluginSchemaMetadataCore(registry) : [],
		channels: collectChannelSchemaMetadataCore(registry, resolveChannelSchemaSelection(registry, config))
	});
}
//#endregion
export { loadGatewayRuntimeConfigSchema as n, readBestEffortRuntimeConfigSchema as r, buildRuntimeConfigSchemaFromRegistry as t };
