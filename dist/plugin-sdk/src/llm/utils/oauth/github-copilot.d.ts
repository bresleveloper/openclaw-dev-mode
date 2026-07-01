/**
 * GitHub Copilot OAuth flow
 */
import type { OAuthCredentials, OAuthProviderInterface } from "./types.js";
type DeviceCodeResponse = {
    device_code: string;
    user_code: string;
    verification_uri: string;
    intervalMs: number;
    expiresAt: number;
};
type CopilotRequestOptions = {
    signal?: AbortSignal;
    timeoutMs?: number;
};
export declare function normalizeDomain(input: string): string | null;
export declare function getGitHubCopilotBaseUrl(token?: string, enterpriseDomain?: string): string;
declare function startDeviceFlow(domain: string, options?: CopilotRequestOptions): Promise<DeviceCodeResponse>;
/**
 * Refresh GitHub Copilot token
 */
export declare function refreshGitHubCopilotToken(refreshToken: string, enterpriseDomain?: string, options?: CopilotRequestOptions): Promise<OAuthCredentials>;
/**
 * Enable a model for the user's GitHub Copilot account.
 * This is required for some models (like Claude, Grok) before they can be used.
 */
declare function enableGitHubCopilotModel(token: string, modelId: string, enterpriseDomain?: string, options?: CopilotRequestOptions): Promise<boolean>;
declare function listGitHubCopilotModelIds(token: string, enterpriseDomain?: string, options?: CopilotRequestOptions): Promise<string[]>;
/**
 * Login with GitHub Copilot OAuth (device code flow)
 *
 * @param options.onAuth - Callback with URL and optional instructions (user code)
 * @param options.onPrompt - Callback to prompt user for input
 * @param options.onProgress - Optional progress callback
 * @param options.signal - Optional AbortSignal for cancellation
 */
export declare function loginGitHubCopilot(options: {
    onAuth: (url: string, instructions?: string) => void;
    onPrompt: (prompt: {
        message: string;
        placeholder?: string;
        allowEmpty?: boolean;
    }) => Promise<string>;
    onProgress?: (message: string) => void;
    signal?: AbortSignal;
}): Promise<OAuthCredentials>;
export declare const githubCopilotOAuthProvider: OAuthProviderInterface;
export declare const testing: {
    enableGitHubCopilotModel: typeof enableGitHubCopilotModel;
    listGitHubCopilotModelIds: typeof listGitHubCopilotModelIds;
    startDeviceFlow: typeof startDeviceFlow;
};
export {};
