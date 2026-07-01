/** Collects Gateway auth secret surfaces for secrets runtime preparation. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecretDefaults } from "./runtime-shared.js";
/** Stable evaluation order for gateway credential surfaces that may hold SecretRefs. */
export declare const GATEWAY_AUTH_SURFACE_PATHS: readonly ["gateway.auth.token", "gateway.auth.password", "gateway.remote.token", "gateway.remote.password"];
export type GatewayAuthSurfacePath = (typeof GATEWAY_AUTH_SURFACE_PATHS)[number];
/** Active/inactive decision for one gateway credential SecretRef surface. */
export type GatewayAuthSurfaceState = {
    path: GatewayAuthSurfacePath;
    active: boolean;
    reason: string;
    hasSecretRef: boolean;
};
/** Complete state map keyed by every known gateway credential surface path. */
export type GatewayAuthSurfaceStateMap = Record<GatewayAuthSurfacePath, GatewayAuthSurfaceState>;
/** Evaluates which gateway credential SecretRefs can affect the effective auth plan. */
export declare function evaluateGatewayAuthSurfaceStates(params: {
    config: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    defaults?: SecretDefaults;
}): GatewayAuthSurfaceStateMap;
