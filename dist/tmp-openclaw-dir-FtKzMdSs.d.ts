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
  /** Captured state fallback for filesystem work dispatched to another isolate. */
  stateDir?: string;
  /** Coordination addresses must stay shared across profiles and updater versions. */
  purpose?: "workspace" | "coordination";
  tmpdir?: () => string;
  warn?: (message: string) => void;
};
/** Select a private root with trusted ancestors before consumers create disposable workspaces. */
declare function resolvePreferredOpenClawTmpDir(options?: ResolvePreferredOpenClawTmpDirOptions): string;
export { resolvePreferredOpenClawTmpDir as t };