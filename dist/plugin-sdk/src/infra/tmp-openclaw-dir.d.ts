/** Preferred shared OpenClaw temp root on POSIX systems when ownership and permissions are safe. */
export declare const POSIX_OPENCLAW_TMP_DIR = "/tmp/openclaw";
type SecureDirStat = {
    isDirectory(): boolean;
    isSymbolicLink(): boolean;
    mode?: number;
    uid?: number;
};
/** Injectable filesystem/platform hooks for resolving the preferred temp root in tests. */
export type ResolvePreferredOpenClawTmpDirOptions = {
    accessSync?: (path: string, mode?: number) => void;
    chmodSync?: (path: string, mode: number) => void;
    getuid?: () => number | undefined;
    lstatSync?: (path: string) => SecureDirStat;
    mkdirSync?: (path: string, opts: {
        recursive: boolean;
        mode?: number;
    }) => void;
    platform?: NodeJS.Platform;
    tmpdir?: () => string;
    warn?: (message: string) => void;
};
/** Resolves a safe OpenClaw temp root, falling back to user-scoped os.tmpdir paths when needed. */
export declare function resolvePreferredOpenClawTmpDir(options?: ResolvePreferredOpenClawTmpDirOptions): string;
export {};
