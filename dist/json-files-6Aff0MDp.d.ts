import "./fs-safe-defaults-ypw0M2Xi.js";
import { createAsyncLock } from "@openclaw/fs-safe/advanced";
import { JsonFileReadError, readJson, readJson as readJsonFileStrict, readJsonIfExists, readJsonIfExists as readDurableJsonFile, readJsonSync, readRootJsonObjectSync, readRootJsonSync, readRootStructuredFileSync, tryReadJson, tryReadJson as readJsonFile, tryReadJsonSync, tryReadJsonSync as readJsonFileSync, writeJson, writeJson as writeJsonAtomic, writeJsonSync } from "@openclaw/fs-safe/json";
//#region src/infra/json-files.d.ts
type WriteTextAtomicBeforeRename = (params: {
  filePath: string;
  tempPath: string;
}) => Promise<void>;
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
export { writeJsonAtomic as _, readJson as a, readJsonFileSync as c, readRootJsonObjectSync as d, readRootJsonSync as f, writeJson as g, tryReadJsonSync as h, readDurableJsonFile as i, readJsonIfExists as l, tryReadJson as m, WriteTextAtomicOptions as n, readJsonFile as o, readRootStructuredFileSync as p, createAsyncLock as r, readJsonFileStrict as s, JsonFileReadError as t, readJsonSync as u, writeJsonSync as v, writeTextAtomic as y };