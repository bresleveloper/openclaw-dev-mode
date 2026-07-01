import { AbsolutePathSymlinkPolicy, EnsureAbsoluteDirectoryOptions, EnsureAbsoluteDirectoryResult, MovePathToTrashOptions, ResolvedAbsolutePath, ResolvedWritableAbsolutePath, appendRegularFile, appendRegularFileSync, assertAbsolutePathInput, canonicalPathFromExistingAncestor, findExistingAncestor as findExistingAncestor$1, movePathToTrash, pathExists, pathExistsSync, readLocalFileFromRoots, readRegularFile, readRegularFileSync, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveLocalPathFromRootsSync, resolveRegularFileAppendFlags, sanitizeUntrustedFileName, statRegularFile, statRegularFileSync, withTimeout } from "@openclaw/fs-safe/advanced";
import { OpenResult, ReadResult, ReadResult as ReadResult$1, Root, openLocalFileSafely, readLocalFileSafely, resolveOpenedFileRealPathForHandle, root as root$1 } from "@openclaw/fs-safe/root";
import { FsSafeError, FsSafeErrorCode } from "@openclaw/fs-safe/errors";
import { isPathInside } from "@openclaw/fs-safe/path";
import { SecureFileReadOptions, SecureFileReadResult, readSecureFile } from "@openclaw/fs-safe/secure-file";
import { WalkDirectoryEntry, WalkDirectoryOptions, WalkDirectoryResult, walkDirectory, walkDirectorySync } from "@openclaw/fs-safe/walk";

//#region src/infra/fs-safe.d.ts
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
export { readFileWithinRoot as A, resolveRegularFileAppendFlags as B, ensureAbsoluteDirectory as C, openLocalFileSafely as D, movePathToTrash as E, readSecureFile as F, walkDirectory as G, sanitizeUntrustedFileName as H, resolveAbsolutePathForRead as I, writeExternalFileWithinRoot as J, walkDirectorySync as K, resolveAbsolutePathForWrite as L, readLocalFileSafely as M, readRegularFile as N, pathExists as O, readRegularFileSync as P, resolveLocalPathFromRootsSync as R, canonicalPathFromExistingAncestor as S, isPathInside as T, statRegularFile as U, root$1 as V, statRegularFileSync as W, writeFileWithinRoot as Y, WalkDirectoryOptions as _, ExternalFileWriteResult as a, appendRegularFileSync as b, MovePathToTrashOptions as c, ResolvedAbsolutePath as d, ResolvedWritableAbsolutePath as f, WalkDirectoryEntry as g, SecureFileReadResult as h, ExternalFileWriteOptions as i, readLocalFileFromRoots as j, pathExistsSync as k, OpenResult as l, SecureFileReadOptions as m, EnsureAbsoluteDirectoryOptions as n, FsSafeError as o, Root as p, withTimeout as q, EnsureAbsoluteDirectoryResult as r, FsSafeErrorCode as s, AbsolutePathSymlinkPolicy as t, ReadResult$1 as u, WalkDirectoryResult as v, findExistingAncestor$1 as w, assertAbsolutePathInput as x, appendRegularFile as y, resolveOpenedFileRealPathForHandle as z };