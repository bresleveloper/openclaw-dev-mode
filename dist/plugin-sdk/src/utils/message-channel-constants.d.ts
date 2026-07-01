export declare const INTERNAL_MESSAGE_CHANNEL: "webchat";
export type InternalMessageChannel = typeof INTERNAL_MESSAGE_CHANNEL;
declare const INTERNAL_NON_DELIVERY_CHANNELS: readonly ["heartbeat", "cron", "webhook", "voice", "sessions_send"];
export declare function isInternalNonDeliveryChannel(value: string): value is (typeof INTERNAL_NON_DELIVERY_CHANNELS)[number];
export declare const NATIVE_APPROVAL_CHANNELS: readonly ["webchat", "discord", "googlechat", "imessage", "matrix", "qqbot", "signal", "slack", "telegram", "whatsapp"];
export type NativeApprovalChannel = (typeof NATIVE_APPROVAL_CHANNELS)[number];
export declare function isNativeApprovalChannel(value: string | null | undefined): value is NativeApprovalChannel;
export {};
