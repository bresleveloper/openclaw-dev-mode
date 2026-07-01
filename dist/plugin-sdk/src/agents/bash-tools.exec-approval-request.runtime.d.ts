import type { ExecApprovalCommandSpan } from "../infra/exec-approvals.js";
/** Resolve command spans used to highlight exec approval prompts. */
export declare function resolveExecApprovalCommandSpans(command: string): Promise<ExecApprovalCommandSpan[] | undefined>;
