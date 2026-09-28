//#region src/gateway/config-reload-settings.ts
const DEFAULT_RELOAD_SETTINGS = {
	mode: "hybrid",
	debounceMs: 300
};
/** Resolves gateway reload mode/debounce from config with bounded defaults. */
function resolveGatewayReloadSettings(cfg) {
	const rawMode = cfg.gateway?.reload?.mode;
	return {
		mode: rawMode === "off" || rawMode === "hybrid" ? rawMode : DEFAULT_RELOAD_SETTINGS.mode,
		debounceMs: DEFAULT_RELOAD_SETTINGS.debounceMs
	};
}
//#endregion
export { resolveGatewayReloadSettings as t };
