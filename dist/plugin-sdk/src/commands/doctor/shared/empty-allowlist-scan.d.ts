import type { ChannelDoctorEmptyAllowlistAccountContext } from "../../../channels/plugins/types.adapters.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
type ScanEmptyAllowlistPolicyWarningsParams = {
    doctorFixCommand: string;
    extraWarningsForAccount?: (params: ChannelDoctorEmptyAllowlistAccountContext) => string[];
    shouldSkipDefaultEmptyGroupAllowlistWarning?: (params: ChannelDoctorEmptyAllowlistAccountContext) => boolean;
};
/** Scan all configured channels/accounts for empty allowlist policy warnings. */
export declare function scanEmptyAllowlistPolicyWarnings(cfg: OpenClawConfig, params: ScanEmptyAllowlistPolicyWarningsParams): string[];
export {};
