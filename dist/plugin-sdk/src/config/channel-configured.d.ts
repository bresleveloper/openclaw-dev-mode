import type { OpenClawConfig } from "./types.openclaw.js";
/** Resolves whether a channel has enough config, env, or plugin state to be considered setup. */
export declare function isChannelConfigured(cfg: OpenClawConfig, channelId: string, env?: NodeJS.ProcessEnv): boolean;
