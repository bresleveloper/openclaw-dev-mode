import { Zb as ProviderPlugin, cx as CliBackendPlugin } from "../../config-contracts-hzlacViZ.js";
import "../../provider-model-shared-OQQj5XdR.js";
import { a as resolveAnthropicFastMode, i as resolveAnthropicBetas, n as createAnthropicFastModeWrapper, o as resolveAnthropicServiceTier, r as createAnthropicServiceTierWrapper, s as wrapAnthropicProviderStream, t as createAnthropicBetaHeadersWrapper } from "../../stream-wrappers-BYI8fqv_.js";
export declare const CLAUDE_CLI_BACKEND_ID = "claude-cli";
export declare function isClaudeCliProvider(providerId: string): boolean;
export declare function buildAnthropicCliBackend(options?: {
  ensureDynamicSystemPromptSectionsSupport?: () => Promise<void>;
  supportsDynamicSystemPromptSections?: () => boolean;
}): CliBackendPlugin;
export declare function buildAnthropicProvider(): ProviderPlugin;
export { createAnthropicBetaHeadersWrapper, createAnthropicFastModeWrapper, createAnthropicServiceTierWrapper, resolveAnthropicBetas, resolveAnthropicFastMode, resolveAnthropicServiceTier, wrapAnthropicProviderStream };