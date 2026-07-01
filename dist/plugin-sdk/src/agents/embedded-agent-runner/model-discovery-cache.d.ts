import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AuthStorage, ModelRegistry } from "../sessions/index.js";
/**
 * Caches auth/model discovery for embedded-agent turns that reuse a stable agent directory.
 *
 * Runtime auth profile stores and live plugin auth sources bypass this cache because their
 * source of truth can change without file metadata updates in the agent directory.
 */
type DiscoveryStores = {
    authStorage: AuthStorage;
    modelRegistry: ModelRegistry;
};
type DiscoverCachedAgentStoresOptions = {
    agentDir: string;
    config?: OpenClawConfig;
    inheritedAuthDir?: string;
    workspaceDir?: string;
};
/** Discovers auth/model stores, reusing file-backed snapshots until their inputs change. */
export declare function discoverCachedAgentStores(options: DiscoverCachedAgentStoresOptions): DiscoveryStores;
/** Clears the process-local discovery cache between tests that mutate model/auth fixtures. */
export declare function resetModelDiscoveryCacheForTest(): void;
export {};
