import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ChannelMatchSource } from "./channel-config.js";
/** Resolved model override for a channel conversation plus the config key that matched. */
type ChannelModelOverride = {
    channel: string;
    model: string;
    matchKey?: string;
    matchSource?: ChannelMatchSource;
};
type ChannelModelOverrideParams = {
    cfg: OpenClawConfig;
    channel?: string | null;
    groupId?: string | null;
    groupChatType?: string | null;
    groupChannel?: string | null;
    groupSubject?: string | null;
    parentSessionKey?: string | null;
    directUserIds?: (string | null | undefined)[];
};
/** Resolves a channel-scoped model override from direct, parent, and wildcard config entries. */
export declare function resolveChannelModelOverride(params: ChannelModelOverrideParams): ChannelModelOverride | null;
export {};
