/**
 * User-facing auth-profile failure copy.
 * Maps failover reasons into provider-specific recovery guidance while keeping
 * raw error detail as a short diagnostic suffix.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { FailoverReason } from "../embedded-agent-helpers/types.js";
type AuthProfileFailureCopyParams = {
    reason: FailoverReason;
    provider: string;
    /**
     * True when the failure was reached because every configured profile is in
     * cooldown / blocked. False when an attempt to use a specific profile threw
     * (e.g. credential lookup failed). The two paths produce different copy
     * because only the cooldown case implies "wait or rotate"; the other case
     * implies "the credential itself is broken".
     */
    allInCooldown: boolean;
    /**
     * Underlying error that triggered the failover, if any. Used to append a
     * short diagnostic suffix and to fall back to the original message when no
     * structured recovery copy applies.
     */
    cause?: unknown;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
};
/**
 * Single source of truth for user-facing copy when an auth-profile rotation
 * fails. Composes a reason-specific sentence with an actionable next-step
 * derived from the provider's plugin manifest (`buildProviderAuthRecoveryHint`).
 *
 * Falls back to the underlying error's text when the reason maps to nothing
 * actionable, so we never produce worse copy than the raw error.
 */
export declare function formatAuthProfileFailureMessage(params: AuthProfileFailureCopyParams): string;
export {};
