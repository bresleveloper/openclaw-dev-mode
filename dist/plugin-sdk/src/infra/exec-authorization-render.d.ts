import type { ExecSegmentSatisfiedBy } from "./exec-approvals-allowlist.js";
import type { ExecAuthorizationPlan } from "./exec-authorization-plan.js";
export type AuthorizedShellRenderMode = "safeBins" | "enforced";
export type AuthorizedShellRenderResult = {
    ok: true;
    command: string;
} | {
    ok: false;
    reason: string;
};
export declare function buildAuthorizedShellCommandFromPlan(params: {
    plan: ExecAuthorizationPlan;
    mode: AuthorizedShellRenderMode;
    segmentSatisfiedBy?: readonly ExecSegmentSatisfiedBy[];
}): AuthorizedShellRenderResult;
