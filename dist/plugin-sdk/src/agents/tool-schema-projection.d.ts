/**
 * Projects agent tool schemas into JSON-safe runtime shapes and diagnostics.
 * Provider/runtime dispatch uses this module to drop incompatible tools before
 * sending schemas to model APIs.
 */
import type { AnyAgentTool } from "./tools/common.js";
export { projectRuntimeToolInputSchema } from "./tool-schema-json-projection.js";
export type { RuntimeToolInputSchemaJson, RuntimeToolInputSchemaProjection, } from "./tool-schema-json-projection.js";
/** Diagnostic for one incompatible runtime tool schema. */
export type RuntimeToolSchemaDiagnostic = {
    readonly toolName: string;
    readonly toolIndex: number;
    readonly violations: readonly string[];
};
/** Runtime tool list split into compatible tools and schema diagnostics. */
type RuntimeToolSchemaInspection<TTool extends Pick<AnyAgentTool, "name" | "parameters">> = {
    readonly tools: readonly TTool[];
    readonly diagnostics: readonly RuntimeToolSchemaDiagnostic[];
};
/** Inspects runtime tool schemas and returns diagnostics without filtering tools. */
export declare function inspectRuntimeToolInputSchemas(tools: readonly Pick<AnyAgentTool, "name" | "parameters">[]): RuntimeToolSchemaDiagnostic[];
/** Filters tools to those with schemas accepted by the runtime as-is. */
export declare function filterRuntimeCompatibleTools<TTool extends Pick<AnyAgentTool, "name" | "parameters">>(tools: readonly TTool[]): RuntimeToolSchemaInspection<TTool>;
/** Filters tools to those that providers can normalize before dispatch. */
export declare function filterProviderNormalizableTools<TTool extends Pick<AnyAgentTool, "name" | "parameters">>(tools: readonly TTool[]): RuntimeToolSchemaInspection<TTool>;
