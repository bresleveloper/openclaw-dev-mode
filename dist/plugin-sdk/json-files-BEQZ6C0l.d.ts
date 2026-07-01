import { createAsyncLock } from "@openclaw/fs-safe/advanced";
import { JsonFileReadError as JsonFileReadError$1, readJsonSync, readRootJsonObjectSync as readRootJsonObjectSync$1, readRootJsonSync, readRootStructuredFileSync, tryReadJsonSync as readJsonFileSync, tryReadJsonSync as tryReadJsonSync$1, writeJson, writeJson as writeJsonAtomic, writeJsonSync as writeJsonSync$1 } from "@openclaw/fs-safe/json";

//#region src/infra/json-files.d.ts
type WriteTextAtomicBeforeRename = (params: {
  filePath: string;
  tempPath: string;
}) => Promise<void>;
/** Reads and parses JSON, wrapping unexpected read failures in JsonFileReadError. */
declare function readJson$1<T>(filePath: string): Promise<T>;
/** Strict JSON read alias for callers that must fail on missing or invalid files. */
declare function readJsonFileStrict<T>(filePath: string): Promise<T>;
/** Reads JSON when the file exists, returning null only for a missing path. */
declare function readJsonIfExists$1<T>(filePath: string): Promise<T | null>;
/** Durable JSON read alias that keeps parse/read errors visible to callers. */
declare function readDurableJsonFile<T>(filePath: string): Promise<T | null>;
/**
 * tryReadJson delegates to readJsonIfExists instead of the internal
 * tryReadJsonImpl from @openclaw/fs-safe. The fs-safe implementation retries
 * race conditions before propagating errors; this wrapper keeps the historical
 * null-on-error contract for callers that intentionally treat reads as optional.
 */
declare function tryReadJson<T>(filePath: string): Promise<T | null>;
/** Optional JSON read that returns null for missing, invalid, or racing files. */
declare function readJsonFile<T>(filePath: string): Promise<T | null>;
type WriteTextAtomicOptions = {
  mode?: number;
  dirMode?: number;
  trailingNewline?: boolean;
  durable?: boolean;
  beforeRename?: WriteTextAtomicBeforeRename;
  /**
   * Prefix for the staged `<prefix>.<pid>.<uuid>.tmp` file. Defaults to the
   * generic `.fs-safe-replace`; pass a target-specific prefix so an orphaned
   * temp (from a crash between write and rename) is identifiable and reclaimable.
   */
  tempPrefix?: string;
};
/** Writes text through the repo atomic replace helper with durable fsync by default. */
declare function writeTextAtomic(filePath: string, content: string, options?: WriteTextAtomicOptions): Promise<void>;
//#endregion
export { writeJsonAtomic as _, readJson$1 as a, readJsonFileSync as c, readRootJsonObjectSync$1 as d, readRootJsonSync as f, writeJson as g, tryReadJsonSync$1 as h, readDurableJsonFile as i, readJsonIfExists$1 as l, tryReadJson as m, WriteTextAtomicOptions as n, readJsonFile as o, readRootStructuredFileSync as p, createAsyncLock as r, readJsonFileStrict as s, JsonFileReadError$1 as t, readJsonSync as u, writeJsonSync$1 as v, writeTextAtomic as y };