import type { ToolAvailabilityContext, ToolAvailabilityDiagnostic, ToolDescriptor } from "./types.js";
/** Evaluate one descriptor against runtime context and return hidden-tool diagnostics. */
export declare function evaluateToolAvailability(params: {
    descriptor: ToolDescriptor;
    context?: ToolAvailabilityContext;
}): readonly ToolAvailabilityDiagnostic[];
