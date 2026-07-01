export type AckReactionScope = "all" | "direct" | "group-all" | "group-mentions" | "off" | "none";
/** WhatsApp group-mode policy; direct-message ack reactions are configured separately. */
export type WhatsAppAckReactionMode = "always" | "mentions" | "never";
/** Sent ack reaction state plus the cleanup hook callers can run after reply delivery. */
export type AckReactionHandle = {
    ackReactionPromise: Promise<boolean>;
    ackReactionValue: string;
    remove: () => Promise<void>;
};
/**
 * Inputs for the reusable direct/group/mention gate shared by channel plugins.
 *
 * `effectiveWasMentioned` should already include any channel-specific mention
 * normalization. `shouldBypassMention` is only for an earlier channel gate that
 * proved the active conversation, such as a group activation state.
 */
export type AckReactionGateParams = {
    scope: AckReactionScope | undefined;
    isDirect: boolean;
    isGroup: boolean;
    isMentionableGroup: boolean;
    requireMention: boolean;
    canDetectMention: boolean;
    effectiveWasMentioned: boolean;
    shouldBypassMention?: boolean;
};
/** Resolves the generic ack reaction gate without sending or removing reactions. */
export declare function shouldAckReaction(params: AckReactionGateParams): boolean;
/** Resolves WhatsApp ack policy while preserving the shared mention-only group gate. */
export declare function shouldAckReactionForWhatsApp(params: {
    emoji: string;
    isDirect: boolean;
    isGroup: boolean;
    directEnabled: boolean;
    groupMode: WhatsAppAckReactionMode;
    wasMentioned: boolean;
    groupActivated: boolean;
}): boolean;
/** Starts sending an ack reaction and returns the success-tracking cleanup handle. */
export declare function createAckReactionHandle(params: {
    ackReactionValue: string;
    send: () => Promise<void>;
    remove: () => Promise<void>;
    onSendError?: (err: unknown) => void;
}): AckReactionHandle | null;
/** Schedules removal of a previously sent ack reaction after reply delivery. */
export declare function removeAckReactionAfterReply(params: {
    removeAfterReply: boolean;
    ackReactionPromise: Promise<boolean> | null;
    ackReactionValue: string | null;
    remove: () => Promise<void>;
    onError?: (err: unknown) => void;
}): void;
/** Convenience wrapper that removes an ack reaction handle after reply delivery. */
export declare function removeAckReactionHandleAfterReply(params: {
    removeAfterReply: boolean;
    ackReaction: AckReactionHandle | null | undefined;
    onError?: (err: unknown) => void;
}): void;
