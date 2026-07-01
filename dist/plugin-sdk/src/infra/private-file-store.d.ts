import "./fs-safe-defaults.js";
import { type FileStore, type FileStoreSync } from "@openclaw/fs-safe/store";
export type PrivateFileStore = FileStore;
/** Create an async private file store rooted at `rootDir`. */
export declare function privateFileStore(rootDir: string): FileStore;
export type PrivateFileStoreSync = FileStoreSync;
/** Create a sync private file store rooted at `rootDir`. */
export declare function privateFileStoreSync(rootDir: string): PrivateFileStoreSync;
