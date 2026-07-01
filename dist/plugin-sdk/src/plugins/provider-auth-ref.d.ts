import type { OpenClawConfig } from "../config/types.js";
import { type SecretRef } from "../config/types.secrets.js";
import type { WizardPrompter } from "../wizard/prompts.js";
/** Copy overrides used while prompting for provider secret-ref setup. */
export type SecretRefSetupPromptCopy = {
    sourceMessage?: string;
    envVarMessage?: string;
    envVarPlaceholder?: string;
    envVarFormatError?: string;
    envVarMissingError?: (envVar: string) => string;
    noProvidersMessage?: string;
    envValidatedMessage?: (envVar: string) => string;
    providerValidatedMessage?: (provider: string, id: string, source: "file" | "exec") => string;
};
/** Extracts a trailing env var name from a human-facing secret source label. */
export declare function extractEnvVarFromSourceLabel(source: string): string | undefined;
export declare function resolveRefFallbackInput(params: {
    config: OpenClawConfig;
    provider: string;
    preferredEnvVar?: string;
    env?: NodeJS.ProcessEnv;
}): {
    ref: SecretRef;
    resolvedValue: string;
};
export declare function promptSecretRefForSetup(params: {
    provider: string;
    config: OpenClawConfig;
    prompter: WizardPrompter;
    preferredEnvVar?: string;
    copy?: SecretRefSetupPromptCopy;
    env?: NodeJS.ProcessEnv;
}): Promise<{
    ref: SecretRef;
    resolvedValue: string;
}>;
