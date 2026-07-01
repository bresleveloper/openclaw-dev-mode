/**
 * Durable outbound message recovery state.
 *
 * Creates and classifies persisted send records after delivery interruptions.
 */
import type { DurableMessageSendIntent, MessageReceipt } from "./types.js";
/** Durable send state stored for recovery and operator-visible delivery status. */
export type DurableMessageSendState = "pending" | "sent" | "suppressed" | "failed" | "unknown_after_send";
/** Recovery record for one durable outbound message intent. */
export type DurableMessageStateRecord = {
    intent: DurableMessageSendIntent;
    state: DurableMessageSendState;
    receipt?: MessageReceipt;
    updatedAt: number;
    errorMessage?: string;
};
/** Creates a durable message recovery record from intent, receipt, and optional error state. */
export declare function createDurableMessageStateRecord(params: {
    intent: DurableMessageSendIntent;
    state?: DurableMessageSendState;
    receipt?: MessageReceipt;
    updatedAt?: number;
    error?: unknown;
}): DurableMessageStateRecord;
/** Classifies recovery state from persisted intent/receipt facts after a send interruption. */
export declare function classifyDurableSendRecoveryState(params: {
    hasIntent: boolean;
    hasReceipt: boolean;
    platformSendMayHaveStarted: boolean;
    failed?: boolean;
    suppressed?: boolean;
}): DurableMessageSendState;
