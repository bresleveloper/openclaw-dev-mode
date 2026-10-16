import { nn as SchemaContract } from "./types.openclaw-DWWUw8hA.js";
import { c as ApprovalScopeSchema, n as ExecApprovalsSetParams, s as ApprovalScope$1, t as ExecApprovalRequestParams } from "./exec-approvals-D599mwQY.js";
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
type PolicySnapshot = SchemaContract<NonNullable<NonNullable<ExecApprovalRequestParams["systemRunPlan"]>["policySnapshot"]>>;
type ExecApprovalPolicyRule = PolicySnapshot["allowlistRules"][number];
type ExecApprovalPolicySnapshot = Omit<PolicySnapshot, "allowlistRules"> & {
  allowlistRules: readonly ExecApprovalPolicyRule[];
};
//#endregion
//#region src/infra/exec-approvals.types.d.ts
type ExecApprovalsAgent = SchemaContract<NonNullable<ExecApprovalsSetParams["file"]["agents"]>[string]>;
type ExecAllowlistEntry = NonNullable<ExecApprovalsAgent["allowlist"]>[number];
type AllowAlwaysPattern = Pick<ExecAllowlistEntry, "pattern" | "argPattern">;
//#endregion
//#region src/infra/exec-approvals-core.d.ts
type ExecHost = "sandbox" | "gateway" | "node";
type ExecTarget = "auto" | ExecHost;
type ExecSecurity = "deny" | "allowlist" | "full";
type ExecAsk = "off" | "on-miss" | "always";
type ExecMode = "deny" | "allowlist" | "ask" | "auto" | "full";
type ExecApprovalDecision = "allow-once" | "allow-always" | "deny";
type ExecApprovalUnavailableDecision = "allow-always";
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
type SystemRunApprovalBinding = Pick<SystemRunApprovalPlan, "argv" | "cwd" | "agentId" | "sessionKey"> & {
  envHash: string | null;
};
type SystemRunApprovalPlan = SchemaContract<Omit<NonNullable<ExecApprovalRequestParams["systemRunPlan"]>, "policySnapshot">> & {
  policySnapshot?: ExecApprovalPolicySnapshot;
};
type ExecApprovalCommandSpan = NonNullable<ExecApprovalRequestParams["commandSpans"]>[number];
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
declare const DEFAULT_EXEC_APPROVAL_TIMEOUT_MS = 1800000;
//#endregion
//#region src/infra/approval-scope.d.ts
type ApprovalScope = Static<typeof ApprovalScopeSchema>;
//#endregion
//#region src/infra/plugin-approvals.d.ts
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
  /** Trusted harness-selected policy subject; distinct from display-only toolName. */
  policySubject?: {
    pluginKey: string;
    tool?: string;
  };
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
type PluginApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: PluginApprovalRequestPayload;
};
declare const DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS = 120000;
declare const MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 600000;
declare function buildPluginApprovalRequestMessage(request: PluginApprovalRequest, nowMsValue: number): string;
declare function buildPluginApprovalResolvedMessage(resolved: PluginApprovalResolved): string;
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
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved | SystemAgentApprovalResolved;
type NormalizedApprovalRequest<TRequest extends ApprovalRequestInput> = TRequest extends ExecApprovalRequest ? TRequest & {
  approvalKind: "exec";
} : TRequest extends PluginApprovalRequest ? TRequest & {
  approvalKind: "plugin";
} : TRequest extends SystemAgentApprovalRequest ? TRequest & {
  approvalKind: "system-agent";
} : never;
//#endregion
export { AllowAlwaysPattern as A, ExecApprovalUnavailableDecision as C, ExecSecurity as D, ExecMode as E, ExecTarget as O, ExecApprovalResolved as S, ExecHost as T, ApprovalScope as _, SystemAgentApprovalApplicationStatus as a, ExecApprovalRequest as b, SystemAgentApprovalResolved as c, PluginApprovalRequest as d, PluginApprovalRequestPayload as f, buildPluginApprovalResolvedMessage as g, buildPluginApprovalRequestMessage as h, NormalizedApprovalRequest as i, CommandExplanationSummary as j, resolveExecModePolicy as k, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS as l, buildPluginApprovalExpiredMessage as m, ApprovalResolved as n, SystemAgentApprovalRequest as o, PluginApprovalResolved as p, ChannelApprovalKind as r, SystemAgentApprovalRequestPayload as s, ApprovalRequestInput as t, MAX_PLUGIN_APPROVAL_TIMEOUT_MS as u, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS as v, ExecAsk as w, ExecApprovalRequestPayload as x, ExecApprovalDecision as y };