/** Stores the process-current plugin metadata snapshot and compatible config fingerprints. */
export declare function setCurrentPluginMetadataSnapshotState(snapshot: unknown, configFingerprint: string | undefined, compatiblePolicyHashes?: readonly string[], compatibleConfigFingerprints?: readonly string[]): void;
/** Clears the process-current plugin metadata snapshot. */
export declare function clearCurrentPluginMetadataSnapshotState(): void;
/** Returns the process-current plugin metadata snapshot state. */
export declare function getCurrentPluginMetadataSnapshotState(): {
    snapshot: unknown;
    configFingerprint: string | undefined;
    compatiblePolicyHashes: readonly string[] | undefined;
    compatibleConfigFingerprints: readonly string[] | undefined;
};
