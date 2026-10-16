import { A as AllowAlwaysPattern, C as ExecApprovalUnavailableDecision, D as ExecSecurity, w as ExecAsk, y as ExecApprovalDecision } from "./approval-types-DOLowId2.js";
//#region src/infra/exec-approvals-contracts.d.ts
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
//#endregion
//#region src/infra/exec-approvals-policy.d.ts
declare function minSecurity(a: ExecSecurity, b: ExecSecurity): ExecSecurity;
declare function maxAsk(a: ExecAsk, b: ExecAsk): ExecAsk;
declare function resolveExecApprovalAllowedDecisions(params?: {
  ask?: string | null;
  allowAlwaysPersistence?: AllowAlwaysPersistenceDecision | null;
}): readonly ExecApprovalDecision[];
declare function resolveExecApprovalRequestAllowedDecisions(params?: {
  ask?: string | null;
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[] | readonly string[] | null;
}): readonly ExecApprovalDecision[];
//#endregion
export { resolveExecApprovalRequestAllowedDecisions as i, minSecurity as n, resolveExecApprovalAllowedDecisions as r, maxAsk as t };