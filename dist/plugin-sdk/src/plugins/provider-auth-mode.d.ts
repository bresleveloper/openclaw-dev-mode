import type { WizardPrompter } from "../wizard/prompts.js";
import type { SecretInputMode } from "./provider-auth-types.js";
/** Prompt copy overrides for provider secret input mode selection. */
export type SecretInputModePromptCopy = {
    modeMessage?: string;
    plaintextLabel?: string;
    plaintextHint?: string;
    refLabel?: string;
    refHint?: string;
};
/** Resolves provider secret input mode from explicit option or wizard selection. */
export declare function resolveSecretInputModeForEnvSelection(params: {
    prompter: Pick<WizardPrompter, "select">;
    explicitMode?: SecretInputMode;
    copy?: SecretInputModePromptCopy;
}): Promise<SecretInputMode>;
