/**
 * Filesystem watcher helpers.
 *
 * Centralizes retry timing and close/error handling for agent file watchers.
 */
import { type FSWatcher, type WatchListener } from "node:fs";
export declare const FS_WATCH_RETRY_DELAY_MS = 5000;
export declare function closeWatcher(watcher: FSWatcher | null | undefined): void;
export declare function watchWithErrorHandler(path: string, listener: WatchListener<string>, onError: () => void): FSWatcher | null;
