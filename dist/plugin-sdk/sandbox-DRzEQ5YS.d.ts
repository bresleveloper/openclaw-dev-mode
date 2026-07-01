import { i as OpenClawConfig } from "./types.openclaw-R57aE8ho.js";
import { d as SandboxDockerSettings } from "./types.provider-request-D8-dJlQu.js";
import { n as SkillEligibilityContext } from "./types-B7pcFEbF.js";
import { a as SandboxBackendId, i as SandboxBackendHandle, n as SandboxBackendCommandResult, o as SandboxFsBridgeContext, s as SandboxFsBridge, t as SandboxBackendCommandParams } from "./backend-handle.types-CSIpH53U.js";

//#region src/agents/sandbox/types.docker.d.ts
type RequiredDockerConfigKeys = "image" | "containerPrefix" | "workdir" | "readOnlyRoot" | "tmpfs" | "network" | "capDrop";
type SandboxDockerConfig = Omit<SandboxDockerSettings, RequiredDockerConfigKeys> & Required<Pick<SandboxDockerSettings, RequiredDockerConfigKeys>>;
//#endregion
//#region src/agents/sandbox/types.d.ts
type SandboxToolPolicy = {
  allow?: string[];
  deny?: string[];
};
type SandboxToolPolicySource = {
  source: "agent" | "global" | "default";
  /**
   * Config key path hint for humans.
   * (Arrays use `agents.list[].…` form.)
   */
  key: string;
};
type SandboxToolPolicyResolved = {
  allow: string[];
  deny: string[];
  sources: {
    allow: SandboxToolPolicySource;
    deny: SandboxToolPolicySource;
  };
};
type SandboxWorkspaceAccess = "none" | "ro" | "rw";
type SandboxBrowserConfig = {
  enabled: boolean;
  image: string;
  containerPrefix: string;
  network: string;
  cdpPort: number;
  cdpSourceRange?: string;
  vncPort: number;
  noVncPort: number;
  headless: boolean;
  enableNoVnc: boolean;
  allowHostControl: boolean;
  autoStart: boolean;
  autoStartTimeoutMs: number;
  binds?: string[];
};
type SandboxPruneConfig = {
  idleHours: number;
  maxAgeDays: number;
};
type SandboxSshConfig = {
  target?: string;
  command: string;
  workspaceRoot: string;
  strictHostKeyChecking: boolean;
  updateHostKeys: boolean;
  identityFile?: string;
  certificateFile?: string;
  knownHostsFile?: string;
  identityData?: string;
  certificateData?: string;
  knownHostsData?: string;
};
type SandboxScope = "session" | "agent" | "shared";
type SandboxConfig = {
  mode: "off" | "non-main" | "all";
  backend: SandboxBackendId;
  scope: SandboxScope;
  workspaceAccess: SandboxWorkspaceAccess;
  workspaceRoot: string;
  docker: SandboxDockerConfig;
  ssh: SandboxSshConfig;
  browser: SandboxBrowserConfig;
  tools: SandboxToolPolicy;
  prune: SandboxPruneConfig;
};
type SandboxBrowserContext = {
  bridgeUrl: string;
  noVncUrl?: string;
  containerName: string;
};
type SandboxContext = {
  enabled: boolean;
  backendId: SandboxBackendId;
  sessionKey: string;
  workspaceDir: string;
  agentWorkspaceDir: string;
  skillsWorkspaceDir?: string;
  skillsEligibility?: SkillEligibilityContext;
  workspaceAccess: SandboxWorkspaceAccess;
  runtimeId: string;
  runtimeLabel: string;
  containerName: string;
  containerWorkdir: string;
  docker: SandboxDockerConfig;
  tools: SandboxToolPolicy;
  browserAllowHostControl: boolean;
  browser?: SandboxBrowserContext;
  fsBridge?: SandboxFsBridge;
  backend?: SandboxBackendHandle;
};
//#endregion
//#region src/agents/sandbox/context.d.ts
declare function resolveSandboxContext(params: {
  config?: OpenClawConfig;
  sessionKey?: string;
  workspaceDir?: string;
}): Promise<SandboxContext | null>;
//#endregion
//#region src/agents/sandbox/registry.d.ts
type SandboxRegistryEntry = {
  containerName: string;
  backendId?: string;
  runtimeLabel?: string;
  sessionKey: string;
  createdAtMs: number;
  lastUsedAtMs: number;
  image: string;
  configLabelKind?: string;
  configHash?: string;
};
//#endregion
//#region src/agents/sandbox/backend.types.d.ts
/** Current runtime state reported by a sandbox backend manager. */
type SandboxBackendRuntimeInfo = {
  running: boolean;
  actualConfigLabel?: string;
  configLabelMatch: boolean;
};
/** Optional lifecycle manager for an existing registered sandbox runtime. */
type SandboxBackendManager = {
  describeRuntime(params: {
    entry: SandboxRegistryEntry;
    config: OpenClawConfig;
    agentId?: string;
  }): Promise<SandboxBackendRuntimeInfo>;
  removeRuntime(params: {
    entry: SandboxRegistryEntry;
    config: OpenClawConfig;
    agentId?: string;
  }): Promise<void>;
};
/** Inputs needed to create a sandbox backend handle for one session scope. */
type CreateSandboxBackendParams = {
  sessionKey: string;
  scopeKey: string;
  workspaceDir: string;
  agentWorkspaceDir: string;
  skillsWorkspaceDir?: string;
  cfg: SandboxConfig;
};
/** Factory that creates a backend handle for a sandbox session. */
type SandboxBackendFactory = (params: CreateSandboxBackendParams) => Promise<SandboxBackendHandle>;
/** Resolve the runtime workdir without creating or starting the backend. */
type SandboxBackendWorkdirResolver = (params: CreateSandboxBackendParams) => string;
/** Registry input accepted for sandbox backend registration. */
type SandboxBackendRegistration = SandboxBackendFactory | {
  factory: SandboxBackendFactory;
  manager?: SandboxBackendManager;
  resolveWorkdir?: SandboxBackendWorkdirResolver;
};
//#endregion
//#region src/agents/sandbox/backend.d.ts
/** Register or replace a sandbox backend and return a restore callback. */
declare function registerSandboxBackend(id: string, registration: SandboxBackendRegistration): () => void;
/** Look up a sandbox backend factory by normalized backend id. */
declare function getSandboxBackendFactory(id: string): SandboxBackendFactory | null;
/** Look up optional lifecycle management hooks for a registered backend. */
declare function getSandboxBackendManager(id: string): SandboxBackendManager | null;
/** Look up optional backend workdir resolution that does not start the runtime. */
declare function getSandboxBackendWorkdirResolver(id: string): SandboxBackendWorkdirResolver | null;
/** Resolve a backend factory or throw the user-facing configuration error. */
declare function requireSandboxBackendFactory(id: string): SandboxBackendFactory;
//#endregion
//#region src/agents/sandbox/sanitize-env-vars.d.ts
type EnvVarSanitizationResult = {
  allowed: Record<string, string>;
  blocked: string[];
  warnings: string[];
};
type EnvSanitizationOptions = {
  strictMode?: boolean;
  customBlockedPatterns?: ReadonlyArray<RegExp>;
  customAllowedPatterns?: ReadonlyArray<RegExp>;
};
/** Sanitizes inherited environment variables for automatic sandbox propagation. */
declare function sanitizeEnvVars(envVars: Record<string, string | undefined>, options?: EnvSanitizationOptions): EnvVarSanitizationResult;
//#endregion
//#region src/agents/sandbox/runtime-status.d.ts
/** Resolves sandbox mode, effective session scope, and tool policy for a session. */
declare function resolveSandboxRuntimeStatus(params: {
  cfg?: OpenClawConfig;
  sessionKey?: string;
}): {
  agentId: string;
  sessionKey: string;
  mainSessionKey: string;
  mode: SandboxConfig["mode"];
  sandboxed: boolean;
  toolPolicy: SandboxToolPolicyResolved;
};
//#endregion
//#region src/agents/sandbox/tool-policy.d.ts
declare function isToolAllowed(policy: SandboxToolPolicy, name: string): boolean;
//#endregion
//#region src/agents/sandbox/ssh.d.ts
type SshSandboxSettings = {
  command: string;
  target: string;
  strictHostKeyChecking: boolean;
  updateHostKeys: boolean;
  identityFile?: string;
  certificateFile?: string;
  knownHostsFile?: string;
  identityData?: string;
  certificateData?: string;
  knownHostsData?: string;
};
/** Temporary SSH session descriptor with an isolated config file. */
type SshSandboxSession = {
  command: string;
  configPath: string;
  host: string;
};
/** Parameters for one SSH sandbox command execution. */
type RunSshSandboxCommandParams = {
  session: SshSandboxSession;
  remoteCommand: string;
  stdin?: Buffer | string;
  allowFailure?: boolean;
  signal?: AbortSignal;
  tty?: boolean;
};
/** Single-quote a value for POSIX shell argv construction. */
declare function shellEscape(value: string): string;
/** Build a remote shell command from literal argv entries. */
declare function buildRemoteCommand(argv: string[]): string;
/** Build the wrapped remote `/bin/sh -c` command for sandbox exec. */
declare function buildExecRemoteCommand(params: {
  command: string;
  workdir?: string;
  env: Record<string, string>;
}): string;
/** Validate and build a remote exec command for untrusted model input. */
declare function buildValidatedExecRemoteCommand(params: {
  command: string;
  workdir?: string;
  env: Record<string, string>;
}): string;
/** Build the local ssh argv for a prepared sandbox session. */
declare function buildSshSandboxArgv(params: {
  session: SshSandboxSession;
  remoteCommand: string;
  tty?: boolean;
}): string[];
/** Create a temporary SSH session from already-rendered ssh config text. */
declare function createSshSandboxSessionFromConfigText(params: {
  configText: string;
  host?: string;
  command?: string;
}): Promise<SshSandboxSession>;
/** Create a temporary SSH session from structured sandbox SSH settings. */
declare function createSshSandboxSessionFromSettings(settings: SshSandboxSettings): Promise<SshSandboxSession>;
/** Remove temporary SSH config and materialized secret files. */
declare function disposeSshSandboxSession(session: SshSandboxSession): Promise<void>;
/** Run a remote command through ssh and return buffered stdout/stderr. */
declare function runSshSandboxCommand(params: RunSshSandboxCommandParams): Promise<SandboxBackendCommandResult>;
/** Stream a local directory to the remote sandbox with tar over ssh. */
declare function uploadDirectoryToSshTarget(params: {
  session: SshSandboxSession;
  localDir: string;
  remoteDir: string;
  remoteRootDir?: string;
  signal?: AbortSignal;
}): Promise<void>;
//#endregion
//#region src/agents/sandbox/remote-fs-bridge.d.ts
/** Minimal remote shell contract used by the SSH filesystem bridge. */
type RemoteShellSandboxHandle = {
  remoteWorkspaceDir: string;
  remoteAgentWorkspaceDir: string;
  runRemoteShellScript(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
};
/** Create the filesystem bridge for remote shell-backed sandbox runtimes. */
declare function createRemoteShellSandboxFsBridge(params: {
  sandbox: SandboxFsBridgeContext;
  runtime: RemoteShellSandboxHandle;
}): SandboxFsBridge;
//#endregion
//#region src/agents/sandbox/fs-bridge-rename-targets.d.ts
/**
 * Shared writable-target resolution for sandbox fs bridge rename operations.
 */
/** Resolves both rename endpoints and verifies write access before command execution. */
declare function resolveWritableRenameTargets<T extends {
  containerPath: string;
}>(params: {
  from: string;
  to: string;
  cwd?: string;
  action?: string;
  resolveTarget: (params: {
    filePath: string;
    cwd?: string;
  }) => T;
  ensureWritable: (target: T, action: string) => void;
}): {
  from: T;
  to: T;
};
/** Adapter used by bridge implementations that pass resolver callbacks separately. */
declare function resolveWritableRenameTargetsForBridge<T extends {
  containerPath: string;
}>(params: {
  from: string;
  to: string;
  cwd?: string;
  action?: string;
}, resolveTarget: (params: {
  filePath: string;
  cwd?: string;
}) => T, ensureWritable: (target: T, action: string) => void): {
  from: T;
  to: T;
};
/** Creates a reusable resolver bound to a bridge's target and permission helpers. */
declare function createWritableRenameTargetResolver<T extends {
  containerPath: string;
}>(resolveTarget: (params: {
  filePath: string;
  cwd?: string;
}) => T, ensureWritable: (target: T, action: string) => void): (params: {
  from: string;
  to: string;
  cwd?: string;
}) => {
  from: T;
  to: T;
};
//#endregion
export { SandboxBackendRegistration as A, getSandboxBackendManager as C, CreateSandboxBackendParams as D, requireSandboxBackendFactory as E, SandboxSshConfig as F, SandboxToolPolicy as I, SandboxWorkspaceAccess as L, SandboxBackendWorkdirResolver as M, resolveSandboxContext as N, SandboxBackendFactory as O, SandboxContext as P, getSandboxBackendFactory as S, registerSandboxBackend as T, shellEscape as _, createRemoteShellSandboxFsBridge as a, resolveSandboxRuntimeStatus as b, SshSandboxSettings as c, buildSshSandboxArgv as d, buildValidatedExecRemoteCommand as f, runSshSandboxCommand as g, disposeSshSandboxSession as h, RemoteShellSandboxHandle as i, SandboxBackendRuntimeInfo as j, SandboxBackendManager as k, buildExecRemoteCommand as l, createSshSandboxSessionFromSettings as m, resolveWritableRenameTargets as n, RunSshSandboxCommandParams as o, createSshSandboxSessionFromConfigText as p, resolveWritableRenameTargetsForBridge as r, SshSandboxSession as s, createWritableRenameTargetResolver as t, buildRemoteCommand as u, uploadDirectoryToSshTarget as v, getSandboxBackendWorkdirResolver as w, sanitizeEnvVars as x, isToolAllowed as y };