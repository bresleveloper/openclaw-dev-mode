/**
 * Configured binding registry.
 *
 * Primes, counts, and resolves compiled binding records from config and conversation facts.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ConversationRef } from "../../infra/outbound/session-binding-service.js";
import type { ConfiguredBindingRecordResolution, ConfiguredBindingResolution } from "./binding-types.js";
/**
 * Warms and counts the compiled configured binding registry for a config snapshot.
 */
export declare function primeConfiguredBindingRegistry(params: {
    cfg: OpenClawConfig;
}): {
    bindingCount: number;
    channelCount: number;
};
/**
 * Resolves a configured binding record from explicit channel/account/conversation ids.
 */
export declare function resolveConfiguredBindingRecord(params: {
    cfg: OpenClawConfig;
    channel: string;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
}): ConfiguredBindingRecordResolution | null;
/**
 * Resolves a configured binding record from a normalized conversation reference.
 */
export declare function resolveConfiguredBindingRecordForConversation(params: {
    cfg: OpenClawConfig;
    conversation: ConversationRef;
}): ConfiguredBindingRecordResolution | null;
/**
 * Resolves the full configured binding match, including compiled rule and match diagnostics.
 */
export declare function resolveConfiguredBinding(params: {
    cfg: OpenClawConfig;
    conversation: ConversationRef;
}): ConfiguredBindingResolution | null;
/**
 * Resolves a configured binding record by the stateful target session key.
 */
export declare function resolveConfiguredBindingRecordBySessionKey(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
}): ConfiguredBindingRecordResolution | null;
