/**
 * Channel exposure helpers.
 *
 * Resolves whether channel metadata should appear in configured, setup, and docs views.
 */
import type { ChannelMeta } from "./types.core.js";
/**
 * Resolves where a channel should appear in configured, setup, and docs views.
 */
export declare function resolveChannelExposure(meta: Pick<ChannelMeta, "exposure" | "showConfigured" | "showInSetup">): {
    configured: boolean;
    setup: boolean;
    docs: boolean;
};
/**
 * Returns whether the channel should be listed for already configured agents.
 */
export declare function isChannelVisibleInConfiguredLists(meta: Pick<ChannelMeta, "exposure" | "showConfigured" | "showInSetup">): boolean;
/**
 * Returns whether the channel should be offered during setup/onboarding.
 */
export declare function isChannelVisibleInSetup(meta: Pick<ChannelMeta, "exposure" | "showConfigured" | "showInSetup">): boolean;
