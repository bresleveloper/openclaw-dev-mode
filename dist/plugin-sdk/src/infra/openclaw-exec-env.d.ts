/** Process env key that marks child commands as launched by the OpenClaw CLI. */
export declare const OPENCLAW_CLI_ENV_VAR = "OPENCLAW_CLI";
/** Stable marker value used for OpenClaw-launched subprocess detection. */
export declare const OPENCLAW_CLI_ENV_VALUE = "1";
/** Returns a cloned env object with the OpenClaw CLI marker set. */
export declare function markOpenClawExecEnv<T extends Record<string, string | undefined>>(
/** Source environment to clone before adding the subprocess marker. */
env: T): T;
/** Mutates an existing process env object so current-process children inherit the marker. */
export declare function ensureOpenClawExecMarkerOnProcess(
/** Process env object to mutate; defaults to the current process environment. */
env?: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
