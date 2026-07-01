import type { ExecApprovalDecision } from "./exec-approvals.js";
/** Button/action metadata shown with a plugin approval request. */
export type PluginApprovalActionView = {
    kind?: "command" | "decision";
    label: string;
    command: string;
    decision?: ExecApprovalDecision;
    style?: "primary" | "secondary" | "success" | "danger";
};
/** Request payload supplied by plugin approval callers. */
export type PluginApprovalRequestPayload = {
    pluginId?: string | null;
    title: string;
    description: string;
    severity?: "info" | "warning" | "critical" | null;
    toolName?: string | null;
    toolCallId?: string | null;
    allowedDecisions?: readonly ExecApprovalDecision[] | null;
    actions?: readonly PluginApprovalActionView[] | null;
    agentId?: string | null;
    sessionKey?: string | null;
    turnSourceChannel?: string | null;
    turnSourceTo?: string | null;
    turnSourceAccountId?: string | null;
    turnSourceThreadId?: string | number | null;
};
/** Timed plugin approval request persisted while awaiting a decision. */
export type PluginApprovalRequest = {
    id: string;
    request: PluginApprovalRequestPayload;
    createdAtMs: number;
    expiresAtMs: number;
};
/** Resolved plugin approval decision plus optional request snapshot. */
export type PluginApprovalResolved = {
    id: string;
    decision: ExecApprovalDecision;
    resolvedBy?: string | null;
    ts: number;
    request?: PluginApprovalRequestPayload;
};
export declare const DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS = 120000;
export declare const MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 600000;
export declare const PLUGIN_APPROVAL_TITLE_MAX_LENGTH = 80;
export declare const PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH = 256;
export declare const DEFAULT_PLUGIN_APPROVAL_DECISIONS: readonly ["allow-once", "allow-always", "deny"];
/** Clamp a plugin approval timeout to the supported runtime bounds. */
export declare function resolvePluginApprovalTimeoutMs(value: unknown): number;
/** Format an approval decision for user-facing messages. */
export declare function approvalDecisionLabel(decision: ExecApprovalDecision): string;
/** Resolve explicit plugin approval decisions or fall back to defaults. */
export declare function resolvePluginApprovalRequestAllowedDecisions(params?: {
    allowedDecisions?: readonly ExecApprovalDecision[] | readonly string[] | null;
}): readonly ExecApprovalDecision[];
/** Build the pending plugin approval message. */
export declare function buildPluginApprovalRequestMessage(request: PluginApprovalRequest, nowMsValue: number): string;
/** Build the plugin approval resolution message. */
export declare function buildPluginApprovalResolvedMessage(resolved: PluginApprovalResolved): string;
/** Build the plugin approval expiration message. */
export declare function buildPluginApprovalExpiredMessage(request: PluginApprovalRequest): string;
