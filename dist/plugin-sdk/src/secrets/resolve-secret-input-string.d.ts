/** Resolves inline string or SecretRef inputs into normalized secret strings. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type SecretRef } from "../config/types.secrets.js";
type SecretDefaults = NonNullable<OpenClawConfig["secrets"]>["defaults"];
/**
 * Resolves a config value that may be either an inline string or a SecretRef object.
 *
 * Plugin and gateway callers can override normalization and convert SecretRef resolution errors
 * into surface-specific failures without duplicating provider lookup behavior.
 */
export declare function resolveSecretInputString(params: {
    config: OpenClawConfig;
    /** Inline string, SecretInput object, or SecretRef object from config/plugin settings. */
    value: unknown;
    env: NodeJS.ProcessEnv;
    /** SecretRef defaults used when `value` omits source/provider aliases. */
    defaults?: SecretDefaults;
    /** Surface-specific normalization for resolved or inline values. */
    normalize?: (value: unknown) => string | undefined;
    /** Converts provider resolution failures into caller-specific errors. */
    onResolveRefError?: (error: unknown, ref: SecretRef) => never;
}): Promise<string | undefined>;
export {};
