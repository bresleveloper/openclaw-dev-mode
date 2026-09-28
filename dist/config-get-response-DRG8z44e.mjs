import { f as hashRuntimeConfigValue, o as getRuntimeConfigAppliedHash } from "./runtime-snapshot-DbgWcCyV.mjs";
import { n as redactConfigSnapshot } from "./redact-snapshot-uX3ICFnt.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { d as getActivePluginRegistryVersion } from "./runtime-B2zZQffc.mjs";
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
	const getHotReloadStatus = params.getHotReloadStatus;
	if (!getHotReloadStatus || getHotReloadStatus() !== "active") return createConfigGetResponse(await readConfigFileSnapshot(), params.loadUiHints(), params.revisionProjector);
	const appliedConfigHash = getRuntimeConfigAppliedHash();
	const pluginRegistryVersion = getActivePluginRegistryVersion();
	if (configGetResponseCache?.getHotReloadStatus === getHotReloadStatus && configGetResponseCache.revisionProjector === params.revisionProjector && configGetResponseCache.appliedConfigHash === appliedConfigHash && configGetResponseCache.pluginRegistryVersion === pluginRegistryVersion) return await configGetResponseCache.promise;
	const promise = (async () => createConfigGetResponse(await readConfigFileSnapshot(), params.loadUiHints(), params.revisionProjector))();
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
