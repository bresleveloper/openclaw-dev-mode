/** File extensions accepted by channel voice-message upload paths. */
export declare const VOICE_MESSAGE_AUDIO_EXTENSIONS: Set<string>;
/** MIME types compatible with voice-message upload paths. */
export declare const VOICE_MESSAGE_MIME_TYPES: Set<string>;
/** Checks whether MIME type or filename is compatible with voice-message delivery. */
export declare function isVoiceMessageCompatibleAudio(opts: {
    contentType?: string | null;
    fileName?: string | null;
}): boolean;
/**
 * Backward-compatible alias for voice-message audio compatibility checks.
 *
 * @deprecated Use isVoiceMessageCompatibleAudio.
 */
export declare function isVoiceCompatibleAudio(opts: {
    contentType?: string | null;
    fileName?: string | null;
}): boolean;
