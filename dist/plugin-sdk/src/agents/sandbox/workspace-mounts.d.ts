import type { SandboxWorkspaceAccess } from "./types.js";
export declare const SANDBOX_MOUNT_FORMAT_VERSION = 3;
/** Read-only skill directory mounted from the agent workspace into the sandbox workspace. */
export type ReadOnlyWorkspaceSkillMount = {
    hostPath: string;
    containerPath: string;
};
/** Hidden workspace used to materialize non-workspace skills for rw sandboxes. */
export declare function resolveMaterializedSandboxSkillsWorkspaceDir(rootDir: string): string;
/** Returns true when a skill mount source exists inside the canonical mount root. */
export declare function isExistingWorkspaceSkillMountSource(params: {
    rootDir: string;
    hostPath: string;
}): boolean;
/** Finds agent-workspace skill directories that should be mounted read-only in rw workspaces. */
export declare function resolveReadOnlyWorkspaceSkillMounts(params: {
    workspaceDir: string;
    agentWorkspaceDir: string;
    skillsWorkspaceDir?: string;
    workdir: string;
    workspaceAccess: SandboxWorkspaceAccess;
}): ReadOnlyWorkspaceSkillMount[];
/** Returns stable mount state for sandbox config hashes. */
export declare function formatReadOnlyWorkspaceSkillMountHashState(mounts: readonly ReadOnlyWorkspaceSkillMount[]): string[];
/** Appends Docker `-v` args for read-only skill mounts. */
export declare function appendReadOnlyWorkspaceSkillMountArgs(params: {
    args: string[];
    readOnlyWorkspaceSkillMounts: readonly ReadOnlyWorkspaceSkillMount[];
}): void;
/** Appends Docker workspace mount args for the project, agent workspace, and skill overlays. */
export declare function appendWorkspaceMountArgs(params: {
    args: string[];
    workspaceDir: string;
    agentWorkspaceDir: string;
    skillsWorkspaceDir?: string;
    workdir: string;
    workspaceAccess: SandboxWorkspaceAccess;
    readOnlyWorkspaceSkillMounts?: readonly ReadOnlyWorkspaceSkillMount[];
    includeReadOnlyWorkspaceSkillMounts?: boolean;
}): void;
