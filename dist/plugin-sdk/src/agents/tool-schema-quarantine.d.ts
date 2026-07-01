import type { RuntimeToolSchemaDiagnostic } from "./tool-schema-projection.js";
import type { AnyAgentTool } from "./tools/common.js";
/** Emits diagnostics and logs for tools removed from runtime schema projection. */
export declare function logRuntimeToolSchemaQuarantine(params: {
    diagnostics: readonly RuntimeToolSchemaDiagnostic[];
    tools: readonly AnyAgentTool[];
    runId: string;
    sessionKey?: string;
    sessionId?: string;
}): void;
