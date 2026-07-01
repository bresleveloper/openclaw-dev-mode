/** Resolved facade module path plus the package/plugin root that bounds imports. */
export type FacadeModuleLocationLike = {
    modulePath: string;
    boundaryRoot: string;
};
type FacadeRegistryRecordLike = {
    id: string;
    rootDir: string;
    channels: readonly string[];
};
/** Builds the cache key for one facade lookup under the current bundled-plugin mode. */
export declare function createFacadeResolutionKey(params: {
    dirName: string;
    artifactBasename: string;
    bundledPluginsDir?: string | null;
    env?: NodeJS.ProcessEnv;
}): string;
/** Chooses the boundary root that should constrain a resolved facade module. */
export declare function resolveFacadeBoundaryRoot(params: {
    modulePath: string;
    bundledPluginsDir?: string | null;
    packageRoot: string;
}): string;
/** Resolves a bundled facade from source in dev and built artifacts in dist installs. */
export declare function resolveBundledFacadeModuleLocation(params: {
    currentModulePath: string;
    packageRoot: string;
    dirName: string;
    artifactBasename: string;
    env?: NodeJS.ProcessEnv;
    bundledPluginsDir?: string | null;
}): FacadeModuleLocationLike | null;
/** Resolves a facade path from manifest registry records using id, folder, then channel matches. */
export declare function resolveRegistryPluginModuleLocationFromRecords(params: {
    registry: readonly FacadeRegistryRecordLike[];
    dirName: string;
    artifactBasename: string;
}): FacadeModuleLocationLike | null;
export {};
