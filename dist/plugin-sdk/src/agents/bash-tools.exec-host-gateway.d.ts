import { type ExecAsk, type ExecSecurity } from "../infra/exec-approvals.js";
import { type ExecAutoReviewer } from "../infra/exec-auto-review.js";
import type { SafeBinProfile } from "../infra/exec-safe-bin-policy.js";
import type { ExecElevatedDefaults, ExecApprovalFollowupFactory, ExecToolDetails } from "./bash-tools.exec-types.js";
import type { AgentToolResult } from "./runtime/index.js";
/** Full input bundle for gateway-host allowlist and approval processing. */
type ProcessGatewayAllowlistParams = {
    command: string;
    workdir: string;
    env: Record<string, string>;
    pathPrepend?: string[];
    requestedEnv?: Record<string, string>;
    pty: boolean;
    timeoutSec?: number;
    defaultTimeoutSec: number;
    security: ExecSecurity;
    ask: ExecAsk;
    autoReview?: boolean;
    autoReviewer?: ExecAutoReviewer;
    safeBins: Set<string>;
    safeBinProfiles: Readonly<Record<string, SafeBinProfile>>;
    strictInlineEval?: boolean;
    commandHighlighting?: boolean;
    trigger?: string;
    agentId?: string;
    sessionKey?: string;
    /** Session UUID active when the approval was requested; pins the followup. */
    sessionId?: string;
    /** Session-store template, so the direct/denied followup can detect a rebind. */
    sessionStore?: string;
    bashElevated?: ExecElevatedDefaults;
    approvalReviewerDeviceId?: string;
    turnSourceChannel?: string;
    turnSourceTo?: string;
    turnSourceAccountId?: string;
    turnSourceThreadId?: string | number;
    scopeKey?: string;
    approvalFollowupText?: string;
    approvalFollowup?: ExecApprovalFollowupFactory;
    approvalFollowupMode?: "agent" | "direct";
    warnings: string[];
    notifySessionKey?: string;
    approvalRunningNoticeMs: number;
    maxOutput: number;
    pendingMaxOutput: number;
    trustedSafeBinDirs?: ReadonlySet<string>;
};
/** Gateway allowlist outcome before command execution continues. */
type ProcessGatewayAllowlistResult = {
    execCommandOverride?: string;
    allowWithoutEnforcedCommand?: boolean;
    pendingResult?: AgentToolResult<ExecToolDetails>;
    deniedResult?: AgentToolResult<ExecToolDetails>;
};
/** Processes gateway exec policy and returns execution/approval/denial outcome. */
export declare function processGatewayAllowlist(params: ProcessGatewayAllowlistParams): Promise<ProcessGatewayAllowlistResult>;
export {};
