import { r as LegacyNonBlockingReadOption, t as CompatibleFsSafeRoot } from "./fs-safe-compat-C_1ee0Ua.js";
import { appendRegularFile, canonicalPathFromExistingAncestor, findExistingAncestor, pathExistsSync, readRegularFile, readRegularFileSync, resolveAbsolutePathForRead, resolveAbsolutePathForWrite, resolveLocalPathFromRootsSync, statRegularFile, statRegularFileSync, withTimeout } from "@openclaw/fs-safe/advanced";
import { RootDefaults, openLocalFileSafely } from "@openclaw/fs-safe/root";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/secure-file";
import "@openclaw/fs-safe/walk";
/** Follow links; all filesystem failures mean the optional path is unavailable. */
declare function pathExists(filePath: string): Promise<boolean>;
type Root$1 = Omit<CompatibleFsSafeRoot, "walk">;
declare function root(rootDir: string, defaults?: RootDefaults & LegacyNonBlockingReadOption): Promise<Root$1>;
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
declare function writeExternalFileWithinRoot(options: ExternalFileWriteOptions): Promise<ExternalFileWriteResult>;
export { writeExternalFileWithinRoot as _, openLocalFileSafely as a, readRegularFile as c, resolveAbsolutePathForWrite as d, resolveLocalPathFromRootsSync as f, withTimeout as g, statRegularFileSync as h, findExistingAncestor as i, readRegularFileSync as l, statRegularFile as m, appendRegularFile as n, pathExists as o, root as p, canonicalPathFromExistingAncestor as r, pathExistsSync as s, FsSafeError as t, resolveAbsolutePathForRead as u };