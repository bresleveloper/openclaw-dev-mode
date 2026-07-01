import { normalizeOptionalString } from "../../packages/normalization-core/src/string-coerce.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type GatewayCredentialInputPath = "gateway.auth.token" | "gateway.auth.password" | "gateway.remote.token" | "gateway.remote.password";
type GatewayConfiguredCredentialInput = {
    path: GatewayCredentialInputPath;
    configured: boolean;
    value?: string;
    refPath?: GatewayCredentialInputPath;
    hasSecretRef: boolean;
};
/** Precomputed Gateway credential surfaces used by startup, secret resolution, and clients. */
export type GatewayCredentialPlan = {
    configuredMode: "local" | "remote";
    authMode?: string;
    envToken?: string;
    envPassword?: string;
    localToken: GatewayConfiguredCredentialInput;
    localPassword: GatewayConfiguredCredentialInput;
    remoteToken: GatewayConfiguredCredentialInput;
    remotePassword: GatewayConfiguredCredentialInput;
    localTokenCanWin: boolean;
    localPasswordCanWin: boolean;
    localTokenSurfaceActive: boolean;
    tokenCanWin: boolean;
    passwordCanWin: boolean;
    remoteMode: boolean;
    remoteUrlConfigured: boolean;
    tailscaleRemoteExposure: boolean;
    remoteConfiguredSurface: boolean;
    remoteTokenFallbackActive: boolean;
    remoteTokenActive: boolean;
    remotePasswordFallbackActive: boolean;
    remotePasswordActive: boolean;
};
type GatewaySecretDefaults = NonNullable<OpenClawConfig["secrets"]>["defaults"];
/** Normalize optional Gateway credential strings to nonempty values. */
export declare const trimToUndefined: typeof normalizeOptionalString;
/**
 * Like trimToUndefined but also rejects unresolved env var placeholders (e.g. `${VAR}`).
 * This prevents literal placeholder strings like `${OPENCLAW_GATEWAY_TOKEN}` from being
 * accepted as valid credentials when the referenced env var is missing.
 * Note: legitimate credential values containing literal `${UPPER_CASE}` patterns will
 * also be rejected, but this is an extremely unlikely edge case.
 */
export declare function trimCredentialToUndefined(value: unknown): string | undefined;
/** True when the process env supplies a nonempty Gateway token candidate. */
export declare function hasGatewayTokenEnvCandidate(env?: NodeJS.ProcessEnv): boolean;
/** True when the process env supplies a nonempty Gateway password candidate. */
export declare function hasGatewayPasswordEnvCandidate(env?: NodeJS.ProcessEnv): boolean;
/** Build the shared credential plan for Gateway startup, local auth, and remote client auth. */
export declare function createGatewayCredentialPlan(params: {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    defaults?: GatewaySecretDefaults;
}): GatewayCredentialPlan;
export {};
