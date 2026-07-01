export { LOCAL_BUILD_METADATA_DIST_PATHS } from "../../scripts/lib/local-build-metadata-paths.mjs";
export declare const PACKAGE_DIST_INVENTORY_RELATIVE_PATH = "dist/postinstall-inventory.json";
/** Detects transient plugin dependency install-stage directories inside packaged extension dist. */
export declare function isLegacyPluginDependencyInstallStagePath(relativePath: string): boolean;
/** Collects package dist files that should be present after install/update publication. */
export declare function collectPackageDistInventory(packageRoot: string): Promise<string[]>;
/** Lists legacy plugin dependency staging directories that must not ship in package dist. */
export declare function collectLegacyPluginDependencyStagingDebrisPaths(packageRoot: string): Promise<string[]>;
/** Fails when transient plugin dependency staging debris remains in package dist. */
export declare function assertNoLegacyPluginDependencyStagingDebris(packageRoot: string): Promise<void>;
/** Writes the current sorted package dist inventory and returns the entries written. */
export declare function writePackageDistInventory(packageRoot: string): Promise<string[]>;
/** Reads an existing package dist inventory, returning null when the inventory is absent. */
export declare function readPackageDistInventoryIfPresent(packageRoot: string): Promise<string[] | null>;
