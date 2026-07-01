import type { OpenClawAgentDatabase } from "../../state/openclaw-agent-db.js";
import type { AuthProfileState, AuthProfileStateStore } from "./types.js";
/** Coerces persisted auth profile runtime state into the current shape. */
export declare function coerceAuthProfileState(raw: unknown): AuthProfileState;
/** Merges auth profile runtime state, with override records winning per key. */
export declare function mergeAuthProfileState(base: AuthProfileState, override: AuthProfileState): AuthProfileState;
/** Loads persisted auth profile runtime state from SQLite. */
export declare function loadPersistedAuthProfileState(agentDir?: string, database?: OpenClawAgentDatabase): AuthProfileState;
/** Builds the persisted auth profile runtime state payload. */
export declare function buildPersistedAuthProfileState(store: AuthProfileState): AuthProfileStateStore | null;
/** Saves auth profile runtime state when it differs from the persisted payload. */
export declare function savePersistedAuthProfileState(store: AuthProfileState, agentDir?: string): AuthProfileStateStore | null;
