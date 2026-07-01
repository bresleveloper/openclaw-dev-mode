import type { CurrentInboundPromptContext } from "./params.js";
type RuntimeContextPromptParts = {
    prompt: string;
    modelPrompt?: string;
    runtimeContext?: string;
    runtimeOnly?: boolean;
    runtimeSystemContext?: string;
};
/** Hidden custom transcript message that carries runtime context into model conversion. */
export type RuntimeContextCustomMessage = {
    role: "custom";
    customType: string;
    content: string;
    display: false;
    details: {
        source: "openclaw-runtime-context";
    };
    timestamp: number;
};
type EmptyTranscriptMode = "model-prompt" | "runtime-event";
/** Combines inbound context and the current prompt using the channel-provided joiner. */
export declare function buildCurrentInboundPrompt(params: {
    context: CurrentInboundPromptContext | undefined;
    prompt: string;
    preferResumableText?: boolean;
}): string;
/**
 * Separates user-authored prompt text from hidden runtime context. Transcript
 * prompt stays user-visible; model prompt may carry runtime-only additions that
 * should be delivered as hidden context instead of persisted as user text.
 */
export declare function resolveRuntimeContextPromptParts(params: {
    effectivePrompt: string;
    transcriptPrompt?: string;
    modelPrompt?: string;
    emptyTranscriptMode?: EmptyTranscriptMode;
}): RuntimeContextPromptParts;
/** Creates a non-displayed custom transcript message for runtime context, if any exists. */
export declare function buildRuntimeContextCustomMessage(runtimeContext: string | undefined): RuntimeContextCustomMessage | undefined;
export {};
