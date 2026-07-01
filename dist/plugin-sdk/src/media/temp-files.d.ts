/** Best-effort temp-file cleanup helper for optional paths from media conversion flows. */
export declare function unlinkIfExists(filePath: string | null | undefined): Promise<void>;
