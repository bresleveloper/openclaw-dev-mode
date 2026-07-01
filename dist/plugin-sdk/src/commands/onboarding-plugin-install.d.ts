import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { PluginPackageInstall } from "../plugins/manifest.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
/** Catalog entry used by onboarding to offer or require a plugin install. */
export type OnboardingPluginInstallEntry = {
    pluginId: string;
    label: string;
    install: PluginPackageInstall;
    trustedSourceLinkedOfficialInstall?: boolean;
    preferRemoteInstall?: boolean;
};
/** Outcome status for a single onboarding plugin install attempt. */
export type OnboardingPluginInstallStatus = "installed" | "skipped" | "failed" | "timed_out";
/** Config and status returned after attempting an onboarding plugin install. */
type OnboardingPluginInstallResult = {
    cfg: OpenClawConfig;
    installed: boolean;
    pluginId: string;
    status: OnboardingPluginInstallStatus;
};
/** Ensures an onboarding plugin is installed, enabled, and recorded in config. */
export declare function ensureOnboardingPluginInstalled(params: {
    cfg: OpenClawConfig;
    entry: OnboardingPluginInstallEntry;
    prompter: WizardPrompter;
    runtime: RuntimeEnv;
    workspaceDir?: string;
    promptInstall?: boolean;
    autoConfirmSingleSource?: boolean;
}): Promise<OnboardingPluginInstallResult>;
export {};
