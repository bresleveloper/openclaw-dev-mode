import { a as ApprovalScope$1, o as ApprovalScopeSchema } from "./approvals-B-zk4kd_.js";
import { Static } from "typebox";
//#region src/infra/command-analysis/explain.d.ts
/** Compact command explanation summary shown in approval UI. */
type CommandExplanationSummary = {
  commandCount: number;
  nestedCommandCount: number;
  riskKinds: string[];
  warningLines: string[];
};
//#endregion
//#region src/infra/exec-approval-policy-snapshot.d.ts
type ExecApprovalPolicyRule = {
  pattern: string;
  argPattern?: string;
  source?: "allow-always";
};
type ExecApprovalPolicySnapshot = {
  security: "deny" | "allowlist" | "full";
  ask: "off" | "on-miss" | "always";
  askFallback: "deny" | "allowlist" | "full";
  autoAllowSkills: boolean;
  allowlistRules: readonly ExecApprovalPolicyRule[];
};
//#endregion
//#region src/infra/exec-approvals.types.d.ts
type McpToolGrant = {
  server: string;
  tool: string;
  source: "allow-always";
  addedAt: number;
  lastUsedAt?: number;
};
type ExecAllowlistEntry = {
  id?: string;
  pattern: string;
  source?: "allow-always";
  commandText?: string;
  argPattern?: string;
  lastUsedAt?: number;
  lastUsedCommand?: string;
  lastResolvedPath?: string;
};
//#endregion
//#region src/infra/exec-approvals-core.d.ts
type ExecHost = "sandbox" | "gateway" | "node";
type ExecTarget = "auto" | ExecHost;
type ExecSecurity = "deny" | "allowlist" | "full";
type ExecAsk = "off" | "on-miss" | "always";
type ExecMode = "deny" | "allowlist" | "ask" | "auto" | "full";
type ExecApprovalDecision = "allow-once" | "allow-always" | "deny";
type ExecApprovalUnavailableDecision = "allow-always";
declare const EXEC_TARGET_VALUES: readonly ExecTarget[];
declare function normalizeExecHost(value?: string | null): ExecHost | null;
declare function normalizeExecTarget(value?: string | null): ExecTarget | null;
declare function requireValidExecTarget(value?: unknown): ExecTarget | null;
declare function normalizeExecSecurity(value?: unknown): ExecSecurity | null;
declare function normalizeExecAsk(value?: unknown): ExecAsk | null;
declare function normalizeExecMode(value?: string | null): ExecMode | null;
declare function resolveExecModePolicy(params: {
  mode?: ExecMode | null;
  security: ExecSecurity;
  ask: ExecAsk;
}): {
  mode: ExecMode;
  security: ExecSecurity;
  ask: ExecAsk;
  autoReview: boolean;
};
type SystemRunApprovalBinding = {
  argv: string[];
  cwd: string | null;
  agentId: string | null;
  sessionKey: string | null;
  envHash: string | null;
};
type SystemRunApprovalFileOperand = {
  argvIndex: number;
  path: string;
  sha256: string;
};
type SystemRunApprovalPlan = {
  argv: string[];
  cwd: string | null;
  commandText: string;
  commandPreview?: string | null;
  agentId: string | null;
  sessionKey: string | null;
  policySnapshot?: ExecApprovalPolicySnapshot;
  mutableFileOperand?: SystemRunApprovalFileOperand | null;
};
type ExecApprovalCommandSpan = {
  startIndex: number;
  endIndex: number;
};
/** Cron job identity recorded at approval creation for a cron isolated run. */
type ExecApprovalCronExecutionSource = {
  jobId: string;
  jobConfigRevision: string;
};
type ExecApprovalRequestPayload = {
  command: string;
  commandPreview?: string | null;
  commandArgv?: string[];
  envKeys?: string[];
  systemRunBinding?: SystemRunApprovalBinding | null;
  systemRunPlan?: SystemRunApprovalPlan | null;
  cwd?: string | null;
  nodeId?: string | null;
  host?: string | null;
  security?: string | null;
  ask?: string | null;
  warningText?: string | null;
  /** Owner-declared blast-radius facts; display-only, never authorization. */
  scope?: ApprovalScope$1 | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandSpans?: ExecApprovalCommandSpan[];
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[];
  allowedDecisions?: readonly ExecApprovalDecision[];
  agentId?: string | null;
  resolvedPath?: string | null;
  sessionKey?: string | null;
  sessionId?: string | null;
  runId?: string | null;
  toolCallId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
  /** Gateway-recorded cron source; never taken from client request params. */
  cronExecutionSource?: ExecApprovalCronExecutionSource | null;
  /** Exact operation binding prepared at creation for standing-grant minting. */
  cronOperationBinding?: string | null;
};
type ExecApprovalRequest = {
  /** Descriptive wire metadata; readers derive it from the payload when absent. */
  approvalKind?: "exec";
  id: string;
  request: ExecApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
type ExecApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: ExecApprovalRequest["request"];
};
type ExecApprovalsDefaults = {
  security?: ExecSecurity;
  ask?: ExecAsk;
  askFallback?: ExecSecurity;
  autoAllowSkills?: boolean;
};
type ExecApprovalsAgent = ExecApprovalsDefaults & {
  allowlist?: ExecAllowlistEntry[];
  mcpTools?: McpToolGrant[];
};
type ExecApprovalsFile = {
  version: 1;
  socket?: {
    path?: string;
    token?: string;
  };
  defaults?: ExecApprovalsDefaults;
  agents?: Record<string, ExecApprovalsAgent>;
};
type ExecApprovalsSnapshot = {
  path: string;
  exists: boolean;
  raw: string | null;
  file: ExecApprovalsFile;
  hash: string;
};
type ExecApprovalsResolved = {
  path: string;
  socketPath: string;
  token: string;
  defaults: Required<ExecApprovalsDefaults>;
  agent: Required<ExecApprovalsDefaults>;
  agentSources: {
    security: string | null;
    ask: string | null;
    askFallback: string | null;
  };
  allowlist: ExecAllowlistEntry[];
  file: ExecApprovalsFile;
};
declare const DEFAULT_EXEC_APPROVAL_TIMEOUT_MS = 1800000;
//#endregion
//#region src/infra/approval-scope.d.ts
type ApprovalScope = Static<typeof ApprovalScopeSchema>;
//#endregion
//#region src/infra/plugin-approvals.d.ts
/** Button/action metadata shown with a plugin approval request. */
type PluginApprovalActionView = {
  kind?: "command" | "decision";
  label: string;
  command: string;
  decision?: ExecApprovalDecision;
  style?: "primary" | "secondary" | "success" | "danger";
};
/** Gateway-minted placement identity; plugin and RPC callers never supply this authority. */
type PluginApprovalPlacementGrantBinding = {
  pluginId: string;
  command: string;
  approvalScope: string;
  agentId: string;
  sessionKey: string;
  sessionId: string;
  nodeId: string;
  pairingGeneration: string;
  environmentId: string;
  ownerEpoch: number;
  placementGeneration: number;
  cwd: string;
};
/** Request payload supplied by plugin approval callers. */
type PluginApprovalRequestPayload = {
  pluginId?: string | null;
  title: string;
  description: string;
  detail?: string | null;
  severity?: "info" | "warning" | "critical" | null;
  /** Owner-declared blast-radius facts; display-only, never authorization. */
  scope?: ApprovalScope | null;
  toolName?: string | null;
  toolCallId?: string | null;
  /** Exact MCP persistence intent; the host separately binds live tool-call proof. */
  mcpTool?: {
    server: string;
    tool: string;
  };
  allowedDecisions?: readonly ExecApprovalDecision[] | null;
  /** Trusted in-process metadata; public Gateway callers cannot submit this field. */
  externalResolution?: {
    label: string;
    decisions?: readonly ("allow-once" | "allow-always")[];
  } | null;
  actions?: readonly PluginApprovalActionView[] | null;
  agentId?: string | null;
  sessionKey?: string | null;
  /** Host-derived source run; never accepted from plugin approval RPC params. */
  runId?: string | null;
  /** Host-derived grant binding; never accepted from plugin approval RPC params. */
  placementGrant?: PluginApprovalPlacementGrantBinding | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
/** Timed plugin approval request persisted while awaiting a decision. */
type PluginApprovalRequest = {
  /** Descriptive wire metadata; readers derive it from the payload when absent. */
  approvalKind?: "plugin";
  id: string;
  request: PluginApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
/** Resolved plugin approval decision plus optional request snapshot. */
type PluginApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: PluginApprovalRequestPayload;
};
declare const DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS = 120000;
declare const MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 600000;
declare const PLUGIN_APPROVAL_TITLE_MAX_LENGTH = 80;
declare const PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH = 512;
declare const PLUGIN_APPROVAL_DETAIL_MAX_LENGTH = 16384;
declare const DEFAULT_PLUGIN_APPROVAL_DECISIONS: readonly ["allow-once", "allow-always", "deny"];
/** Caps reviewer-only plugin detail by Unicode code point without splitting surrogate pairs. */
declare function truncatePluginApprovalDetail(value: string): string;
/** Clamp a plugin approval timeout to the supported runtime bounds. */
declare function resolvePluginApprovalTimeoutMs(value: unknown): number;
/** Format an approval decision for user-facing messages. */
declare function approvalDecisionLabel(decision: ExecApprovalDecision): string;
/** Resolve explicit plugin approval decisions or fall back to defaults. */
declare function resolvePluginApprovalRequestAllowedDecisions(params?: {
  allowedDecisions?: readonly ExecApprovalDecision[] | readonly string[] | null;
}): readonly ExecApprovalDecision[];
/** Build the pending plugin approval message. */
declare function buildPluginApprovalRequestMessage(request: PluginApprovalRequest, nowMsValue: number): string;
/** Build the plugin approval resolution message. */
declare function buildPluginApprovalResolvedMessage(resolved: PluginApprovalResolved): string;
/** Build the plugin approval expiration message. */
declare function buildPluginApprovalExpiredMessage(request: PluginApprovalRequest): string;
//#endregion
//#region src/infra/system-agent-approvals.d.ts
type SystemAgentApprovalRequestPayload = {
  title: string;
  description: string;
  command: string;
  proposalHash: string;
  allowedDecisions: readonly ExecApprovalDecision[];
  agentId?: string | null;
  sessionKey?: string | null;
  sessionId: string;
  runId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
type SystemAgentApprovalRequest = {
  approvalKind?: "system-agent";
  id: string;
  request: SystemAgentApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
type SystemAgentApprovalApplicationStatus = "applied" | "not-applied";
type SystemAgentApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: SystemAgentApprovalRequestPayload;
  applicationStatus?: SystemAgentApprovalApplicationStatus;
  terminalStatus?: "expired" | "cancelled";
};
//#endregion
//#region src/infra/approval-types.d.ts
type ChannelApprovalKind = "exec" | "plugin" | "system-agent";
/** Backward-compatible request shape accepted from Gateway events and replay. */
type ApprovalRequestInput = ExecApprovalRequest | PluginApprovalRequest | SystemAgentApprovalRequest;
type NormalizedApprovalRequest<TRequest extends ApprovalRequestInput> = TRequest extends ExecApprovalRequest ? TRequest & {
  approvalKind: "exec";
} : TRequest extends PluginApprovalRequest ? TRequest & {
  approvalKind: "plugin";
} : TRequest extends SystemAgentApprovalRequest ? TRequest & {
  approvalKind: "system-agent";
} : never;
//#endregion
export { resolveExecModePolicy as $, ExecApprovalRequest as A, ExecHost as B, resolvePluginApprovalTimeoutMs as C, EXEC_TARGET_VALUES as D, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS as E, ExecApprovalsDefaults as F, SystemRunApprovalFileOperand as G, ExecSecurity as H, ExecApprovalsFile as I, normalizeExecHost as J, SystemRunApprovalPlan as K, ExecApprovalsResolved as L, ExecApprovalResolved as M, ExecApprovalUnavailableDecision as N, ExecApprovalCommandSpan as O, ExecApprovalsAgent as P, requireValidExecTarget as Q, ExecApprovalsSnapshot as R, resolvePluginApprovalRequestAllowedDecisions as S, ApprovalScope as T, ExecTarget as U, ExecMode as V, SystemRunApprovalBinding as W, normalizeExecSecurity as X, normalizeExecMode as Y, normalizeExecTarget as Z, PluginApprovalResolved as _, SystemAgentApprovalRequest as a, buildPluginApprovalRequestMessage as b, DEFAULT_PLUGIN_APPROVAL_DECISIONS as c, PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH as d, ExecAllowlistEntry as et, PLUGIN_APPROVAL_DETAIL_MAX_LENGTH as f, PluginApprovalRequestPayload as g, PluginApprovalRequest as h, SystemAgentApprovalApplicationStatus as i, ExecApprovalRequestPayload as j, ExecApprovalDecision as k, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS as l, PluginApprovalActionView as m, ChannelApprovalKind as n, CommandExplanationSummary as nt, SystemAgentApprovalRequestPayload as o, PLUGIN_APPROVAL_TITLE_MAX_LENGTH as p, normalizeExecAsk as q, NormalizedApprovalRequest as r, SystemAgentApprovalResolved as s, ApprovalRequestInput as t, ExecApprovalPolicySnapshot as tt, MAX_PLUGIN_APPROVAL_TIMEOUT_MS as u, approvalDecisionLabel as v, truncatePluginApprovalDetail as w, buildPluginApprovalResolvedMessage as x, buildPluginApprovalExpiredMessage as y, ExecAsk as z };