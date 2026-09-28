import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
//#region src/secrets/egress-proxy/registry.ts
const SECRET_EGRESS_PROXY_REGISTRY_KEY = Symbol.for("openclaw.secretEgressProxy.registry");
function getSecretEgressProxyRegistry() {
	return resolveGlobalSingleton(SECRET_EGRESS_PROXY_REGISTRY_KEY, () => ({}));
}
function publishSecretEgressProxy(proxy) {
	const registry = getSecretEgressProxyRegistry();
	if (registry.activeProxy) throw new Error("Secret egress proxy is already active in this process");
	registry.activeProxy = proxy;
}
function clearSecretEgressProxy(proxy) {
	const registry = getSecretEgressProxyRegistry();
	if (registry.activeProxy === proxy) registry.activeProxy = void 0;
}
function isSecretEgressProxyActive() {
	return getSecretEgressProxyRegistry().activeProxy !== void 0;
}
/** Reads current certificate health without reloading trust files or starting a proxy. */
function getSecretEgressCertificateStatus() {
	return getSecretEgressProxyRegistry().activeProxy?.getCertificateStatus();
}
/** The exec supervisor owns this grant until cancellation or process exit. */
function registerSecretEgressProxyProcess(bindings) {
	const proxy = getSecretEgressProxyRegistry().activeProxy;
	if (!proxy) throw new Error("Secret egress proxy is not active in this Gateway process");
	return proxy.registerProcess(bindings);
}
//#endregion
export { registerSecretEgressProxyProcess as a, publishSecretEgressProxy as i, getSecretEgressCertificateStatus as n, isSecretEgressProxyActive as r, clearSecretEgressProxy as t };
