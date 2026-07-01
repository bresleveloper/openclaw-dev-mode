import type { SandboxBackendCommandResult } from "./backend-handle.types.js";
export type SshSandboxSettings = {
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
export type SshSandboxSession = {
    command: string;
    configPath: string;
    host: string;
};
/** Parameters for one SSH sandbox command execution. */
export type RunSshSandboxCommandParams = {
    session: SshSandboxSession;
    remoteCommand: string;
    stdin?: Buffer | string;
    allowFailure?: boolean;
    signal?: AbortSignal;
    tty?: boolean;
};
/** Single-quote a value for POSIX shell argv construction. */
export declare function shellEscape(value: string): string;
/** Build a remote shell command from literal argv entries. */
export declare function buildRemoteCommand(argv: string[]): string;
/** Build the wrapped remote `/bin/sh -c` command for sandbox exec. */
export declare function buildExecRemoteCommand(params: {
    command: string;
    workdir?: string;
    env: Record<string, string>;
}): string;
/** Validate and build a remote exec command for untrusted model input. */
export declare function buildValidatedExecRemoteCommand(params: {
    command: string;
    workdir?: string;
    env: Record<string, string>;
}): string;
/** Build the local ssh argv for a prepared sandbox session. */
export declare function buildSshSandboxArgv(params: {
    session: SshSandboxSession;
    remoteCommand: string;
    tty?: boolean;
}): string[];
/** Create a temporary SSH session from already-rendered ssh config text. */
export declare function createSshSandboxSessionFromConfigText(params: {
    configText: string;
    host?: string;
    command?: string;
}): Promise<SshSandboxSession>;
/** Create a temporary SSH session from structured sandbox SSH settings. */
export declare function createSshSandboxSessionFromSettings(settings: SshSandboxSettings): Promise<SshSandboxSession>;
/** Remove temporary SSH config and materialized secret files. */
export declare function disposeSshSandboxSession(session: SshSandboxSession): Promise<void>;
/** Run a remote command through ssh and return buffered stdout/stderr. */
export declare function runSshSandboxCommand(params: RunSshSandboxCommandParams): Promise<SandboxBackendCommandResult>;
export declare const ENSURE_REMOTE_REAL_DIRECTORY_SCRIPT: string;
/** Stream a local directory to the remote sandbox with tar over ssh. */
export declare function uploadDirectoryToSshTarget(params: {
    session: SshSandboxSession;
    localDir: string;
    remoteDir: string;
    remoteRootDir?: string;
    signal?: AbortSignal;
}): Promise<void>;
