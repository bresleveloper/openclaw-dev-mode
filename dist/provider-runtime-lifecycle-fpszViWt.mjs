//#region src/agents/provider-runtime-lifecycle.ts
let managedProviderLocalServicesStop;
let providerTransportDispatcherPoolActive = false;
function setManagedProviderLocalServicesStop(stop) {
	managedProviderLocalServicesStop = stop;
}
function hasManagedProviderLocalServices() {
	return managedProviderLocalServicesStop !== void 0;
}
async function stopActiveManagedProviderLocalServices() {
	await managedProviderLocalServicesStop?.();
}
function setProviderTransportDispatcherPoolActive(active) {
	providerTransportDispatcherPoolActive = active;
}
function hasProviderTransportDispatcherPool() {
	return providerTransportDispatcherPoolActive;
}
//#endregion
export { stopActiveManagedProviderLocalServices as a, setProviderTransportDispatcherPoolActive as i, hasProviderTransportDispatcherPool as n, setManagedProviderLocalServicesStop as r, hasManagedProviderLocalServices as t };
