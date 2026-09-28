import { i as loadBundledPluginPublicSurfaceModuleSyncCore } from "../facade-loader-BWw5NpKt.mjs";
//#region src/plugin-sdk/telegram-account.ts
function loadTelegramAccountFacadeModule() {
	return loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "telegram",
		artifactBasename: "api.js"
	});
}
/**
* @deprecated Compatibility facade for plugin code that needs Telegram account resolution.
* New channel plugins should prefer injected runtime helpers and generic SDK subpaths.
*/
function resolveTelegramAccount(params) {
	return loadTelegramAccountFacadeModule().resolveTelegramAccount(params);
}
//#endregion
export { resolveTelegramAccount };
