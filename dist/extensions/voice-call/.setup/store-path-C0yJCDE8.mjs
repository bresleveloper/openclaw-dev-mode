import { resolvePluginConfigObject } from "openclaw/plugin-sdk/plugin-config-runtime";
import os from "node:os";
import path from "node:path";
import { resolveStateDir } from "openclaw/plugin-sdk/state-paths";
// extensions/voice-call/src/utils.ts
/** Runtime uses the OS home; Doctor supplies the home from its migration environment. */
function resolveUserPath(input, homedir = os.homedir) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	return path.resolve(trimmed.replace(/^~(?=$|[\\/])/, homedir));
}
// extensions/voice-call/src/store-path.ts
/** Resolve the plugin-owned store below OpenClaw's canonical state directory. */
function resolveDefaultVoiceCallStoreDir(env = process.env) {
	return path.join(resolveStateDir(env), "voice-calls");
}
/** Read the configured voice-call store path from either package id. */
function getVoiceCallConfigStore(config) {
	for (const pluginId of ["voice-call", "@openclaw/voice-call"]) {
		const store = resolvePluginConfigObject(config, pluginId)?.store;
		if (typeof store === "string" && store.trim()) return store.trim();
	}
	return "";
}
/** Resolve the voice-call store path used by legacy and plugin-state call records. */
function resolveVoiceCallStorePath(params) {
	const configuredStore = getVoiceCallConfigStore(params.config);
	if (configuredStore) return resolveUserPath(configuredStore, () => params.env.HOME?.trim() || os.homedir());
	return resolveDefaultVoiceCallStoreDir(params.env);
}
export { resolveVoiceCallStorePath as n, resolveUserPath as r, resolveDefaultVoiceCallStoreDir as t };
