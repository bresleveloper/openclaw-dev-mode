import type { AgentContextLimitsConfig, AgentDefaultsConfig } from "../config/types.agent-defaults.js";
import type { OpenClawConfig } from "../config/types.js";
type AgentEntry = NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>[number];
/** Per-agent config after applying agent defaults and normalizing scalar fields. */
export type ResolvedAgentConfig = {
    name?: string;
    workspace?: string;
    agentDir?: string;
    model?: AgentEntry["model"];
    thinkingDefault?: AgentEntry["thinkingDefault"];
    verboseDefault?: AgentDefaultsConfig["verboseDefault"];
    reasoningDefault?: AgentEntry["reasoningDefault"];
    fastModeDefault?: AgentEntry["fastModeDefault"];
    contextTokens?: AgentEntry["contextTokens"];
    contextInjection?: AgentEntry["contextInjection"];
    bootstrapMaxChars?: AgentEntry["bootstrapMaxChars"];
    bootstrapTotalMaxChars?: AgentEntry["bootstrapTotalMaxChars"];
    experimental?: AgentDefaultsConfig["experimental"];
    skills?: AgentEntry["skills"];
    memorySearch?: AgentEntry["memorySearch"];
    humanDelay?: AgentEntry["humanDelay"];
    tts?: AgentEntry["tts"];
    contextLimits?: AgentContextLimitsConfig;
    heartbeat?: AgentEntry["heartbeat"];
    identity?: AgentEntry["identity"];
    groupChat?: AgentEntry["groupChat"];
    subagents?: AgentEntry["subagents"];
    runRetries?: AgentEntry["runRetries"];
    embeddedAgent?: AgentEntry["embeddedAgent"];
    sandbox?: AgentEntry["sandbox"];
    tools?: AgentEntry["tools"];
};
/** Lists valid configured agent entries from config. */
export declare function listAgentEntries(cfg: OpenClawConfig): AgentEntry[];
/** Lists unique configured agent ids, falling back to the default agent id. */
export declare function listAgentIds(cfg: OpenClawConfig): string[];
/** Resolves the default agent id, warning once when multiple defaults exist. */
export declare function resolveDefaultAgentId(cfg: OpenClawConfig): string;
/** Resolves merged config for one agent id. */
export declare function resolveAgentConfig(cfg: OpenClawConfig, agentId: string): ResolvedAgentConfig | undefined;
export declare function resolveAgentContextLimits(cfg: OpenClawConfig | undefined, agentId?: string | null): AgentContextLimitsConfig | undefined;
export declare function resolveAgentWorkspaceDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
export declare function resolveAgentDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
export declare function resolveDefaultAgentDir(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): string;
export {};
