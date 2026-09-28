//#region src/infra/tmp-openclaw-dir.d.ts
/** Preferred shared OpenClaw temp root on POSIX systems when ownership and permissions are safe. */
declare const DEFAULT_POSIX_TMP_ROOT = "/tmp/openclaw";
type SecureDirStat = {
  isDirectory(): boolean;
  isSymbolicLink(): boolean;
  mode?: number;
  uid?: number;
};
/** Injectable filesystem/platform hooks for resolving the preferred temp root in tests. */
type ResolvePreferredOpenClawTmpDirOptions = {
  accessSync?: (path: string, mode?: number) => void;
  chmodSync?: (path: string, mode: number) => void;
  getuid?: () => number | undefined;
  lstatSync?: (path: string) => SecureDirStat;
  mkdirSync?: (path: string, opts: {
    recursive: boolean;
    mode?: number;
  }) => void;
  platform?: NodeJS.Platform;
  preferredDir?: string;
  tmpdir?: () => string;
  warn?: (message: string) => void;
};
/** Resolves a safe OpenClaw temp root, falling back to user-scoped os.tmpdir paths when needed. */
declare function resolvePreferredOpenClawTmpDir(options?: ResolvePreferredOpenClawTmpDirOptions): string;
//#endregion
export { ResolvePreferredOpenClawTmpDirOptions as n, resolvePreferredOpenClawTmpDir as r, DEFAULT_POSIX_TMP_ROOT as t };