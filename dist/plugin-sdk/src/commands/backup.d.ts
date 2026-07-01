import { type BackupCreateOptions, type BackupCreateResult } from "../infra/backup-create.js";
import { type RuntimeEnv } from "../runtime.js";
/** Create a backup archive, optionally verify it, and emit text or JSON output. */
export declare function backupCreateCommand(runtime: RuntimeEnv, opts?: BackupCreateOptions): Promise<BackupCreateResult>;
