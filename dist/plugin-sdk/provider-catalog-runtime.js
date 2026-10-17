import { t as _usingCtx } from "../usingCtx-DwOBYOJf.mjs";
import { d as resolveOwningPluginIdsForProvider, i as resolveCatalogHookProviderPluginIds } from "../providers-DQUFJKZx.mjs";
import { r as resolvePluginProvidersCore, t as isPluginProvidersLoadInFlight } from "../providers.runtime-BsABoqOU.mjs";
import { n as augmentModelCatalogWithProviderPlugins } from "../provider-runtime-Ck_Cecr1.mjs";
import { t as createLegacyPluginSdkProviderProjection } from "../legacy-sdk-provider-projection-BsT-Rpn5.mjs";
//#region src/plugin-sdk/provider-catalog-runtime.ts
/** Bare provider callbacks retain borrowed resources until their SDK host closes. */
function resolvePluginProvidersForSdk(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		const projection = _usingCtx$1.u(createLegacyPluginSdkProviderProjection());
		const providers = resolvePluginProvidersCore(params, (registry) => {
			const project = projection.select(registry);
			return project ? (provider, pluginId) => Object.assign({}, project(provider, pluginId), { pluginId }) : void 0;
		});
		projection.adopt();
		return providers;
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
export { augmentModelCatalogWithProviderPlugins, isPluginProvidersLoadInFlight, resolveCatalogHookProviderPluginIds, resolveOwningPluginIdsForProvider, resolvePluginProvidersForSdk as resolvePluginProviders };
