import { m as resolvePluginRuntimeExecutionArtifact, p as resolvePluginRuntimeArtifactSelection } from "./bundled-dir-DkyLPnyV.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-DEzoxqBj.mjs";
//#region src/plugins/plugin-runtime-artifact-binding.ts
const RUNTIME_ARTIFACT_SELECTION = Symbol.for("openclaw.pluginRuntimeArtifactSelection");
/** Preserve selection inputs on the loaded owner, outside status/protocol serialization. */
function bindPluginRuntimeArtifactSelection(record, params) {
	const selection = {
		sourcePreferred: params.sourcePreferred === true,
		sourceExternal: params.packageManifest?.build?.bundledDist === false,
		runtimeEntry: params.runtimeEntry,
		setupEntry: params.setupEntry,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts,
		runtimeRegistrationComplete: false
	};
	Object.defineProperty(record, RUNTIME_ARTIFACT_SELECTION, { value: selection });
	return selection;
}
function hasCompletedPluginRuntimeRegistration(record) {
	return record.status === "loaded" && record[RUNTIME_ARTIFACT_SELECTION]?.runtimeRegistrationComplete === true;
}
function getPluginRuntimeEntrySource(record) {
	return record[RUNTIME_ARTIFACT_SELECTION]?.runtimeEntry.source;
}
/** Acquire recovery custody before shutdown revokes the previous runtime's module loader. */
function capturePluginRuntimeRecovery(record) {
	const instance = getPluginInstance(record);
	const selection = record[RUNTIME_ARTIFACT_SELECTION];
	if (!instance || !selection) return;
	return {
		module: instance.captureModuleLoaderRecovery(),
		runtimeEntry: { ...selection.runtimeEntry },
		...selection.setupEntry ? { setupEntry: { ...selection.setupEntry } } : {}
	};
}
function matchesPluginRuntimeArtifactSelection(record, params, preferBuiltPluginArtifacts) {
	const loaded = record[RUNTIME_ARTIFACT_SELECTION];
	if (loaded?.sourcePreferred === true !== (params.sourcePreferred === true) || loaded?.sourceExternal === true !== (params.packageManifest?.build?.bundledDist === false) || preferBuiltPluginArtifacts !== void 0 && loaded?.preferBuiltPluginArtifacts !== preferBuiltPluginArtifacts) return false;
	if (!loaded) return record.format === "bundle" && record.rootDir === params.rootDir && record.source === params.source;
	const matchesEntry = (entry, source, entryKind) => {
		const selected = resolvePluginRuntimeExecutionArtifact(resolvePluginRuntimeArtifactSelection({
			...params,
			source,
			entryKind,
			origin: record.origin,
			preferBuiltPluginArtifacts: loaded.preferBuiltPluginArtifacts === true
		}));
		return entry.rootDir === selected.rootDir && entry.source === selected.source;
	};
	return matchesEntry(loaded.runtimeEntry, params.source, "runtime") && (!loaded.setupEntry || params.setupSource !== void 0 && matchesEntry(loaded.setupEntry, params.setupSource, "setup"));
}
//#endregion
export { matchesPluginRuntimeArtifactSelection as a, hasCompletedPluginRuntimeRegistration as i, capturePluginRuntimeRecovery as n, getPluginRuntimeEntrySource as r, bindPluginRuntimeArtifactSelection as t };
