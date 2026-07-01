import type { OpenClawConfig } from "../config/types.openclaw.js";
export type GatewayProbeTargetResolution = {
    gatewayMode: "local" | "remote";
    mode: "local" | "remote";
    remoteUrlMissing: boolean;
};
/** Resolves whether gateway probe commands should target local or remote gateway. */
export declare function resolveGatewayProbeTarget(cfg: OpenClawConfig): GatewayProbeTargetResolution;
