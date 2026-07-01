import "./fs-safe-defaults.js";
export { resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir.js";
type TempDownloadTarget = {
    dir: string;
    path: string;
    file(fileName?: string): string;
    cleanup: () => Promise<void>;
    [Symbol.asyncDispose](): Promise<void>;
};
export declare function sanitizeTempFileName(fileName: string): string;
/** Build a stable temp path shape while keeping caller-controlled text filename-safe. */
export declare function buildRandomTempFilePath(params: {
    prefix: string;
    extension?: string;
    tmpDir?: string;
    now?: number;
    uuid?: string;
}): string;
export declare function createTempDownloadTarget(params: {
    prefix: string;
    fileName?: string;
    tmpDir?: string;
}): Promise<TempDownloadTarget>;
/** Run with a private temp download path and always attempt workspace cleanup. */
export declare function withTempDownloadPath<T>(params: {
    prefix: string;
    fileName?: string;
    tmpDir?: string;
}, fn: (tmpPath: string) => Promise<T>): Promise<T>;
