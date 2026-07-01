import type { OpenClawConfig } from "../config/types.js";
import type { RuntimeEnv } from "../runtime.js";
import { type CommandSecretResolutionMode } from "./command-secret-gateway.js";
/** Resolve command-scoped secrets and return both raw resolved and effective config views. */
export declare function resolveCommandConfigWithSecrets<TConfig extends OpenClawConfig>(params: {
    config: TConfig;
    commandName: string;
    targetIds: Set<string>;
    mode?: CommandSecretResolutionMode;
    allowedPaths?: Set<string>;
    forcedActivePaths?: Set<string>;
    optionalActivePaths?: Set<string>;
    allowLocalExecSecretRefs?: boolean;
    scrubUnresolvedSecretRefs?: boolean;
    runtime?: RuntimeEnv;
    autoEnable?: boolean;
    env?: NodeJS.ProcessEnv;
}): Promise<{
    resolvedConfig: TConfig;
    effectiveConfig: TConfig;
    diagnostics: string[];
}>;
