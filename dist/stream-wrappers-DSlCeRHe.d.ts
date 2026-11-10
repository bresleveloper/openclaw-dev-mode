import { nh as ProviderWrapStreamFnContext } from "./config-contracts-CY87ANNp.js";
import { A as StreamFn } from "./common-CCG3ut4I.js";
import "./provider-model-types-CgVL4xyM.js";
//#region extensions/anthropic/fast-mode-policy.d.ts
type AnthropicServiceTier = "auto" | "standard_only";
//#endregion
//#region extensions/anthropic/stream-wrappers.d.ts
type DynamicFastMode = boolean | (() => boolean | undefined);
declare function resolveAnthropicBetas(extraParams: Record<string, unknown> | undefined, _modelId: string): string[] | undefined;
declare function createAnthropicBetaHeadersWrapper(baseStreamFn: StreamFn | undefined, betas: string[]): StreamFn;
declare function createAnthropicFastModeWrapper(baseStreamFn: StreamFn | undefined, enabled: DynamicFastMode, extraParams?: Record<string, unknown>): StreamFn;
declare function createAnthropicServiceTierWrapper(baseStreamFn: StreamFn | undefined, serviceTier: AnthropicServiceTier): StreamFn;
declare function resolveAnthropicFastMode(extraParams: Record<string, unknown> | undefined): boolean | undefined;
declare function resolveAnthropicServiceTier(extraParams: Record<string, unknown> | undefined): AnthropicServiceTier | undefined;
declare function wrapAnthropicProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn;
//#endregion
export { resolveAnthropicFastMode as a, resolveAnthropicBetas as i, createAnthropicFastModeWrapper as n, resolveAnthropicServiceTier as o, createAnthropicServiceTierWrapper as r, wrapAnthropicProviderStream as s, createAnthropicBetaHeadersWrapper as t };