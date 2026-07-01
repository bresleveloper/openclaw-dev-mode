import { resolveOpenAITextVerbosity, type OpenAITextVerbosity } from "../../../agents/openai-text-verbosity.js";
import type { StreamFn } from "../../../agents/runtime/index.js";
import type { SandboxToolPolicy } from "../../../agents/sandbox.js";
import type { ThinkLevel } from "../../../auto-reply/thinking.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
type OpenAIServiceTier = "auto" | "default" | "flex" | "priority";
type DynamicFastMode = boolean | (() => boolean | undefined);
export { resolveOpenAITextVerbosity };
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function resolveOpenAIServiceTier(extraParams: Record<string, unknown> | undefined): OpenAIServiceTier | undefined;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function resolveOpenAIFastMode(extraParams: Record<string, unknown> | undefined): boolean | undefined;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAIResponsesContextManagementWrapper(baseStreamFn: StreamFn | undefined, extraParams: Record<string, unknown> | undefined): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAIReasoningCompatibilityWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAIStringContentWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAICompletionsStrictMessageKeysWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAICompletionsToolsCompatWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAIThinkingLevelWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: ThinkLevel): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAIFastModeWrapper(baseStreamFn: StreamFn | undefined, enabled?: DynamicFastMode): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAIServiceTierWrapper(baseStreamFn: StreamFn | undefined, serviceTier: OpenAIServiceTier): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAITextVerbosityWrapper(baseStreamFn: StreamFn | undefined, verbosity: OpenAITextVerbosity): StreamFn;
/** @deprecated OpenAI Codex provider-owned stream helper; do not use from third-party plugins. */
export declare function createCodexNativeWebSearchWrapper(baseStreamFn: StreamFn | undefined, params: {
    config?: OpenClawConfig;
    agentDir?: string;
    agentId?: string;
    sessionKey?: string;
    sandboxToolPolicy?: SandboxToolPolicy;
    messageProvider?: string;
    agentAccountId?: string | null;
    groupId?: string | null;
    groupChannel?: string | null;
    groupSpace?: string | null;
    spawnedBy?: string | null;
    senderId?: string | null;
    senderName?: string | null;
    senderUsername?: string | null;
    senderE164?: string | null;
    nativeWebSearchAllowedByToolPolicy?: boolean;
    codeModeToolSurfaceEnabled?: boolean;
}): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAIDefaultTransportWrapper(baseStreamFn: StreamFn | undefined): StreamFn;
/** @deprecated OpenAI provider-owned stream helper; do not use from third-party plugins. */
export declare function createOpenAIAttributionHeadersWrapper(baseStreamFn: StreamFn | undefined, opts?: {
    codexNativeTransportStreamFn?: StreamFn;
}): StreamFn;
