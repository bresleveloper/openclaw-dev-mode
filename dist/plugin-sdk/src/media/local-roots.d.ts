import type { OpenClawConfig } from "../config/types.js";
type BuildMediaLocalRootsOptions = {
    preferredTmpDir?: string;
};
/** Builds the baseline local media root allowlist from state/config directories. */
export declare function buildMediaLocalRoots(stateDir: string, configDir: string, options?: BuildMediaLocalRootsOptions): string[];
/** Returns the process default roots where local media reads may resolve generated/cache files. */
export declare function getDefaultMediaLocalRoots(): readonly string[];
/** Adds the active agent workspace to the default media roots without exposing all agent state. */
export declare function getAgentScopedMediaLocalRoots(cfg: OpenClawConfig, agentId?: string): readonly string[];
/** Adds only concrete local source parent directories to an existing root allowlist. */
export declare function appendLocalMediaParentRoots(roots: readonly string[], mediaSources?: readonly string[]): string[];
/** Resolves outbound media roots, expanding for local sources only when filesystem policy allows it. */
export declare function getAgentScopedMediaLocalRootsForSources(params: {
    cfg: OpenClawConfig;
    agentId?: string;
    mediaSources?: readonly string[];
}): readonly string[];
export {};
