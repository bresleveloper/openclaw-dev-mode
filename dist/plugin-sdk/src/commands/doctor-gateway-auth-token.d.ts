/** Resolves gateway service auth tokens without leaking exec-backed secrets during install. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
/**
 * Resolves the token a managed gateway service can receive at install/update time.
 *
 * Exec SecretRefs are skipped by default because the service installer cannot safely evaluate
 * arbitrary commands; OPENCLAW_GATEWAY_TOKEN remains an explicit env override.
 */
export declare function resolveGatewayAuthTokenForService(cfg: OpenClawConfig, env: NodeJS.ProcessEnv, options?: {
    allowExecSecretRefs?: boolean;
}): Promise<{
    token?: string;
    unavailableReason?: string;
}>;
