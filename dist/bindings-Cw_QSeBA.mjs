//#region src/config/bindings.ts
/** Narrows a configured binding to the channel route form. */
function isRouteBinding(binding) {
	return binding.type !== "acp";
}
/** Returns the configured binding list, treating missing/non-array config as empty. */
function listConfiguredBindings(cfg) {
	return Array.isArray(cfg.bindings) ? cfg.bindings : [];
}
/** Lists channel route bindings, including legacy bindings without an explicit type. */
function listRouteBindings(cfg) {
	return listConfiguredBindings(cfg).filter(isRouteBinding);
}
/** Lists ACP conversation bindings only. */
function listAcpBindings(cfg) {
	return listConfiguredBindings(cfg).filter((binding) => binding.type === "acp");
}
//#endregion
export { listRouteBindings as i, listAcpBindings as n, listConfiguredBindings as r, isRouteBinding as t };
