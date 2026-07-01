/** SQLite main database plus every journal-mode sidecar that can contain database pages. */
export declare const SQLITE_DATABASE_FILE_SUFFIXES: readonly ["", "-wal", "-shm", "-journal"];
/** Resolves the main database and all possible journal-mode sidecar paths. */
export declare function resolveSqliteDatabaseFilePaths(pathname: string): string[];
