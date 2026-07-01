import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ToolLoopDetectionConfig } from "../config/types.tools.js";
import { type DiagnosticTraceContext } from "../infra/diagnostic-trace-context.js";
import { type PluginApprovalResolution, type PluginHookBeforeToolCallResult, type PluginHookToolInputKind, type PluginHookToolKind } from "../plugins/types.js";
import type { SkillSnapshot, SkillTelemetrySource } from "../skills/types.js";
import { isPlainObject } from "../utils.js";
import { buildAdjustedParamsKey } from "./agent-tools.before-tool-call.state.js";
export { consumeAdjustedParamsForToolCall, consumePreExecutionBlockedToolCall, peekAdjustedParamsForToolCall, } from "./agent-tools.before-tool-call.state.js";
import type { SandboxFsBridge } from "./sandbox/fs-bridge.js";
import type { AnyAgentTool } from "./tools/common.js";
export type ToolOutcomeObservation = {
    toolName: string;
    argsHash: string;
    resultHash: string;
    /** Monotonic model-call order within the owning embedded run. */
    toolCallOrdinal?: number;
    terminalPresentation?: string;
    presentationOnly?: boolean;
};
export type ToolOutcomeObserver = (observation: ToolOutcomeObservation) => void;
export type HookContext = {
    agentId?: string;
    config?: OpenClawConfig;
    /** Tool execution cwd for host-derived path facts. */
    cwd?: string;
    /** Host workspace used to resolve relative tool params for diagnostics only. */
    workspaceDir?: string;
    sessionKey?: string;
    /** Ephemeral session UUID — regenerated on /new and /reset. */
    sessionId?: string;
    runId?: string;
    trace?: DiagnosticTraceContext;
    channelId?: string;
    /** Originating channel for approval delivery routing; mirrors exec approval turn-source fields. */
    turnSourceChannel?: string;
    turnSourceTo?: string;
    turnSourceAccountId?: string;
    turnSourceThreadId?: string | number;
    loopDetection?: ToolLoopDetectionConfig;
    onToolOutcome?: ToolOutcomeObserver;
    allocateToolOutcomeOrdinal?: (toolCallId?: string) => number;
    skillsSnapshot?: SkillSnapshot;
    skillCommand?: {
        commandName: string;
        skillName: string;
        skillSource?: SkillTelemetrySource;
        toolName?: string;
    };
    sandbox?: {
        root: string;
        bridge: SandboxFsBridge;
    };
};
type HookBlockedKind = "veto" | "failure";
type HookBlockedReason = "plugin-before-tool-call" | "plugin-approval" | "tool-loop";
type HookOutcome = {
    blocked: true;
    kind?: HookBlockedKind;
    deniedReason?: HookBlockedReason;
    reason: string;
    params?: unknown;
} | {
    blocked: false;
    params: unknown;
    approvalResolution?: PluginApprovalResolution;
    deferredApproval?: DeferredPluginToolApproval;
};
type PluginApprovalRequest = NonNullable<PluginHookBeforeToolCallResult["requireApproval"]>;
export type DeferredPluginToolApproval = {
    approval: PluginApprovalRequest;
    toolName: string;
    toolCallId?: string;
    ctx?: HookContext;
    baseParams: unknown;
    overrideParams?: unknown;
};
export type BeforeToolCallPolicyDiagnosticState = {
    hasBeforeToolCallHook: boolean;
    trustedToolPolicies: Array<{
        id: string;
        pluginId: string;
        pluginName?: string;
    }>;
};
/** Return whether before_tool_call hooks or trusted policies are active. */
export declare function getBeforeToolCallPolicyDiagnosticState(): BeforeToolCallPolicyDiagnosticState;
/** Return true when any before_tool_call policy could affect tool execution. */
export declare function hasBeforeToolCallPolicy(): boolean;
export declare function resolveToolTerminalPresentation(params: {
    tool: AnyAgentTool;
    toolParams: unknown;
    result: Awaited<ReturnType<AnyAgentTool["execute"]>>;
}): string | undefined;
/** Finalizes a trusted terminal summary after harness result middleware. */
export declare function finalizeToolTerminalPresentation(params: {
    toolCallId: string;
    runId?: string;
    result: Awaited<ReturnType<AnyAgentTool["execute"]>>;
    isError: boolean;
    observer?: ToolOutcomeObserver;
    toolName?: string;
    toolCallOrdinal?: number;
}): void;
/**
 * Error used when before_tool_call intentionally vetoes a tool call.
 */
export declare class BeforeToolCallBlockedError extends Error {
    readonly reason: string;
    constructor(reason: string);
}
/** Remember hook-adjusted params for later adapter-side execution. */
export declare function recordAdjustedParamsForToolCall(toolCallId: string | undefined, params: unknown, runId?: string): void;
/** Record that one concrete core-owned tool call may use structured replay classification. */
export declare function recordStructuredReplayTrustForToolCall(toolCallId: string | undefined, tool: AnyAgentTool, runId?: string): void;
/**
 * Returns true when an error represents an intentional before_tool_call veto.
 */
export declare function isBeforeToolCallBlockedError(err: unknown): err is BeforeToolCallBlockedError;
declare function mergeParamsWithApprovalOverrides(originalParams: unknown, approvalParams?: unknown): unknown;
/** Resolve a deferred plugin approval request at the later execution boundary. */
export declare function requestDeferredPluginToolApproval(params: {
    deferredApproval: DeferredPluginToolApproval;
    signal?: AbortSignal;
}): Promise<HookOutcome>;
/** Notify plugin approval callbacks that a deferred approval was cancelled. */
export declare function cancelDeferredPluginToolApproval(deferredApproval: DeferredPluginToolApproval): void;
/** Build the standard terminal result for vetoed tool calls. */
export declare function buildBlockedToolResult(params: {
    reason: string;
    deniedReason?: HookBlockedReason;
    toolCallId?: string;
    runId?: string;
}): {
    content: {
        type: "text";
        text: string;
    }[];
    details: {
        status: string;
        deniedReason: HookBlockedReason;
        reason: string;
    };
};
/** Run the full before_tool_call policy chain for a pending tool call. */
export declare function runBeforeToolCallHook(args: {
    toolName: string;
    params: unknown;
    toolKind?: PluginHookToolKind;
    toolInputKind?: PluginHookToolInputKind;
    toolCallId?: string;
    ctx?: HookContext;
    signal?: AbortSignal;
    approvalMode?: "request" | "report" | "defer";
}): Promise<HookOutcome>;
/** Wrap a tool execute function with before_tool_call hooks and diagnostics. */
export declare function wrapToolWithBeforeToolCallHook(tool: AnyAgentTool, ctx?: HookContext, options?: {
    approvalMode?: "request" | "report";
    emitDiagnostics?: boolean;
}): AnyAgentTool;
/** Return true when a tool already carries the before_tool_call wrapper marker. */
export declare function isToolWrappedWithBeforeToolCallHook(tool: AnyAgentTool): boolean;
/** Toggle diagnostic event emission on an existing before_tool_call wrapper. */
export declare function setBeforeToolCallDiagnosticsEnabled(tool: AnyAgentTool, enabled: boolean): void;
/** Rebuild a before_tool_call wrapper while preserving the original source tool. */
export declare function rewrapToolWithBeforeToolCallHook(tool: AnyAgentTool, ctx?: HookContext, options?: {
    approvalMode?: "request" | "report";
    emitDiagnostics?: boolean;
}): AnyAgentTool;
/** Copy before_tool_call marker metadata when another wrapper replaces a tool. */
export declare function copyBeforeToolCallHookMarker(source: AnyAgentTool, target: AnyAgentTool): void;
/** Test-only access to before_tool_call internals. */
export declare const testing: {
    BEFORE_TOOL_CALL_DIAGNOSTIC_OPTIONS: symbol;
    BEFORE_TOOL_CALL_HOOK_CONTEXT: symbol;
    BEFORE_TOOL_CALL_SOURCE_TOOL: symbol;
    BEFORE_TOOL_CALL_WRAPPED: symbol;
    buildAdjustedParamsKey: typeof buildAdjustedParamsKey;
    adjustedParamsByToolCallId: Map<string, unknown>;
    preExecutionBlockedToolCallIds: Set<string>;
    structuredReplaySafeToolCallIds: Set<string>;
    runBeforeToolCallHook: typeof runBeforeToolCallHook;
    mergeParamsWithApprovalOverrides: typeof mergeParamsWithApprovalOverrides;
    isPlainObject: typeof isPlainObject;
};
export { testing as __testing };
