/** Dependency name-to-version map from a plugin package manifest. */
export type PluginDependencySpecMap = Record<string, string>;
/** Installation status for one plugin dependency. */
export type PluginDependencyEntry = {
    name: string;
    spec: string;
    installed: boolean;
    optional: boolean;
    resolvedPath?: string;
};
/** Aggregate installation status for required and optional plugin dependencies. */
export type PluginDependencyStatus = {
    hasDependencies: boolean;
    installed: boolean;
    requiredInstalled: boolean;
    optionalInstalled: boolean;
    missing: string[];
    missingOptional: string[];
    dependencies: PluginDependencyEntry[];
    optionalDependencies: PluginDependencyEntry[];
};
/** Normalizes raw package dependency maps into sorted plugin dependency specs. */
export declare function normalizePluginDependencySpecs(params: {
    dependencies?: unknown;
    optionalDependencies?: unknown;
}): {
    dependencies: PluginDependencySpecMap;
    optionalDependencies: PluginDependencySpecMap;
};
/** Builds dependency installation status for a plugin package root. */
export declare function buildPluginDependencyStatus(params: {
    rootDir?: string;
    dependencies?: PluginDependencySpecMap;
    optionalDependencies?: PluginDependencySpecMap;
}): PluginDependencyStatus;
