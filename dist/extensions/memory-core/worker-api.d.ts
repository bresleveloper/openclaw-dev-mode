import { Readable, Writable } from "node:stream";
//#region extensions/memory-core/src/remote/memory-files-worker.d.ts
/** Same-version file IPC; the provisioned adapter owns admission and configured roots. */
export declare function serveMemoryFiles(options: {
  workspace: string;
  input: Readable;
  output: Writable;
  watch?: boolean;
}): Promise<void>;
//#endregion