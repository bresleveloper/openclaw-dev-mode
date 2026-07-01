import type { CliSessionBinding, SessionEntry } from "../config/sessions.js";
/** Hash CLI session-sensitive text so reuse checks can compare stable fingerprints. */
export declare function hashCliSessionText(value: string | undefined): string | undefined;
/** Read the stored CLI session binding for a provider, including legacy Claude state. */
export declare function getCliSessionBinding(entry: SessionEntry | undefined, provider: string): CliSessionBinding | undefined;
/** Read just the reusable CLI session ID for a provider. */
export declare function getCliSessionId(entry: SessionEntry | undefined, provider: string): string | undefined;
/** Store a reusable CLI session ID without extra reuse guards. */
export declare function setCliSessionId(entry: SessionEntry, provider: string, sessionId: string): void;
/** Store a CLI session binding and mirror it to legacy/simple session-id fields. */
export declare function setCliSessionBinding(entry: SessionEntry, provider: string, binding: CliSessionBinding): void;
/** Remove the stored CLI session binding for one provider. */
export declare function clearCliSession(entry: SessionEntry, provider: string): void;
type MutableCliSessionFields = Pick<SessionEntry, "cliSessionBindings" | "cliSessionIds" | "claudeCliSessionId">;
/** Remove every CLI session binding from a session entry. */
export declare function clearAllCliSessions(entry: Partial<MutableCliSessionFields>): void;
/** Decide whether a stored CLI session can be reused for the current auth/prompt/cwd/MCP state. */
export declare function resolveCliSessionReuse(params: {
    binding?: CliSessionBinding;
    authProfileId?: string;
    authEpoch?: string;
    authEpochVersion: number;
    extraSystemPromptHash?: string;
    messageToolPolicyHash?: string;
    promptToolNamesHash?: string;
    cwdHash?: string;
    mcpConfigHash?: string;
    mcpResumeHash?: string;
}): {
    sessionId?: string;
    invalidatedReason?: "auth-profile" | "auth-epoch" | "system-prompt" | "cwd" | "mcp";
};
export {};
