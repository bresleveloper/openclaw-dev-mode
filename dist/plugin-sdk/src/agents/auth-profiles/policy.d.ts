/**
 * Auth profile policy validation.
 * Rejects SecretRef-backed OAuth material because OAuth credentials are mutable
 * runtime state and must stay directly persisted by refresh flows.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthProfileStore } from "./types.js";
/** Throws when OAuth profiles contain unsupported SecretRef fields. */
export declare function assertNoOAuthSecretRefPolicyViolations(params: {
    store: AuthProfileStore;
    cfg?: OpenClawConfig;
    profileIds?: Iterable<string>;
    context?: string;
}): void;
