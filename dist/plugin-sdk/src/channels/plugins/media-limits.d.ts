/**
 * Channel media limit resolver.
 *
 * Combines account-scoped channel media limits with agent default limits.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
/** Resolves channel media limit bytes from account-specific config or agent defaults. */
export declare function resolveChannelMediaMaxBytes(params: {
    cfg: OpenClawConfig;
    resolveChannelLimitMb: (params: {
        cfg: OpenClawConfig;
        accountId: string;
    }) => number | undefined;
    accountId?: string | null;
}): number | undefined;
