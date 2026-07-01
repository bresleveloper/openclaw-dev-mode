import { type VerboseLevel } from "../thinking.js";
import type { ReplyPayload } from "../types.js";
import type { TypingSignaler } from "./typing-mode.js";
/** Returns true when a payload carries audio media. */
export declare const isAudioPayload: (payload: ReplyPayload) => boolean;
type VerboseGateParams = {
    sessionKey?: string;
    storePath?: string;
    resolvedVerboseLevel: VerboseLevel;
};
/** Creates the visibility gate for tool result summaries. */
export declare const createShouldEmitToolResult: (params: VerboseGateParams) => (() => boolean);
/** Creates the visibility gate for command/tool output streams. */
export declare const createShouldEmitToolOutput: (params: VerboseGateParams) => (() => boolean);
/** Sends typing signals for visible text payloads when typing is enabled. */
export declare const signalTypingIfNeeded: (payloads: ReplyPayload[], typingSignals: TypingSignaler) => Promise<void>;
export {};
