import type { OpenClawConfig } from "../config/config.js";
import type { SecurityAuditFinding } from "./audit.types.js";
/** Collect supply-chain and reachable-tool findings for installed plugins and hook packs. */
export declare function collectPluginsTrustFindings(params: {
    cfg: OpenClawConfig;
    stateDir: string;
}): Promise<SecurityAuditFinding[]>;
