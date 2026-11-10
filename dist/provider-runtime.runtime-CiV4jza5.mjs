import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as createLazyRuntimeMethodBinder } from "./lazy-runtime-CJrzFzqU.mjs";
//#region src/plugins/provider-runtime.runtime.ts
const providerRuntimeLoader = createLazyImportLoader(() => import("./provider-runtime-v9poOx_b.mjs"));
const bindProviderRuntime = createLazyRuntimeMethodBinder(providerRuntimeLoader.load);
const augmentModelCatalogWithProviderPlugins = bindProviderRuntime((runtime) => runtime.augmentModelCatalogWithProviderPlugins);
const buildProviderAuthDoctorHintWithPlugin = bindProviderRuntime((runtime) => runtime.buildProviderAuthDoctorHintWithPlugin);
const formatProviderAuthProfileApiKeyWithPlugin = bindProviderRuntime((runtime) => runtime.formatProviderAuthProfileApiKeyWithPlugin);
const loginProviderOAuthWithPlugin = bindProviderRuntime((runtime) => runtime.loginProviderOAuthWithPlugin);
const resolveProviderOAuthCredentialWithPlugin = bindProviderRuntime((runtime) => runtime.resolveProviderOAuthCredentialWithPlugin);
const resolveProviderOAuthRefreshCapabilityWithPlugin = bindProviderRuntime((runtime) => runtime.resolveProviderOAuthRefreshCapabilityWithPlugin);
const prepareProviderRuntimeAuth = bindProviderRuntime((runtime) => runtime.prepareProviderRuntimeAuth);
const refreshProviderOAuthCredentialWithPlugin = bindProviderRuntime((runtime) => runtime.refreshProviderOAuthCredentialWithPlugin);
//#endregion
export { prepareProviderRuntimeAuth as a, resolveProviderOAuthRefreshCapabilityWithPlugin as c, loginProviderOAuthWithPlugin as i, buildProviderAuthDoctorHintWithPlugin as n, refreshProviderOAuthCredentialWithPlugin as o, formatProviderAuthProfileApiKeyWithPlugin as r, resolveProviderOAuthCredentialWithPlugin as s, augmentModelCatalogWithProviderPlugins as t };
