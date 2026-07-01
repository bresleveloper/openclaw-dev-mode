import type { OpenClawConfig } from "../config/types.openclaw.js";
/** True for CLI runtime provider ids such as `claude-cli` and `google-gemini-cli`. */
export declare function isCliRuntimeProvider(provider: string, params?: {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    includeSetupRegistry?: boolean;
}): boolean;
export declare function isCliRuntimeAlias(runtime: string | undefined): boolean;
export declare function isCliRuntimeAliasForProvider(params: {
    runtime: string | undefined;
    provider: string | undefined;
    cfg?: OpenClawConfig;
}): boolean;
type RuntimeAliasComparisonOptions = {
    config?: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    includeSetupRegistry?: boolean;
};
export declare function areRuntimeModelRefsEquivalent(left: string, right: string, options?: RuntimeAliasComparisonOptions): boolean;
export declare function shouldPreferActiveRuntimeAliasAuthLabel(params: {
    runtimeAliasModelEquivalent: boolean;
    selectedAuthLabel?: string;
    activeAuthLabel?: string;
}): boolean;
export declare function resolveCliRuntimeExecutionProvider(params: {
    provider: string;
    cfg?: OpenClawConfig;
    agentId?: string;
    modelId?: string;
    authProfileId?: string;
}): string | undefined;
export {};
