import type { OpenClawConfig } from "../config/types.openclaw.js";
type InstallPolicyHealthOptions = {
    deep?: boolean;
    env?: NodeJS.ProcessEnv;
};
/** Builds doctor note lines for static install policy validation and optional deep probing. */
export declare function collectInstallPolicyHealthLines(cfg: OpenClawConfig, options?: InstallPolicyHealthOptions): Promise<string[]>;
/** Emits install policy health notes when policy validation finds configured coverage or errors. */
export declare function noteInstallPolicyHealth(cfg: OpenClawConfig, options?: InstallPolicyHealthOptions): Promise<void>;
export {};
