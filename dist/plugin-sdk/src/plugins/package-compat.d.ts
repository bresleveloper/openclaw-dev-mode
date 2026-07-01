/** Result of reading package.json openclaw.compat.pluginApi metadata. */
export type PackagePluginApiRangeResult = {
    ok: true;
    range?: string;
} | {
    ok: false;
    error: string;
};
/** Resolves the plugin API compatibility range declared by package metadata. */
export declare function resolvePackagePluginApiRange(packageMetadata: unknown): PackagePluginApiRangeResult;
