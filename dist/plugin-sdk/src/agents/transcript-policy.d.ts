import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ProviderRuntimePluginHandle } from "../plugins/provider-hook-runtime.js";
import type { ProviderRuntimeModel } from "../plugins/provider-runtime-model.types.js";
import type { ToolCallIdMode } from "./tool-call-id.js";
/** Scope of transcript content sanitization before provider replay. */
type TranscriptSanitizeMode = "full" | "images-only";
/** Effective replay policy applied before sending transcript history to a provider. */
export type TranscriptPolicy = {
    sanitizeMode: TranscriptSanitizeMode;
    sanitizeToolCallIds: boolean;
    toolCallIdMode?: ToolCallIdMode;
    duplicateToolCallIdStyle?: "openai";
    preserveNativeAnthropicToolUseIds: boolean;
    repairToolUseResultPairing: boolean;
    preserveSignatures: boolean;
    sanitizeThoughtSignatures?: {
        allowBase64Only?: boolean;
        includeCamelCase?: boolean;
    };
    sanitizeThinkingSignatures: boolean;
    dropThinkingBlocks: boolean;
    dropReasoningFromHistory?: boolean;
    applyGoogleTurnOrdering: boolean;
    validateGeminiTurns: boolean;
    validateAnthropicTurns: boolean;
    allowSyntheticToolResults: boolean;
};
/** Return true when a provider family owns signed thinking blocks. */
export declare function providerRequiresSignedThinking(provider?: string | null): boolean;
/** Decide whether signed thinking can be replayed under the current provider policy. */
export declare function shouldAllowProviderOwnedThinkingReplay(params: {
    modelApi?: string | null;
    provider?: string | null;
    policy: Pick<TranscriptPolicy, "validateAnthropicTurns" | "preserveSignatures" | "dropThinkingBlocks">;
}): boolean;
/** Resolve and cache the effective replay policy for a provider/model/config tuple. */
export declare function resolveTranscriptPolicy(params: {
    modelApi?: string | null;
    provider?: string | null;
    modelId?: string | null;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
    model?: ProviderRuntimeModel;
    runtimeHandle?: ProviderRuntimePluginHandle;
}): TranscriptPolicy;
export {};
