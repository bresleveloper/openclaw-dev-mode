import "../fs-safe-defaults-ypw0M2Xi.js";
import { r as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-BVXh5Mbm.js";
import { sanitizeTempFileName } from "@openclaw/fs-safe/advanced";
import { TempWorkspace, TempWorkspaceOptions, TempWorkspaceSync, tempWorkspace, tempWorkspaceSync, withTempWorkspace, withTempWorkspaceSync } from "@openclaw/fs-safe/temp";
//#region src/infra/temp-download.d.ts
type TempDownloadTarget = {
  dir: string;
  path: string;
  file(fileName?: string): string;
  cleanup: () => Promise<void>;
  [Symbol.asyncDispose](): Promise<void>;
};
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
//#endregion
export { type TempWorkspace, type TempWorkspaceOptions, type TempWorkspaceSync, resolvePreferredOpenClawTmpDir, sanitizeTempFileName, tempWorkspace, tempWorkspaceSync, withTempWorkspace, withTempWorkspaceSync };