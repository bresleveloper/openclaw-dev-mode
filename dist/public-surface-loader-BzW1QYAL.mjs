import { t as shouldRejectHardlinkedPluginFiles } from "./hardlink-policy-C9pW4xqI.mjs";
import { i as resolveRetainedDoctorPath, r as resolvePluginRootPublicSurfacePath } from "./public-surface-runtime-D9ZKYxH2.mjs";
import { a as loadFacadeModuleAtLocationSync, o as resolveBundledPublicSurfaceLocation, t as MissingPublicSurfaceError } from "./facade-loader-B-X-HqBc.mjs";
//#region src/plugins/public-surface-loader.ts
function loadValidatedPublicSurfaceModule(params) {
	return loadFacadeModuleAtLocationSync({
		location: params,
		surfaceLabel: params.surfaceLabel,
		pluginId: params.pluginId,
		boundary: {
			boundaryLabel: "plugin root",
			rejectHardlinks: shouldRejectHardlinkedPluginFiles({
				origin: params.origin,
				rootDir: params.boundaryRoot
			})
		}
	});
}
function loadBundledPluginPublicArtifactModuleSync(params) {
	const loaded = loadBundledPluginPublicArtifactModuleFromCandidatesSync({
		...params,
		artifactCandidates: [params.artifactBasename]
	});
	if (!loaded) throw new MissingPublicSurfaceError(`Unable to resolve bundled plugin public surface ${params.dirName}/${params.artifactBasename}`);
	return loaded;
}
function loadPluginPublicArtifactModuleSync(params) {
	const modulePath = resolvePluginRootPublicSurfacePath(params);
	if (!modulePath) throw new MissingPublicSurfaceError(`Unable to resolve plugin public surface ${params.pluginRoot}/${params.artifactBasename}`);
	return loadValidatedPublicSurfaceModule({
		modulePath,
		boundaryRoot: params.pluginRoot,
		surfaceLabel: `plugin public surface ${params.artifactBasename}`,
		origin: params.origin ?? "global",
		pluginId: params.pluginId
	});
}
/** Loads the first resolvable bundled public artifact from an ordered candidate list. */
function loadBundledPluginPublicArtifactModuleFromCandidatesSync(params) {
	for (const artifactBasename of params.artifactCandidates) {
		let location;
		if (params.retainedAt) {
			const modulePath = resolveRetainedDoctorPath({
				rootDir: params.retainedAt,
				dirName: params.dirName,
				artifactBasename
			});
			location = modulePath ? {
				modulePath,
				boundaryRoot: params.retainedAt,
				origin: "bundled"
			} : null;
		} else if (params.owner) {
			const modulePath = resolvePluginRootPublicSurfacePath({
				pluginRoot: params.owner.rootDir,
				pluginId: params.owner.id,
				entrySource: params.owner.source,
				artifactBasename
			});
			location = modulePath ? {
				modulePath,
				boundaryRoot: params.owner.rootDir,
				pluginId: params.owner.id,
				origin: params.owner.origin
			} : null;
		} else location = resolveBundledPublicSurfaceLocation({
			dirName: params.dirName,
			artifactBasename,
			env: params.env,
			preferSource: false
		});
		if (location) return loadValidatedPublicSurfaceModule({
			...location,
			surfaceLabel: `bundled plugin public surface ${params.dirName}/${artifactBasename}`,
			origin: location.origin ?? "bundled"
		});
	}
	return null;
}
//#endregion
export { loadValidatedPublicSurfaceModule as i, loadBundledPluginPublicArtifactModuleSync as n, loadPluginPublicArtifactModuleSync as r, loadBundledPluginPublicArtifactModuleFromCandidatesSync as t };
