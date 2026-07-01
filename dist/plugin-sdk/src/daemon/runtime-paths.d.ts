type ExecFileAsync = (file: string, args: readonly string[], options: {
    encoding: "utf8";
}) => Promise<{
    stdout: string;
    stderr: string;
}>;
type SystemNodeInfo = {
    path: string;
    version: string | null;
    supported: boolean;
};
/** True when a Node path lives under a known user version-manager root. */
export declare function isVersionManagedNodePath(nodePath: string, platform?: NodeJS.Platform): boolean;
/** True when a Node path matches known system install candidates for the platform. */
export declare function isSystemNodePath(nodePath: string, env?: Record<string, string | undefined>, platform?: NodeJS.Platform): boolean;
/** Resolves the first available system Node candidate for the platform. */
export declare function resolveSystemNodePath(env?: Record<string, string | undefined>, platform?: NodeJS.Platform): Promise<string | null>;
/** Resolves system Node info, preferring a supported non-version-managed install. */
export declare function resolveSystemNodeInfo(params: {
    env?: Record<string, string | undefined>;
    platform?: NodeJS.Platform;
    execFile?: ExecFileAsync;
}): Promise<SystemNodeInfo | null>;
/** Renders a warning when the system Node exists but is below the supported floor. */
export declare function renderSystemNodeWarning(systemNode: SystemNodeInfo | null, selectedNodePath?: string): string | null;
/** Resolves the Node binary the daemon should use for a node runtime. */
export declare function resolvePreferredNodePath(params: {
    env?: Record<string, string | undefined>;
    runtime?: string;
    platform?: NodeJS.Platform;
    execFile?: ExecFileAsync;
    execPath?: string;
}): Promise<string | undefined>;
export {};
