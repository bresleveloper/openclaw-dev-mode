import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Disable plugin entries and clear config when plugin validation marks their config invalid. */
export declare function maybeRepairInvalidPluginConfig(cfg: OpenClawConfig): {
    config: OpenClawConfig;
    changes: string[];
};
