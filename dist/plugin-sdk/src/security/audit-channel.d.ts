import type { ChannelPlugin } from "../channels/plugins/types.plugin.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecurityAuditFinding } from "./audit.types.js";
/** Collect channel-specific security findings across active channel plugins/accounts. */
export declare function collectChannelSecurityFindings(params: {
    cfg: OpenClawConfig;
    sourceConfig?: OpenClawConfig;
    plugins: ChannelPlugin[];
}): Promise<SecurityAuditFinding[]>;
