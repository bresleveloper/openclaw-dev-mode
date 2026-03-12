import type { StreamFn } from "@mariozechner/pi-agent-core";
type CacheRetention = "none" | "short" | "long";
export declare function resolveCacheRetention(extraParams: Record<string, unknown> | undefined, provider: string): CacheRetention | undefined;
export declare function resolveAnthropicBetas(extraParams: Record<string, unknown> | undefined, provider: string, modelId: string): string[] | undefined;
export declare function createAnthropicBetaHeadersWrapper(baseStreamFn: StreamFn | undefined, betas: string[]): StreamFn;
export declare function createAnthropicToolPayloadCompatibilityWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
export declare function createBedrockNoCacheWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
export declare function isAnthropicBedrockModel(modelId: string): boolean;
export {};
