import type { ExecApprovalRequestPayload } from "../infra/exec-approvals.js";
import { type SystemRunApprovalMatchResult } from "../infra/system-run-approval-binding.js";
type SystemRunApprovalBinding = {
    cwd: string | null;
    agentId: string | null;
    sessionKey: string | null;
    env?: unknown;
};
export { toSystemRunApprovalMismatchError } from "../infra/system-run-approval-binding.js";
/** Evaluates whether a node system.run request matches the stored approval binding. */
export declare function evaluateSystemRunApprovalMatch(params: {
    argv: string[];
    request: ExecApprovalRequestPayload;
    binding: SystemRunApprovalBinding;
}): SystemRunApprovalMatchResult;
