/**
 * Merges media payloads discovered from attempt tool results.
 */
import type { SourceReplyDeliveryMode } from "../../../auto-reply/get-reply-options.types.js";
import type { EmbeddedAgentRunResult } from "../types.js";
/** Channel payload shape produced by embedded runs after auto-reply normalization. */
type EmbeddedRunPayload = NonNullable<EmbeddedAgentRunResult["payloads"]>[number];
/**
 * Merges media emitted by tools into the channel payloads produced by the
 * assistant turn. The first non-reasoning reply owns the media so text and
 * attachments stay together; metadata is preserved for delivery bookkeeping.
 */
export declare function mergeAttemptToolMediaPayloads(params: {
    payloads?: EmbeddedRunPayload[];
    toolMediaUrls?: string[];
    toolAudioAsVoice?: boolean;
    toolTrustedLocalMedia?: boolean;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
}): EmbeddedRunPayload[] | undefined;
export {};
