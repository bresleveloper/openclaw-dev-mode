import type { SourceReplyDeliveryMode } from "../../auto-reply/get-reply-options.types.js";
import type { ThinkLevel } from "../../auto-reply/thinking.js";
import type { ChatType } from "../../channels/chat-type.js";
import type { CliBackendConfig } from "../../config/types.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ImageContent } from "../../llm/types.js";
import type { EmbeddedContextFile } from "../embedded-agent-helpers.js";
import type { AgentTool } from "../runtime/index.js";
import type { SandboxFsBridge } from "../sandbox/fs-bridge.js";
import type { SilentReplyPromptMode } from "../system-prompt.types.js";
/** Re-export CLI reliability helpers used by older runner call sites. */
export { buildCliSupervisorScopeKey, resolveCliNoOutputTimeoutMs, resolveCliRunTimeoutOverrideMs, } from "./reliability.js";
/** Enqueues a CLI run under a backend/session key to prevent unsafe overlap. */
export declare function enqueueCliRun<T>(key: string, task: () => Promise<T>): Promise<T>;
/**
 * Hashes the (account, agent, auth-profile, session) tuple to a stable owner key
 * shared between the CLI run queue (`resolveCliRunQueueKey`) and the Claude live
 * session map (`buildClaudeLiveKey`). The two paths must agree byte-for-byte
 * within a single process so a fresh queued turn picks up the same live session
 * the registry already holds; the golden-hash test below pins the encoding.
 */
export declare function buildClaudeOwnerKey(input: {
    agentAccountId?: string;
    agentId?: string;
    authProfileId?: string;
    sessionId?: string;
    sessionKey?: string;
}): string;
/** Resolves the serialization key for a CLI backend run. */
export declare function resolveCliRunQueueKey(params: {
    backendId: string;
    liveSession?: CliBackendConfig["liveSession"];
    serialize?: boolean;
    runId: string;
    workspaceDir: string;
    cliSessionId?: string;
    ownerKey?: string;
}): string;
/** Builds the system prompt sent to a CLI-backed agent runtime. */
export declare function buildCliAgentSystemPrompt(params: {
    workspaceDir: string;
    cwd?: string;
    config?: OpenClawConfig;
    defaultThinkLevel?: ThinkLevel;
    extraSystemPrompt?: string;
    sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
    requireExplicitMessageTarget?: boolean;
    silentReplyPromptMode?: SilentReplyPromptMode;
    runtimeChannel?: string;
    runtimeChatType?: ChatType;
    runtimeCapabilities?: string[];
    ownerNumbers?: string[];
    heartbeatPrompt?: string;
    docsPath?: string;
    sourcePath?: string;
    tools: AgentTool[];
    contextFiles?: EmbeddedContextFile[];
    skillsPrompt?: string;
    modelDisplay: string;
    agentId?: string;
    sessionKey?: string;
    sessionId?: string;
}): string;
/** Applies backend model aliases to a requested CLI model id. */
export declare function normalizeCliModel(modelId: string, backend: CliBackendConfig): string;
/** Decides whether a system prompt should be sent for this CLI turn. */
export declare function resolveSystemPromptUsage(params: {
    backend: CliBackendConfig;
    isNewSession: boolean;
    systemPrompt?: string;
}): string | null;
/** Resolves the CLI session id to send and whether the turn starts a new session. */
export declare function resolveSessionIdToSend(params: {
    backend: CliBackendConfig;
    cliSessionId?: string;
}): {
    sessionId?: string;
    isNew: boolean;
};
/** Routes prompt text to argv or stdin based on backend input policy. */
export declare function resolvePromptInput(params: {
    backend: CliBackendConfig;
    prompt: string;
}): {
    argsPrompt?: string;
    stdin?: string;
};
/** Loads and sanitizes image references found in prompt text. */
export declare function loadPromptRefImages(params: {
    prompt: string;
    workspaceDir: string;
    maxBytes?: number;
    workspaceOnly?: boolean;
    sandbox?: {
        root: string;
        bridge: SandboxFsBridge;
    };
}): Promise<ImageContent[]>;
/** Writes CLI image payloads to private paths and returns their file paths. */
export declare function writeCliImages(params: {
    backend: CliBackendConfig;
    workspaceDir: string;
    images: ImageContent[];
}): Promise<{
    paths: string[];
    cleanup: () => Promise<void>;
}>;
/** Writes a temporary system prompt file when the backend needs file-based prompts. */
export declare function writeCliSystemPromptFile(params: {
    backend: CliBackendConfig;
    systemPrompt: string;
}): Promise<{
    filePath?: string;
    cleanup: () => Promise<void>;
}>;
/** Prepares prompt text and image paths for a CLI backend run. */
export declare function prepareCliPromptImagePayload(params: {
    backend: CliBackendConfig;
    prompt: string;
    workspaceDir: string;
    images?: ImageContent[];
}): Promise<{
    prompt: string;
    imagePaths?: string[];
    cleanupImages?: () => Promise<void>;
}>;
/** Builds final CLI argv from backend config and prepared prompt/session inputs. */
export declare function buildCliArgs(params: {
    backend: CliBackendConfig;
    baseArgs: string[];
    modelId: string;
    sessionId?: string;
    systemPrompt?: string | null;
    systemPromptFilePath?: string;
    imagePaths?: string[];
    promptArg?: string;
    useResume: boolean;
}): string[];
