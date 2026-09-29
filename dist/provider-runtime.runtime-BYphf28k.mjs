import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as createLazyRuntimeMethodBinder } from "./lazy-runtime-BPNHa36e.mjs";
//#region src/plugins/provider-runtime.runtime.ts
/** Runtime-side provider discovery and provider registration resolution helpers. */
const providerRuntimeLoader = createLazyImportLoader(() => import("./provider-runtime-DuD6uek4.mjs"));
const bindProviderRuntime = createLazyRuntimeMethodBinder(providerRuntimeLoader.load);
/** Lazily augments the model catalog with provider plugin metadata. */
const augmentModelCatalogWithProviderPlugins = bindProviderRuntime((runtime) => runtime.augmentModelCatalogWithProviderPlugins);
/** Lazily builds doctor hint text for provider auth problems. */
const buildProviderAuthDoctorHintWithPlugin = bindProviderRuntime((runtime) => runtime.buildProviderAuthDoctorHintWithPlugin);
/** Lazily formats API-key auth profile display text with provider plugin rules. */
const formatProviderAuthProfileApiKeyWithPlugin = bindProviderRuntime((runtime) => runtime.formatProviderAuthProfileApiKeyWithPlugin);
/** Lazily runs the callback-based OAuth login owned by a provider plugin. */
const loginProviderOAuthWithPlugin = bindProviderRuntime((runtime) => runtime.loginProviderOAuthWithPlugin);
/** Lazily resolves or refreshes a session OAuth credential through its provider plugin. */
const resolveProviderOAuthCredentialWithPlugin = bindProviderRuntime((runtime) => runtime.resolveProviderOAuthCredentialWithPlugin);
/** Lazily checks whether a provider plugin owns OAuth refresh. */
const resolveProviderOAuthRefreshCapabilityWithPlugin = bindProviderRuntime((runtime) => runtime.resolveProviderOAuthRefreshCapabilityWithPlugin);
/** Lazily prepares provider runtime auth for model execution. */
const prepareProviderRuntimeAuth = bindProviderRuntime((runtime) => runtime.prepareProviderRuntimeAuth);
/** Lazily refreshes OAuth credentials through provider plugin runtime hooks. */
const refreshProviderOAuthCredentialWithPlugin = bindProviderRuntime((runtime) => runtime.refreshProviderOAuthCredentialWithPlugin);
//#endregion
export { prepareProviderRuntimeAuth as a, resolveProviderOAuthRefreshCapabilityWithPlugin as c, loginProviderOAuthWithPlugin as i, buildProviderAuthDoctorHintWithPlugin as n, refreshProviderOAuthCredentialWithPlugin as o, formatProviderAuthProfileApiKeyWithPlugin as r, resolveProviderOAuthCredentialWithPlugin as s, augmentModelCatalogWithProviderPlugins as t };
