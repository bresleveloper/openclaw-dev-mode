/**
 * OAuth credential management for AI providers.
 *
 * This module handles login, token refresh, and credential storage
 * for OAuth-based providers:
 * - Anthropic (Claude Pro/Max)
 * - GitHub Copilot
 */
export { anthropicOAuthProvider, loginAnthropic, refreshAnthropicToken } from "./anthropic.js";
export { getGitHubCopilotBaseUrl, githubCopilotOAuthProvider, loginGitHubCopilot, normalizeDomain, refreshGitHubCopilotToken, } from "./github-copilot.js";
export { loginOpenAICodex, openaiCodexOAuthProvider, refreshOpenAICodexToken, } from "./openai-chatgpt.js";
export * from "./types.js";
import type { OAuthCredentials, OAuthProviderId, OAuthProviderInterface } from "./types.js";
/**
 * Get an OAuth provider by ID
 */
export declare function getOAuthProvider(id: OAuthProviderId): OAuthProviderInterface | undefined;
/**
 * Register a custom OAuth provider
 */
export declare function registerOAuthProvider(provider: OAuthProviderInterface): void;
/**
 * Reset OAuth providers to built-ins.
 */
export declare function resetOAuthProviders(): void;
/**
 * Get all registered OAuth providers
 */
export declare function getOAuthProviders(): OAuthProviderInterface[];
/**
 * Get API key for a provider from OAuth credentials.
 * Automatically refreshes expired tokens.
 *
 * @returns API key string and updated credentials, or null if no credentials
 * @throws Error if refresh fails
 */
export declare function getOAuthApiKey(providerId: OAuthProviderId, credentials: Record<string, OAuthCredentials>): Promise<{
    newCredentials: OAuthCredentials;
    apiKey: string;
} | null>;
