/** Return expected integrity only for concrete semver package specs. */
export declare function expectedIntegrityForUpdate(spec: string | undefined, integrity: string | undefined): string | undefined;
/** Read the installed package version from a package root. */
export declare function readInstalledPackageVersion(dir: string): Promise<string | undefined>;
/** Read string-valued peer dependencies from an installed package. */
export declare function readInstalledPackagePeerDependencies(dir: string): Record<string, string>;
/** Return true when an installed package needs an openclaw peer link repair. */
export declare function installedPackageNeedsOpenClawPeerLinkRepair(dir: string): boolean;
