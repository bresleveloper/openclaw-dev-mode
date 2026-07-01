import type { TtsAutoMode } from "../config/types.tts.js";
/** Accepted TTS auto modes from config, prefs, and session-level overrides. */
export declare const TTS_AUTO_MODES: Set<TtsAutoMode>;
/** Normalize an unknown value into a supported TTS auto mode. */
export declare function normalizeTtsAutoMode(value: unknown): TtsAutoMode | undefined;
