import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Normalize current config through core, plugin setup, channel, and secret-ref migrations. */
export declare function normalizeCompatibilityConfigValues(cfg: OpenClawConfig): {
    config: OpenClawConfig;
    changes: string[];
};
