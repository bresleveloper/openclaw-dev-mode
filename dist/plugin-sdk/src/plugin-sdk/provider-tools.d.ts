import { cleanSchemaForGemini, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS } from "../agents/schema/clean-for-gemini.js";
import { stripUnsupportedSchemaKeywords } from "../shared/schema-keyword-strip.js";
import type { AnyAgentTool, ProviderNormalizeToolSchemasContext, ProviderToolSchemaDiagnostic } from "./plugin-entry.js";
export { cleanSchemaForGemini, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS, stripUnsupportedSchemaKeywords };
/**
 * Finds unsupported JSON-schema keywords and reports their nested schema paths.
 */
export declare function findUnsupportedSchemaKeywords(
/** JSON schema node to inspect recursively. */
schema: unknown, 
/** Dot/bracket path prefix used in returned diagnostics. */
path: string, 
/** Schema keywords unsupported by the target provider family. */
unsupportedKeywords: ReadonlySet<string>): string[];
/**
 * Rewrites tool schemas into Gemini-compatible JSON schema before provider dispatch.
 */
export declare function normalizeGeminiToolSchemas(
/** Provider tool-schema normalization context containing the active tool list. */
ctx: ProviderNormalizeToolSchemasContext): AnyAgentTool[];
/**
 * Reports Gemini-incompatible schema keywords without mutating tool definitions.
 */
export declare function inspectGeminiToolSchemas(
/** Provider tool-schema inspection context containing the active tool list. */
ctx: ProviderNormalizeToolSchemasContext): ProviderToolSchemaDiagnostic[];
/**
 * Rewrites OpenAI-native tool schemas to satisfy strict object-schema requirements.
 */
export declare function normalizeOpenAIToolSchemas(
/** Provider tool-schema normalization context used to detect native OpenAI strict routes. */
ctx: ProviderNormalizeToolSchemasContext): AnyAgentTool[];
/**
 * Finds schema paths that violate OpenAI strict tool-schema requirements.
 */
export declare function findOpenAIStrictSchemaViolations(
/** JSON schema node to inspect recursively. */
schema: unknown, 
/** Dot/bracket path prefix used in returned diagnostics. */
path: string, 
/** Strictness controls for the current schema position. */
options?: {
    requireObjectRoot?: boolean;
}): string[];
/**
 * Reports OpenAI strict-schema diagnostics for transports that enforce them before dispatch.
 */
export declare function inspectOpenAIToolSchemas(
/** Provider tool-schema inspection context used to detect native OpenAI strict routes. */
ctx: ProviderNormalizeToolSchemasContext): ProviderToolSchemaDiagnostic[];
/**
 * DeepSeek rejects union keywords in tool schemas.
 */
export declare const DEEPSEEK_UNSUPPORTED_SCHEMA_KEYWORDS: Set<string>;
/**
 * Rewrites DeepSeek-incompatible union schemas into the closest accepted shape.
 */
export declare function normalizeDeepSeekToolSchemas(
/** Provider tool-schema normalization context containing the active tool list. */
ctx: ProviderNormalizeToolSchemasContext): AnyAgentTool[];
/**
 * Reports DeepSeek-incompatible union schema paths without mutating tool definitions.
 */
export declare function inspectDeepSeekToolSchemas(
/** Provider tool-schema inspection context containing the active tool list. */
ctx: ProviderNormalizeToolSchemasContext): ProviderToolSchemaDiagnostic[];
/**
 * Supported provider tool-schema compatibility families.
 */
export type ProviderToolCompatFamily = "deepseek" | "gemini" | "openai";
/**
 * Returns the normalizer and inspector pair for a provider tool-schema compatibility family.
 */
export declare function buildProviderToolCompatFamilyHooks(
/** Provider tool-schema compatibility family to route to normalizer/inspector hooks. */
family: ProviderToolCompatFamily): {
    /** Mutating-compatible hook that returns tool definitions accepted by the provider family. */
    normalizeToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => AnyAgentTool[];
    /** Non-mutating hook that reports provider-family schema incompatibilities. */
    inspectToolSchemas: (ctx: ProviderNormalizeToolSchemasContext) => ProviderToolSchemaDiagnostic[];
};
