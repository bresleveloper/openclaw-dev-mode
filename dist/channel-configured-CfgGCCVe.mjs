import { i as listBundledChannelIdsForPackageState, n as hasBundledChannelPackageState } from "./package-state-probes-DT9QRO40.mjs";
import { i as resolveChannelConfigRecord, n as hasMeaningfulChannelConfigShallow } from "./channel-config-activation-CjIoaWiA.mjs";
import { t as getBootstrapChannelPlugin } from "./bootstrap-registry-DlD4zNx-.mjs";
//#region src/config/channel-configured.ts
/** Resolves whether a channel has enough config, env, or plugin state to be considered setup. */
function isChannelConfigured(cfg, channelId, env = process.env) {
	if (hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId), channelId)) return true;
	if (listBundledChannelIdsForPackageState("configuredState").includes(channelId.trim())) return hasBundledChannelPackageState({
		metadataKey: "configuredState",
		channelId,
		cfg,
		env
	});
	const plugin = getBootstrapChannelPlugin(channelId);
	return Boolean(plugin?.config?.hasConfiguredState?.({
		cfg,
		env
	}));
}
//#endregion
export { isChannelConfigured as t };
