/** Validated payload returned by `nodes screen record` RPC calls. */
export type ScreenRecordPayload = {
    format: string;
    base64: string;
    durationMs?: number;
    fps?: number;
    screenIndex?: number;
    hasAudio?: boolean;
};
/** Validate and normalize an unknown screen-record payload. */
export declare function parseScreenRecordPayload(value: unknown): ScreenRecordPayload;
/** Build the temp output path for a screen recording artifact. */
export declare function screenRecordTempPath(opts: {
    ext: string;
    tmpDir?: string;
    id?: string;
}): string;
/** Decode and write a screen recording payload to disk. */
export declare function writeScreenRecordToFile(filePath: string, base64: string, opts?: {
    maxBytes?: number;
}): Promise<{
    path: string;
    bytes: number;
}>;
/** Validated payload returned by `nodes screen snapshot` RPC calls. */
export type ScreenSnapshotPayload = {
    format: string;
    base64: string;
    screenIndex?: number;
    width?: number;
    height?: number;
};
/** Validate and normalize an unknown screen-snapshot payload. */
export declare function parseScreenSnapshotPayload(value: unknown): ScreenSnapshotPayload;
/** Build the temp output path for a screen snapshot artifact. */
export declare function screenSnapshotTempPath(opts: {
    ext?: string;
    tmpDir?: string;
    id?: string;
}): string;
/** Decode and write a screen snapshot payload to disk. */
export declare function writeScreenSnapshotToFile(filePath: string, base64: string, opts?: {
    maxBytes?: number;
}): Promise<{
    path: string;
    bytes: number;
}>;
