//#region src/agents/provider-runtime-lifecycle.ts
let managedProviderLocalServicesActive = false;
let providerTransportDispatcherPoolActive = false;
function setManagedProviderLocalServicesActive(active) {
	managedProviderLocalServicesActive = active;
}
function hasManagedProviderLocalServices() {
	return managedProviderLocalServicesActive;
}
function setProviderTransportDispatcherPoolActive(active) {
	providerTransportDispatcherPoolActive = active;
}
function hasProviderTransportDispatcherPool() {
	return providerTransportDispatcherPoolActive;
}
//#endregion
export { setProviderTransportDispatcherPoolActive as i, hasProviderTransportDispatcherPool as n, setManagedProviderLocalServicesActive as r, hasManagedProviderLocalServices as t };
