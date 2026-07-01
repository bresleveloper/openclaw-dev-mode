import type { ConversationRef } from "../../infra/outbound/session-binding-service.js";
import type { CompiledConfiguredBinding, ConfiguredBindingChannel, ConfiguredBindingRecordResolution } from "./binding-types.js";
import type { ChannelConfiguredBindingConversationRef, ChannelConfiguredBindingMatch } from "./types.adapters.js";
/**
 * Ranks account pattern matches for configured binding rules.
 */
export declare function resolveAccountMatchPriority(match: string | undefined, actual: string): 0 | 1 | 2;
/**
 * Normalizes a raw channel id into a configured-binding channel id.
 */
export declare function resolveCompiledBindingChannel(raw: string): ConfiguredBindingChannel | null;
/**
 * Converts an outbound conversation ref into configured-binding match input.
 */
export declare function toConfiguredBindingConversationRef(conversation: ConversationRef): {
    channel: ConfiguredBindingChannel;
    accountId: string;
    conversationId: string;
    parentConversationId?: string;
} | null;
/**
 * Materializes a configured binding record from the winning rule and conversation.
 */
export declare function materializeConfiguredBindingRecord(params: {
    rule: CompiledConfiguredBinding;
    accountId: string;
    conversation: ChannelConfiguredBindingConversationRef;
}): ConfiguredBindingRecordResolution;
/**
 * Resolves the best configured binding rule for a conversation.
 */
export declare function resolveMatchingConfiguredBinding(params: {
    rules: CompiledConfiguredBinding[];
    conversation: ReturnType<typeof toConfiguredBindingConversationRef>;
}): {
    rule: CompiledConfiguredBinding;
    match: ChannelConfiguredBindingMatch;
} | null;
