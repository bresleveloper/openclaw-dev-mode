//#region src/shared/regexp.d.ts
/** Escape text so it can be embedded literally inside a RegExp pattern. */
declare function escapeRegExp(value: string): string;
//#endregion
//#region src/utils.d.ts
/** Creates a directory tree if it does not already exist. */
declare function ensureDir(dir: string): Promise<void>;
/** Clamps a number to an inclusive min/max range. */
declare function clampNumber(value: number, min: number, max: number): number;
/** Floors a number before clamping it to an inclusive min/max range. */
declare function clampInt(value: number, min: number, max: number): number;
/** Alias for clampNumber (shorter, more common name) */
declare const clamp: typeof clampNumber;
/**
 * Safely parse JSON, returning null on error instead of throwing.
 */
declare function safeParseJson<T>(raw: string): T | null;
/**
 * Type guard for Record<string, unknown> (less strict than isPlainObject).
 * Accepts any non-null object that isn't an array.
 */
declare function isRecord(value: unknown): value is Record<string, unknown>;
/** Normalizes phone-like input into the loose E.164 shape used by channel helpers. */
declare function normalizeE164(number: string): string;
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
declare function sleep(ms: number): Promise<unknown>;
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
declare function sliceUtf16Safe(input: string, start: number, end?: number): string;
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
declare function truncateUtf16Safe(input: string, maxLen: number): string;
/** Resolves `~` and OpenClaw home-relative paths with injectable env/home sources. */
declare function resolveUserPath(input: string, env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the OpenClaw config directory from state/config env overrides or home. */
declare function resolveConfigDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
/** Resolves the effective OpenClaw home directory, if one can be determined. */
declare function resolveHomeDir(): string | undefined;
/** Replaces the leading home directory in a path with `~` or `$OPENCLAW_HOME`. */
declare function shortenHomePath(input: string): string;
/** Replaces all effective-home occurrences inside a diagnostic string. */
declare function shortenHomeInString(input: string): string;
/** Shortens a path for display without changing non-home paths. */
declare function displayPath(input: string): string;
/** Shortens home paths embedded in arbitrary display text. */
declare function displayString(input: string): string;
declare let CONFIG_DIR: string;
/**
 * Check if a file or directory exists at the given path.
 */
declare function pathExists(targetPath: string): Promise<boolean>;
//#endregion
export { sleep as _, displayPath as a, escapeRegExp as b, isRecord as c, resolveConfigDir as d, resolveHomeDir as f, shortenHomePath as g, shortenHomeInString as h, clampNumber as i, normalizeE164 as l, safeParseJson as m, clamp as n, displayString as o, resolveUserPath as p, clampInt as r, ensureDir as s, CONFIG_DIR as t, pathExists as u, sliceUtf16Safe as v, truncateUtf16Safe as y };