import { t as loadBundledPluginPublicArtifactModuleFromCandidatesSync } from "./public-surface-loader-CNXp9Fm5.mjs";
//#region src/plugins/public-artifact-factories.ts
/** Factory order is observable when plugins initialize and when their entries are consumed. */
function collectPublicArtifactFactories(params) {
	const artifacts = [];
	for (const [name, exported] of Object.entries(params.mod).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (typeof exported !== "function" || exported.length !== 0 || !name.startsWith("create") || !name.endsWith(params.suffix)) continue;
		let candidate;
		try {
			candidate = exported();
		} catch (error) {
			if (!params.onFactoryError) throw error;
			params.onFactoryError(error);
			continue;
		}
		if (params.isArtifact(candidate)) artifacts.push(candidate);
	}
	return artifacts;
}
/** Loads a typed artifact surface without activating the plugin's runtime entry. */
function loadBundledPublicArtifactEntries(params) {
	const mod = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		dirName: params.dirName,
		artifactCandidates: params.artifactCandidates,
		env: params.env,
		owner: params.owner
	});
	if (!mod) return null;
	const errors = [];
	const artifacts = collectPublicArtifactFactories({
		mod,
		suffix: params.suffix,
		isArtifact: params.isArtifact,
		onFactoryError: params.partialFailureLabel ? (error) => errors.push(error) : void 0
	});
	if (artifacts.length === 0) {
		if (errors.length > 0) throw new Error(`Unable to initialize ${params.partialFailureLabel} for plugin ${params.pluginId}`, { cause: errors.length === 1 ? errors[0] : new AggregateError(errors) });
		return null;
	}
	return artifacts.map((artifact) => Object.assign({}, artifact, { pluginId: params.pluginId }));
}
//#endregion
export { loadBundledPublicArtifactEntries as t };
