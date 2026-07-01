/**
 * Session runtime compatibility helpers.
 *
 * Resolves persisted runtime overrides without leaking provider-specific CLI runtime bindings across model routes.
 */
import type { SessionEntry } from "../config/sessions.js";
/** Persisted runtime fields used to recover session runtime compatibility. */
type SessionRuntimeCompatEntry = Pick<SessionEntry, "agentHarnessId" | "agentRuntimeOverride">;
/** Resolves the persisted runtime id, preferring explicit overrides. */
export declare function resolvePersistedSessionRuntimeId(entry?: SessionRuntimeCompatEntry): string | undefined;
export {};
