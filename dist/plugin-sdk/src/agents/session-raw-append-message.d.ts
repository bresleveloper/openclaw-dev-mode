/**
 * Stores and retrieves an unguarded SessionManager appendMessage function.
 * Transcript repair paths use this symbol slot to bypass wrappers without
 * changing the public SessionManager interface.
 */
import type { SessionManager } from "./sessions/index.js";
/** Return the unguarded appendMessage implementation for a session manager. */
export declare function getRawSessionAppendMessage(sessionManager: SessionManager): SessionManager["appendMessage"];
/** Stores the unguarded appendMessage implementation on a session manager. */
export declare function setRawSessionAppendMessage(sessionManager: SessionManager, appendMessage: SessionManager["appendMessage"]): void;
