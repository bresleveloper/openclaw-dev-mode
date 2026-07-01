import type { OpenClawConfig } from "../config/types.js";
import type { MediaUnderstandingCapability, MediaUnderstandingProvider } from "./types.js";
export { CLI_OUTPUT_MAX_BUFFER, DEFAULT_MAX_BYTES, DEFAULT_MAX_CHARS, DEFAULT_MAX_CHARS_BY_CAPABILITY, DEFAULT_MEDIA_CONCURRENCY, DEFAULT_PROMPT, DEFAULT_TIMEOUT_SECONDS, DEFAULT_VIDEO_MAX_BASE64_BYTES, MIN_AUDIO_FILE_BYTES, } from "./defaults.constants.js";
/** Resolves the default provider model for a media capability from config or manifest metadata. */
export declare function resolveDefaultMediaModel(params: {
    providerId: string;
    capability: MediaUnderstandingCapability;
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    providerRegistry?: Map<string, MediaUnderstandingProvider>;
    includeConfiguredImageModels?: boolean;
}): string | undefined;
/** Resolves auto-discovery provider order for a media capability using manifest priorities. */
export declare function resolveAutoMediaKeyProviders(params: {
    capability: MediaUnderstandingCapability;
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string[];
/** Returns whether provider metadata declares native PDF document input support. */
export declare function providerSupportsNativePdfDocument(params: {
    providerId: string;
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): boolean;
/** Resolves provider-specific document model hints, preserving explicit unsupported markers. */
export declare function resolveDocumentMediaModel(params: {
    providerId: string;
    document: "pdf";
    mode: "textExtraction" | "image";
    cfg?: OpenClawConfig;
    workspaceDir?: string;
    providerRegistry?: Map<string, MediaUnderstandingProvider>;
}): string | false | undefined;
