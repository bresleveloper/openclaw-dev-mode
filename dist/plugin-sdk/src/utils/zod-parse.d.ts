import type { ZodType } from "zod";
/**
 * Null-returning Zod parse helpers for plugin and runtime boundaries.
 *
 * Callers use these where invalid external payloads should be ignored or
 * recovered from without constructing and catching validation errors.
 */
/** Safely validates an unknown value with a Zod schema, returning null on validation failure. */
export declare function safeParseWithSchema<T>(schema: ZodType<T>, value: unknown): T | null;
/** Parses JSON, then safely validates it with a Zod schema, returning null for parse or schema failures. */
export declare function safeParseJsonWithSchema<T>(schema: ZodType<T>, raw: string): T | null;
