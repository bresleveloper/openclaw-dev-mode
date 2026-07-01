import { type TransientProviderRetryConfig } from "../provider-runtime/operation-retry.js";
type ApiKeyRetryParams = {
    apiKey: string;
    error: unknown;
    attempt: number;
};
type ExecuteWithApiKeyRotationOptions<T> = {
    provider: string;
    apiKeys: string[];
    execute: (apiKey: string) => Promise<T>;
    shouldRetry?: (params: ApiKeyRetryParams & {
        message: string;
    }) => boolean;
    onRetry?: (params: ApiKeyRetryParams & {
        message: string;
    }) => void;
    transientRetry?: TransientProviderRetryConfig;
};
/** Collect primary and live-discovered provider keys in stable de-duped order. */
export declare function collectProviderApiKeysForExecution(params: {
    provider: string;
    primaryApiKey?: string;
}): string[];
/**
 * Execute a provider operation with key rotation and optional same-key transient
 * retries.
 */
export declare function executeWithApiKeyRotation<T>(params: ExecuteWithApiKeyRotationOptions<T>): Promise<T>;
export {};
