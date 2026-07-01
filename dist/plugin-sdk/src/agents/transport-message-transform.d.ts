/**
 * Normalizes transcript messages before provider transport replay. It drops
 * unsafe failed turns, maps tool-call ids across model boundaries, and fills
 * strict provider tool-result gaps when supported.
 */
import type { Api, Context, Model } from "../llm/types.js";
/** Transforms transcript messages into a provider-safe replay context. */
export declare function transformTransportMessages(messages: Context["messages"], model: Model, normalizeToolCallId?: (id: string, targetModel: Model, source: {
    provider: string;
    api: Api;
    model: string;
}) => string, options?: {
    normalizeSameModelToolCallIds?: boolean;
    preserveCrossModelToolCallThoughtSignature?: boolean;
}): Context["messages"];
