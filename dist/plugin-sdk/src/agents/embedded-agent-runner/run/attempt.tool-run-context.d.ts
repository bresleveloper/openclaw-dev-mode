/**
 * Builds tool run context passed to embedded-agent tool handlers.
 */
import { type DiagnosticTraceContext } from "../../../infra/diagnostic-trace-context.js";
import type { EmbeddedRunTrigger } from "./params.js";
/**
 * Builds the stable tool-run context forwarded into an embedded-attempt execution.
 */
export declare function buildEmbeddedAttemptToolRunContext(params: {
    trigger?: EmbeddedRunTrigger;
    jobId?: string;
    memoryFlushWritePath?: string;
    toolsAllow?: string[];
    trace?: DiagnosticTraceContext;
}): {
    trigger?: EmbeddedRunTrigger;
    jobId?: string;
    memoryFlushWritePath?: string;
    runtimeToolAllowlist?: string[];
    trace?: DiagnosticTraceContext;
};
