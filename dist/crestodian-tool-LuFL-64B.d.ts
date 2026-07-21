import { i as OpenClawConfig } from "./types.openclaw-B5gtuEn_.js";
import { g as readConfigFileSnapshot } from "./io-Bd1kvH53.js";
import { d as resolveGatewayPort, s as resolveConfigPath } from "./paths-BzImXCBF.js";
import { n as RuntimeEnv } from "./runtime-Bxifh4bY.js";
//#region src/crestodian/setup-apply.d.ts
/**
 * The whole first-run setup as one approved operation: the user says "yes" in
 * the conversation and this applies model + workspace + quickstart gateway
 * defaults, seeds workspace bootstrap files, and (on the CLI surface) installs
 * and starts the gateway service. No interactive prompts may occur here —
 * everything uses quickstart defaults, so the conversation stays the only UI.
 */
type CrestodianSetupApplyParams = {
  workspace: string;
  model?: string;
  surface: "cli" | "gateway";
  runtime: RuntimeEnv;
};
type CrestodianSetupApplyResult = {
  configPath: string;
  lines: string[];
};
declare function applyCrestodianSetup(params: CrestodianSetupApplyParams): Promise<CrestodianSetupApplyResult>;
//#endregion
//#region src/cli/config-set-input.d.ts
type ConfigSetOptions = {
  strictJson?: boolean; /** @deprecated Use strictJson. */
  json?: boolean;
  dryRun?: boolean;
  allowExec?: boolean;
  merge?: boolean;
  replace?: boolean;
  refProvider?: string;
  refSource?: string;
  refId?: string;
  providerSource?: string;
  providerAllowlist?: string[];
  providerPath?: string;
  providerMode?: string;
  providerTimeoutMs?: string;
  providerMaxBytes?: string;
  providerCommand?: string;
  providerArg?: string[];
  providerNoOutputTimeoutMs?: string;
  providerMaxOutputBytes?: string;
  providerJsonOnly?: boolean;
  providerEnv?: string[];
  providerPassEnv?: string[];
  providerTrustedDir?: string[];
  providerAllowInsecurePath?: boolean;
  providerAllowSymlinkCommand?: boolean;
  batchJson?: string;
  batchFile?: string;
};
//#endregion
//#region src/commands/doctor.types.d.ts
/** CLI option shape shared by doctor command entrypoints and prompt helpers. */
type DoctorOptions = {
  workspaceSuggestions?: boolean;
  yes?: boolean;
  nonInteractive?: boolean;
  deep?: boolean;
  repair?: boolean;
  force?: boolean;
  generateGatewayToken?: boolean;
  allowExec?: boolean;
  postUpgrade?: boolean;
  json?: boolean;
};
//#endregion
//#region src/crestodian/probes.d.ts
/**
 * Local environment probes used by Crestodian overview loading.
 *
 * Probes are bounded by output and timeout limits so setup/status commands do
 * not hang or retain unbounded child output.
 */
/** Result from probing a local command binary. */
type LocalCommandProbe = {
  command: string;
  found: boolean;
  version?: string;
  error?: string;
};
/** Probe a command by running a small version command with bounded output and timeout. */
declare function probeLocalCommand(command: string, args?: string[], opts?: {
  outputLimit?: number;
  timeoutKillGraceMs?: number;
  timeoutMs?: number;
}): Promise<LocalCommandProbe>;
/** Probe a Gateway URL by translating it to its HTTP /healthz endpoint. */
declare function probeGatewayUrl(url: string, opts?: {
  timeoutMs?: number;
}): Promise<{
  reachable: boolean;
  url: string;
  error?: string;
}>;
//#endregion
//#region src/commands/onboard-inference.d.ts
type InferenceBackendKind = "existing-model" | "openai-api-key" | "anthropic-api-key" | "claude-cli" | "codex-cli" | "gemini-cli";
type InferenceBackendCandidate = {
  kind: InferenceBackendKind;
  modelRef: string; /** Short human label, e.g. "Claude Code CLI". */
  label: string; /** One-line provenance, e.g. "logged in", "ANTHROPIC_API_KEY set". */
  detail: string;
  /**
   * true: credentials verified; false: definitively logged out; undefined:
   * unknown (e.g. macOS keychain-backed logins we must not prompt for here).
   */
  credentials?: boolean;
};
type DetectInferenceBackendsDeps = {
  probeLocalCommand?: typeof probeLocalCommand;
  readClaudeCliCredentials?: () => {
    type: string;
  } | null;
  readCodexCliCredentials?: () => {
    type: string;
  } | null;
  readGeminiCliCredentials?: () => {
    type: string;
  } | null;
};
type DetectInferenceBackendsOptions = {
  config?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  platform?: NodeJS.Platform;
  deps?: DetectInferenceBackendsDeps;
};
/**
 * Detect usable inference backends in ladder order. Returns candidates only
 * for backends that exist on this machine; the first entry is the bootstrap
 * default. Backends that are definitively logged out sink below logged-in and
 * unknown ones so a stale install never outranks a working login.
 */
declare function detectInferenceBackends(options?: DetectInferenceBackendsOptions): Promise<InferenceBackendCandidate[]>;
//#endregion
//#region src/tui/tui-types.d.ts
type TuiExitReason = "exit" | "return-to-crestodian";
type TuiResult = {
  exitReason: TuiExitReason;
  crestodianMessage?: string;
};
//#endregion
//#region src/agents/docs-path.d.ts
type ResolveOpenClawReferencePathParams = {
  workspaceDir?: string;
  argv1?: string;
  cwd?: string;
  moduleUrl?: string;
};
/** Resolve docs and source roots concurrently for prompt/reference injection. */
declare function resolveOpenClawReferencePaths(params: ResolveOpenClawReferencePathParams): Promise<{
  docsPath: string | null;
  sourcePath: string | null;
}>;
//#endregion
//#region src/crestodian/overview.d.ts
type CrestodianAgentSummary = {
  id: string;
  name?: string;
  isDefault: boolean;
  model?: string;
  workspace?: string;
};
type CrestodianOverview = {
  config: {
    path: string;
    exists: boolean;
    valid: boolean;
    issues: string[];
    hash: string | null;
  };
  agents: CrestodianAgentSummary[];
  defaultAgentId: string;
  defaultModel?: string;
  tools: {
    codex: LocalCommandProbe;
    claude: LocalCommandProbe;
    gemini: LocalCommandProbe;
    apiKeys: {
      openai: boolean;
      anthropic: boolean;
    };
  };
  gateway: {
    url: string;
    source: string;
    reachable: boolean;
    error?: string;
  };
  references: {
    docsPath?: string;
    docsUrl: string;
    sourcePath?: string;
    sourceUrl: string;
  };
};
type GatewayConnectionDetails = {
  url: string;
  urlSource: string;
  remoteFallbackNote?: string;
};
type CrestodianOverviewDependencies = {
  readConfigFileSnapshot?: typeof readConfigFileSnapshot;
  resolveConfigPath?: typeof resolveConfigPath;
  resolveGatewayPort?: typeof resolveGatewayPort;
  buildGatewayConnectionDetails?: (input: {
    config: OpenClawConfig;
    configPath: string;
  }) => GatewayConnectionDetails;
  probeLocalCommand?: typeof probeLocalCommand;
  probeGatewayUrl?: typeof probeGatewayUrl;
  resolveOpenClawReferencePaths?: typeof resolveOpenClawReferencePaths;
};
declare function loadCrestodianOverview(opts?: {
  env?: NodeJS.ProcessEnv;
  deps?: CrestodianOverviewDependencies;
}): Promise<CrestodianOverview>;
//#endregion
//#region src/crestodian/operations.d.ts
type CrestodianOverviewLoader = () => Promise<CrestodianOverview>;
type CrestodianOverviewFormatter = (overview: CrestodianOverview) => string;
/** Parsed Crestodian operation before approval/execution. */
type CrestodianOperation = {
  kind: "none";
  message: string;
} | {
  kind: "overview";
} | {
  kind: "doctor";
} | {
  kind: "doctor-fix";
} | {
  kind: "status";
} | {
  kind: "health";
} | {
  kind: "config-validate";
} | {
  kind: "config-get";
  path: string;
} | {
  kind: "config-schema";
  path?: string;
} | {
  kind: "config-set";
  path: string;
  value: string;
} | {
  kind: "config-set-ref";
  path: string;
  source: "env" | "file" | "exec";
  id: string;
  provider?: string;
} | {
  kind: "setup";
  workspace?: string;
  model?: string;
} | {
  kind: "model-setup";
  workspace?: string;
} | {
  kind: "channel-list";
} | {
  kind: "channel-setup";
  channel: string;
} | {
  kind: "gateway-status";
} | {
  kind: "gateway-start";
} | {
  kind: "gateway-stop";
} | {
  kind: "gateway-restart";
} | {
  kind: "agents";
} | {
  kind: "models";
} | {
  kind: "plugin-list";
} | {
  kind: "plugin-search";
  query: string;
} | {
  kind: "plugin-install";
  spec: string;
} | {
  kind: "plugin-uninstall";
  pluginId: string;
} | {
  kind: "audit";
} | {
  kind: "create-agent";
  agentId: string;
  workspace?: string;
  model?: string;
} | {
  kind: "open-tui";
  agentId?: string;
  workspace?: string;
} | {
  kind: "set-default-model";
  model: string;
};
/** Injectable command dependencies used by tests and alternate runners. */
type CrestodianCommandDeps = {
  formatOverview?: CrestodianOverviewFormatter;
  loadOverview?: CrestodianOverviewLoader;
  runAgentsAdd?: (opts: {
    name?: string;
    workspace?: string;
    model?: string;
    nonInteractive?: boolean;
    json?: boolean;
  }, runtime: RuntimeEnv, params?: {
    hasFlags?: boolean;
  }) => Promise<void>;
  runConfigSet?: (opts: {
    path?: string;
    value?: string;
    cliOptions: ConfigSetOptions;
  }) => Promise<void>;
  runDoctor?: (runtime: RuntimeEnv, options: DoctorOptions) => Promise<void>;
  runGatewayRestart?: () => Promise<void>;
  runGatewayStart?: () => Promise<void>;
  runGatewayStop?: () => Promise<void>;
  runPluginInstall?: (spec: string, runtime: RuntimeEnv) => Promise<void>;
  runPluginUninstall?: (pluginId: string, runtime: RuntimeEnv) => Promise<void>;
  runPluginsList?: (runtime: RuntimeEnv) => Promise<void>;
  runPluginsSearch?: (query: string, runtime: RuntimeEnv) => Promise<void>;
  runTui?: (opts: {
    local: boolean;
    session?: string;
    deliver?: boolean;
    historyLimit?: number;
  }) => Promise<TuiResult | void>;
  detectInferenceBackends?: typeof detectInferenceBackends; /** Where setup side effects run; the gateway surface never manages its own daemon. */
  setupSurface?: "cli" | "gateway";
  applySetup?: typeof applyCrestodianSetup;
};
//#endregion
//#region src/agents/tools/crestodian-tool.d.ts
type CrestodianToolOptions = {
  /** Where setup side effects run; the gateway surface never manages its own daemon. */surface: "cli" | "gateway";
  /**
   * Host-verified consent for THIS turn: true only when the host judged the
   * user's actual message to be an explicit approval. The model-supplied
   * `approved` argument alone must never authorize a mutation (prompt
   * injection, model error).
   */
  approvalArmed?: boolean;
  /**
   * Approval is scoped to one exact operation: a denied mutating call records
   * its canonical hash here (host-owned, survives turns), and an armed turn
   * may execute only a call matching that hash. Cleared after use.
   */
  proposalRef?: {
    current?: string;
  };
  /**
   * Host handoff channel for actions the tool cannot perform itself
   * (interactive channel-setup wizard, opening the agent TUI). The engine
   * reads it after the turn; CLI MCP hosts mirror it from tool events.
   */
  directiveRef?: {
    current?: CrestodianToolDirective;
  };
};
/** Interactive handoffs the hosting chat engine executes after the turn. */
type CrestodianToolDirective = {
  kind: "channel-setup";
  channel: string;
} | {
  kind: "model-setup";
  workspace?: string;
} | {
  kind: "open-tui";
  agentId?: string;
  workspace?: string;
};
//#endregion
export { CrestodianOverview as a, CrestodianOperation as i, CrestodianToolOptions as n, loadCrestodianOverview as o, CrestodianCommandDeps as r, CrestodianToolDirective as t };