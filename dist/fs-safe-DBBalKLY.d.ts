import "./fs-safe-defaults-ypw0M2Xi.js";
import "./fs-safe-advanced-CgWxxJBc.js";
import { AbsolutePathSymlinkPolicy, EnsureAbsoluteDirectoryOptions, EnsureAbsoluteDirectoryResult, MovePathToTrashOptions, ResolvedAbsolutePath, ResolvedWritableAbsolutePath, appendRegularFile, appendRegularFileSync, assertAbsolutePathInput, canonicalPathFromExistingAncestor, findExistingAncestor, movePathToTrash, pathExists, pathExistsSync, readLocalFileFromRoots, readRegularFile, readRegularFileSync, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveLocalPathFromRootsSync, resolveRegularFileAppendFlags, statRegularFile, statRegularFileSync, withTimeout } from "@openclaw/fs-safe/advanced";
import { FsSafeError, FsSafeErrorCode } from "@openclaw/fs-safe/errors";
import { OpenResult, ReadResult, ReadResult as ReadResult$1, Root, RootDefaults, openLocalFileSafely, readLocalFileSafely, resolveOpenedFileRealPathForHandle } from "@openclaw/fs-safe/root";
import { isPathInside } from "@openclaw/fs-safe/path";
import { SecureFileReadOptions, SecureFileReadResult, readSecureFile } from "@openclaw/fs-safe/secure-file";
import { WalkDirectoryEntry, WalkDirectoryOptions, WalkDirectoryResult, walkDirectory, walkDirectorySync } from "@openclaw/fs-safe/walk";
//#region src/infra/fs-safe.d.ts
type Root$1 = Omit<Root, "walk">;
declare function root(rootDir: string, defaults?: RootDefaults): Promise<Root$1>;
type ExternalFileWriteOptions = {
  rootDir: string;
  path: string;
  write: (tempPath: string) => Promise<void>;
  fallbackFileName?: string;
  tempPrefix?: string;
};
type ExternalFileWriteResult = {
  path: string;
};
declare function ensureAbsoluteDirectory(dirPath: string, options?: {
  scopeLabel?: string;
  mode?: number;
}): Promise<{
  ok: true;
  path: string;
} | {
  ok: false;
  error: Error;
}>;
declare function writeExternalFileWithinRoot(options: ExternalFileWriteOptions): Promise<ExternalFileWriteResult>;
/** @deprecated Use root(rootDir).read(relativePath, options). */
declare function readFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  rejectHardlinks?: boolean;
  nonBlockingRead?: boolean;
  allowSymlinkTargetWithinRoot?: boolean;
  maxBytes?: number;
}): Promise<ReadResult>;
/** @deprecated Use root(rootDir).write(relativePath, data, options). */
declare function writeFileWithinRoot(params: {
  rootDir: string;
  relativePath: string;
  data: string | Buffer;
  encoding?: BufferEncoding;
  mkdir?: boolean;
}): Promise<void>;
//#endregion
export { readFileWithinRoot as A, resolveRegularFileAppendFlags as B, ensureAbsoluteDirectory as C, openLocalFileSafely as D, movePathToTrash as E, readSecureFile as F, walkDirectorySync as G, statRegularFile as H, resolveAbsolutePathForRead as I, writeFileWithinRoot as J, withTimeout as K, resolveAbsolutePathForWrite as L, readLocalFileSafely as M, readRegularFile as N, pathExists as O, readRegularFileSync as P, resolveLocalPathFromRootsSync as R, canonicalPathFromExistingAncestor as S, isPathInside as T, statRegularFileSync as U, root as V, walkDirectory as W, WalkDirectoryOptions as _, ExternalFileWriteResult as a, appendRegularFileSync as b, MovePathToTrashOptions as c, ResolvedAbsolutePath as d, ResolvedWritableAbsolutePath as f, WalkDirectoryEntry as g, SecureFileReadResult as h, ExternalFileWriteOptions as i, readLocalFileFromRoots as j, pathExistsSync as k, OpenResult as l, SecureFileReadOptions as m, EnsureAbsoluteDirectoryOptions as n, FsSafeError as o, Root$1 as p, writeExternalFileWithinRoot as q, EnsureAbsoluteDirectoryResult as r, FsSafeErrorCode as s, AbsolutePathSymlinkPolicy as t, ReadResult$1 as u, WalkDirectoryResult as v, findExistingAncestor as w, assertAbsolutePathInput as x, appendRegularFile as y, resolveOpenedFileRealPathForHandle as z };