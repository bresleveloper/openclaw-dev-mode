import { type ExecCommandSegment } from "./exec-approvals-analysis.js";
/** Returns true when a parsed POSIX shell segment is one of the closed safe builtin forms. */
export declare function isSafeBuiltinSegment(params: {
    segment: ExecCommandSegment;
    platform?: string | null;
}): boolean;
