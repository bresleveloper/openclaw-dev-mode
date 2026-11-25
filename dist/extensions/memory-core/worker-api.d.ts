import { MessagePort } from "node:worker_threads";
import { Readable, Writable } from "node:stream";
export declare function serveLocalMemoryWatches(port: MessagePort): Promise<void>;
/** Same-version file IPC; the provisioned adapter owns admission and configured roots. */
export declare function serveMemoryFiles(options: {
  workspace: string;
  input: Readable;
  output: Writable;
  watch?: boolean;
}): Promise<void>;