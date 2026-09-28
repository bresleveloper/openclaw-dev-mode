import { a as normalizeSignalTransportUrl } from "./transport-url-CAC0JcuI.mjs";
//#region extensions/signal/src/transport-policy.ts
const DEFAULT_SIGNAL_MANAGED_NATIVE_PORT = 8080;
const DEFAULT_SIGNAL_MANAGED_NATIVE_HOST = "127.0.0.1";
const SIGNAL_LOOPBACK_HOST_ALIASES = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"::1"
]);
function normalizeSignalEndpointHost(hostname) {
	const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");
	return normalized.endsWith(".") ? normalized.slice(0, -1) : normalized;
}
function isSignalLocalEndpointHost(hostname) {
	return hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "::1" || hostname === "::" || hostname === "0.0.0.0" || /^127(?:\.\d{1,3}){3}$/.test(hostname) || /^::ffff:(?:127(?:\.\d{1,3}){3}|7f[0-9a-f]{2}:[0-9a-f]{1,4})$/.test(hostname);
}
function isValidSignalManagedNativePort(value) {
	return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 65535;
}
function allocateSignalManagedNativePort(params) {
	if (params.preferredPort !== void 0) {
		if (!isValidSignalManagedNativePort(params.preferredPort)) throw new Error("Signal managed native port must be an integer between 1 and 65535.");
		if (!params.reservedPorts.has(params.preferredPort)) return params.preferredPort;
	}
	let port = DEFAULT_SIGNAL_MANAGED_NATIVE_PORT;
	while (port <= 65535 && params.reservedPorts.has(port)) port += 1;
	if (port > 65535) throw new Error("No available Signal managed native port remains.");
	return port;
}
function resolveLocalSignalTransportPort(baseUrl) {
	try {
		const parsed = new URL(baseUrl);
		if (!isSignalLocalEndpointHost(normalizeSignalEndpointHost(parsed.hostname))) return;
		if (parsed.port) return Number.parseInt(parsed.port, 10);
		return parsed.protocol === "https:" ? 443 : 80;
	} catch {
		return;
	}
}
function isSignalManagedNativeConnectionUrlForBind(transport) {
	if (transport.kind !== "managed-native" || !transport.url) return false;
	const connectionUrl = new URL(transport.url);
	if (connectionUrl.protocol !== "http:") return false;
	if ((connectionUrl.port ? Number.parseInt(connectionUrl.port, 10) : 80) !== (transport.httpPort ?? 8080)) return false;
	const connectionHost = normalizeSignalEndpointHost(connectionUrl.hostname);
	const bindHost = normalizeSignalEndpointHost(transport.httpHost ?? "127.0.0.1");
	if (connectionHost === bindHost) return true;
	if (bindHost === "0.0.0.0") return connectionHost === "localhost" || /^127(?:\.\d{1,3}){3}$/.test(connectionHost);
	if (bindHost === "::") return connectionHost === "localhost" || connectionHost === "::1";
	return bindHost === "localhost" && SIGNAL_LOOPBACK_HOST_ALIASES.has(connectionHost) || connectionHost === "localhost" && SIGNAL_LOOPBACK_HOST_ALIASES.has(bindHost);
}
function assignSignalManagedNativePort(transport, httpPort) {
	if (!isValidSignalManagedNativePort(httpPort)) throw new Error("Signal managed native port must be an integer between 1 and 65535.");
	const connectionUrlValue = transport.url;
	if (!connectionUrlValue || !isSignalManagedNativeConnectionUrlForBind(transport)) return {
		...transport,
		httpPort
	};
	const connectionUrl = new URL(connectionUrlValue);
	connectionUrl.port = String(httpPort);
	return {
		...transport,
		url: normalizeSignalTransportUrl(connectionUrl.toString()),
		httpPort
	};
}
//#endregion
export { isSignalManagedNativeConnectionUrlForBind as a, assignSignalManagedNativePort as i, DEFAULT_SIGNAL_MANAGED_NATIVE_PORT as n, isValidSignalManagedNativePort as o, allocateSignalManagedNativePort as r, resolveLocalSignalTransportPort as s, DEFAULT_SIGNAL_MANAGED_NATIVE_HOST as t };
