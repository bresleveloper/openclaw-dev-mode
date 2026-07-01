/** Suppresses a subagent completion announcement. */
export declare const ANNOUNCE_SKIP_TOKEN = "ANNOUNCE_SKIP";
/** Suppresses a direct reply delivery. */
export declare const REPLY_SKIP_TOKEN = "REPLY_SKIP";
/** Returns true when text is exactly the announce-skip sentinel. */
export declare function isAnnounceSkip(text?: string): boolean;
/** Returns true when text is exactly the reply-skip sentinel. */
export declare function isReplySkip(text?: string): boolean;
/** Returns true when text is any non-deliverable sessions reply sentinel. */
export declare function isNonDeliverableSessionsReply(text?: string): boolean;
