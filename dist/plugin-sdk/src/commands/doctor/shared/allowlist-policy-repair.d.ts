import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Restore missing allowFrom entries for allowlist DM policies from persisted pairing stores. */
export declare function maybeRepairAllowlistPolicyAllowFrom(cfg: OpenClawConfig): Promise<{
    config: OpenClawConfig;
    changes: string[];
}>;
