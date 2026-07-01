import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { AssistantMessage } from "../../llm/types.js";
import { type ToolModelConfig } from "./model-config.helpers.js";
/** Image tool model config uses the shared tool model config shape. */
export type ImageModelConfig = ToolModelConfig;
/** Detects provider responses that contain only reasoning blocks and no usable image text. */
export declare function hasImageReasoningOnlyResponse(message: AssistantMessage): boolean;
/** Decodes a base64 image data URL with optional decoded-size protection. */
export declare function decodeDataUrl(dataUrl: string, opts?: {
    maxBytes?: number;
}): {
    buffer: Buffer;
    mimeType: string;
    kind: "image";
};
/** Extracts assistant text or throws a provider/model-specific image failure. */
export declare function coerceImageAssistantText(params: {
    message: AssistantMessage;
    provider: string;
    model: string;
}): string;
/** Reads imageModel defaults from config into the shared tool model config shape. */
export declare function coerceImageModelConfig(cfg?: OpenClawConfig): ImageModelConfig;
/** Resolves providerless configured image model refs against configured provider models. */
export declare function resolveConfiguredImageModelRefs(params: {
    cfg?: OpenClawConfig;
    imageModelConfig: ImageModelConfig;
}): ImageModelConfig;
/** Returns the configured vision-capable model for a provider, if present. */
export declare function resolveProviderVisionModelFromConfig(params: {
    cfg?: OpenClawConfig;
    provider: string;
}): string | null;
