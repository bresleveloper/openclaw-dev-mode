import { type ConfigFileSnapshot, type OpenClawConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
/** Read the config file and exit through the runtime when validation fails. */
export declare function requireValidConfigFileSnapshot(runtime: RuntimeEnv, opts?: {
    includeCompatibilityAdvisory?: boolean;
}): Promise<ConfigFileSnapshot | null>;
/** Read and return a valid OpenClaw config, or null after reporting validation errors. */
export declare function requireValidConfigSnapshot(runtime: RuntimeEnv, opts?: {
    includeCompatibilityAdvisory?: boolean;
}): Promise<OpenClawConfig | null>;
