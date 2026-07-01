import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Collects the effective runtime capabilities for a channel/account pair. */
export declare function collectRuntimeChannelCapabilities(params: {
    cfg?: OpenClawConfig;
    channel?: string | null;
    accountId?: string | null;
}): string[] | undefined;
