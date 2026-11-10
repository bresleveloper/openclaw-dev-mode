//#region src/infra/net/proxy/active-proxy-state.ts
let activeProxyUrl;
let activeProxyLoopbackMode;
let activeProxyTlsOptions;
function parseActiveManagedProxyLoopbackMode(value) {
	if (value === "gateway-only" || value === "proxy" || value === "block") return value;
}
function readInheritedActiveManagedProxyLoopbackMode() {
	if (process.env["OPENCLAW_PROXY_ACTIVE"] !== "1") return;
	return parseActiveManagedProxyLoopbackMode(process.env["OPENCLAW_PROXY_LOOPBACK_MODE"]) ?? "gateway-only";
}
/** Registers the process's single active managed proxy. */
function registerActiveManagedProxyUrl(proxyUrl, options = "gateway-only") {
	const normalizedProxyUrl = new URL(proxyUrl.href);
	const loopbackMode = typeof options === "string" ? options : options.loopbackMode ?? "gateway-only";
	const proxyTls = typeof options === "string" ? void 0 : options.proxyTls;
	if (activeProxyUrl !== void 0) {
		if (activeProxyUrl.href !== normalizedProxyUrl.href) throw new Error("proxy: cannot activate a managed proxy while another proxy is active; stop the current proxy before changing proxy.proxyUrl.");
		if (activeProxyLoopbackMode !== loopbackMode) throw new Error("proxy: cannot activate a managed proxy with a different proxy.loopbackMode while another proxy is active; stop the current proxy before changing proxy.loopbackMode.");
		if (activeProxyTlsOptions?.ca !== proxyTls?.ca) throw new Error("proxy: cannot activate a managed proxy with different proxy TLS options while another proxy is active; stop the current proxy before changing proxy.tls.");
		throw new Error("proxy: cannot activate a managed proxy while another proxy is active; stop the current proxy before changing proxy.proxyUrl.");
	}
	activeProxyUrl = normalizedProxyUrl;
	activeProxyLoopbackMode = loopbackMode;
	activeProxyTlsOptions = proxyTls;
	return {
		proxyUrl: activeProxyUrl,
		stopped: false
	};
}
/** Stops the active proxy registration and clears its process-wide state. */
function stopActiveManagedProxyRegistration(registration) {
	if (registration.stopped) return;
	registration.stopped = true;
	activeProxyUrl = void 0;
	activeProxyLoopbackMode = void 0;
	activeProxyTlsOptions = void 0;
}
/** Returns local loopback policy from in-process state or inherited proxy env. */
function getActiveManagedProxyLoopbackMode() {
	return activeProxyLoopbackMode ?? readInheritedActiveManagedProxyLoopbackMode();
}
/** Returns the in-process managed proxy URL, if this process owns the proxy. */
function getActiveManagedProxyUrl() {
	return activeProxyUrl;
}
/** Returns the active managed proxy TLS options used by undici/proxyline dispatchers. */
function getActiveManagedProxyTlsOptions() {
	return activeProxyTlsOptions;
}
//#endregion
export { stopActiveManagedProxyRegistration as a, registerActiveManagedProxyUrl as i, getActiveManagedProxyTlsOptions as n, getActiveManagedProxyUrl as r, getActiveManagedProxyLoopbackMode as t };
