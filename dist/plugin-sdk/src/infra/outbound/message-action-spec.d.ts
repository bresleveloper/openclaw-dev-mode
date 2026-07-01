import type { ChannelMessageActionName } from "../../channels/plugins/types.public.js";
/**
 * Canonical parameter shape used by an outbound message action target.
 */
export type MessageActionTargetMode = "to" | "channelId" | "none";
/**
 * Target-parameter policy for each supported channel message action.
 */
export declare const MESSAGE_ACTION_TARGET_MODE: Record<ChannelMessageActionName, MessageActionTargetMode>;
/**
 * Reports whether an action normally needs a destination target.
 */
export declare function actionRequiresTarget(action: ChannelMessageActionName): boolean;
/**
 * Detects whether an action invocation already carries a usable target.
 */
export declare function actionHasTarget(action: ChannelMessageActionName, params: Record<string, unknown>, options?: {
    channel?: string;
}): boolean;
