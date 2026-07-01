export type ReplyOperationAdmissionSnapshot = {
    status: "owned";
} | {
    status: "skipped";
    reason: "active-run" | "aborted";
};
export type ReplyOperationRunState = {
    admission?: ReplyOperationAdmissionSnapshot;
};
export declare const REPLY_OPERATION_RUN_STATE: unique symbol;
export type ReplyOptionsWithOperationRunState = {
    [REPLY_OPERATION_RUN_STATE]?: ReplyOperationRunState;
};
export declare function resolveReplyOperationRunState(options: object | undefined): ReplyOperationRunState | undefined;
