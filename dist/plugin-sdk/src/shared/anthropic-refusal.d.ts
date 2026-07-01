import type { AssistantMessageDiagnostic } from "../llm/types.js";
type AnthropicRefusalOutput = {
    stopReason: string;
    errorMessage?: string;
    diagnostics?: AssistantMessageDiagnostic[];
};
export declare function applyAnthropicRefusal(output: AnthropicRefusalOutput, stopDetails: unknown, provider: string): void;
export {};
