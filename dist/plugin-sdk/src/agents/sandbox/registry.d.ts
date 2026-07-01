export type SandboxRegistryEntry = {
    containerName: string;
    backendId?: string;
    runtimeLabel?: string;
    sessionKey: string;
    createdAtMs: number;
    lastUsedAtMs: number;
    image: string;
    configLabelKind?: string;
    configHash?: string;
};
type SandboxRegistry = {
    entries: SandboxRegistryEntry[];
};
export type SandboxBrowserRegistryEntry = {
    containerName: string;
    sessionKey: string;
    createdAtMs: number;
    lastUsedAtMs: number;
    image: string;
    configHash?: string;
    cdpPort: number;
    noVncPort?: number;
};
type SandboxBrowserRegistry = {
    entries: SandboxBrowserRegistryEntry[];
};
type LegacyRegistryKind = "containers" | "browsers";
type LegacyRegistryTarget = {
    kind: LegacyRegistryKind;
    registryPath: string;
    shardedDir: string;
};
export type LegacySandboxRegistryInspection = LegacyRegistryTarget & {
    exists: boolean;
    valid: boolean;
    entries: number;
    source: "monolithic" | "sharded";
};
export type LegacySandboxRegistryMigrationResult = LegacyRegistryTarget & {
    status: "missing" | "migrated" | "removed-empty" | "quarantined-invalid";
    entries: number;
    source?: "monolithic" | "sharded";
    quarantinePath?: string;
};
/** Reads all registered sandbox runtime containers from SQLite. */
export declare function readRegistry(): Promise<SandboxRegistry>;
/** Inspects old registry files without mutating them. */
export declare function inspectLegacySandboxRegistryFiles(): Promise<LegacySandboxRegistryInspection[]>;
/** Migrates old registry files into SQLite when present. */
export declare function migrateLegacySandboxRegistryFiles(): Promise<LegacySandboxRegistryMigrationResult[]>;
/** Reads one registered sandbox runtime container by container name. */
export declare function readRegistryEntry(containerName: string): Promise<SandboxRegistryEntry | null>;
/** Creates or updates one sandbox runtime registry entry, preserving immutable creation fields. */
export declare function updateRegistry(entry: SandboxRegistryEntry): Promise<void>;
/** Removes one sandbox runtime registry entry by container name. */
export declare function removeRegistryEntry(containerName: string): Promise<void>;
/** Reads all registered browser sandbox containers from SQLite. */
export declare function readBrowserRegistry(): Promise<SandboxBrowserRegistry>;
/** Creates or updates one browser sandbox registry entry, preserving immutable creation fields. */
export declare function updateBrowserRegistry(entry: SandboxBrowserRegistryEntry): Promise<void>;
/** Removes one browser sandbox registry entry by container name. */
export declare function removeBrowserRegistryEntry(containerName: string): Promise<void>;
export {};
