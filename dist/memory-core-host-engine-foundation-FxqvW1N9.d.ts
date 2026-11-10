import "./types-D7I_F5Ux.js";
import "./config-contracts-CY87ANNp.js";
import "./config-S5Zm-Svf.js";
import "./utils-DhaCU8ER.js";
import "./fs-safe-Be4CnQth.js";
import "./memory-search-UMUE5u-D.js";
import "./fs-utils-DfIeS0Wn.js";
//#region src/shared/global-singleton.d.ts
type GlobalSingletonLifecycle = "close-and-restart" | "close-only" | "plugin-registry" | "shared-state";
type GlobalSingletonReset<T> = (value: T) => void | Promise<void>;
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
declare function resolveGlobalSingleton<T>(key: symbol, create: () => T, reset?: GlobalSingletonReset<T>, lifecycle?: GlobalSingletonLifecycle): T;
//#endregion
//#region src/infra/agent-run-activity.d.ts
/** Observe execution ownership, including queued turns, without reading storage. */
declare function observeAgentRunActivity(agentId: string, listener: (busy: boolean) => void): () => void;
//#endregion
export { resolveGlobalSingleton as n, observeAgentRunActivity as t };