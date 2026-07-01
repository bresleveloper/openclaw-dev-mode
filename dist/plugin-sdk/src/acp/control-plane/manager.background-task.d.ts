/** Mirrors child ACP turns into detached-task status for requester-facing progress. */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { DeliveryContext } from "../../utils/delivery-context.js";
import { AcpRuntimeError } from "../runtime/errors.js";
import type { AcpSessionManagerDeps } from "./manager.types.js";
/** Context needed to mirror a child ACP turn into the requester task registry. */
type BackgroundTaskContext = {
    requesterSessionKey: string;
    requesterOrigin?: DeliveryContext;
    childSessionKey: string;
    runId: string;
    label?: string;
    task: string;
};
/** Appends bounded progress text while preserving a single-line task summary. */
export declare function appendBackgroundTaskProgressSummary(current: string, chunk: string): string;
/** Maps ACP runtime failures to detached-task terminal states. */
export declare function resolveBackgroundTaskFailureStatus(error: AcpRuntimeError): "failed" | "timed_out";
/** Infers blocked terminal outcomes from final progress text when the child turn reports one. */
export declare function resolveBackgroundTaskTerminalResult(progressSummary: string): {
    terminalOutcome?: "blocked";
    terminalSummary?: string;
};
/** Resolves the requester task context for a spawned child ACP session. */
export declare function resolveBackgroundTaskContext(params: {
    deps: AcpSessionManagerDeps;
    cfg: OpenClawConfig;
    sessionKey: string;
    requestId: string;
    text: string;
}): BackgroundTaskContext | null;
export declare function createBackgroundTaskRecord(context: BackgroundTaskContext, startedAt: number): void;
export declare function markBackgroundTaskRunning(runId: string, params: {
    sessionKey?: string;
    lastEventAt?: number;
    progressSummary?: string | null;
}): void;
export declare function markBackgroundTaskTerminal(runId: string, params: {
    sessionKey?: string;
    status: "succeeded" | "failed" | "timed_out";
    endedAt: number;
    lastEventAt?: number;
    error?: string;
    progressSummary?: string | null;
    terminalSummary?: string | null;
    terminalOutcome?: "succeeded" | "blocked" | null;
}): void;
export {};
