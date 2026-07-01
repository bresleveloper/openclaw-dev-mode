import type { CompactEmbeddedAgentSessionParams } from "./compact.types.js";
import type { EmbeddedAgentCompactResult } from "./types.js";
/**
 * Compacts a session with lane queueing (session lane + global lane).
 * Use this from outside a lane context. If already inside a lane, use
 * `compactEmbeddedAgentSessionDirect` to avoid deadlocks.
 */
export declare function compactEmbeddedAgentSession(params: CompactEmbeddedAgentSessionParams): Promise<EmbeddedAgentCompactResult>;
