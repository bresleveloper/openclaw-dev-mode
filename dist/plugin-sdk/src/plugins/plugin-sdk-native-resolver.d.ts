import { type PluginSdkResolutionPreference } from "./sdk-alias.js";
/** Resolver install options for CJS `_resolveFilename` and modern ESM loader hooks. */
export type InstallOpenClawPluginSdkNativeResolverOptions = {
    modulePath?: string;
    pluginModulePath?: string;
    allowedParentRoots?: readonly string[];
    argv1?: string;
    moduleUrl?: string;
    devSourceRoot?: string | null;
    pluginSdkResolution?: PluginSdkResolutionPreference;
};
export declare function installOpenClawPluginSdkNativeResolver(options?: InstallOpenClawPluginSdkNativeResolverOptions): string[];
export declare function installOpenClawInternalCorePackageNativeResolver(options?: Pick<InstallOpenClawPluginSdkNativeResolverOptions, "moduleUrl">): string[];
export declare function resetOpenClawPluginSdkNativeResolverForTest(): void;
