import { t as getChannelEnvVars } from "./channel-env-vars-CEhNrUY5.mjs";
import { i as resolveChannelConfigRecord, n as hasMeaningfulChannelConfigShallow } from "./channel-config-activation-CjIoaWiA.mjs";
//#region src/config/channel-configured-shared.ts
/** Detects static channel configuration from known env vars or `channels.<id>` config. */
function isStaticallyChannelConfigured(cfg, channelId, env = process.env) {
	for (const envVar of getChannelEnvVars(channelId, {
		config: cfg,
		env
	})) if (typeof env[envVar] === "string" && env[envVar].trim().length > 0) return true;
	return hasMeaningfulChannelConfigShallow(resolveChannelConfigRecord(cfg, channelId), channelId);
}
//#endregion
export { isStaticallyChannelConfigured as t };
