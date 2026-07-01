/** Parses file sizes, capping huge integer strings at the largest safe JS integer. */
export declare function parseSandboxStatSize(value: string | undefined): number;
/** Parses stat mtimes from epoch seconds or date strings into millisecond timestamps. */
export declare function parseSandboxStatMtimeMs(value: string | undefined): number;
