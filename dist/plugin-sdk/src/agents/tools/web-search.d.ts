/**
 * web_search built-in tool.
 *
 * Runs the configured runtime provider and returns normalized cached search results.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { RuntimeWebSearchMetadata } from "../../secrets/runtime-web-tools.types.js";
import { resolveWebSearchProviderId } from "../../web-search/runtime.js";
import type { AnyAgentTool } from "./common.js";
/** Creates the `web_search` tool, or `null` when web search is disabled by config. */
export declare function createWebSearchTool(options?: {
    config?: OpenClawConfig;
    agentDir?: string;
    sandboxed?: boolean;
    runtimeWebSearch?: RuntimeWebSearchMetadata;
    lateBindRuntimeConfig?: boolean;
}): AnyAgentTool | null;
export declare const testing: {
    SEARCH_CACHE: Map<string, import("./web-shared.ts").CacheEntry<Record<string, unknown>>>;
    resolveSearchProvider: (search?: Parameters<typeof resolveWebSearchProviderId>[0]["search"]) => string;
};
export { testing as __testing };
