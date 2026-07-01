import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Resolve the expected Gateway token for service drift checks, or undefined when token auth is inactive. */
export declare function resolveGatewayTokenForDriftCheck(params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
}): Promise<string | undefined>;
