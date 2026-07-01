/**
 * Resolves why an auth profile failed during provider auth selection.
 */
import type { AuthProfileFailureReason } from "../../auth-profiles/types.js";
import type { FailoverReason } from "../../embedded-agent-helpers/types.js";
import type { AuthProfileFailurePolicy } from "./auth-profile-failure-policy.types.js";
/**
 * Returns the subset of failover reasons that should affect shared auth-profile
 * health. Local helper failures and request-shape/transport outcomes stay
 * session-local so one bad transcript or connection does not cool down an
 * otherwise healthy provider profile.
 */
export declare function resolveAuthProfileFailureReason(params: {
    failoverReason: FailoverReason | null;
    providerStarted?: boolean;
    transientRateLimit?: boolean;
    policy?: AuthProfileFailurePolicy;
}): AuthProfileFailureReason | null;
