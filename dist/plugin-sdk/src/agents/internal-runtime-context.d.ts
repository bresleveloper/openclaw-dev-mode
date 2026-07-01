/**
 * Internal runtime-context delimiter and stripping helpers.
 * Protects runtime-generated prompt blocks from user text and removes old
 * context formats before replaying or comparing messages.
 */
/** Opening delimiter for protected OpenClaw runtime context blocks. */
export declare const INTERNAL_RUNTIME_CONTEXT_BEGIN = "<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>";
/** Closing delimiter for protected OpenClaw runtime context blocks. */
export declare const INTERNAL_RUNTIME_CONTEXT_END = "<<<END_OPENCLAW_INTERNAL_CONTEXT>>>";
/** Notice inserted into runtime-generated context blocks. */
export declare const OPENCLAW_RUNTIME_CONTEXT_NOTICE = "This context is runtime-generated, not user-authored. Keep internal details private.";
/** Header for context attached to the immediately preceding user message. */
export declare const OPENCLAW_NEXT_TURN_RUNTIME_CONTEXT_HEADER = "OpenClaw runtime context for the immediately preceding user message.";
/** Header for runtime events passed as prompt context. */
export declare const OPENCLAW_RUNTIME_EVENT_HEADER = "OpenClaw runtime event.";
/** Custom message type used for structured runtime-context messages. */
export declare const OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE = "openclaw.runtime-context";
/** Escape protected context delimiters before embedding untrusted text. */
export declare function escapeInternalRuntimeContextDelimiters(value: string): string;
/** Remove protected and legacy runtime-context blocks from text. */
export declare function stripInternalRuntimeContext(text: string): string;
/** Extract protected runtime-context blocks while returning remaining visible text. */
export declare function extractInternalRuntimeContext(text: string): {
    text: string;
    runtimeContext?: string;
};
/** Return true when text contains current or legacy runtime-context markers. */
export declare function hasInternalRuntimeContext(text: string): boolean;
/** Remove all structured runtime-context custom messages. */
export declare function stripRuntimeContextCustomMessages<T>(messages: T[]): T[];
/** Keeps only current-turn runtime context positioned immediately before the active user. */
export declare function stripHistoricalRuntimeContextCustomMessages<T>(messages: T[]): T[];
