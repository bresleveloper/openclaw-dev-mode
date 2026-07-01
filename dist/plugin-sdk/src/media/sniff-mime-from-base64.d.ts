/** Sniffs a MIME type from canonical base64 without decoding the full payload. */
export declare function sniffMimeFromBase64(base64: string): Promise<string | undefined>;
