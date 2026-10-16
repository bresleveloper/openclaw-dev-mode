import { n as redactConfigSnapshot } from "./redact-snapshot-Ds6C-7Ba.mjs";
import { a as getRuntimeConfigAppliedHash, d as hashRuntimeConfigValue } from "./runtime-snapshot-DYptB0Cf.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-D4MkflNJ.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
//#region src/gateway/config-get-response.ts
let configGetResponseCache;
function createConfigGetResponse(snapshot, uiHints, revisionProjector) {
	const redacted = redactConfigSnapshot(snapshot, uiHints);
	const appliedConfigHash = getRuntimeConfigAppliedHash();
	return {
		...redacted,
		hash: redacted.hash ? revisionProjector.projectRawHash(redacted.hash) : redacted.hash,
		configRevisionHash: snapshot.valid ? revisionProjector.projectResolvedHash(hashRuntimeConfigValue(snapshot.sourceConfig)) : null,
		appliedConfigHash: appliedConfigHash ? revisionProjector.projectResolvedHash(appliedConfigHash) : null
	};
}
/** Reads and projects config.get once per watcher-owned runtime and plugin-schema revision. */
async function readConfigGetResponse(params) {
	const readResponse = async () => createConfigGetResponse(await readConfigFileSnapshot(), params.loadUiHints(), params.revisionProjector);
	const getHotReloadStatus = params.getHotReloadStatus;
	if (!getHotReloadStatus || getHotReloadStatus() !== "active") return readResponse();
	const appliedConfigHash = getRuntimeConfigAppliedHash();
	const pluginRegistryVersion = getActivePluginRegistryVersion();
	if (configGetResponseCache?.getHotReloadStatus === getHotReloadStatus && configGetResponseCache.revisionProjector === params.revisionProjector && configGetResponseCache.appliedConfigHash === appliedConfigHash && configGetResponseCache.pluginRegistryVersion === pluginRegistryVersion) return await configGetResponseCache.promise;
	const promise = readResponse();
	configGetResponseCache = {
		getHotReloadStatus,
		revisionProjector: params.revisionProjector,
		appliedConfigHash,
		pluginRegistryVersion,
		promise
	};
	try {
		return await promise;
	} catch (error) {
		if (configGetResponseCache?.promise === promise) configGetResponseCache = void 0;
		throw error;
	}
}
/** Invalidates cached config.get work when the watcher observes or accepts a candidate. */
function invalidateConfigGetResponseCache() {
	configGetResponseCache = void 0;
}
//#endregion
export { readConfigGetResponse as n, invalidateConfigGetResponseCache as t };
