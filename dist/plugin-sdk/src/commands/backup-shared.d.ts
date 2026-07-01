export type BackupAssetKind = "state" | "config" | "credentials" | "workspace";
export type BackupSkipReason = "covered" | "missing";
export type BackupAsset = {
    kind: BackupAssetKind;
    sourcePath: string;
    displayPath: string;
    archivePath: string;
};
export type SkippedBackupAsset = {
    kind: BackupAssetKind;
    sourcePath: string;
    displayPath: string;
    reason: BackupSkipReason;
    coveredBy?: string;
};
export type BackupPlan = {
    stateDir: string;
    configPath: string;
    oauthDir: string;
    workspaceDirs: string[];
    included: BackupAsset[];
    skipped: SkippedBackupAsset[];
};
/** Format a filesystem-safe local timestamp with explicit UTC offset for backup names. */
export declare function formatBackupArchiveTimestamp(nowMs?: number, offsetMinutes?: number): string;
/** Build the root directory name stored inside a backup tarball. */
export declare function buildBackupArchiveRoot(nowMs?: number): string;
/** Build the default `.tar.gz` filename for a backup archive. */
export declare function buildBackupArchiveBasename(nowMs?: number): string;
/** Encode an absolute or relative source path into a traversal-safe archive payload path. */
export declare function encodeAbsolutePathForBackupArchive(sourcePath: string): string;
/** Build the archive-relative payload path for one source path. */
export declare function buildBackupArchivePath(archiveRoot: string, sourcePath: string): string;
/** Resolve a backup plan from explicit paths, deduplicating assets already covered by parents. */
export declare function resolveBackupPlanFromPaths(params: {
    stateDir: string;
    configPath: string;
    oauthDir: string;
    workspaceDirs?: string[];
    includeWorkspace?: boolean;
    onlyConfig?: boolean;
    configInsideState?: boolean;
    oauthInsideState?: boolean;
    nowMs?: number;
}): Promise<BackupPlan>;
/** Resolve the backup plan from the current OpenClaw state/config/workspace paths on disk. */
export declare function resolveBackupPlanFromDisk(params?: {
    includeWorkspace?: boolean;
    onlyConfig?: boolean;
    nowMs?: number;
}): Promise<BackupPlan>;
