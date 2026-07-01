/**
 * Auth profile store cloning helpers.
 * Keeps store snapshots JSON-serializable before callers mutate or persist
 * profile state.
 */
import type { AuthProfileStore } from "./types.js";
/** Deep-clones an auth profile store and rejects non-JSON values. */
export declare function cloneAuthProfileStore(store: AuthProfileStore): AuthProfileStore;
