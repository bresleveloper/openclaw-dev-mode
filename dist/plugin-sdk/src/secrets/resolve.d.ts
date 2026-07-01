import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecretRef, SecretRefSource } from "../config/types.secrets.js";
import { type PluginManifestRegistry } from "../plugins/manifest-registry.js";
import type { SecretRefResolveCache } from "./resolve-types.js";
export type { SecretRefResolveCache } from "./resolve-types.js";
type ResolveSecretRefOptions = {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    cache?: SecretRefResolveCache;
    manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
};
/** Error for failures that affect an entire configured secret provider. */
/** Error emitted when a configured secret provider cannot resolve a ref. */
export declare class SecretProviderResolutionError extends Error {
    readonly scope: "provider";
    readonly source: SecretRefSource;
    readonly provider: string;
    constructor(params: {
        source: SecretRefSource;
        provider: string;
        message: string;
        cause?: unknown;
    });
}
/** Error for failures limited to one SecretRef id under a provider. */
export declare class SecretRefResolutionError extends Error {
    readonly scope: "ref";
    readonly source: SecretRefSource;
    readonly provider: string;
    readonly refId: string;
    constructor(params: {
        source: SecretRefSource;
        provider: string;
        refId: string;
        message: string;
        cause?: unknown;
    });
}
/** Type guard for provider-scoped secret resolution failures. */
export declare function isProviderScopedSecretResolutionError(value: unknown): value is SecretProviderResolutionError;
/** Resolves a batch of SecretRefs, grouped by provider for bounded provider concurrency. */
export declare function resolveSecretRefValues(refs: SecretRef[], options: ResolveSecretRefOptions): Promise<Map<string, unknown>>;
/** Resolves one SecretRef, using the optional shared runtime cache. */
/** Resolves one SecretRef to an unknown value using configured provider state. */
export declare function resolveSecretRefValue(ref: SecretRef, options: ResolveSecretRefOptions): Promise<unknown>;
/** Resolves one SecretRef and requires a non-empty string result. */
export declare function resolveSecretRefString(ref: SecretRef, options: ResolveSecretRefOptions): Promise<string>;
