import { G as AgentDefaultsConfig, W as AgentContextLimitsConfig, r as OpenClawConfig } from "./types.openclaw-LzSbb55e.js";
import "./templating-OpWn1DzT.js";
import "./types-BnfxNjkF.js";
//#region src/agents/agent-roster.d.ts
type AgentRosterConfig = {
  readonly agents?: {
    readonly ownership?: "explicit";
    readonly entries?: Readonly<Record<string, unknown>>;
    readonly list?: readonly unknown[];
  };
};
/** Lists unique configured agent ids. */
declare function listAgentIds(cfg: AgentRosterConfig): string[];
/** @deprecated Use tryResolveSoleAgentId; accepts raw shipped markers only for input compatibility. */
declare function tryResolveDefaultAgentId(cfg: AgentRosterConfig): string | undefined;
//#endregion
//#region src/agents/agent-scope-config.d.ts
type AgentEntry = NonNullable<NonNullable<OpenClawConfig["agents"]>["list"]>[number];
type AgentSelectionContext = {
  surface: string;
  hint: string;
};
/** Per-agent config after applying agent defaults and normalizing scalar fields. */
type ResolvedAgentConfig = {
  name?: string;
  workspace?: string;
  agentDir?: string;
  model?: AgentEntry["model"];
  models?: AgentEntry["models"];
  params?: AgentEntry["params"];
  runtime?: AgentEntry["runtime"];
  modelPolicy?: AgentEntry["modelPolicy"];
  agentRuntime?: AgentEntry["agentRuntime"];
  utilityModel?: AgentEntry["utilityModel"];
  decisionModel?: AgentEntry["decisionModel"];
  thinkingDefault?: AgentEntry["thinkingDefault"];
  verboseDefault?: AgentDefaultsConfig["verboseDefault"];
  toolProgressDetail?: AgentDefaultsConfig["toolProgressDetail"];
  reasoningDefault?: AgentEntry["reasoningDefault"];
  fastModeDefault?: AgentEntry["fastModeDefault"];
  contextInjection?: AgentEntry["contextInjection"];
  bootstrapMaxChars?: AgentEntry["bootstrapMaxChars"];
  bootstrapTotalMaxChars?: AgentEntry["bootstrapTotalMaxChars"];
  experimental?: AgentDefaultsConfig["experimental"];
  skills?: AgentEntry["skills"];
  memory?: AgentEntry["memory"];
  humanDelay?: AgentEntry["humanDelay"];
  typingMode?: AgentEntry["typingMode"];
  tts?: AgentEntry["tts"];
  contextLimits?: AgentContextLimitsConfig;
  heartbeat?: AgentEntry["heartbeat"];
  identity?: AgentEntry["identity"];
  groupChat?: AgentEntry["groupChat"];
  subagents?: AgentEntry["subagents"];
  embeddedAgent?: AgentEntry["embeddedAgent"];
  sandbox?: AgentEntry["sandbox"];
  tools?: AgentEntry["tools"];
};
/**
 * @deprecated Ambient system work uses resolveAmbientOwnerAgentId so the configured
 * system agent is honored; explicit-selection surfaces use resolveSoleAgentId. This
 * accepts raw shipped markers only for input compatibility.
 */
declare function resolveDefaultAgentId(cfg: OpenClawConfig, context?: AgentSelectionContext): string;
/** Resolves merged config for one agent id. */
declare function resolveAgentConfig(cfg: OpenClawConfig, agentId: string): ResolvedAgentConfig | undefined;
declare function resolveAgentContextLimits(cfg: OpenClawConfig | undefined, agentId?: string | null): AgentContextLimitsConfig | undefined;
declare function resolveAgentWorkspaceDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
declare function resolveAgentDir(cfg: OpenClawConfig, agentId: string, env?: NodeJS.ProcessEnv): string;
declare function resolveDefaultAgentDir(cfg: OpenClawConfig, env?: NodeJS.ProcessEnv): string;
//#endregion
//#region src/agents/agent-scope.d.ts
type SessionAgentResolutionParams = {
  sessionKey?: string;
  config?: OpenClawConfig;
  agentId?: string | undefined;
  fallbackAgentId?: string;
};
/** Strict session selection uses explicit context and legacy data ownership. */
declare function resolveSessionAgentIdsStrict(params: SessionAgentResolutionParams): {
  defaultAgentId: string;
  sessionAgentId: string;
};
declare function resolveSessionAgentIdStrict(params: SessionAgentResolutionParams): string;
declare function resolveAgentEffectiveModelPrimary(cfg: OpenClawConfig, agentId: string): string | undefined;
type AgentModelPrimaryWriteTarget = "agent" | "defaults";
declare function setAgentEffectiveModelPrimary(cfg: OpenClawConfig, agentId: string, primary: string, options?: {
  target?: AgentModelPrimaryWriteTarget;
  forceAgent?: boolean;
}): AgentModelPrimaryWriteTarget;
type ModelFallbackAvailability = {
  kind: "active";
  models: string[];
  source: "explicit" | "inherited";
} | {
  kind: "none_configured";
  source: "explicit" | "inherited";
} | {
  kind: "disabled_by_model_override";
} | {
  kind: "disabled_by_model_selection_lock";
};
//#endregion
export { resolveSessionAgentIdsStrict as a, resolveAgentContextLimits as c, resolveDefaultAgentDir as d, resolveDefaultAgentId as f, resolveSessionAgentIdStrict as i, resolveAgentDir as l, tryResolveDefaultAgentId as m, ModelFallbackAvailability as n, setAgentEffectiveModelPrimary as o, listAgentIds as p, resolveAgentEffectiveModelPrimary as r, resolveAgentConfig as s, AgentModelPrimaryWriteTarget as t, resolveAgentWorkspaceDir as u };