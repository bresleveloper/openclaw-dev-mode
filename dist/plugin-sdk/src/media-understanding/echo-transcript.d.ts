import type { MsgContext } from "../auto-reply/templating.js";
import type { OpenClawConfig } from "../config/types.js";
/** Default operator-visible transcript echo format for preflight audio transcription. */
export declare const DEFAULT_ECHO_TRANSCRIPT_FORMAT = "\uD83D\uDCDD \"{transcript}\"";
/** Sends a best-effort transcript echo back to the originating deliverable chat. */
export declare function sendTranscriptEcho(params: {
    ctx: MsgContext;
    cfg: OpenClawConfig;
    transcript: string;
    format?: string;
}): Promise<void>;
