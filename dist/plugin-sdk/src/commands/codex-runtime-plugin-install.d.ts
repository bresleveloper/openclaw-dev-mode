export declare const CODEX_RUNTIME_PLUGIN_ID = "codex";
export declare const ensureCodexRuntimePluginForModelSelection: (params: import("./runtime-plugin-install.js").RuntimePluginEnsureParams) => Promise<import("./runtime-plugin-install.js").RuntimePluginInstallResult>;
export declare const repairCodexRuntimePluginInstallForModelSelection: (params: import("./runtime-plugin-install.js").RuntimePluginRepairParams) => Promise<{
    required: boolean;
    changes: string[];
    warnings: string[];
}>;
