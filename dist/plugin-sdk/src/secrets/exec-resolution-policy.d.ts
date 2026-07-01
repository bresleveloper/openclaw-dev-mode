/** Applies exec-ref resolution policy for audit/apply modes. */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { SecretRef } from "../config/types.secrets.js";
/**
 * Splits refs by whether the current audit/apply mode is allowed to execute secret providers.
 */
export declare function selectRefsForExecPolicy(params: {
    refs: SecretRef[];
    allowExec: boolean;
}): {
    refsToResolve: SecretRef[];
    skippedExecRefs: SecretRef[];
};
/**
 * Returns static validation errors for skipped exec refs without resolving the provider command.
 */
export declare function getSkippedExecRefStaticError(params: {
    ref: SecretRef;
    config: OpenClawConfig;
}): string | null;
