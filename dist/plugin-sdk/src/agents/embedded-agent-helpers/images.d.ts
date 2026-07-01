/**
 * Sanitizes historical embedded-agent message images and empty content blocks.
 */
import type { ImageSanitizationLimits } from "../image-sanitization.js";
import type { AgentMessage } from "../runtime/index.js";
import type { ToolCallIdMode } from "../tool-call-id.js";
/** Resize/remove unsafe image payloads while keeping transcript turns valid. */
export declare function sanitizeSessionMessagesImages(messages: AgentMessage[], label: string, options?: {
    sanitizeMode?: "full" | "images-only";
    sanitizeToolCallIds?: boolean;
    preserveNativeAnthropicToolUseIds?: boolean;
    duplicateToolCallIdStyle?: "openai";
    /**
     * Mode for tool call ID sanitization:
     * - "strict" (alphanumeric only)
     * - "strict9" (alphanumeric only, length 9)
     */
    toolCallIdMode?: ToolCallIdMode;
    preserveSignatures?: boolean;
    sanitizeThoughtSignatures?: {
        allowBase64Only?: boolean;
        includeCamelCase?: boolean;
    };
} & ImageSanitizationLimits): Promise<AgentMessage[]>;
