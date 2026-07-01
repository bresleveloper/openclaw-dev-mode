/**
 * Chooses a configured provider/model fallback when defaults are absent from
 * the user's model config.
 */
import type { OpenClawConfig } from "../config/types.js";
type ProviderModelRef = {
    provider: string;
    model: string;
};
/** Resolve the first configured provider/model that can replace a missing default. */
export declare function resolveConfiguredProviderFallback(params: {
    cfg: Pick<OpenClawConfig, "models">;
    defaultProvider: string;
    defaultModel?: string;
}): ProviderModelRef | null;
export {};
