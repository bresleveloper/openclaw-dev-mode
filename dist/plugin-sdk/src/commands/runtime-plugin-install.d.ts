import type { OpenClawConfig } from "../config/types.openclaw.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
/** Static install metadata for a runtime plugin required by model selection. */
export type RuntimePluginInstallDescriptor = {
    pluginId: string;
    label: string;
    npmSpec: string;
    warningLabel: string;
};
/** Result returned after ensuring a runtime plugin for a selected model. */
export type RuntimePluginInstallResult = {
    cfg: OpenClawConfig;
    required: boolean;
    installed: boolean;
    status?: "installed" | "skipped" | "failed" | "timed_out";
};
/** Predicate that decides whether a config/model pair needs the runtime plugin. */
export type RuntimePluginSelection = (params: {
    cfg: OpenClawConfig;
    model?: string;
}) => boolean;
/** Parameters for installing or enabling a runtime plugin during setup. */
export type RuntimePluginEnsureParams = {
    cfg: OpenClawConfig;
    model?: string;
    prompter: WizardPrompter;
    runtime: RuntimeEnv;
    workspaceDir?: string;
};
/** Parameters for doctor-style runtime plugin repair. */
export type RuntimePluginRepairParams = {
    cfg: OpenClawConfig;
    model?: string;
    env?: NodeJS.ProcessEnv;
};
/** Convenience helpers bound to one runtime plugin descriptor. */
export type RuntimePluginModelSelectionHelpers = {
    ensure: (params: RuntimePluginEnsureParams) => Promise<RuntimePluginInstallResult>;
    repair: (params: RuntimePluginRepairParams) => Promise<{
        required: boolean;
        changes: string[];
        warnings: string[];
    }>;
};
/** Ensures the runtime plugin required by the selected model is installed and enabled. */
export declare function ensureRuntimePluginForModelSelection(params: {
    cfg: OpenClawConfig;
    model?: string;
    prompter: WizardPrompter;
    runtime: RuntimeEnv;
    workspaceDir?: string;
    descriptor: RuntimePluginInstallDescriptor;
    shouldEnsure: RuntimePluginSelection;
}): Promise<RuntimePluginInstallResult>;
/** Repairs missing install records for runtime plugins required by model selection. */
export declare function repairRuntimePluginInstallForModelSelection(params: {
    cfg: OpenClawConfig;
    model?: string;
    env?: NodeJS.ProcessEnv;
    descriptor: RuntimePluginInstallDescriptor;
    shouldEnsure: RuntimePluginSelection;
}): Promise<{
    required: boolean;
    changes: string[];
    warnings: string[];
}>;
/** Creates ensure/repair helpers pre-bound to a runtime plugin descriptor. */
export declare function createRuntimePluginModelSelectionHelpers(params: {
    descriptor: RuntimePluginInstallDescriptor;
    shouldEnsure: RuntimePluginSelection;
}): RuntimePluginModelSelectionHelpers;
