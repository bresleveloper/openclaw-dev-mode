/** Package names blocked from installed plugin dependency trees. */
export declare const blockedInstallDependencyPackageNames: readonly ["plain-crypto-js"];
/** Finding for blocked dependencies declared in a plugin package manifest. */
export type BlockedManifestDependencyFinding = {
    dependencyName: string;
    declaredAs?: string;
    field: "dependencies" | "name" | "optionalDependencies" | "overrides" | "peerDependencies";
};
/** Finding for a blocked package directory inside an install tree. */
export type BlockedPackageDirectoryFinding = {
    dependencyName: string;
    directoryRelativePath: string;
};
/** Finding for a blocked package file alias inside an install tree. */
export type BlockedPackageFileFinding = {
    dependencyName: string;
    fileRelativePath: string;
};
type PackageDependencyMapFields = Partial<Record<Exclude<BlockedManifestDependencyFinding["field"], "name" | "overrides">, Record<string, string>>>;
type PackageDependencyFields = {
    name?: string;
} & PackageDependencyMapFields;
type PackageOverrideFields = {
    overrides?: unknown;
};
/** Finds blocked dependencies declared by name, alias, or override in a package manifest. */
export declare function findBlockedManifestDependencies(manifest: PackageDependencyFields & PackageOverrideFields): BlockedManifestDependencyFinding[];
/** Finds a blocked package directory beneath a node_modules-relative path. */
export declare function findBlockedNodeModulesDirectory(params: {
    directoryRelativePath: string;
}): BlockedPackageDirectoryFinding | undefined;
/** Finds a blocked package file alias beneath a node_modules-relative path. */
export declare function findBlockedNodeModulesFileAlias(params: {
    fileRelativePath: string;
}): BlockedPackageFileFinding | undefined;
/** Finds a blocked package directory anywhere in a root-relative path. */
export declare function findBlockedPackageDirectoryInPath(params: {
    pathRelativeToRoot: string;
}): BlockedPackageDirectoryFinding | undefined;
/** Finds a blocked package file alias anywhere in a root-relative path. */
export declare function findBlockedPackageFileAliasInPath(params: {
    pathRelativeToRoot: string;
}): BlockedPackageFileFinding | undefined;
export {};
