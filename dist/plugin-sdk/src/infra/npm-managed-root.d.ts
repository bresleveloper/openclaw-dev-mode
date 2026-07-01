import { runCommandWithTimeout } from "../process/exec.js";
import type { NpmSpecResolution } from "./install-source-utils.js";
import type { ParsedRegistryNpmSpec } from "./npm-registry-spec.js";
/** Snapshot of root dependencies that were inserted only for peer satisfaction. */
export type ManagedNpmRootPeerDependencySnapshot = {
    dependencies: Record<string, string>;
    managedPeerDependencies: string[];
};
/** Installed dependency metadata read from a managed root lockfile. */
export type ManagedNpmRootInstalledDependency = {
    version?: string;
    integrity?: string;
    resolved?: string;
};
type ManagedNpmRootLogger = {
    warn?: (message: string) => void;
};
type ManagedNpmRootRunCommand = typeof runCommandWithTimeout;
/** Read host OpenClaw pnpm overrides for reuse inside a managed npm root. */
export declare function readOpenClawManagedNpmRootOverrides(params?: {
    argv1?: string;
    cwd?: string;
    moduleUrl?: string;
    packageRoot?: string | null;
}): Promise<Record<string, unknown>>;
/** Resolve the dependency spec to write for a parsed registry package. */
export declare function resolveManagedNpmRootDependencySpec(params: {
    parsedSpec: ParsedRegistryNpmSpec;
    resolution: NpmSpecResolution;
}): string;
/** Insert or update a dependency and managed override metadata in package.json. */
export declare function upsertManagedNpmRootDependency(params: {
    npmRoot: string;
    packageName: string;
    dependencySpec: string;
    managedOverrides?: Record<string, unknown>;
    omitUnsupportedManagedOverrides?: boolean;
}): Promise<void>;
export type MissingRequiredPlatformPackage = {
    name: string;
    packagePath: string;
};
/** Lists explicitly required current-platform packages that npm recorded but did not materialize. */
export declare function listMissingRequiredPlatformPackages(params: {
    npmRoot: string;
    requiredPackageNames: ReadonlySet<string> | readonly string[];
}): Promise<MissingRequiredPlatformPackage[]>;
/** Snapshot managed peer dependencies before a risky install/update operation. */
export declare function readManagedNpmRootPeerDependencySnapshot(params: {
    npmRoot: string;
}): Promise<ManagedNpmRootPeerDependencySnapshot>;
/** Restore a previously captured managed peer dependency snapshot. */
export declare function restoreManagedNpmRootPeerDependencySnapshot(params: {
    npmRoot: string;
    snapshot: ManagedNpmRootPeerDependencySnapshot;
}): Promise<void>;
/** Sync package.json with peer dependency pins resolved from npm's lock plan. */
export declare function syncManagedNpmRootPeerDependencies(params: {
    npmRoot: string;
    managedOverrides?: Record<string, unknown>;
    omitUnsupportedManagedOverrides?: boolean;
    runCommand?: ManagedNpmRootRunCommand;
    timeoutMs?: number;
}): Promise<boolean>;
/** Remove stale managed-root openclaw peer installs while preserving active host links. */
export declare function repairManagedNpmRootOpenClawPeer(params: {
    npmRoot: string;
    packageRoot?: string | null;
    timeoutMs?: number;
    logger?: ManagedNpmRootLogger;
    runCommand?: ManagedNpmRootRunCommand;
}): Promise<boolean>;
/** Read lockfile metadata for an installed dependency in the managed root. */
export declare function readManagedNpmRootInstalledDependency(params: {
    npmRoot: string;
    packageName: string;
}): Promise<ManagedNpmRootInstalledDependency | null>;
/** Remove a dependency from the managed root manifest. */
export declare function removeManagedNpmRootDependency(params: {
    npmRoot: string;
    packageName: string;
}): Promise<void>;
export {};
