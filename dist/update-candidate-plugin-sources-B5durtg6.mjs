import { l as normalizePluginsConfig, u as resolveEffectiveEnableState } from "./config-state-BEAL5gWH.mjs";
import { r as loadPluginManifest } from "./manifest-DHkEL08H.mjs";
import { t as resolvePluginDoctorContractArtifact } from "./doctor-contract-artifact-6DlZADc0.mjs";
//#region src/infra/update-candidate-plugin-sources.ts
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
export { resolveUpdateCandidatePluginSourceEntries as t };
