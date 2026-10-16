import { t as UPDATE_RUN_TEXT_LIMIT } from "./update-run-limits-Dcay4rgn.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { r as loadPluginManifest } from "./manifest-BXjFCp0F.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-xZyiClKv.mjs";
import { n as inspectPluginSourceDependencies } from "./plugin-generation-source-inspection-6bc05bYz.mjs";
//#region src/infra/update-candidate-plugin-sources.ts
/** Optional source inspection must not turn a plugin syntax error into an update refusal. */
function inspectUpdateCandidatePluginSource(entry, warnings, dependencyLookupBoundary) {
	try {
		return inspectPluginSourceDependencies([entry], dependencyLookupBoundary);
	} catch (error) {
		if (!(error instanceof SyntaxError)) throw error;
		if (warnings.length < 32) warnings.push(`Update checks could not inspect plugin ${entry.pluginId} (${entry.entryFile}): ${error.message}. Continuing without dependency inspection for this entry.`.slice(0, UPDATE_RUN_TEXT_LIMIT));
		return;
	}
}
/** Snapshot the executable surfaces their owners can demand during candidate validation. */
function resolveUpdateCandidatePluginSourceEntries(candidates, config) {
	const plugins = normalizePluginsConfig(config.plugins);
	const entries = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		if (candidate.format === "bundle") continue;
		const manifest = loadPluginManifest(candidate.rootDir);
		const pluginId = candidate.effectivePluginId ?? (manifest.ok ? manifest.manifest.id : candidate.idHint);
		const enabled = resolveEffectiveEnableState({
			id: pluginId,
			origin: candidate.origin,
			config: plugins,
			rootConfig: config
		}).enabled;
		const packageManifest = candidate.packageManifest;
		if (enabled) entries.set(candidate.source, {
			pluginId,
			rootDir: candidate.rootDir,
			entryFile: candidate.source
		});
		if (candidate.setupSource && (enabled || packageManifest?.setupFeatures?.configPromotion)) entries.set(candidate.setupSource, {
			pluginId,
			rootDir: candidate.rootDir,
			entryFile: candidate.setupSource
		});
		if (!manifest.ok || manifest.manifest.doctorContract && !Object.values(manifest.manifest.doctorContract).some(Boolean)) continue;
		const doctor = resolvePluginDoctorContractArtifact({
			rootDir: candidate.rootDir,
			origin: candidate.origin,
			packageManifest
		});
		if (doctor) entries.set(doctor.modulePath, {
			pluginId,
			rootDir: doctor.boundaryRoot,
			entryFile: doctor.modulePath
		});
	}
	return [...entries.values()];
}
//#endregion
export { resolveUpdateCandidatePluginSourceEntries as n, inspectUpdateCandidatePluginSource as t };
