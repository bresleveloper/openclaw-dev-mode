interface BackupRotationFs {
    unlink: (path: string) => Promise<void>;
    rename: (from: string, to: string) => Promise<void>;
    chmod?: (path: string, mode: number) => Promise<void>;
    readdir?: (path: string) => Promise<string[]>;
}
interface BackupMaintenanceFs extends BackupRotationFs {
    copyFile: (from: string, to: string) => Promise<void>;
}
/**
 * Advances the config `.bak` ring before a new primary backup is copied in.
 *
 * Missing slots are ignored so interrupted writes or first-run configs do not
 * block the next config write.
 */
export declare function rotateConfigBackups(configPath: string, ioFs: BackupRotationFs): Promise<void>;
/**
 * Sets owner-only permissions on every backup slot when chmod exists.
 *
 * Backups are copied on mixed filesystems, so copy mode preservation is not a
 * portable security guarantee.
 */
export declare function hardenBackupPermissions(configPath: string, ioFs: BackupRotationFs): Promise<void>;
/** Prunes stale `.bak.*` files that are outside the managed numbered ring. */
export declare function cleanOrphanBackups(configPath: string, ioFs: BackupRotationFs): Promise<void>;
interface PreUpdateSnapshotFs {
    writeFile: (path: string, content: string, options: {
        encoding: "utf-8";
        mode: number;
        flag: "w";
    }) => Promise<void>;
    readFile: (path: string, encoding: "utf-8") => Promise<string>;
    existsSync: (path: string) => boolean;
}
/**
 * Captures the first on-disk config state for an update attempt.
 *
 * The snapshot is outside the rotating `.bak` ring so repeated writes during
 * one process keep an operator-visible rollback point for the original file.
 */
export declare function createPreUpdateConfigSnapshot(params: {
    configPath: string;
    fs: PreUpdateSnapshotFs;
}): Promise<void>;
/** Runs rotation, primary copy, permission hardening, then orphan pruning. */
export declare function maintainConfigBackups(configPath: string, ioFs: BackupMaintenanceFs): Promise<void>;
export {};
