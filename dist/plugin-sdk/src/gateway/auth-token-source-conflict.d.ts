import type { OpenClawConfig } from "../config/types.openclaw.js";
type GatewayAuthTokenSourceConflict = {
    checkId: "gateway.env_token_overrides_config";
    title: string;
    detail: string;
    remediation: string;
    warningLines: string[];
    diagnostic: string;
};
/** Returns a warning when env token precedence can diverge from configured gateway auth. */
export declare function resolveGatewayAuthTokenSourceConflict(params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
}): GatewayAuthTokenSourceConflict | null;
export {};
