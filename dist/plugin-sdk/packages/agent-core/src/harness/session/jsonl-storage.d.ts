import type { FileSystem, JsonlSessionMetadata, SessionTreeEntry } from "../types.js";
import { BaseSessionStorage } from "./storage-base.js";
type JsonlSessionStorageFileSystem = Pick<FileSystem, "readTextFile" | "readTextLines" | "writeFile" | "appendFile">;
/** Read only the JSONL session header and convert it to session metadata. */
export declare function loadJsonlSessionMetadata(fs: JsonlSessionStorageFileSystem, filePath: string): Promise<JsonlSessionMetadata>;
/** Append-only JSONL-backed storage for one session tree. */
export declare class JsonlSessionStorage extends BaseSessionStorage<JsonlSessionMetadata> {
    private readonly fs;
    private readonly filePath;
    private constructor();
    static open(fs: JsonlSessionStorageFileSystem, filePath: string): Promise<JsonlSessionStorage>;
    /** Create a new JSONL file with a session header and no entries. */
    static create(fs: JsonlSessionStorageFileSystem, filePath: string, options: {
        cwd: string;
        sessionId: string;
        parentSessionPath?: string;
    }): Promise<JsonlSessionStorage>;
    setLeafId(leafId: string | null): Promise<void>;
    appendEntry(entry: SessionTreeEntry): Promise<void>;
}
export {};
