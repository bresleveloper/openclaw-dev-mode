import "../../types.openclaw-DA3BMvaX.js";
import { i as ProviderPlugin, t as CliBackendPlugin } from "../../cli-backend.types-BeWYryLP.js";
import "../../health-CmgFZOuS.js";
import { a as resolveAnthropicFastMode, i as resolveAnthropicBetas, n as createAnthropicFastModeWrapper, o as resolveAnthropicServiceTier, r as createAnthropicServiceTierWrapper, s as wrapAnthropicProviderStream, t as createAnthropicBetaHeadersWrapper } from "../../stream-wrappers-CJUI2Mz4.js";
import "@openclaw/ai/internal/tool-schema";
//#region extensions/anthropic/cli-constants.d.ts
export declare const CLAUDE_CLI_BACKEND_ID = "claude-cli";
//#endregion
//#region extensions/anthropic/cli-shared.d.ts
export declare function isClaudeCliProvider(providerId: string): boolean;
//#endregion
//#region extensions/anthropic/cli-backend.d.ts
export declare function buildAnthropicCliBackend(options?: {
  ensureDynamicSystemPromptSectionsSupport?: () => Promise<void>;
  supportsDynamicSystemPromptSections?: () => boolean;
}): CliBackendPlugin;
//#endregion
//#region extensions/anthropic/register.runtime.d.ts
export declare function buildAnthropicProvider(): ProviderPlugin;
//#endregion
export { createAnthropicBetaHeadersWrapper, createAnthropicFastModeWrapper, createAnthropicServiceTierWrapper, resolveAnthropicBetas, resolveAnthropicFastMode, resolveAnthropicServiceTier, wrapAnthropicProviderStream };