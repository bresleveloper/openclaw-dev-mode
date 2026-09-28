import { y as uniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-pEXzzTbU.mjs";
import { t as appendUniqueEnvVarCandidates } from "./env-var-candidates-D_PA36up.mjs";
//#region src/secrets/channel-env-vars.ts
/** Discovers plugin-declared environment variable names for channel credential setup. */
/**
* Resolves plugin-declared channel environment variable names keyed by channel id.
* The result is deterministic so env-shell docs and prompt snapshots stay stable.
*/
function resolveChannelEnvVars(params) {
	const snapshot = resolvePluginMetadataSnapshot({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env: params?.env ?? process.env
	});
	const candidates = {};
	for (const plugin of snapshot.plugins) {
		const channelId = plugin.packageChannel?.id?.trim();
		const channelEnv = plugin.packageChannel?.configuredState?.env;
		if (!channelId || !channelEnv) continue;
		appendUniqueEnvVarCandidates(candidates, channelId, [...channelEnv.allOf ?? [], ...channelEnv.anyOf ?? []]);
	}
	return candidates;
}
/**
* Returns the declared env var names for one channel id.
*/
function getChannelEnvVars(channelId, params) {
	const channelEnvVars = resolveChannelEnvVars(params);
	const envVars = Object.hasOwn(channelEnvVars, channelId) ? channelEnvVars[channelId] : void 0;
	return Array.isArray(envVars) ? [...envVars] : [];
}
/**
* Lists every known channel env var name across installed plugin metadata.
*/
function listKnownChannelEnvVarNames(params) {
	return uniqueStrings(Object.values(resolveChannelEnvVars(params)).flat());
}
//#endregion
export { listKnownChannelEnvVarNames as n, getChannelEnvVars as t };
