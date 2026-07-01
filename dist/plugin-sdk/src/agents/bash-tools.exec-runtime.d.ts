import { type EventSessionRoutingPolicy } from "../infra/event-session-routing.js";
import { type ExecHost, type ExecApprovalDecision, type ExecTarget } from "../infra/exec-approvals.js";
import type { ProcessSession } from "./bash-process-registry.js";
import type { ExecToolDetails } from "./bash-tools.exec-types.js";
import type { BashSandboxConfig } from "./bash-tools.shared.js";
import type { AgentToolResult } from "./runtime/index.js";
export { applyPathPrepend, findPathKey, normalizePathPrepend } from "../infra/path-prepend.js";
export { normalizeExecAsk, normalizeExecHost, normalizeExecSecurity, normalizeExecTarget, } from "../infra/exec-approvals.js";
import type { RunExit } from "../process/supervisor/types.js";
import { type DeliveryContext } from "../utils/delivery-context.shared.js";
export { execSchema } from "./bash-tools.schemas.js";
/**
 * Detect cursor key mode from PTY output chunk.
 * Uses lastIndexOf to find the *last* toggle in the chunk.
 * Returns "application" if smkx is the last toggle, "normal" if rmkx is last,
 * or null if no toggle is found.
 */
export declare function detectCursorKeyMode(raw: string): "application" | "normal" | null;
/** Default retained aggregate output cap for exec sessions. */
export declare const DEFAULT_MAX_OUTPUT: number;
/** Default pending output cap for poll/update buffers. */
export declare const DEFAULT_PENDING_MAX_OUTPUT: number;
/** Fallback PATH used when the process environment has no PATH. */
export declare const DEFAULT_PATH: string;
/** Tail length used in background completion notifications. */
export declare const DEFAULT_NOTIFY_TAIL_CHARS = 400;
/** Default time an approval can remain pending. */
export declare const DEFAULT_APPROVAL_TIMEOUT_MS = 1800000;
/** Gateway request timeout for approval registration/wait calls. */
export declare const DEFAULT_APPROVAL_REQUEST_TIMEOUT_MS: number;
/** Failure categories used to explain exec process exits. */
export type ExecProcessFailureKind = "shell-command-not-found" | "shell-not-executable" | "overall-timeout" | "no-output-timeout" | "signal" | "aborted" | "runtime-error";
type ExecExitFailureKind = Exclude<ExecProcessFailureKind, "runtime-error">;
/** Normalized result of a spawned exec process. */
export type ExecProcessOutcome = {
    status: "completed";
    exitCode: number;
    exitSignal: NodeJS.Signals | number | null;
    durationMs: number;
    aggregated: string;
    timedOut: false;
} | {
    status: "failed";
    exitCode: number | null;
    exitSignal: NodeJS.Signals | number | null;
    durationMs: number;
    aggregated: string;
    timedOut: boolean;
    failureKind: ExecProcessFailureKind;
    reason: string;
};
/** Live handle returned after an exec process has started. */
export type ExecProcessHandle = {
    session: ProcessSession;
    startedAt: number;
    pid?: number;
    promise: Promise<ExecProcessOutcome>;
    kill: () => void;
    /** Immediately suppress all future `onUpdate` calls for this handle. */
    disableUpdates: () => void;
};
/** Renders a host label for user-facing exec policy messages. */
export declare function renderExecHostLabel(host: ExecHost): "gateway" | "node" | "sandbox";
/** Renders an exec target label, preserving `auto`. */
export declare function renderExecTargetLabel(target: ExecTarget): "auto" | "gateway" | "node" | "sandbox";
/** Returns true when a per-call target override is allowed by configured policy. */
export declare function isRequestedExecTargetAllowed(params: {
    configuredTarget: ExecTarget;
    requestedTarget: ExecTarget;
    sandboxAvailable?: boolean;
}): boolean;
/** Resolves configured/requested/elevated exec target into an effective host. */
export declare function resolveExecTarget(params: {
    configuredTarget?: ExecTarget;
    requestedTarget?: ExecTarget | null;
    elevatedRequested: boolean;
    sandboxAvailable: boolean;
}): {
    configuredTarget: ExecTarget;
    requestedTarget: ExecTarget | null;
    selectedTarget: ExecTarget;
    effectiveHost: ExecHost;
};
/** Normalizes notification snippets to a compact single-line form. */
export declare function normalizeNotifyOutput(value: string): string;
/** Merges shell-discovered PATH entries into an exec environment. */
export declare function applyShellPath(env: Record<string, string>, shellPath?: string | null): void;
/** Creates the short approval id shown in `/approve` prompts. */
export declare function createApprovalSlug(id: string): string;
/** Builds the user-facing approval-pending message for foreground exec. */
export declare function buildApprovalPendingMessage(params: {
    warningText?: string;
    approvalSlug: string;
    approvalId: string;
    allowedDecisions?: readonly ExecApprovalDecision[];
    command: string;
    cwd: string | undefined;
    host: "gateway" | "node";
    nodeId?: string;
}): string;
/** Normalizes the delay before showing a running approval notice. */
export declare function resolveApprovalRunningNoticeMs(value?: number): number;
export { renderExecUpdateText } from "./bash-tools.exec-output.js";
/** Formats a user-facing reason for a failed exec process exit. */
export declare function formatExecFailureReason(params: {
    failureKind: ExecExitFailureKind;
    exitSignal: NodeJS.Signals | number | null;
    timeoutSec: number | null | undefined;
}): string;
/** Converts a supervisor exit record into a normalized exec process outcome. */
export declare function buildExecExitOutcome(params: {
    exit: RunExit;
    aggregated: string;
    durationMs: number;
    timeoutSec: number | null | undefined;
}): ExecProcessOutcome;
/** Converts spawn/runtime errors into a normalized failed exec outcome. */
export declare function buildExecRuntimeErrorOutcome(params: {
    error: unknown;
    aggregated: string;
    durationMs: number;
}): ExecProcessOutcome;
/** Starts a host or sandbox exec process and registers it for polling/backgrounding. */
export declare function runExecProcess(opts: {
    command: string;
    execCommand?: string;
    workdir: string;
    env: Record<string, string>;
    pathPrepend?: string[];
    sandbox?: BashSandboxConfig;
    containerWorkdir?: string | null;
    usePty: boolean;
    warnings: string[];
    maxOutput: number;
    pendingMaxOutput: number;
    notifyOnExit: boolean;
    notifyOnExitEmptySuccess?: boolean;
    scopeKey?: string;
    sessionKey?: string;
    /** `session.mainKey` from the runtime config; snapshotted onto the
     *  ProcessSession so background-exit notifications can remap cron-run
     *  keys without an ambient config load. Long-running background exits use
     *  this start-time value even if config changes while the process runs. */
    mainKey?: string;
    /** `session.scope` from the runtime config; snapshotted alongside
     *  `mainKey` so the cron-run remap can route global-scope agents to
     *  the "global" queue instead of agent-main. */
    sessionScope?: "per-sender" | "global";
    /** Start-time routing policy for detached exec system events. */
    eventRouting?: EventSessionRoutingPolicy;
    notifyDeliveryContext?: DeliveryContext;
    timeoutSec: number | null;
    onUpdate?: (partialResult: AgentToolResult<ExecToolDetails>) => void;
}): Promise<ExecProcessHandle>;
