import { t as isChannelStartupSuppressedByEnvironment } from "./server-sidecar-startup-mode-BZT1Vmld.mjs";
//#region src/gateway/server-startup-secret-surfaces.ts
function resolveGatewayStartupSourceConfig(config, env) {
	if (!isChannelStartupSuppressedByEnvironment(env) || !config.channels) return config;
	return {
		...config,
		channels: void 0
	};
}
//#endregion
export { resolveGatewayStartupSourceConfig as t };
