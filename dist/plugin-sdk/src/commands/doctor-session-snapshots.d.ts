import type { SessionEntry } from "../config/sessions/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type SnapshotPathSource = "skillsSnapshot.prompt" | "skillsSnapshot.resolvedSkills" | "systemPromptReport.injectedWorkspaceFiles";
type StaleSessionSnapshotPathFinding = {
    sessionKey: string;
    field: SnapshotPathSource;
    cachedPath: string;
    expectedPath: string;
};
/** Finds cached bundled-skill paths that point at old runtime/temp package roots. */
export declare function scanSessionStoreForStaleRuntimeSnapshotPaths(params: {
    store: Record<string, SessionEntry>;
    bundledSkillsDir: string | undefined;
    pathExists?: (filePath: string) => boolean;
    homeDir?: string;
    env?: NodeJS.ProcessEnv;
}): StaleSessionSnapshotPathFinding[];
/** Reports and optionally repairs stale bundled skill paths in session snapshot metadata. */
export declare function noteSessionSnapshotHealth(params?: {
    storePaths?: string[];
    bundledSkillsDir?: string;
    cfg?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    shouldRepair?: boolean;
}): Promise<void>;
export {};
