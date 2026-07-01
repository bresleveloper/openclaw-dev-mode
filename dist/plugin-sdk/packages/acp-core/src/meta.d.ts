/** Reads the first present string metadata value from a current-to-legacy key list. */
export declare function readString(meta: Record<string, unknown> | null | undefined, keys: string[]): string | undefined;
/** Reads the first boolean metadata value without dropping false. */
export declare function readBool(meta: Record<string, unknown> | null | undefined, keys: string[]): boolean | undefined;
/** Reads the first finite numeric metadata value from a current-to-legacy key list. */
export declare function readNumber(meta: Record<string, unknown> | null | undefined, keys: string[]): number | undefined;
/** Reads the first safe non-negative integer metadata value, preserving zero. */
export declare function readNonNegativeInteger(meta: Record<string, unknown> | null | undefined, keys: string[]): number | undefined;
