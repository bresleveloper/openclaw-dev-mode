import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { type AuthChoiceGroup, type AuthChoiceOption } from "./auth-choice-options.static.js";
/** Sort auth-choice groups with featured providers first, then stable labels. */
export declare function compareAuthChoiceGroups(a: AuthChoiceGroup, b: AuthChoiceGroup): number;
/** Format all currently available auth-choice values for CLI help/validation. */
export declare function formatAuthChoiceChoicesForCli(params?: {
    includeSkip?: boolean;
    includeLegacyAliases?: boolean;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): string;
/** Build flat auth-choice options from core choices plus provider setup flows. */
export declare function buildAuthChoiceOptions(params: {
    store: AuthProfileStore;
    includeSkip: boolean;
    assistantVisibleOnly?: boolean;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): AuthChoiceOption[];
/** Build grouped assistant-visible auth choices for the onboarding prompt. */
export declare function buildAuthChoiceGroups(params: {
    store: AuthProfileStore;
    includeSkip: boolean;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): {
    groups: AuthChoiceGroup[];
    skipOption?: AuthChoiceOption;
};
