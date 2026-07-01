import type { OpenClawConfig } from "./config.js";
/** Returns a channel config object when `channels.<id>` is present and object-shaped. */
export declare function resolveChannelConfigRecord(cfg: OpenClawConfig, channelId: string): Record<string, unknown> | null;
/** Checks whether a shallow channel config contains activation-relevant values. */
export declare function hasMeaningfulChannelConfigShallow(value: unknown): boolean;
/** Detects static channel configuration from known env vars or `channels.<id>` config. */
export declare function isStaticallyChannelConfigured(cfg: OpenClawConfig, channelId: string, env?: NodeJS.ProcessEnv): boolean;
