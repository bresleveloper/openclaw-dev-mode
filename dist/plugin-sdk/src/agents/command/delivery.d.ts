import type { ReplyPayload } from "../../auto-reply/reply-payload.js";
import { type CliDeps } from "../../cli/outbound-send-deps.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { projectOutboundPayloadPlanForJson } from "../../infra/outbound/payloads.js";
import type { OutboundSessionContext } from "../../infra/outbound/session-context.js";
import { type RuntimeEnv } from "../../runtime.js";
import type { MessagingToolSend } from "../embedded-agent-messaging.types.js";
import type { EmbeddedAgentRunMeta } from "../embedded-agent-runner/types.js";
import type { AgentCommandOpts, AgentCommandResultMetaOverrides } from "./types.js";
type RunResult = Awaited<ReturnType<(typeof import("../embedded-agent.js"))["runEmbeddedAgent"]>>;
/** Per-payload durable delivery status. */
type AgentCommandDeliveryPayloadStatus = "sent" | "suppressed" | "failed";
/** Delivery outcome for one normalized outbound payload. */
type AgentCommandDeliveryPayloadOutcome = {
    index: number;
    status: AgentCommandDeliveryPayloadStatus;
    reason?: string;
    resultCount?: number;
    sentBeforeError?: boolean;
    stage?: string;
    error?: string;
    hookEffect?: {
        cancelReason?: string;
        metadata?: Record<string, unknown>;
    };
};
/** Aggregate delivery status for an agent command result. */
type AgentCommandDeliveryStatus = {
    requested: true;
    attempted: boolean;
    status: "sent" | "suppressed" | "partial_failed" | "failed";
    /** `partial` means at least one payload was sent before a later payload failed. */
    succeeded: true | false | "partial";
    error?: true;
    errorMessage?: string;
    /** Free-form lowercase_snake reason from durable delivery or preflight validation. */
    reason?: string;
    resultCount?: number;
    sentBeforeError?: true;
    payloadOutcomes?: AgentCommandDeliveryPayloadOutcome[];
};
/** Agent command result after payload normalization and optional delivery. */
type AgentCommandDeliveryResult = {
    payloads: ReturnType<typeof projectOutboundPayloadPlanForJson>;
    meta: EmbeddedAgentRunMeta & AgentCommandResultMetaOverrides;
    didSendViaMessagingTool?: boolean;
    messagingToolSentTexts?: string[];
    messagingToolSentMediaUrls?: string[];
    messagingToolSentTargets?: MessagingToolSend[];
    deliverySucceeded?: boolean;
    deliveryStatus?: AgentCommandDeliveryStatus;
};
type FreshSessionEntryForDeliveryResolver = () => Promise<SessionEntry | undefined>;
type FreshSessionDeliveryRefreshParams = {
    expectedSessionIdForFreshDelivery: string;
    resolveFreshSessionEntryForDelivery: FreshSessionEntryForDeliveryResolver;
} | {
    expectedSessionIdForFreshDelivery?: string;
    resolveFreshSessionEntryForDelivery?: undefined;
};
type DeliverAgentCommandResultParams = {
    cfg: OpenClawConfig;
    deps: CliDeps;
    runtime: RuntimeEnv;
    opts: AgentCommandOpts;
    outboundSession: OutboundSessionContext | undefined;
    sessionEntry: SessionEntry | undefined;
    result: RunResult;
    payloads: RunResult["payloads"];
    assertDeliveryCurrent?: () => void;
} & FreshSessionDeliveryRefreshParams;
/** Normalizes reply payloads and media paths before delivery. */
export declare function normalizeAgentCommandReplyPayloads(params: {
    cfg: OpenClawConfig;
    opts: AgentCommandOpts;
    outboundSession: OutboundSessionContext | undefined;
    payloads: RunResult["payloads"];
    result: RunResult;
    deliveryChannel?: string;
    accountId?: string;
    applyChannelTransforms?: boolean;
}): ReplyPayload[];
/** Delivers an agent command result or records why delivery was skipped. */
export declare function deliverAgentCommandResult(params: DeliverAgentCommandResultParams): Promise<AgentCommandDeliveryResult>;
export {};
