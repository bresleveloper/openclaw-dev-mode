/**
 * Per-session workspace bootstrap snapshot cache.
 * Reuses unchanged bootstrap file arrays while refreshing each turn so edits
 * become visible to long-lived agent sessions.
 */
import { type WorkspaceBootstrapFile } from "./workspace.js";
/** Load bootstrap files for a session, reusing the prior snapshot when content is unchanged. */
export declare function getOrLoadBootstrapFiles(params: {
    workspaceDir: string;
    sessionKey: string;
}): Promise<WorkspaceBootstrapFile[]>;
/** Drop one cached bootstrap snapshot. */
export declare function clearBootstrapSnapshot(sessionKey: string): void;
/** Clear bootstrap state when a visible session rolls over to a new backing session. */
export declare function clearBootstrapSnapshotOnSessionRollover(params: {
    sessionKey?: string;
    previousSessionId?: string;
}): void;
/** Clear all cached bootstrap snapshots. */
export declare function clearAllBootstrapSnapshots(): void;
