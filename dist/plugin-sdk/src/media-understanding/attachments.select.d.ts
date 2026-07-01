import type { MediaUnderstandingAttachmentsConfig } from "../config/types.tools.js";
import type { MediaAttachment, MediaUnderstandingCapability } from "./types.js";
/** Selects attachments for a media-understanding capability under configured ordering limits. */
export declare function selectAttachments(params: {
    capability: MediaUnderstandingCapability;
    attachments: MediaAttachment[];
    policy?: MediaUnderstandingAttachmentsConfig;
}): MediaAttachment[];
