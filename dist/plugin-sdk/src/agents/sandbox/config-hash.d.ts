import type { SandboxBrowserConfig, SandboxDockerConfig, SandboxWorkspaceAccess } from "./types.js";
/**
 * Stable sandbox config hashing for container reuse decisions.
 *
 * Undefined values and object key order are normalized so semantically equal
 * configs keep the same hash while security epoch changes force recreation.
 */
export declare const SANDBOX_DOCKER_EXPLICIT_ENV_POLICY_EPOCH = "explicit-config-env-v1";
type SandboxHashInput = {
    docker: SandboxDockerConfig;
    dockerEnvPolicyEpoch?: string;
    workspaceAccess: SandboxWorkspaceAccess;
    workspaceDir: string;
    agentWorkspaceDir: string;
    mountFormatVersion: number;
    readOnlyWorkspaceSkillMounts?: readonly string[];
};
type SandboxBrowserHashInput = {
    docker: SandboxDockerConfig;
    dockerEnvPolicyEpoch?: string;
    browser: Pick<SandboxBrowserConfig, "cdpPort" | "cdpSourceRange" | "vncPort" | "noVncPort" | "headless" | "enableNoVnc" | "autoStartTimeoutMs">;
    securityEpoch: string;
    workspaceAccess: SandboxWorkspaceAccess;
    workspaceDir: string;
    agentWorkspaceDir: string;
    mountFormatVersion: number;
    readOnlyWorkspaceSkillMounts?: readonly string[];
};
/** Computes the sandbox container config hash. */
export declare function computeSandboxConfigHash(input: SandboxHashInput): string;
/** Computes the browser-enabled sandbox container config hash. */
export declare function computeSandboxBrowserConfigHash(input: SandboxBrowserHashInput): string;
export {};
