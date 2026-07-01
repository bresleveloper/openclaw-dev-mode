import type { OpenClawConfig } from "../config/types.openclaw.js";
/** Whether native Codex search may use cached or live external web access. */
export type CodexNativeSearchMode = "cached" | "live";
/** OpenAI search context-size hint for Codex native web search. */
export type CodexNativeSearchContextSize = "low" | "medium" | "high";
/** Optional approximate user location for Codex native web search. */
export type CodexNativeSearchUserLocation = {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
};
/** Normalized Codex native web-search settings. */
export type ResolvedCodexNativeWebSearchConfig = {
    enabled: boolean;
    mode: CodexNativeSearchMode;
    allowedDomains?: string[];
    contextSize?: CodexNativeSearchContextSize;
    userLocation?: CodexNativeSearchUserLocation;
};
/** Resolve Codex native web-search config from OpenClaw tool settings. */
export declare function resolveCodexNativeWebSearchConfig(config: OpenClawConfig | undefined): ResolvedCodexNativeWebSearchConfig;
/** Return concise prompt/status text for enabled Codex native search. */
export declare function describeCodexNativeWebSearch(config: OpenClawConfig | undefined): string | undefined;
