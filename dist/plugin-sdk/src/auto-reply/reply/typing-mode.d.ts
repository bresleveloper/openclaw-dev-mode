import type { TypingMode } from "../../config/types.js";
import type { SourceReplyDeliveryMode } from "../get-reply-options.types.js";
import type { TypingPolicy } from "../types.js";
import type { TypingController } from "./typing.js";
/** Inputs that decide when a channel typing indicator should be shown. */
export type TypingModeContext = {
    configured?: TypingMode;
    isGroupChat: boolean;
    wasMentioned: boolean;
    isHeartbeat: boolean;
    typingPolicy?: TypingPolicy;
    suppressTyping?: boolean;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
};
/** Resolves the effective typing mode for the current auto-reply turn. */
export declare function resolveTypingMode({ configured, isGroupChat, wasMentioned, isHeartbeat, typingPolicy, suppressTyping, sourceReplyDeliveryMode, }: TypingModeContext): TypingMode;
/** Event-driven typing signaler used by streaming reply dispatch. */
export type TypingSignaler = {
    mode: TypingMode;
    shouldStartImmediately: boolean;
    shouldStartOnMessageStart: boolean;
    shouldStartOnText: boolean;
    shouldStartOnReasoning: boolean;
    signalRunStart: () => Promise<void>;
    signalMessageStart: () => Promise<void>;
    signalTextDelta: (text?: string) => Promise<void>;
    signalReasoningDelta: () => Promise<void>;
    signalToolStart: () => Promise<void>;
};
/** Creates a typing signaler that starts or refreshes typing from stream events. */
export declare function createTypingSignaler(params: {
    typing: TypingController;
    mode: TypingMode;
    isHeartbeat: boolean;
}): TypingSignaler;
