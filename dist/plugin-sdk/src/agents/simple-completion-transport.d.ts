/**
 * Simple completion transport preparation.
 *
 * Registers provider-specific stream functions and rewrites models that need OpenClaw-managed transport semantics.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { Api, Model } from "../llm/types.js";
export declare function prepareModelForSimpleCompletion<TApi extends Api>(params: {
    model: Model<TApi>;
    cfg?: OpenClawConfig;
}): Model;
