import { t as createLazyImportLoader } from "./lazy-promise-BONnzNfb.js";
//#region src/plugins/provider-runtime.runtime.ts
/** Runtime-side provider discovery and provider registration resolution helpers. */
const providerRuntimeLoader = createLazyImportLoader(() => import("./provider-runtime-DEzbYGIK.js"));
async function loadProviderRuntime() {
	return await providerRuntimeLoader.load();
}
/** Lazily augments the model catalog with provider plugin metadata. */
async function augmentModelCatalogWithProviderPlugins(...args) {
	return (await loadProviderRuntime()).augmentModelCatalogWithProviderPlugins(...args);
}
/** Lazily builds doctor hint text for provider auth problems. */
async function buildProviderAuthDoctorHintWithPlugin(...args) {
	return (await loadProviderRuntime()).buildProviderAuthDoctorHintWithPlugin(...args);
}
/** Lazily builds missing-auth messages with provider plugin context. */
async function buildProviderMissingAuthMessageWithPlugin(...args) {
	return (await loadProviderRuntime()).buildProviderMissingAuthMessageWithPlugin(...args);
}
/** Lazily formats API-key auth profile display text with provider plugin rules. */
async function formatProviderAuthProfileApiKeyWithPlugin(...args) {
	return (await loadProviderRuntime()).formatProviderAuthProfileApiKeyWithPlugin(...args);
}
/** Lazily prepares provider runtime auth for model execution. */
async function prepareProviderRuntimeAuth(...args) {
	return (await loadProviderRuntime()).prepareProviderRuntimeAuth(...args);
}
/** Lazily refreshes OAuth credentials through provider plugin runtime hooks. */
async function refreshProviderOAuthCredentialWithPlugin(...args) {
	return (await loadProviderRuntime()).refreshProviderOAuthCredentialWithPlugin(...args);
}
//#endregion
export { prepareProviderRuntimeAuth as a, formatProviderAuthProfileApiKeyWithPlugin as i, buildProviderAuthDoctorHintWithPlugin as n, refreshProviderOAuthCredentialWithPlugin as o, buildProviderMissingAuthMessageWithPlugin as r, augmentModelCatalogWithProviderPlugins as t };
