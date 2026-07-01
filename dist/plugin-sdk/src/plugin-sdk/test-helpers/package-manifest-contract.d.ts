type PackageManifestContractParams = {
    pluginId: string;
    pluginLocalRuntimeDeps?: string[];
    minHostVersionBaseline?: string;
};
/** Installs manifest contract tests for one bundled plugin package. */
export declare function describePackageManifestContract(params: PackageManifestContractParams): void;
export {};
