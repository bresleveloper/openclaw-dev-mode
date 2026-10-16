//#region src/gateway/config-reload-settings.ts
function resolveGatewayReloadSettings(cfg, debounceMs = 300) {
	return {
		mode: cfg.gateway?.reload?.mode === "off" ? "off" : "hybrid",
		debounceMs
	};
}
//#endregion
export { resolveGatewayReloadSettings as t };
