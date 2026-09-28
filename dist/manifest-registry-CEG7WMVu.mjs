import { i as getGatewayPluginMetadataSnapshot } from "./current-plugin-metadata-state-CVuZDJ9_.mjs";
import { t as buildPluginManifestRegistry } from "./manifest-registry-build-BbQTPsvD.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
//#region src/plugins/manifest-registry.ts
function loadPluginManifestRegistryCore(params = {}) {
	if (!params.candidates && !params.discovery && !params.installRecords) {
		const gatewaySnapshot = getGatewayPluginMetadataSnapshot();
		if (gatewaySnapshot) return gatewaySnapshot.manifestRegistry;
	}
	const env = params.env ?? process.env;
	let installRecords = params.installRecords;
	return buildPluginManifestRegistry({
		...params,
		env,
		getInstallRecords: () => installRecords ??= loadInstalledPluginIndexInstallRecordsSync({ env })
	});
}
//#endregion
export { loadPluginManifestRegistryCore as t };
