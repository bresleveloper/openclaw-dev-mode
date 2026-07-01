/**
 * Lazy public SDK facade for active memory search manager lifecycle operations.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RegisteredMemorySearchManager } from "../plugins/memory-state.js";
type ActiveMemorySearchPurpose = "default" | "status";
/** Active manager lookup result, including a soft error when memory is unavailable. */
export type ActiveMemorySearchManagerResult = {
    manager: RegisteredMemorySearchManager | null;
    error?: string;
};
/** Loads the active memory search manager for one agent and purpose. */
export declare function getActiveMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: ActiveMemorySearchPurpose;
}): Promise<ActiveMemorySearchManagerResult>;
/** Closes every active memory search manager for the provided config. */
export declare function closeActiveMemorySearchManagers(cfg?: OpenClawConfig): Promise<void>;
/** Closes the active memory search manager for one agent. */
export declare function closeActiveMemorySearchManager(params: {
    cfg: OpenClawConfig;
    agentId: string;
}): Promise<void>;
export {};
