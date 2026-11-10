import { r as loadPluginManifest } from "./manifest-gUPkNRN0.mjs";
import { f as resolveEffectiveEnableState, u as normalizePluginsConfig } from "./config-state-DkDfCu7E.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-CkzDe3D_.mjs";
import { t as UPDATE_RUN_TEXT_LIMIT } from "./update-run-limits-Dcay4rgn.mjs";
import { n as inspectPluginSourceDependencies } from "./plugin-generation-source-inspection-DSqnvFk6.mjs";
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
		const addEntry = (entryFile, rootDir = candidate.rootDir) => {
			entries.set(entryFile, {
				pluginId,
				rootDir,
				entryFile
			});
		};
		if (enabled) addEntry(candidate.source);
		if (candidate.setupSource && (enabled || packageManifest?.setupFeatures?.configPromotion)) addEntry(candidate.setupSource);
		if (!manifest.ok || manifest.manifest.doctorContract && !Object.values(manifest.manifest.doctorContract).some(Boolean)) continue;
		const doctor = resolvePluginDoctorContractArtifact({
			rootDir: candidate.rootDir,
			origin: candidate.origin,
			packageManifest
		});
		if (doctor) addEntry(doctor.modulePath, doctor.boundaryRoot);
	}
	return [...entries.values()];
}
//#endregion
export { resolveUpdateCandidatePluginSourceEntries as n, inspectUpdateCandidatePluginSource as t };
