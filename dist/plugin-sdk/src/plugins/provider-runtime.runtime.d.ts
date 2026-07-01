type ProviderRuntimeModule = typeof import("./provider-runtime.js");
type AugmentModelCatalogWithProviderPlugins = ProviderRuntimeModule["augmentModelCatalogWithProviderPlugins"];
type BuildProviderAuthDoctorHintWithPlugin = ProviderRuntimeModule["buildProviderAuthDoctorHintWithPlugin"];
type BuildProviderMissingAuthMessageWithPlugin = ProviderRuntimeModule["buildProviderMissingAuthMessageWithPlugin"];
type FormatProviderAuthProfileApiKeyWithPlugin = ProviderRuntimeModule["formatProviderAuthProfileApiKeyWithPlugin"];
type PrepareProviderRuntimeAuth = ProviderRuntimeModule["prepareProviderRuntimeAuth"];
type RefreshProviderOAuthCredentialWithPlugin = ProviderRuntimeModule["refreshProviderOAuthCredentialWithPlugin"];
/** Lazily augments the model catalog with provider plugin metadata. */
export declare function augmentModelCatalogWithProviderPlugins(...args: Parameters<AugmentModelCatalogWithProviderPlugins>): Promise<Awaited<ReturnType<AugmentModelCatalogWithProviderPlugins>>>;
/** Lazily builds doctor hint text for provider auth problems. */
export declare function buildProviderAuthDoctorHintWithPlugin(...args: Parameters<BuildProviderAuthDoctorHintWithPlugin>): Promise<Awaited<ReturnType<BuildProviderAuthDoctorHintWithPlugin>>>;
/** Lazily builds missing-auth messages with provider plugin context. */
export declare function buildProviderMissingAuthMessageWithPlugin(...args: Parameters<BuildProviderMissingAuthMessageWithPlugin>): Promise<Awaited<ReturnType<BuildProviderMissingAuthMessageWithPlugin>>>;
/** Lazily formats API-key auth profile display text with provider plugin rules. */
export declare function formatProviderAuthProfileApiKeyWithPlugin(...args: Parameters<FormatProviderAuthProfileApiKeyWithPlugin>): Promise<Awaited<ReturnType<FormatProviderAuthProfileApiKeyWithPlugin>>>;
/** Lazily prepares provider runtime auth for model execution. */
export declare function prepareProviderRuntimeAuth(...args: Parameters<PrepareProviderRuntimeAuth>): Promise<Awaited<ReturnType<PrepareProviderRuntimeAuth>>>;
/** Lazily refreshes OAuth credentials through provider plugin runtime hooks. */
export declare function refreshProviderOAuthCredentialWithPlugin(...args: Parameters<RefreshProviderOAuthCredentialWithPlugin>): Promise<Awaited<ReturnType<RefreshProviderOAuthCredentialWithPlugin>>>;
export {};
