import { bu as provider_runtime_d_exports } from "../types-BVLQjFJF.js";

//#region src/plugins/provider-runtime.runtime.d.ts
type ProviderRuntimeModule = typeof provider_runtime_d_exports;
type AugmentModelCatalogWithProviderPlugins = ProviderRuntimeModule["augmentModelCatalogWithProviderPlugins"];
type BuildProviderAuthDoctorHintWithPlugin = ProviderRuntimeModule["buildProviderAuthDoctorHintWithPlugin"];
type BuildProviderMissingAuthMessageWithPlugin = ProviderRuntimeModule["buildProviderMissingAuthMessageWithPlugin"];
type FormatProviderAuthProfileApiKeyWithPlugin = ProviderRuntimeModule["formatProviderAuthProfileApiKeyWithPlugin"];
type PrepareProviderRuntimeAuth = ProviderRuntimeModule["prepareProviderRuntimeAuth"];
type RefreshProviderOAuthCredentialWithPlugin = ProviderRuntimeModule["refreshProviderOAuthCredentialWithPlugin"];
/** Lazily augments the model catalog with provider plugin metadata. */
declare function augmentModelCatalogWithProviderPlugins(...args: Parameters<AugmentModelCatalogWithProviderPlugins>): Promise<Awaited<ReturnType<AugmentModelCatalogWithProviderPlugins>>>;
/** Lazily builds doctor hint text for provider auth problems. */
declare function buildProviderAuthDoctorHintWithPlugin(...args: Parameters<BuildProviderAuthDoctorHintWithPlugin>): Promise<Awaited<ReturnType<BuildProviderAuthDoctorHintWithPlugin>>>;
/** Lazily builds missing-auth messages with provider plugin context. */
declare function buildProviderMissingAuthMessageWithPlugin(...args: Parameters<BuildProviderMissingAuthMessageWithPlugin>): Promise<Awaited<ReturnType<BuildProviderMissingAuthMessageWithPlugin>>>;
/** Lazily formats API-key auth profile display text with provider plugin rules. */
declare function formatProviderAuthProfileApiKeyWithPlugin(...args: Parameters<FormatProviderAuthProfileApiKeyWithPlugin>): Promise<Awaited<ReturnType<FormatProviderAuthProfileApiKeyWithPlugin>>>;
/** Lazily prepares provider runtime auth for model execution. */
declare function prepareProviderRuntimeAuth(...args: Parameters<PrepareProviderRuntimeAuth>): Promise<Awaited<ReturnType<PrepareProviderRuntimeAuth>>>;
/** Lazily refreshes OAuth credentials through provider plugin runtime hooks. */
declare function refreshProviderOAuthCredentialWithPlugin(...args: Parameters<RefreshProviderOAuthCredentialWithPlugin>): Promise<Awaited<ReturnType<RefreshProviderOAuthCredentialWithPlugin>>>;
//#endregion
export { augmentModelCatalogWithProviderPlugins, buildProviderAuthDoctorHintWithPlugin, buildProviderMissingAuthMessageWithPlugin, formatProviderAuthProfileApiKeyWithPlugin, prepareProviderRuntimeAuth, refreshProviderOAuthCredentialWithPlugin };