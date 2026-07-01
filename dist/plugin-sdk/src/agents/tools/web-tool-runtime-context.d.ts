/**
 * Late-bound runtime context for web fetch/search tools.
 *
 * Resolves active secrets/runtime provider metadata for long-lived tool instances.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { RuntimeWebFetchMetadata, RuntimeWebSearchMetadata } from "../../secrets/runtime-web-tools.types.js";
type WebProviderRuntimeMetadata = RuntimeWebFetchMetadata | RuntimeWebSearchMetadata;
type ResolvedWebToolRuntimeContext<TMetadata extends WebProviderRuntimeMetadata> = {
    config?: OpenClawConfig;
    preferRuntimeProviders: boolean;
    runtimeMetadata?: TMetadata;
};
/** Resolves runtime provider context for the web_search tool. */
export declare function resolveWebSearchToolRuntimeContext(params: {
    config?: OpenClawConfig;
    lateBindRuntimeConfig?: boolean;
    runtimeWebSearch?: RuntimeWebSearchMetadata;
}): ResolvedWebToolRuntimeContext<RuntimeWebSearchMetadata> & {
    runtimeWebSearch?: RuntimeWebSearchMetadata;
};
/** Resolves runtime provider context for the web_fetch tool. */
export declare function resolveWebFetchToolRuntimeContext(params: {
    config?: OpenClawConfig;
    lateBindRuntimeConfig?: boolean;
    runtimeWebFetch?: RuntimeWebFetchMetadata;
}): ResolvedWebToolRuntimeContext<RuntimeWebFetchMetadata> & {
    runtimeWebFetch?: RuntimeWebFetchMetadata;
};
export {};
