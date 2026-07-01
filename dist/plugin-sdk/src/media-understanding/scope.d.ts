import type { MediaUnderstandingScopeConfig } from "../config/types.tools.js";
type MediaUnderstandingScopeDecision = "allow" | "deny";
/** Normalizes channel/direct chat type aliases used by media-understanding scope rules. */
export declare function normalizeMediaUnderstandingChatType(raw?: string | null): string | undefined;
/** Evaluates ordered media-understanding scope rules against channel, chat type, and session key. */
export declare function resolveMediaUnderstandingScope(params: {
    scope?: MediaUnderstandingScopeConfig;
    sessionKey?: string;
    channel?: string;
    chatType?: string;
}): MediaUnderstandingScopeDecision;
export {};
