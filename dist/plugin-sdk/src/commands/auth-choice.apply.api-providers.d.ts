import type { ApplyAuthChoiceParams } from "./auth-choice.apply.types.js";
import type { AuthChoice } from "./onboard-types.js";
/** Translate generic api-key/token choices to provider-specific auth choices when possible. */
export declare function normalizeApiKeyTokenProviderAuthChoice(params: {
    authChoice: AuthChoice;
    tokenProvider?: string;
    config?: ApplyAuthChoiceParams["config"];
    workspaceDir?: string;
    env?: NodeJS.ProcessEnv;
}): AuthChoice;
