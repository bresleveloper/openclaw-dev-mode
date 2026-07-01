import type { ExecApprovalCommandSpan } from "../exec-approvals.js";
import type { CommandExplanation } from "./types.js";
/** Converts a parsed command explanation into source spans suitable for approval UI. */
export declare function formatCommandSpans(explanation: CommandExplanation): ExecApprovalCommandSpan[];
