/** Normalizes image bytes before provider execution, converting HEIC/HEIF inputs to JPEG. */
export declare function normalizeImageDescriptionInput(params: {
    buffer: Buffer;
    fileName?: string;
    mime?: string;
    maxBytes?: number;
}): Promise<{
    buffer: Buffer;
    mime?: string;
}>;
