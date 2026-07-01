/**
 * Reads and refreshes credentials stored by external CLI runtimes such as
 * Claude Code, Codex, Gemini, and MiniMax.
 */
import { execSync } from "node:child_process";
import type { OAuthProvider } from "./auth-profiles/types.js";
/** Clears in-memory CLI credential caches for isolated tests. */
export declare function resetCliCredentialCachesForTest(): void;
/** Credential shape parsed from Claude Code CLI storage. */
export type ClaudeCliCredential = {
    type: "oauth";
    provider: "anthropic";
    access: string;
    refresh: string;
    expires: number;
} | {
    type: "token";
    provider: "anthropic";
    token: string;
    expires: number;
};
/** Credential shape parsed from Codex CLI storage. */
export type CodexCliCredential = {
    type: "oauth";
    provider: OAuthProvider;
    access: string;
    refresh: string;
    expires: number;
    accountId?: string;
    idToken?: string;
};
/** Credential shape parsed from MiniMax portal CLI storage. */
export type MiniMaxCliCredential = {
    type: "oauth";
    provider: "minimax-portal";
    access: string;
    refresh: string;
    expires: number;
};
/** Credential shape parsed from Gemini CLI storage. */
export type GeminiCliCredential = {
    type: "oauth";
    provider: "google-gemini-cli";
    access: string;
    refresh: string;
    expires: number;
    accountId?: string;
    email?: string;
};
type ExecSyncFn = typeof execSync;
/** Reads Claude CLI credentials from macOS Keychain or the CLI credential file. */
export declare function readClaudeCliCredentials(options?: {
    allowKeychainPrompt?: boolean;
    platform?: NodeJS.Platform;
    homeDir?: string;
    execSync?: ExecSyncFn;
}): ClaudeCliCredential | null;
/** @deprecated Anthropic provider-owned CLI credential helper; do not use from third-party plugins. */
export declare function readClaudeCliCredentialsCached(options?: {
    allowKeychainPrompt?: boolean;
    ttlMs?: number;
    platform?: NodeJS.Platform;
    homeDir?: string;
    execSync?: ExecSyncFn;
}): ClaudeCliCredential | null;
/** Reads Codex CLI OAuth credentials from Keychain or CODEX_HOME auth.json. */
export declare function readCodexCliCredentials(options?: {
    codexHome?: string;
    allowKeychainPrompt?: boolean;
    platform?: NodeJS.Platform;
    execSync?: ExecSyncFn;
}): CodexCliCredential | null;
/** Reads Codex CLI credentials with optional short-lived cache and file fingerprinting. */
export declare function readCodexCliCredentialsCached(options?: {
    codexHome?: string;
    allowKeychainPrompt?: boolean;
    ttlMs?: number;
    platform?: NodeJS.Platform;
    execSync?: ExecSyncFn;
}): CodexCliCredential | null;
/** Reads MiniMax CLI credentials with optional short-lived cache. */
export declare function readMiniMaxCliCredentialsCached(options?: {
    ttlMs?: number;
    homeDir?: string;
}): MiniMaxCliCredential | null;
/** Reads Gemini CLI credentials with optional short-lived cache. */
export declare function readGeminiCliCredentialsCached(options?: {
    ttlMs?: number;
    homeDir?: string;
}): GeminiCliCredential | null;
export {};
