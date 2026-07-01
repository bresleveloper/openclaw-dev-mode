import { normalizeOptionalString } from "../../packages/normalization-core/src/string-coerce.js";
export { normalizeOptionalString as trimBundledPluginString };
/** Normalizes string-list manifest fields found while scanning bundled plugin files. */
export declare function normalizeBundledPluginStringList(value: unknown): string[];
/** Converts a source entry path to its built JavaScript artifact path. */
export declare function rewriteBundledPluginEntryToBuiltPath(entry: string | undefined): string | undefined;
/** Derives a stable id hint for bundled plugins with one or more extension entrypoints. */
export declare function deriveBundledPluginIdHint(params: {
    entryPath: string;
    manifestId: string;
    packageName?: string;
    hasMultipleExtensions: boolean;
}): string;
/** Lists top-level public surface artifacts that should be copied with bundled plugin runtime. */
export declare function collectBundledPluginPublicSurfaceArtifacts(params: {
    pluginDir: string;
    sourceEntry: string;
    setupEntry?: string;
}): readonly string[] | undefined;
/** Filters public artifacts down to runtime sidecars needed by bundled plugin execution. */
export declare function collectBundledPluginRuntimeSidecarArtifacts(publicSurfaceArtifacts: readonly string[] | undefined): readonly string[] | undefined;
/** Chooses the source or built extension directory appropriate for the current package layout. */
export declare function resolveBundledPluginScanDir(params: {
    packageRoot: string;
    runningFromBuiltArtifact: boolean;
}): string | undefined;
