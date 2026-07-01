import type { ImageContent } from "../../../llm/types.js";
import type { PromptImageOrderEntry } from "../../../media/prompt-image-order.js";
import type { SandboxFsBridge } from "../../sandbox/fs-bridge.js";
/**
 * Result of detecting an image reference in text.
 */
interface DetectedImageRef {
    /** The raw matched string from the prompt */
    raw: string;
    /** The type of reference */
    type: "path" | "media-uri";
    /** The resolved/normalized path, or the raw media URI for media-uri type */
    resolved: string;
}
/**
 * Rebuilds the model image array in the same order the prompt saw them:
 * existing inline images and offloaded attachments follow `imageOrder`, then
 * explicit prompt path/media refs are appended after attachment-owned images.
 */
export declare function mergePromptAttachmentImages(params: {
    imageOrder?: PromptImageOrderEntry[];
    existingImages?: ImageContent[];
    offloadedImages?: Array<ImageContent | null>;
    promptRefImages?: ImageContent[];
}): ImageContent[];
/**
 * Separates image refs that came from attachment boilerplate from refs the user
 * actually typed into the prompt. Attachment refs are already represented by
 * existing/offloaded image content and should not be loaded a second time.
 */
export declare function splitPromptAndAttachmentRefs(params: {
    prompt: string;
    refs: DetectedImageRef[];
    imageOrder?: PromptImageOrderEntry[];
    existingImageCount?: number;
}): {
    promptRefs: DetectedImageRef[];
    attachmentRefs: DetectedImageRef[];
};
/**
 * Detects image references in a user prompt.
 *
 * Patterns detected:
 * - Absolute paths: /path/to/image.png
 * - Relative paths: ./image.png, ../images/photo.jpg
 * - Home paths: ~/Pictures/screenshot.png
 * - file:// URLs: file:///path/to/image.png
 * - Message attachments: [Image: source: /path/to/image.jpg]
 * - Gateway claim-check URIs: [media attached: media://inbound/<id>]
 *
 * @param prompt The user prompt text to scan
 * @returns Array of detected image references
 */
export declare function detectImageReferences(prompt: string): DetectedImageRef[];
/**
 * Resolves and loads one detected image ref into model-ready image content.
 * Sandbox refs must validate through the bridge; non-sandbox refs can resolve
 * media claim-checks and workspace-relative paths before loadWebMedia enforces
 * local-root and size limits.
 */
export declare function loadImageFromRef(ref: DetectedImageRef, workspaceDir: string, options?: {
    maxBytes?: number;
    workspaceOnly?: boolean;
    localRoots?: readonly string[];
    sandbox?: {
        root: string;
        bridge: SandboxFsBridge;
    };
}): Promise<ImageContent | null>;
/** Returns whether the resolved model advertises native image input support. */
export declare function modelSupportsImages(model: {
    input?: string[];
}): boolean;
/**
 * Detects, loads, orders, and sanitizes the image payload for one prompt turn.
 * Attachment boilerplate is separated from user-authored refs so existing
 * inline images and offloaded claim-check images are not loaded twice.
 */
export declare function detectAndLoadPromptImages(params: {
    prompt: string;
    workspaceDir: string;
    model: {
        input?: string[];
    };
    existingImages?: ImageContent[];
    imageOrder?: PromptImageOrderEntry[];
    maxBytes?: number;
    maxDimensionPx?: number;
    workspaceOnly?: boolean;
    localRoots?: readonly string[];
    sandbox?: {
        root: string;
        bridge: SandboxFsBridge;
    };
}): Promise<{
    /** Images for the current prompt (existingImages + detected in current prompt) */
    images: ImageContent[];
    detectedRefs: DetectedImageRef[];
    loadedCount: number;
    skippedCount: number;
}>;
export {};
