import type { OpenClawConfig } from "../../../config/types.openclaw.js";
/** Format doctor warnings for open DM policies missing allowFrom wildcards. */
export declare function collectOpenPolicyAllowFromWarnings(params: {
    changes: string[];
    doctorFixCommand: string;
}): string[];
/** Add allowFrom wildcards for open DM policies where channel metadata requires them. */
export declare function maybeRepairOpenPolicyAllowFrom(cfg: OpenClawConfig): {
    config: OpenClawConfig;
    changes: string[];
};
