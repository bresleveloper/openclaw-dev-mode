import type { OpenClawConfig } from "../config/types.js";
import type { SecretInput } from "../config/types.secrets.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import type { SecretInputMode } from "./provider-auth-types.js";
export { extractEnvVarFromSourceLabel, promptSecretRefForSetup, resolveRefFallbackInput, type SecretRefSetupPromptCopy, } from "./provider-auth-ref.js";
export { resolveSecretInputModeForEnvSelection, type SecretInputModePromptCopy, } from "./provider-auth-mode.js";
/** Normalizes pasted API-key input, including shell assignment forms. */
export declare function normalizeApiKeyInput(raw: string): string;
/** Validates required API-key input for setup prompts. */
export declare const validateApiKeyInput: (value: string) => "Required" | undefined;
/** Formats a redacted API-key preview for setup confirmation prompts. */
export declare function formatApiKeyPreview(raw: string, opts?: {
    head?: number;
    tail?: number;
}): string;
/** Normalizes a token-provider selector from CLI/options input. */
export declare function normalizeTokenProviderInput(tokenProvider: string | null | undefined): string | undefined;
/** Normalizes secret input mode values accepted by provider setup. */
export declare function normalizeSecretInputModeInput(secretInputMode: string | null | undefined): SecretInputMode | undefined;
/** Applies a CLI-provided API key when its provider selector matches this auth method. */
export declare function maybeApplyApiKeyFromOption(params: {
    token: string | undefined;
    tokenProvider: string | undefined;
    secretInputMode?: SecretInputMode;
    expectedProviders: string[];
    normalize: (value: string) => string;
    setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
}): Promise<string | undefined>;
/** Resolves an API key from CLI options first, then environment or prompt fallback. */
export declare function ensureApiKeyFromOptionEnvOrPrompt(params: {
    token: string | undefined;
    tokenProvider: string | undefined;
    secretInputMode?: SecretInputMode;
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    expectedProviders: string[];
    provider: string;
    envLabel: string;
    promptMessage: string;
    normalize: (value: string) => string;
    validate: (value: string) => string | undefined;
    prompter: WizardPrompter;
    setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
    noteMessage?: string;
    noteTitle?: string;
}): Promise<string>;
/** Resolves an API key from environment or interactive prompt and records the chosen secret mode. */
export declare function ensureApiKeyFromEnvOrPrompt(params: {
    config: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    provider: string;
    envLabel: string;
    promptMessage: string;
    normalize: (value: string) => string;
    validate: (value: string) => string | undefined;
    prompter: WizardPrompter;
    secretInputMode?: SecretInputMode;
    setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
}): Promise<string>;
