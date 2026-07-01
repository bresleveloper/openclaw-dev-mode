import type { OpenAIToolProjection } from "./openai-tool-projection.js";
/**
 * OpenAI strict-tool-schema normalization and diagnostics.
 *
 * Strict schemas need all object properties required and `additionalProperties: false`; model
 * compatibility settings can also remove unsupported schema constructs before strict checks run.
 */
type ToolSchemaCompatInput = {
    unsupportedToolSchemaKeywords?: unknown;
    omitEmptyArrayItems?: unknown;
};
export declare function clearOpenAIToolSchemaCacheForTest(): void;
/** Normalizes a tool parameter schema into the OpenAI strict JSON-schema subset. */
export declare function normalizeStrictOpenAIJsonSchema(schema: unknown, modelCompat?: ToolSchemaCompatInput | null): unknown;
/** Normalizes tool parameters using strict OpenAI rules only when strict mode is active. */
export declare function normalizeOpenAIStrictToolParameters<T>(schema: T, strict: boolean, modelCompat?: ToolSchemaCompatInput | null): T;
/** Returns whether a schema already satisfies OpenAI strict tool-schema constraints. */
export declare function isStrictOpenAIJsonSchemaCompatible(schema: unknown): boolean;
type OpenAIStrictToolSchemaDiagnostic = {
    toolIndex: number;
    toolName?: string;
    violations: string[];
};
/** Returns strict-schema diagnostics for an already materialized OpenAI tool projection. */
export declare function findOpenAIStrictToolProjectionDiagnostics(projection: OpenAIToolProjection): OpenAIStrictToolSchemaDiagnostic[];
/** Resolves strict mode for the projected tools that will be emitted in the request payload. */
export declare function resolveOpenAIProjectedToolsStrictToolFlag(projection: OpenAIToolProjection, strict: boolean | null | undefined): boolean | undefined;
export {};
