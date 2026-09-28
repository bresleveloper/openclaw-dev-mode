import { n as OpenAIToolProjection } from "./openai-tool-projection-793cE3QX.mjs";
import { TSchema } from "typebox";
//#region packages/ai/src/providers/openai-tool-schema-compat.d.ts
/** Repairs recoverable OpenAI tool-schema shapes before canonical normalization. */
declare function normalizeOpenAIStrictCompatSchema(schema: unknown): TSchema;
/** Finds schema paths that violate OpenAI strict tool-schema requirements. */
declare function findOpenAIStrictSchemaViolations(schema: unknown, path: string, options?: {
  requireObjectRoot?: boolean;
}): string[];
//#endregion
//#region packages/ai/src/providers/openai-tool-schema.d.ts
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
/** Normalizes a tool parameter schema into the OpenAI strict JSON-schema subset. */
declare function normalizeStrictOpenAIJsonSchema(schema: unknown, modelCompat?: ToolSchemaCompatInput | null): unknown;
/** Normalizes tool parameters using strict OpenAI rules only when strict mode is active. */
declare function normalizeOpenAIStrictToolParameters<T>(schema: T, strict: boolean, modelCompat?: ToolSchemaCompatInput | null): T;
/** Returns whether a schema already satisfies OpenAI strict tool-schema constraints. */
declare function isStrictOpenAIJsonSchemaCompatible(schema: unknown): boolean;
type OpenAIStrictToolSchemaDiagnostic = {
  toolIndex: number;
  toolName?: string;
  violations: string[];
};
/** Returns strict-schema diagnostics for an already materialized OpenAI tool projection. */
declare function findOpenAIStrictToolProjectionDiagnostics(projection: OpenAIToolProjection): OpenAIStrictToolSchemaDiagnostic[];
/** Resolves strict mode for the projected tools that will be emitted in the request payload. */
declare function resolveOpenAIProjectedToolsStrictToolFlag(projection: OpenAIToolProjection, strict: boolean | null | undefined): boolean | undefined;
//#endregion
export { resolveOpenAIProjectedToolsStrictToolFlag as a, normalizeStrictOpenAIJsonSchema as i, isStrictOpenAIJsonSchemaCompatible as n, findOpenAIStrictSchemaViolations as o, normalizeOpenAIStrictToolParameters as r, normalizeOpenAIStrictCompatSchema as s, findOpenAIStrictToolProjectionDiagnostics as t };