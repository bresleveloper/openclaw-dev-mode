import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Copy legacy allowFrom entries into groupAllowFrom where channel metadata permits fallback. */
export declare function maybeRepairGroupAllowFromFallback(cfg: OpenClawConfig): {
    config: OpenClawConfig;
    changes: string[];
};
