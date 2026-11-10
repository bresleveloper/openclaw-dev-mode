import { s as nativePluginBindings } from "./loader-runtime-load-DzFljQbT.mjs";
//#region src/plugins/provider-auth-availability.ts
const { isProviderApiKeyConfiguredAsync, listUsableProviderAuthProfileIdsAsync, isProviderAuthProfileConfiguredAsync, resolveProviderAuthProfileApiKey } = nativePluginBindings.authAvailability;
/** @deprecated Use isProviderApiKeyConfiguredAsync. Final compatibility day: 2026-12-31. */
const isProviderApiKeyConfigured = nativePluginBindings.authAvailability.isProviderApiKeyConfigured;
/** @deprecated Use listUsableProviderAuthProfileIdsAsync. Final compatibility day: 2026-12-31. */
const listUsableProviderAuthProfileIds = nativePluginBindings.authAvailability.listUsableProviderAuthProfileIds;
/** @deprecated Use isProviderAuthProfileConfiguredAsync. Final compatibility day: 2026-12-31. */
const isProviderAuthProfileConfigured = nativePluginBindings.authAvailability.isProviderAuthProfileConfigured;
//#endregion
export { listUsableProviderAuthProfileIds as a, isProviderAuthProfileConfiguredAsync as i, isProviderApiKeyConfiguredAsync as n, listUsableProviderAuthProfileIdsAsync as o, isProviderAuthProfileConfigured as r, resolveProviderAuthProfileApiKey as s, isProviderApiKeyConfigured as t };
