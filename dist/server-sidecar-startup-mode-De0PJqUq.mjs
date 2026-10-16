import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
//#region src/gateway/server-sidecar-startup-mode.ts
function isChannelStartupSuppressedByEnvironment(env = process.env) {
	return isTruthyEnvValue(env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(env.OPENCLAW_SKIP_PROVIDERS);
}
//#endregion
export { isChannelStartupSuppressedByEnvironment as t };
