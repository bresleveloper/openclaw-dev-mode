import type { MessageReceipt, MessageReceiptPartKind, MessageReceiptSourceResult } from "./types.js";
type MessageReceiptInputResult = MessageReceiptSourceResult & {
    receipt?: MessageReceipt;
};
/** Builds one normalized receipt from platform send results or nested adapter receipts. */
export declare function createMessageReceiptFromOutboundResults(params: {
    results: readonly MessageReceiptInputResult[];
    kind?: MessageReceiptPartKind;
    threadId?: string;
    replyToId?: string;
    sentAt?: number;
}): MessageReceipt;
/** Lists unique platform message ids in receipt order. */
export declare function listMessageReceiptPlatformIds(receipt: MessageReceipt): string[];
/** Resolves the explicit primary platform id, falling back to the first unique receipt id. */
export declare function resolveMessageReceiptPrimaryId(receipt: MessageReceipt): string | undefined;
export {};
