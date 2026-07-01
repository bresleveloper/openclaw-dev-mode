import { note } from "../../packages/terminal-core/src/note.js";
import type { AuthProfileStore, OAuthCredential, TokenCredential } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
type ClaudeCliReadableCredential = Pick<OAuthCredential, "type" | "expires"> | Pick<TokenCredential, "type" | "expires">;
/**
 * Emits Claude CLI health diagnostics for every agent currently routed through the CLI backend.
 *
 * The optional deps let tests inject auth stores, PATH resolution, and workspace roots without
 * touching the user's real Claude credentials or filesystem.
 */
export declare function noteClaudeCliHealth(cfg: OpenClawConfig, deps?: {
    noteFn?: typeof note;
    env?: NodeJS.ProcessEnv;
    homeDir?: string;
    store?: AuthProfileStore;
    readClaudeCliCredentials?: () => ClaudeCliReadableCredential | null;
    resolveCommandPath?: (command: string, env?: NodeJS.ProcessEnv) => string | undefined;
    workspaceDir?: string;
}): void;
export {};
