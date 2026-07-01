import type { GatewayAuthConfig } from "../config/types.gateway.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type SupportedGatewaySecretInputPath } from "./secret-input-paths.js";
type GatewayAuthSecretInputPath = Extract<SupportedGatewaySecretInputPath, "gateway.auth.token" | "gateway.auth.password">;
type GatewayAuthSecretRefResolutionParams = {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    mode?: GatewayAuthConfig["mode"];
    hasPasswordCandidate: boolean;
    hasTokenCandidate: boolean;
};
/** Check whether a local Gateway auth input is configured directly or through defaults. */
export declare function hasConfiguredGatewayAuthSecretInput(cfg: OpenClawConfig, path: GatewayAuthSecretInputPath): boolean;
/** Check whether active local Gateway auth refs can be read without invoking exec providers. */
export declare function canMaterializeGatewayAuthSecretRefsWithoutExec(params: GatewayAuthSecretRefResolutionParams): boolean;
/** Resolve the Gateway auth token ref only when token auth can use it. */
export declare function resolveGatewayTokenSecretRefValue(params: GatewayAuthSecretRefResolutionParams): Promise<string | undefined>;
/** Resolve the Gateway auth password ref only when password auth can use it. */
export declare function resolveGatewayPasswordSecretRefValue(params: GatewayAuthSecretRefResolutionParams): Promise<string | undefined>;
/** Materialize active local Gateway auth secret refs on a cloned config. */
export declare function materializeGatewayAuthSecretRefs(params: GatewayAuthSecretRefResolutionParams): Promise<OpenClawConfig>;
export {};
