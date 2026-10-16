import { t as adoptCurrentPluginMetadataSnapshotIfAbsent } from "./current-plugin-metadata-snapshot-DkhWcws3.mjs";
import { n as completePluginMetadataSnapshot } from "./plugin-metadata-snapshot-6weqkLDz.mjs";
import { d as readConfigFileSnapshotWithPluginMetadata } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
//#region src/cli/command-config-snapshot.ts
/** Reads full command config and adopts its metadata without replacing an existing owner. */
async function readCommandConfigSnapshot(options) {
	const read = await readConfigFileSnapshotWithPluginMetadata(options);
	const pluginMetadataSnapshot = completePluginMetadataSnapshot({
		snapshot: read.pluginMetadataSnapshot,
		config: read.snapshot.sourceConfig,
		env: process.env,
		workspaceDir: read.pluginMetadataSnapshot?.workspaceDir
	});
	if (pluginMetadataSnapshot) adoptCurrentPluginMetadataSnapshotIfAbsent(pluginMetadataSnapshot, {
		config: read.snapshot.sourceConfig,
		compatibleConfigs: [read.snapshot.config, read.snapshot.runtimeConfig],
		env: process.env,
		workspaceDir: pluginMetadataSnapshot.workspaceDir
	});
	return {
		...read,
		pluginMetadataSnapshot
	};
}
//#endregion
export { readCommandConfigSnapshot };
