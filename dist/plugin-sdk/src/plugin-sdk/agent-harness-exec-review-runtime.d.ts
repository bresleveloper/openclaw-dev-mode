export declare function reviewExecRequestWithConfiguredModel(params: {
    cfg?: import("../config/types.openclaw.js").OpenClawConfig;
    agentId?: string;
    reviewer?: unknown;
    input: import("../infra/exec-auto-review.js").ExecAutoReviewInput;
}): Promise<import("../infra/exec-auto-review.js").ExecAutoReviewDecision>;
export declare function buildExecAutoReviewInputForShellCommand(params: {
    command: string;
    cwd?: string | null;
    host: import("../infra/exec-auto-review.js").ExecAutoReviewHost;
    envKeys?: readonly string[];
    agent?: {
        id?: string | null;
        sessionKey?: string | null;
    };
}): Promise<import("../infra/exec-auto-review.js").ExecAutoReviewInput | undefined>;
