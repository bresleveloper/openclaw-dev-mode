//#region src/agents/sandbox/fs-bridge.types.d.ts
/**
 * Public sandbox filesystem bridge contracts.
 *
 * Tool and backend code use this interface to access files through the sandbox
 * boundary instead of reaching directly into host paths.
 */
/** Resolved sandbox path with host, relative, and container views. */
type SandboxResolvedPath = {
  hostPath?: string;
  relativePath: string;
  containerPath: string;
};
/** Minimal file stat shape returned by sandbox fs bridge implementations. */
type SandboxFsStat = {
  type: "file" | "directory" | "other";
  size: number;
  mtimeMs: number;
};
/** Filesystem operations exposed across the sandbox boundary. */
type SandboxFsBridge = {
  resolvePath(params: {
    filePath: string;
    cwd?: string;
  }): SandboxResolvedPath;
  readFile(params: {
    filePath: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<Buffer>;
  writeFile(params: {
    filePath: string;
    cwd?: string;
    data: Buffer | string;
    encoding?: BufferEncoding;
    mkdir?: boolean;
    signal?: AbortSignal;
  }): Promise<void>;
  mkdirp(params: {
    filePath: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<void>;
  remove(params: {
    filePath: string;
    cwd?: string;
    recursive?: boolean;
    force?: boolean;
    signal?: AbortSignal;
  }): Promise<void>;
  rename(params: {
    from: string;
    to: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<void>;
  stat(params: {
    filePath: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<SandboxFsStat | null>;
};
//#endregion
//#region src/agents/sandbox/backend-handle.types.d.ts
/**
 * Backend-neutral sandbox runtime handles used by Docker, SSH, and future sandbox providers.
 */
type SandboxBackendId = string;
/** Shell exec specification prepared by a sandbox backend for process launch. */
type SandboxBackendExecSpec = {
  argv: string[];
  env: NodeJS.ProcessEnv;
  stdinMode: "pipe-open" | "pipe-closed";
  finalizeToken?: unknown;
};
/** Parameters for backend-managed shell commands used by fs bridges and probes. */
type SandboxBackendCommandParams = {
  script: string;
  args?: string[];
  stdin?: Buffer | string;
  allowFailure?: boolean;
  signal?: AbortSignal;
};
/** Buffered command result returned by sandbox backend shell helpers. */
type SandboxBackendCommandResult = {
  stdout: Buffer;
  stderr: Buffer;
  code: number;
};
/** Runtime context passed to backend-provided filesystem bridge factories. */
type SandboxFsBridgeContext = {
  workspaceDir: string;
  agentWorkspaceDir: string;
  skillsWorkspaceDir?: string;
  workspaceAccess: "none" | "ro" | "rw";
  containerName: string;
  containerWorkdir: string;
  docker: {
    binds?: string[];
  };
  backend?: {
    runShellCommand(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
  };
};
/** Live sandbox backend handle for command execution, cleanup, and optional fs bridge creation. */
type SandboxBackendHandle = {
  id: SandboxBackendId;
  runtimeId: string;
  runtimeLabel: string;
  workdir: string;
  env?: Record<string, string>;
  configLabel?: string;
  configLabelKind?: string;
  capabilities?: {
    browser?: boolean;
  };
  buildExecSpec(params: {
    command: string;
    workdir?: string;
    env: Record<string, string>;
    usePty: boolean;
  }): Promise<SandboxBackendExecSpec>;
  finalizeExec?: (params: {
    status: "completed" | "failed";
    exitCode: number | null;
    timedOut: boolean;
    token?: unknown;
  }) => Promise<void>;
  runShellCommand(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
  createFsBridge?: (params: {
    sandbox: SandboxFsBridgeContext;
  }) => SandboxFsBridge;
};
//#endregion
export { SandboxBackendId as a, SandboxFsStat as c, SandboxBackendHandle as i, SandboxResolvedPath as l, SandboxBackendCommandResult as n, SandboxFsBridgeContext as o, SandboxBackendExecSpec as r, SandboxFsBridge as s, SandboxBackendCommandParams as t };