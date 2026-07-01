import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Canonical Gateway config paths whose values may be plaintext or secret refs. */
export type SupportedGatewaySecretInputPath = "gateway.auth.token" | "gateway.auth.password" | "gateway.remote.token" | "gateway.remote.password";
/** Stable scan order for Gateway secret-ref credential selection. */
export declare const ALL_GATEWAY_SECRET_INPUT_PATHS: SupportedGatewaySecretInputPath[];
/** Narrow an arbitrary error/config path to one of the supported Gateway secret inputs. */
export declare function isSupportedGatewaySecretInputPath(path: string): path is SupportedGatewaySecretInputPath;
/** Read a Gateway secret input without assuming whether it is plaintext, a ref, or absent. */
export declare function readGatewaySecretInputValue(config: OpenClawConfig, path: SupportedGatewaySecretInputPath): unknown;
/** Replace one Gateway secret input with its resolved plaintext value on a cloned config. */
export declare function assignResolvedGatewaySecretInput(params: {
    config: OpenClawConfig;
    path: SupportedGatewaySecretInputPath;
    value: string | undefined;
}): void;
/** Distinguish token paths from password paths for auth-mode precedence checks. */
export declare function isTokenGatewaySecretInputPath(path: SupportedGatewaySecretInputPath): boolean;
