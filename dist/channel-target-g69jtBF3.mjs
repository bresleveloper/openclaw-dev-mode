//#region src/infra/outbound/channel-target.ts
/** Human-readable description for a single message-action destination. */
const CHANNEL_TARGET_DESCRIPTION = "Recipient/channel: E.164 for WhatsApp/Signal, Telegram chat id/@username, Discord/Slack/Mattermost <channelId|user:ID|channel:ID>, or iMessage handle/chat_id";
/** Human-readable description for repeated message-action destinations. */
const CHANNEL_TARGETS_DESCRIPTION = "Recipient/channel targets (same format as --target); accepts ids or names when the directory is available.";
//#endregion
export { CHANNEL_TARGET_DESCRIPTION as n, CHANNEL_TARGETS_DESCRIPTION as t };
