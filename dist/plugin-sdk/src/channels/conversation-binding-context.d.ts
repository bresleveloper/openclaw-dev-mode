/**
 * Conversation-binding key resolver shared by plugin commands and reply/session actions.
 * Binding keys must use canonical routing ids so focus/unfocus targets survive aliases and hints.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type ResolveCommandConversationResolutionInput } from "./conversation-resolution.js";
/** Canonical identity tuple used as the stable key for conversation binding state. */
type ConversationBindingContext = {
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
    threadId?: string;
};
type ResolveConversationBindingContextInput = Omit<ResolveCommandConversationResolutionInput, "includePlacementHint"> & {
    cfg: OpenClawConfig;
};
/**
 * Resolves the canonical channel/account/conversation tuple used for conversation bindings.
 */
export declare function resolveConversationBindingContext(params: ResolveConversationBindingContextInput): ConversationBindingContext | null;
export {};
