import { Bt as SafeBinProfile } from "./types.openclaw-LzSbb55e.js";
import "./openclaw-state-db-CMVCVfJm.js";
import { H as ExecSecurity, I as ExecApprovalsFile, L as ExecApprovalsResolved, N as ExecApprovalUnavailableDecision, R as ExecApprovalsSnapshot, et as ExecAllowlistEntry, k as ExecApprovalDecision, tt as ExecApprovalPolicySnapshot, z as ExecAsk } from "./approval-types-DIxuby8L.js";
//#region src/infra/exec-command-resolution.d.ts
type ExecutableResolution = {
  kind: "executable";
  rawExecutable: string;
  resolvedPath?: string;
  resolvedRealPath?: string;
  executableName: string;
};
type CommandResolution = {
  kind: "command";
  execution: ExecutableResolution;
  policy: ExecutableResolution;
  effectiveArgv?: string[];
  wrapperChain?: string[];
  policyBlocked?: boolean;
  blockedWrapper?: string;
};
declare function resolveCommandResolution(command: string, cwd?: string, env?: NodeJS.ProcessEnv): CommandResolution | null;
declare function resolveCommandResolutionFromArgv(argv: string[], cwd?: string, env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform, options?: {
  useCache?: boolean;
}): CommandResolution | null;
declare function resolveExecutableTrustPath(resolution: ExecutableResolution | null | undefined, cwd?: string): string | undefined;
declare function resolveExecutionTargetResolution(resolution: CommandResolution | ExecutableResolution | null): ExecutableResolution | null;
declare function resolvePolicyTargetResolution(resolution: CommandResolution | ExecutableResolution | null): ExecutableResolution | null;
declare function resolveExecutionTargetCandidatePath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolveExecutionTargetTrustPath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolvePolicyTargetCandidatePath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolvePolicyTargetTrustPath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolveApprovalAuditCandidatePath(resolution: CommandResolution | null, cwd?: string): string | undefined;
declare function resolveApprovalAuditTrustPath(resolution: CommandResolution | null, cwd?: string): string | undefined;
/** @deprecated Use resolveExecutionTargetCandidatePath. */
declare function resolveAllowlistCandidatePath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolvePolicyAllowlistCandidatePath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function matchAllowlist(entries: ExecAllowlistEntry[], resolution: ExecutableResolution | null, argv?: string[], platform?: string | null, cwd?: string): ExecAllowlistEntry | null;
type ExecArgvToken = {
  kind: "empty";
  raw: string;
} | {
  kind: "terminator";
  raw: string;
} | {
  kind: "stdin";
  raw: string;
} | {
  kind: "positional";
  raw: string;
} | {
  kind: "option";
  raw: string;
  style: "long";
  flag: string;
  inlineValue?: string;
} | {
  kind: "option";
  raw: string;
  style: "short-cluster";
  cluster: string;
  flags: string[];
};
/**
 * Tokenizes a single argv entry into a normalized option/positional model.
 * Consumers can share this model to keep argv parsing behavior consistent.
 */
declare function parseExecArgvToken(raw: string): ExecArgvToken;
//#endregion
//#region src/infra/exec-command-analysis-types.d.ts
type ExecCommandSegment = {
  raw: string;
  argv: string[];
  sourceArgv?: string[];
  resolution: CommandResolution | null;
};
type ExecCommandAnalysis = {
  ok: boolean;
  reason?: string;
  segments: ExecCommandSegment[];
  chains?: ExecCommandSegment[][];
};
type ShellChainOperator = "&&" | "||" | ";" | "&";
//#endregion
//#region src/infra/command-explainer/types.d.ts
/** Where a parsed command step appeared in the shell source. */
type CommandContext = "top-level" | "command-substitution" | "process-substitution" | "function-definition" | "wrapper-payload";
type SourceSpan = {
  startIndex: number;
  endIndex: number;
  startPosition: {
    row: number;
    column: number;
  };
  endPosition: {
    row: number;
    column: number;
  };
};
type CommandStep = {
  id?: string;
  parentCommandId?: string;
  context: CommandContext;
  executable: string;
  argv: string[];
  text: string;
  span: SourceSpan;
  executableSpan: SourceSpan;
  argvSpans?: SourceSpan[];
};
type CommandOperatorKind = "and" | "or" | "sequence" | "newline-sequence" | "pipe" | "stderr-pipe" | "background";
type CommandOperator = {
  id: string;
  kind: CommandOperatorKind;
  text: string;
  span: SourceSpan;
  fromCommandId: string;
  toCommandId: string;
  parentCommandId?: string;
};
//#endregion
//#region src/infra/exec-authorization-plan.d.ts
type ExecAuthorizationDialect = "argv" | "posix-shell" | "windows-cmd" | "powershell";
type ExecAuthorizationTransport = {
  kind: "direct";
} | {
  kind: "shell-wrapper";
  wrapperSegment: ExecCommandSegment;
  wrapperArgv: string[];
  wrapperPrefix: string;
  inlineCommand: string;
};
type ExecAuthorizationTrustMode = "executable" | "exact-command" | "prompt-only";
type ExecAuthorizationCandidate = {
  sourceSegment: ExecCommandSegment;
  sourceStep: CommandStep;
  sourceStepId?: string;
  transport: ExecAuthorizationTransport;
  trustMode: ExecAuthorizationTrustMode;
  allowAlways: boolean;
  reasons: string[];
};
type ExecAuthorizationGroup = {
  opToNext?: ShellChainOperator | null;
  candidates: ExecAuthorizationCandidate[];
};
type ExecAuthorizationPlan = {
  ok: true;
  dialect: ExecAuthorizationDialect;
  originalCommand: string;
  groups: ExecAuthorizationGroup[];
  operators: CommandOperator[];
} | {
  ok: false;
  dialect: ExecAuthorizationDialect;
  originalCommand: string;
  reason: string;
  groups: [];
  operators: [];
};
//#endregion
//#region src/infra/exec-safe-bin-trust.d.ts
type TrustedSafeBinPathParams = {
  resolvedPath: string;
  trustedDirs?: ReadonlySet<string>;
};
declare function isTrustedSafeBinPath(params: TrustedSafeBinPathParams): boolean;
//#endregion
//#region src/infra/exec-approvals-allowlist.d.ts
declare function normalizeSafeBins(entries?: readonly string[]): Set<string>;
declare function resolveSafeBins(entries?: readonly string[] | null): Set<string>;
declare function isSafeBinUsage(params: {
  argv: string[];
  resolution: ExecutableResolution | null;
  safeBins: Set<string>;
  platform?: string | null;
  trustedSafeBinDirs?: ReadonlySet<string>;
  safeBinProfiles?: Readonly<Record<string, SafeBinProfile>>;
  isTrustedSafeBinPathFn?: typeof isTrustedSafeBinPath;
}): boolean;
type ExecAllowlistEvaluation = {
  allowlistSatisfied: boolean;
  allowlistMatches: ExecAllowlistEntry[];
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  segmentSatisfiedBy: ExecSegmentSatisfiedBy[];
};
type ExecSegmentSatisfiedBy = "allowlist" | "safeBins" | "inlineChain" | "safeBuiltins" | "skills" | null;
type SkillBinTrustEntry = {
  name: string;
  resolvedPath: string;
};
type ExecAllowlistContext = {
  allowlist: ExecAllowlistEntry[];
  safeBins: Set<string>;
  safeBinProfiles?: Readonly<Record<string, SafeBinProfile>>;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  trustedSafeBinDirs?: ReadonlySet<string>;
  skillBins?: readonly SkillBinTrustEntry[];
  autoAllowSkills?: boolean;
  allowShellBuiltins?: boolean;
};
declare function evaluateExecAllowlist(params: {
  analysis: ExecCommandAnalysis;
} & ExecAllowlistContext): ExecAllowlistEvaluation;
type ExecAllowlistAnalysis = {
  analysisOk: boolean;
  allowlistSatisfied: boolean;
  allowlistMatches: ExecAllowlistEntry[];
  segments: ExecCommandSegment[];
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  segmentSatisfiedBy: ExecSegmentSatisfiedBy[];
  authorizationPlan?: ExecAuthorizationPlan;
};
type AllowAlwaysPattern = {
  pattern: string;
  argPattern?: string;
};
/**
 * Derive persisted allowlist patterns for an "allow always" decision.
 * When a command is wrapped in a shell (for example `zsh -lc "<cmd>"`),
 * persist the inner executable(s) rather than the shell binary.
 */
declare function resolveAllowAlwaysPatternEntries(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): AllowAlwaysPattern[];
declare function resolveAllowAlwaysPatterns(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): string[];
/**
 * Evaluates allowlist for shell commands (including &&, ||, ;) and returns analysis metadata.
 */
declare function evaluateShellAllowlist(params: {
  command: string;
  env?: NodeJS.ProcessEnv;
} & ExecAllowlistContext): ExecAllowlistAnalysis;
declare function evaluateShellAllowlistWithAuthorization(params: {
  command: string;
  env?: NodeJS.ProcessEnv;
} & ExecAllowlistContext): Promise<ExecAllowlistAnalysis>;
declare function evaluateExecAllowlistWithAuthorization(params: {
  analysis: ExecCommandAnalysis;
  command?: string;
} & ExecAllowlistContext): Promise<ExecAllowlistEvaluation & {
  segments?: ExecCommandSegment[];
  authorizationPlan?: ExecAuthorizationPlan;
}>;
//#endregion
//#region src/infra/exec-approvals-contracts.d.ts
type ExecApprovalsDefaultOverrides = {
  security?: ExecSecurity;
  ask?: ExecAsk;
  askFallback?: ExecSecurity;
  autoAllowSkills?: boolean;
  requireSocket?: boolean;
};
type AllowAlwaysPersistenceReason = "no-reusable-pattern" | "prompt-only" | "runtime-payload" | "unplanned";
type AllowAlwaysPersistenceDecision = {
  kind: "patterns";
  patterns: readonly AllowAlwaysPattern[];
  commandText?: string;
} | {
  kind: "exact-command";
  commandText: string;
} | {
  kind: "one-shot";
  reasons: AllowAlwaysPersistenceReason[];
};
type ExecApprovalUsageAuthorization = {
  source: "current-policy" | "ask-fallback" | "explicit-approval" | "auto-review";
  security: ExecSecurity;
  ask: ExecAsk;
  bypassHostApprovalFloors?: boolean;
  allowlistSatisfied: boolean;
  policySnapshot?: ExecApprovalPolicySnapshot;
  requireAutoAllowSkills?: boolean;
  requireExactCommandApproval?: boolean;
  requireDurableAllowlistApproval?: boolean;
};
//#endregion
//#region src/infra/exec-approvals-config.d.ts
declare const DEFAULT_EXEC_APPROVAL_ASK_FALLBACK: ExecSecurity;
declare function resolveExecApprovalsPath(env?: NodeJS.ProcessEnv): string;
declare function resolveExecApprovalsSocketPath(): string;
declare function resolveExecApprovalsDisplayPath(env?: NodeJS.ProcessEnv): string;
declare function resolveExecApprovalsTranscriptPath(): string;
declare function mergeExecApprovalsSocketDefaults(params: {
  normalized: ExecApprovalsFile;
  current?: ExecApprovalsFile;
}): ExecApprovalsFile;
//#endregion
//#region src/infra/exec-approvals-store.d.ts
declare function readExecApprovalsSnapshot(): ExecApprovalsSnapshot;
declare function loadExecApprovals(): ExecApprovalsFile;
declare function saveExecApprovals(file: ExecApprovalsFile): void;
declare function restoreExecApprovalsSnapshot(snapshot: ExecApprovalsSnapshot): void;
declare function ensureExecApprovals(): ExecApprovalsFile;
//#endregion
//#region src/infra/exec-approvals-policy.d.ts
declare function requiresExecApproval(params: {
  ask: ExecAsk;
  security: ExecSecurity;
  analysisOk: boolean;
  allowlistSatisfied: boolean;
  durableApprovalSatisfied?: boolean;
}): boolean;
declare function commandRequiresSecurityAuditSuppressionApproval(params: {
  command: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  segments: Array<{
    argv: string[];
    raw?: string;
  }>;
}): boolean;
declare function minSecurity(a: ExecSecurity, b: ExecSecurity): ExecSecurity;
declare function maxAsk(a: ExecAsk, b: ExecAsk): ExecAsk;
declare const DEFAULT_EXEC_APPROVAL_DECISIONS: readonly ["allow-once", "allow-always", "deny"];
declare const OPTIONAL_EXEC_APPROVAL_DECISIONS: readonly ["allow-always"];
declare function normalizeExecApprovalUnavailableDecisions(decisions?: readonly string[] | readonly ExecApprovalUnavailableDecision[] | null): readonly ExecApprovalUnavailableDecision[];
declare function resolveExecApprovalAllowedDecisions(params?: {
  ask?: string | null;
  allowAlwaysPersistence?: AllowAlwaysPersistenceDecision | null;
}): readonly ExecApprovalDecision[];
declare function resolveExecApprovalUnavailableDecisions(params?: {
  ask?: string | null;
  allowAlwaysPersistence?: AllowAlwaysPersistenceDecision | null;
}): readonly ExecApprovalUnavailableDecision[];
declare function resolveExecApprovalRequestAllowedDecisions(params?: {
  ask?: string | null;
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[] | readonly string[] | null;
}): readonly ExecApprovalDecision[];
declare function isExecApprovalDecisionAllowed(params: {
  decision: ExecApprovalDecision;
  ask?: string | null;
}): boolean;
//#endregion
//#region src/infra/exec-approvals-allow-always.d.ts
declare function hasDurableExecApproval(params: {
  analysisOk: boolean;
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function hasNodeCommandAllowAlwaysMarker(params: {
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function hasExactCommandDurableExecApproval(params: {
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function addAllowlistEntry(approvals: ExecApprovalsFile, agentId: string | undefined, pattern: string, options?: {
  argPattern?: string;
  source?: ExecAllowlistEntry["source"];
}): void;
declare function addDurableCommandApproval(approvals: ExecApprovalsFile, agentId: string | undefined, commandText: string): void;
declare function resolveAllowAlwaysPatternCoverage(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): {
  complete: boolean;
  patterns: ReturnType<typeof resolveAllowAlwaysPatternEntries>;
};
declare function persistAllowAlwaysPatterns(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  commandText?: string;
  strictInlineEval?: boolean;
}): ReturnType<typeof resolveAllowAlwaysPatternEntries>;
declare function resolveAllowAlwaysPersistenceDecision(params: {
  segments: ExecCommandSegment[];
  commandText?: string | null;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
  authorizationPlan?: ExecAuthorizationPlan;
  runtimePayload?: boolean;
  preparedCoverage?: ReturnType<typeof resolveAllowAlwaysPatternCoverage> | null;
}): AllowAlwaysPersistenceDecision;
declare function persistAllowAlwaysDecision(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  decision: AllowAlwaysPersistenceDecision;
}): void;
//#endregion
//#region src/infra/exec-approvals-authorization.d.ts
declare function recordAllowlistUse(approvals: ExecApprovalsFile, agentId: string | undefined, entry: ExecAllowlistEntry, command: string, resolvedPath?: string): void;
declare function recordAllowlistMatchesUse(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  matches: readonly ExecAllowlistEntry[];
  command: string;
  resolvedPath?: string;
  authorization?: ExecApprovalUsageAuthorization;
}): void;
//#endregion
//#region src/infra/exec-approvals-socket.d.ts
declare function requestExecApprovalViaSocket(params: {
  socketPath: string;
  token: string;
  request: Record<string, unknown>;
  timeoutMs?: number;
}): Promise<ExecApprovalDecision | null>;
//#endregion
//#region src/infra/exec-approvals.d.ts
declare function normalizeExecApprovals(file: ExecApprovalsFile): ExecApprovalsFile;
declare function resolveExecApprovals(agentId?: string, overrides?: ExecApprovalsDefaultOverrides): ExecApprovalsResolved;
declare function resolveExecApprovalsFromFile(params: {
  file: ExecApprovalsFile;
  agentId?: string;
  overrides?: ExecApprovalsDefaultOverrides;
  path?: string;
  socketPath?: string;
  token?: string;
}): ExecApprovalsResolved;
//#endregion
export { resolveAllowAlwaysPatterns as $, restoreExecApprovalsSnapshot as A, ExecApprovalsDefaultOverrides as B, requiresExecApproval as C, ensureExecApprovals as D, resolveExecApprovalUnavailableDecisions as E, resolveExecApprovalsPath as F, SkillBinTrustEntry as G, ExecAllowlistAnalysis as H, resolveExecApprovalsSocketPath as I, evaluateShellAllowlist as J, evaluateExecAllowlist as K, resolveExecApprovalsTranscriptPath as L, DEFAULT_EXEC_APPROVAL_ASK_FALLBACK as M, mergeExecApprovalsSocketDefaults as N, loadExecApprovals as O, resolveExecApprovalsDisplayPath as P, resolveAllowAlwaysPatternEntries as Q, AllowAlwaysPersistenceDecision as R, normalizeExecApprovalUnavailableDecisions as S, resolveExecApprovalRequestAllowedDecisions as T, ExecAllowlistEvaluation as U, AllowAlwaysPattern as V, ExecSegmentSatisfiedBy as W, isSafeBinUsage as X, evaluateShellAllowlistWithAuthorization as Y, normalizeSafeBins as Z, OPTIONAL_EXEC_APPROVAL_DECISIONS as _, resolveExecutionTargetTrustPath as _t, recordAllowlistMatchesUse as a, ExecArgvToken as at, maxAsk as b, resolvePolicyTargetResolution as bt, addDurableCommandApproval as c, parseExecArgvToken as ct, hasNodeCommandAllowAlwaysMarker as d, resolveApprovalAuditTrustPath as dt, resolveSafeBins as et, persistAllowAlwaysDecision as f, resolveCommandResolution as ft, DEFAULT_EXEC_APPROVAL_DECISIONS as g, resolveExecutionTargetResolution as gt, resolveAllowAlwaysPersistenceDecision as h, resolveExecutionTargetCandidatePath as ht, requestExecApprovalViaSocket as i, CommandResolution as it, saveExecApprovals as j, readExecApprovalsSnapshot as k, hasDurableExecApproval as l, resolveAllowlistCandidatePath as lt, resolveAllowAlwaysPatternCoverage as m, resolveExecutableTrustPath as mt, resolveExecApprovals as n, ExecCommandSegment as nt, recordAllowlistUse as o, ExecutableResolution as ot, persistAllowAlwaysPatterns as p, resolveCommandResolutionFromArgv as pt, evaluateExecAllowlistWithAuthorization as q, resolveExecApprovalsFromFile as r, ShellChainOperator as rt, addAllowlistEntry as s, matchAllowlist as st, normalizeExecApprovals as t, ExecCommandAnalysis as tt, hasExactCommandDurableExecApproval as u, resolveApprovalAuditCandidatePath as ut, commandRequiresSecurityAuditSuppressionApproval as v, resolvePolicyAllowlistCandidatePath as vt, resolveExecApprovalAllowedDecisions as w, minSecurity as x, resolvePolicyTargetTrustPath as xt, isExecApprovalDecisionAllowed as y, resolvePolicyTargetCandidatePath as yt, AllowAlwaysPersistenceReason as z };