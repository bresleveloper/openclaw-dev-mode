/**
 * Setup wizard binary helpers.
 *
 * Builds status and text-input helpers for channel setup flows that need local binaries.
 */
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import type { ChannelSetupWizard, ChannelSetupWizardStatus, ChannelSetupWizardTextInput } from "./setup-wizard.js";
type SetupTextInputParams = Parameters<NonNullable<ChannelSetupWizardTextInput["currentValue"]>>[0];
/**
 * Creates setup status resolvers for channels backed by a required local binary.
 */
export declare function createDetectedBinaryStatus(params: {
    channelLabel: string;
    binaryLabel: string;
    configuredLabel: string;
    unconfiguredLabel: string;
    configuredHint: string;
    unconfiguredHint: string;
    configuredScore: number;
    unconfiguredScore: number;
    resolveConfigured: (params: {
        cfg: OpenClawConfig;
        accountId?: string;
    }) => boolean | Promise<boolean>;
    resolveBinaryPath: (params: {
        cfg: OpenClawConfig;
        accountId?: string;
    }) => string;
    detectBinary?: (path: string) => Promise<boolean>;
}): ChannelSetupWizardStatus;
/**
 * Creates a setup text input that records or reuses a CLI path.
 */
export declare function createCliPathTextInput(params: {
    inputKey: ChannelSetupWizardTextInput["inputKey"];
    message: string;
    resolvePath: (params: SetupTextInputParams) => string | undefined;
    shouldPrompt: NonNullable<ChannelSetupWizardTextInput["shouldPrompt"]>;
    helpTitle?: string;
    helpLines?: string[];
}): ChannelSetupWizardTextInput;
/**
 * Creates delegated status resolvers backed by a lazily loaded setup wizard.
 */
export declare function createDelegatedSetupWizardStatusResolvers(loadWizard: () => Promise<ChannelSetupWizard>): Pick<ChannelSetupWizardStatus, "resolveStatusLines" | "resolveSelectionHint" | "resolveQuickstartScore">;
/**
 * Delegates a text input's `shouldPrompt` check to a lazily loaded setup wizard.
 */
export declare function createDelegatedTextInputShouldPrompt(params: {
    loadWizard: () => Promise<ChannelSetupWizard>;
    inputKey: ChannelSetupWizardTextInput["inputKey"];
}): NonNullable<ChannelSetupWizardTextInput["shouldPrompt"]>;
export {};
