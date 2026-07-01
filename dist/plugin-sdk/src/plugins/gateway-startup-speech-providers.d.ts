import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Normalizes configured TTS provider ids for startup plugin selection. */
export declare function normalizeConfiguredSpeechProviderIdForStartup(value: unknown): string | undefined;
/** Collects TTS provider ids referenced by root, agent, channel, account, and plugin config. */
export declare function collectConfiguredSpeechProviderIds(config: OpenClawConfig): ReadonlySet<string>;
