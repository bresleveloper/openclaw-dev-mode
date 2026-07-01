import type { SourceReplyDeliveryMode } from "../auto-reply/get-reply-options.types.js";
import type { ReasoningLevel, ThinkLevel } from "../auto-reply/thinking.js";
import type { SubagentDelegationMode } from "../config/types.agent-defaults.js";
import type { MemoryCitationsMode } from "../config/types.memory.js";
import type { AgentPromptSurfaceKind } from "../plugins/types.js";
import type { ActiveProcessSessionReference } from "./bash-process-references.js";
import type { BootstrapMode } from "./bootstrap-mode.js";
import type { ResolvedTimeFormat } from "./date-time.js";
import type { EmbeddedContextFile } from "./embedded-agent-helpers.js";
import type { EmbeddedSandboxInfo } from "./embedded-agent-runner/types.js";
import type { ProviderSystemPromptContribution } from "./system-prompt-contribution.js";
import type { PromptMode, SilentReplyPromptMode } from "./system-prompt.types.js";
/**
 * Controls which hardcoded sections are included in the system prompt.
 * - "full": All sections (default, for main agent)
 * - "minimal": Reduced sections (Tooling, Workspace, Runtime) - used for subagents
 * - "none": Just basic identity line, no sections
 */
type OwnerIdDisplay = "raw" | "hash";
export declare function buildAgentBootstrapSystemContext(params: {
    bootstrapMode?: BootstrapMode;
    hasBootstrapFileInProjectContext?: boolean;
}): string[];
export declare function buildAgentBootstrapSystemPromptSections(params: {
    bootstrapMode?: BootstrapMode;
    bootstrapTruncationNotice?: string;
    contextFiles?: EmbeddedContextFile[];
}): string[];
export declare function buildModelIdentityPromptLine(model?: string): string | undefined;
export declare function appendModelIdentitySystemPrompt(params: {
    systemPrompt: string;
    model?: string;
}): string;
export declare function buildAgentSystemPrompt(params: {
    workspaceDir: string;
    defaultThinkLevel?: ThinkLevel;
    reasoningLevel?: ReasoningLevel;
    extraSystemPrompt?: string;
    ownerNumbers?: string[];
    ownerDisplay?: OwnerIdDisplay;
    ownerDisplaySecret?: string;
    reasoningTagHint?: boolean;
    toolNames?: string[];
    /** Callable tool names used for capability guidance without listing them as visible tools. */
    capabilityToolNames?: string[];
    toolSummaries?: Record<string, string>;
    modelAliasLines?: string[];
    userTimezone?: string;
    userTime?: string;
    userTimeFormat?: ResolvedTimeFormat;
    contextFiles?: EmbeddedContextFile[];
    bootstrapMode?: BootstrapMode;
    bootstrapTruncationNotice?: string;
    skillsPrompt?: string;
    heartbeatPrompt?: string;
    docsPath?: string;
    sourcePath?: string;
    workspaceNotes?: string[];
    ttsHint?: string;
    /** Controls which hardcoded sections to include. Defaults to "full". */
    promptMode?: PromptMode;
    /** Controls the generic silent-reply section. Channel-aware prompts can set "none". */
    silentReplyPromptMode?: SilentReplyPromptMode;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    requireExplicitMessageTarget?: boolean;
    /** Prompt-only strength for delegating non-trivial work through sub-agents. Defaults to "suggest". */
    subagentDelegationMode?: SubagentDelegationMode;
    /** Whether ACP-specific routing guidance should be included. Defaults to true. */
    acpEnabled?: boolean;
    /** Prompt surface controls runtime-specific fallback fragments. Defaults to OpenClaw main. */
    promptSurface?: AgentPromptSurfaceKind;
    /** Registered runtime slash/native command names such as `codex`. */
    nativeCommandNames?: string[];
    /** Plugin-owned prompt guidance for registered native slash commands. */
    nativeCommandGuidanceLines?: string[];
    runtimeInfo?: {
        agentId?: string;
        sessionKey?: string;
        sessionId?: string;
        host?: string;
        os?: string;
        arch?: string;
        node?: string;
        model?: string;
        defaultModel?: string;
        shell?: string;
        channel?: string;
        chatType?: string;
        capabilities?: string[];
        repoRoot?: string;
        activeProcessSessions?: ActiveProcessSessionReference[];
    };
    messageToolHints?: string[];
    toolSchemaDirectoryPrompt?: string;
    sandboxInfo?: EmbeddedSandboxInfo;
    /** Whether read/write/edit/apply_patch are restricted to the workspace root. */
    fsWorkspaceOnly?: boolean;
    /** Reaction guidance for the agent (for Telegram minimal/extensive modes). */
    reactionGuidance?: {
        level: "minimal" | "extensive";
        channel: string;
    };
    includeMemorySection?: boolean;
    memoryCitationsMode?: MemoryCitationsMode;
    promptContribution?: ProviderSystemPromptContribution;
}): string;
export declare function buildRuntimeLine(runtimeInfo?: {
    agentId?: string;
    sessionKey?: string;
    sessionId?: string;
    host?: string;
    os?: string;
    arch?: string;
    node?: string;
    model?: string;
    defaultModel?: string;
    shell?: string;
    repoRoot?: string;
    activeProcessSessions?: ActiveProcessSessionReference[];
}, runtimeChannel?: string, runtimeCapabilities?: string[], defaultThinkLevel?: ThinkLevel): string;
export {};
