import type { WizardPrompter } from "../../wizard/prompts.js";
/**
 * Group access policy selected during channel setup.
 */
export type ChannelAccessPolicy = "allowlist" | "open" | "disabled";
/**
 * Parses comma, semicolon, or newline separated allowlist entries.
 */
export declare function parseAllowlistEntries(raw: string): string[];
/**
 * Formats allowlist entries for setup prompt initial values.
 */
export declare function formatAllowlistEntries(entries: string[]): string;
/**
 * Prompts for the group access policy allowed by the channel setup flow.
 */
export declare function promptChannelAccessPolicy(params: {
    prompter: WizardPrompter;
    label: string;
    currentPolicy?: ChannelAccessPolicy;
    allowOpen?: boolean;
    allowDisabled?: boolean;
}): Promise<ChannelAccessPolicy>;
/**
 * Prompts for group allowlist entries and normalizes the response.
 */
export declare function promptChannelAllowlist(params: {
    prompter: WizardPrompter;
    label: string;
    currentEntries?: string[];
    placeholder?: string;
}): Promise<string[]>;
/**
 * Prompts for the full group access config, including allowlist entries when needed.
 */
export declare function promptChannelAccessConfig(params: {
    prompter: WizardPrompter;
    label: string;
    currentPolicy?: ChannelAccessPolicy;
    currentEntries?: string[];
    placeholder?: string;
    allowOpen?: boolean;
    allowDisabled?: boolean;
    skipAllowlistEntries?: boolean;
    defaultPrompt?: boolean;
    updatePrompt?: boolean;
}): Promise<{
    policy: ChannelAccessPolicy;
    entries: string[];
} | null>;
