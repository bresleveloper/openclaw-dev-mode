import { a as resolveOpenAIProjectedToolsStrictToolFlag, i as normalizeStrictOpenAIJsonSchema, n as isStrictOpenAIJsonSchemaCompatible, o as findOpenAIStrictSchemaViolations, r as normalizeOpenAIStrictToolParameters, s as normalizeOpenAIStrictCompatSchema, t as findOpenAIStrictToolProjectionDiagnostics } from "../openai-tool-schema-ynZBgqW-.mjs";
import { TSchema } from "typebox";
//#region packages/ai/src/providers/agent-tools-parameter-schema.d.ts
/**
 * Narrow structural view of the host's model compat config. packages/ai must stay
 * config-agnostic, so only tool-schema-relevant fields are modeled here; the host's
 * ModelCompatConfig remains structurally assignable.
 */
export type ToolSchemaModelCompat = {
  toolSchemaProfile?: string;
  unsupportedToolSchemaKeywords?: string[];
  omitEmptyArrayItems?: boolean;
};
/** Extracts the compat record whether callers pass a model (`{ compat }`) or the compat itself. */
export declare function extractToolSchemaModelCompat(modelOrCompat: {
  compat?: unknown;
} | ToolSchemaModelCompat | undefined): ToolSchemaModelCompat | undefined;
/** JSON Schema keywords this model/provider rejects in tool schemas. */
export declare function resolveUnsupportedToolSchemaKeywords(modelOrCompat: {
  compat?: unknown;
} | ToolSchemaModelCompat | undefined): ReadonlySet<string>;
/** Whether empty `items: {}` on array schemas must be omitted for this model/provider. */
export declare function shouldOmitEmptyArrayItems(modelOrCompat: {
  compat?: unknown;
} | ToolSchemaModelCompat | undefined): boolean;
export type ToolParameterSchemaOptions = {
  modelProvider?: string;
  modelId?: string;
  modelCompat?: ToolSchemaModelCompat;
};
/** Return a provider-compatible JSON schema for a model-facing tool. */
export declare function normalizeToolParameterSchema(schema: unknown, options?: ToolParameterSchemaOptions): TSchema;
//#endregion
//#region packages/ai/src/providers/clean-for-gemini.d.ts
export declare const GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS: Set<string>;
export declare function cleanSchemaForGemini(schema: unknown): TSchema;
//#endregion
//#region packages/ai/src/providers/clean-for-llamacpp-gbnf.d.ts
/** llama.cpp rejects grammar repetitions whose expanded rule count reaches 2000. */
export declare const LLAMACPP_GBNF_MAX_REPETITION_THRESHOLD = 2000;
/** Removes JSON Schema constraints that llama.cpp cannot compile into GBNF. */
export declare function cleanSchemaForLlamacppGbnf(schema: unknown): unknown;
/** Reports schema paths that llama.cpp cannot compile into GBNF. */
export declare function findLlamacppGbnfSchemaViolations(schema: unknown, path: string): string[];
//#endregion
//#region packages/ai/src/providers/schema-keyword-strip.d.ts
/** Remove schema keywords unsupported by a target provider/tool surface. */
export declare function stripUnsupportedSchemaKeywords(schema: unknown, unsupportedKeywords: ReadonlySet<string>): unknown;
//#endregion
//#region packages/ai/src/providers/tool-schema-json-projection.d.ts
/** JSON-safe schema value used when projecting runtime tool parameters. */
type RuntimeToolInputSchemaJson = null | boolean | number | string | RuntimeToolInputSchemaJson[] | {
  [key: string]: RuntimeToolInputSchemaJson;
};
/** Projected runtime tool schema plus validation violations. */
type RuntimeToolInputSchemaProjection = {
  readonly schema: RuntimeToolInputSchemaJson;
  readonly violations: readonly string[];
};
/** Projects one runtime tool input schema to JSON and reports runtime incompatibilities. */
export declare function projectRuntimeToolInputSchema(schema: unknown, path?: string): RuntimeToolInputSchemaProjection;
//#endregion
export { type RuntimeToolInputSchemaJson, type RuntimeToolInputSchemaProjection, findOpenAIStrictSchemaViolations, findOpenAIStrictToolProjectionDiagnostics, isStrictOpenAIJsonSchemaCompatible, normalizeOpenAIStrictCompatSchema, normalizeOpenAIStrictToolParameters, normalizeStrictOpenAIJsonSchema, resolveOpenAIProjectedToolsStrictToolFlag };