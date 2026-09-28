import { a as ProviderPlugin, t as CliBackendPlugin } from "../../cli-backend.types-kTOThe9I.js";
import "../../provider-model-shared-CP6E2ez3.js";
import { a as resolveAnthropicFastMode, i as resolveAnthropicBetas, n as createAnthropicFastModeWrapper, o as resolveAnthropicServiceTier, r as createAnthropicServiceTierWrapper, s as wrapAnthropicProviderStream, t as createAnthropicBetaHeadersWrapper } from "../../stream-wrappers-D6TGhc3e.js";
//#region extensions/anthropic/cli-constants.d.ts
/** Synthetic provider/backend id for Claude Code CLI-backed Anthropic models. */
export declare const CLAUDE_CLI_BACKEND_ID = "claude-cli";
//#endregion
//#region extensions/anthropic/cli-shared.d.ts
/** Return whether a provider id refers to the Claude CLI backend. */
export declare function isClaudeCliProvider(providerId: string): boolean;
//#endregion
//#region extensions/anthropic/cli-backend.d.ts
/** Build the Claude CLI backend plugin descriptor. */
export declare function buildAnthropicCliBackend(options?: {
  ensureDynamicSystemPromptSectionsSupport?: () => Promise<void>;
  supportsDynamicSystemPromptSections?: () => boolean;
}): CliBackendPlugin;
//#endregion
//#region extensions/anthropic/register.runtime.d.ts
/** Build the full Anthropic provider descriptor used by runtime registration. */
export declare function buildAnthropicProvider(): ProviderPlugin;
//#endregion
export { createAnthropicBetaHeadersWrapper, createAnthropicFastModeWrapper, createAnthropicServiceTierWrapper, resolveAnthropicBetas, resolveAnthropicFastMode, resolveAnthropicServiceTier, wrapAnthropicProviderStream };