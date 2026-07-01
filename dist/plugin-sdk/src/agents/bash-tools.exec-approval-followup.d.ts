type ExecApprovalFollowupParams = {
    approvalId: string;
    sessionKey?: string;
    /** Session UUID active when the approval was requested. Carried to the gateway
     *  so a followup whose session key was rebound by /new or /reset is dropped. */
    expectedSessionId?: string;
    /** `session.store` template, used by the direct/denied path to resolve the
     *  key's current sessionId and drop a rebound followup before sending. */
    sessionStore?: string;
    turnSourceChannel?: string;
    turnSourceTo?: string;
    turnSourceAccountId?: string;
    turnSourceThreadId?: string | number;
    resultText: string;
    direct?: boolean;
    internalRuntimeHandoffId?: string;
    idempotencyKey?: string;
};
/** Builds the prompt used to resume an agent after an approved async exec completes. */
export declare function buildExecApprovalFollowupPrompt(resultText: string): string;
/** Sends an exec approval follow-up via session resume or safe direct delivery. */
export declare function sendExecApprovalFollowup(params: ExecApprovalFollowupParams): Promise<boolean>;
export {};
