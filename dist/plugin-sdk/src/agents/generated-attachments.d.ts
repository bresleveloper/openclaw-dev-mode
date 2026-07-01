export type AgentGeneratedAttachment = {
    type?: "image" | "audio" | "video" | "file";
    path?: string;
    url?: string;
    mediaUrl?: string;
    filePath?: string;
    mimeType?: string;
    name?: string;
};
/** Return unique media URLs/paths from generated attachments. */
export declare function mediaUrlsFromGeneratedAttachments(attachments: readonly AgentGeneratedAttachment[] | undefined): string[];
/** Format generated attachment metadata as prompt-safe text lines. */
export declare function formatGeneratedAttachmentLines(attachments: readonly AgentGeneratedAttachment[] | undefined): string[];
