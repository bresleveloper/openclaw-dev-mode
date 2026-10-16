import { r as OpenClawConfig } from "./types.openclaw-DWWUw8hA.js";
import "./types-C-BtfS0H.js";
//#region src/media/local-roots.d.ts
/** Returns the process default roots where local media reads may resolve generated/cache files. */
declare function getDefaultMediaLocalRoots(): readonly string[];
/**
 * Adds exact agent/session workspaces without exposing shared agent or sandbox roots.
 *
 * Callers that need to send media from a sandbox must pass the authoritative active
 * session workspace, not a path derived from the requested media source. Omitting that
 * context intentionally denies sandbox files under workspace-only filesystem policy.
 */
declare function getAgentScopedMediaLocalRoots(cfg: OpenClawConfig, agentId?: string, sessionWorkspaceDir?: string): readonly string[];
/**
 * Resolves outbound media roots, expanding for local sources only when filesystem policy allows it.
 * Pass `sessionWorkspaceDir` from trusted session context to retain access to that exact sandbox.
 */
declare function getAgentScopedMediaLocalRootsForSources(params: {
  cfg: OpenClawConfig;
  agentId?: string;
  mediaSources?: readonly string[];
  sessionWorkspaceDir?: string;
  workspaceOnly?: boolean;
}): readonly string[];
//#endregion
export { getAgentScopedMediaLocalRootsForSources as n, getDefaultMediaLocalRoots as r, getAgentScopedMediaLocalRoots as t };