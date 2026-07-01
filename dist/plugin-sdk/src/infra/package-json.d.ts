type PackageJson = {
    name?: unknown;
    packageManager?: unknown;
    version?: unknown;
};
/** Reads package.json as a loose object, returning null for missing or invalid manifests. */
export declare function readPackageJson(root: string): Promise<PackageJson | null>;
/** Reads and trims the package version string, returning null for blank or non-string values. */
export declare function readPackageVersion(root: string): Promise<string | null>;
/** Reads and trims the package name string, returning null for blank or non-string values. */
export declare function readPackageName(root: string): Promise<string | null>;
/** Reads and trims the packageManager spec, returning null for blank or non-string values. */
export declare function readPackageManagerSpec(root: string): Promise<string | null>;
export {};
