import { type RuntimeEnv } from "../runtime.js";
type BackupVerifyOptions = {
    archive: string;
    json?: boolean;
};
type BackupVerifyResult = {
    ok: true;
    archivePath: string;
    archiveRoot: string;
    createdAt: string;
    runtimeVersion: string;
    assetCount: number;
    entryCount: number;
};
/** Verify a backup archive without extracting payload files to disk. */
export declare function backupVerifyCommand(runtime: RuntimeEnv, opts: BackupVerifyOptions): Promise<BackupVerifyResult>;
export {};
