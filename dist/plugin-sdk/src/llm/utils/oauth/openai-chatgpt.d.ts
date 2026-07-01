import type { OAuthCredentials, OAuthLoginCallbacks, OAuthProviderInterface } from "./types.js";
/** Runs the ChatGPT/Codex OAuth login flow and returns normalized credentials. */
export declare function loginOpenAICodex(callbacks: OAuthLoginCallbacks): Promise<OAuthCredentials>;
/** Refreshes a ChatGPT/Codex OAuth token through the provider runtime or bundled facade. */
export declare function refreshOpenAICodexToken(refreshToken: string): Promise<OAuthCredentials>;
/** OAuth provider descriptor for ChatGPT subscription-backed OpenAI access. */
export declare const openaiCodexOAuthProvider: OAuthProviderInterface;
