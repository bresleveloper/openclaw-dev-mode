import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { AuthChoice } from "./onboard-types.js";
/** List deprecated CLI auth-choice aliases that manifest providers still recognize. */
export declare function resolveLegacyAuthChoiceAliasesForCli(params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): ReadonlyArray<AuthChoice>;
/** Map old onboard auth choices to their current provider-backed choices. */
export declare function normalizeLegacyOnboardAuthChoice(authChoice: AuthChoice | undefined, params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): AuthChoice | undefined;
/** Return true when an auth choice is a deprecated provider alias. */
export declare function isDeprecatedAuthChoice(authChoice: AuthChoice | undefined, params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): authChoice is AuthChoice;
/** Resolve the current replacement and warning text for a deprecated auth choice. */
export declare function resolveDeprecatedAuthChoiceReplacement(authChoice: AuthChoice, params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): {
    normalized: AuthChoice;
    message: string;
} | undefined;
/** Format the non-interactive error shown when a deprecated auth choice was supplied. */
export declare function formatDeprecatedNonInteractiveAuthChoiceError(authChoice: AuthChoice, params?: {
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): string | undefined;
