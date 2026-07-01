/**
 * Rendered channel message batch planner.
 *
 * Summarizes reply payloads so delivery can pick adapter paths and recovery metadata.
 */
import type { ReplyPayload } from "../../auto-reply/reply-payload.js";
import type { RenderedMessageBatch, RenderedMessageBatchPlan } from "./types.js";
/** Summarizes rendered reply payloads so delivery can choose adapter paths and recovery metadata. */
export declare function createRenderedMessageBatchPlan(payloads: readonly ReplyPayload[]): RenderedMessageBatchPlan;
/** Pairs reply payloads with their render plan for durable send and live-preview flows. */
export declare function createRenderedMessageBatch(payloads: ReplyPayload[]): RenderedMessageBatch<ReplyPayload>;
