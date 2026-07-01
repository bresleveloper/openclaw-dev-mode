import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { type CustomApiResult } from "./onboard-custom-config.js";
export { applyCustomApiConfig, buildAnthropicVerificationProbeRequest, buildOpenAiVerificationProbeRequest, CustomApiError, inferCustomModelSupportsImageInput, parseNonInteractiveCustomApiFlags, resolveCustomModelImageInputInference, resolveCustomProviderId, } from "./onboard-custom-config.js";
import type { SecretInputMode } from "./onboard-types.js";
/** Prompts for a custom API provider, verifies it, and persists the selected model. */
export declare function promptCustomApiConfig(params: {
    prompter: WizardPrompter;
    runtime: RuntimeEnv;
    config: OpenClawConfig;
    secretInputMode?: SecretInputMode;
}): Promise<CustomApiResult>;
