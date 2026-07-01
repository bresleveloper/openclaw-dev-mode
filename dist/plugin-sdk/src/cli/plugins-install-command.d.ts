import type { InstallSafetyOverrides } from "../plugins/install-security-scan.js";
import { type RuntimeEnv } from "../runtime.js";
import { type PluginInstallRequestContext } from "./plugin-install-config-policy.js";
import { type ConfigMutationPreflight, type ConfigSnapshotForInstallPersist } from "./plugins-install-persist.js";
type ConfigSnapshotForInstallExecution = ConfigSnapshotForInstallPersist & {
    hookMutation: ConfigMutationPreflight;
    pluginMutation: ConfigMutationPreflight;
};
export declare function loadConfigForInstall(request: PluginInstallRequestContext): Promise<ConfigSnapshotForInstallExecution>;
export declare function runPluginInstallCommand(params: {
    raw: string;
    opts: InstallSafetyOverrides & {
        force?: boolean;
        link?: boolean;
        pin?: boolean;
        marketplace?: string;
    };
    invalidateRuntimeCache?: boolean;
    runtime?: RuntimeEnv;
}): Promise<void>;
export {};
