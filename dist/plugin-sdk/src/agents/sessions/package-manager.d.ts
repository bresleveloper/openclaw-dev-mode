import type { SettingsManager } from "./settings-manager.js";
export interface PathMetadata {
    source: string;
    scope: SourceScope;
    origin: "package" | "top-level";
    baseDir?: string;
}
export interface ResolvedResource {
    path: string;
    enabled: boolean;
    metadata: PathMetadata;
}
export interface ResolvedPaths {
    extensions: ResolvedResource[];
    skills: ResolvedResource[];
    prompts: ResolvedResource[];
    themes: ResolvedResource[];
}
export type MissingSourceAction = "skip" | "error";
export interface PackageManager {
    resolve(onMissing?: (source: string) => Promise<MissingSourceAction>): Promise<ResolvedPaths>;
    resolveExtensionSources(sources: string[], options?: {
        local?: boolean;
        temporary?: boolean;
    }): Promise<ResolvedPaths>;
}
interface PackageManagerOptions {
    cwd: string;
    agentDir: string;
    settingsManager: SettingsManager;
}
type SourceScope = "user" | "project" | "temporary";
export declare class DefaultPackageManager implements PackageManager {
    private cwd;
    private agentDir;
    private settingsManager;
    constructor(options: PackageManagerOptions);
    resolve(onMissing?: (source: string) => Promise<MissingSourceAction>): Promise<ResolvedPaths>;
    resolveExtensionSources(sources: string[], options?: {
        local?: boolean;
        temporary?: boolean;
    }): Promise<ResolvedPaths>;
    private resolvePackageSources;
    private resolveLocalExtensionSource;
    private parseSource;
    private installedNpmMatchesPinnedVersion;
    private getInstalledNpmVersion;
    /**
     * Get a unique identity for a package, ignoring version/ref.
     * Used to detect when the same package is in both global and project settings.
     * For git packages, uses normalized host/path to ensure SSH and HTTPS URLs
     * for the same repository are treated as identical.
     */
    private getPackageIdentity;
    /**
     * Dedupe packages: if same package identity appears in both global and project,
     * keep only the project one (project wins).
     */
    private dedupePackages;
    private parseNpmSpec;
    private getNpmInstallPath;
    private getGitInstallPath;
    private getTemporaryDir;
    private getBaseDirForScope;
    private resolvePath;
    private resolvePathFromBase;
    private collectPackageResources;
    private collectDefaultResources;
    private applyPackageFilter;
    /**
     * Collect all files from a package for a resource type, applying manifest patterns.
     * Returns { allFiles, enabledByManifest } where enabledByManifest is the set of files
     * that pass the manifest's own patterns.
     */
    private collectManifestFiles;
    private collectConventionResourceFiles;
    private readResourceManifest;
    private addManifestEntries;
    private collectFilesFromManifestEntries;
    private filterManifestResourcePaths;
    private resolveLocalEntries;
    private addAutoDiscoveredResources;
    private collectFilesFromPaths;
    private getTargetMap;
    private addResource;
    private createAccumulator;
    private toResolvedPaths;
}
export {};
