import type { MsgContext } from "../auto-reply/templating.js";
import type { MediaAttachment } from "./types.js";
/** Normalizes a local attachment path while rejecting remote file URLs and Windows UNC paths. */
export declare function normalizeAttachmentPath(raw?: string | null): string | undefined;
/** Flattens legacy single-value and array media fields into indexed attachment records. */
export declare function normalizeAttachments(ctx: MsgContext): MediaAttachment[];
/** Classifies an attachment by MIME first, then by filename/URL extension fallback. */
export declare function resolveAttachmentKind(attachment: MediaAttachment): "image" | "audio" | "video" | "document" | "unknown";
/** Returns true when the attachment is classified as video media. */
export declare function isVideoAttachment(attachment: MediaAttachment): boolean;
/** Returns true when the attachment is classified as audio media. */
export declare function isAudioAttachment(attachment: MediaAttachment): boolean;
/** Returns true when the attachment is classified as image media. */
export declare function isImageAttachment(attachment: MediaAttachment): boolean;
