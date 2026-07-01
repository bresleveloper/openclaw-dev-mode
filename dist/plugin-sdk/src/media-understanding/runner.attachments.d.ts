import type { MsgContext } from "../auto-reply/templating.js";
import { MediaAttachmentCache, type MediaAttachmentCacheOptions } from "./attachments.js";
import type { MediaAttachment } from "./types.js";
/** Normalizes message context media fields for the media-understanding runner. */
export declare function normalizeMediaAttachments(ctx: MsgContext): MediaAttachment[];
/** Creates the lazy attachment cache used by image, audio, video, and document providers. */
export declare function createMediaAttachmentCache(attachments: MediaAttachment[], options?: MediaAttachmentCacheOptions): MediaAttachmentCache;
