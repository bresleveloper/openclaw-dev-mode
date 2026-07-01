export declare const RETAINED_MANAGED_NPM_INSTALL_MARKER = ".openclaw-retained-npm-install.json";
export declare function resolveRetainedManagedNpmInstallPackageInfo(packageDir: string): {
    packageName: string;
    projectRoot: string;
    markerPath: string;
} | null;
export declare function resolveRetainedManagedNpmInstallMarkerPath(packageDir: string): string;
export declare function hasRetainedManagedNpmInstallMarker(packageDir: string): boolean;
export declare function clearRetainedManagedNpmInstallMarker(packageDir: string): Promise<boolean>;
export declare function markRetainedManagedNpmInstall(params: {
    packageDir: string;
    pluginId: string;
    retainedAt?: string;
    reason: string;
}): Promise<boolean>;
export declare function cleanupRetainedManagedNpmInstallGenerations(params?: {
    activeInstallPaths?: Iterable<string>;
    env?: NodeJS.ProcessEnv;
    npmDir?: string;
    onError?: (error: unknown, projectRoot: string) => void;
}): Promise<number>;
