/** Factory for image providers with OpenAI-compatible generation/edit endpoints. */
import type { OpenClawConfig } from "openclaw/plugin-sdk/config-contracts";
import type { ImageGenerationProvider, ImageGenerationProviderCapabilities, ImageGenerationRequest, ImageGenerationSourceImage } from "./types.js";
type ModelProviderConfig = NonNullable<NonNullable<OpenClawConfig["models"]>["providers"]>[string];
/** OpenAI-compatible image endpoint mode. */
export type OpenAiCompatibleImageRequestMode = "generate" | "edit";
export type OpenAiCompatibleImageProviderRequestParams = {
    req: ImageGenerationRequest;
    inputImages: ImageGenerationSourceImage[];
    model: string;
    count: number;
    mode: OpenAiCompatibleImageRequestMode;
};
export type OpenAiCompatibleImageProviderRequestBody = {
    kind: "json";
    body: Record<string, unknown>;
} | {
    kind: "multipart";
    form: FormData;
};
export type OpenAiCompatibleImageProviderOptions = {
    id: string;
    label: string;
    defaultModel: string;
    models: readonly string[];
    capabilities: ImageGenerationProviderCapabilities;
    defaultBaseUrl: string;
    providerConfigKey?: string;
    normalizeModel?: (model: string | undefined, fallback: string) => string;
    resolveBaseUrl?: (params: {
        req: ImageGenerationRequest;
        providerConfig?: ModelProviderConfig;
        defaultBaseUrl: string;
    }) => string;
    resolveAllowPrivateNetwork?: (params: {
        baseUrl: string;
        req: ImageGenerationRequest;
        providerConfig?: ModelProviderConfig;
    }) => boolean | undefined;
    useConfiguredRequest?: boolean;
    defaultTimeoutMs?: number;
    resolveCount?: (params: {
        req: ImageGenerationRequest;
        mode: OpenAiCompatibleImageRequestMode;
    }) => number;
    buildGenerateRequest: (params: OpenAiCompatibleImageProviderRequestParams & {
        mode: "generate";
    }) => OpenAiCompatibleImageProviderRequestBody;
    buildEditRequest: (params: OpenAiCompatibleImageProviderRequestParams & {
        mode: "edit";
    }) => OpenAiCompatibleImageProviderRequestBody;
    response?: {
        defaultMimeType?: string;
        fileNamePrefix?: string;
        sniffMimeType?: boolean;
    };
    missingApiKeyError?: string;
    tooManyInputImagesError?: string;
    missingInputImageError?: string;
    emptyResponseError?: string;
    failureLabels?: {
        generate?: string;
        edit?: string;
    };
};
/** Creates an image-generation provider backed by OpenAI-style image endpoints. */
export declare function createOpenAiCompatibleImageGenerationProvider(options: OpenAiCompatibleImageProviderOptions): ImageGenerationProvider;
export {};
