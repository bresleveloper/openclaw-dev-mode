import type { InboundEventKind } from "../../channels/inbound-event/kind.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { SessionSendPolicyDecision } from "../../sessions/send-policy.js";
import { type CommandTurnContext } from "../command-turn-context.js";
import type { SourceReplyDeliveryMode } from "../get-reply-options.types.js";
/** Minimal inbound context needed for source-reply delivery decisions. */
export type SourceReplyDeliveryModeContext = {
    ChatType?: string;
    InboundEventKind?: InboundEventKind;
    Provider?: string;
    Surface?: string;
    ExplicitDeliverRoute?: boolean;
    CommandAuthorized?: boolean;
    CommandBody?: string;
    CommandSource?: "text" | "native";
    CommandTurn?: CommandTurnContext;
    BotUsername?: string;
};
/** Returns true when the turn explicitly invoked a source-visible command. */
export declare function isExplicitSourceReplyCommand(ctx: SourceReplyDeliveryModeContext, cfg: OpenClawConfig): boolean;
/** Returns true for text slash commands that lack authorization metadata. */
export declare function isUnauthorizedTextSlashCommand(ctx: SourceReplyDeliveryModeContext): boolean;
/** Returns true for internal message-channel turns that should remain local. */
export declare function isInternalSourceReplyChannel(ctx: SourceReplyDeliveryModeContext): boolean;
/** Resolves whether normal final text should auto-deliver or require the message tool. */
export declare function resolveSourceReplyDeliveryMode(params: {
    cfg: OpenClawConfig;
    ctx: SourceReplyDeliveryModeContext;
    requested?: SourceReplyDeliveryMode;
    strictMessageToolOnly?: boolean;
    messageToolAvailable?: boolean;
    defaultVisibleReplies?: "automatic" | "message_tool";
}): SourceReplyDeliveryMode;
/** Full source-reply suppression decision consumed by run and hook code. */
type SourceReplyVisibilityPolicy = {
    sourceReplyDeliveryMode: SourceReplyDeliveryMode;
    sendPolicyDenied: boolean;
    suppressAutomaticSourceDelivery: boolean;
    suppressDelivery: boolean;
    suppressHookUserDelivery: boolean;
    suppressHookReplyLifecycle: boolean;
    suppressTyping: boolean;
    deliverySuppressionReason: string;
};
/** Resolves source delivery, hooks, lifecycle, and typing suppression flags. */
export declare function resolveSourceReplyVisibilityPolicy(params: {
    cfg: OpenClawConfig;
    ctx: SourceReplyDeliveryModeContext;
    requested?: SourceReplyDeliveryMode;
    strictMessageToolOnly?: boolean;
    sendPolicy: SessionSendPolicyDecision;
    suppressAcpChildUserDelivery?: boolean;
    explicitSuppressTyping?: boolean;
    shouldSuppressTyping?: boolean;
    messageToolAvailable?: boolean;
    defaultVisibleReplies?: "automatic" | "message_tool";
}): SourceReplyVisibilityPolicy;
export {};
