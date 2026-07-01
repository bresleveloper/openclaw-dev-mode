import { type ParsedThreadSessionSuffix } from "../../sessions/session-key-utils.js";
/**
 * Resolves thread suffix metadata using loaded plugin hooks or generic parsing.
 */
export declare function resolveLoadedSessionThreadInfo(sessionKey: string | undefined | null): ParsedThreadSessionSuffix;
