import type { ChatType } from "../channels/chat-type.js";
type SessionDeliveryContext = {
    channel?: string;
    to?: string;
    accountId?: string;
    threadId?: string | number;
};
type SessionDeliveryRetryPolicy = {
    maxRetries?: number;
};
export type SessionDeliveryRoute = {
    channel: string;
    to: string;
    accountId?: string;
    replyToId?: string;
    threadId?: string;
    chatType: ChatType;
};
/** Payload variants that can be replayed by session delivery recovery. */
export type QueuedSessionDeliveryPayload = ({
    kind: "systemEvent";
    sessionKey: string;
    text: string;
    deliveryContext?: SessionDeliveryContext;
    idempotencyKey?: string;
} & SessionDeliveryRetryPolicy) | ({
    kind: "agentTurn";
    sessionKey: string;
    message: string;
    messageId: string;
    expectedSessionId?: string;
    route?: SessionDeliveryRoute;
    deliveryContext?: SessionDeliveryContext;
    idempotencyKey?: string;
} & SessionDeliveryRetryPolicy);
export type QueuedSessionDelivery = QueuedSessionDeliveryPayload & {
    id: string;
    enqueuedAt: number;
    retryCount: number;
    lastAttemptAt?: number;
    lastError?: string;
};
/** Enqueue a session delivery and return its durable id. */
export declare function enqueueSessionDelivery(params: QueuedSessionDeliveryPayload, stateDir?: string): Promise<string>;
/** Acknowledge a successfully delivered session entry. */
export declare function ackSessionDelivery(id: string, stateDir?: string): Promise<void>;
/** Record a failed delivery attempt and increment retry metadata. */
export declare function failSessionDelivery(id: string, error: string, stateDir?: string): Promise<void>;
/** Load one pending session delivery by durable id. */
export declare function loadPendingSessionDelivery(id: string, stateDir?: string): Promise<QueuedSessionDelivery | null>;
/** Load all pending session deliveries in retry order. */
export declare function loadPendingSessionDeliveries(stateDir?: string): Promise<QueuedSessionDelivery[]>;
/** Move an exhausted session delivery out of the pending queue. */
export declare function moveSessionDeliveryToFailed(id: string, stateDir?: string): Promise<void>;
export {};
