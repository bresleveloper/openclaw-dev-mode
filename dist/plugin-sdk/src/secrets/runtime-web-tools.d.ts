import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { ResolverContext } from "./runtime-shared.js";
import type { RuntimeWebDiagnostic, RuntimeWebDiagnosticCode, RuntimeWebFetchMetadata, RuntimeWebSearchMetadata, RuntimeWebToolsMetadata } from "./runtime-web-tools.types.js";
export type { RuntimeWebDiagnostic, RuntimeWebDiagnosticCode, RuntimeWebFetchMetadata, RuntimeWebSearchMetadata, RuntimeWebToolsMetadata, };
/**
 * Resolves runtime web search/fetch provider metadata and writes selected credentials into a
 * cloned runtime config without mutating the source config.
 */
/** Resolves web search/fetch secret metadata from config, plugins, and fallback runtime providers. */
export declare function resolveRuntimeWebTools(params: {
    sourceConfig: OpenClawConfig;
    resolvedConfig: OpenClawConfig;
    context: ResolverContext;
}): Promise<RuntimeWebToolsMetadata>;
