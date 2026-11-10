import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CPodxfi3.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { a as pluginCacheRealpathSync } from "./plugin-cache-files-VxWaav6j.mjs";
import { m as resolvePluginRuntimeExecutionArtifact, p as resolvePluginRuntimeArtifactSelection } from "./bundled-dir-LfC_CFuw.mjs";
import { n as getPluginInstance } from "./plugin-instance-scope-BoTOTPL4.mjs";
import path from "node:path";
//#region src/plugins/plugin-runtime-artifact-binding.ts
const RUNTIME_ARTIFACT_SELECTION = Symbol.for("openclaw.pluginRuntimeArtifactSelection");
function isCanonicalDistribution(record, params) {
	if (record.origin !== "bundled" || params.sourcePreferred || params.packageManifest?.build?.bundledDist === false || !params.rootDir || !params.source) return false;
	const resolvedPackageRoot = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	const packageRoot = resolvedPackageRoot && pluginCacheRealpathSync(resolvedPackageRoot, true);
	const expectedCompiledRoot = packageRoot && path.join(packageRoot, "dist", "extensions");
	const compiledRoot = expectedCompiledRoot && pluginCacheRealpathSync(expectedCompiledRoot, true);
	if (!compiledRoot || compiledRoot !== expectedCompiledRoot) return false;
	const original = resolvePluginRuntimeExecutionArtifact({
		rootDir: params.rootDir,
		source: params.source
	});
	const originalRoot = pluginCacheRealpathSync(original.rootDir, true);
	const selectedRoot = pluginCacheRealpathSync(params.runtimeEntry.rootDir, true);
	const originalSource = pluginCacheRealpathSync(original.source, true);
	const selectedSource = pluginCacheRealpathSync(params.runtimeEntry.source, true);
	return Boolean(originalRoot && selectedRoot && originalSource && selectedSource && path.dirname(originalRoot) === compiledRoot && originalRoot === selectedRoot && originalSource === selectedSource && isPathInside(selectedRoot, selectedSource));
}
/** Preserve selection inputs on the loaded owner, outside status/protocol serialization. */
function bindPluginRuntimeArtifactSelection(record, params) {
	const selection = {
		sourcePreferred: params.sourcePreferred === true,
		sourceExternal: params.packageManifest?.build?.bundledDist === false,
		runtimeEntry: params.runtimeEntry,
		setupEntry: params.setupEntry,
		preferBuiltPluginArtifacts: params.preferBuiltPluginArtifacts,
		runtimeRegistrationComplete: false,
		canonicalDistribution: isCanonicalDistribution(record, params)
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
/** Only the loaded runtime owner can authorize the matching UI-origin distribution. */
function hasCanonicalPluginDistribution(record) {
	return hasCompletedPluginRuntimeRegistration(record) && record[RUNTIME_ARTIFACT_SELECTION]?.canonicalDistribution === true;
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
export { hasCompletedPluginRuntimeRegistration as a, hasCanonicalPluginDistribution as i, capturePluginRuntimeRecovery as n, matchesPluginRuntimeArtifactSelection as o, getPluginRuntimeEntrySource as r, bindPluginRuntimeArtifactSelection as t };
