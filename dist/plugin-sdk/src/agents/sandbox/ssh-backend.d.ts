import type { CreateSandboxBackendParams, SandboxBackendHandle, SandboxBackendManager } from "./backend.types.js";
type ResolvedSshRuntimePaths = {
    runtimeId: string;
    runtimeRootDir: string;
    remoteWorkspaceDir: string;
    remoteAgentWorkspaceDir: string;
    remoteSkillsWorkspaceDir: string;
};
/** SSH backend lifecycle hooks for probing and removing remote sandbox copies. */
export declare const sshSandboxBackendManager: SandboxBackendManager;
/** Create an SSH sandbox backend that mirrors the workspace to a remote target. */
export declare function createSshSandboxBackend(params: CreateSandboxBackendParams): Promise<SandboxBackendHandle>;
export declare function resolveSshRuntimePaths(workspaceRoot: string, scopeKey: string): ResolvedSshRuntimePaths;
export {};
