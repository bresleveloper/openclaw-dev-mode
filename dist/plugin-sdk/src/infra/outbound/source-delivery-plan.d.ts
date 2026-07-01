import type { SourceReplyDeliveryMode } from "../../auto-reply/get-reply-options.types.js";
/** Owner responsible for making source delivery visible to the user. */
export type SourceVisibleDeliveryOwner = "automatic_source" | "message_tool" | "message_tool_then_direct_fallback" | "direct_fallback" | "none";
/** Reason code explaining why source delivery policy took this shape. */
export type SourceDeliveryPlanReason = "config" | "room_event" | "cron_announce" | "cron_webhook" | "cron_none" | "media_completion" | "subagent_completion";
/** Configured or inferred destination source delivery must satisfy. */
export type SourceDeliveryTarget = {
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string | number;
};
/** Message-tool destination observed during a run. */
export type SourceDeliveryMessageToolTarget = {
    tool?: string;
    provider?: string;
    accountId?: string;
    to?: string;
    threadId?: string;
    threadImplicit?: boolean;
    threadSuppressed?: boolean;
    text?: string;
    mediaUrls?: string[];
};
/** Visible message-tool delivery with target verification state. */
export type SourceDeliveryVisibleDelivery = {
    via: "message_tool";
    target: SourceDeliveryMessageToolTarget;
    verifiedTarget: boolean;
};
/** Resolved source-delivery satisfaction result after a run. */
export type SourceDeliveryOutcome = {
    visibleDeliveries: SourceDeliveryVisibleDelivery[];
    verifiedMessageToolDelivery: boolean;
    satisfiesSourceDelivery: boolean;
    unverifiedMessageToolDelivery: boolean;
};
/** Policy contract that decides message-tool ownership and fallback delivery. */
export type SourceDeliveryPlan = {
    owner: SourceVisibleDeliveryOwner;
    reason: SourceDeliveryPlanReason;
    target: SourceDeliveryTarget;
    normalFinal: "visible" | "private";
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    messageTool: {
        enabled: boolean;
        force: boolean;
        requireExplicitTarget: boolean;
        requireExplicitTargetEvidence: boolean;
        defaultTarget: boolean;
    };
    fallback: {
        directDelivery: boolean;
        skipWhenMessageToolSentToTarget: boolean;
        bestEffort: boolean;
    };
    progress: {
        allowCallbacksWhenSourceDeliverySuppressed: boolean;
    };
};
/** Compares a message-tool target with the required source delivery target. */
export declare function sourceDeliveryTargetsMatch(target: SourceDeliveryMessageToolTarget, delivery: SourceDeliveryTarget): boolean;
/** Builds a source delivery plan from ownership and fallback inputs. */
export declare function createSourceDeliveryPlan(params: {
    owner: SourceVisibleDeliveryOwner;
    reason: SourceDeliveryPlanReason;
    target?: SourceDeliveryTarget;
    messageToolEnabled?: boolean;
    messageToolForced?: boolean;
    requireExplicitMessageTarget?: boolean;
    requireExplicitMessageTargetEvidence?: boolean;
    directFallback?: boolean;
    skipFallbackWhenMessageToolSentToTarget?: boolean;
    fallbackBestEffort?: boolean;
    allowProgressCallbacksWhenSourceDeliverySuppressed?: boolean;
}): SourceDeliveryPlan;
/** Evaluates whether observed message-tool sends satisfy the source delivery plan. */
export declare function resolveSourceDeliveryOutcome(plan: SourceDeliveryPlan, params: {
    didSendViaMessageTool?: boolean;
    messageToolSentTargets?: SourceDeliveryMessageToolTarget[];
}): SourceDeliveryOutcome;
