import { normalizeSqliteNumber } from "../../infra/sqlite-number.js";
/** Parses a JSON object column, returning the fallback for malformed or non-object values. */
export declare function parseJsonObject<T>(raw: string, fallback: T): T;
/** Parses a JSON column without shape validation, returning the fallback only on parse failure. */
export declare function parseJsonValue<T>(raw: string, fallback: T): T;
/** Normalizes SQLite number/bigint columns into JavaScript numbers. */
export { normalizeSqliteNumber as normalizeNumber };
/** Converts optional booleans into nullable SQLite integer flags. */
export declare function booleanToInteger(value: boolean | undefined): number | null;
/** Converts SQLite integer flags into booleans while preserving missing columns as undefined. */
export declare function integerToBoolean(value: number | bigint | null): boolean | undefined;
/** Serializes optional structured values for JSON columns. */
export declare function serializeJson(value: unknown): string | null;
/** Parses a JSON string-array column and drops non-string entries from legacy data. */
export declare function parseJsonArray(raw: string | null): string[] | undefined;
