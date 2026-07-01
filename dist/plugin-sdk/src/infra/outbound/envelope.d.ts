import type { ReplyPayload } from "../../auto-reply/types.js";
import type { OutboundDeliveryJson } from "./format.js";
import { type OutboundPayloadJson } from "./payloads.js";
/** Structured result returned by outbound helpers when payloads/meta wrap delivery data. */
export type OutboundResultEnvelope = {
    payloads?: OutboundPayloadJson[];
    meta?: unknown;
    delivery?: OutboundDeliveryJson;
};
type BuildEnvelopeParams = {
    payloads?: readonly ReplyPayload[] | readonly OutboundPayloadJson[];
    meta?: unknown;
    delivery?: OutboundDeliveryJson;
    flattenDelivery?: boolean;
};
/** Builds the outbound result envelope, flattening plain delivery-only results by default. */
export declare function buildOutboundResultEnvelope(params: BuildEnvelopeParams): OutboundResultEnvelope | OutboundDeliveryJson;
export {};
