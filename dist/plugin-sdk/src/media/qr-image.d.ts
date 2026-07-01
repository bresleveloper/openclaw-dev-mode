type QrPngRenderOptions = {
    scale?: number;
    marginModules?: number;
};
/** Temp-file write options kept to filename segments so callers cannot choose parent paths. */
type QrPngTempFileOptions = QrPngRenderOptions & {
    tmpRoot: string;
    dirPrefix: string;
    fileName?: string;
};
type QrPngTempFile = {
    filePath: string;
    dirPath: string;
    mediaLocalRoots: string[];
};
/** Renders QR text as raw PNG base64 after validating bounded renderer options. */
export declare function renderQrPngBase64(input: string, opts?: QrPngRenderOptions): Promise<string>;
/** Wraps PNG base64 in the exact data URL prefix expected by chat/media callers. */
export declare function formatQrPngDataUrl(base64: string): string;
/** Renders QR text as a PNG data URL. */
export declare function renderQrPngDataUrl(input: string, opts?: QrPngRenderOptions): Promise<string>;
/** Writes QR PNG output into a scoped temp directory and returns that directory as a media root. */
export declare function writeQrPngTempFile(input: string, opts: QrPngTempFileOptions): Promise<QrPngTempFile>;
export {};
