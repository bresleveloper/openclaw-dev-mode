/** Env var that points bundled-plugin lookup at an OpenClaw source checkout. */
export declare const OPENCLAW_DEV_SOURCE_ROOT_ENV = "OPENCLAW_DEV_SOURCE_ROOT";
/** Resolves and validates the configured OpenClaw development source root. */
export declare function resolveOpenClawDevSourceRoot(env?: NodeJS.ProcessEnv): string | null;
/** True when a bundled plugin root is inside the configured development source root. */
export declare function isBundledPluginInsideDevSourceRoot(params: {
    rootDir: string;
    env: NodeJS.ProcessEnv;
}): boolean;
