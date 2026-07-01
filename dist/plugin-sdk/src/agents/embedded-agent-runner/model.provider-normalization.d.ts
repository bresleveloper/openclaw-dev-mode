/**
 * Normalizes resolved provider/model ids on model records.
 */
import type { Model } from "../../llm/types.js";
/**
 * Applies provider compatibility normalization to a resolved model record.
 */
export declare function normalizeResolvedProviderModel(params: {
    provider: string;
    model: Model;
}): Model;
