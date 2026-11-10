import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as getGatewayPluginMetadataSnapshot, r as getCurrentPluginMetadataSnapshotState } from "./current-plugin-metadata-state-jN_Zk4yK.mjs";
import { n as discoverOpenClawPlugins } from "./discovery-B5pUUvVG.mjs";
import { r as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-store-path-SeqhMDBO.mjs";
import { i as loadInstalledPluginIndexInstallRecordsSync } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { n as resolvePluginTrust } from "./installed-plugin-record-match-DOKPvujF.mjs";
import { t as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-env-DDlhnyCt.mjs";
//#region src/plugins/channel-catalog-registry.ts
const log = createSubsystemLogger("plugins/channel-catalog");
function listChannelCatalogEntries(params = {}) {
	let discovery = params.discovery;
	const installRecords = params.installRecords ?? (discovery ? void 0 : resolveInstallRecords(params));
	if (!discovery) discovery = discoverOpenClawPlugins({
		workspaceDir: params.workspaceDir,
		env: params.env,
		extraPaths: params.extraPaths,
		...installRecords && Object.keys(installRecords).length > 0 ? { installRecords } : {}
	});
	return discovery.candidates.flatMap((candidate) => {
		if (params.origin && candidate.origin !== params.origin) return [];
		const channel = candidate.packageManifest?.channel;
		if (!channel?.id) return [];
		const pluginId = normalizeOptionalString(candidate.bundledManifest?.id) ?? normalizeOptionalString(candidate.bundledManifestId) ?? normalizeOptionalString(candidate.packageManifest?.plugin?.id) ?? normalizeOptionalString(candidate.idHint);
		if (!pluginId) return [];
		return [{
			pluginId,
			...installRecords && resolvePluginTrust({
				candidate,
				installRecords,
				env: params.env ?? process.env,
				registryPath: resolveInstalledPluginIndexStorePath({ env: params.env })
			}).reason === "trusted-official" ? { trustedOfficialInstall: true } : {},
			origin: candidate.origin,
			packageName: candidate.packageName,
			workspaceDir: candidate.workspaceDir,
			rootDir: candidate.rootDir,
			channel,
			...candidate.packageManifest?.install ? { install: candidate.packageManifest.install } : {}
		}];
	});
}
function resolveInstallRecords(params) {
	if (params.installRecords || params.origin === "bundled") return params.installRecords;
	const snapshot = getGatewayPluginMetadataSnapshot();
	if (snapshot && getCurrentPluginMetadataSnapshotState().envFingerprint === resolvePluginMetadataEnvFingerprint(params.env)) return snapshot.index.installRecords;
	try {
		return loadInstalledPluginIndexInstallRecordsSync(params.env ? { env: params.env } : {});
	} catch (error) {
		log.warn("Channel catalog could not load plugin installation records; installed channels may be missing. Run openclaw doctor to inspect plugin state.", { error });
		return;
	}
}
//#endregion
export { listChannelCatalogEntries as t };
