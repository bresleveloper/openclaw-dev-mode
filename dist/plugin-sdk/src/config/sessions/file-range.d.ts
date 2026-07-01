import type { FileHandle } from "node:fs/promises";
export declare function readFileRangeAsync(fileHandle: FileHandle, position: number, length: number): Promise<Buffer>;
