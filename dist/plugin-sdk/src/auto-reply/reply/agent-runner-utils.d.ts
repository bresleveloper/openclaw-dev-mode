import type { ChannelId, ChannelThreadingToolContext } from "../../channels/plugins/types.public.js";
import { type OpenClawConfig } from "../../config/config.js";
import type { SessionEntry } from "../../config/sessions.js";
import type { TemplateContext } from "../templating.js";
import { resolveProviderScopedAuthProfile, resolveRunAuthProfile } from "./agent-runner-auth-profile.js";
export { resolveProviderScopedAuthProfile, resolveRunAuthProfile };
import { buildEmbeddedRunBaseParams as buildEmbeddedRunBaseParamsCore } from "./agent-runner-run-params.js";
export { resolveModelFallbackOptions } from "./agent-runner-run-params.js";
import type { FollowupRun } from "./queue.js";
type EmbeddedReplyRoute = Pick<FollowupRun, "originatingChannel" | "originatingTo" | "originatingAccountId" | "originatingChatType" | "originatingThreadId" | "originatingReplyToId">;
/** Selects the freshest runtime config usable by queued reply execution. */
export declare function resolveQueuedReplyRuntimeConfig(config: OpenClawConfig): OpenClawConfig;
/** Resolves command secrets for queued reply execution, scoped to the origin route. */
export declare function resolveQueuedReplyExecutionConfig(config: OpenClawConfig, params?: {
    originatingChannel?: string;
    messageProvider?: string;
    originatingAccountId?: string;
    agentAccountId?: string;
}): Promise<OpenClawConfig>;
/**
 * Build provider-specific threading context for tool auto-injection.
 */
/** Builds channel threading context for message-tool replies. */
export declare function buildThreadingToolContext(params: {
    sessionCtx: TemplateContext;
    config: OpenClawConfig | undefined;
    hasRepliedRef: {
        value: boolean;
    } | undefined;
}): ChannelThreadingToolContext;
/** Detects Bun socket-close errors that should be formatted more clearly. */
export declare const isBunFetchSocketError: (message?: string) => boolean;
/** Formats Bun socket-close errors for user-facing reply output. */
export declare const formatBunFetchSocketError: (message: string) => string;
/** Resolves candidate-scoped fast mode after model fallback changes provider/model. */
export declare function resolveRunFastModeForFallbackCandidate(params: {
    run: FollowupRun["run"];
    config: OpenClawConfig;
    provider: string;
    model: string;
    sessionEntry?: Pick<SessionEntry, "fastMode">;
}): {
    fastMode: import("@openclaw/normalization-core/string-coerce").FastMode | undefined;
    fastModeAutoOnSeconds: number | undefined;
};
/** Builds base embedded run params with auth and provider runtime hints. */
export declare function buildEmbeddedRunBaseParams(params: Parameters<typeof buildEmbeddedRunBaseParamsCore>[0]): {
    authProfileId?: string;
    authProfileIdSource?: "auto" | "user";
    sessionFile: string;
    workspaceDir: string;
    cwd: string | undefined;
    agentDir: string;
    config: OpenClawConfig;
    skillsSnapshot: import("../../skills/types.ts").SkillSnapshot | undefined;
    ownerNumbers: string[] | undefined;
    inputProvenance: import("../../sessions/input-provenance.ts").InputProvenance | undefined;
    senderIsOwner: boolean | undefined;
    channelContext: import("../../plugins/hook-channel-context.types.ts").PluginHookChannelContext | undefined;
    approvalReviewerDeviceId: string | undefined;
    enforceFinalTag: boolean;
    silentExpected: boolean | undefined;
    allowEmptyAssistantReplyAsSilent: boolean | undefined;
    silentReplyPromptMode: import("../../agents/system-prompt.types.ts").SilentReplyPromptMode | undefined;
    sourceReplyDeliveryMode: import("../get-reply-options.types.ts").SourceReplyDeliveryMode | undefined;
    provider: string;
    model: string;
    modelFallbacksOverride: string[] | undefined;
    thinkLevel: import("./directives.ts").ThinkLevel | undefined;
    fastMode: import("@openclaw/normalization-core/string-coerce").FastMode | undefined;
    fastModeAutoOnSeconds: number | undefined;
    verboseLevel: import("./directives.ts").VerboseLevel | undefined;
    reasoningLevel: import("./directives.ts").ReasoningLevel | undefined;
    execOverrides: Pick<import("../../agents/bash-tools.exec-types.ts").ExecToolDefaults, "ask" | "host" | "node" | "security"> | undefined;
    bashElevated: {
        enabled: boolean;
        allowed: boolean;
        defaultLevel: import("./directives.ts").ElevatedLevel;
    } | undefined;
    timeoutMs: number;
    runId: string;
    promptCacheKey: string | undefined;
    allowTransientCooldownProbe: boolean | undefined;
};
/** Builds execution-specific embedded run params for queued reply dispatch. */
export declare function buildEmbeddedRunExecutionParams(params: {
    run: FollowupRun["run"];
    replyRoute?: EmbeddedReplyRoute;
    sessionCtx: TemplateContext;
    hasRepliedRef: {
        value: boolean;
    } | undefined;
    provider: string;
    model: string;
    runId: string;
    promptCacheKey?: string;
    allowTransientCooldownProbe?: boolean;
}): {
    embeddedContext: {
        currentChannelId?: string;
        currentMessagingTarget?: string;
        currentGraphChannelId?: string;
        currentChannelProvider?: ChannelId;
        currentThreadTs?: string;
        currentMessageId?: string | number;
        replyToMode?: "off" | "first" | "all" | "batched";
        hasRepliedRef?: {
            value: boolean;
        };
        sameChannelThreadRequired?: boolean;
        skipCrossContextDecoration?: boolean;
        sessionId: string;
        sessionKey: string | undefined;
        sandboxSessionKey: string | undefined;
        agentId: string;
        messageProvider: string | undefined;
        chatType?: import("../../channels/chat-type.js").ChatType | undefined;
        agentAccountId: string | undefined;
        messageTo: string | undefined;
        messageThreadId: string | number | undefined;
        chatId: string | undefined;
        memberRoleIds: string[] | undefined;
        currentInboundAudio: boolean;
    };
    senderContext: {
        senderId: string | undefined;
        channelContext: import("../../plugins/hook-channel-context.types.ts").PluginHookChannelContext | undefined;
        senderName: string | undefined;
        senderUsername: string | undefined;
        senderE164: string | undefined;
    };
    runBaseParams: {
        authProfileId?: string;
        authProfileIdSource?: "auto" | "user";
        sessionFile: string;
        workspaceDir: string;
        cwd: string | undefined;
        agentDir: string;
        config: OpenClawConfig;
        skillsSnapshot: import("../../skills/types.ts").SkillSnapshot | undefined;
        ownerNumbers: string[] | undefined;
        inputProvenance: import("../../sessions/input-provenance.ts").InputProvenance | undefined;
        senderIsOwner: boolean | undefined;
        channelContext: import("../../plugins/hook-channel-context.types.ts").PluginHookChannelContext | undefined;
        approvalReviewerDeviceId: string | undefined;
        enforceFinalTag: boolean;
        silentExpected: boolean | undefined;
        allowEmptyAssistantReplyAsSilent: boolean | undefined;
        silentReplyPromptMode: import("../../agents/system-prompt.types.ts").SilentReplyPromptMode | undefined;
        sourceReplyDeliveryMode: import("../get-reply-options.types.ts").SourceReplyDeliveryMode | undefined;
        provider: string;
        model: string;
        modelFallbacksOverride: string[] | undefined;
        thinkLevel: import("./directives.ts").ThinkLevel | undefined;
        fastMode: import("@openclaw/normalization-core/string-coerce").FastMode | undefined;
        fastModeAutoOnSeconds: number | undefined;
        verboseLevel: import("./directives.ts").VerboseLevel | undefined;
        reasoningLevel: import("./directives.ts").ReasoningLevel | undefined;
        execOverrides: Pick<import("../../agents/bash-tools.exec-types.ts").ExecToolDefaults, "ask" | "host" | "node" | "security"> | undefined;
        bashElevated: {
            enabled: boolean;
            allowed: boolean;
            defaultLevel: import("./directives.ts").ElevatedLevel;
        } | undefined;
        timeoutMs: number;
        runId: string;
        promptCacheKey: string | undefined;
        allowTransientCooldownProbe: boolean | undefined;
    };
};
