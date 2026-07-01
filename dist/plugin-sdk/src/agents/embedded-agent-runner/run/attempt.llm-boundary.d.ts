import type { AgentMessage } from "../../runtime/index.js";
import type { RuntimeContextCustomMessage } from "./runtime-context-prompt.js";
type LlmBoundaryOptions = {
    timezone?: string;
    includeTimestamp?: boolean;
    currentUserTimestampOverride?: {
        timestamp: number;
        text: string;
        alternateText?: string;
        runtimeTimestamp?: number;
    };
};
export declare function normalizeMessagesForLlmBoundary(messages: AgentMessage[], options?: LlmBoundaryOptions): AgentMessage[];
/** Normalizes existing transcript messages as if the current prompt were appended last. */
export declare function normalizeMessagesForCurrentPromptBoundary(params: {
    messages: AgentMessage[];
    prompt: string;
    timezone?: string;
    includeTimestamp?: boolean;
    currentUserTimestamp?: number;
}): AgentMessage[];
export declare function normalizeCurrentPromptTextForLlmBoundary(params: {
    prompt: string;
    timezone?: string;
    includeTimestamp?: boolean;
    currentUserTimestamp?: number;
}): string;
/**
 * Temporarily injects a runtime-context message for prompt conversion and retry.
 * Cleanup restores the original continuation hook and removes only the injected
 * message object.
 */
export declare function installRuntimeContextMessageForPrompt(params: {
    session: {
        messages: AgentMessage[];
        agent: {
            state: {
                messages: AgentMessage[];
            };
            continue?: () => Promise<void>;
        };
    };
    message?: RuntimeContextCustomMessage;
}): () => void;
/**
 * Inserts runtime context before the active user turn on retry. Overflow rebuilds
 * can rehydrate a transcript ending in tool-call messages, so the active prompt
 * is found by walking backward through tool-call assistants.
 */
export declare function insertRuntimeContextMessageForPrompt(params: {
    message: RuntimeContextCustomMessage;
    messages: AgentMessage[];
}): AgentMessage[];
/**
 * Temporarily rewrites only the active user prompt for model submission while
 * preserving the transcript prompt text for repair/guard metadata.
 */
export declare function installModelPromptTransform(params: {
    session: {
        agent: {
            transformContext?: (messages: AgentMessage[], signal?: AbortSignal) => Promise<AgentMessage[]>;
        };
    };
    transcriptPrompt: string;
    modelPrompt?: string;
    prependContext?: string;
    appendContext?: string;
    shouldCapturePrompt: () => boolean;
}): () => void;
export {};
