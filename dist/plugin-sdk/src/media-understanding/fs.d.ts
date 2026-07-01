/** Safely checks optional media file paths without throwing on empty input. */
export declare function fileExists(filePath?: string | null): Promise<boolean>;
