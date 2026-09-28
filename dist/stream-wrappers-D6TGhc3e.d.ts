import { I as StreamFn, o as ProviderWrapStreamFnContext } from "./cli-backend.types-kTOThe9I.js";
import "./moonshot-thinking-B6IQ5BVZ.js";
import "@openclaw/ai/internal/runtime";
import "@openclaw/ai/internal/shared";
import "@openclaw/ai/internal/google-model-family";
import "@openclaw/ai/internal/anthropic";
import "@openclaw/ai/transports";
//#region extensions/anthropic/fast-mode-policy.d.ts
type AnthropicServiceTier = "auto" | "standard_only";
//#endregion
//#region extensions/anthropic/stream-wrappers.d.ts
type DynamicFastMode = boolean | (() => boolean | undefined);
/** Resolve configured Anthropic beta headers from extra model params. */
declare function resolveAnthropicBetas(extraParams: Record<string, unknown> | undefined, _modelId: string): string[] | undefined;
/** Wrap a stream function to merge OpenClaw and configured Anthropic beta headers. */
declare function createAnthropicBetaHeadersWrapper(baseStreamFn: StreamFn | undefined, betas: string[]): StreamFn;
/** Wrap a stream function with native fast mode or the legacy Priority Tier mapping. */
declare function createAnthropicFastModeWrapper(baseStreamFn: StreamFn | undefined, enabled: DynamicFastMode, extraParams?: Record<string, unknown>): StreamFn;
/** Wrap a stream function with an explicit Anthropic service tier when allowed. */
declare function createAnthropicServiceTierWrapper(baseStreamFn: StreamFn | undefined, serviceTier: AnthropicServiceTier): StreamFn;
/** Resolve Anthropic fast-mode setting from model extra params. */
declare function resolveAnthropicFastMode(extraParams: Record<string, unknown> | undefined): boolean | undefined;
/** Resolve Anthropic service tier from model extra params. */
declare function resolveAnthropicServiceTier(extraParams: Record<string, unknown> | undefined): AnthropicServiceTier | undefined;
/** Compose all Anthropic stream wrappers for one provider/model context. */
declare function wrapAnthropicProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { resolveAnthropicFastMode as a, resolveAnthropicBetas as i, createAnthropicFastModeWrapper as n, resolveAnthropicServiceTier as o, createAnthropicServiceTierWrapper as r, wrapAnthropicProviderStream as s, createAnthropicBetaHeadersWrapper as t };