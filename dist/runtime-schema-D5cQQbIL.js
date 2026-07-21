import "./agent-scope-B2Pk_xhT.js";
import { c as resolveDefaultAgentId, o as resolveAgentWorkspaceDir } from "./agent-scope-config-BxAUeF6t.js";
import { a as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-fqwcFyP9.js";
import { D as collectChannelSchemaMetadata, O as collectPluginSchemaMetadata, i as getRuntimeConfig, u as readConfigFileSnapshot } from "./io-DxnOT4sF.js";
import "./config-Cc93keN1.js";
import { t as buildConfigSchema } from "./schema-DRyO1XBt.js";
//#region src/config/runtime-schema.ts
function loadManifestRegistry(config, env) {
	const workspaceDir = resolveAgentWorkspaceDir(config, resolveDefaultAgentId(config));
	return resolvePluginMetadataSnapshot({
		config,
		env: env ?? process.env,
		workspaceDir,
		allowWorkspaceScopedCurrent: true
	}).manifestRegistry;
}
/** Builds the config schema from the active runtime config and plugin metadata. */
function loadGatewayRuntimeConfigSchema() {
	const registry = loadManifestRegistry(getRuntimeConfig());
	return buildConfigSchema({
		plugins: collectPluginSchemaMetadata(registry),
		channels: collectChannelSchemaMetadata(registry)
	});
}
async function readBestEffortRuntimeConfigSchema() {
	const snapshot = await readConfigFileSnapshot();
	const registry = loadManifestRegistry(snapshot.valid ? snapshot.config : { plugins: { enabled: true } });
	return buildConfigSchema({
		plugins: snapshot.valid ? collectPluginSchemaMetadata(registry) : [],
		channels: collectChannelSchemaMetadata(registry)
	});
}
//#endregion
export { readBestEffortRuntimeConfigSchema as n, loadGatewayRuntimeConfigSchema as t };
