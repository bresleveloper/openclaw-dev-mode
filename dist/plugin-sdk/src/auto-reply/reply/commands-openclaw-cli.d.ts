/** Reconstructs the current OpenClaw CLI invocation with extra args. */
export declare function buildCurrentOpenClawCliArgv(args: string[]): string[];
/** Clears test-runner env inherited by harness-hosted gateways before spawning the CLI. */
export declare function buildCurrentOpenClawCliExecEnv(env?: NodeJS.ProcessEnv): Record<string, string> | undefined;
/** Builds a shell-quoted command string for rerunning the current OpenClaw CLI. */
export declare function buildCurrentOpenClawCliCommand(args: string[]): string;
