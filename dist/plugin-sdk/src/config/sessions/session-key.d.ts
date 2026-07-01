import type { MsgContext } from "../../auto-reply/templating.js";
import type { SessionScope } from "./types.js";
/**
 * Derives the raw session bucket from message context before agent/main-key normalization.
 *
 * Direct chats use sender identity, groups use channel-owned group keys, and global scope bypasses
 * sender routing entirely.
 */
export declare function deriveSessionKey(scope: SessionScope, ctx: MsgContext): string;
/**
 * Resolves the persisted session-store key for an inbound message.
 *
 * Explicit session keys pass through the compatibility normalizer, direct chats collapse to the
 * agent's canonical main bucket, and group/channel sessions stay isolated under the same agent.
 */
export declare function resolveSessionKey(scope: SessionScope, ctx: MsgContext, mainKey?: string, agentId?: string): string;
