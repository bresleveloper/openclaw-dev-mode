import type { Stats } from "node:fs";
import { type ArchiveLogger } from "./archive.js";
type ExistingInstallPathResult = {
    ok: true;
    resolvedPath: string;
    stat: Stats;
} | {
    ok: false;
    error: string;
};
/** Resolve and stat a user-provided install path. */
export declare function resolveExistingInstallPath(inputPath: string): Promise<ExistingInstallPathResult>;
/** Extract an archive to a temp dir and run work against the detected package root. */
export declare function withExtractedArchiveRoot<TResult extends {
    ok: boolean;
}>(params: {
    archivePath: string;
    tempDirPrefix: string;
    timeoutMs: number;
    logger?: ArchiveLogger;
    rootMarkers?: readonly string[];
    onExtracted: (rootDir: string) => Promise<TResult>;
}): Promise<TResult | {
    ok: false;
    error: string;
}>;
export {};
