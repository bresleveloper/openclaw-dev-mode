export { isRecord } from "../utils.js";
/**
 * Narrows to strings that contain non-whitespace content.
 */
export declare function isNonEmptyString(value: unknown): value is string;
/**
 * Parses a simple .env assignment value, stripping one matching quote pair after trimming.
 */
export declare function parseEnvValue(raw: string): string;
/**
 * Normalizes numeric config to a positive integer, falling back when the input is not finite.
 */
export declare function normalizePositiveInt(value: unknown, fallback: number): number;
/**
 * Normalizes timer values with the shared timeout coercion rules used by secret providers.
 */
export declare function normalizePositiveTimerMs(value: unknown, fallback: number): number;
/**
 * Splits a dotted config path into non-empty trimmed segments.
 */
export declare function parseDotPath(pathname: string): string[];
/**
 * Joins config path segments using the secrets command's dotted path format.
 */
export declare function toDotPath(segments: string[]): string;
/**
 * Ensures the parent directory for a secret-related file exists with private permissions.
 */
export declare function ensureDirForFile(filePath: string): void;
/**
 * Writes a JSON file through the private file store so new files get secret-safe permissions.
 */
export declare function writeJsonFileSecure(pathname: string, value: unknown): void;
/**
 * Reads a text file when present, returning null instead of throwing for missing paths.
 */
export declare function readTextFileIfExists(pathname: string): string | null;
/**
 * Atomically writes secret-adjacent text, using the private store for default 0600 files.
 */
export declare function writeTextFileAtomic(pathname: string, value: string, mode?: number): void;
