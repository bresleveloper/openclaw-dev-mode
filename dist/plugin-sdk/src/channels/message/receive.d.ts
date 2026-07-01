/**
 * Channel message receive acknowledgement context.
 *
 * Models ack/nack policy and idempotent receive state transitions for inbound events.
 */
import type { ChannelMessageReceiveAckPolicy } from "./types.js";
/** Public alias for channel receive acknowledgement policy names. */
export type MessageAckPolicy = ChannelMessageReceiveAckPolicy;
/** Processing stage where a durable inbound message may be acknowledged. */
export type MessageAckStage = "receive_record" | "agent_dispatch" | "durable_send" | "manual";
/** Current acknowledgement state for one inbound message context. */
export type MessageAckState = "pending" | "acked" | "nacked";
/** Mutable receive context passed through durable inbound message processing. */
export type MessageReceiveContext<TMessage = unknown> = {
    id: string;
    channel: string;
    accountId?: string;
    message: TMessage;
    ackPolicy: MessageAckPolicy;
    ackState: MessageAckState;
    ackedAt?: number;
    nackErrorMessage?: string;
    receivedAt: number;
    signal: AbortSignal;
    shouldAckAfter(stage: MessageAckStage): boolean;
    ack(): Promise<void>;
    nack(error: unknown): Promise<void>;
};
/** Returns whether an ack policy should acknowledge at the supplied processing stage. */
export declare function shouldAckMessageAfterStage(policy: MessageAckPolicy, stage: MessageAckStage): boolean;
/** Creates a receive context with idempotent ack and explicit nack state transitions. */
export declare function createMessageReceiveContext<TMessage>(params: {
    id: string;
    channel: string;
    accountId?: string;
    message: TMessage;
    ackPolicy?: MessageAckPolicy;
    receivedAt?: number;
    signal?: AbortSignal;
    onAck?: () => Promise<void> | void;
    onNack?: (error: unknown) => Promise<void> | void;
}): MessageReceiveContext<TMessage>;
