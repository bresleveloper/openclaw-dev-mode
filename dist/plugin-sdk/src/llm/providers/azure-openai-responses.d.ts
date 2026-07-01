import { isOpenAICompatibleAzureResponsesBaseUrl } from "../../shared/azure-openai-responses-client-compat.js";
import type { Model, SimpleStreamOptions, StreamFunction, StreamOptions } from "../types.js";
export interface AzureOpenAIResponsesOptions extends StreamOptions {
    reasoningEffort?: "minimal" | "low" | "medium" | "high" | "xhigh";
    reasoningSummary?: "auto" | "detailed" | "concise" | null;
    azureApiVersion?: string;
    azureResourceName?: string;
    azureBaseUrl?: string;
    azureDeploymentName?: string;
}
/**
 * Generate function for Azure OpenAI Responses API
 */
export declare const streamAzureOpenAIResponses: StreamFunction<"azure-openai-responses", AzureOpenAIResponsesOptions>;
export declare const streamSimpleAzureOpenAIResponses: StreamFunction<"azure-openai-responses", SimpleStreamOptions>;
declare function normalizeAzureBaseUrl(baseUrl: string): string;
declare function resolveAzureConfig(model: Model<"azure-openai-responses">, options?: AzureOpenAIResponsesOptions): {
    baseUrl: string;
    apiVersion: string;
};
export declare const testing: {
    isOpenAICompatibleAzureResponsesBaseUrl: typeof isOpenAICompatibleAzureResponsesBaseUrl;
    normalizeAzureBaseUrl: typeof normalizeAzureBaseUrl;
    resolveAzureConfig: typeof resolveAzureConfig;
};
export {};
