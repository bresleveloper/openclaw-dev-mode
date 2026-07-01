import { isPlainObject } from "./infra/plain-object.js";
export { escapeRegExp } from "./shared/regexp.js";
/** Creates a directory tree if it does not already exist. */
export declare function ensureDir(dir: string): Promise<void>;
/** Clamps a number to an inclusive min/max range. */
export declare function clampNumber(value: number, min: number, max: number): number;
/** Floors a number before clamping it to an inclusive min/max range. */
export declare function clampInt(value: number, min: number, max: number): number;
/** Alias for clampNumber (shorter, more common name) */
export declare const clamp: typeof clampNumber;
/**
 * Safely parse JSON, returning null on error instead of throwing.
 */
export declare function safeParseJson<T>(raw: string): T | null;
export { isPlainObject };
/**
 * Type guard for Record<string, unknown> (less strict than isPlainObject).
 * Accepts any non-null object that isn't an array.
 */
export declare function isRecord(value: unknown): value is Record<string, unknown>;
/** Normalizes phone-like input into the loose E.164 shape used by channel helpers. */
export declare function normalizeE164(number: string): string;
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
export declare function sleep(ms: number): Promise<unknown>;
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
export declare function sliceUtf16Safe(input: string, start: number, end?: number): string;
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
export declare function truncateUtf16Safe(input: string, maxLen: number): string;
/** Resolves `~` and OpenClaw home-relative paths with injectable env/home sources. */
export declare function resolveUserPath(input: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the OpenClaw config directory from state/config env overrides or home. */
export declare function resolveConfigDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the effective OpenClaw home directory, if one can be determined. */
export declare function resolveHomeDir(): string | undefined;
/** Replaces the leading home directory in a path with `~` or `$OPENCLAW_HOME`. */
export declare function shortenHomePath(input: string): string;
/** Replaces all effective-home occurrences inside a diagnostic string. */
export declare function shortenHomeInString(input: string): string;
/** Shortens a path for display without changing non-home paths. */
export declare function displayPath(input: string): string;
/** Shortens home paths embedded in arbitrary display text. */
export declare function displayString(input: string): string;
export declare let CONFIG_DIR: string;
export declare function pinConfigDir(env?: NodeJS.ProcessEnv): string;
/**
 * Check if a file or directory exists at the given path.
 */
export declare function pathExists(targetPath: string): Promise<boolean>;
