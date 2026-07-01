import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { WizardPrompter } from "../wizard/prompts.js";
/** Warn when the selected default model is unknown or has no usable credentials. */
export declare function warnIfModelConfigLooksOff(config: OpenClawConfig, prompter: WizardPrompter, options?: {
    agentId?: string;
    agentDir?: string;
    validateCatalog?: boolean;
}): Promise<void>;
