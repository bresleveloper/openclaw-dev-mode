import { hasNonEmptyString as sharedHasNonEmptyString } from "../../../packages/normalization-core/src/string-coerce.js";
/** Shared non-empty string guard for message-action target params. */
export declare const hasNonEmptyString: typeof sharedHasNonEmptyString;
/** Human-readable description for a single message-action destination. */
export declare const CHANNEL_TARGET_DESCRIPTION = "Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id";
/** Human-readable description for repeated message-action destinations. */
export declare const CHANNEL_TARGETS_DESCRIPTION = "Recipient/channel targets (same format as --target); accepts ids or names when the directory is available.";
/** Maps canonical `target` into the legacy field required by the action implementation. */
export declare function applyTargetToParams(params: {
    action: string;
    args: Record<string, unknown>;
}): void;
