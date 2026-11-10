import { m as OpenAIToolProjection } from "../provider-options-DAzsyi49.mjs";
import { a as prepareAnthropicInputSchema } from "../anthropic-tool-projection-C2-d1eZ3.mjs";
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
  toolName?: string;
  modelProvider?: string;
  modelId?: string;
  modelCompat?: ToolSchemaModelCompat;
};
/** Return a provider-compatible JSON schema for a model-facing tool. */
export declare function normalizeToolParameterSchema(schema: unknown, options?: ToolParameterSchemaOptions): TSchema;
//#endregion
//#region packages/ai/src/providers/clean-for-gemini.d.ts
export declare const GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS: Set<string>;
export declare function cleanSchemaForGemini(schema: unknown, toolName?: string): TSchema;
//#endregion
//#region packages/ai/src/providers/clean-for-llamacpp-gbnf.d.ts
/** llama.cpp rejects grammar repetitions whose expanded rule count reaches 2000. */
export declare const LLAMACPP_GBNF_MAX_REPETITION_THRESHOLD = 2000;
/** Removes JSON Schema constraints that llama.cpp cannot compile into GBNF. */
export declare function cleanSchemaForLlamacppGbnf(schema: unknown, toolName?: string): unknown;
/** Reports schema paths that llama.cpp cannot compile into GBNF. */
export declare function findLlamacppGbnfSchemaViolations(schema: unknown, path: string): string[];
//#endregion
//#region packages/ai/src/providers/openai-tool-schema-compat.d.ts
/** Repairs recoverable OpenAI tool-schema shapes before canonical normalization. */
export declare function normalizeOpenAIStrictCompatSchema(schema: unknown): TSchema;
/** Finds schema paths that violate OpenAI strict tool-schema requirements. */
export declare function findOpenAIStrictSchemaViolations(schema: unknown, path: string, options?: {
  requireObjectRoot?: boolean;
}): string[];
//#endregion
//#region packages/ai/src/providers/openai-tool-schema.d.ts
type ToolSchemaCompatInput = {
  unsupportedToolSchemaKeywords?: unknown;
  omitEmptyArrayItems?: unknown;
};
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
//#endregion
//#region packages/ai/src/providers/openai-function-tool.d.ts
type OpenAIFunctionDescriptor = {
  name: string;
  description: string | undefined;
  parameters: Record<string, unknown>;
  strict?: boolean;
};
type PreparedOpenAIFunctionTool = {
  responses: OpenAIFunctionDescriptor & {
    type: "function";
  };
  completions: {
    type: "function";
    function: OpenAIFunctionDescriptor;
  };
};
/** Reuse wire descriptors only when their parameter owner published immutable JSON. */
export declare function prepareOpenAIFunctionTool(name: string, description: string | undefined, parameters: Record<string, unknown>, strict: boolean | undefined): PreparedOpenAIFunctionTool;
//#endregion
//#region packages/ai/src/providers/schema-keyword-strip.d.ts
/** Remove schema keywords unsupported by a target provider/tool surface. */
export declare function stripUnsupportedSchemaKeywords(schema: unknown, unsupportedKeywords: ReadonlySet<string>): unknown;
//#endregion
//#region packages/ai/src/providers/tool-schema-depth.d.ts
/** Schema nodes and expanded references share this budget; containers are transparent. */
export declare const MAX_TOOL_SCHEMA_DEPTH = 128;
export type ToolSchemaPosition = {
  kind: "schema" | "map" | "array" | "dependencies";
  depth: number;
};
/** Classify children after toJSON when serializing, or directly when normalizing. */
export declare function toolSchemaChildPosition(position: ToolSchemaPosition | undefined, parent: object, key: string, child: unknown): ToolSchemaPosition | undefined;
export declare function wasToolSchemaTruncated(schema: unknown): boolean;
/** Preserve reduced-validation provenance across schema copies without repeating diagnostics. */
export declare function inheritToolSchemaTruncation<T>(source: unknown, result: T, truncated?: boolean): T;
export declare function reportToolSchemaTruncation(schema: unknown, toolName?: string): void;
/** Bound schema structure without changing literal data or caching mutable provider inputs. */
export declare function truncateToolSchemaDepth(schema: unknown, toolName?: string): unknown;
//#endregion
//#region packages/ai/src/providers/schema-walk.d.ts
export declare const SCHEMA_MAP_KEYS: Set<string>;
export declare const SCHEMA_NESTED_KEYS: Set<string>;
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
type PublishedRuntimeToolInputSchema = {
  readonly projection: RuntimeToolInputSchemaProjection;
  readonly json: string;
  readonly fingerprint: string;
};
export declare function getPublishedRuntimeToolInputSchema(schema: unknown): PublishedRuntimeToolInputSchema | undefined;
/** Only an owner's detached JSON publication can bypass later schema traversals. */
export declare function publishRuntimeToolInputSchema(schema: unknown, path?: string, toolName?: string): RuntimeToolInputSchemaProjection;
/** Projects one runtime tool input schema to JSON and reports runtime incompatibilities. */
export declare function projectRuntimeToolInputSchema(schema: unknown, path?: string, toolName?: string): RuntimeToolInputSchemaProjection;
//#endregion
export { type RuntimeToolInputSchemaJson, type RuntimeToolInputSchemaProjection, prepareAnthropicInputSchema };