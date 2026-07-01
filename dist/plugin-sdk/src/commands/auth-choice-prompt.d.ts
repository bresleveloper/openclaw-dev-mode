import type { AuthProfileStore } from "../agents/auth-profiles/types.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { AuthChoice } from "./onboard-types.js";
/** Prompt for a provider group and auth method, with fallback flat selection when needed. */
export declare function promptAuthChoiceGrouped(params: {
    prompter: WizardPrompter;
    store: AuthProfileStore;
    includeSkip: boolean;
    config?: OpenClawConfig;
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): Promise<AuthChoice>;
