import type { OpenClawConfig } from "../config/types.js";
import type { TtsConfig, TtsMode } from "../config/types.tts.js";
export { normalizeTtsAutoMode } from "./tts-auto-mode.js";
/** Routing context used to layer global, agent, channel, and account TTS config. */
export type TtsConfigResolutionContext = {
    agentId?: string;
    channelId?: string;
    accountId?: string;
};
/** Resolve effective TTS config after applying global, agent, channel, and account layers. */
export declare function resolveEffectiveTtsConfig(cfg: OpenClawConfig, contextOrAgentId?: string | TtsConfigResolutionContext): TtsConfig;
/** Resolve the configured TTS mode, defaulting to final-answer synthesis. */
export declare function resolveConfiguredTtsMode(cfg: OpenClawConfig, contextOrAgentId?: string | TtsConfigResolutionContext): TtsMode;
/** Return whether this payload should attempt TTS based on session, prefs, and config. */
export declare function shouldAttemptTtsPayload(params: {
    cfg: OpenClawConfig;
    ttsAuto?: string;
    agentId?: string;
    channelId?: string;
    accountId?: string;
}): boolean;
/** Return whether TTS directive markup should be stripped from user-visible text. */
export declare function shouldCleanTtsDirectiveText(params: {
    cfg: OpenClawConfig;
    ttsAuto?: string;
    agentId?: string;
    channelId?: string;
    accountId?: string;
}): boolean;
