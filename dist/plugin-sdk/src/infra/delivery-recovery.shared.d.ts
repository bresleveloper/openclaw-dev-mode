export declare function computeBackoffMs(retryCount: number): number;
export declare function getErrnoCode(err: unknown): string | null;
export declare function claimRecoveryEntry(entriesInProgress: Set<string>, entryId: string): boolean;
export declare function releaseRecoveryEntry(entriesInProgress: Set<string>, entryId: string): void;
