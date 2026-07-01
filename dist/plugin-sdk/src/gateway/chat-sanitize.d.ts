import { stripEnvelope } from "../shared/chat-envelope.js";
export { stripEnvelope };
/** Strips OpenClaw envelope metadata from one display message without mutating it. */
export declare function stripEnvelopeFromMessage(message: unknown): unknown;
/** Strips envelope metadata from a message array, preserving the original array when unchanged. */
export declare function stripEnvelopeFromMessages(messages: unknown[]): unknown[];
