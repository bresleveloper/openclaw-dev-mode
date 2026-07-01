export declare const COPILOT_RUNTIME_PLUGIN_ID = "copilot";
export declare const ensureCopilotRuntimePluginForModelSelection: (params: import("./runtime-plugin-install.js").RuntimePluginEnsureParams) => Promise<import("./runtime-plugin-install.js").RuntimePluginInstallResult>;
export declare const repairCopilotRuntimePluginInstallForModelSelection: (params: import("./runtime-plugin-install.js").RuntimePluginRepairParams) => Promise<{
    required: boolean;
    changes: string[];
    warnings: string[];
}>;
