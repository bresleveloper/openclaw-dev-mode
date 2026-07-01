import { type WriteStream } from "node:fs";
/** Opens a unique write stream with owner-only permissions. */
export declare function createPrivateTempWriteStream(prefix: string): {
    path: string;
    stream: WriteStream;
};
