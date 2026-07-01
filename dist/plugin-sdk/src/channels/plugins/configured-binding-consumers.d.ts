/**
 * Configured binding consumer registry.
 *
 * Stores target-family consumers that compile and materialize configured binding rules.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { CompiledConfiguredBinding, ConfiguredBindingRecordResolution, ConfiguredBindingRuleConfig, ConfiguredBindingTargetFactory } from "./binding-types.js";
import type { ChannelConfiguredBindingConversationRef } from "./types.adapters.js";
/**
 * Parsed session-key facts used by configured binding consumers.
 */
export type ParsedConfiguredBindingSessionKey = {
    channel: string;
    accountId: string;
};
/**
 * Consumer that knows how to compile and materialize one configured binding target family.
 */
export type ConfiguredBindingConsumer = {
    id: string;
    supports: (binding: ConfiguredBindingRuleConfig) => boolean;
    buildTargetFactory: (params: {
        cfg: OpenClawConfig;
        binding: ConfiguredBindingRuleConfig;
        channel: string;
        agentId: string;
        target: ChannelConfiguredBindingConversationRef;
        bindingConversationId: string;
    }) => ConfiguredBindingTargetFactory | null;
    parseSessionKey?: (params: {
        sessionKey: string;
    }) => ParsedConfiguredBindingSessionKey | null;
    matchesSessionKey?: (params: {
        sessionKey: string;
        compiledBinding: CompiledConfiguredBinding;
        accountId: string;
        materializedTarget: ConfiguredBindingRecordResolution;
    }) => boolean;
};
/**
 * Lists registered configured binding consumers in registration order.
 */
export declare function listConfiguredBindingConsumers(): ConfiguredBindingConsumer[];
/**
 * Finds the first configured binding consumer that supports a raw binding rule.
 */
export declare function resolveConfiguredBindingConsumer(binding: ConfiguredBindingRuleConfig): ConfiguredBindingConsumer | null;
/**
 * Registers a configured binding consumer idempotently by trimmed id.
 */
export declare function registerConfiguredBindingConsumer(consumer: ConfiguredBindingConsumer): void;
