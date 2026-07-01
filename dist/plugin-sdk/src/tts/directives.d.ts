import type { OpenClawConfig } from "../config/types.js";
import type { SpeechProviderPlugin } from "../plugins/types.js";
import type { SpeechModelOverridePolicy, SpeechProviderConfig, TtsDirectiveParseResult } from "./provider-types.js";
type ParseTtsDirectiveOptions = {
    cfg?: OpenClawConfig;
    providers?: readonly SpeechProviderPlugin[];
    providerConfigs?: Record<string, SpeechProviderConfig>;
    preferredProviderId?: string;
};
/** Streaming cleaner used to strip TTS tags before final text parsing is available. */
export type TtsDirectiveTextStreamCleaner = {
    push: (text: string) => string;
    flush: () => string;
    hasBufferedDirectiveText: () => boolean;
};
/** Create an incremental cleaner for hiding [[tts:*]] directive text while streaming. */
export declare function createTtsDirectiveTextStreamCleaner(): TtsDirectiveTextStreamCleaner;
/** Parse TTS directives from final message text, leaving markdown code spans unchanged. */
export declare function parseTtsDirectives(text: string, policy: SpeechModelOverridePolicy, options?: ParseTtsDirectiveOptions): TtsDirectiveParseResult;
export {};
