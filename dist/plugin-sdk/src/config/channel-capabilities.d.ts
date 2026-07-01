import type { OpenClawConfig } from "./config.js";
/** Resolves normalized string capabilities for a channel/account config pair. */
export declare function resolveChannelCapabilities(params: {
    cfg?: Partial<OpenClawConfig>;
    channel?: string | null;
    accountId?: string | null;
}): string[] | undefined;
