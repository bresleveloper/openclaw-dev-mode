import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Applies a primary model to agent defaults while preserving model fallback metadata. */
export declare function applyPrimaryModel(cfg: OpenClawConfig, model: string): OpenClawConfig;
