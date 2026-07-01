import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Returns the active plugin-backed memory search manager for an agent. */
export declare function getActiveMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: "default" | "status" | "cli";
}): Promise<{
    manager: import("./memory-state.js").RegisteredMemorySearchManager | null;
    error?: string;
}>;
/** Resolves current memory backend config without constructing a manager. */
export declare function resolveActiveMemoryBackendConfig(params: {
    cfg: OpenClawConfig;
    agentId: string;
}): import("./memory-state.js").MemoryRuntimeBackendConfig | null;
/** Closes all active plugin-backed memory search managers. */
export declare function closeActiveMemorySearchManagers(cfg?: OpenClawConfig): Promise<void>;
/** Closes the plugin-backed memory search manager for one agent. */
export declare function closeActiveMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
}): Promise<void>;
