import type { PluginDiagnostic } from "./manifest-types.js";
/** Pushes a normalized plugin validation diagnostic. */
export declare function pushPluginValidationDiagnostic(params: {
    level: PluginDiagnostic["level"];
    pluginId: string;
    source: string;
    message: string;
    pushDiagnostic: (diag: PluginDiagnostic) => void;
}): void;
