type ResolveProviderPluginChoice = typeof import("./provider-wizard.js").resolveProviderPluginChoice;
type RunProviderModelSelectedHook = typeof import("./provider-wizard.js").runProviderModelSelectedHook;
type ResolvePluginProviders = typeof import("./providers.runtime.js").resolvePluginProviders;
type ResolvePluginSetupProvider = typeof import("./setup-registry.js").resolvePluginSetupProvider;
/** Runtime wrapper for provider plugin wizard choice resolution. */
export declare function resolveProviderPluginChoice(...args: Parameters<ResolveProviderPluginChoice>): ReturnType<ResolveProviderPluginChoice>;
/** Runtime wrapper for provider model-selected hook dispatch. */
export declare function runProviderModelSelectedHook(...args: Parameters<RunProviderModelSelectedHook>): ReturnType<RunProviderModelSelectedHook>;
/** Runtime wrapper for registered model provider discovery. */
export declare function resolvePluginProviders(...args: Parameters<ResolvePluginProviders>): ReturnType<ResolvePluginProviders>;
/** Runtime wrapper for plugin setup-provider discovery. */
export declare function resolvePluginSetupProvider(...args: Parameters<ResolvePluginSetupProvider>): ReturnType<ResolvePluginSetupProvider>;
export {};
