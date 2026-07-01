export declare function loadBundledPluginPublicArtifactModuleSync<T extends object>(params: {
    dirName: string;
    artifactBasename: string;
}): T;
/** Loads the first resolvable bundled public artifact from an ordered candidate list. */
export declare function loadBundledPluginPublicArtifactModuleFromCandidatesSync<T extends object>(params: {
    dirName: string;
    artifactCandidates: readonly string[];
}): T | null;
export declare function resolveBundledPluginPublicArtifactPath(params: {
    dirName: string;
    artifactBasename: string;
}): string | null;
export declare function resetBundledPluginPublicArtifactLoaderForTest(): void;
