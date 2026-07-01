import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ChannelPlugin } from "./types.plugin.js";
/**
 * Native command/skill auto-enable defaults exposed by channel manifests.
 */
export type ChannelCommandDefaults = Pick<NonNullable<ChannelPlugin["commands"]>, "nativeCommandsAutoEnabled" | "nativeSkillsAutoEnabled">;
/**
 * Returns whether a manifest channel id is safe for own-property lookup.
 */
export declare function isSafeManifestChannelId(channelId: string): boolean;
/**
 * Reads an own record property while blocking prototype-polluting keys.
 */
export declare function readOwnRecordValue(record: Record<string, unknown>, key: string): unknown;
/**
 * Normalizes manifest command defaults down to supported boolean fields.
 */
export declare function normalizeChannelCommandDefaults(value: ChannelCommandDefaults | undefined): ChannelCommandDefaults | undefined;
/**
 * Resolves command defaults from enabled installed plugin metadata without loading plugins.
 */
export declare function resolveReadOnlyChannelCommandDefaults(channelId: string, options: {
    env?: NodeJS.ProcessEnv;
    stateDir?: string;
    workspaceDir?: string;
    config: OpenClawConfig;
}): ChannelCommandDefaults | undefined;
