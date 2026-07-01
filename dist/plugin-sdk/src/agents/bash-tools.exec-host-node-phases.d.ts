import { type InterpreterInlineEvalHit } from "../infra/command-analysis/inline-eval.js";
import { type ExecAsk, type AllowAlwaysPersistenceDecision, type ExecSecurity, type SystemRunApprovalPlan, type AllowAlwaysPattern } from "../infra/exec-approvals.js";
import { type PreparedRunExecPolicy } from "../infra/system-run-approval-context.js";
import type { ExecuteNodeHostCommandParams } from "./bash-tools.exec-host-node.types.js";
import type { ExecToolDetails } from "./bash-tools.exec-types.js";
import type { AgentToolResult } from "./runtime/index.js";
type NodeExecutionTarget = {
    nodeId: string;
    platform?: string | null;
    argv: string[];
    env: Record<string, string> | undefined;
    invokeTimeoutMs: number;
    runTimeoutSec: number;
    supportsSystemRunPrepare: boolean;
};
type PreparedNodeRun = {
    plan: SystemRunApprovalPlan;
    argv: string[];
    rawCommand: string;
    cwd: string | undefined;
    agentId: string | undefined;
    sessionKey: string | undefined;
    execPolicy?: PreparedRunExecPolicy;
    allowAlwaysCoverage?: NodeAllowAlwaysCoverage;
};
type NodeApprovalAnalysis = {
    analysisOk: boolean;
    allowlistSatisfied: boolean;
    durableApprovalSatisfied: boolean;
    nodeApprovalPolicyKnown: boolean;
    nodeSecurity?: ExecSecurity;
    nodeAsk?: ExecAsk;
    inlineEvalHit: InterpreterInlineEvalHit | null;
    requiresSecurityAuditSuppressionApproval: boolean;
    autoReviewArgv?: string[];
    allowAlwaysPersistence: AllowAlwaysPersistenceDecision;
};
type NodeAllowAlwaysCoverage = {
    complete: boolean;
    patterns: AllowAlwaysPattern[];
};
/** Returns true when local policy allows direct node invoke without prepare/approval. */
export declare function shouldSkipNodeApprovalPrepare(params: {
    hostSecurity: ExecSecurity;
    hostAsk: ExecAsk;
    strictInlineEval?: boolean;
}): boolean;
/** Formats a raw `node.invoke system.run` response as an exec tool result. */
export declare function formatNodeRunToolResult(params: {
    raw: unknown;
    startedAt: number;
    cwd: string | undefined;
}): AgentToolResult<ExecToolDetails>;
/** Resolves the node id, platform, argv, env, and timeout for a node-host exec. */
export declare function resolveNodeExecutionTarget(params: ExecuteNodeHostCommandParams): Promise<NodeExecutionTarget>;
/** Builds the `node.invoke` payload for `system.run`. */
export declare function buildNodeSystemRunInvoke(params: {
    target: NodeExecutionTarget;
    command: string[];
    rawCommand: string;
    cwd: string | undefined;
    agentId: string | undefined;
    sessionKey: string | undefined;
    turnSourceChannel?: string;
    turnSourceTo?: string;
    turnSourceAccountId?: string;
    turnSourceThreadId?: string | number;
    approved?: boolean;
    approvalDecision?: "allow-once" | "allow-always" | null;
    runId?: string;
    suppressNotifyOnExit?: boolean;
    notifyOnExit?: boolean;
    systemRunPlan?: SystemRunApprovalPlan;
}): Record<string, unknown>;
/** Invokes `system.run` directly when approval policy is fully bypassed. */
export declare function invokeNodeSystemRunDirect(params: {
    request: ExecuteNodeHostCommandParams;
    target: NodeExecutionTarget;
}): Promise<AgentToolResult<ExecToolDetails>>;
/** Prepares a node-host system run using remote prepare support or local fallback. */
export declare function prepareNodeSystemRun(params: {
    request: ExecuteNodeHostCommandParams;
    target: NodeExecutionTarget;
}): Promise<PreparedNodeRun>;
/** Analyzes whether a prepared node run satisfies node/caller approval policy. */
export declare function analyzeNodeApprovalRequirement(params: {
    request: ExecuteNodeHostCommandParams;
    target: NodeExecutionTarget;
    prepared: PreparedNodeRun;
    hostSecurity: ExecSecurity;
    hostAsk: ExecAsk;
}): Promise<NodeApprovalAnalysis>;
export {};
