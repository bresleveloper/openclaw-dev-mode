/**
 * Public Codex native web-search facade. It re-exports core activation helpers
 * and reports whether native search matters for the configured agent model.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
export { buildCodexNativeWebSearchTool, patchCodexNativeWebSearchPayload, resolveCodexNativeSearchActivation, shouldSuppressManagedWebSearchTool, } from "./codex-native-web-search-core.js";
export { describeCodexNativeWebSearch, resolveCodexNativeWebSearchConfig, } from "./codex-native-web-search.shared.js";
/** True when Codex native web search should appear relevant for an agent. */
export declare function isCodexNativeWebSearchRelevant(params: {
    config: OpenClawConfig;
    agentId?: string;
    agentDir?: string;
}): boolean;
