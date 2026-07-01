import type { TaskTerminalOutcome } from "./task-registry.types.js";
/** Terminal fields required when a mandatory detached task completion is invalid. */
export type RequiredCompletionTerminalResult = {
    terminalOutcome?: Extract<TaskTerminalOutcome, "blocked">;
    terminalSummary?: string;
};
export declare function resolveRequiredCompletionTerminalResult(resultText: string | null | undefined): RequiredCompletionTerminalResult;
export declare function resolveRequiredCompletionDeliveryFailureTerminalResult(reason: string | null | undefined): RequiredCompletionTerminalResult;
