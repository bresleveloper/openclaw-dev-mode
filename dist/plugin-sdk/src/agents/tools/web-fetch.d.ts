import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { type LookupFn } from "../../infra/net/ssrf.js";
import type { RuntimeWebFetchMetadata } from "../../secrets/runtime-web-tools.types.js";
import type { AnyAgentTool } from "./common.js";
/**
 * Sanitize a web_fetch URL parameter that may contain LLM-injected whitespace.
 *
 * Fixes the reported case where a model emits a space between the scheme and
 * authority (e.g. `https:// docs.openclaw.ai`), which causes `new URL()` to
 * throw. Path and query whitespace is intentionally preserved — the WHATWG URL
 * parser percent-encodes those characters correctly per RFC 3986.
 */
export declare function sanitizeWebFetchUrl(raw: string): string;
export declare function createWebFetchTool(options?: {
    config?: OpenClawConfig;
    sandboxed?: boolean;
    runtimeWebFetch?: RuntimeWebFetchMetadata;
    lateBindRuntimeConfig?: boolean;
    lookupFn?: LookupFn;
}): AnyAgentTool | null;
