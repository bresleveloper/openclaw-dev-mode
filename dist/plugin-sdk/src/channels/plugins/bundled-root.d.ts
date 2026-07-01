export type BundledChannelRootScope = {
    packageRoot: string;
    cacheKey: string;
    pluginsDir?: string;
};
/**
 * Resolves the package/cache scope used for bundled channel plugin metadata.
 */
export declare function resolveBundledChannelRootScope(env?: NodeJS.ProcessEnv): BundledChannelRootScope;
