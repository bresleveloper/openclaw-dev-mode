/** Import legacy per-job JSONL run logs into SQLite and archive migrated files. */
export declare function migrateLegacyCronRunLogsToSqlite(storePath: string): Promise<{
    importedFiles: number;
}>;
/** Return true when legacy cron JSONL run log files exist next to a store path. */
export declare function legacyCronRunLogFilesExist(storePath: string): Promise<boolean>;
