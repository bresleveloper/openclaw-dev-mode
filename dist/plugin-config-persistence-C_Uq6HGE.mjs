import { t as commitConfigWithPendingPluginInstalls } from "./install-record-commit-I97ACS0P.mjs";
import { n as refreshPluginRegistryAfterConfigMutation } from "./registry-refresh-jgowtM4M.mjs";
//#region src/commands/channels/plugin-config-persistence.ts
async function persistChannelPluginConfig(params) {
	const committed = await commitConfigWithPendingPluginInstalls({
		sourceConfig: params.cfg,
		baseHash: params.baseHash,
		writeOptions: params.writeOptions
	});
	if (committed.movedInstallRecords || params.pluginInstalled) await refreshPluginRegistryAfterConfigMutation({
		reason: "source-changed",
		logger: { warn: (message) => params.runtime.log(message) }
	});
	return committed;
}
//#endregion
export { persistChannelPluginConfig as t };
