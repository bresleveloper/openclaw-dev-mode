declare function collectLegacyPluginDependencyTargets(env?: NodeJS.ProcessEnv, options?: {
    packageRoot?: string | null;
}): Promise<string[]>;
/** Remove legacy plugin dependency state under trusted OpenClaw cleanup roots. */
export declare function cleanupLegacyPluginDependencyState(params: {
    env?: NodeJS.ProcessEnv;
    packageRoot?: string | null;
}): Promise<{
    changes: string[];
    warnings: string[];
}>;
export declare const testing: {
    collectLegacyPluginDependencyTargets: typeof collectLegacyPluginDependencyTargets;
};
export { testing as __testing };
