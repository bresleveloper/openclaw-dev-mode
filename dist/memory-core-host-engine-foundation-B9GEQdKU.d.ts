import "./config-contracts-hzlacViZ.js";
import "./types.openclaw-D8uW-XQA.js";
import "./paths-C-0fLn2q.js";
import "./fs-safe-DlrPy6P_.js";
import "./utils-B6YNl4JK.js";
import "./fs-utils-8PiYFN32.js";
import "./memory-search-BG93fY3J.js";
/** Observe execution ownership, including queued turns, without reading storage. */
declare function observeAgentRunActivity(agentId: string, listener: (busy: boolean) => void): () => void;
type GlobalSingletonLifecycle = "close-and-restart" | "close-only" | "plugin-registry" | "shared-state";
type GlobalSingletonReset<T> = (value: T) => void | Promise<void>;
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
declare function resolveGlobalSingleton<T>(key: symbol, create: () => T, reset?: GlobalSingletonReset<T>, lifecycle?: GlobalSingletonLifecycle): T;
export { observeAgentRunActivity as n, resolveGlobalSingleton as t };